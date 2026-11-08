const YOUTUBE_API_SRC = "https://www.youtube.com/iframe_api";

let youtubeApiPromise: Promise<YouTubeNamespace> | null = null;

export function loadYouTubeApi(): Promise<YouTubeNamespace> {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (youtubeApiPromise) return youtubeApiPromise;

  youtubeApiPromise = new Promise((resolve) => {
    const previousReadyHandler = window.onYouTubeIframeAPIReady;

    window.onYouTubeIframeAPIReady = () => {
      previousReadyHandler?.();

      if (window.YT) resolve(window.YT);
    };

    const script = document.createElement("script");
    script.src = YOUTUBE_API_SRC;
    script.async = true;
    document.head.appendChild(script);
  });

  return youtubeApiPromise;
}
