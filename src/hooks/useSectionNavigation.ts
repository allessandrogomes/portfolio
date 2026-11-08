import { useCallback, useRef, useState, type RefObject } from "react";
import gsap from "gsap";
import { Observer } from "gsap/Observer";
import { useGSAP } from "@gsap/react";
import { usePageReady } from "@/hooks/usePageReady";
import {
  NavigationDirection,
  SECTION_SELECTOR,
  type SectionTransitions,
} from "@/lib/sectionNavigation";

gsap.registerPlugin(Observer, useGSAP);

const OBSERVED_INPUTS = "wheel,touch";
const INVERTED_WHEEL_SPEED = -1;
const GESTURE_TOLERANCE_PX = 10;

const SECTION_OVERLAP_SECONDS = 0.3;
const ENTERING_SECTION_Z_INDEX = 1;
const Z_INDEX_PROPERTY = "zIndex";
const REDUCED_MOTION_FADE_SECONDS = 0.3;
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

const NEXT_SECTION_KEYS = ["ArrowDown", "PageDown", " "];
const PREVIOUS_SECTION_KEYS = ["ArrowUp", "PageUp"];
const INTERACTIVE_SELECTOR = "button, a, input, textarea, select";

export interface SectionSummary {
  label: string;
  accent: string;
}

const FALLBACK_ACCENT = "var(--color-foreground)";

function getKeyDirection(key: string): NavigationDirection | null {
  if (NEXT_SECTION_KEYS.includes(key)) return NavigationDirection.NEXT;
  if (PREVIOUS_SECTION_KEYS.includes(key)) return NavigationDirection.PREVIOUS;

  return null;
}

function getDirection(fromIndex: number, toIndex: number): NavigationDirection {
  if (toIndex > fromIndex) return NavigationDirection.NEXT;

  return NavigationDirection.PREVIOUS;
}

function toSectionSummary(section: HTMLElement): SectionSummary {
  return {
    label: section.dataset.sectionLabel ?? "",
    accent: section.dataset.sectionAccent ?? FALLBACK_ACCENT,
  };
}

export function useSectionNavigation(
  containerRef: RefObject<HTMLElement | null>,
  transitionsRef: RefObject<Map<HTMLElement, SectionTransitions>>,
) {
  const { isPageReady } = usePageReady();
  const [activeIndex, setActiveIndex] = useState(0);
  const [sections, setSections] = useState<SectionSummary[]>([]);
  const navigateRef = useRef<(targetIndex: number) => void>(null);

  useGSAP(
    () => {
      if (!isPageReady) return;

      const sectionElements =
        gsap.utils.toArray<HTMLElement>(SECTION_SELECTOR);
      let currentIndex = 0;
      let isAnimating = false;

      setSections(sectionElements.map(toSectionSummary));

      const createReducedMotionTransition = (
        currentSection: HTMLElement,
        nextSection: HTMLElement,
      ) =>
        gsap
          .timeline()
          .to(currentSection, {
            autoAlpha: 0,
            duration: REDUCED_MOTION_FADE_SECONDS,
          })
          .fromTo(
            nextSection,
            { autoAlpha: 0 },
            { autoAlpha: 1, duration: REDUCED_MOTION_FADE_SECONDS },
          );

      const createAnimatedTransition = (
        currentSection: HTMLElement,
        nextSection: HTMLElement,
        direction: NavigationDirection,
      ) => {
        const currentTransitions = transitionsRef.current.get(currentSection);
        const nextTransitions = transitionsRef.current.get(nextSection);

        const transition = gsap.timeline();

        if (currentTransitions) {
          transition.add(currentTransitions.leave(direction));
        }

        transition.set(
          nextSection,
          { autoAlpha: 1, zIndex: ENTERING_SECTION_Z_INDEX },
          `-=${SECTION_OVERLAP_SECONDS}`,
        );

        if (nextTransitions) {
          transition.add(nextTransitions.enter(direction), "<");
        }

        return transition;
      };

      const navigateTo = (targetIndex: number) => {
        const isOutOfRange =
          targetIndex < 0 || targetIndex >= sectionElements.length;
        const isCurrentSection = targetIndex === currentIndex;

        if (isAnimating || isOutOfRange || isCurrentSection) return;

        isAnimating = true;
        setActiveIndex(targetIndex);

        const currentSection = sectionElements[currentIndex];
        const nextSection = sectionElements[targetIndex];
        const direction = getDirection(currentIndex, targetIndex);
        const prefersReducedMotion =
          window.matchMedia(REDUCED_MOTION_QUERY).matches;

        const transition = prefersReducedMotion
          ? createReducedMotionTransition(currentSection, nextSection)
          : createAnimatedTransition(currentSection, nextSection, direction);

        transition.eventCallback("onComplete", () => {
          gsap.set(currentSection, { autoAlpha: 0 });
          gsap.set(nextSection, { clearProps: Z_INDEX_PROPERTY });
          currentIndex = targetIndex;
          isAnimating = false;
        });
      };

      const goInDirection = (direction: NavigationDirection) =>
        navigateTo(currentIndex + direction);

      navigateRef.current = navigateTo;

      const observer = Observer.create({
        target: window,
        type: OBSERVED_INPUTS,
        wheelSpeed: INVERTED_WHEEL_SPEED,
        tolerance: GESTURE_TOLERANCE_PX,
        preventDefault: true,
        onUp: () => goInDirection(NavigationDirection.NEXT),
        onDown: () => goInDirection(NavigationDirection.PREVIOUS),
      });

      const handleKeyDown = (event: KeyboardEvent) => {
        const direction = getKeyDirection(event.key);
        const isTypingOnControl =
          event.target instanceof Element &&
          event.target.closest(INTERACTIVE_SELECTOR) !== null;

        if (!direction || isTypingOnControl) return;

        event.preventDefault();
        goInDirection(direction);
      };

      window.addEventListener("keydown", handleKeyDown);

      return () => {
        navigateRef.current = null;
        observer.kill();
        window.removeEventListener("keydown", handleKeyDown);
      };
    },
    { scope: containerRef, dependencies: [isPageReady] },
  );

  const goToSection = useCallback((targetIndex: number) => {
    navigateRef.current?.(targetIndex);
  }, []);

  return { activeIndex, sections, goToSection };
}
