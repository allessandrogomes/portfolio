import type { ReactNode } from "react";

export default function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p
      data-reveal
      className="text-xs font-semibold tracking-[0.35em] text-muted uppercase md:text-sm"
    >
      {children}
    </p>
  );
}
