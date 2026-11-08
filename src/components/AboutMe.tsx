"use client";

import { useRef, type CSSProperties, type RefObject } from "react";
import Image from "next/image";
import Eyebrow from "@/components/Eyebrow";
import FitToViewport from "@/components/FitToViewport";
import StrokeIcon from "@/components/StrokeIcon";
import {
  useSectionTransitions,
  type SectionSelector,
} from "@/hooks/useSectionTransitions";
import { useMusicPlayer } from "@/hooks/useMusicPlayer";
import { useMusicTimeline } from "@/hooks/useMusicTimeline";
import { PlaybackState, useYouTubePlayer } from "@/hooks/useYouTubePlayer";
import { ABOUT_ME, type Interest } from "@/data/about";
import { ChaosStrength, getChaosStyle } from "@/lib/chaos";
import {
  SECTION_LEAVE_EVENT,
  type SectionTransitions,
} from "@/lib/sectionNavigation";
import { VISIBLE_STATE } from "@/lib/revealStates";
import {
  createRevealEnterTimeline,
  createRevealLeaveTimeline,
} from "@/lib/revealTransitions";

const SECTION_LABEL = "Sobre mim";
const PLAY_LABEL_PREFIX = "Tocar ";
const STOP_LABEL = "Parar música";
const NOW_PLAYING = "Tocando agora";
const PHOTO_SIDE_FADE_MASK =
  "linear-gradient(to right, transparent 0%, black 12%, black 82%, transparent 100%)";
const PHOTO_CLASS_NAME =
  "absolute bottom-0 left-1/2 h-full w-auto max-w-none -translate-x-1/2 object-contain object-bottom";
const PHOTO_SIZES = "40vw";
const DESKTOP_PHOTO_CLASS_NAME =
  "absolute bottom-0 left-[2%] hidden h-[88%] w-[42%] md:block";
const MOBILE_PHOTO_CLASS_NAME =
  "relative h-32 w-32 shrink-0 mask-b-from-70% md:hidden";
const THUMBNAIL_SIZES = "(max-width: 768px) 90vw, 320px";
const THUMBNAIL_WIDTH = 1280;
const THUMBNAIL_HEIGHT = 720;
const YOUTUBE_THUMBNAIL_URL = "https://i.ytimg.com/vi/";
const YOUTUBE_THUMBNAIL_FILE = "/maxresdefault.jpg";
const ICON_VIEW_BOX = "0 0 24 24";
const PLAY_ICON_PATH = "M8 5v14l11-7z";
const STOP_ICON_PATH = "M6 6h12v12H6z";
const PAUSE_ICON_PATH = "M7 5h3v14H7zM14 5h3v14h-3z";
const PAUSE_LABEL = "Pausar música";
const RESUME_LABEL = "Continuar música";
const PLAYER_CONTROL_CLASS_NAME =
  "flex size-8 cursor-pointer items-center justify-center rounded-full border border-foreground/20 transition hover:bg-foreground hover:text-background";
const EQUALIZER_BARS = [
  { id: "bar-1", delayMs: 0 },
  { id: "bar-2", delayMs: 240 },
  { id: "bar-3", delayMs: 120 },
  { id: "bar-4", delayMs: 360 },
  { id: "bar-5", delayMs: 60 },
];
const SOUND_WAVES = ["wave-1", "wave-2", "wave-3"];
const LETTER_SPACE = " ";
const HEADING_CHAOS_SEED = 1;
const INTEREST_CHAOS_SEED = 100;
const CHAOS_SEED_STEP = 10;
const GENRE_CHAOS_SEED = 300;

const PHOTO_EASE = "power3.out";
const PHOTO_START_SECONDS = 0.1;
const PHOTO_DURATION_SECONDS = 1.4;
const PHOTO_SHIFT_PX = -80;

const LEAVE_TARGETS = "[data-reveal], [data-about-photo]";

function createAboutTransitions(select: SectionSelector): SectionTransitions {
  return {
    enter: (direction) =>
      createRevealEnterTimeline(select("[data-reveal]"), direction).fromTo(
        select("[data-about-photo]"),
        { x: PHOTO_SHIFT_PX, autoAlpha: 0 },
        {
          ...VISIBLE_STATE,
          x: 0,
          duration: PHOTO_DURATION_SECONDS,
          ease: PHOTO_EASE,
        },
        PHOTO_START_SECONDS,
      ),
    leave: (direction) => {
      select("[data-music-player]").forEach((player) =>
        player.dispatchEvent(new Event(SECTION_LEAVE_EVENT)),
      );

      return createRevealLeaveTimeline(select(LEAVE_TARGETS), direction);
    },
  };
}

function getStatusLabel(isOpen: boolean): string {
  if (!isOpen) return ABOUT_ME.favoriteSong.label;

  return NOW_PLAYING;
}

function Equalizer({ isAnimating }: { isAnimating: boolean }) {
  const stateClassName = isAnimating
    ? "motion-safe:animate-equalizer"
    : "scale-y-40";

  return (
    <span aria-hidden className="flex h-5 items-end gap-0.5">
      {EQUALIZER_BARS.map((bar) => (
        <span
          key={bar.id}
          data-equalizer-bar
          style={{ animationDelay: `${bar.delayMs}ms` }}
          className={`h-full w-1 origin-bottom rounded-full bg-foreground transition-[scale] duration-300 ${stateClassName}`}
        />
      ))}
    </span>
  );
}

function MusicPlayer({
  playerRef,
  videoHostRef,
  isOpen,
  isPlaying,
  isPaused,
  onPlay,
  onPause,
  onResume,
  onStop,
}: {
  playerRef: RefObject<HTMLDivElement | null>;
  videoHostRef: RefObject<HTMLDivElement | null>;
  isOpen: boolean;
  isPlaying: boolean;
  isPaused: boolean;
  onPlay: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
}) {
  const song = ABOUT_ME.favoriteSong;
  const thumbnailUrl = `${YOUTUBE_THUMBNAIL_URL}${song.videoId}${YOUTUBE_THUMBNAIL_FILE}`;

  return (
    <div
      ref={playerRef}
      data-music-player
      data-reveal
      className="flex flex-col gap-4 rounded-2xl border border-foreground/10 bg-foreground/5 p-3 sm:flex-row sm:items-center"
    >
      <div className="relative aspect-video w-full shrink-0 overflow-hidden rounded-xl bg-background sm:w-72 md:w-80">
        <div
          ref={videoHostRef}
          className="absolute inset-0 [&_iframe]:absolute [&_iframe]:inset-0 [&_iframe]:size-full"
        />
        {!isOpen && (
          <button
            type="button"
            onClick={onPlay}
            aria-label={`${PLAY_LABEL_PREFIX}${song.title}, de ${song.artist}`}
            className="group/play absolute inset-0 cursor-pointer"
          >
            <Image
              src={thumbnailUrl}
              alt=""
              width={THUMBNAIL_WIDTH}
              height={THUMBNAIL_HEIGHT}
              sizes={THUMBNAIL_SIZES}
              className="size-full object-cover transition duration-500 group-hover/play:scale-105 group-hover/play:brightness-75"
            />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="absolute size-16 rounded-full bg-foreground/30 motion-safe:animate-ping" />
              <span className="relative flex size-14 items-center justify-center rounded-full bg-foreground text-background shadow-xl transition duration-300 group-hover/play:scale-110">
                <svg
                  aria-hidden
                  viewBox={ICON_VIEW_BOX}
                  className="ml-0.5 size-6 fill-current"
                >
                  <path d={PLAY_ICON_PATH} />
                </svg>
              </span>
            </span>
          </button>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 px-1 pb-1 sm:pb-0">
        <p
          aria-live="polite"
          className="text-[10px] font-semibold tracking-[0.3em] text-muted uppercase"
        >
          {getStatusLabel(isOpen)}
        </p>
        <p className="font-display text-4xl leading-none uppercase md:text-5xl">
          {song.title}
        </p>
        <p className="text-sm text-foreground/80">{song.artist}</p>
        <div className="mt-1 flex items-center gap-3">
          <span
            data-chaos
            style={getChaosStyle(GENRE_CHAOS_SEED, ChaosStrength.TEXT)}
            className="rounded-full border border-foreground/20 px-2.5 py-0.5 text-xs text-foreground/80"
          >
            {song.genre}
          </span>
          <Equalizer isAnimating={isPlaying} />
          {isOpen && (
            <div className="ml-auto flex gap-2">
              <button
                type="button"
                onClick={isPaused ? onResume : onPause}
                aria-label={isPaused ? RESUME_LABEL : PAUSE_LABEL}
                className={PLAYER_CONTROL_CLASS_NAME}
              >
                <svg
                  aria-hidden
                  viewBox={ICON_VIEW_BOX}
                  className="size-3.5 fill-current"
                >
                  <path d={isPaused ? PLAY_ICON_PATH : PAUSE_ICON_PATH} />
                </svg>
              </button>
              <button
                type="button"
                onClick={onStop}
                aria-label={STOP_LABEL}
                className={PLAYER_CONTROL_CLASS_NAME}
              >
                <StrokeIcon path={STOP_ICON_PATH} className="size-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ChaoticHeading() {
  return (
    <h2
      data-reveal
      id="about-heading"
      aria-label={ABOUT_ME.heading}
      className="font-display text-6xl leading-none uppercase md:text-8xl"
    >
      {Array.from(ABOUT_ME.heading).map((letter, index) => {
        const isSpace = letter === LETTER_SPACE;

        if (isSpace) return LETTER_SPACE;

        return (
          <span
            key={`${letter}-${index}`}
            aria-hidden
            data-chaos
            style={getChaosStyle(
              HEADING_CHAOS_SEED + index,
              ChaosStrength.LETTER,
            )}
          >
            {letter}
          </span>
        );
      })}
    </h2>
  );
}

function InterestCard({
  interest,
  chaosSeed,
}: {
  interest: Interest;
  chaosSeed: number;
}) {
  return (
    <li
      data-reveal
      className="flex flex-col items-start gap-2 rounded-xl border border-foreground/10 p-4 transition-[border-color,translate] duration-300 hover:-translate-y-1 hover:border-foreground/30"
    >
      <span data-chaos style={getChaosStyle(chaosSeed, ChaosStrength.ICON)}>
        <StrokeIcon path={interest.iconPath} className="size-6" />
      </span>
      <p className="font-semibold">
        <span
          data-chaos
          style={getChaosStyle(chaosSeed + 1, ChaosStrength.TEXT)}
        >
          {interest.title}
        </span>
      </p>
      <p className="text-xs leading-relaxed text-muted md:text-sm">
        {interest.description}
      </p>
    </li>
  );
}

function getWaveStyle(
  index: number,
): CSSProperties & Record<"--wave-index", number> {
  return { "--wave-index": index };
}

function PhotoWithWaves({ className }: { className: string }) {
  const { photo, dropPhoto } = ABOUT_ME;

  return (
    <div
      data-about-photo
      data-music-collapse
      aria-hidden
      className={`pointer-events-none ${className}`}
    >
      <div data-music-zoom className="absolute inset-0 origin-bottom">
        <span
          data-music-glow
          className="absolute top-[2%] left-1/2 aspect-square w-[95%] -translate-x-1/2 rounded-full"
        />
        <div className="absolute top-[12%] left-1/2 aspect-square w-[70%] -translate-x-1/2">
          {SOUND_WAVES.map((wave, index) => (
            <span
              key={wave}
              data-music-wave
              style={getWaveStyle(index)}
              className="absolute inset-0 rounded-full border border-transparent opacity-0"
            />
          ))}
        </div>
        <div data-music-photo className="absolute inset-0 origin-bottom">
          <Image
            data-music-default-photo
            src={photo.src}
            alt=""
            width={photo.width}
            height={photo.height}
            sizes={PHOTO_SIZES}
            loading="eager"
            style={{ maskImage: PHOTO_SIDE_FADE_MASK }}
            className={PHOTO_CLASS_NAME}
          />
          <Image
            data-music-drop-photo
            src={dropPhoto.src}
            alt=""
            width={dropPhoto.width}
            height={dropPhoto.height}
            sizes={PHOTO_SIZES}
            loading="eager"
            style={{ maskImage: PHOTO_SIDE_FADE_MASK }}
            className={`${PHOTO_CLASS_NAME} opacity-0`}
          />
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-1/4 bg-linear-to-t from-background to-transparent" />
    </div>
  );
}

export default function AboutMe() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoHostRef = useRef<HTMLDivElement>(null);
  const {
    playerRef,
    isPlaying: isPlayerOpen,
    play,
    stop,
  } = useMusicPlayer<HTMLDivElement>();
  const { favoriteSong } = ABOUT_ME;
  const { playbackState, getCurrentTime, pause, resume } = useYouTubePlayer(
    videoHostRef,
    favoriteSong.videoId,
    isPlayerOpen,
    stop,
  );
  const phase = useMusicTimeline(
    sectionRef,
    favoriteSong.timeline,
    playbackState,
    getCurrentTime,
  );
  const isMusicPlaying = playbackState === PlaybackState.PLAYING;
  const isMusicPaused = playbackState === PlaybackState.PAUSED;

  useSectionTransitions(sectionRef, createAboutTransitions);

  return (
    <section
      ref={sectionRef}
      data-section
      data-section-label={SECTION_LABEL}
      data-music-stage
      data-music-phase={phase}
      data-music-paused={isMusicPaused || undefined}
      aria-labelledby="about-heading"
      className="absolute inset-0 overflow-hidden bg-background"
    >
      <PhotoWithWaves className={DESKTOP_PHOTO_CLASS_NAME} />

      <span
        data-music-shockwave
        aria-hidden
        className="pointer-events-none absolute top-[15%] left-[80%] md:top-[30%] md:left-[23%]"
      >
        <span className="absolute size-[70vmax] -translate-1/2 rounded-full border-2 opacity-0" />
        <span className="absolute size-[70vmax] -translate-1/2 rounded-full border opacity-0" />
      </span>

      <span
        data-music-riser
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[70%] origin-bottom bg-linear-to-t from-foreground/20 via-foreground/5 to-transparent opacity-0"
      />

      <span
        data-music-vignette
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-radial from-transparent from-40% to-black opacity-0"
      />

      <FitToViewport>
        <div
          data-music-shake
          className="mx-auto grid w-full max-w-6xl px-6 py-10 md:grid-cols-[2fr_3fr] md:gap-12 md:px-12"
        >
          <div aria-hidden className="hidden md:block" />

          <div className="relative flex flex-col gap-5">
            <div className="flex flex-col gap-3">
              <div className="flex items-end justify-between gap-4">
                <div className="flex flex-col gap-3">
                  <Eyebrow>{ABOUT_ME.eyebrow}</Eyebrow>
                  <ChaoticHeading />
                </div>
                <PhotoWithWaves className={MOBILE_PHOTO_CLASS_NAME} />
              </div>

              <p
                data-reveal
                className="text-sm text-foreground/70 md:text-base"
              >
                {ABOUT_ME.intro}
              </p>
            </div>

            <MusicPlayer
              playerRef={playerRef}
              videoHostRef={videoHostRef}
              isOpen={isPlayerOpen}
              isPlaying={isMusicPlaying}
              isPaused={isMusicPaused}
              onPlay={play}
              onPause={pause}
              onResume={resume}
              onStop={stop}
            />

            <ul className="grid gap-3 sm:grid-cols-3">
              {ABOUT_ME.interests.map((interest, index) => (
                <InterestCard
                  key={interest.title}
                  interest={interest}
                  chaosSeed={INTEREST_CHAOS_SEED + index * CHAOS_SEED_STEP}
                />
              ))}
            </ul>
          </div>
        </div>
      </FitToViewport>

      <span
        data-music-flash
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-foreground opacity-0"
      />
    </section>
  );
}
