export function formatRs(amount: number) {
  return "Rs " + Math.round(amount).toLocaleString("en-IN");
}
