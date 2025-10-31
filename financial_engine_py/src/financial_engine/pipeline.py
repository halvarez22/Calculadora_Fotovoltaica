from __future__ import annotations

from dataclasses import dataclass
from typing import List, Protocol, Tuple

import numpy as np
import numpy_financial as npf

from .models import (
    FinancialInputs,
    FinancialOutputs,
    ValidationIssue,
    AnnualProjection,
    CashflowYear,
    FinancialKPIs,
)


def _default_irradiation_profile() -> List[float]:
    # Perfil mensual normalizado (~12 unidades al año)
    return [1.0, 0.95, 1.05, 1.1, 1.15, 1.2, 1.2, 1.15, 1.05, 1.0, 0.95, 0.9]


@dataclass
class Context:
    inputs: FinancialInputs
    issues: List[ValidationIssue]


class PricingStrategy(Protocol):
    def compute_year_cost(self, year_idx: int, kwh_generated: float, opex_year: float, costo_base_sin: float) -> float:
        ...


class CAPEXStrategy:
    def __init__(self, inputs: FinancialInputs) -> None:
        self.inputs = inputs

    def compute_year_cost(self, year_idx: int, kwh_generated: float, opex_year: float, costo_base_sin: float) -> float:
        # En CAPEX, el costo con sistema es el OPEX anual (la inversión va en año 0, en cashflow)
        return max(opex_year, 0.0)


class PPAStrategy:
    def __init__(self, inputs: FinancialInputs) -> None:
        self.inputs = inputs

    def compute_year_cost(self, year_idx: int, kwh_generated: float, opex_year: float, costo_base_sin: float) -> float:
        ppa0 = float(self.inputs.costo_ppa_inicial or 0.0)
        ppa_y = ppa0 * ((1 + self.inputs.escalador_ppa_anual) ** year_idx)
        return ppa_y * kwh_generated + max(opex_year, 0.0)


def validate_inputs(inputs: FinancialInputs) -> List[ValidationIssue]:
    issues: List[ValidationIssue] = []
    if inputs.kWp <= 0:
        issues.append(ValidationIssue(field="kWp", message="kWp debe ser > 0", level="error"))
    if not (0.5 <= inputs.performance_ratio <= 0.95):
        issues.append(ValidationIssue(field="performance_ratio", message="PR fuera de rango 0.5–0.95", level="warning"))
    if not (0 <= inputs.degradacion_solar_anual <= 0.03):
        issues.append(ValidationIssue(field="degradacion_solar_anual", message="Degradación fuera de rango (0–3%)", level="warning"))
    if inputs.modo == "CAPEX" and (inputs.capex is None or inputs.capex <= 0):
        issues.append(ValidationIssue(field="capex", message="CAPEX requerido en modo CAPEX", level="error"))
    return issues


def estimate_yearly_production(inputs: FinancialInputs) -> Tuple[List[float], List[float]]:
    profile = inputs.irradiacion_mensual or _default_irradiation_profile()
    base_monthly = inputs.kWp * inputs.performance_ratio
    years = inputs.vida_proyecto_anos
    energy: List[float] = []
    degr_factors: List[float] = []
    for y in range(years):
        degr = (1 - inputs.degradacion_solar_anual) ** y
        annual_kwh = float(sum(profile)) * base_monthly * degr
        energy.append(annual_kwh)
        degr_factors.append(degr)
    return energy, degr_factors


def estimate_tariffs(inputs: FinancialInputs) -> Tuple[List[float], List[float]]:
    years = inputs.vida_proyecto_anos
    e0 = float(inputs.costo_energia_kwh or 0.0)
    d0 = float(inputs.costo_demanda_kw or 0.0)
    factor = 1 + inputs.tasa_actualizacion_tarifa_anual
    energia = [e0 * (factor ** y) for y in range(years)]
    demanda = [d0 * (factor ** y) for y in range(years)]
    return energia, demanda


def estimate_costs_and_savings(inputs: FinancialInputs, energy: List[float], tarifas_e: List[float], tarifas_d: List[float]) -> Tuple[List[AnnualProjection], List[float]]:
    years = inputs.vida_proyecto_anos
    opex0 = inputs.opex_anual
    infl = 1 + inputs.inflacion_om
    consumo_anual = float((inputs.consumo_kwh_mensual or 0.0) * 12.0)
    demanda_kw = float(inputs.demanda_kw or 0.0)
    projections: List[AnnualProjection] = []
    base_flows: List[float] = []

    strategy: PricingStrategy = CAPEXStrategy(inputs) if inputs.modo == "CAPEX" else PPAStrategy(inputs)

    for y in range(years):
        opex_y = opex0 * (infl ** y)
        tarifa_e = tarifas_e[y]
        tarifa_d = tarifas_d[y]

        costo_base_sin = consumo_anual * tarifa_e + demanda_kw * tarifa_d
        kwh_gen = energy[y]

        costo_con = strategy.compute_year_cost(y, kwh_gen, opex_y, costo_base_sin)
        ahorro = max(costo_base_sin - costo_con, 0.0)

        projections.append(
            AnnualProjection(
                year=y + 1,
                energia_generada_kwh=kwh_gen,
                tarifa_energia=tarifa_e,
                tarifa_demanda=tarifa_d,
                costo_sin_sistema=costo_base_sin,
                costo_con_sistema=costo_con,
                ahorro=ahorro,
                opex=opex_y,
                ppa_kwh=None,
                factor_degradacion=(1 - inputs.degradacion_solar_anual) ** y,
            )
        )
        base_flows.append(ahorro - opex_y)

    return projections, base_flows


def build_cashflow(inputs: FinancialInputs, base_flows: List[float]) -> List[CashflowYear]:
    flows: List[float] = []
    if inputs.modo == "CAPEX":
        flows.append(-float(inputs.capex or 0.0))
    else:
        flows.append(0.0)
    flows.extend(base_flows)

    cashflow: List[CashflowYear] = []
    acc = 0.0
    for i, f in enumerate(flows):
        acc += f
        fd = f / ((1 + inputs.tasa_descuento) ** i)
        cashflow.append(CashflowYear(year=i, flujo=f, flujo_descontado=fd, acumulado=acc))
    return cashflow


def compute_kpis(inputs: FinancialInputs, cashflow: List[CashflowYear], energy: List[float], projections: List[AnnualProjection]) -> FinancialKPIs:
    import math
    flows = [y.flujo for y in cashflow]
    
    # VAN con validación de NaN
    try:
        van = float(npf.npv(inputs.tasa_descuento, flows))
        if math.isnan(van) or math.isinf(van):
            van = None
    except Exception:
        van = None
    
    # TIR con validación de NaN
    try:
        if len(flows) >= 2:
            tir = float(npf.irr(flows))
            if math.isnan(tir) or math.isinf(tir):
                tir = None
        else:
            tir = None
    except Exception:
        tir = None

    # Paybacks
    pb = next((i for i, y in enumerate(cashflow) if y.acumulado >= 0), None)
    acc_disc = 0.0
    dpb = None
    for i, y in enumerate(cashflow):
        acc_disc += y.flujo_descontado
        if acc_disc >= 0 and dpb is None:
            dpb = i
            break

    # LCOE con validación de NaN
    import math
    try:
        discounted_cost = 0.0
        if inputs.modo == "CAPEX":
            discounted_cost += float(inputs.capex or 0.0)
        for idx, p in enumerate(projections):
            discounted_cost += p.opex / ((1 + inputs.tasa_descuento) ** (idx + 1))
        discounted_energy = 0.0
        for idx, kwh in enumerate(energy):
            discounted_energy += kwh / ((1 + inputs.tasa_descuento) ** (idx + 1))
        if discounted_energy > 0:
            lcoe = discounted_cost / discounted_energy
            if math.isnan(lcoe) or math.isinf(lcoe):
                lcoe = None
        else:
            lcoe = None
    except Exception:
        lcoe = None

    # ROI simple con validación de NaN
    try:
        total_ahorro = sum(p.ahorro for p in projections)
        total_opex = sum(p.opex for p in projections)
        if inputs.modo == "CAPEX" and (inputs.capex or 0) > 0:
            roi = (total_ahorro - total_opex) / float(inputs.capex)
            if math.isnan(roi) or math.isinf(roi):
                roi = None
        else:
            roi = None
    except Exception:
        roi = None

    return FinancialKPIs(
        van=van,
        tir=tir,
        payback_simple=pb,
        payback_descontado=dpb,
        roi=roi,
        lcoe=lcoe,
    )


