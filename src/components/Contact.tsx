"use client";

import { useRef, type ReactNode } from "react";
import Image from "next/image";
import Eyebrow from "@/components/Eyebrow";
import FitToViewport from "@/components/FitToViewport";
import StrokeIcon from "@/components/StrokeIcon";
import {
  useSectionTransitions,
  type SectionSelector,
} from "@/hooks/useSectionTransitions";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import {
  CONTACT,
  type ContactChannel,
  type SocialProfile,
} from "@/data/contact";
import type { SectionTransitions } from "@/lib/sectionNavigation";
import { VISIBLE_STATE } from "@/lib/revealStates";
import {
  createRevealEnterTimeline,
  createRevealLeaveTimeline,
} from "@/lib/revealTransitions";

const SECTION_LABEL = "Contato";
const WORD_SEPARATOR = " ";
const RESUME_LABEL = "Ver currículo";
const RESUME_ARIA_LABEL = "Ver currículo no Google Drive (abre em nova aba)";
const COPY_LABEL = "Copiar e-mail";
const COPIED_LABEL = "Copiado!";
const NEW_TAB_SUFFIX = " (abre em nova aba)";
const LOGO_SIZE_PX = 24;
const LOGO_SIZES = "32px";
const ARROW_ICON_PATH = "M7 17L17 7M9 7h8v8";
const COPY_ICON_PATH =
  "M9 9h11v11H9zM5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1";
const CHECK_ICON_PATH = "M5 12l5 5L20 7";
const DOCUMENT_ICON_PATH =
  "M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8zM14 3v5h5M9 13h6M9 17h6";

const MASK_HIDDEN_PERCENT = 110;
const WORD_EASE = "power4.out";
const WORD_DURATION_SECONDS = 1;
const WORD_STAGGER_SECONDS = 0.08;

const CARD_EASE = "power3.out";
const CARD_START_SECONDS = 0.5;
const CARD_DURATION_SECONDS = 0.8;
const CARD_STAGGER_SECONDS = 0.1;
const CARD_RISE_PX = 30;

const LEAVE_TARGETS = "[data-reveal], [data-contact-card]";

function createContactTransitions(select: SectionSelector): SectionTransitions {
  return {
    enter: (direction) =>
      createRevealEnterTimeline(select("[data-reveal]"), direction)
        .fromTo(
          select("[data-heading-word]"),
          { yPercent: MASK_HIDDEN_PERCENT },
          {
            yPercent: 0,
            duration: WORD_DURATION_SECONDS,
            ease: WORD_EASE,
            stagger: WORD_STAGGER_SECONDS,
          },
          0,
        )
        .fromTo(
          select("[data-contact-card]"),
          { y: CARD_RISE_PX, autoAlpha: 0 },
          {
            ...VISIBLE_STATE,
            duration: CARD_DURATION_SECONDS,
            ease: CARD_EASE,
            stagger: CARD_STAGGER_SECONDS,
          },
          CARD_START_SECONDS,
        ),
    leave: (direction) => createRevealLeaveTimeline(select(LEAVE_TARGETS), direction),
  };
}

function getExternalLinkProps(isExternal: boolean) {
  if (!isExternal) return {};

  return { target: "_blank", rel: "noopener noreferrer" };
}

function AnimatedHeading() {
  const words = CONTACT.heading.split(WORD_SEPARATOR);

  return (
    <h2
      data-reveal
      id="contact-heading"
      aria-label={CONTACT.heading}
      className="font-display text-6xl leading-none uppercase md:text-9xl"
    >
      {words.map((word, index) => (
        <span key={`${word}-${index}`} aria-hidden>
          <span className="-my-3 inline-block overflow-hidden py-3 align-top">
            <span data-heading-word className="inline-block">
              {word}
            </span>
          </span>
          {WORD_SEPARATOR}
        </span>
      ))}
    </h2>
  );
}

function ChannelLogo({ logoSrc }: { logoSrc: string }) {
  return (
    <span className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-foreground/10 bg-background transition-[scale] duration-300 group-hover/card:scale-110">
      <Image
        src={logoSrc}
        alt=""
        width={LOGO_SIZE_PX}
        height={LOGO_SIZE_PX}
        sizes={LOGO_SIZES}
        className="size-6"
      />
    </span>
  );
}

function ChannelCard({
  channel,
  action,
}: {
  channel: ContactChannel;
  action?: ReactNode;
}) {
  const newTabSuffix = channel.isExternal ? NEW_TAB_SUFFIX : "";

  return (
    <li
      data-contact-card
      className="group/card relative flex items-center gap-4 rounded-2xl border border-foreground/10 bg-foreground/5 p-4 transition-[border-color,background-color,translate] duration-300 hover:-translate-y-1 hover:border-foreground/30 hover:bg-foreground/10"
    >
      <ChannelLogo logoSrc={channel.logoSrc} />
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="text-xs font-semibold tracking-[0.25em] text-muted uppercase">
          {channel.label}
        </span>
        <a
          href={channel.href}
          aria-label={`${channel.label}: ${channel.value}${newTabSuffix}`}
          {...getExternalLinkProps(channel.isExternal)}
          className="truncate text-sm font-semibold after:absolute after:inset-0 after:rounded-2xl focus-visible:outline-none md:text-base"
        >
          {channel.value}
        </a>
      </div>
      {action ?? (
        <StrokeIcon
          path={ARROW_ICON_PATH}
          className="size-5 shrink-0 text-muted transition duration-300 group-hover/card:translate-x-0.5 group-hover/card:-translate-y-0.5 group-hover/card:text-foreground"
        />
      )}
    </li>
  );
}

function CopyEmailButton() {
  const { hasCopied, copy } = useCopyToClipboard();

  return (
    <button
      type="button"
      onClick={() => copy(CONTACT.email.value)}
      aria-label={COPY_LABEL}
      title={COPY_LABEL}
      className="relative z-10 flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full border border-foreground/20 transition hover:bg-foreground hover:text-background"
    >
      <StrokeIcon
        path={hasCopied ? CHECK_ICON_PATH : COPY_ICON_PATH}
        className="size-4"
      />
      <span
        aria-live="polite"
        className={`pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 rounded-md bg-foreground px-2 py-1 text-xs font-semibold whitespace-nowrap text-background transition duration-200 ${hasCopied ? "opacity-100" : "translate-y-1 opacity-0"}`}
      >
        {hasCopied ? COPIED_LABEL : ""}
      </span>
    </button>
  );
}

function SocialLink({ profile }: { profile: SocialProfile }) {
  return (
    <li data-contact-card>
      <a
        href={profile.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${profile.name}${NEW_TAB_SUFFIX}`}
        className="flex size-14 items-center justify-center rounded-full border border-foreground/15 transition-[border-color,background-color,scale] duration-300 hover:scale-110 hover:border-foreground/40 hover:bg-foreground/10"
      >
        <Image
          src={profile.logoSrc}
          alt=""
          width={LOGO_SIZE_PX}
          height={LOGO_SIZE_PX}
          sizes={LOGO_SIZES}
          className="size-6"
        />
      </a>
    </li>
  );
}

function ResumeButton() {
  if (!CONTACT.resumeUrl) return null;

  return (
    <a
      data-contact-card
      href={CONTACT.resumeUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={RESUME_ARIA_LABEL}
      className="group/resume flex h-14 items-center gap-3 rounded-full bg-foreground px-7 font-semibold text-background transition-[scale,box-shadow] duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgb(242_240_235/0.35)]"
    >
      <StrokeIcon path={DOCUMENT_ICON_PATH} className="size-5" />
      {RESUME_LABEL}
      <StrokeIcon
        path={ARROW_ICON_PATH}
        className="size-4 transition duration-300 group-hover/resume:translate-x-0.5 group-hover/resume:-translate-y-0.5"
      />
    </a>
  );
}

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);

  useSectionTransitions(sectionRef, createContactTransitions);

  return (
    <section
      ref={sectionRef}
      data-section
      data-section-label={SECTION_LABEL}
      aria-labelledby="contact-heading"
      className="absolute inset-0 overflow-hidden bg-background"
    >
      <FitToViewport>
        <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-8 px-6 py-10 text-center md:gap-10 md:px-12">
          <div className="flex flex-col items-center gap-4">
            <Eyebrow>{CONTACT.eyebrow}</Eyebrow>
            <AnimatedHeading />
            <p
              data-reveal
              className="max-w-xl text-sm text-foreground/70 md:text-lg"
            >
              {CONTACT.description}
            </p>
          </div>

          <ul className="grid w-full max-w-3xl gap-3 text-left md:grid-cols-[3fr_2fr]">
            <ChannelCard channel={CONTACT.email} action={<CopyEmailButton />} />
            <ChannelCard channel={CONTACT.whatsapp} />
          </ul>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <ResumeButton />
            <ul className="flex gap-3">
              {CONTACT.socials.map((profile) => (
                <SocialLink key={profile.name} profile={profile} />
              ))}
            </ul>
          </div>

          <p data-reveal className="mt-4 text-xs text-muted">
            {CONTACT.footer}
          </p>
        </div>
      </FitToViewport>
    </section>
  );
}
