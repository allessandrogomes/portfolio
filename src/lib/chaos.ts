import type { CSSProperties } from "react";

export interface ChaosStrength {
  maxShiftXPx: number;
  minDropYPx: number;
  maxDropYPx: number;
  maxRotationDeg: number;
}

export const ChaosStrength = {
  LETTER: {
    maxShiftXPx: 40,
    minDropYPx: 10,
    maxDropYPx: 90,
    maxRotationDeg: 40,
  },
  ICON: {
    maxShiftXPx: 70,
    minDropYPx: 30,
    maxDropYPx: 120,
    maxRotationDeg: 140,
  },
  TEXT: {
    maxShiftXPx: 20,
    minDropYPx: 4,
    maxDropYPx: 30,
    maxRotationDeg: 10,
  },
} satisfies Record<string, ChaosStrength>;

type ChaosStyle = CSSProperties &
  Record<"--chaos-x" | "--chaos-y" | "--chaos-r", string>;

const HASH_MULTIPLIER = 12.9898;
const HASH_SCALE = 43758.5453;
const X_SEED_OFFSET = 1;
const Y_SEED_OFFSET = 2;
const ROTATION_SEED_OFFSET = 3;
const CENTERED_RANGE_FACTOR = 2;
const CENTER_OFFSET = 1;

function pseudoRandom(seed: number): number {
  const value = Math.sin(seed * HASH_MULTIPLIER) * HASH_SCALE;

  return value - Math.floor(value);
}

function centeredRandom(seed: number): number {
  return pseudoRandom(seed) * CENTERED_RANGE_FACTOR - CENTER_OFFSET;
}

export function getChaosStyle(
  seed: number,
  strength: ChaosStrength,
): ChaosStyle {
  const shiftX = centeredRandom(seed + X_SEED_OFFSET) * strength.maxShiftXPx;
  const dropRange = strength.maxDropYPx - strength.minDropYPx;
  const dropY =
    strength.minDropYPx + pseudoRandom(seed + Y_SEED_OFFSET) * dropRange;
  const rotation =
    centeredRandom(seed + ROTATION_SEED_OFFSET) * strength.maxRotationDeg;

  return {
    "--chaos-x": `${shiftX.toFixed(1)}px`,
    "--chaos-y": `${dropY.toFixed(1)}px`,
    "--chaos-r": `${rotation.toFixed(1)}deg`,
  };
}
