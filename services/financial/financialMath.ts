// Utilidades matemáticas financieras

export function npv(rate: number, cashflows: number[]): number {
  if (!isFinite(rate)) return NaN;
  return cashflows.reduce((acc, cf, i) => acc + cf / Math.pow(1 + rate, i), 0);
}

export function irr(cashflows: number[], guess = 0.1): number | null {
  // Bisección simple entre -0.99 y 1.0
  let low = -0.99;
  let high = 1.0;
  let fLow = npv(low, cashflows);
  let fHigh = npv(high, cashflows);
  if (isNaN(fLow) || isNaN(fHigh)) return null;
  if (fLow * fHigh > 0) return null; // no cambia de signo
  for (let i = 0; i < 64; i++) {
    const mid = (low + high) / 2;
    const fMid = npv(mid, cashflows);
    if (Math.abs(fMid) < 1e-6) return mid;
    if (fLow * fMid < 0) {
      high = mid;
      fHigh = fMid;
    } else {
      low = mid;
      fLow = fMid;
    }
  }
  return (low + high) / 2;
}

export function paybackYears(cashflows: number[]): number | null {
  let acc = 0;
  for (let i = 0; i < cashflows.length; i++) {
    acc += cashflows[i];
    if (acc >= 0) return i; // año en que cruza 0
  }
  return null;
}

export function discountedPaybackYears(rate: number, cashflows: number[]): number | null {
  let acc = 0;
  for (let i = 0; i < cashflows.length; i++) {
    acc += cashflows[i] / Math.pow(1 + rate, i);
    if (acc >= 0) return i;
  }
  return null;
}

export function lcoe(totalDiscountedCost: number, totalDiscountedEnergyKwh: number): number | null {
  if (totalDiscountedEnergyKwh <= 0) return null;
  return totalDiscountedCost / totalDiscountedEnergyKwh;
}


