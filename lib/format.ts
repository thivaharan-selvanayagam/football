export function formatRs(amount: number) {
  const hasCents = Math.abs(amount - Math.round(amount)) > 0.001;
  if (hasCents) {
    return (
      "$" +
      amount.toLocaleString("en-CA", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    );
  }
  return "$" + Math.round(amount).toLocaleString("en-CA") + ".00";
}
