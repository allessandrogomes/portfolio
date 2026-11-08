import { useRef, type PointerEvent } from "react";
import gsap from "gsap";

const MOUSE_POINTER_TYPE = "mouse";
const MAX_TILT_DEGREES = 18;
const CENTER_RATIO = 0.5;
const PERCENT_MULTIPLIER = 100;

const TILT_DURATION_SECONDS = 0.3;
const TILT_EASE = "power2.out";
const RESET_DURATION_SECONDS = 0.6;
const RESET_EASE = "power3.out";
const OVERWRITE_RUNNING_TWEENS = "auto";

const GLARE_X_PROPERTY = "--glare-x";
const GLARE_Y_PROPERTY = "--glare-y";

export function useTilt<TElement extends HTMLElement>() {
  const cardRef = useRef<TElement>(null);

  const handlePointerMove = (event: PointerEvent<TElement>) => {
    const card = cardRef.current;

    if (!card) return;
    if (event.pointerType !== MOUSE_POINTER_TYPE) return;

    const bounds = card.getBoundingClientRect();
    const horizontalRatio = (event.clientX - bounds.left) / bounds.width;
    const verticalRatio = (event.clientY - bounds.top) / bounds.height;

    card.style.setProperty(
      GLARE_X_PROPERTY,
      `${horizontalRatio * PERCENT_MULTIPLIER}%`,
    );
    card.style.setProperty(
      GLARE_Y_PROPERTY,
      `${verticalRatio * PERCENT_MULTIPLIER}%`,
    );

    gsap.to(card, {
      rotationY: (horizontalRatio - CENTER_RATIO) * 2 * MAX_TILT_DEGREES,
      rotationX: (CENTER_RATIO - verticalRatio) * 2 * MAX_TILT_DEGREES,
      duration: TILT_DURATION_SECONDS,
      ease: TILT_EASE,
      overwrite: OVERWRITE_RUNNING_TWEENS,
    });
  };

  const handlePointerLeave = () => {
    const card = cardRef.current;

    if (!card) return;

    gsap.to(card, {
      rotationX: 0,
      rotationY: 0,
      duration: RESET_DURATION_SECONDS,
      ease: RESET_EASE,
      overwrite: OVERWRITE_RUNNING_TWEENS,
    });
  };

  return {
    cardRef,
    tiltHandlers: {
      onPointerMove: handlePointerMove,
      onPointerLeave: handlePointerLeave,
    },
  };
}
