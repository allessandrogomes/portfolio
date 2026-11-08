"use client";

import { useRef } from "react";
import type gsap from "gsap";
import Image from "next/image";
import CompanyDeliveryEyebrow from "@/components/CompanyDeliveryEyebrow";
import IconChip from "@/components/IconChip";
import FitToViewport from "@/components/FitToViewport";
import {
  useSectionTransitions,
  type SectionSelector,
} from "@/hooks/useSectionTransitions";
import {
  DESKTOP_APP_DELIVERY,
  PEDE_AI_EXPERIENCE,
  type DeliveryMetric,
} from "@/data/experience";
import type { SectionTransitions } from "@/lib/sectionNavigation";
import {
  createRevealEnterTimeline,
  createRevealLeaveTimeline,
} from "@/lib/revealTransitions";
import { SectionAccent } from "@/lib/sectionAccents";

const SECTION_LABEL = "pede.ai";
const EYEBROW = "Experiência";
const DELIVERY_EYEBROW = "Entrega 01";
const ROLE_SEPARATOR = " · ";
const BEFORE_LABEL = "antes";

const NUMBER_LOCALE = "pt-BR";
const metricFormatter = new Intl.NumberFormat(NUMBER_LOCALE);

const COUNTER_EASE = "power3.inOut";
const COUNTER_DURATION_SECONDS = 1.4;
const METRIC_STAGGER_SECONDS = 0.2;
const METRIC_START_SECONDS = 0.6;

const STRIKE_EASE = "power2.out";
const STRIKE_DURATION_SECONDS = 0.4;
const STRIKE_DELAY_SECONDS = 0.3;

function formatMetricValue(value: number): string {
  return metricFormatter.format(Math.round(value));
}

function addMetricCounters(
  timeline: gsap.core.Timeline,
  select: SectionSelector,
) {
  select("[data-metric-value]").forEach((counter, index) => {
    const fromValue = Number(counter.dataset.from);
    const toValue = Number(counter.dataset.to);
    const progress = { value: fromValue };
    const startSeconds = METRIC_START_SECONDS + index * METRIC_STAGGER_SECONDS;

    timeline.fromTo(
      progress,
      { value: fromValue },
      {
        value: toValue,
        duration: COUNTER_DURATION_SECONDS,
        ease: COUNTER_EASE,
        onUpdate: () => {
          counter.textContent = formatMetricValue(progress.value);
        },
      },
      startSeconds,
    );
  });

  return timeline;
}

function createExperienceTransitions(
  select: SectionSelector,
): SectionTransitions {
  return {
    enter: (direction) =>
      addMetricCounters(
        createRevealEnterTimeline(select("[data-reveal]"), direction),
        select,
      )
        .fromTo(
          select("[data-metric-strike]"),
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: STRIKE_DURATION_SECONDS,
            ease: STRIKE_EASE,
            stagger: METRIC_STAGGER_SECONDS,
          },
          METRIC_START_SECONDS + STRIKE_DELAY_SECONDS,
        ),
    leave: (direction) =>
      createRevealLeaveTimeline(select("[data-reveal]"), direction),
  };
}

function MetricCard({ metric }: { metric: DeliveryMetric }) {
  return (
    <li
      data-reveal
      className="flex flex-col gap-2 rounded-2xl border border-foreground/10 bg-foreground/5 p-4"
    >
      <span className="min-h-[2lh] text-[10px] font-semibold tracking-[0.2em] text-muted uppercase md:text-xs">
        {metric.label}
      </span>
      <p className="flex items-baseline gap-1.5">
        <span className="font-display text-4xl leading-none md:text-5xl">
          {metric.afterPrefix}
          <span
            data-metric-value
            data-from={metric.beforeValue}
            data-to={metric.afterValue}
          >
            {formatMetricValue(metric.afterValue)}
          </span>
        </span>
        <span className="text-sm font-semibold text-foreground/80">
          {metric.unit}
        </span>
      </p>
      <p className="flex items-center gap-1.5 text-xs text-muted">
        <span>{BEFORE_LABEL}</span>
        <span className="relative">
          {metric.before}
          <span
            data-metric-strike
            aria-hidden
            className="absolute inset-x-0 top-1/2 h-px origin-left bg-pede-ai"
          />
        </span>
      </p>
    </li>
  );
}

export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null);
  const delivery = DESKTOP_APP_DELIVERY;

  useSectionTransitions(sectionRef, createExperienceTransitions);

  return (
    <section
      ref={sectionRef}
      data-section
      data-section-label={SECTION_LABEL}
      data-section-accent={SectionAccent.PEDE_AI}
      aria-labelledby="experience-heading"
      className="absolute inset-0 overflow-hidden bg-background"
    >
      <FitToViewport>
        <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-6 py-10 md:grid-cols-[2fr_3fr] md:gap-20 md:px-12">
          <header className="flex flex-col gap-3 md:gap-4">
            <p
              data-reveal
              className="text-xs font-semibold tracking-[0.35em] text-muted uppercase md:text-sm"
            >
              {EYEBROW}
            </p>
            <h2 data-reveal id="experience-heading" className="py-2">
              <Image
                src={PEDE_AI_EXPERIENCE.logoSrc}
                alt={PEDE_AI_EXPERIENCE.company}
                width={PEDE_AI_EXPERIENCE.logoWidth}
                height={PEDE_AI_EXPERIENCE.logoHeight}
                loading="eager"
                className="h-auto w-60 md:w-96"
              />
            </h2>
            <p data-reveal className="text-sm text-muted md:text-lg">
              {PEDE_AI_EXPERIENCE.description}
            </p>
            <p
              data-reveal
              className="text-sm font-semibold tracking-[0.2em] uppercase md:text-base"
            >
              {PEDE_AI_EXPERIENCE.role}
              <span className="text-muted">
                {ROLE_SEPARATOR}
                {PEDE_AI_EXPERIENCE.tenure}
              </span>
            </p>
          </header>

          <article
            aria-labelledby="delivery-heading"
            className="relative flex flex-col gap-6 md:gap-8 md:pl-12"
          >
            <span
              data-reveal
              aria-hidden
              className="absolute inset-y-0 left-0 hidden w-px bg-foreground/10 md:block"
            />
            <div className="flex flex-col gap-3">
              <CompanyDeliveryEyebrow deliveryLabel={DELIVERY_EYEBROW} />
              <h3
                data-reveal
                id="delivery-heading"
                className="flex items-center gap-4 font-display text-4xl uppercase md:text-6xl"
              >
                <Image
                  src={delivery.appIcon.src}
                  alt={delivery.appIcon.alt}
                  width={delivery.appIcon.size}
                  height={delivery.appIcon.size}
                  loading="eager"
                  className="size-12 rounded-xl shadow-lg md:size-16 md:rounded-2xl"
                />
                {delivery.title}
              </h3>
              <p
                data-reveal
                className="text-sm text-foreground/70 md:text-base"
              >
                {delivery.summary}
              </p>
            </div>

            <ul className="grid gap-3 sm:grid-cols-3">
              {delivery.metrics.map((metric) => (
                <MetricCard key={metric.label} metric={metric} />
              ))}
            </ul>

            <ul className="flex flex-wrap gap-2">
              {delivery.highlights.map((highlight) => (
                <IconChip
                  key={highlight.label}
                  item={highlight}
                  className="text-xs md:text-sm"
                />
              ))}
            </ul>
          </article>
        </div>
      </FitToViewport>
    </section>
  );
}
