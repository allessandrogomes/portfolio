export interface EducationEntry {
  course: string;
  institution: string;
  location: string;
  period: string;
  highlightYear: string;
  status: string;
  isInProgress: boolean;
  logo: { src: string; width: number; height: number };
}

export const EDUCATION: EducationEntry[] = [
  {
    course: "Engenharia de Software",
    institution: "Anhanguera",
    location: "Juazeiro-BA",
    period: "08/2025 – Atual",
    highlightYear: "2025",
    status: "Cursando · 6º período",
    isInProgress: true,
    logo: { src: "/anhanguera.png", width: 500, height: 500 },
  },
  {
    course: "Análise e Desenvolvimento de Sistemas",
    institution: "Uninassau",
    location: "Petrolina-PE",
    period: "07/2022 – 12/2024",
    highlightYear: "2022",
    status: "Formado",
    isInProgress: false,
    logo: { src: "/uninassau.svg", width: 50, height: 50 },
  },
];

export interface Certification {
  name: string;
  issuer: string;
  logo: { src: string; width: number; height: number; hasOwnBackground: boolean };
}

export const CERTIFICATIONS: Certification[] = [
  {
    name: "Desenvolvimento Front-end e Back-end",
    issuer: "Alura",
    logo: { src: "/alura.png", width: 225, height: 225, hasOwnBackground: true },
  },
  {
    name: "Desenvolvimento React Native",
    issuer: "JStack",
    logo: { src: "/jstack.png", width: 112, height: 112, hasOwnBackground: true },
  },
  {
    name: "JavaScript Algorithms and Data Structures",
    issuer: "freeCodeCamp",
    logo: {
      src: "/freecodecamp.svg",
      width: 24,
      height: 24,
      hasOwnBackground: false,
    },
  },
  {
    name: "Fundamentos para Desenvolvimento de Software",
    issuer: "Microsoft",
    logo: {
      src: "/microsoft.svg",
      width: 23,
      height: 23,
      hasOwnBackground: false,
    },
  },
];

export const PROFICIENCY_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];

export interface Language {
  name: string;
  level: string;
  reachedLevels: number;
  note: string | null;
}

export const LANGUAGES: Language[] = [
  {
    name: "Inglês",
    level: "Intermediário (B1)",
    reachedLevels: PROFICIENCY_LEVELS.indexOf("B1") + 1,
    note: "Leitura técnica avançada",
  },
];
