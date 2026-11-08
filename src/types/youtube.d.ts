interface YouTubePlayer {
  getCurrentTime(): number;
  playVideo(): void;
  pauseVideo(): void;
  destroy(): void;
  unloadModule(moduleName: string): void;
}

interface YouTubePlayerEvent {
  target: YouTubePlayer;
}

interface YouTubeStateChangeEvent extends YouTubePlayerEvent {
  data: number;
}

interface YouTubePlayerOptions {
  videoId: string;
  host?: string;
  width?: string;
  height?: string;
  playerVars?: Record<string, number>;
  events?: {
    onReady?: (event: YouTubePlayerEvent) => void;
    onStateChange?: (event: YouTubeStateChangeEvent) => void;
  };
}

interface YouTubeNamespace {
  Player: new (
    element: HTMLElement,
    options: YouTubePlayerOptions,
  ) => YouTubePlayer;
}

interface Window {
  YT?: YouTubeNamespace;
  onYouTubeIframeAPIReady?: () => void;
}
