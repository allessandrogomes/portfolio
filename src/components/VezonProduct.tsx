"use client";

import { useRef } from "react";
import Image from "next/image";
import type { SimpleIcon } from "simple-icons";
import Eyebrow from "@/components/Eyebrow";
import FitToViewport from "@/components/FitToViewport";
import StrokeIcon from "@/components/StrokeIcon";
import {
  useSectionTransitions,
  type SectionSelector,
} from "@/hooks/useSectionTransitions";
import {
  DevicePosition,
  VEZON_PRODUCT,
  type VezonDevice,
  type VezonHighlight,
} from "@/data/vezon";
import { getBrandColor } from "@/lib/brandColor";
import type { SectionTransitions } from "@/lib/sectionNavigation";
import { VISIBLE_STATE } from "@/lib/revealStates";
import {
  createRevealEnterTimeline,
  createRevealLeaveTimeline,
} from "@/lib/revealTransitions";
import { SectionAccent } from "@/lib/sectionAccents";

const SECTION_LABEL = "Vezon";
const EYEBROW = "Meu produto";
const LIVE_LABEL = "Em produção";
const META_SEPARATOR = " · ";
const VISIT_LABEL = "Visitar ";
const VISIT_ARROW = " ↗";
const VISIT_ARIA_LABEL = "Visitar o site da Vezon (abre em nova aba)";
const ICON_VIEW_BOX = "0 0 24 24";
const DEVICE_SIZES = "240px";

const DEVICE_CLASS_NAMES: Record<DevicePosition, string> = {
  [DevicePosition.LEFT]: "left-0 bottom-[3%] z-0 h-[86%] brightness-75",
  [DevicePosition.RIGHT]: "right-0 bottom-[3%] z-0 h-[86%] brightness-75",
  [DevicePosition.CENTER]:
    "left-1/2 bottom-0 z-10 h-full -translate-x-1/2 drop-shadow-[0_30px_40px_rgb(0_0_0/0.6)]",
};

const SIDE_DEVICE_OFFSET_PERCENT: Record<DevicePosition, number> = {
  [DevicePosition.LEFT]: 55,
  [DevicePosition.RIGHT]: -55,
  [DevicePosition.CENTER]: 0,
};

const DEVICE_EASE = "power3.out";
const CENTER_DEVICE_START_SECONDS = 0.1;
const CENTER_DEVICE_DURATION_SECONDS = 1.1;
const CENTER_DEVICE_RISE_PX = 80;
const SIDE_DEVICE_START_SECONDS = 0.6;
const SIDE_DEVICE_DURATION_SECONDS = 1;
const DEVICES_FADE_DURATION_SECONDS = 0.3;

const CARD_EASE = "power3.out";
const CARD_START_SECONDS = 0.7;
const CARD_DURATION_SECONDS = 0.8;
const CARD_STAGGER_SECONDS = 0.12;
const CARD_RISE_PX = 30;

const ICON_EASE = "back.out(2)";
const ICON_START_SECONDS = 1;
const ICON_DURATION_SECONDS = 0.5;
const ICON_STAGGER_SECONDS = 0.12;
const ICON_START_SCALE = 0.4;

const LEAVE_TARGETS = "[data-reveal], [data-vezon-devices], [data-vezon-card]";

function isDevicePosition(value: string | undefined): value is DevicePosition {
  return Object.values<string | undefined>(DevicePosition).includes(value);
}

function getSideDeviceOffset(_index: number, device: HTMLElement): number {
  const position = device.dataset.device;

  if (!isDevicePosition(position)) return 0;

  return SIDE_DEVICE_OFFSET_PERCENT[position];
}

function createVezonTransitions(select: SectionSelector): SectionTransitions {
  return {
    enter: (direction) =>
      createRevealEnterTimeline(select("[data-reveal]"), direction)
        .fromTo(
          select("[data-vezon-devices]"),
          { autoAlpha: 0 },
          { ...VISIBLE_STATE, duration: DEVICES_FADE_DURATION_SECONDS },
          0,
        )
        .fromTo(
          select(`[data-device='${DevicePosition.CENTER}']`),
          { y: CENTER_DEVICE_RISE_PX, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: CENTER_DEVICE_DURATION_SECONDS,
            ease: DEVICE_EASE,
          },
          CENTER_DEVICE_START_SECONDS,
        )
        .fromTo(
          select("[data-device-side]"),
          { xPercent: getSideDeviceOffset, autoAlpha: 0 },
          {
            xPercent: 0,
            autoAlpha: 1,
            duration: SIDE_DEVICE_DURATION_SECONDS,
            ease: DEVICE_EASE,
          },
          SIDE_DEVICE_START_SECONDS,
        )
        .fromTo(
          select("[data-vezon-card]"),
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
          select("[data-vezon-card-icon]"),
          { scale: ICON_START_SCALE, autoAlpha: 0 },
          {
            scale: 1,
            autoAlpha: 1,
            duration: ICON_DURATION_SECONDS,
            ease: ICON_EASE,
            stagger: ICON_STAGGER_SECONDS,
          },
          ICON_START_SECONDS,
        ),
    leave: (direction) => createRevealLeaveTimeline(select(LEAVE_TARGETS), direction),
  };
}

function BrandIcon({ icon, className }: { icon: SimpleIcon; className: string }) {
  return (
    <svg
      aria-hidden
      viewBox={ICON_VIEW_BOX}
      fill={getBrandColor(icon)}
      className={className}
    >
      <path d={icon.path} />
    </svg>
  );
}

function DeviceMockup({ device }: { device: VezonDevice }) {
  const isSideDevice = device.position !== DevicePosition.CENTER;

  return (
    <Image
      data-device={device.position}
      data-device-side={isSideDevice || undefined}
      src={device.src}
      alt={device.alt}
      width={device.width}
      height={device.height}
      sizes={DEVICE_SIZES}
      loading="eager"
      className={`absolute w-auto ${DEVICE_CLASS_NAMES[device.position]}`}
    />
  );
}

function HighlightCard({ highlight }: { highlight: VezonHighlight }) {
  return (
    <li
      data-vezon-card
      className="flex flex-col gap-3 rounded-xl border border-foreground/10 bg-foreground/5 p-4 transition-colors duration-300 hover:border-vezon/40"
    >
      <span data-vezon-card-icon className="flex gap-2">
        {highlight.icons.map((icon) => (
          <BrandIcon key={icon.title} icon={icon} className="size-6" />
        ))}
        {highlight.strokeIconPaths.map((path) => (
          <StrokeIcon key={path} path={path} className="size-6 text-vezon" />
        ))}
      </span>
      <p className="font-semibold">{highlight.title}</p>
      <p className="text-xs leading-relaxed text-muted md:text-sm">
        {highlight.description}
      </p>
    </li>
  );
}

export default function VezonProduct() {
  const sectionRef = useRef<HTMLElement>(null);
  useSectionTransitions(sectionRef, createVezonTransitions);

  return (
    <section
      ref={sectionRef}
      data-section
      data-section-label={SECTION_LABEL}
      data-section-accent={SectionAccent.VEZON}
      aria-labelledby="vezon-heading"
      className="absolute inset-0 overflow-hidden bg-background"
    >
      <FitToViewport>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10 md:gap-10 md:px-12">
          <div className="grid items-center gap-6 md:grid-cols-[2fr_3fr] md:gap-10">
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <Eyebrow>{EYEBROW}</Eyebrow>
                <span
                  data-reveal
                  className="flex items-center gap-2 rounded-full border border-vezon/30 px-2.5 py-0.5 text-xs text-vezon"
                >
                  <span aria-hidden className="relative flex size-2">
                    <span className="absolute inset-0 rounded-full bg-vezon motion-safe:animate-ping" />
                    <span className="relative size-2 rounded-full bg-vezon" />
                  </span>
                  {LIVE_LABEL}
                </span>
              </div>

              <h2
                data-reveal
                id="vezon-heading"
                className="font-display text-7xl leading-none uppercase md:text-9xl"
              >
                {VEZON_PRODUCT.name}
              </h2>
              <p data-reveal className="text-lg font-semibold md:text-xl">
                {VEZON_PRODUCT.tagline}
              </p>
              <p
                data-reveal
                className="text-xs font-semibold tracking-[0.2em] text-muted uppercase md:text-sm"
              >
                {VEZON_PRODUCT.role}
                {META_SEPARATOR}
                {VEZON_PRODUCT.launch}
              </p>
              <p data-reveal className="text-sm text-foreground/70 md:text-base">
                {VEZON_PRODUCT.summary}
              </p>

              <div data-reveal className="flex flex-wrap items-center gap-4">
                <a
                  href={VEZON_PRODUCT.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={VISIT_ARIA_LABEL}
                  className="rounded-full bg-vezon px-4 py-2 text-sm font-semibold text-background transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vezon active:scale-95"
                >
                  {VISIT_LABEL}
                  {VEZON_PRODUCT.urlLabel}
                  {VISIT_ARROW}
                </a>
                <ul className="flex items-center gap-3">
                  {VEZON_PRODUCT.stack.map((icon) => (
                    <li key={icon.title} title={icon.title}>
                      <BrandIcon icon={icon} className="size-5" />
                      <span className="sr-only">{icon.title}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div
              data-vezon-devices
              className="relative mx-auto aspect-[5/4] w-full max-w-[30rem]"
            >
              {VEZON_PRODUCT.devices.map((device) => (
                <DeviceMockup key={device.src} device={device} />
              ))}
            </div>
          </div>

          <ul className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {VEZON_PRODUCT.highlights.map((highlight) => (
              <HighlightCard key={highlight.title} highlight={highlight} />
            ))}
          </ul>
        </div>
      </FitToViewport>
    </section>
  );
}
