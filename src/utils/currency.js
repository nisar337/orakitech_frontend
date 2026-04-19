export const PKR_RATE = 1;

export function formatPkrFromUsd(amountUsd) {
  const n = Number(amountUsd);
  if (!Number.isFinite(n)) return "Rs. —";
  return `Rs. ${(n * PKR_RATE).toLocaleString("en-IN")}`;
}
