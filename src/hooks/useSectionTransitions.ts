import { use, useEffect, type RefObject } from "react";
import gsap from "gsap";
import { SectionNavigatorContext } from "@/contexts/SectionNavigatorContext";
import type { SectionTransitions } from "@/lib/sectionNavigation";

export type SectionSelector = ReturnType<typeof gsap.utils.selector>;

export function useSectionTransitions(
  sectionRef: RefObject<HTMLElement | null>,
  createTransitions: (select: SectionSelector) => SectionTransitions,
) {
  const context = use(SectionNavigatorContext);

  if (!context) {
    throw new Error(
      "useSectionTransitions deve ser usado dentro de SectionNavigator",
    );
  }

  const { registerSection } = context;

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const select = gsap.utils.selector(section);

    return registerSection(section, createTransitions(select));
  }, [registerSection, sectionRef, createTransitions]);
}
