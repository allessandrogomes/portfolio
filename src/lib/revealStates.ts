import { NavigationDirection } from "@/lib/sectionNavigation";

const RISE_DISTANCE_PX = 20;
const BLURRED_FILTER = "blur(8px)";
const SHARP_FILTER = "blur(0px)";

export function getHiddenState(direction: NavigationDirection) {
  return {
    y: RISE_DISTANCE_PX * direction,
    autoAlpha: 0,
    filter: BLURRED_FILTER,
  };
}

export function getLeftState(direction: NavigationDirection) {
  return {
    y: -RISE_DISTANCE_PX * direction,
    autoAlpha: 0,
    filter: BLURRED_FILTER,
  };
}

export const HIDDEN_STATE = getHiddenState(NavigationDirection.NEXT);

export const VISIBLE_STATE = { y: 0, autoAlpha: 1, filter: SHARP_FILTER };

export const LEFT_STATE = getLeftState(NavigationDirection.NEXT);
