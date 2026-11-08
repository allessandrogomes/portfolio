"use client";

import { useRef } from "react";
import Image from "next/image";
import CompanyDeliveryEyebrow from "@/components/CompanyDeliveryEyebrow";
import FitToViewport from "@/components/FitToViewport";
import {
  useSectionTransitions,
  type SectionSelector,
} from "@/hooks/useSectionTransitions";
import { MONITORING_DELIVERY, type ErrorFeedItem } from "@/data/experience";
import type { SectionTransitions } from "@/lib/sectionNavigation";
import { VISIBLE_STATE } from "@/lib/revealStates";
import {
  createRevealEnterTimeline,
  createRevealLeaveTimeline,
} from "@/lib/revealTransitions";
import { SectionAccent } from "@/lib/sectionAccents";

const SECTION_LABEL = "Monitoramento";
const DELIVERY_EYEBROW = "Entrega 05";
const CHANNEL_PREFIX = "# ";
const BOT_TAG = "App";
const MESSAGE_TIME = "agora";
const SOURCEMAP_TAG = "sourcemap";
const FEED_TITLE = "Erros · cardápio web";
const NOISE_FILTER_LABEL = "Ruído filtrado";
const NOISE_TAG = "ignorado";
const RELEVANT_TAG = "investigar";
const LOGO_SIZE_PX = 256;
const SLACK_LOGO_SRC = "/slack.svg";
const BUGSNAG_LOGO_SRC = "/bugsnag.svg";
const PEDE_AI_ICON_SRC = "/icone-red.png";
const PEDE_AI_ICON_WIDTH = 943;
const PEDE_AI_ICON_HEIGHT = 873;

const CARD_EASE = "power3.out";
const CARD_START_SECONDS = 0.2;
const CARD_DURATION_SECONDS = 1;
const CARD_STAGGER_SECONDS = 0.15;
const CARD_RISE_PX = 50;

const MESSAGE_EASE = "back.out(1.6)";
const MESSAGE_START_SECONDS = 0.9;
const MESSAGE_DURATION_SECONDS = 0.5;
const MESSAGE_RISE_PX = 12;

const SOURCEMAP_EASE = "power2.inOut";
const SOURCEMAP_START_SECONDS = 1.9;
const SOURCEMAP_DURATION_SECONDS = 0.5;
const SOURCEMAP_SHIFT_PX = 10;

const NOISE_EASE = "power2.inOut";
const NOISE_START_SECONDS = 1.4;
const NOISE_DURATION_SECONDS = 0.5;
const NOISE_STAGGER_SECONDS = 0.25;
const NOISE_DIMMED_OPACITY = 0.35;

const LEAVE_TARGETS = "[data-reveal], [data-monitor-card]";

function createMonitoringTransitions(
  select: SectionSelector,
): SectionTransitions {
  return {
    enter: (direction) =>
      createRevealEnterTimeline(select("[data-reveal]"), direction)
        .fromTo(
          select("[data-monitor-card]"),
          { y: CARD_RISE_PX, autoAlpha: 0 },
          {
            ...VISIBLE_STATE,
            y: 0,
            autoAlpha: 1,
            duration: CARD_DURATION_SECONDS,
            ease: CARD_EASE,
            stagger: CARD_STAGGER_SECONDS,
          },
          CARD_START_SECONDS,
        )
        .fromTo(
          select("[data-slack-message]"),
          { y: MESSAGE_RISE_PX, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: MESSAGE_DURATION_SECONDS,
            ease: MESSAGE_EASE,
          },
          MESSAGE_START_SECONDS,
        )
        .fromTo(
          select("[data-noise-strike]"),
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: NOISE_DURATION_SECONDS,
            ease: NOISE_EASE,
            stagger: NOISE_STAGGER_SECONDS,
          },
          NOISE_START_SECONDS,
        )
        .fromTo(
          select("[data-noise-content]"),
          { opacity: 1 },
          {
            opacity: NOISE_DIMMED_OPACITY,
            duration: NOISE_DURATION_SECONDS,
            ease: NOISE_EASE,
            stagger: NOISE_STAGGER_SECONDS,
          },
          NOISE_START_SECONDS,
        )
        .fromTo(
          select("[data-noise-tag], [data-noise-filter]"),
          { autoAlpha: 0 },
          {
            autoAlpha: 1,
            duration: NOISE_DURATION_SECONDS,
            stagger: NOISE_STAGGER_SECONDS,
          },
          NOISE_START_SECONDS,
        )
        .fromTo(
          select("[data-minified-location]"),
          { y: 0, autoAlpha: 1 },
          {
            y: -SOURCEMAP_SHIFT_PX,
            autoAlpha: 0,
            duration: SOURCEMAP_DURATION_SECONDS,
            ease: SOURCEMAP_EASE,
          },
          SOURCEMAP_START_SECONDS,
        )
        .fromTo(
          select("[data-source-location], [data-sourcemap-tag]"),
          { y: SOURCEMAP_SHIFT_PX, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: SOURCEMAP_DURATION_SECONDS,
            ease: SOURCEMAP_EASE,
          },
          "<",
        ),
    leave: (direction) => createRevealLeaveTimeline(select(LEAVE_TARGETS), direction),
  };
}

function SlackAlertCard() {
  const { slackAlert } = MONITORING_DELIVERY;

  return (
    <div
      data-monitor-card
      className="overflow-hidden rounded-xl border border-foreground/10 bg-foreground/5"
    >
      <div className="flex items-center gap-2 border-b border-foreground/10 px-4 py-2.5">
        <Image
          src={SLACK_LOGO_SRC}
          alt=""
          width={LOGO_SIZE_PX}
          height={LOGO_SIZE_PX}
          className="size-4"
        />
        <span className="text-sm font-semibold">
          {CHANNEL_PREFIX}
          {slackAlert.channel}
        </span>
      </div>

      <div data-slack-message className="flex gap-3 p-4">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-foreground/10">
          <Image
            src={PEDE_AI_ICON_SRC}
            alt=""
            width={PEDE_AI_ICON_WIDTH}
            height={PEDE_AI_ICON_HEIGHT}
            className="h-auto w-5"
          />
        </span>
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <p className="flex items-center gap-2 text-sm">
            <span className="font-semibold">{slackAlert.botName}</span>
            <span className="rounded bg-foreground/10 px-1 text-[10px] text-muted uppercase">
              {BOT_TAG}
            </span>
            <span className="text-xs text-muted">{MESSAGE_TIME}</span>
          </p>
          <p className="flex items-center gap-2 text-sm">
            <span aria-hidden className="size-2 rounded-full bg-pede-ai" />
            {slackAlert.title}
          </p>
          <div className="flex flex-col gap-1.5 rounded-md border-l-2 border-pede-ai bg-background/60 px-3 py-2 font-mono text-[10px] md:text-xs">
            <p className="text-foreground/90">{slackAlert.errorMessage}</p>
            <div className="flex items-center gap-2">
              <span className="relative grid flex-1 text-muted">
                <span
                  data-minified-location
                  className="invisible col-start-1 row-start-1 truncate"
                >
                  {slackAlert.minifiedLocation}
                </span>
                <span
                  data-source-location
                  className="col-start-1 row-start-1 truncate text-konva"
                >
                  {slackAlert.sourceLocation}
                </span>
              </span>
              <span
                data-sourcemap-tag
                className="shrink-0 rounded-full border border-konva/40 px-1.5 font-sans text-[9px] text-konva"
              >
                {SOURCEMAP_TAG}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ErrorFeedRow({ item }: { item: ErrorFeedItem }) {
  if (!item.isNoise) {
    return (
      <li className="flex items-center justify-between gap-3 px-4 py-2">
        <span className="truncate font-mono text-[10px] text-foreground/90 md:text-xs">
          {item.message}
        </span>
        <span className="flex shrink-0 items-center gap-1 text-[10px] text-pede-ai">
          <span aria-hidden className="size-1.5 rounded-full bg-pede-ai" />
          {RELEVANT_TAG}
        </span>
      </li>
    );
  }

  return (
    <li className="flex items-center justify-between gap-3 px-4 py-2">
      <span data-noise-content className="relative truncate opacity-35">
        <span className="font-mono text-[10px] text-foreground/90 md:text-xs">
          {item.message}
        </span>
        <span
          data-noise-strike
          aria-hidden
          className="absolute inset-x-0 top-1/2 h-px origin-left bg-foreground/70"
        />
      </span>
      <span data-noise-tag className="shrink-0 text-[10px] text-muted">
        {NOISE_TAG}
      </span>
    </li>
  );
}

function ErrorFeedCard() {
  return (
    <div
      data-monitor-card
      className="overflow-hidden rounded-xl border border-foreground/10 bg-foreground/5"
    >
      <div className="flex items-center gap-2 border-b border-foreground/10 px-4 py-2.5">
        <Image
          src={BUGSNAG_LOGO_SRC}
          alt=""
          width={LOGO_SIZE_PX}
          height={LOGO_SIZE_PX}
          className="size-4 rounded-sm"
        />
        <span className="flex-1 text-sm font-semibold">{FEED_TITLE}</span>
        <span
          data-noise-filter
          className="rounded-full border border-foreground/15 px-2 py-0.5 text-[10px] text-foreground/80"
        >
          {NOISE_FILTER_LABEL}
        </span>
      </div>
      <ul className="divide-y divide-foreground/5 py-1">
        {MONITORING_DELIVERY.errorFeed.map((item) => (
          <ErrorFeedRow key={item.message} item={item} />
        ))}
      </ul>
    </div>
  );
}

export default function MonitoringDelivery() {
  const sectionRef = useRef<HTMLElement>(null);

  useSectionTransitions(sectionRef, createMonitoringTransitions);

  return (
    <section
      ref={sectionRef}
      data-section
      data-section-label={SECTION_LABEL}
      data-section-accent={SectionAccent.PEDE_AI}
      aria-labelledby="monitoring-heading"
      className="absolute inset-0 overflow-hidden bg-background"
    >
      <FitToViewport>
        <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-6 py-10 md:grid-cols-2 md:gap-16 md:px-12">
          <div className="flex flex-col gap-4 md:gap-6">
            <CompanyDeliveryEyebrow deliveryLabel={DELIVERY_EYEBROW} />
            <h2
              data-reveal
              id="monitoring-heading"
              className="font-display text-5xl leading-none uppercase md:text-7xl"
            >
              {MONITORING_DELIVERY.title}
            </h2>
            <p data-reveal className="text-sm text-foreground/70 md:text-base">
              {MONITORING_DELIVERY.summary}
            </p>

            <ul className="mt-2 flex flex-col gap-4">
              {MONITORING_DELIVERY.pillars.map((pillar) => (
                <li key={pillar.title} data-reveal className="flex gap-4">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-foreground/15 bg-foreground/5">
                    <Image
                      src={pillar.logoSrc}
                      alt=""
                      width={LOGO_SIZE_PX}
                      height={LOGO_SIZE_PX}
                      className="size-5 rounded-sm"
                    />
                  </span>
                  <div>
                    <p className="font-semibold md:text-lg">{pillar.title}</p>
                    <p className="text-sm text-muted">{pillar.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-4">
            <SlackAlertCard />
            <ErrorFeedCard />
          </div>
        </div>
      </FitToViewport>
    </section>
  );
}
