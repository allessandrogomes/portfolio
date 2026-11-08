import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import { loadYouTubeApi } from "@/lib/youtubeApi";

export const PlaybackState = {
  IDLE: "idle",
  PLAYING: "playing",
  PAUSED: "paused",
  ENDED: "ended",
} as const;

export type PlaybackState = (typeof PlaybackState)[keyof typeof PlaybackState];

const YOUTUBE_STATE_ENDED = 0;
const YOUTUBE_STATE_PLAYING = 1;
const YOUTUBE_STATE_PAUSED = 2;
const YOUTUBE_STATE_BUFFERING = 3;

const PRIVACY_ENHANCED_HOST = "https://www.youtube-nocookie.com";
const FULL_SIZE = "100%";
const ENABLED = 1;
const DISABLED = 0;

const HIDE_ANNOTATIONS = 3;
const CAPTIONS_MODULE = "captions";

const PLAYER_VARS = {
  autoplay: ENABLED,
  controls: ENABLED,
  disablekb: ENABLED,
  fs: DISABLED,
  iv_load_policy: HIDE_ANNOTATIONS,
  cc_load_policy: DISABLED,
  rel: DISABLED,
  modestbranding: ENABLED,
  playsinline: ENABLED,
};

function toPlaybackState(youtubeState: number): PlaybackState {
  if (youtubeState === YOUTUBE_STATE_PLAYING) return PlaybackState.PLAYING;
  if (youtubeState === YOUTUBE_STATE_PAUSED) return PlaybackState.PAUSED;
  if (youtubeState === YOUTUBE_STATE_BUFFERING) return PlaybackState.PAUSED;
  if (youtubeState === YOUTUBE_STATE_ENDED) return PlaybackState.ENDED;

  return PlaybackState.IDLE;
}

export function useYouTubePlayer(
  hostRef: RefObject<HTMLElement | null>,
  videoId: string,
  isEnabled: boolean,
  onEnded: () => void,
) {
  const playerRef = useRef<YouTubePlayer | null>(null);
  const onEndedRef = useRef(onEnded);
  const [playbackState, setPlaybackState] = useState<PlaybackState>(
    PlaybackState.IDLE,
  );

  useEffect(() => {
    onEndedRef.current = onEnded;
  }, [onEnded]);

  useEffect(() => {
    const host = hostRef.current;

    if (!isEnabled || !host) return;

    let isCancelled = false;
    const mountPoint = document.createElement("div");
    host.appendChild(mountPoint);

    loadYouTubeApi().then((youtube) => {
      if (isCancelled) return;

      playerRef.current = new youtube.Player(mountPoint, {
        videoId,
        host: PRIVACY_ENHANCED_HOST,
        width: FULL_SIZE,
        height: FULL_SIZE,
        playerVars: PLAYER_VARS,
        events: {
          onReady: (event) => {
            event.target.unloadModule(CAPTIONS_MODULE);
            event.target.playVideo();
          },
          onStateChange: (event) => {
            const nextState = toPlaybackState(event.data);

            if (nextState === PlaybackState.PLAYING) {
              event.target.unloadModule(CAPTIONS_MODULE);
            }

            setPlaybackState(nextState);

            if (nextState === PlaybackState.ENDED) onEndedRef.current();
          },
        },
      });
    });

    return () => {
      isCancelled = true;
      playerRef.current?.destroy();
      playerRef.current = null;
      host.replaceChildren();
    };
  }, [hostRef, videoId, isEnabled]);

  const getCurrentTime = useCallback(
    () => playerRef.current?.getCurrentTime() ?? 0,
    [],
  );

  const pause = useCallback(() => playerRef.current?.pauseVideo(), []);
  const resume = useCallback(() => playerRef.current?.playVideo(), []);

  const activePlaybackState = isEnabled ? playbackState : PlaybackState.IDLE;

  return { playbackState: activePlaybackState, getCurrentTime, pause, resume };
}
