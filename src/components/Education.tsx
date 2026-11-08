"use client";

import { useRef } from "react";
import Image from "next/image";
import FitToViewport from "@/components/FitToViewport";
import StrokeIcon from "@/components/StrokeIcon";
import {
  useSectionTransitions,
  type SectionSelector,
} from "@/hooks/useSectionTransitions";
import {
  CERTIFICATIONS,
  LANGUAGES,
  PROFICIENCY_LEVELS,
  EDUCATION,
  type Certification,
  type EducationEntry,
} from "@/data/education";
import type { SectionTransitions } from "@/lib/sectionNavigation";
import { VISIBLE_STATE } from "@/lib/revealStates";
import {
  createRevealEnterTimeline,
  createRevealLeaveTimeline,
} from "@/lib/revealTransitions";

const SECTION_LABEL = "Formação";
const EYEBROW = "Formação acadêmica";
const HEADING = "Formação";
const DESCRIPTION =
  "A base teórica que acompanha a prática do dia a dia no desenvolvimento.";
const WORD_SEPARATOR = " ";
const GRADUATION_ICON_PATH =
  "M2 9l10-5 10 5-10 5zM6 11v5c0 1.5 3 3 6 3s6-1.5 6-3v-5M22 9v6";
const LOCATION_ICON_PATH =
  "M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12zM12 11a2 2 0 1 0 0-4a2 2 0 0 0 0 4z";
const CALENDAR_ICON_PATH = "M4 6h16v14H4zM4 10h16M8 3v4M16 3v4";
const LOGO_ALT_PREFIX = "Logo da ";
const LOGO_SIZES = "48px";
const CERTIFICATIONS_EYEBROW = "Cursos e certificações";
const CERTIFICATE_ICON_PATH =
  "M5 3h14v12H5zM9 7h6M9 10h4M12 15l-2 6 2-1.5 2 1.5-2-6";
const CERTIFICATION_LOGO_SIZES = "32px";
const LANGUAGES_EYEBROW = "Idiomas";
const LEVEL_SEPARATOR = " · ";
const LANGUAGE_ICON_PATH =
  "M12 3a9 9 0 1 0 0 18a9 9 0 0 0 0-18zM3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-5.7-3.8-9s1.3-6.3 3.8-9z";

const LEVEL_EASE = "power2.out";
const LEVEL_START_SECONDS = 1.2;
const LEVEL_DURATION_SECONDS = 0.4;
const LEVEL_STAGGER_SECONDS = 0.07;

const CERTIFICATION_EASE = "power3.out";
const CERTIFICATION_START_SECONDS = 0.8;
const CERTIFICATION_DURATION_SECONDS = 0.7;
const CERTIFICATION_STAGGER_SECONDS = 0.1;
const CERTIFICATION_SHIFT_PX = -30;
const CERTIFICATION_LOGO_EASE = "back.out(2.5)";
const CERTIFICATION_LOGO_START_SECONDS = 1;
const CERTIFICATION_LOGO_DURATION_SECONDS = 0.5;

const MASK_HIDDEN_PERCENT = 110;
const TEXT_EASE = "power4.out";

const LETTER_DURATION_SECONDS = 0.9;
const LETTER_STAGGER_SECONDS = 0.05;

const TIMELINE_EASE = "power2.inOut";
const LINE_START_SECONDS = 0.3;
const LINE_DURATION_SECONDS = 1;

const NODE_EASE = "back.out(2.5)";
const NODE_START_SECONDS = 0.5;
const NODE_DURATION_SECONDS = 0.5;
const TIMELINE_STAGGER_SECONDS = 0.3;

const YEAR_EASE = "power3.out";
const YEAR_START_SECONDS = 0.3;
const YEAR_DURATION_SECONDS = 1.8;
const YEAR_SHIFT_PX = 120;

const ENTRY_START_SECONDS = 0.5;
const ENTRY_DURATION_SECONDS = 0.3;

const WORD_START_SECONDS = 0.6;
const WORD_DURATION_SECONDS = 0.8;
const WORD_STAGGER_SECONDS = 0.05;

const META_EASE = "power3.out";
const META_START_SECONDS = 0.9;
const META_DURATION_SECONDS = 0.6;
const META_STAGGER_SECONDS = 0.1;
const META_RISE_PX = 12;

const LOGO_EASE = "back.out(1.7)";
const LOGO_START_SECONDS = 1;
const LOGO_DURATION_SECONDS = 0.8;
const LOGO_FLIP_DEGREES = -90;
const LOGO_PERSPECTIVE_PX = 400;

const COMET_START_SECONDS = 1.4;
const COMET_DURATION_SECONDS = 0.6;

const LEAVE_TARGETS =
  "[data-reveal], [data-timeline-line], [data-timeline-node], [data-timeline-comet], [data-education-entry], [data-education-year], [data-certification]";

function createEducationTransitions(
  select: SectionSelector,
): SectionTransitions {
  return {
    enter: (direction) =>
      createRevealEnterTimeline(select("[data-reveal]"), direction)
        .fromTo(
          select("[data-heading-letter]"),
          { yPercent: MASK_HIDDEN_PERCENT },
          {
            yPercent: 0,
            duration: LETTER_DURATION_SECONDS,
            ease: TEXT_EASE,
            stagger: LETTER_STAGGER_SECONDS,
          },
          0,
        )
        .fromTo(
          select("[data-timeline-line]"),
          { scaleY: 0 },
          {
            ...VISIBLE_STATE,
            scaleY: 1,
            duration: LINE_DURATION_SECONDS,
            ease: TIMELINE_EASE,
          },
          LINE_START_SECONDS,
        )
        .fromTo(
          select("[data-timeline-node]"),
          { scale: 0 },
          {
            ...VISIBLE_STATE,
            scale: 1,
            duration: NODE_DURATION_SECONDS,
            ease: NODE_EASE,
            stagger: TIMELINE_STAGGER_SECONDS,
          },
          NODE_START_SECONDS,
        )
        .fromTo(
          select("[data-education-year]"),
          { x: YEAR_SHIFT_PX, autoAlpha: 0 },
          {
            ...VISIBLE_STATE,
            x: 0,
            duration: YEAR_DURATION_SECONDS,
            ease: YEAR_EASE,
            stagger: TIMELINE_STAGGER_SECONDS,
          },
          YEAR_START_SECONDS,
        )
        .fromTo(
          select("[data-education-entry]"),
          { autoAlpha: 0 },
          {
            ...VISIBLE_STATE,
            duration: ENTRY_DURATION_SECONDS,
            stagger: TIMELINE_STAGGER_SECONDS,
          },
          ENTRY_START_SECONDS,
        )
        .fromTo(
          select("[data-course-word]"),
          { yPercent: MASK_HIDDEN_PERCENT },
          {
            yPercent: 0,
            duration: WORD_DURATION_SECONDS,
            ease: TEXT_EASE,
            stagger: WORD_STAGGER_SECONDS,
          },
          WORD_START_SECONDS,
        )
        .fromTo(
          select("[data-entry-meta]"),
          { y: META_RISE_PX, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: META_DURATION_SECONDS,
            ease: META_EASE,
            stagger: META_STAGGER_SECONDS,
          },
          META_START_SECONDS,
        )
        .fromTo(
          select("[data-education-logo]"),
          {
            rotationY: LOGO_FLIP_DEGREES,
            transformPerspective: LOGO_PERSPECTIVE_PX,
            autoAlpha: 0,
          },
          {
            rotationY: 0,
            autoAlpha: 1,
            duration: LOGO_DURATION_SECONDS,
            ease: LOGO_EASE,
            stagger: TIMELINE_STAGGER_SECONDS,
          },
          LOGO_START_SECONDS,
        )
        .fromTo(
          select("[data-certification]"),
          { x: CERTIFICATION_SHIFT_PX, autoAlpha: 0 },
          {
            ...VISIBLE_STATE,
            x: 0,
            duration: CERTIFICATION_DURATION_SECONDS,
            ease: CERTIFICATION_EASE,
            stagger: CERTIFICATION_STAGGER_SECONDS,
          },
          CERTIFICATION_START_SECONDS,
        )
        .fromTo(
          select("[data-level-segment]"),
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: LEVEL_DURATION_SECONDS,
            ease: LEVEL_EASE,
            stagger: LEVEL_STAGGER_SECONDS,
          },
          LEVEL_START_SECONDS,
        )
        .fromTo(
          select("[data-certification-logo]"),
          { scale: 0 },
          {
            scale: 1,
            duration: CERTIFICATION_LOGO_DURATION_SECONDS,
            ease: CERTIFICATION_LOGO_EASE,
            stagger: CERTIFICATION_STAGGER_SECONDS,
          },
          CERTIFICATION_LOGO_START_SECONDS,
        )
        .fromTo(
          select("[data-timeline-comet]"),
          { autoAlpha: 0 },
          { ...VISIBLE_STATE, duration: COMET_DURATION_SECONDS },
          COMET_START_SECONDS,
        ),
    leave: (direction) => createRevealLeaveTimeline(select(LEAVE_TARGETS), direction),
  };
}

function AnimatedHeading() {
  return (
    <h2
      data-reveal
      id="education-heading"
      aria-label={HEADING}
      className="font-display text-6xl leading-none uppercase md:text-9xl"
    >
      <span
        aria-hidden
        className="-my-4 inline-flex overflow-hidden py-4 md:-my-6 md:py-6"
      >
        {Array.from(HEADING).map((letter, index) => (
          <span
            key={`${letter}-${index}`}
            data-heading-letter
            className="inline-block"
          >
            {letter}
          </span>
        ))}
      </span>
    </h2>
  );
}

function CourseTitle({ course }: { course: string }) {
  const words = course.split(WORD_SEPARATOR);

  return (
    <h3 className="font-display text-3xl leading-none uppercase md:text-5xl">
      {words.map((word, index) => (
        <span key={`${word}-${index}`}>
          <span className="inline-block overflow-hidden pb-1 align-top">
            <span data-course-word className="inline-block">
              {word}
            </span>
          </span>
          {WORD_SEPARATOR}
        </span>
      ))}
    </h3>
  );
}

function TimelineNode({ isInProgress }: { isInProgress: boolean }) {
  return (
    <span
      data-timeline-node
      aria-hidden
      className="absolute top-1 -left-10 flex size-6 items-center justify-center rounded-full border border-foreground/20 bg-background transition-[border-color,scale] duration-300 group-hover/entry:scale-125 group-hover/entry:border-foreground md:top-2"
    >
      {isInProgress ? (
        <span className="relative flex size-2.5">
          <span className="absolute inset-0 rounded-full bg-foreground motion-safe:animate-ping" />
          <span className="relative size-2.5 rounded-full bg-foreground" />
        </span>
      ) : (
        <span className="size-2 rounded-full bg-foreground/40 transition-colors duration-300 group-hover/entry:bg-foreground" />
      )}
    </span>
  );
}

function EducationItem({ entry }: { entry: EducationEntry }) {
  return (
    <li className="group/entry relative transition-opacity duration-300 group-has-[li:hover]/timeline:opacity-40 hover:opacity-100!">
      <span
        data-education-year
        aria-hidden
        className="pointer-events-none absolute -top-10 right-0 -z-10 font-display text-[7rem] leading-none text-transparent transition-[-webkit-text-stroke-color] duration-500 select-none [-webkit-text-stroke:1px_rgb(242_240_235/0.08)] group-hover/entry:[-webkit-text-stroke-color:rgb(242_240_235/0.3)] md:-top-16 md:text-[11rem]"
      >
        {entry.highlightYear}
      </span>

      <TimelineNode isInProgress={entry.isInProgress} />

      <div data-education-entry className="flex flex-col gap-2">
        <p data-entry-meta className="flex flex-wrap items-center gap-3">
          <span className="w-fit rounded-full border border-foreground/20 px-2.5 py-0.5 text-xs text-foreground/80">
            {entry.status}
          </span>
          <span className="flex items-center gap-1 text-xs text-muted tabular-nums md:text-sm">
            <StrokeIcon path={CALENDAR_ICON_PATH} className="size-4" />
            {entry.period}
          </span>
        </p>

        <CourseTitle course={entry.course} />

        <div className="mt-1 flex items-center gap-3">
          <span
            data-education-logo
            className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-foreground/10 bg-foreground/5 p-1.5 transition-[scale,border-color] duration-300 group-hover/entry:scale-110 group-hover/entry:border-foreground/30 md:size-12"
          >
            <Image
              src={entry.logo.src}
              alt={`${LOGO_ALT_PREFIX}${entry.institution}`}
              width={entry.logo.width}
              height={entry.logo.height}
              sizes={LOGO_SIZES}
              className="size-full object-contain"
            />
          </span>
          <p
            data-entry-meta
            className="flex flex-col text-sm text-muted md:text-base"
          >
            <span className="font-semibold text-foreground">
              {entry.institution}
            </span>
            <span className="flex items-center gap-1 text-xs md:text-sm">
              <StrokeIcon path={LOCATION_ICON_PATH} className="size-3.5" />
              {entry.location}
            </span>
          </p>
        </div>
      </div>
    </li>
  );
}

function CertificationItem({ certification }: { certification: Certification }) {
  const { logo } = certification;
  const logoClassName = logo.hasOwnBackground ? "" : "p-1.5";

  return (
    <li
      data-certification
      className="group/certification flex items-center gap-3 rounded-lg border border-foreground/10 bg-foreground/[0.03] px-3 py-2 transition-[translate,border-color,background-color] duration-300 hover:translate-x-1 hover:border-foreground/30 hover:bg-foreground/5"
    >
      <span
        data-certification-logo
        className={`flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-md bg-background ${logoClassName}`}
      >
        <Image
          src={logo.src}
          alt={`${LOGO_ALT_PREFIX}${certification.issuer}`}
          width={logo.width}
          height={logo.height}
          sizes={CERTIFICATION_LOGO_SIZES}
          className="size-full object-contain"
        />
      </span>
      <p className="flex min-w-0 flex-col">
        <span className="truncate text-sm font-semibold">
          {certification.name}
        </span>
        <span className="text-xs text-muted">{certification.issuer}</span>
      </p>
    </li>
  );
}

function CertificationList() {
  return (
    <div className="mt-4 flex flex-col gap-3">
      <p
        data-reveal
        className="flex items-center gap-2 text-xs font-semibold tracking-[0.35em] text-muted uppercase"
      >
        <StrokeIcon path={CERTIFICATE_ICON_PATH} className="size-4" />
        {CERTIFICATIONS_EYEBROW}
      </p>
      <ul className="flex flex-col gap-2">
        {CERTIFICATIONS.map((certification) => (
          <CertificationItem
            key={certification.name}
            certification={certification}
          />
        ))}
      </ul>
    </div>
  );
}

function ProficiencyScale({ reachedLevels }: { reachedLevels: number }) {
  return (
    <span aria-hidden className="flex gap-1">
      {PROFICIENCY_LEVELS.map((level, index) => {
        const isReached = index < reachedLevels;

        return (
          <span
            key={level}
            title={level}
            className="h-1.5 w-6 overflow-hidden rounded-full bg-foreground/10 md:w-8"
          >
            {isReached && (
              <span
                data-level-segment
                className="block size-full origin-left rounded-full bg-foreground"
              />
            )}
          </span>
        );
      })}
    </span>
  );
}

function LanguageList() {
  return (
    <div data-language-block className="flex flex-col gap-3 pl-10">
      <p
        data-reveal
        className="flex items-center gap-2 text-xs font-semibold tracking-[0.35em] text-muted uppercase"
      >
        <StrokeIcon path={LANGUAGE_ICON_PATH} className="size-4" />
        {LANGUAGES_EYEBROW}
      </p>
      <ul className="flex flex-col gap-3">
        {LANGUAGES.map((language) => (
          <li
            key={language.name}
            data-reveal
            className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1"
          >
            <p className="flex flex-col">
              <span className="text-sm font-semibold">
                {language.name}
                <span className="font-normal text-muted">
                  {LEVEL_SEPARATOR}
                  {language.level}
                </span>
              </span>
              {language.note && (
                <span className="text-xs text-muted">{language.note}</span>
              )}
            </p>
            <ProficiencyScale reachedLevels={language.reachedLevels} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function TimelineRail() {
  return (
    <>
      <span
        data-timeline-line
        aria-hidden
        className="absolute top-3 bottom-3 left-[11px] w-px origin-top bg-linear-to-b from-foreground/60 to-foreground/10"
      />
      <span
        data-timeline-comet
        aria-hidden
        className="pointer-events-none absolute top-3 bottom-3 left-[11px] w-px overflow-hidden motion-reduce:hidden"
      >
        <span className="absolute inset-0 motion-safe:animate-timeline-comet">
          <span className="absolute top-0 left-0 h-20 w-px bg-linear-to-b from-transparent via-foreground to-transparent shadow-[0_0_8px_1px_var(--color-foreground)]" />
        </span>
      </span>
    </>
  );
}

export default function Education() {
  const sectionRef = useRef<HTMLElement>(null);

  useSectionTransitions(sectionRef, createEducationTransitions);

  return (
    <section
      ref={sectionRef}
      data-section
      data-section-label={SECTION_LABEL}
      aria-labelledby="education-heading"
      className="absolute inset-0 overflow-hidden bg-background"
    >
      <FitToViewport>
        <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-6 py-10 md:grid-cols-[2fr_3fr] md:gap-20 md:px-12">
          <header className="flex flex-col gap-4">
            <p
              data-reveal
              className="flex items-center gap-2 text-xs font-semibold tracking-[0.35em] text-muted uppercase md:text-sm"
            >
              <StrokeIcon path={GRADUATION_ICON_PATH} className="size-5" />
              {EYEBROW}
            </p>
            <AnimatedHeading />
            <p data-reveal className="text-sm text-foreground/70 md:text-base">
              {DESCRIPTION}
            </p>
            <CertificationList />
          </header>

          <div className="flex flex-col gap-10">
            <ol className="group/timeline relative isolate flex flex-col gap-10 pl-10 md:gap-12">
              <TimelineRail />
              {EDUCATION.map((entry) => (
                <EducationItem key={entry.course} entry={entry} />
              ))}
            </ol>
            <LanguageList />
          </div>
        </div>
      </FitToViewport>
    </section>
  );
}
