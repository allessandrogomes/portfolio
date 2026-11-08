"use client";

import { Fragment, useRef } from "react";
import Image from "next/image";
import Eyebrow from "@/components/Eyebrow";
import CompanyDeliveryEyebrow from "@/components/CompanyDeliveryEyebrow";
import FitToViewport from "@/components/FitToViewport";
import StrokeIcon from "@/components/StrokeIcon";
import {
  useSectionTransitions,
  type SectionSelector,
} from "@/hooks/useSectionTransitions";
import {
  ChatAuthor,
  IntegrationLogoKind,
  SUPPORT_CHAT_DELIVERY,
  type ChatMessage,
  type IntegrationLogo,
} from "@/data/experience";
import type { SectionTransitions } from "@/lib/sectionNavigation";
import { VISIBLE_STATE } from "@/lib/revealStates";
import {
  createRevealEnterTimeline,
  createRevealLeaveTimeline,
} from "@/lib/revealTransitions";
import { SectionAccent } from "@/lib/sectionAccents";

const SECTION_LABEL = "Chat de suporte";
const DELIVERY_EYEBROW = "Entrega 03";
const INTEGRATION_EYEBROW = "Integração";
const SAVINGS_PREFIX = "~US$ ";
const SAVINGS_TITLE = "Economia gerada para a empresa";
const SAVINGS_PERIOD = "/mês";
const SAVINGS_YEARLY_PREFIX = "≈ US$ ";
const SAVINGS_YEARLY_SUFFIX = " mil por ano";
const SAVINGS_ICON_PATH =
  "M12 3v18M16.5 7.5c0-1.7-2-3-4.5-3s-4.5 1.3-4.5 3 2 2.6 4.5 3 4.5 1.3 4.5 3-2 3-4.5 3-4.5-1.3-4.5-3";
const MONTHS_PER_YEAR = 12;
const THOUSAND = 1000;
const CHAT_CONTACT_NAME = "Suporte pede.ai";
const CHAT_CONTACT_STATUS = "online";
const PEDE_AI_ICON_SRC = "/icone-red.png";
const PEDE_AI_ICON_WIDTH = 943;
const PEDE_AI_ICON_HEIGHT = 873;
const INTEGRATION_LOGO_SIZES = "48px";
const CHAT_INPUT_PLACEHOLDER = "Digite uma mensagem";
const CHAT_PREVIEW_LABEL = "Ilustração do chat de suporte dentro do app";
const TYPING_DOTS = ["typing-first", "typing-second", "typing-third"];
const TYPING_DOT_DELAY_MS = 150;
const SEND_ICON_PATH = "M5 12h14M13 6l6 6-6 6";

const NUMBER_LOCALE = "pt-BR";
const savingsFormatter = new Intl.NumberFormat(NUMBER_LOCALE);

const PHONE_EASE = "power3.out";
const PHONE_START_SECONDS = 0.1;
const PHONE_DURATION_SECONDS = 1.2;
const PHONE_RISE_PX = 80;
const PHONE_TILT_DEGREES = 4;

const SAVINGS_EASE = "power3.out";
const SAVINGS_START_SECONDS = 0.5;
const SAVINGS_DURATION_SECONDS = 1.6;

const FLOW_EASE = "power2.inOut";
const FLOW_START_SECONDS = 0.7;
const FLOW_LINE_DURATION_SECONDS = 0.4;
const FLOW_LINE_STAGGER_SECONDS = 0.25;

const PACKET_LINE_DELAY_SECONDS = 0.3;
const BACKWARD_PACKET_OFFSET_SECONDS = 0.9;
const PACKETS_FADE_DURATION_SECONDS = 0.4;

const BUBBLE_EASE = "back.out(1.6)";
const BUBBLE_START_SECONDS = 1;
const BUBBLE_DURATION_SECONDS = 0.5;
const BUBBLE_STAGGER_SECONDS = 0.6;
const BUBBLE_RISE_PX = 16;
const BUBBLE_START_SCALE = 0.9;
const TYPING_DURATION_SECONDS = 0.3;

const LEAVE_TARGETS = "[data-reveal], [data-phone]";

function formatSavings(value: number): string {
  return savingsFormatter.format(Math.round(value));
}

function createSupportChatTransitions(
  select: SectionSelector,
): SectionTransitions {
  return {
    enter: (direction) => {
      const [savingsCounter] = select("[data-savings-value]");
      const savings = { value: 0 };

      return createRevealEnterTimeline(select("[data-reveal]"), direction)
        .fromTo(
          select("[data-phone]"),
          { y: PHONE_RISE_PX, rotation: PHONE_TILT_DEGREES, autoAlpha: 0 },
          {
            ...VISIBLE_STATE,
            y: 0,
            rotation: 0,
            autoAlpha: 1,
            duration: PHONE_DURATION_SECONDS,
            ease: PHONE_EASE,
          },
          PHONE_START_SECONDS,
        )
        .fromTo(
          savings,
          { value: 0 },
          {
            value: SUPPORT_CHAT_DELIVERY.monthlySavingsUsd,
            duration: SAVINGS_DURATION_SECONDS,
            ease: SAVINGS_EASE,
            onUpdate: () => {
              if (!savingsCounter) return;

              savingsCounter.textContent = formatSavings(savings.value);
            },
          },
          SAVINGS_START_SECONDS,
        )
        .fromTo(
          select("[data-flow-line]"),
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: FLOW_LINE_DURATION_SECONDS,
            ease: FLOW_EASE,
            stagger: FLOW_LINE_STAGGER_SECONDS,
          },
          FLOW_START_SECONDS,
        )
        .fromTo(
          select("[data-flow-packets]"),
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: PACKETS_FADE_DURATION_SECONDS },
        )
        .fromTo(
          select("[data-chat-bubble]"),
          { y: BUBBLE_RISE_PX, scale: BUBBLE_START_SCALE, autoAlpha: 0 },
          {
            y: 0,
            scale: 1,
            autoAlpha: 1,
            duration: BUBBLE_DURATION_SECONDS,
            ease: BUBBLE_EASE,
            stagger: BUBBLE_STAGGER_SECONDS,
          },
          BUBBLE_START_SECONDS,
        )
        .fromTo(
          select("[data-chat-typing]"),
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: TYPING_DURATION_SECONDS },
        );
    },
    leave: (direction) =>
      createRevealLeaveTimeline(select(LEAVE_TARGETS), direction),
  };
}

function IntegrationLogoMark({ logo }: { logo: IntegrationLogo }) {
  if (logo.kind === IntegrationLogoKind.VECTOR) {
    return (
      <svg
        aria-hidden
        viewBox={logo.viewBox}
        fill={logo.color}
        className="size-5 md:size-6"
      >
        <path d={logo.path} />
      </svg>
    );
  }

  const imageClassName = logo.isFullBleed
    ? "object-cover"
    : "object-contain p-2 md:p-2.5";

  return (
    <Image
      src={logo.src}
      alt=""
      fill
      sizes={INTEGRATION_LOGO_SIZES}
      className={imageClassName}
    />
  );
}

function getPacketDelay(index: number, offsetSeconds: number): string {
  return `${index * PACKET_LINE_DELAY_SECONDS + offsetSeconds}s`;
}

function FlowConnection({ index }: { index: number }) {
  return (
    <li aria-hidden className="relative mt-5 h-px flex-1 md:mt-6">
      <span
        data-flow-line
        className="absolute inset-0 origin-left bg-linear-to-r from-foreground/20 to-foreground/50"
      />
      <span data-flow-packets className="absolute inset-0 motion-reduce:hidden">
        <span
          style={{ animationDelay: getPacketDelay(index, 0) }}
          className="absolute inset-0 animate-packet-forward opacity-0"
        >
          <span className="absolute top-1/2 left-0 size-1.5 -translate-1/2 rounded-full bg-pede-ai shadow-[0_0_8px_2px_var(--color-pede-ai)]" />
        </span>
        <span
          style={{
            animationDelay: getPacketDelay(
              index,
              BACKWARD_PACKET_OFFSET_SECONDS,
            ),
          }}
          className="absolute inset-0 animate-packet-backward opacity-0"
        >
          <span className="absolute top-1/2 left-0 size-1.5 -translate-1/2 rounded-full bg-foreground shadow-[0_0_8px_2px_var(--color-foreground)]" />
        </span>
      </span>
    </li>
  );
}

function ChatBubble({ message }: { message: ChatMessage }) {
  const isFromCustomer = message.author === ChatAuthor.CUSTOMER;
  const alignmentClassName = isFromCustomer
    ? "origin-bottom-right self-end rounded-br-sm bg-pede-ai text-white"
    : "origin-bottom-left self-start rounded-bl-sm bg-foreground/10 text-foreground";

  return (
    <li
      data-chat-bubble
      className={`max-w-[80%] rounded-2xl px-3 py-2 text-xs leading-snug md:text-sm ${alignmentClassName}`}
    >
      {message.text}
    </li>
  );
}

function PhoneChatPreview() {
  return (
    <figure
      data-phone
      aria-label={CHAT_PREVIEW_LABEL}
      className="mx-auto w-64 rounded-[2.5rem] border border-foreground/15 bg-foreground/5 p-2.5 shadow-[0_30px_80px_-20px_rgb(255_51_51/0.3)] md:w-72"
    >
      <div className="flex h-[26rem] flex-col overflow-hidden rounded-[2rem] bg-[#141414] md:h-[30rem]">
        <div className="flex items-center gap-3 border-b border-foreground/10 px-4 pt-6 pb-3">
          <span
            aria-hidden
            className="relative flex size-9 items-center justify-center rounded-full bg-foreground/10"
          >
            <Image
              src={PEDE_AI_ICON_SRC}
              alt=""
              width={PEDE_AI_ICON_WIDTH}
              height={PEDE_AI_ICON_HEIGHT}
              className="h-auto w-5"
            />
          </span>
          <div>
            <p className="text-sm font-semibold">{CHAT_CONTACT_NAME}</p>
            <p className="flex items-center gap-1.5 text-xs text-muted">
              <span
                aria-hidden
                className="size-1.5 rounded-full bg-green-500"
              />
              {CHAT_CONTACT_STATUS}
            </p>
          </div>
        </div>

        <ul className="flex flex-1 flex-col justify-end gap-2 p-4">
          {SUPPORT_CHAT_DELIVERY.chatPreview.map((message) => (
            <ChatBubble key={message.text} message={message} />
          ))}
          <li
            data-chat-typing
            aria-hidden
            className="flex gap-1 self-start rounded-2xl rounded-bl-sm bg-foreground/10 px-3 py-3"
          >
            {TYPING_DOTS.map((dot, index) => (
              <span
                key={dot}
                style={{ animationDelay: `${index * TYPING_DOT_DELAY_MS}ms` }}
                className="size-1.5 animate-bounce rounded-full bg-foreground/60"
              />
            ))}
          </li>
        </ul>

        <div className="flex items-center gap-2 border-t border-foreground/10 p-3">
          <span className="flex-1 rounded-full bg-foreground/5 px-4 py-2 text-xs text-muted">
            {CHAT_INPUT_PLACEHOLDER}
          </span>
          <span className="flex size-8 items-center justify-center rounded-full bg-pede-ai text-white">
            <StrokeIcon path={SEND_ICON_PATH} className="size-4" />
          </span>
        </div>
      </div>
    </figure>
  );
}

export default function SupportChatDelivery() {
  const sectionRef = useRef<HTMLElement>(null);
  const { integrationNodes } = SUPPORT_CHAT_DELIVERY;
  const lastNodeIndex = integrationNodes.length - 1;

  useSectionTransitions(sectionRef, createSupportChatTransitions);

  return (
    <section
      ref={sectionRef}
      data-section
      data-section-label={SECTION_LABEL}
      data-section-accent={SectionAccent.PEDE_AI}
      aria-labelledby="support-chat-heading"
      className="absolute inset-0 overflow-hidden bg-background"
    >
      <FitToViewport>
        <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-6 py-10 md:grid-cols-[3fr_2fr] md:gap-20 md:px-12">
          <div className="flex flex-col gap-4 md:gap-6">
            <CompanyDeliveryEyebrow deliveryLabel={DELIVERY_EYEBROW} />
            <h2
              data-reveal
              id="support-chat-heading"
              className="font-display text-5xl leading-none uppercase md:text-8xl"
            >
              {SUPPORT_CHAT_DELIVERY.title}
            </h2>
            <p data-reveal className="text-sm text-foreground/70 md:text-base">
              {SUPPORT_CHAT_DELIVERY.summary}
            </p>

            <div
              data-reveal
              className="flex items-center gap-4 rounded-2xl border border-emerald-400/30 bg-emerald-400/5 p-4 md:gap-5 md:p-5"
            >
              <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-emerald-400/15 text-emerald-400 md:size-14">
                <StrokeIcon
                  path={SAVINGS_ICON_PATH}
                  className="size-6 md:size-7"
                />
              </span>
              <div className="flex min-w-0 flex-col gap-1">
                <p className="text-[10px] font-semibold tracking-[0.25em] text-muted uppercase md:text-xs">
                  {SAVINGS_TITLE}
                </p>
                <p className="flex items-baseline gap-1 font-display leading-none text-emerald-400">
                  <span className="text-4xl md:text-6xl">
                    {SAVINGS_PREFIX}
                    <span data-savings-value>
                      {formatSavings(SUPPORT_CHAT_DELIVERY.monthlySavingsUsd)}
                    </span>
                  </span>
                  <span className="text-xl md:text-2xl">{SAVINGS_PERIOD}</span>
                </p>
                <p className="text-xs text-muted md:text-sm">
                  {SAVINGS_YEARLY_PREFIX}
                  {formatSavings(
                    (SUPPORT_CHAT_DELIVERY.monthlySavingsUsd *
                      MONTHS_PER_YEAR) /
                      THOUSAND,
                  )}
                  {SAVINGS_YEARLY_SUFFIX}
                </p>
              </div>
            </div>

            <div className="mt-2 flex flex-col gap-4">
              <Eyebrow>{INTEGRATION_EYEBROW}</Eyebrow>
              <ol data-reveal className="flex items-start">
                {integrationNodes.map((node, index) => {
                  const isDestination = index === lastNodeIndex;
                  const nodeBorderClassName = isDestination
                    ? "border-pede-ai/60"
                    : "border-foreground/15";

                  return (
                    <Fragment key={node.name}>
                      <li className="flex w-16 shrink-0 flex-col items-center gap-2 text-center md:w-20">
                        <span
                          className={`relative flex size-10 items-center justify-center overflow-hidden rounded-full border bg-foreground/5 md:size-12 ${nodeBorderClassName}`}
                        >
                          <IntegrationLogoMark logo={node.logo} />
                        </span>
                        <span className="text-[10px] leading-tight text-foreground/80 md:text-xs">
                          {node.name}
                        </span>
                      </li>
                      {!isDestination && <FlowConnection index={index} />}
                    </Fragment>
                  );
                })}
              </ol>
            </div>
          </div>

          <PhoneChatPreview />
        </div>
      </FitToViewport>
    </section>
  );
}
