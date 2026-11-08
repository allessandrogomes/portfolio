"use client";

import { useRef, type ReactNode } from "react";
import { useFitScale } from "@/hooks/useFitScale";

export default function FitToViewport({ children }: { children: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useFitScale(containerRef, contentRef);

  return (
    <div
      ref={containerRef}
      className="relative flex size-full items-center justify-center overflow-hidden"
    >
      <div ref={contentRef} className="w-full shrink-0">
        {children}
      </div>
    </div>
  );
}
