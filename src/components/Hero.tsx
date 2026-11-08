"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { usePageReady } from "@/hooks/usePageReady";
import { useHoverReveal } from "@/hooks/useHoverReveal";
import {
  useSectionTransitions,
  type SectionSelector,
} from "@/hooks/useSectionTransitions";
import { FrontGreeting, SolidGreeting } from "@/components/HeroGreeting";
import {
  OVERWRITE_RUNNING_TWEENS,
  type SectionTransitions,
} from "@/lib/sectionNavigation";

gsap.registerPlugin(useGSAP);

const SECTION_LABEL = "Início";
const GREETING_LINES = ["Oi, me chamo", "Alessandro"];
const ROLE = "Desenvolvedor Front End";
const PHOTO_SRC = "/me.png";
const PHOTO_ALT = "Foto de Alessandro sorrindo de braços cruzados";
const PHOTO_SIZES = "(max-width: 768px) 90vw, 50vw";

const MOTION_ALLOWED_QUERY = "(prefers-reduced-motion: no-preference)";
const MOTION_REDUCED_QUERY = "(prefers-reduced-motion: reduce)";

const INTRO_EASE = "power4.out";
const INTRO_LINE_DURATION_SECONDS = 1.1;
const INTRO_LINE_STAGGER_SECONDS = 0.12;
const INTRO_PHOTO_DURATION_SECONDS = 1.2;
const INTRO_PHOTO_OFFSET_PERCENT = 15;
const INTRO_PHOTO_OVERLAP = "-=0.7";
const INTRO_ROLE_DURATION_SECONDS = 0.8;
const INTRO_ROLE_OVERLAP = "-=0.5";

const LEAVE_EASE = "power2.in";
const LEAVE_DURATION_SECONDS = 0.8;
const LINE_SHIFT_PERCENT = 35;
const PHOTO_LEAVE_SCALE = 0.85;
const PHOTO_LEAVE_SHIFT_PERCENT = -10;

function getLineStaggerDelay(_index: number, word: HTMLElement): number {
  const lineIndex = Number(word.dataset.lineIndex);

  return lineIndex * INTRO_LINE_STAGGER_SECONDS;
}

function stopIntroAnimation(select: SectionSelector) {
  gsap.killTweensOf(select("[data-greeting-word], [data-animate]"));
}

function createHeroTransitions(select: SectionSelector): SectionTransitions {
  return {
    leave: () => {
      stopIntroAnimation(select);

      return gsap
        .timeline({
          defaults: {
            duration: LEAVE_DURATION_SECONDS,
            ease: LEAVE_EASE,
            overwrite: OVERWRITE_RUNNING_TWEENS,
          },
        })
        .to(
          select("[data-greeting-line='0']"),
          { xPercent: -LINE_SHIFT_PERCENT, autoAlpha: 0 },
          0,
        )
        .to(
          select("[data-greeting-line='1']"),
          { xPercent: LINE_SHIFT_PERCENT, autoAlpha: 0 },
          0,
        )
        .to(
          select("[data-photo-wrapper]"),
          {
            scale: PHOTO_LEAVE_SCALE,
            yPercent: PHOTO_LEAVE_SHIFT_PERCENT,
            autoAlpha: 0,
          },
          0,
        )
        .to(select("[data-role]"), { autoAlpha: 0 }, 0);
    },
    enter: () =>
      gsap
        .timeline()
        .set(select("[data-greeting-line]"), { xPercent: 0, autoAlpha: 1 })
        .set(select("[data-photo-wrapper]"), {
          scale: 1,
          yPercent: 0,
          autoAlpha: 1,
        })
        .add(createIntroTimeline(select)),
  };
}

function createIntroTimeline(select: SectionSelector) {
  return gsap
    .timeline({
      defaults: { ease: INTRO_EASE, overwrite: OVERWRITE_RUNNING_TWEENS },
    })
    .set(select("[data-greeting]"), { autoAlpha: 1 })
    .fromTo(
      select("[data-greeting-word]"),
      { yPercent: 100 },
      {
        yPercent: 0,
        duration: INTRO_LINE_DURATION_SECONDS,
        stagger: getLineStaggerDelay,
      },
    )
    .fromTo(
      select("[data-photo]"),
      { yPercent: INTRO_PHOTO_OFFSET_PERCENT, autoAlpha: 0 },
      {
        yPercent: 0,
        autoAlpha: 1,
        duration: INTRO_PHOTO_DURATION_SECONDS,
      },
      INTRO_PHOTO_OVERLAP,
    )
    .fromTo(
      select("[data-role]"),
      { autoAlpha: 0 },
      { autoAlpha: 1, duration: INTRO_ROLE_DURATION_SECONDS },
      INTRO_ROLE_OVERLAP,
    );
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { isRevealed: isPhotoInFront, revealHandlers } = useHoverReveal();
  const isGreetingInFront = !isPhotoInFront;
  const photoDimClassName = isGreetingInFront ? "brightness-40" : "";
  const { isPageReady } = usePageReady();

  useSectionTransitions(sectionRef, createHeroTransitions);

  useGSAP(
    () => {
      if (!isPageReady) return;

      const media = gsap.matchMedia();

      media.add(MOTION_ALLOWED_QUERY, () => {
        createIntroTimeline(gsap.utils.selector(sectionRef));
      });

      media.add(MOTION_REDUCED_QUERY, () => {
        gsap.set("[data-animate]", { autoAlpha: 1 });
      });
    },
    { scope: sectionRef, dependencies: [isPageReady] },
  );

  return (
    <section
      ref={sectionRef}
      data-section
      data-section-label={SECTION_LABEL}
      className="absolute inset-0 overflow-hidden bg-background"
    >
      <SolidGreeting lines={GREETING_LINES} />

      <div
        data-photo-wrapper
        className="absolute inset-x-0 bottom-0 z-10 flex h-[70%] origin-bottom justify-center md:h-[85%]"
      >
        <div
          data-photo
          data-animate
          {...revealHandlers}
          className="invisible relative aspect-[1111/1415] h-full"
        >
          <Image
            src={PHOTO_SRC}
            alt={PHOTO_ALT}
            fill
            preload
            sizes={PHOTO_SIZES}
            className={`object-contain object-bottom transition-[filter] duration-500 ${photoDimClassName}`}
          />
        </div>
      </div>

      <FrontGreeting lines={GREETING_LINES} isRevealed={isGreetingInFront} />

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-1/4 bg-linear-to-t from-background via-background/70 to-transparent" />

      <p
        data-role
        data-animate
        className="pointer-events-none invisible absolute inset-x-0 bottom-10 z-20 text-center text-sm font-semibold tracking-[0.35em] text-foreground uppercase md:bottom-12 md:text-xl"
      >
        {ROLE}
      </p>
    </section>
  );
}
