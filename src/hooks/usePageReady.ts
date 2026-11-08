import { use } from "react";
import { PageReadyContext } from "@/contexts/PageReadyContext";

export function usePageReady() {
  const context = use(PageReadyContext);

  if (!context) {
    throw new Error("usePageReady deve ser usado dentro de PageReadyProvider");
  }

  return context;
}
