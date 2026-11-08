import type { SimpleIcon } from "simple-icons";

const HEX_RADIX = 16;
const DARK_COLOR_LUMINANCE_LIMIT = 0.06;
const FALLBACK_ICON_COLOR = "var(--color-foreground)";

const RED_LUMINANCE_WEIGHT = 0.2126;
const GREEN_LUMINANCE_WEIGHT = 0.7152;
const BLUE_LUMINANCE_WEIGHT = 0.0722;
const MAX_CHANNEL_VALUE = 255;

const SRGB_LINEAR_THRESHOLD = 0.04045;
const SRGB_LINEAR_DIVISOR = 12.92;
const SRGB_GAMMA_OFFSET = 0.055;
const SRGB_GAMMA_DIVISOR = 1.055;
const SRGB_GAMMA_EXPONENT = 2.4;

function toLinearChannel(hexChannel: string): number {
  const channel = parseInt(hexChannel, HEX_RADIX) / MAX_CHANNEL_VALUE;

  if (channel <= SRGB_LINEAR_THRESHOLD) return channel / SRGB_LINEAR_DIVISOR;

  return ((channel + SRGB_GAMMA_OFFSET) / SRGB_GAMMA_DIVISOR) ** SRGB_GAMMA_EXPONENT;
}

function getRelativeLuminance(hex: string): number {
  const red = toLinearChannel(hex.slice(0, 2));
  const green = toLinearChannel(hex.slice(2, 4));
  const blue = toLinearChannel(hex.slice(4, 6));

  return (
    red * RED_LUMINANCE_WEIGHT +
    green * GREEN_LUMINANCE_WEIGHT +
    blue * BLUE_LUMINANCE_WEIGHT
  );
}

export function getBrandColor(icon: SimpleIcon | null): string {
  if (!icon) return FALLBACK_ICON_COLOR;

  const isTooDarkForBackground =
    getRelativeLuminance(icon.hex) < DARK_COLOR_LUMINANCE_LIMIT;

  if (isTooDarkForBackground) return FALLBACK_ICON_COLOR;

  return `#${icon.hex}`;
}
