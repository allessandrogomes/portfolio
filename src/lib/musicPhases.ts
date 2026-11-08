export const MusicPhase = {
  IDLE: "idle",
  INTRO: "intro",
  BUILD_UP: "build-up",
  SUSPENSE: "suspense",
  DROP_HEAVY: "drop-heavy",
  DROP_GLITCH: "drop-glitch",
  DROP_KICK: "drop-kick",
  OUTRO: "outro",
} as const;

export type MusicPhase = (typeof MusicPhase)[keyof typeof MusicPhase];

export const BuildUpBeat = {
  EVERY_800_MS: 0,
  EVERY_400_MS: 1,
  EVERY_200_MS: 2,
  EVERY_100_MS: 3,
} as const;

export type BuildUpBeat = (typeof BuildUpBeat)[keyof typeof BuildUpBeat];

export interface BeatChange {
  startMs: number;
  beat: BuildUpBeat;
}

export interface MusicSegment {
  startMs: number;
  phase: MusicPhase;
  beatChanges?: BeatChange[];
}

export interface MusicMoment {
  phase: MusicPhase;
  progress: number;
  step: number;
}

const NO_PROGRESS = 0;
const FULL_PROGRESS = 1;
const FIRST_STEP = 0;
const DEFAULT_STEP_COUNT = 4;
const LAST_DEFAULT_STEP = DEFAULT_STEP_COUNT - 1;

function getStep(
  segment: MusicSegment,
  currentMs: number,
  progress: number,
): number {
  const { beatChanges } = segment;

  if (!beatChanges) {
    return Math.min(
      LAST_DEFAULT_STEP,
      Math.floor(progress * DEFAULT_STEP_COUNT),
    );
  }

  const currentChange = beatChanges.findLast(
    (change) => change.startMs <= currentMs,
  );

  return (currentChange ?? beatChanges[0])?.beat ?? FIRST_STEP;
}

export function getMusicMoment(
  timeline: MusicSegment[],
  currentMs: number,
): MusicMoment {
  const segmentIndex = timeline.findLastIndex(
    (segment) => segment.startMs <= currentMs,
  );
  const segment = timeline[segmentIndex];
  const nextSegment = timeline[segmentIndex + 1];

  if (!segment) {
    return { phase: MusicPhase.IDLE, progress: NO_PROGRESS, step: FIRST_STEP };
  }

  if (!nextSegment) {
    return { phase: segment.phase, progress: NO_PROGRESS, step: FIRST_STEP };
  }

  const segmentDuration = nextSegment.startMs - segment.startMs;
  const elapsed = currentMs - segment.startMs;
  const progress = Math.min(FULL_PROGRESS, elapsed / segmentDuration);
  const step = getStep(segment, currentMs, progress);

  return { phase: segment.phase, progress, step };
}
