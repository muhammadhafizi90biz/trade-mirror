export type Position = "long" | "short";

export const DEFAULT_TICK_SIZE_CENTS = 1;

export function calculateTicks(
  position: Position,
  entryPrice: number,
  exitPrice: number,
  tickSizeCents: number = DEFAULT_TICK_SIZE_CENTS,
) {
  const priceDifference = position === "short" ? entryPrice - exitPrice : exitPrice - entryPrice;
  const priceMoveCents = priceDifference * 100;
  return Math.round(priceMoveCents / tickSizeCents);
}
