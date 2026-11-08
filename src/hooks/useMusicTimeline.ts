import { useEffect, useRef, useState, type RefObject } from "react";
import { PlaybackState } from "@/hooks/useYouTubePlayer";
import {
  MusicPhase,
  getMusicMoment,
  type MusicSegment,
} from "@/lib/musicPhases";

const MS_PER_SECOND = 1000;
const MAX_EXTRAPOLATION_MS = 1000;
const ANIMATION_LEAD_MS = 110;
const NO_REPORT = -1;
const PROGRESS_PROPERTY = "--music-progress";
const INTENSITY_STEP_ATTRIBUTE = "data-music-step";

const ACTIVE_PLAYBACK_STATES: PlaybackState[] = [
  PlaybackState.PLAYING,
  PlaybackState.PAUSED,
];

function createPlaybackClock(getCurrentTime: () => number) {
  let lastReportedMs = NO_REPORT;
  let reportedAt = 0;

  return () => {
    const reportedMs = getCurrentTime() * MS_PER_SECOND;
    const now = performance.now();
    const hasNewReport = reportedMs !== lastReportedMs;

    if (hasNewReport) {
      lastReportedMs = reportedMs;
      reportedAt = now;

      return reportedMs;
    }

    const elapsedSinceReport = Math.min(
      MAX_EXTRAPOLATION_MS,
      now - reportedAt,
    );

    return reportedMs + elapsedSinceReport;
  };
}

export function useMusicTimeline(
  stageRef: RefObject<HTMLElement | null>,
  timeline: MusicSegment[],
  playbackState: PlaybackState,
  getCurrentTime: () => number,
): MusicPhase {
  const [phase, setPhase] = useState<MusicPhase>(MusicPhase.IDLE);
  const phaseRef = useRef<MusicPhase>(MusicPhase.IDLE);
  const isPlaying = playbackState === PlaybackState.PLAYING;

  useEffect(() => {
    if (!isPlaying) return;

    const getCurrentMs = createPlaybackClock(getCurrentTime);
    let frameId = 0;

    const updateMoment = () => {
      const moment = getMusicMoment(
        timeline,
        getCurrentMs() + ANIMATION_LEAD_MS,
      );
      const stage = stageRef.current;

      stage?.style.setProperty(PROGRESS_PROPERTY, String(moment.progress));
      stage?.setAttribute(INTENSITY_STEP_ATTRIBUTE, String(moment.step));

      if (moment.phase !== phaseRef.current) {
        phaseRef.current = moment.phase;
        setPhase(moment.phase);
      }

      frameId = requestAnimationFrame(updateMoment);
    };

    frameId = requestAnimationFrame(updateMoment);

    return () => cancelAnimationFrame(frameId);
  }, [isPlaying, timeline, getCurrentTime, stageRef]);

  const isTimelineActive = ACTIVE_PLAYBACK_STATES.includes(playbackState);

  return isTimelineActive ? phase : MusicPhase.IDLE;
}
