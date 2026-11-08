"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import FitToViewport from "@/components/FitToViewport";
import TechTile from "@/components/TechTile";
import {
  useSectionTransitions,
  type SectionSelector,
} from "@/hooks/useSectionTransitions";
import {
  BACKEND_TECHNOLOGIES,
  MAIN_TECHNOLOGIES,
} from "@/data/technologies";
import {
  OVERWRITE_RUNNING_TWEENS,
  NavigationDirection,
  SECTION_SELECTOR,
  type SectionTransitions,
} from "@/lib/sectionNavigation";
import {
  VISIBLE_STATE,
  getHiddenState,
  getLeftState,
} from "@/lib/revealStates";

const SECTION_LABEL = "Stack";
const EYEBROW = "Stack";
const HEADING = "Com o que eu construo";
const BACKEND_CAPTION =
  "Sou front-end, mas também tenho conhecimento complementar em back-end";

const PHOTO_SRC = "/foto-surpreso-transparente.png";
const PHOTO_SIZES = "(max-width: 768px) 90vw, 60vw";
const PHOTO_BACKGROUND_OPACITY = 0.3;
const PHOTO_SLIDE_DISTANCE_PX = 80;
const PHOTO_FADE_MASK =
  "linear-gradient(to right, black 45%, transparent 95%), linear-gradient(to top, black 60%, transparent 100%)";
const PHOTO_MASK_COMPOSITE = "intersect";
const ENTER_PHOTO_DURATION_SECONDS = 1.4;

const ENTER_EASE = "power3.out";
const ENTER_HEADING_DURATION_SECONDS = 0.8;
const ENTER_ITEM_DURATION_SECONDS = 0.7;
const ENTER_WAVE_SPREAD_SECONDS = 1;
const ENTER_WAVE_START_SECONDS = 0.15;

const LEAVE_EASE = "power2.in";
const LEAVE_DURATION_SECONDS = 0.4;
const LEAVE_WAVE_SPREAD_SECONDS = 0.35;
const FULL_PROGRESS = 1;

function createWaveDelay(
  spreadSeconds: number,
  direction: NavigationDirection,
) {
  const isGoingBack = direction === NavigationDirection.PREVIOUS;

  return (_index: number, item: Element): number => {
    const section = item.closest(SECTION_SELECTOR);

    if (!section) return 0;

    const sectionBounds = section.getBoundingClientRect();
    const itemBounds = item.getBoundingClientRect();
    const horizontalProgress =
      (itemBounds.left - sectionBounds.left) / sectionBounds.width;
    const verticalProgress =
      (itemBounds.top - sectionBounds.top) / sectionBounds.height;
    const diagonalProgress = (horizontalProgress + verticalProgress) / 2;
    const orderedProgress = isGoingBack
      ? FULL_PROGRESS - diagonalProgress
      : diagonalProgress;

    return orderedProgress * spreadSeconds;
  };
}

function createTechStackTransitions(
  select: SectionSelector,
): SectionTransitions {
  return {
    enter: (direction) =>
      gsap
        .timeline({
          defaults: { ease: ENTER_EASE, overwrite: OVERWRITE_RUNNING_TWEENS },
        })
        .fromTo(
          select("[data-stack-photo]"),
          { x: -PHOTO_SLIDE_DISTANCE_PX, autoAlpha: 0 },
          {
            x: 0,
            autoAlpha: PHOTO_BACKGROUND_OPACITY,
            duration: ENTER_PHOTO_DURATION_SECONDS,
          },
          0,
        )
        .fromTo(
          select("[data-stack-heading]"),
          getHiddenState(direction),
          { ...VISIBLE_STATE, duration: ENTER_HEADING_DURATION_SECONDS },
          0,
        )
        .fromTo(
          select("[data-wave-item]"),
          getHiddenState(direction),
          {
            ...VISIBLE_STATE,
            duration: ENTER_ITEM_DURATION_SECONDS,
            stagger: createWaveDelay(ENTER_WAVE_SPREAD_SECONDS, direction),
          },
          ENTER_WAVE_START_SECONDS,
        ),
    leave: (direction) =>
      gsap
        .timeline({
          defaults: {
            duration: LEAVE_DURATION_SECONDS,
            ease: LEAVE_EASE,
            overwrite: OVERWRITE_RUNNING_TWEENS,
          },
        })
        .to(
          select("[data-stack-photo]"),
          { x: -PHOTO_SLIDE_DISTANCE_PX, autoAlpha: 0 },
          0,
        )
        .to(select("[data-stack-heading]"), getLeftState(direction), 0)
        .to(
          select("[data-wave-item]"),
          {
            ...getLeftState(direction),
            stagger: createWaveDelay(LEAVE_WAVE_SPREAD_SECONDS, direction),
          },
          0,
        ),
  };
}

export default function TechStack() {
  const sectionRef = useRef<HTMLElement>(null);

  useSectionTransitions(sectionRef, createTechStackTransitions);

  return (
    <section
      ref={sectionRef}
      data-section
      data-section-label={SECTION_LABEL}
      aria-labelledby="stack-heading"
      className="absolute inset-0 overflow-hidden bg-background"
    >
      <div
        data-stack-photo
        aria-hidden
        style={{
          maskImage: PHOTO_FADE_MASK,
          maskComposite: PHOTO_MASK_COMPOSITE,
        }}
        className="pointer-events-none absolute bottom-0 -left-[15%] opacity-30 aspect-[1085/902] h-[55%] md:-left-[6%] md:h-[80%]"
      >
        <Image
          src={PHOTO_SRC}
          alt=""
          fill
          loading="eager"
          sizes={PHOTO_SIZES}
          className="object-contain object-bottom-left"
        />
      </div>

      <FitToViewport>
        <div className="group/stack flex flex-col items-center gap-6 px-4 py-8 md:gap-12 md:px-8 md:py-12">
          <header data-stack-heading className="text-center">
            <p className="text-xs font-semibold tracking-[0.35em] text-muted uppercase md:text-sm">
              {EYEBROW}
            </p>
            <h2
              id="stack-heading"
              className="mt-2 font-display text-4xl uppercase md:text-7xl"
            >
              {HEADING}
            </h2>
          </header>

          <ul className="flex w-full max-w-5xl flex-wrap justify-center gap-x-1.5 gap-y-4 md:gap-x-4 md:gap-y-8">
            {MAIN_TECHNOLOGIES.map((technology) => (
              <TechTile key={technology.name} technology={technology} />
            ))}
          </ul>

          <div className="flex w-full max-w-4xl flex-col items-center gap-4 md:gap-6">
            <span
              data-wave-item
              aria-hidden
              className="h-px w-full bg-foreground/10"
            />
            <p
              data-wave-item
              className="text-center text-xs text-muted md:text-sm"
            >
              {BACKEND_CAPTION}
            </p>
            <ul className="flex w-full flex-wrap justify-center gap-x-1.5 gap-y-4 md:gap-x-4">
              {BACKEND_TECHNOLOGIES.map((technology) => (
                <TechTile key={technology.name} technology={technology} />
              ))}
            </ul>
          </div>
        </div>
      </FitToViewport>
    </section>
  );
}
