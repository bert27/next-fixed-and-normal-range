export const addEventListeners = (
  moveHandler: (event: MouseEvent | TouchEvent) => void,
  upHandler: () => void
) => {
  document.addEventListener("mousemove", moveHandler as EventListener);
  document.addEventListener("mouseup", upHandler);
  document.addEventListener("touchmove", moveHandler as EventListener);
  document.addEventListener("touchend", upHandler);
};

export const removeEventListeners = (
  moveHandler: (event: MouseEvent | TouchEvent) => void,
  upHandler: () => void
) => {
  document.removeEventListener("mousemove", moveHandler as EventListener);
  document.removeEventListener("mouseup", upHandler);
  document.removeEventListener("touchmove", moveHandler as EventListener);
  document.removeEventListener("touchend", upHandler);
};


export function calculatePosition(
  event: MouseEvent | React.MouseEvent | TouchEvent,
  rangeRef: React.RefObject<HTMLDivElement>,
  lengthOrRange: number | { min: number; max: number; step?: number }
): number {
  if (!rangeRef.current) throw new Error("Range reference not found");

  const clientX =
    "clientX" in event ? event.clientX : event.touches[0]?.clientX || 0;

  const rect = rangeRef.current.getBoundingClientRect();
  const percent = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));

  if (typeof lengthOrRange === "number") {
    return Math.round(percent * (lengthOrRange - 1));
  }

  const { min, max, step = 1 } = lengthOrRange;
  const rawValue = min + percent * (max - min);
  return Math.round(rawValue / step) * step;
}