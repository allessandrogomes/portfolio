"use client";

import { useCallback, useMemo, useRef, type ReactNode } from "react";
import SectionMenu from "@/components/SectionMenu";
import { SectionNavigatorContext } from "@/contexts/SectionNavigatorContext";
import { useSectionNavigation } from "@/hooks/useSectionNavigation";
import type { SectionTransitions } from "@/lib/sectionNavigation";

export default function SectionNavigator({
  children,
}: {
  children: ReactNode;
}) {
  const containerRef = useRef<HTMLElement>(null);
  const transitionsRef = useRef(new Map<HTMLElement, SectionTransitions>());

  const registerSection = useCallback(
    (section: HTMLElement, transitions: SectionTransitions) => {
      transitionsRef.current.set(section, transitions);

      return () => {
        transitionsRef.current.delete(section);
      };
    },
    [],
  );

  const contextValue = useMemo(() => ({ registerSection }), [registerSection]);

  const { activeIndex, sections, goToSection } = useSectionNavigation(
    containerRef,
    transitionsRef,
  );

  return (
    <SectionNavigatorContext value={contextValue}>
      <main
        ref={containerRef}
        className="fixed inset-0 touch-none overflow-hidden *:not-first:invisible"
      >
        {children}
      </main>
      <SectionMenu
        sections={sections}
        activeIndex={activeIndex}
        onNavigate={goToSection}
      />
    </SectionNavigatorContext>
  );
}
