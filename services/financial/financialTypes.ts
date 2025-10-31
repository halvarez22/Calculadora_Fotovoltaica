// Tipos para el Módulo 1: Motor Financiero

export interface ProjectParams {
  tarifa: string; // ej. "OM"
  consumoKwhAnual: number | null;
  demandaKw: number | null;
  costoActualAnual: number | null;
  diasConsiderados: number | null;

  kWp: number | null;
  performanceRatio: number; // 0.6 - 0.9
  degradacionAnual: number; // 0.0 - 0.02
  capex: number | null;
  opexAnual: number | null;

  tasaDescuento: number; // 0.1 = 10%
  inflacionOM: number; // inflacion O&M
  escaladoTarifaCfe: number; // 0.07 = 7%

  vidaProyecto: number; // años
  modo: 'CAPEX' | 'PPA';
  costoPpaInicial: number | null; // si modo PPA
  escaladorPpaAnual: number; // 0.02 = 2%
}

export interface MonthlyProduction {
  monthIndex: number; // 1..12
  kwh: number;
}

export interface AnnualProduction {
  year: number; // 1..vidaProyecto
  kwh: number;
}

export interface AnnualCostBreakdown {
  year: number;
  costoSinSistema: number; // escenario base con CFE
  costoConSistema: number; // CAPEX/PPA + OPEX/Costos
  ahorro: number; // sin - con
  opex: number;
}

export interface CashflowYear {
  year: number; // 0 es inversión
  flujo: number; // flujo nominal
  flujoDescontado: number; // flujo/(1+t)^year
  acumulado: number; // acumulado nominal
}

export interface FinancialKPIs {
  roi: number | null; // retorno simple
  tir: number | null; // IRR
  van: number; // NPV
  paybackSimple: number | null; // años
  paybackDescontado: number | null; // años
  lcoe: number | null; // costo nivelado energía ($/kWh)
}

export interface FinancialResult {
  inputs: ProjectParams;
  production: {
    annual: AnnualProduction[];
    totalKwh: number;
  };
  annualCosts: AnnualCostBreakdown[];
  cashflow: CashflowYear[];
  kpis: FinancialKPIs;
  audit: string[]; // trazas de cálculo
}

export interface ValidationIssue {
  field: string;
  message: string;
  level: 'error' | 'warning';
}

export interface CalculationContext {
  params: ProjectParams;
  issues: ValidationIssue[];
  log: (m: string) => void;
}


