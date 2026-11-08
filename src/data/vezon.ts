import {
  siAppstore,
  siDocker,
  siFirebase,
  siGoogleplay,
  siNestjs,
  siNextdotjs,
  siPostgresql,
  siReact,
  siWhatsapp,
  type SimpleIcon,
} from "simple-icons";

export interface VezonHighlight {
  title: string;
  description: string;
  icons: SimpleIcon[];
  strokeIconPaths: string[];
}

export const DevicePosition = {
  LEFT: "left",
  CENTER: "center",
  RIGHT: "right",
} as const;

export type DevicePosition = (typeof DevicePosition)[keyof typeof DevicePosition];

export interface VezonDevice {
  src: string;
  alt: string;
  width: number;
  height: number;
  position: DevicePosition;
}

export interface VezonProduct {
  name: string;
  tagline: string;
  role: string;
  launch: string;
  url: string;
  urlLabel: string;
  summary: string;
  stack: SimpleIcon[];
  devices: VezonDevice[];
  highlights: VezonHighlight[];
}

export const VEZON_PRODUCT: VezonProduct = {
  name: "Vezon",
  tagline: "SaaS de agendamento com WhatsApp",
  role: "Criador e Desenvolvedor Full Stack",
  launch: "Lançado em 09/2026",
  url: "https://vezon.app",
  urlLabel: "vezon.app",
  summary:
    "Produto com 5 aplicações (API REST versionada, painel web, página pública de agendamento, site institucional e app mobile), usado por clientes reais.",
  stack: [siReact, siNextdotjs, siNestjs, siPostgresql, siDocker],
  devices: [
    {
      src: "/02-recurso-pagina.png",
      alt: "Página pública de agendamento da Vezon no celular",
      width: 422,
      height: 858,
      position: DevicePosition.LEFT,
    },
    {
      src: "/03-whatsapp-ios.png",
      alt: "Lembrete de horário enviado pela Vezon no WhatsApp",
      width: 852,
      height: 1746,
      position: DevicePosition.RIGHT,
    },
    {
      src: "/01-recurso-agenda.png",
      alt: "Agenda do dia no app da Vezon",
      width: 422,
      height: 858,
      position: DevicePosition.CENTER,
    },
  ],
  highlights: [
    {
      title: "WhatsApp oficial",
      description:
        "Integração com a WhatsApp Cloud API: lembretes, confirmações, cancelamentos e remarcações automáticas.",
      icons: [siWhatsapp],
      strokeIconPaths: [],
    },
    {
      title: "Notificações push",
      description:
        "Notificações em tempo real no app mobile com Firebase Cloud Messaging.",
      icons: [siFirebase],
      strokeIconPaths: [],
    },
    {
      title: "Login por e-mail e SMS",
      description:
        "Autenticação por e-mail e SMS, com JWT, refresh token em cookie httpOnly e controle de acesso por papéis.",
      icons: [],
      strokeIconPaths: [
        "M3 6h18v12H3zM3 7l9 6 9-6",
        "M8 2h8a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zM11 18h2",
      ],
    },
    {
      title: "Google Play e App Store",
      description:
        "App mobile em React Native para Android e iOS, com conhecimento do fluxo de publicação no Google Play Console e no App Store Connect.",
      icons: [siGoogleplay, siAppstore],
      strokeIconPaths: [],
    },
  ],
};
