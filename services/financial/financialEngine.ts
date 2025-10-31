import { ProjectParams, FinancialResult, AnnualProduction, AnnualCostBreakdown, CashflowYear, FinancialKPIs, CalculationContext } from './financialTypes';
import { npv, irr, paybackYears, discountedPaybackYears, lcoe } from './financialMath';

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

export function validateParams(params: ProjectParams): { ok: boolean; issues: CalculationContext['issues'] } {
  const issues: CalculationContext['issues'] = [];

  if (!params.kWp || params.kWp <= 0) issues.push({ field: 'kWp', message: 'Potencia (kWp) debe ser > 0', level: 'error' });
  if (params.performanceRatio < 0.5 || params.performanceRatio > 0.9) issues.push({ field: 'performanceRatio', message: 'PR fuera de rango esperado (0.5–0.9)', level: 'warning' });
  if (params.degradacionAnual < 0 || params.degradacionAnual > 0.02) issues.push({ field: 'degradacionAnual', message: 'Degradación fuera de rango (0–2%)', level: 'warning' });
  if (!params.capex || params.capex <= 0) issues.push({ field: 'capex', message: 'CAPEX debe ser > 0', level: 'error' });
  if (params.opexAnual === null || params.opexAnual === undefined) issues.push({ field: 'opexAnual', message: 'OPEX anual requerido', level: 'warning' });
  if (!params.vidaProyecto || params.vidaProyecto < 5) issues.push({ field: 'vidaProyecto', message: 'Vida de proyecto muy baja (<5)', level: 'warning' });
  if (params.modo === 'PPA' && (!params.costoPpaInicial || params.costoPpaInicial <= 0)) issues.push({ field: 'costoPpaInicial', message: 'Costo PPA inicial requerido', level: 'error' });

  return { ok: issues.find(i => i.level === 'error') === undefined, issues };
}

function defaultIrradiationProfile(): number[] {
  // Perfil mensual unitario que suma ~12 (normalizado a 12 unidades para un año)
  return [1.0, 0.95, 1.05, 1.1, 1.15, 1.2, 1.2, 1.15, 1.05, 1.0, 0.95, 0.9];
}

function estimateYearlyProductionKwh(params: ProjectParams, log: (m: string) => void): AnnualProduction[] {
  const months = defaultIrradiationProfile();
  const baseMonthly = params.kWp! * params.performanceRatio; // kWh/mes por unidad de irradiación
  const years: AnnualProduction[] = [];

  for (let y = 1; y <= params.vidaProyecto; y++) {
    const degr = Math.pow(1 - params.degradacionAnual, y - 1);
    const kwhYear = months.reduce((acc, f) => acc + baseMonthly * f, 0) * degr;
    years.push({ year: y, kwh: kwhYear });
  }
  log(`Producción anual estimada (año1): ${years[0]?.kwh?.toFixed(2)} kWh`);
  return years;
}

function estimateAnnualCosts(params: ProjectParams, production: AnnualProduction[], log: (m: string) => void): AnnualCostBreakdown[] {
  const out: AnnualCostBreakdown[] = [];

  const costoBaseAnual0 = params.costoActualAnual ?? 0;
  const opexBase = params.opexAnual ?? 0;

  for (let y = 1; y <= params.vidaProyecto; y++) {
    const idx = y - 1;
    const tarifaFactor = Math.pow(1 + params.escaladoTarifaCfe, idx);
    const costoSin = costoBaseAnual0 * tarifaFactor;

    // costoCon: en CAPEX = OPEX inflacionado; en PPA = PPA escalado * kWh generado
    const opexYear = opexBase * Math.pow(1 + params.inflacionOM, idx);
    let costoCon: number;
    if (params.modo === 'PPA') {
      const ppa = params.costoPpaInicial! * Math.pow(1 + params.escaladorPpaAnual, idx);
      costoCon = ppa * production[idx].kwh + opexYear;
    } else {
      costoCon = opexYear; // CAPEX ya se refleja en flujo del año 0
    }

    const ahorro = Math.max(costoSin - costoCon, 0);
    out.push({ year: y, costoSinSistema: costoSin, costoConSistema: costoCon, ahorro, opex: opexYear });
  }
  log(`Costo base año 1 (sin sistema): ${out[0]?.costoSinSistema?.toFixed(2)}`);
  return out;
}

export function calculateFinancials(params: ProjectParams): FinancialResult {
  const issues: CalculationContext['issues'] = [];
  const logMessages: string[] = [];
  const log = (m: string) => logMessages.push(m);

  // Validación básica
  const v = validateParams(params);
  issues.push(...v.issues);
  if (!v.ok) {
    log('Parámetros con errores críticos. Se devuelve cálculo parcial.');
  }

  // Producción anual
  const production = estimateYearlyProductionKwh(params, log);
  const totalKwh = production.reduce((a, p) => a + p.kwh, 0);

  // Costos anuales y ahorros
  const annualCosts = estimateAnnualCosts(params, production, log);

  // Cashflow: año 0 inversión (CAPEX si CAPEX), años 1..n = ahorros - opex (CAPEX ya en año 0)
  const flows: number[] = [];
  if (params.modo === 'CAPEX') flows.push(-(params.capex ?? 0)); else flows.push(0);
  for (let y = 1; y <= params.vidaProyecto; y++) {
    flows.push(annualCosts[y - 1].ahorro - annualCosts[y - 1].opex);
  }

  const cashflow: CashflowYear[] = [];
  let acc = 0;
  for (let i = 0; i < flows.length; i++) {
    acc += flows[i];
    const fd = flows[i] / Math.pow(1 + params.tasaDescuento, i);
    cashflow.push({ year: i, flujo: flows[i], flujoDescontado: fd, acumulado: acc });
  }

  // KPIs
  const van = npv(params.tasaDescuento, flows);
  const tir = irr(flows);
  const pb = paybackYears(flows);
  const dpb = discountedPaybackYears(params.tasaDescuento, flows);

  // LCOE: (CAPEX + OPEX descontado) / (Energía descontada)
  const discountedCost = cashflow.reduce((s, y, i) => i === 0 && params.modo === 'CAPEX' ? s + (-y.flujo) : s, 0)
    + annualCosts.reduce((s, y, idx) => s + y.opex / Math.pow(1 + params.tasaDescuento, idx + 1), 0);
  const discountedEnergy = production.reduce((s, p, idx) => s + p.kwh / Math.pow(1 + params.tasaDescuento, idx + 1), 0);
  const lcoeValue = lcoe(discountedCost, discountedEnergy);

  const roi = (params.modo === 'CAPEX' && params.capex && params.capex > 0)
    ? (annualCosts.reduce((s, a) => s + a.ahorro, 0) - annualCosts.reduce((s, a) => s + a.opex, 0)) / params.capex
    : null;

  const kpis: FinancialKPIs = {
    roi: roi,
    tir: tir,
    van: van,
    paybackSimple: pb,
    paybackDescontado: dpb,
    lcoe: lcoeValue,
  };

  return {
    inputs: params,
    production: { annual: production, totalKwh: totalKwh },
    annualCosts,
    cashflow,
    kpis,
    audit: logMessages,
  };
}


