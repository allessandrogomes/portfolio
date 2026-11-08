const ICON_VIEW_BOX = "0 0 24 24";
const ICON_STROKE_WIDTH = 1.5;

export default function StrokeIcon({
  path,
  className,
}: {
  path: string;
  className: string;
}) {
  return (
    <svg
      aria-hidden
      viewBox={ICON_VIEW_BOX}
      fill="none"
      stroke="currentColor"
      strokeWidth={ICON_STROKE_WIDTH}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d={path} />
    </svg>
  );
}
