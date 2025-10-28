// Fix: Removed self-import which was causing declaration conflicts.

export interface KeyValue {
  key: string;
  value: string;
}

export interface HistoricalConsumptionData {
  period: string;
  demandKW: number;
  consumptionKWh: number;
  powerFactor: string;
  loadFactor: string;
  averagePrice: string;
}

export interface BillData {
  customerInfo: KeyValue[];
  billingSummary: KeyValue[];
  consumptionDetails: Record<string, string>[];
  marketCosts: Record<string, string>[];
  paymentBreakdown: Record<string, string>[];
  historicalConsumption: HistoricalConsumptionData[];
}

export interface HistoryEntry {
  id: number;
  date: string;
  customerName: string;
  serviceNumber: string;
  totalAmount: string;
  billingPeriod: string;
  fullData: BillData;
}