export const NavigationDirection = {
  NEXT: 1,
  PREVIOUS: -1,
} as const;

export type NavigationDirection =
  (typeof NavigationDirection)[keyof typeof NavigationDirection];

export interface SectionTransitions {
  enter: (direction: NavigationDirection) => gsap.core.Timeline;
  leave: (direction: NavigationDirection) => gsap.core.Timeline;
}

export const SECTION_SELECTOR = "[data-section]";
export const SECTION_LEAVE_EVENT = "section:leave";

export const OVERWRITE_RUNNING_TWEENS = "auto";
