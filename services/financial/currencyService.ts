export type CurrencyCode = 'MXN' | 'USD' | 'EUR';

export interface CurrencyInfo {
  code: CurrencyCode;
  symbol: string;
  name: string;
}

export const CURRENCIES: Record<CurrencyCode, CurrencyInfo> = {
  MXN: { code: 'MXN', symbol: '$', name: 'Pesos Mexicanos' },
  USD: { code: 'USD', symbol: 'US$', name: 'Dólares Americanos' },
  EUR: { code: 'EUR', symbol: '€', name: 'Euros' },
};

// Tasas de cambio (valores aproximados, se pueden actualizar con API)
// Base: MXN = 1.0
const EXCHANGE_RATES: Record<CurrencyCode, Record<CurrencyCode, number>> = {
  MXN: { MXN: 1.0, USD: 1 / 18.5, EUR: 1 / 20.0 }, // Ejemplo: 1 MXN = ~0.054 USD
  USD: { MXN: 18.5, USD: 1.0, EUR: 18.5 / 20.0 },   // Ejemplo: 1 USD = ~18.5 MXN
  EUR: { MXN: 20.0, USD: 20.0 / 18.5, EUR: 1.0 },   // Ejemplo: 1 EUR = ~20.0 MXN
};

export function convertCurrency(
  amount: number,
  from: CurrencyCode,
  to: CurrencyCode
): number {
  if (from === to) return amount;
  if (!EXCHANGE_RATES[from] || !EXCHANGE_RATES[from][to]) {
    console.warn(`No hay tasa de cambio de ${from} a ${to}, usando 1:1`);
    return amount;
  }
  return amount * EXCHANGE_RATES[from][to];
}

export function formatCurrency(
  amount: number | null | undefined,
  currency: CurrencyCode,
  options?: Intl.NumberFormatOptions
): string {
  if (amount === null || amount === undefined || isNaN(amount)) return 'N/A';
  
  const info = CURRENCIES[currency];
  const defaultOptions: Intl.NumberFormatOptions = {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    ...options,
  };
  
  try {
    return new Intl.NumberFormat('es-MX', defaultOptions).format(amount);
  } catch (e) {
    // Fallback si el formato falla
    return `${info.symbol} ${amount.toLocaleString('es-MX', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }
}

export async function fetchLatestRates(): Promise<Record<CurrencyCode, Record<CurrencyCode, number>>> {
  // TODO: En el futuro, obtener tasas de cambio desde una API real
  // Por ejemplo: https://api.exchangerate-api.com/v4/latest/MXN
  return EXCHANGE_RATES;
}

