interface HeroGreetingProps {
  lines: string[];
}

interface FrontGreetingProps extends HeroGreetingProps {
  isRevealed: boolean;
}

const GREETING_CLASS_NAME =
  "invisible pointer-events-none absolute inset-x-0 top-[18%] text-center font-display text-[clamp(4rem,17vw,17rem)] leading-[1.1] uppercase md:top-[10%]";

function GreetingLines({ lines }: HeroGreetingProps) {
  return lines.map((line, index) => (
    <span key={line} data-greeting-line={index} className="block">
      <span className="inline-block overflow-hidden align-top">
        <span data-greeting-word data-line-index={index} className="block">
          {line}
        </span>
      </span>
    </span>
  ));
}

export function SolidGreeting({ lines }: HeroGreetingProps) {
  return (
    <h1 data-greeting data-animate className={`${GREETING_CLASS_NAME} z-0`}>
      <GreetingLines lines={lines} />
    </h1>
  );
}

export function FrontGreeting({ lines, isRevealed }: FrontGreetingProps) {
  const visibilityClassName = isRevealed ? "opacity-100" : "opacity-0";

  return (
    <div
      aria-hidden
      data-greeting
      data-animate
      className={`${GREETING_CLASS_NAME} z-[15]`}
    >
      <div className={`transition-opacity duration-500 ${visibilityClassName}`}>
        <GreetingLines lines={lines} />
      </div>
    </div>
  );
}
