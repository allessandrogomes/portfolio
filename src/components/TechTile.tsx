"use client";

import type { CSSProperties } from "react";
import type { Technology } from "@/data/technologies";
import { useTilt } from "@/hooks/useTilt";
import { getBrandColor } from "@/lib/brandColor";

const GLARE_GRADIENT =
  "radial-gradient(circle at var(--glare-x, 50%) var(--glare-y, 50%), rgb(255 255 255 / 0.18), transparent 60%)";

const ICON_VIEW_BOX = "0 0 24 24";

function TechIcon({
  technology,
  color,
}: {
  technology: Technology;
  color: string;
}) {
  if (!technology.icon) {
    return (
      <span className="flex size-full items-center justify-center rounded-md border border-foreground/60 font-display text-xl leading-none md:text-2xl">
        {technology.monogram}
      </span>
    );
  }

  return (
    <svg
      viewBox={ICON_VIEW_BOX}
      fill={color}
      className="size-full"
    >
      <path d={technology.icon.path} />
    </svg>
  );
}

export default function TechTile({ technology }: { technology: Technology }) {
  const { cardRef: tiltRef, tiltHandlers } = useTilt<HTMLDivElement>();
  const brandColor = getBrandColor(technology.icon);
  const brandColorStyle: CSSProperties & Record<"--brand-color", string> = {
    "--brand-color": brandColor,
  };

  return (
    <li data-tech-tile data-wave-item className="w-13 md:w-24">
      <div
        data-tech-card
        style={brandColorStyle}
        className="group/card -m-2 transition duration-300 ease-out perspective-normal hover:-translate-y-2 hover:scale-110 hover:opacity-100! active:-translate-y-2 active:scale-110 md:-m-3 [@media(hover:hover)]:group-has-[[data-tech-card]:hover]/stack:opacity-35"
      >
        <div
          ref={tiltRef}
          {...tiltHandlers}
          className="relative flex flex-col items-center gap-1.5 rounded-xl border border-transparent p-2 text-center transition-colors duration-300 group-hover/card:border-foreground/10 group-hover/card:bg-foreground/5 group-active/card:border-foreground/10 group-active/card:bg-foreground/5 md:gap-2 md:p-3"
        >
          <span
            aria-hidden
            style={{ backgroundImage: GLARE_GRADIENT }}
            className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover/card:opacity-100 group-active/card:opacity-100"
          />
          <span
            aria-hidden
            className="size-7 transition-[filter] duration-300 group-hover/card:drop-shadow-[0_0_14px_var(--brand-color)] group-active/card:drop-shadow-[0_0_14px_var(--brand-color)] md:size-11"
          >
            <TechIcon technology={technology} color={brandColor} />
          </span>
          <span className="text-[10px] leading-tight text-foreground/70 transition-colors duration-300 group-hover/card:text-foreground group-active/card:text-foreground md:text-xs">
            {technology.name}
          </span>
        </div>
      </div>
    </li>
  );
}
