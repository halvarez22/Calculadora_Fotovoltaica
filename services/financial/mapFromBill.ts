import { BillData } from '../../types';
import { ProjectParams } from './financialTypes';

const parseMoney = (val: string | undefined): number | null => {
  if (!val) return null;
  const cleaned = val.replace(/[^0-9.,-]/g, '').replace(/,/g, '');
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
};

export function mapBillToParams(bill: BillData): ProjectParams {
  const totalPagar = bill.billingSummary.find(i => i.key.toUpperCase().includes('TOTAL'))?.value;
  const monthlyCost = parseMoney(totalPagar);
  const annualCost = monthlyCost != null ? monthlyCost * 12 : null;

  const consumoAnual = bill.historicalConsumption?.reduce((s, r) => s + (Number(r.consumptionKWh) || 0), 0) || null;
  const demandaMax = bill.historicalConsumption?.reduce((m, r) => Math.max(m, Number(r.demandKW) || 0), 0) || null;

  const defaults: ProjectParams = {
    tarifa: 'OM',
    consumoKwhAnual: consumoAnual,
    demandaKw: demandaMax,
    costoActualAnual: annualCost,
    diasConsiderados: null,

    kWp: 500, // valor por defecto editable en UI futura
    performanceRatio: 0.82,
    degradacionAnual: 0.007,
    capex: 8000000,
    opexAnual: 80000,

    tasaDescuento: 0.10,
    inflacionOM: 0.03,
    escaladoTarifaCfe: 0.07,

    vidaProyecto: 25,
    modo: 'CAPEX',
    costoPpaInicial: null,
    escaladorPpaAnual: 0.02
  };

  return defaults;
}


