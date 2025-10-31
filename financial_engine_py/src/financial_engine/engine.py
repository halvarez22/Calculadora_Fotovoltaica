from typing import List

from .models import FinancialInputs, FinancialOutputs, ValidationIssue
from .pipeline import (
    validate_inputs,
    estimate_yearly_production,
    estimate_tariffs,
    estimate_costs_and_savings,
    build_cashflow,
    compute_kpis,
)


class FinancialEngine:
    def __init__(self) -> None:
        pass

    def calculate(self, inputs: FinancialInputs) -> FinancialOutputs:
        issues: List[ValidationIssue] = validate_inputs(inputs)

        energy, degr = estimate_yearly_production(inputs)
        tarifas_e, tarifas_d = estimate_tariffs(inputs)
        projections, base_flows = estimate_costs_and_savings(inputs, energy, tarifas_e, tarifas_d)
        cashflow = build_cashflow(inputs, base_flows)
        kpis = compute_kpis(inputs, cashflow, energy, projections)

        return FinancialOutputs(
            inputs_normalizados=inputs,
            issues=issues,
            projections=projections,
            cashflow=cashflow,
            kpis=kpis,
            tablas_intermedias={
                "degradacion": degr,
                "tarifas_energia": tarifas_e,
                "tarifas_demanda": tarifas_d,
            },
        )


