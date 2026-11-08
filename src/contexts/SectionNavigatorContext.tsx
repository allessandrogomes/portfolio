"use client";

import { createContext } from "react";
import type { SectionTransitions } from "@/lib/sectionNavigation";

interface SectionNavigatorContextValue {
  registerSection: (
    section: HTMLElement,
    transitions: SectionTransitions,
  ) => () => void;
}

export const SectionNavigatorContext =
  createContext<SectionNavigatorContextValue | null>(null);
