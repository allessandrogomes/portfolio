"use client";

import { createContext, useState, type ReactNode } from "react";

interface PageReadyContextValue {
  isPageReady: boolean;
  markPageReady: () => void;
}

export const PageReadyContext = createContext<PageReadyContextValue | null>(
  null,
);

export function PageReadyProvider({ children }: { children: ReactNode }) {
  const [isPageReady, setIsPageReady] = useState(false);

  const markPageReady = () => setIsPageReady(true);

  return (
    <PageReadyContext value={{ isPageReady, markPageReady }}>
      {children}
    </PageReadyContext>
  );
}
