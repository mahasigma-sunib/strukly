export function formatIDRDisplay(
  amount: number,
  currency = "IDR",
  locale = "id-ID"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  })
    .formatToParts(amount)
    .filter((part) => part.type !== "literal")
    .map((part) => part.value)
    .join("");
}
