import { useCallback, useEffect, useRef, useState } from "react";

const COPIED_FEEDBACK_MS = 2000;

export function useCopyToClipboard() {
  const [hasCopied, setHasCopied] = useState(false);
  const resetTimeoutRef = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (resetTimeoutRef.current) window.clearTimeout(resetTimeoutRef.current);
    },
    [],
  );

  const copy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      return;
    }

    setHasCopied(true);

    if (resetTimeoutRef.current) window.clearTimeout(resetTimeoutRef.current);

    resetTimeoutRef.current = window.setTimeout(
      () => setHasCopied(false),
      COPIED_FEEDBACK_MS,
    );
  }, []);

  return { hasCopied, copy };
}
