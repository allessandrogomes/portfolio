import { useState, type PointerEvent } from "react";

const MOUSE_POINTER_TYPE = "mouse";

function isMousePointer(event: PointerEvent): boolean {
  return event.pointerType === MOUSE_POINTER_TYPE;
}

export function useHoverReveal() {
  const [isRevealed, setIsRevealed] = useState(false);

  const handlePointerEnter = (event: PointerEvent) => {
    if (!isMousePointer(event)) return;
    setIsRevealed(true);
  };

  const handlePointerLeave = (event: PointerEvent) => {
    if (!isMousePointer(event)) return;
    setIsRevealed(false);
  };

  const handlePointerUp = (event: PointerEvent) => {
    if (isMousePointer(event)) return;
    setIsRevealed((wasRevealed) => !wasRevealed);
  };

  return {
    isRevealed,
    revealHandlers: {
      onPointerEnter: handlePointerEnter,
      onPointerLeave: handlePointerLeave,
      onPointerUp: handlePointerUp,
    },
  };
}
