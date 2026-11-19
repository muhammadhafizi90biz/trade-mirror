export type Position = "long" | "short";

export const DEFAULT_TICK_SIZE = 0.01;
export const DEFAULT_TICK_FRACTION_DENOMINATOR = 8;

export function parsePrice(value: string, fractionDenominator: number = DEFAULT_TICK_FRACTION_DENOMINATOR) {
  const trimmed = value.trim();

  if (trimmed.length === 0) {
    return Number.NaN;
  }

  const quoteMatch = /^(\d+(?:\.\d+)?)'(\d+)$/.exec(trimmed);

  if (quoteMatch) {
    const whole = Number(quoteMatch[1]);
    const fraction = Number(quoteMatch[2]);

    if (Number.isNaN(whole) || Number.isNaN(fraction)) {
      return Number.NaN;
    }

    return whole + fraction / fractionDenominator;
  }

  const normalized = trimmed.replace(/,/g, "");
  return Number(normalized);
}

export function calculateTicks(
  position: Position,
  entryPrice: number,
  exitPrice: number,
  tickSize: number = DEFAULT_TICK_SIZE,
) {
  const priceDifference = position === "short" ? entryPrice - exitPrice : exitPrice - entryPrice;
  return Math.round(priceDifference / tickSize);
}
