import { useState, type RefObject } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export const GenerationPhase = {
  IDLE: "idle",
  GENERATING: "generating",
  DONE: "done",
} as const;

export type GenerationPhase =
  (typeof GenerationPhase)[keyof typeof GenerationPhase];

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

const GENERATION_DURATION_SECONDS = 3.5;
const PROGRESS_EASE = "power1.inOut";

const FLYER_SELECTOR = "[data-batch-flyer]";
const FLYER_EASE = "power2.out";
const FLYER_DURATION_SECONDS = 0.7;
const FLYER_STAGGER_SECONDS = 0.09;
const FLYER_REPEAT_COUNT = 4;
const FLYER_START_SCALE = 1;
const FLYER_END_SCALE = 0.45;
const FLYER_RANGE_X_PX = 170;
const FLYER_RANGE_Y_PX = 90;
const FLYER_ROTATION_RANGE_DEGREES = 25;

export function useBatchGeneration(
  scopeRef: RefObject<HTMLElement | null>,
  totalArts: number,
) {
  const [phase, setPhase] = useState<GenerationPhase>(GenerationPhase.IDLE);
  const [generatedCount, setGeneratedCount] = useState(0);
  const { contextSafe } = useGSAP({ scope: scopeRef });

  const startGeneration = contextSafe(() => {
    if (phase === GenerationPhase.GENERATING) return;

    setPhase(GenerationPhase.GENERATING);
    setGeneratedCount(0);

    const progress = { count: 0 };
    const prefersReducedMotion =
      window.matchMedia(REDUCED_MOTION_QUERY).matches;

    const generation = gsap
      .timeline({ onComplete: () => setPhase(GenerationPhase.DONE) })
      .to(
        progress,
        {
          count: totalArts,
          duration: GENERATION_DURATION_SECONDS,
          ease: PROGRESS_EASE,
          onUpdate: () => setGeneratedCount(Math.round(progress.count)),
        },
        0,
      );

    if (prefersReducedMotion) return;

    generation.fromTo(
      FLYER_SELECTOR,
      {
        x: 0,
        y: 0,
        rotation: 0,
        scale: FLYER_START_SCALE,
        autoAlpha: 1,
      },
      {
        x: () => gsap.utils.random(-FLYER_RANGE_X_PX, FLYER_RANGE_X_PX),
        y: () => gsap.utils.random(-FLYER_RANGE_Y_PX, FLYER_RANGE_Y_PX),
        rotation: () =>
          gsap.utils.random(
            -FLYER_ROTATION_RANGE_DEGREES,
            FLYER_ROTATION_RANGE_DEGREES,
          ),
        scale: FLYER_END_SCALE,
        autoAlpha: 0,
        duration: FLYER_DURATION_SECONDS,
        ease: FLYER_EASE,
        stagger: {
          each: FLYER_STAGGER_SECONDS,
          repeat: FLYER_REPEAT_COUNT,
          repeatRefresh: true,
        },
      },
      0,
    );
  });

  return { phase, generatedCount, startGeneration };
}
