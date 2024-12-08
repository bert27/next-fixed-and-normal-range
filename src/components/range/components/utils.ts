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