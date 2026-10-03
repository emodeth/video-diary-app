export function getStartFromPosition(locationX: number, width: number, maxStart: number) {
  if (width <= 0) return 0;
  const progress = Math.max(0, Math.min(1, locationX / width));
  return Math.round(progress * maxStart);
}
