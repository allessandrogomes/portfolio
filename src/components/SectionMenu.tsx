import type { SectionSummary } from "@/hooks/useSectionNavigation";

const MENU_LABEL = "Navegação entre as seções";
const COUNTER_SEPARATOR = "/ ";
const COUNTER_DIGITS = 2;
const COUNTER_PAD = "0";
const LABEL_STAGGER_MS = 30;

function formatPosition(position: number): string {
  return String(position).padStart(COUNTER_DIGITS, COUNTER_PAD);
}

export default function SectionMenu({
  sections,
  activeIndex,
  onNavigate,
}: {
  sections: SectionSummary[];
  activeIndex: number;
  onNavigate: (index: number) => void;
}) {
  const hasSections = sections.length > 0;
  const activeSection = sections[activeIndex];

  if (!hasSections || !activeSection) return null;

  return (
    <nav
      aria-label={MENU_LABEL}
      className="group/menu fixed top-1/2 right-2 z-40 flex -translate-y-1/2 flex-col items-end gap-4 motion-safe:animate-menu-in md:right-6"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -inset-y-24 -right-6 -left-72 bg-radial-[ellipse_at_100%_50%] from-background via-background/80 to-transparent to-70% opacity-0 transition-opacity duration-300 group-focus-within/menu:opacity-100 group-hover/menu:opacity-100"
      />

      <p
        aria-hidden
        className="relative flex items-baseline gap-1 pr-0.5 font-display tabular-nums"
      >
        <span className="inline-flex h-5 overflow-hidden text-base leading-5">
          <span
            key={activeIndex}
            style={{ color: activeSection.accent }}
            className="motion-safe:animate-counter-in"
          >
            {formatPosition(activeIndex + 1)}
          </span>
        </span>
        <span className="text-xs text-muted">
          {COUNTER_SEPARATOR}
          {formatPosition(sections.length)}
        </span>
      </p>

      <ol className="relative flex flex-col items-end">
        {sections.map((section, index) => {
          const isActive = index === activeIndex;
          const labelClassName = isActive
            ? "font-semibold text-foreground"
            : "text-muted group-hover/item:text-foreground";
          const tickClassName = isActive
            ? "w-8"
            : "w-3 bg-foreground/30 group-hover/item:w-5 group-hover/item:bg-foreground/70";

          return (
            <li key={section.label}>
              <button
                type="button"
                onClick={() => onNavigate(index)}
                aria-current={isActive ? "step" : undefined}
                className="group/item relative flex cursor-pointer items-center justify-end py-1.5 pl-3 focus-visible:outline-none"
              >
                <span
                  style={{ transitionDelay: `${index * LABEL_STAGGER_MS}ms` }}
                  className={`pointer-events-none absolute top-1/2 right-full mr-3 -translate-y-1/2 translate-x-2 text-xs whitespace-nowrap opacity-0 transition duration-300 group-focus-within/menu:pointer-events-auto group-hover/menu:pointer-events-auto group-focus-within/menu:translate-x-0 group-focus-within/menu:opacity-100 group-hover/menu:translate-x-0 group-hover/menu:opacity-100 group-focus-visible/item:underline ${labelClassName}`}
                >
                  {section.label}
                </span>
                <span
                  aria-hidden
                  style={isActive ? { backgroundColor: section.accent } : undefined}
                  className={`h-0.5 rounded-full transition-all duration-500 ${tickClassName}`}
                />
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
