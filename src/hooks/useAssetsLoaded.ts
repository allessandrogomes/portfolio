import { useEffect, useState } from "react";

const DOCUMENT_COMPLETE_STATE = "complete";

function waitForWindowLoad(): Promise<void> {
  if (document.readyState === DOCUMENT_COMPLETE_STATE) return Promise.resolve();

  return new Promise((resolve) => {
    window.addEventListener("load", () => resolve(), { once: true });
  });
}

function waitForMinimumDuration(durationMs: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, durationMs));
}

export function useAssetsLoaded(minimumDurationMs: number): boolean {
  const [areAssetsLoaded, setAreAssetsLoaded] = useState(false);

  useEffect(() => {
    let isActive = true;

    Promise.all([
      waitForWindowLoad(),
      document.fonts.ready,
      waitForMinimumDuration(minimumDurationMs),
    ]).then(() => {
      if (isActive) setAreAssetsLoaded(true);
    });

    return () => {
      isActive = false;
    };
  }, [minimumDurationMs]);

  return areAssetsLoaded;
}
