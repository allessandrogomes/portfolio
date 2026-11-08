"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useAssetsLoaded } from "@/hooks/useAssetsLoaded";
import { usePageReady } from "@/hooks/usePageReady";

gsap.registerPlugin(useGSAP);

const LOADER_LABEL = "Alessandro";
const MINIMUM_LOADER_DURATION_MS = 800;

const WAITING_PROGRESS_SCALE = 0.7;
const WAITING_PROGRESS_DURATION_SECONDS = 1.6;
const WAITING_PROGRESS_EASE = "power2.out";

const COMPLETE_PROGRESS_DURATION_SECONDS = 0.4;
const COMPLETE_PROGRESS_EASE = "power2.inOut";

const EXIT_CONTENT_DURATION_SECONDS = 0.4;
const EXIT_CURTAIN_DURATION_SECONDS = 0.9;
const EXIT_CURTAIN_EASE = "power4.inOut";
const EXIT_CURTAIN_OVERLAP = "-=0.1";

const SCROLL_LOCKED = "hidden";
const SCROLL_UNLOCKED = "";

export default function Preloader() {
  const loaderRef = useRef<HTMLDivElement>(null);
  const [isFinished, setIsFinished] = useState(false);
  const areAssetsLoaded = useAssetsLoaded(MINIMUM_LOADER_DURATION_MS);
  const { markPageReady } = usePageReady();

  useGSAP(
    () => {
      document.documentElement.style.overflow = SCROLL_LOCKED;

      gsap.to("[data-loader-progress]", {
        scaleX: WAITING_PROGRESS_SCALE,
        duration: WAITING_PROGRESS_DURATION_SECONDS,
        ease: WAITING_PROGRESS_EASE,
      });
    },
    { scope: loaderRef },
  );

  useGSAP(
    () => {
      if (!areAssetsLoaded) return;

      const finishLoading = () => {
        document.documentElement.style.overflow = SCROLL_UNLOCKED;
        markPageReady();
        setIsFinished(true);
      };

      gsap
        .timeline({ onComplete: finishLoading })
        .to("[data-loader-progress]", {
          scaleX: 1,
          duration: COMPLETE_PROGRESS_DURATION_SECONDS,
          ease: COMPLETE_PROGRESS_EASE,
        })
        .to("[data-loader-content]", {
          autoAlpha: 0,
          duration: EXIT_CONTENT_DURATION_SECONDS,
        })
        .to(
          loaderRef.current,
          {
            yPercent: -100,
            duration: EXIT_CURTAIN_DURATION_SECONDS,
            ease: EXIT_CURTAIN_EASE,
          },
          EXIT_CURTAIN_OVERLAP,
        );
    },
    { scope: loaderRef, dependencies: [areAssetsLoaded] },
  );

  if (isFinished) return null;

  return (
    <div
      ref={loaderRef}
      role="status"
      aria-label="Carregando"
      className="fixed inset-0 z-50 flex items-center justify-center bg-background"
    >
      <div data-loader-content className="flex w-48 flex-col items-center gap-4">
        <span className="font-display text-2xl tracking-[0.3em] uppercase">
          {LOADER_LABEL}
        </span>
        <span className="h-px w-full overflow-hidden bg-foreground/15">
          <span
            data-loader-progress
            className="block h-full w-full origin-left scale-x-0 bg-foreground"
          />
        </span>
      </div>
    </div>
  );
}
