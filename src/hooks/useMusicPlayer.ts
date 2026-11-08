import { useEffect, useRef, useState } from "react";
import { SECTION_LEAVE_EVENT } from "@/lib/sectionNavigation";

export function useMusicPlayer<TElement extends HTMLElement>() {
  const playerRef = useRef<TElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const player = playerRef.current;

    if (!player) return;

    const handleSectionLeave = () => setIsPlaying(false);

    player.addEventListener(SECTION_LEAVE_EVENT, handleSectionLeave);

    return () =>
      player.removeEventListener(SECTION_LEAVE_EVENT, handleSectionLeave);
  }, []);

  return {
    playerRef,
    isPlaying,
    play: () => setIsPlaying(true),
    stop: () => setIsPlaying(false),
  };
}
