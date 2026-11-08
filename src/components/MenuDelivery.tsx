"use client";

import { useRef } from "react";
import Image from "next/image";
import type { SimpleIcon } from "simple-icons";
import Eyebrow from "@/components/Eyebrow";
import CompanyDeliveryEyebrow from "@/components/CompanyDeliveryEyebrow";
import IconChip from "@/components/IconChip";
import FitToViewport from "@/components/FitToViewport";
import StrokeIcon from "@/components/StrokeIcon";
import {
  useSectionTransitions,
  type SectionSelector,
} from "@/hooks/useSectionTransitions";
import {
  MENU_DELIVERY,
  type PaymentMethod,
} from "@/data/experience";
import { getBrandColor } from "@/lib/brandColor";
import type { SectionTransitions } from "@/lib/sectionNavigation";
import { VISIBLE_STATE, getHiddenState } from "@/lib/revealStates";
import {
  createRevealEnterTimeline,
  createRevealLeaveTimeline,
} from "@/lib/revealTransitions";
import { SectionAccent } from "@/lib/sectionAccents";

const SECTION_LABEL = "Cardápio web";
const DELIVERY_EYEBROW = "Entrega 02";
const FEATURES_EYEBROW = "O que implementei";
const PAYMENTS_EYEBROW = "Pagamentos online e offline";
const SECURITY_EYEBROW = "Segurança";
const BROWSER_ADDRESS = "pede.ai";
const COMPANY_URL = "https://pede.ai";
const VISIT_LINK_TEXT = "Visitar site ↗";
const VISIT_LINK_LABEL = "Visitar o site da pede.ai (abre em nova aba)";
const BROWSER_DOTS = ["dot-close", "dot-minimize", "dot-expand"];
const SCREENSHOT_SIZES = "(max-width: 768px) 90vw, 55vw";

const ICON_VIEW_BOX = "0 0 24 24";
const CARD_ICON_PATH =
  "M2 7a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2zM2 10h20";
const LOCK_ICON_PATH = "M7 11V7a5 5 0 0 1 10 0v4M5 11h14v10H5z";
const CIPHER_ALPHABET =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
const SCRAMBLE_WINDOW_SIZE = 4;
const PLAIN_NUMBER_COLOR_VARIABLE = "--color-foreground";
const ENCRYPTED_NUMBER_COLOR_VARIABLE = "--color-pede-ai";

const CIPHER_START_SECONDS = 1.6;
const CIPHER_DURATION_SECONDS = 1.6;
const CIPHER_EASE = "none";
const CARD_GLOW_DURATION_SECONDS = 0.4;
const CARD_IDLE_SHADOW =
  "0px 0px 0px 1px rgba(255, 51, 51, 0), 0px 20px 40px -12px rgba(255, 51, 51, 0)";
const CARD_ENCRYPTED_SHADOW =
  "0px 0px 0px 1px rgba(255, 51, 51, 1), 0px 20px 40px -12px rgba(255, 51, 51, 0.45)";
const BADGE_START_SCALE = 0.8;
const BADGE_EASE = "back.out(2)";

const MIGRATION_EASE = "power2.inOut";
const STRIKE_START_SECONDS = 0.7;
const STRIKE_DURATION_SECONDS = 0.6;
const CONNECTOR_START_SECONDS = 1.1;
const CONNECTOR_DURATION_SECONDS = 0.4;
const TARGET_START_SECONDS = 1.3;
const TARGET_DURATION_SECONDS = 0.8;

const PREVIEW_EASE = "power3.out";
const PREVIEW_START_SECONDS = 0.2;
const PREVIEW_DURATION_SECONDS = 1.2;
const PREVIEW_RISE_PX = 60;
const PREVIEW_TILT_DEGREES = 14;
const PREVIEW_PERSPECTIVE_PX = 1200;

const REVEAL_TARGETS = "[data-reveal]";
const LEAVE_TARGETS =
  "[data-reveal], [data-migration-target], [data-menu-preview]";

function createMenuDeliveryTransitions(
  select: SectionSelector,
): SectionTransitions {
  return {
    enter: (direction) => {
      const [cardNumber] = select("[data-card-number]");
      const { cardNumber: plainNumber, encryptedCard } = MENU_DELIVERY.security;
      const scramble = { progress: 0 };

      const showCardNumber = (text: string) => {
        if (!cardNumber) return;

        cardNumber.textContent = text;
      };

      return createRevealEnterTimeline(select(REVEAL_TARGETS), direction)
        .call(showCardNumber, [plainNumber], 0)
        .fromTo(
          select("[data-card-number]"),
          { color: readThemeColor(PLAIN_NUMBER_COLOR_VARIABLE) },
          {
            color: readThemeColor(ENCRYPTED_NUMBER_COLOR_VARIABLE),
            duration: CIPHER_DURATION_SECONDS,
            ease: CIPHER_EASE,
          },
          CIPHER_START_SECONDS,
        )
        .fromTo(
          scramble,
          { progress: 0 },
          {
            progress: 1,
            duration: CIPHER_DURATION_SECONDS,
            ease: CIPHER_EASE,
            onUpdate: () =>
              showCardNumber(
                getEncryptingText(plainNumber, encryptedCard, scramble.progress),
              ),
          },
          CIPHER_START_SECONDS,
        )
        .fromTo(
          select("[data-card]"),
          { boxShadow: CARD_IDLE_SHADOW },
          {
            boxShadow: CARD_ENCRYPTED_SHADOW,
            duration: CARD_GLOW_DURATION_SECONDS,
          },
        )
        .fromTo(
          select("[data-encrypted-badge]"),
          { autoAlpha: 0, scale: BADGE_START_SCALE },
          {
            autoAlpha: 1,
            scale: 1,
            duration: CARD_GLOW_DURATION_SECONDS,
            ease: BADGE_EASE,
          },
          "<",
        )
        .fromTo(
          select("[data-menu-preview]"),
          {
            y: PREVIEW_RISE_PX,
            rotationX: PREVIEW_TILT_DEGREES,
            transformPerspective: PREVIEW_PERSPECTIVE_PX,
            autoAlpha: 0,
          },
          {
            ...VISIBLE_STATE,
            y: 0,
            rotationX: 0,
            autoAlpha: 1,
            duration: PREVIEW_DURATION_SECONDS,
            ease: PREVIEW_EASE,
          },
          PREVIEW_START_SECONDS,
        )
        .fromTo(
          select("[data-strike]"),
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: STRIKE_DURATION_SECONDS,
            ease: MIGRATION_EASE,
          },
          STRIKE_START_SECONDS,
        )
        .fromTo(
          select("[data-connector]"),
          { scaleY: 0 },
          {
            scaleY: 1,
            duration: CONNECTOR_DURATION_SECONDS,
            ease: MIGRATION_EASE,
          },
          CONNECTOR_START_SECONDS,
        )
        .fromTo(
          select("[data-migration-target]"),
          getHiddenState(direction),
          { ...VISIBLE_STATE, duration: TARGET_DURATION_SECONDS },
          TARGET_START_SECONDS,
        );
    },
    leave: (direction) => createRevealLeaveTimeline(select(LEAVE_TARGETS), direction),
  };
}

function getRandomCipherCharacter(): string {
  const index = Math.floor(Math.random() * CIPHER_ALPHABET.length);

  return CIPHER_ALPHABET[index];
}

function getEncryptingText(
  plainText: string,
  encryptedText: string,
  progress: number,
): string {
  const encryptedLength = Math.floor(progress * encryptedText.length);
  const scrambleEnd = encryptedLength + SCRAMBLE_WINDOW_SIZE;

  return Array.from(encryptedText, (encryptedCharacter, index) => {
    if (index < encryptedLength) return encryptedCharacter;
    if (index < scrambleEnd) return getRandomCipherCharacter();

    return plainText[index] ?? "";
  }).join("");
}

function readThemeColor(variableName: string): string {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(variableName)
    .trim();
}

function BrandIcon({
  icon,
  color,
  className,
}: {
  icon: SimpleIcon;
  color: string;
  className: string;
}) {
  return (
    <svg aria-hidden viewBox={ICON_VIEW_BOX} fill={color} className={className}>
      <path d={icon.path} />
    </svg>
  );
}

function PaymentIcon({ payment }: { payment: PaymentMethod }) {
  if (!payment.icon) {
    return <StrokeIcon path={CARD_ICON_PATH} className="size-4 md:size-5" />;
  }

  return (
    <BrandIcon
      icon={payment.icon}
      color={getBrandColor(payment.icon)}
      className="size-4 md:size-5"
    />
  );
}

function CardEncryptionDemo() {
  const { security } = MENU_DELIVERY;

  return (
    <div
      data-reveal
      data-card
      style={{ boxShadow: CARD_ENCRYPTED_SHADOW }}
      className="relative flex aspect-[1.586] w-full max-w-72 flex-col justify-between overflow-hidden rounded-xl border border-foreground/10 bg-linear-to-br from-[#2a2a2e] via-[#1b1b1f] to-[#111114] p-4"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -top-1/2 -right-1/4 size-48 rounded-full bg-pede-ai/10 blur-2xl"
      />

      <div className="relative flex items-start justify-between">
        <span
          aria-hidden
          className="h-6 w-8 rounded-md bg-linear-to-br from-[#e8cf8a] to-[#a8873e]"
        />
        <span
          data-encrypted-badge
          className="flex items-center gap-1 rounded-full bg-pede-ai/15 px-2 py-0.5 text-[10px] font-semibold text-pede-ai"
        >
          <StrokeIcon path={LOCK_ICON_PATH} className="size-3" />
          {security.encryptedLabel}
        </span>
      </div>

      <p
        data-card-number
        className="relative truncate font-mono text-sm tracking-wider text-pede-ai"
      >
        {security.encryptedCard}
      </p>

      <div className="relative flex items-end justify-between text-[10px] tracking-wider text-muted uppercase">
        <span>{security.cardHolder}</span>
        <span>{security.cardExpiry}</span>
        <span aria-hidden className="flex">
          <span className="size-5 rounded-full bg-foreground/30" />
          <span className="-ml-2 size-5 rounded-full bg-foreground/15" />
        </span>
      </div>
    </div>
  );
}

function BrowserPreview() {
  const { screenshot } = MENU_DELIVERY;

  return (
    <figure data-menu-preview>
      <a
        href={COMPANY_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={VISIT_LINK_LABEL}
        className="group/preview relative block overflow-hidden rounded-xl border border-foreground/10 bg-foreground/5 shadow-[0_30px_80px_-20px_rgb(255_51_51/0.25)] transition duration-300 hover:-translate-y-1 hover:border-pede-ai/40 hover:shadow-[0_30px_80px_-20px_rgb(255_51_51/0.45)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pede-ai"
      >
        <div className="flex items-center gap-3 border-b border-foreground/10 px-3 py-2">
          <div aria-hidden className="flex gap-1.5">
            {BROWSER_DOTS.map((dot) => (
              <span
                key={dot}
                className="size-2.5 rounded-full bg-foreground/20"
              />
            ))}
          </div>
          <span className="flex-1 rounded-md bg-foreground/5 px-3 py-0.5 text-center text-xs text-muted">
            {BROWSER_ADDRESS}
          </span>
        </div>
        <Image
          src={screenshot.src}
          alt={screenshot.alt}
          width={screenshot.width}
          height={screenshot.height}
          sizes={SCREENSHOT_SIZES}
          loading="eager"
          className="h-auto w-full"
        />
        <span
          aria-hidden
          className="absolute right-3 bottom-3 rounded-full bg-pede-ai px-3 py-1 text-xs font-semibold text-white opacity-0 transition duration-300 group-hover/preview:opacity-100 group-focus-visible/preview:opacity-100"
        >
          {VISIT_LINK_TEXT}
        </span>
      </a>
    </figure>
  );
}

export default function MenuDelivery() {
  const sectionRef = useRef<HTMLElement>(null);
  const { migration, security } = MENU_DELIVERY;

  useSectionTransitions(sectionRef, createMenuDeliveryTransitions);

  return (
    <section
      ref={sectionRef}
      data-section
      data-section-label={SECTION_LABEL}
      data-section-accent={SectionAccent.PEDE_AI}
      aria-labelledby="menu-delivery-heading"
      className="absolute inset-0 overflow-hidden bg-background"
    >
      <FitToViewport>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10 md:gap-12 md:px-12">
          <div className="grid items-center gap-8 md:grid-cols-[2fr_3fr] md:gap-16">
            <div className="flex flex-col gap-4">
              <CompanyDeliveryEyebrow deliveryLabel={DELIVERY_EYEBROW} />
              <h2
                data-reveal
                id="menu-delivery-heading"
                className="font-display text-5xl leading-none uppercase md:text-7xl"
              >
                {MENU_DELIVERY.title}
              </h2>
              <p
                data-reveal
                className="text-sm text-foreground/70 md:text-base"
              >
                {MENU_DELIVERY.summary}
              </p>

              <div className="mt-2 flex flex-col">
                <div data-reveal className="flex items-center gap-4 text-muted">
                  <BrandIcon
                    icon={migration.from.icon}
                    color="currentColor"
                    className="size-8"
                  />
                  <div>
                    <p className="relative inline-block font-semibold">
                      {migration.from.name}
                      <span
                        data-strike
                        aria-hidden
                        className="absolute inset-x-0 top-1/2 h-0.5 origin-left bg-pede-ai"
                      />
                    </p>
                    <p className="text-xs">{migration.from.note}</p>
                  </div>
                </div>

                <span
                  data-connector
                  aria-hidden
                  className="my-1.5 ml-4 h-6 w-px origin-top bg-linear-to-b from-muted to-foreground"
                />

                <div data-migration-target className="flex items-center gap-4">
                  <BrandIcon
                    icon={migration.to.icon}
                    color={getBrandColor(migration.to.icon)}
                    className="size-8"
                  />
                  <div>
                    <p className="font-semibold">{migration.to.name}</p>
                    <p className="text-xs text-muted">{migration.to.note}</p>
                  </div>
                </div>
              </div>
            </div>

            <BrowserPreview />
          </div>

          <div className="grid gap-6 border-t border-foreground/10 pt-6 md:grid-cols-[3fr_2fr_2fr] md:gap-10 md:pt-8">
            <div className="flex flex-col gap-3">
              <Eyebrow>{FEATURES_EYEBROW}</Eyebrow>
              <ul className="flex flex-wrap gap-2">
                {MENU_DELIVERY.features.map((feature) => (
                  <IconChip
                    key={feature.label}
                    item={feature}
                    className="text-xs"
                  />
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-3">
              <Eyebrow>{PAYMENTS_EYEBROW}</Eyebrow>
              <ul className="flex flex-wrap gap-2">
                {MENU_DELIVERY.payments.map((payment) => (
                  <li
                    key={payment.name}
                    data-reveal
                    className="flex items-center gap-2 rounded-lg border border-foreground/15 px-3 py-1.5 text-xs"
                  >
                    <PaymentIcon payment={payment} />
                    {payment.name}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-3">
              <Eyebrow>{SECURITY_EYEBROW}</Eyebrow>
              <CardEncryptionDemo />
              <ul className="flex flex-wrap gap-2">
                {security.techniques.map((technique) => (
                  <IconChip
                    key={technique.label}
                    item={technique}
                    className="text-xs"
                  />
                ))}
              </ul>
            </div>
          </div>
        </div>
      </FitToViewport>
    </section>
  );
}
