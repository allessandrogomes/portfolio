import gsap from "gsap";
import {
  NavigationDirection,
  OVERWRITE_RUNNING_TWEENS,
} from "@/lib/sectionNavigation";
import {
  VISIBLE_STATE,
  getHiddenState,
  getLeftState,
} from "@/lib/revealStates";

const ENTER_EASE = "power3.out";
const ENTER_DURATION_SECONDS = 0.8;
const ENTER_STAGGER_SECONDS = 0.08;

const LEAVE_EASE = "power2.in";
const LEAVE_DURATION_SECONDS = 0.4;
const LEAVE_STAGGER_SECONDS = 0.03;

const STAGGER_FROM_START = "start";
const STAGGER_FROM_END = "end";

function getStaggerOrigin(direction: NavigationDirection) {
  if (direction === NavigationDirection.NEXT) return STAGGER_FROM_START;

  return STAGGER_FROM_END;
}

export function createRevealEnterTimeline(
  targets: gsap.TweenTarget,
  direction: NavigationDirection = NavigationDirection.NEXT,
) {
  return gsap
    .timeline({
      defaults: { ease: ENTER_EASE, overwrite: OVERWRITE_RUNNING_TWEENS },
    })
    .fromTo(
      targets,
      getHiddenState(direction),
      {
        ...VISIBLE_STATE,
        duration: ENTER_DURATION_SECONDS,
        stagger: {
          each: ENTER_STAGGER_SECONDS,
          from: getStaggerOrigin(direction),
        },
      },
      0,
    );
}

export function createRevealLeaveTimeline(
  targets: gsap.TweenTarget,
  direction: NavigationDirection = NavigationDirection.NEXT,
) {
  return gsap.timeline().to(targets, {
    ...getLeftState(direction),
    duration: LEAVE_DURATION_SECONDS,
    ease: LEAVE_EASE,
    stagger: { each: LEAVE_STAGGER_SECONDS, from: getStaggerOrigin(direction) },
    overwrite: OVERWRITE_RUNNING_TWEENS,
  });
}
