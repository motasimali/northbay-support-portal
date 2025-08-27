const nf = new Intl.NumberFormat(undefined);

// turn 12000 -> 12,000
export function formatNumber(n) {
  if (n === null || n === undefined || Number.isNaN(n)) return "";
  return nf.format(n);
}