import {
  BuildUpBeat,
  MusicPhase,
  type MusicSegment,
} from "@/lib/musicPhases";

export interface Interest {
  title: string;
  description: string;
  iconPath: string;
}

export interface FavoriteSong {
  label: string;
  title: string;
  artist: string;
  genre: string;
  videoId: string;
  videoTitle: string;
  timeline: MusicSegment[];
}

export interface AboutMe {
  eyebrow: string;
  heading: string;
  intro: string;
  photo: { src: string; alt: string; width: number; height: number };
  dropPhoto: { src: string; width: number; height: number };
  favoriteSong: FavoriteSong;
  interests: Interest[];
}

export const ABOUT_ME: AboutMe = {
  eyebrow: "Fora do código",
  heading: "Sobre mim",
  intro:
    "Sou tranquilo, curto o que faço e gosto de estar sempre aprendendo. Fora do trabalho, a vida gira em torno de futebol no videogame, música alta e evolução constante.",
  photo: {
    src: "/eu-de-fone.png",
    alt: "Alessandro sorrindo, ouvindo música com fones de ouvido",
    width: 1111,
    height: 1416,
  },
  dropPhoto: {
    src: "/eu-fone-drop.png",
    width: 1111,
    height: 1415,
  },
  favoriteSong: {
    label: "Música do momento",
    title: "PAIN",
    artist: "Ray Volpe & Kai Wachi",
    genre: "Dubstep",
    videoId: "vZvtbGRFSTc",
    videoTitle: "Ray Volpe & Kai Wachi - PAIN (Official Visualizer)",
    timeline: [
      { startMs: 0, phase: MusicPhase.INTRO },
      {
        startMs: 14_448,
        phase: MusicPhase.BUILD_UP,
        beatChanges: [
          { startMs: 14_448, beat: BuildUpBeat.EVERY_800_MS },
          { startMs: 27_250, beat: BuildUpBeat.EVERY_400_MS },
          { startMs: 33_650, beat: BuildUpBeat.EVERY_200_MS },
          { startMs: 36_851, beat: BuildUpBeat.EVERY_100_MS },
        ],
      },
      { startMs: 40_052, phase: MusicPhase.SUSPENSE },
      { startMs: 52_853, phase: MusicPhase.DROP_HEAVY },
      {
        startMs: 78_457,
        phase: MusicPhase.BUILD_UP,
        beatChanges: [
          { startMs: 78_457, beat: BuildUpBeat.EVERY_400_MS },
          { startMs: 84_858, beat: BuildUpBeat.EVERY_200_MS },
          { startMs: 87_258, beat: BuildUpBeat.EVERY_100_MS },
        ],
      },
      { startMs: 89_658, phase: MusicPhase.SUSPENSE },
      { startMs: 97_659, phase: MusicPhase.DROP_GLITCH },
      { startMs: 124_063, phase: MusicPhase.INTRO },
      {
        startMs: 136_065,
        phase: MusicPhase.BUILD_UP,
        beatChanges: [
          { startMs: 136_065, beat: BuildUpBeat.EVERY_400_MS },
          { startMs: 142_466, beat: BuildUpBeat.EVERY_200_MS },
          { startMs: 145_667, beat: BuildUpBeat.EVERY_100_MS },
        ],
      },
      { startMs: 148_866, phase: MusicPhase.SUSPENSE },
      { startMs: 161_668, phase: MusicPhase.DROP_KICK },
      { startMs: 187_271, phase: MusicPhase.OUTRO },
    ],
  },
  interests: [
    {
      title: "eFootball",
      description:
        "Jogo PES desde sempre e sigo até hoje no eFootball.",
      iconPath:
        "M6 11h4M8 9v4M15 12h.01M18 10h.01M17.3 5H6.7a4 4 0 0 0-4 3.6L2 15a3 3 0 0 0 5.4 2L9 15h6l1.6 2a3 3 0 0 0 5.4-2l-.7-6.4A4 4 0 0 0 17.3 5z",
    },
    {
      title: "EDM e Dubstep",
      description: "A trilha sonora de quando estou programando.",
      iconPath:
        "M3 18v-6a9 9 0 0 1 18 0v6M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z",
    },
    {
      title: "Sempre evoluindo",
      description:
        "No tempo livre estudo, evoluo profissionalmente e toco meu projeto pessoal.",
      iconPath:
        "M2 4h6a4 4 0 0 1 4 4v12a3 3 0 0 0-3-3H2zM22 4h-6a4 4 0 0 0-4 4v12a3 3 0 0 1 3-3h7z",
    },
  ],
};
