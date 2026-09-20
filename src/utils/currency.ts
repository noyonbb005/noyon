export const BDT_SYMBOL = '৳';

/**
 * Format any numeric value to Bangladeshi Taka format (e.g. ৳3499)
 * Handles integer and legacy float conversion ($34.99 -> ৳3499)
 */
export function formatBDT(amount: number | string | undefined | null): string {
  if (amount === undefined || amount === null) return '৳0';
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return '৳0';
  
  // If the number looks like a legacy decimal (e.g. 34.99 or 49.99), scale to BDT
  const normalized = (num > 0 && num < 150 && !Number.isInteger(num))
    ? Math.round(num * 100)
    : Math.round(num);

  return `৳${normalized}`;
}

/**
 * Normalizes a price number to integer BDT (e.g. 34.99 -> 3499)
 */
export function normalizeToBDT(val: number | string | undefined | null): number {
  if (val === undefined || val === null) return 0;
  const num = typeof val === 'string' ? parseFloat(val) : val;
  if (isNaN(num)) return 0;
  if (num > 0 && num < 150 && !Number.isInteger(num)) {
    return Math.round(num * 100);
  }
  return Math.round(num);
}
