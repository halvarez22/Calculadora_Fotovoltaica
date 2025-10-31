from pydantic import BaseModel, Field, RootModel, ValidationError
from typing import List, Optional, Literal, Any, Dict


class ValidationIssue(BaseModel):
    field: str
    message: str
    level: Literal["error", "warning", "info"] = "info"


class FinancialInputs(BaseModel):
    # Datos del recibo/cliente
    consumo_kwh_mensual: Optional[float] = Field(default=None, ge=0)
    demanda_kw: Optional[float] = Field(default=None, ge=0)
    tarifa_cfe: Literal["OM", "HM", "PDBT", "GDMTH", "Otro"] = "OM"
    costo_total_actual: Optional[float] = Field(default=None, ge=0)
    costo_energia_kwh: Optional[float] = Field(default=None, ge=0)
    costo_demanda_kw: Optional[float] = Field(default=None, ge=0)
    dias_facturados: Optional[int] = Field(default=None, ge=1, le=45)
    periodo_facturacion: Optional[str] = None

    # Parámetros financieros/operativos
    kWp: float = Field(..., gt=0)
    performance_ratio: float = Field(0.82, gt=0, lt=1)
    degradacion_solar_anual: float = Field(0.007, ge=0, le=0.03)
    capex: Optional[float] = Field(default=None, ge=0)
    opex_anual: float = Field(0.0, ge=0)
    vida_proyecto_anos: int = Field(25, ge=5, le=40)

    tasa_descuento: float = Field(0.10, ge=-0.5, le=1)
    inflacion_om: float = Field(0.03, ge=-0.2, le=0.5)
    tasa_actualizacion_tarifa_anual: float = Field(0.07, ge=-0.2, le=0.5)

    modo: Literal["CAPEX", "PPA"] = "CAPEX"
    costo_ppa_inicial: Optional[float] = Field(default=None, ge=0)
    escalador_ppa_anual: float = Field(0.02, ge=-0.2, le=0.5)

    moneda: Literal["MXN", "USD", "EUR"] = Field(default="MXN", description="Moneda para todos los valores monetarios")

    irradiacion_mensual: Optional[List[float]] = None  # 12 valores normalizados


class AnnualProjection(BaseModel):
    year: int
    energia_generada_kwh: float
    tarifa_energia: float
    tarifa_demanda: float
    costo_sin_sistema: float
    costo_con_sistema: float
    ahorro: float
    opex: float
    ppa_kwh: Optional[float] = None
    factor_degradacion: float


class CashflowYear(BaseModel):
    year: int
    flujo: float
    flujo_descontado: float
    acumulado: float


class FinancialKPIs(BaseModel):
    van: Optional[float]
    tir: Optional[float]
    payback_simple: Optional[int]
    payback_descontado: Optional[int]
    roi: Optional[float]
    lcoe: Optional[float]


class FinancialOutputs(BaseModel):
    inputs_normalizados: FinancialInputs
    issues: List[ValidationIssue]
    projections: List[AnnualProjection]
    cashflow: List[CashflowYear]
    kpis: FinancialKPIs
    tablas_intermedias: Dict[str, Any] = {}


