"use client";

import { useRef } from "react";
import CompanyDeliveryEyebrow from "@/components/CompanyDeliveryEyebrow";
import FitToViewport from "@/components/FitToViewport";
import StrokeIcon from "@/components/StrokeIcon";
import {
  GenerationPhase,
  useBatchGeneration,
} from "@/hooks/useBatchGeneration";
import {
  useSectionTransitions,
  type SectionSelector,
} from "@/hooks/useSectionTransitions";
import {
  ART_GENERATOR_DELIVERY,
  PillarIconKind,
  type PillarIcon,
} from "@/data/experience";
import { getBrandColor } from "@/lib/brandColor";
import type { SectionTransitions } from "@/lib/sectionNavigation";
import { VISIBLE_STATE } from "@/lib/revealStates";
import {
  createRevealEnterTimeline,
  createRevealLeaveTimeline,
} from "@/lib/revealTransitions";
import { SectionAccent } from "@/lib/sectionAccents";

const SECTION_LABEL = "Gerador de artes";
const DELIVERY_EYEBROW = "Entrega 04";
const EDITOR_TITLE = "Gerador de artes";
const EDITOR_LABEL =
  "Ilustração do editor de artes, com uma arte promocional sendo editada e replicada em lote";
const BATCH_BADGE = "1 arte → milhares de lojas";
const BATCH_TOTAL_ARTS = 1000;
const BATCH_FLYER_COUNT = 8;
const BATCH_FLYERS = Array.from(
  { length: BATCH_FLYER_COUNT },
  (_, index) => `flyer-${index}`,
);
const FULL_PERCENT = 100;
const NUMBER_LOCALE = "pt-BR";
const artCountFormatter = new Intl.NumberFormat(NUMBER_LOCALE);
const GENERATING_STATUS_PREFIX = "Gerando ";
const GENERATING_STATUS_SEPARATOR = " de ";
const ARTS_SUFFIX = " artes";
const DONE_STATUS_PREFIX = "✓ ";
const DONE_STATUS_SUFFIX = " artes geradas";
const GENERATE_HINT = "Clique para gerar";
const POINT_UP_ICON_PATH = "M12 19V5M5 12l7-7 7 7";
const GENERATE_BUTTON_LABELS: Record<GenerationPhase, string> = {
  [GenerationPhase.IDLE]: "Gerar em lote",
  [GenerationPhase.GENERATING]: "Gerando…",
  [GenerationPhase.DONE]: "Gerar novamente",
};
const ART_EYEBROW = "Promoção";
const ART_HEADLINE = "20% OFF";
const ART_CAPTION = "em pedidos pelo app";
const ART_LOGO_PLACEHOLDER = "Logo";
const BROWSER_DOTS = ["dot-close", "dot-minimize", "dot-expand"];
const ICON_VIEW_BOX = "0 0 24 24";

const EDITOR_TOOLS = [
  { name: "texto", path: "M5 6h14M12 6v13", isActive: false },
  {
    name: "imagem",
    path: "M4 5h16v14H4zM4 15l4-4 4 4 3-3 5 5",
    isActive: true,
  },
  {
    name: "qr-code",
    path: "M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h2v2h-2zM18 18h2v2h-2z",
    isActive: false,
  },
  {
    name: "forma",
    path: "M12 3a9 9 0 1 0 0 18a9 9 0 0 0 0-18z",
    isActive: false,
  },
];

const TRANSFORMER_ANCHORS = [
  "top-0 left-0",
  "top-0 left-1/2",
  "top-0 left-full",
  "top-1/2 left-0",
  "top-1/2 left-full",
  "top-full left-0",
  "top-full left-1/2",
  "top-full left-full",
];

const QR_GRID_SIZE = 11;
const QR_VIEW_BOX = `0 0 ${QR_GRID_SIZE} ${QR_GRID_SIZE}`;
const QR_FINDER_SIZE = 3;
const QR_PATTERN_ROW_WEIGHT = 7;
const QR_PATTERN_COLUMN_WEIGHT = 11;
const QR_PATTERN_MODULO = 3;

const BATCH_COPIES = ["copy-first", "copy-second", "copy-third"];
const COPY_OFFSET_X_PX = 22;
const COPY_OFFSET_Y_PX = 10;
const COPY_ROTATION_DEGREES = 5;
const COPY_OPACITY_STEP = 0.25;

const EDITOR_EASE = "power3.out";
const EDITOR_START_SECONDS = 0.1;
const EDITOR_DURATION_SECONDS = 1.2;
const EDITOR_RISE_PX = 60;

const ELEMENT_EASE = "back.out(1.7)";
const ELEMENT_START_SECONDS = 0.6;
const ELEMENT_DURATION_SECONDS = 0.5;
const ELEMENT_STAGGER_SECONDS = 0.12;
const ELEMENT_START_SCALE = 0.8;

const TRANSFORMER_START_SECONDS = 1.3;
const TRANSFORMER_DURATION_SECONDS = 0.2;

const DRAG_EASE = "power2.inOut";
const DRAG_START_SECONDS = 1.4;
const DRAG_DURATION_SECONDS = 0.8;
const DRAG_OFFSET_X_PX = -40;
const DRAG_OFFSET_Y_PX = -50;

const BATCH_EASE = "power3.out";
const BATCH_START_SECONDS = 2.2;
const BATCH_DURATION_SECONDS = 0.7;
const BATCH_STAGGER_SECONDS = 0.12;
const BADGE_DURATION_SECONDS = 0.4;
const BADGE_RISE_PX = 8;
const HINT_START_SECONDS = 4;
const HINT_FADE_DURATION_SECONDS = 0.4;

const LEAVE_TARGETS = "[data-reveal], [data-editor]";

interface QrCell {
  row: number;
  column: number;
}

function isInsideFinder(row: number, column: number): boolean {
  const lastFinderStart = QR_GRID_SIZE - QR_FINDER_SIZE;
  const isTop = row < QR_FINDER_SIZE;
  const isLeft = column < QR_FINDER_SIZE;
  const isBottom = row >= lastFinderStart;
  const isRight = column >= lastFinderStart;

  return (isTop && isLeft) || (isTop && isRight) || (isBottom && isLeft);
}

function isFinderSeparator(row: number, column: number): boolean {
  const isNearTop = row === QR_FINDER_SIZE;
  const isNearLeft = column === QR_FINDER_SIZE;
  const isNearBottom = row === QR_GRID_SIZE - QR_FINDER_SIZE - 1;
  const isNearRight = column === QR_GRID_SIZE - QR_FINDER_SIZE - 1;
  const isTopBand = row <= QR_FINDER_SIZE;
  const isLeftBand = column <= QR_FINDER_SIZE;
  const isBottomBand = row >= QR_GRID_SIZE - QR_FINDER_SIZE - 1;
  const isRightBand = column >= QR_GRID_SIZE - QR_FINDER_SIZE - 1;

  return (
    (isTopBand && isLeftBand && (isNearTop || isNearLeft)) ||
    (isTopBand && isRightBand && (isNearTop || isNearRight)) ||
    (isBottomBand && isLeftBand && (isNearBottom || isNearLeft))
  );
}

function isPatternCell(row: number, column: number): boolean {
  const seed =
    row * QR_PATTERN_ROW_WEIGHT + column * QR_PATTERN_COLUMN_WEIGHT + row * column;

  return seed % QR_PATTERN_MODULO === 0;
}

function createQrCells(): QrCell[] {
  const indexes = Array.from({ length: QR_GRID_SIZE }, (_, index) => index);

  return indexes.flatMap((row) =>
    indexes
      .filter((column) => {
        if (isInsideFinder(row, column)) return true;
        if (isFinderSeparator(row, column)) return false;

        return isPatternCell(row, column);
      })
      .map((column) => ({ row, column })),
  );
}

const QR_CELLS = createQrCells();

function getCopyOffsetX(index: number): number {
  return (index + 1) * COPY_OFFSET_X_PX;
}

function getCopyOffsetY(index: number): number {
  return -(index + 1) * COPY_OFFSET_Y_PX;
}

function getCopyRotation(index: number): number {
  return (index + 1) * COPY_ROTATION_DEGREES;
}

function getCopyOpacity(index: number): number {
  return 1 - (index + 1) * COPY_OPACITY_STEP;
}

function getCopyTransform(index: number): string {
  return `translate(${getCopyOffsetX(index)}px, ${getCopyOffsetY(index)}px) rotate(${getCopyRotation(index)}deg)`;
}

function createArtGeneratorTransitions(
  select: SectionSelector,
): SectionTransitions {
  return {
    enter: (direction) =>
      createRevealEnterTimeline(select("[data-reveal]"), direction)
        .fromTo(
          select("[data-editor]"),
          { y: EDITOR_RISE_PX, autoAlpha: 0 },
          {
            ...VISIBLE_STATE,
            y: 0,
            autoAlpha: 1,
            duration: EDITOR_DURATION_SECONDS,
            ease: EDITOR_EASE,
          },
          EDITOR_START_SECONDS,
        )
        .fromTo(
          select("[data-art-element]"),
          { scale: ELEMENT_START_SCALE, autoAlpha: 0 },
          {
            scale: 1,
            autoAlpha: 1,
            duration: ELEMENT_DURATION_SECONDS,
            ease: ELEMENT_EASE,
            stagger: ELEMENT_STAGGER_SECONDS,
          },
          ELEMENT_START_SECONDS,
        )
        .fromTo(
          select("[data-transformer]"),
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: TRANSFORMER_DURATION_SECONDS },
          TRANSFORMER_START_SECONDS,
        )
        .fromTo(
          select("[data-art-logo]"),
          { x: DRAG_OFFSET_X_PX, y: DRAG_OFFSET_Y_PX },
          {
            x: 0,
            y: 0,
            duration: DRAG_DURATION_SECONDS,
            ease: DRAG_EASE,
          },
          DRAG_START_SECONDS,
        )
        .fromTo(
          select("[data-art-copy]"),
          { x: 0, y: 0, rotation: 0, autoAlpha: 0 },
          {
            x: getCopyOffsetX,
            y: getCopyOffsetY,
            rotation: getCopyRotation,
            autoAlpha: getCopyOpacity,
            duration: BATCH_DURATION_SECONDS,
            ease: BATCH_EASE,
            stagger: BATCH_STAGGER_SECONDS,
          },
          BATCH_START_SECONDS,
        )
        .fromTo(
          select("[data-batch-badge]"),
          { autoAlpha: 0, y: BADGE_RISE_PX },
          { autoAlpha: 1, y: 0, duration: BADGE_DURATION_SECONDS },
        )
        .fromTo(
          select("[data-generate-hint]"),
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: HINT_FADE_DURATION_SECONDS },
          HINT_START_SECONDS,
        ),
    leave: (direction) => createRevealLeaveTimeline(select(LEAVE_TARGETS), direction),
  };
}

function PillarIconMark({ icon }: { icon: PillarIcon }) {
  if (icon.kind === PillarIconKind.STROKE) {
    return <StrokeIcon path={icon.path} className="size-5 text-pede-ai" />;
  }

  return (
    <svg
      aria-hidden
      viewBox={ICON_VIEW_BOX}
      fill={getBrandColor(icon.icon)}
      className="size-5"
    >
      <path d={icon.icon.path} />
    </svg>
  );
}

function QrCode() {
  return (
    <svg aria-hidden viewBox={QR_VIEW_BOX} className="size-full">
      {QR_CELLS.map(({ row, column }) => (
        <rect
          key={`${row}-${column}`}
          x={column}
          y={row}
          width={1}
          height={1}
          className="fill-background"
        />
      ))}
    </svg>
  );
}

function Transformer() {
  return (
    <span
      data-transformer
      aria-hidden
      className="pointer-events-none absolute -inset-1.5 border border-konva"
    >
      <span className="absolute bottom-full left-1/2 h-3 w-px -translate-x-1/2 bg-konva" />
      <span className="absolute bottom-full left-1/2 mb-3 size-2 -translate-x-1/2 rounded-full border border-konva bg-white" />
      {TRANSFORMER_ANCHORS.map((position) => (
        <span
          key={position}
          className={`absolute size-1.5 -translate-1/2 border border-konva bg-white ${position}`}
        />
      ))}
    </span>
  );
}

function ArtCanvas() {
  return (
    <div className="relative aspect-[4/5] w-40 md:w-48">
      {BATCH_COPIES.map((copy, index) => (
        <span
          key={copy}
          data-art-copy
          aria-hidden
          style={{
            transform: getCopyTransform(index),
            opacity: getCopyOpacity(index),
            zIndex: BATCH_COPIES.length - index,
          }}
          className="absolute inset-0 rounded-lg border border-white/10 bg-pede-ai/80"
        />
      ))}

      {BATCH_FLYERS.map((flyer) => (
        <span
          key={flyer}
          data-batch-flyer
          aria-hidden
          className="invisible absolute inset-0 z-[5] flex flex-col justify-between rounded-lg bg-pede-ai p-3 shadow-lg"
        >
          <span className="h-2 w-1/2 rounded-full bg-white/70" />
          <span className="flex items-end justify-between">
            <span className="size-8 rounded-full bg-white" />
            <span className="size-9 rounded-sm bg-white" />
          </span>
        </span>
      ))}

      <div className="absolute inset-0 z-10 flex flex-col rounded-lg bg-linear-to-br from-pede-ai to-[#b91c1c] p-4 shadow-2xl">
        <p
          data-art-element
          className="text-[9px] font-semibold tracking-[0.3em] text-white/80 uppercase"
        >
          {ART_EYEBROW}
        </p>
        <p
          data-art-element
          className="mt-1 font-display text-4xl leading-none text-white md:text-5xl"
        >
          {ART_HEADLINE}
        </p>
        <p data-art-element className="mt-1 text-[9px] text-white/80">
          {ART_CAPTION}
        </p>

        <div className="mt-auto flex items-end justify-between">
          <div data-art-logo className="relative">
            <span
              data-art-element
              className="flex size-11 items-center justify-center rounded-full bg-white font-display text-[10px] text-pede-ai uppercase md:size-12"
            >
              {ART_LOGO_PLACEHOLDER}
            </span>
            <Transformer />
          </div>
          <span
            data-art-element
            className="size-12 rounded-md bg-white p-1 md:size-14"
          >
            <QrCode />
          </span>
        </div>
      </div>
    </div>
  );
}

function GenerateButton({
  phase,
  onGenerate,
}: {
  phase: GenerationPhase;
  onGenerate: () => void;
}) {
  const isIdle = phase === GenerationPhase.IDLE;
  const isGenerating = phase === GenerationPhase.GENERATING;
  const label = GENERATE_BUTTON_LABELS[phase];

  return (
    <div className="relative">
      {isIdle && (
        <span
          data-generate-hint
          aria-hidden
          className="absolute inset-0 rounded-md bg-pede-ai opacity-60 motion-safe:animate-ping"
        />
      )}
      <button
        type="button"
        onClick={onGenerate}
        disabled={isGenerating}
        className="relative flex cursor-pointer items-center gap-1.5 rounded-md bg-pede-ai px-2.5 py-1 text-[10px] font-semibold text-white transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pede-ai active:scale-95 disabled:cursor-wait md:text-xs"
      >
        {isGenerating && (
          <span
            aria-hidden
            className="size-2.5 animate-spin rounded-full border border-white/40 border-t-white"
          />
        )}
        {label}
      </button>
      {isIdle && (
        <span
          data-generate-hint
          aria-hidden
          className="pointer-events-none absolute top-full right-0 z-20 mt-3 flex items-center gap-1 rounded-full bg-foreground px-2.5 py-1 text-[10px] font-semibold whitespace-nowrap text-background motion-safe:animate-bounce md:text-xs"
        >
          <StrokeIcon path={POINT_UP_ICON_PATH} className="size-3" />
          {GENERATE_HINT}
        </span>
      )}
    </div>
  );
}

function BatchStatus({
  phase,
  generatedCount,
}: {
  phase: GenerationPhase;
  generatedCount: number;
}) {
  const progressPercent = (generatedCount / BATCH_TOTAL_ARTS) * FULL_PERCENT;
  const formattedTotal = artCountFormatter.format(BATCH_TOTAL_ARTS);

  if (phase === GenerationPhase.GENERATING) {
    return (
      <span className="flex flex-col gap-1">
        {GENERATING_STATUS_PREFIX}
        {artCountFormatter.format(generatedCount)}
        {GENERATING_STATUS_SEPARATOR}
        {formattedTotal}
        {ARTS_SUFFIX}
        <span className="h-0.5 overflow-hidden rounded-full bg-foreground/15">
          <span
            style={{ width: `${progressPercent}%` }}
            className="block h-full rounded-full bg-pede-ai"
          />
        </span>
      </span>
    );
  }

  if (phase === GenerationPhase.DONE) {
    return (
      <span className="text-foreground">
        {DONE_STATUS_PREFIX}
        {formattedTotal}
        {DONE_STATUS_SUFFIX}
      </span>
    );
  }

  return BATCH_BADGE;
}

function EditorPreview() {
  const editorRef = useRef<HTMLElement>(null);
  const { phase, generatedCount, startGeneration } = useBatchGeneration(
    editorRef,
    BATCH_TOTAL_ARTS,
  );

  return (
    <figure
      ref={editorRef}
      data-editor
      aria-label={EDITOR_LABEL}
      className="overflow-hidden rounded-xl border border-foreground/10 bg-foreground/5 shadow-[0_30px_80px_-20px_rgb(13_131_205/0.3)]"
    >
      <div className="flex items-center gap-3 border-b border-foreground/10 px-3 py-2">
        <div aria-hidden className="flex gap-1.5">
          {BROWSER_DOTS.map((dot) => (
            <span key={dot} className="size-2.5 rounded-full bg-foreground/20" />
          ))}
        </div>
        <span className="flex-1 text-xs text-muted">{EDITOR_TITLE}</span>
        <GenerateButton phase={phase} onGenerate={startGeneration} />
      </div>

      <div className="flex">
        <ul
          aria-hidden
          className="flex flex-col items-center gap-2 border-r border-foreground/10 p-2"
        >
          {EDITOR_TOOLS.map((tool) => {
            const toolClassName = tool.isActive
              ? "bg-konva/20 text-konva"
              : "text-muted";

            return (
              <li
                key={tool.name}
                className={`flex size-8 items-center justify-center rounded-md ${toolClassName}`}
              >
                <StrokeIcon path={tool.path} className="size-4" />
              </li>
            );
          })}
        </ul>

        <div className="relative isolate flex flex-1 items-center justify-center bg-[radial-gradient(circle,rgb(255_255_255/0.08)_1px,transparent_1px)] bg-size-[16px_16px] px-6 pt-12 pb-14 md:pb-16">
          <ArtCanvas />
          <span
            data-batch-badge
            className="absolute bottom-3 left-1/2 z-20 -translate-x-1/2 rounded-full border border-foreground/15 bg-background/80 px-3 py-1 text-center text-[10px] whitespace-nowrap text-foreground/80 tabular-nums md:text-xs"
          >
            <BatchStatus phase={phase} generatedCount={generatedCount} />
          </span>
        </div>
      </div>
    </figure>
  );
}

export default function ArtGeneratorDelivery() {
  const sectionRef = useRef<HTMLElement>(null);

  useSectionTransitions(sectionRef, createArtGeneratorTransitions);

  return (
    <section
      ref={sectionRef}
      data-section
      data-section-label={SECTION_LABEL}
      data-section-accent={SectionAccent.PEDE_AI}
      aria-labelledby="art-generator-heading"
      className="absolute inset-0 overflow-hidden bg-background"
    >
      <FitToViewport>
        <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-6 py-10 md:grid-cols-2 md:gap-16 md:px-12">
          <div className="flex flex-col gap-4 md:gap-6">
            <CompanyDeliveryEyebrow deliveryLabel={DELIVERY_EYEBROW} />
            <h2
              data-reveal
              id="art-generator-heading"
              className="font-display text-5xl leading-none uppercase md:text-8xl"
            >
              {ART_GENERATOR_DELIVERY.title}
            </h2>
            <p data-reveal className="text-sm text-foreground/70 md:text-base">
              {ART_GENERATOR_DELIVERY.summary}
            </p>

            <ul className="mt-2 flex flex-col gap-4">
              {ART_GENERATOR_DELIVERY.pillars.map((pillar) => (
                <li key={pillar.title} data-reveal className="flex gap-4">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-foreground/15 bg-foreground/5">
                    <PillarIconMark icon={pillar.icon} />
                  </span>
                  <div>
                    <p className="font-semibold md:text-lg">{pillar.title}</p>
                    <p className="text-sm text-muted">{pillar.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <EditorPreview />
        </div>
      </FitToViewport>
    </section>
  );
}
