export function formatRs(amount: number) {
  return "CAD " + Math.round(amount).toLocaleString("en-CA");
}