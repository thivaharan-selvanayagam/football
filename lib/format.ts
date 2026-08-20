export function formatRs(amount: number) {
  return "$" + Math.round(amount).toLocaleString("en-CA")+".00";
}