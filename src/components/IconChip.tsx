import StrokeIcon from "@/components/StrokeIcon";
import type { LabeledIcon } from "@/data/experience";

export default function IconChip({
  item,
  className,
}: {
  item: LabeledIcon;
  className: string;
}) {
  return (
    <li
      data-reveal
      className={`flex items-center gap-1.5 rounded-full border border-foreground/15 py-1 pr-3 pl-2.5 text-foreground/80 ${className}`}
    >
      <StrokeIcon path={item.iconPath} className="size-3.5 shrink-0 text-pede-ai" />
      {item.label}
    </li>
  );
}
