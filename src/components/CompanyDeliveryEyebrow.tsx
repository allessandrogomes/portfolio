import Image from "next/image";
import Eyebrow from "@/components/Eyebrow";
import { PEDE_AI_EXPERIENCE } from "@/data/experience";

const ICON_SRC = "/icone-red.png";
const ICON_WIDTH = 943;
const ICON_HEIGHT = 873;
const SEPARATOR = "·";

export default function CompanyDeliveryEyebrow({
  deliveryLabel,
}: {
  deliveryLabel: string;
}) {
  return (
    <Eyebrow>
      <span className="inline-flex items-center gap-2.5">
        <Image
          src={ICON_SRC}
          alt={PEDE_AI_EXPERIENCE.company}
          width={ICON_WIDTH}
          height={ICON_HEIGHT}
          className="h-4 w-auto md:h-5"
        />
        <span aria-hidden>{SEPARATOR}</span>
        {deliveryLabel}
      </span>
    </Eyebrow>
  );
}
