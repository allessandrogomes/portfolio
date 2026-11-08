import { useLayoutEffect, type RefObject } from "react";

const FULL_SCALE = 1;
const MINIMUM_SCALE = 0.3;
const SEARCH_ITERATIONS = 10;
const FULL_WIDTH_PERCENT = 100;

function applyScale(content: HTMLElement, scale: number) {
  content.style.width = `${FULL_WIDTH_PERCENT / scale}%`;
  content.style.transform = `scale(${scale})`;
}

function fitsAtScale(
  content: HTMLElement,
  availableHeight: number,
  scale: number,
): boolean {
  applyScale(content, scale);

  return content.offsetHeight * scale <= availableHeight;
}

function findLargestFittingScale(
  content: HTMLElement,
  availableHeight: number,
): number {
  if (fitsAtScale(content, availableHeight, FULL_SCALE)) return FULL_SCALE;

  let fittingScale = MINIMUM_SCALE;
  let overflowingScale = FULL_SCALE;

  for (let iteration = 0; iteration < SEARCH_ITERATIONS; iteration++) {
    const candidateScale = (fittingScale + overflowingScale) / 2;

    if (fitsAtScale(content, availableHeight, candidateScale)) {
      fittingScale = candidateScale;
    } else {
      overflowingScale = candidateScale;
    }
  }

  return fittingScale;
}

export function useFitScale(
  containerRef: RefObject<HTMLElement | null>,
  contentRef: RefObject<HTMLElement | null>,
) {
  useLayoutEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;

    if (!container || !content) return;

    let lastWidth = 0;
    let lastHeight = 0;
    let lastContentHeight = 0;

    const updateScale = () => {
      const availableWidth = container.clientWidth;
      const availableHeight = container.clientHeight;
      const hasContainerChanged =
        availableWidth !== lastWidth || availableHeight !== lastHeight;
      const hasContentChanged = content.offsetHeight !== lastContentHeight;

      if (!hasContainerChanged && !hasContentChanged) return;

      const scale = findLargestFittingScale(content, availableHeight);
      applyScale(content, scale);

      lastWidth = availableWidth;
      lastHeight = availableHeight;
      lastContentHeight = content.offsetHeight;
    };

    const resizeObserver = new ResizeObserver(updateScale);
    resizeObserver.observe(container);
    resizeObserver.observe(content);

    return () => resizeObserver.disconnect();
  }, [containerRef, contentRef]);
}
