export function normalizePrecision(value?: number, fallback = 2) {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  const rounded = Math.floor(n);
  if (rounded < 0) return fallback;
  return Math.min(8, rounded);
}

export function formatPrice(
  value?: string | number | null,
  precision?: number,
  fallback = "--"
) {
  if (value === undefined || value === null) return fallback;
  if (value === "--") return fallback;
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  const digits = normalizePrecision(precision);
  return n.toFixed(digits);
}

export function splitPrice(
  value?: string | number | null,
  precision?: number
) {
  const formatted = formatPrice(value, precision);
  if (formatted === "--") {
    return { int: "--", big: "", small: "" };
  }

  const digits = normalizePrecision(precision);
  const [intPart, decimalPart = ""] = formatted.split(".");
  const padded = decimalPart.padEnd(digits, "0");
  const bigSize = Math.min(2, digits);

  return {
    int: intPart,
    big: padded.slice(0, bigSize),
    small: padded.slice(bigSize),
  };
}
