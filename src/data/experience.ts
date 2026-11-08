import {
  siCreatereactapp,
  siKonva,
  siLaravel,
  siNextdotjs,
  siNodedotjs,
  siNubank,
  siPicpay,
  siPix,
  type SimpleIcon,
} from "simple-icons";

export interface LabeledIcon {
  label: string;
  iconPath: string;
}

export interface Migration {
  from: { name: string; icon: SimpleIcon; note: string };
  to: { name: string; icon: SimpleIcon; note: string };
}

export interface PaymentMethod {
  name: string;
  icon: SimpleIcon | null;
}

export interface Screenshot {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface CardSecurity {
  cardNumber: string;
  cardHolder: string;
  cardExpiry: string;
  encryptedCard: string;
  encryptedLabel: string;
  techniques: LabeledIcon[];
}

export interface MenuDelivery {
  title: string;
  summary: string;
  screenshot: Screenshot;
  migration: Migration;
  features: LabeledIcon[];
  payments: PaymentMethod[];
  security: CardSecurity;
}

export interface DeliveryMetric {
  label: string;
  before: string;
  beforeValue: number;
  afterValue: number;
  afterPrefix: string;
  unit: string;
  reductionPercent: number;
}

export interface AppIcon {
  src: string;
  alt: string;
  size: number;
}

export interface Delivery {
  title: string;
  appIcon: AppIcon;
  summary: string;
  metrics: DeliveryMetric[];
  highlights: LabeledIcon[];
}

export interface Experience {
  company: string;
  logoSrc: string;
  logoWidth: number;
  logoHeight: number;
  description: string;
  role: string;
  tenure: string;
}

export const PEDE_AI_EXPERIENCE: Experience = {
  company: "pede.ai",
  logoSrc: "/pede-ai.png",
  logoWidth: 1035,
  logoHeight: 385,
  description: "Aplicativo de delivery",
  role: "Desenvolvedor Front End Júnior",
  tenure: "+1 ano",
};

export const DESKTOP_APP_DELIVERY: Delivery = {
  title: "App desktop",
  appIcon: {
    src: "/pinguim.png",
    alt: "Ícone do app desktop da pede.ai: um pinguim segurando um tablet",
    size: 512,
  },
  summary: "Principal mantenedor do app em Electron até o lançamento em produção.",
  metrics: [
    {
      label: "Instalador",
      before: "600 MB",
      beforeValue: 600,
      afterValue: 85,
      afterPrefix: "",
      unit: "MB",
      reductionPercent: 86,
    },
    {
      label: "Tamanho instalado",
      before: "1,2 GB",
      beforeValue: 1200,
      afterValue: 287,
      afterPrefix: "",
      unit: "MB",
      reductionPercent: 76,
    },
    {
      label: "Arquivo principal",
      before: "~1.200 linhas",
      beforeValue: 1200,
      afterValue: 300,
      afterPrefix: "~",
      unit: "linhas",
      reductionPercent: 75,
    },
  ],
  highlights: [
    { label: "Arquitetura modularizada", iconPath: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" },
    { label: "Atualização automática com tratamento de erros", iconPath: "M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7" },
    { label: "Startup mais rápido", iconPath: "M13 2 4 14h7l-1 8 9-12h-7z" },
    { label: "Comunicação com impressoras aprimorada", iconPath: "M7 9V3h10v6M7 18H4v-7h16v7h-3M7 14h10v7H7z" },
  ],
};

export const MENU_DELIVERY: MenuDelivery = {
  title: "Cardápio web",
  summary:
    "Liderei a revitalização do cardápio, parado havia ~5 anos com dependências obsoletas, e atualizei as integrações com as APIs.",
  screenshot: {
    src: "/cardapio-web.png",
    alt: "Tela inicial do cardápio web da pede.ai com segmentos, categorias e lojas",
    width: 1586,
    height: 763,
  },
  migration: {
    from: {
      name: "Create React App",
      icon: siCreatereactapp,
      note: "~5 anos parado",
    },
    to: {
      name: "Next.js",
      icon: siNextdotjs,
      note: "App Router",
    },
  },
  features: [
    { label: "Checkout", iconPath: "M12 3a9 9 0 1 0 0 18a9 9 0 0 0 0-18zM8 12l3 3 5-6" },
    { label: "Carrinho", iconPath: "M3 4h2l2.4 11h11L21 8H6.2M10 20h.01M17 20h.01" },
    { label: "Avaliações", iconPath: "M12 3l2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.3l-5.5 2.9 1-6.2L3 9.6l6.2-.9z" },
    { label: "Listagem de lojas e produtos", iconPath: "M4 9l1.5-5h13L20 9M4 9h16v11H4zM9 20v-6h6v6" },
    { label: "Login", iconPath: "M12 12a4 4 0 1 0 0-8a4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0" },
    { label: "Geolocalização", iconPath: "M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12zM12 11a2 2 0 1 0 0-4a2 2 0 0 0 0 4z" },
    { label: "Filtros e ordenação com OpenSearch", iconPath: "M4 5h16l-6 7v6l-4 2v-8z" },
    { label: "SEO", iconPath: "M11 18a7 7 0 1 0 0-14a7 7 0 0 0 0 14zM20 20l-4-4" },
    { label: "Animações de UI/UX", iconPath: "M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6" },
    { label: "Estado global com Redux", iconPath: "M12 3l9 5-9 5-9-5zM3 13l9 5 9-5" },
  ],
  payments: [
    { name: "Cartão de crédito", icon: null },
    { name: "Pix", icon: siPix },
    { name: "NuPay", icon: siNubank },
    { name: "PicPay", icon: siPicpay },
  ],
  security: {
    cardNumber: "4242 4242 4242 4242",
    cardHolder: "Cliente pede.ai",
    cardExpiry: "12/30",
    encryptedCard: "U2FsdGVkX1+8Kd3pQ0vZ9mXr",
    encryptedLabel: "Criptografado",
    techniques: [
      {
        label: "Fingerprint do dispositivo",
        iconPath:
          "M12 11v3M8 12a4 4 0 0 1 8 0v2M5 12a7 7 0 0 1 14 0v1M9 19c1-1 1-3 1-5M15 19c-.5-1-.5-2.5-.5-4",
      },
      {
        label: "Criptografia no front-end",
        iconPath: "M7 11V7a5 5 0 0 1 10 0v4M5 11h14v10H5z",
      },
    ],
  },
};

export const IntegrationLogoKind = {
  IMAGE: "image",
  VECTOR: "vector",
} as const;

export type IntegrationLogo =
  | { kind: typeof IntegrationLogoKind.IMAGE; src: string; isFullBleed: boolean }
  | {
      kind: typeof IntegrationLogoKind.VECTOR;
      path: string;
      viewBox: string;
      color: string;
    };

export interface IntegrationNode {
  name: string;
  logo: IntegrationLogo;
}

const SIMPLE_ICON_VIEW_BOX = "0 0 24 24";
const LARAVEL_BRAND_COLOR = `#${siLaravel.hex}`;
const NODE_BRAND_COLOR = `#${siNodedotjs.hex}`;

export const ChatAuthor = {
  SUPPORT: "support",
  CUSTOMER: "customer",
} as const;

export type ChatAuthor = (typeof ChatAuthor)[keyof typeof ChatAuthor];

export interface ChatMessage {
  author: ChatAuthor;
  text: string;
}

export interface SupportChatDelivery {
  title: string;
  summary: string;
  monthlySavingsUsd: number;
  integrationNodes: IntegrationNode[];
  chatPreview: ChatMessage[];
}

export const SUPPORT_CHAT_DELIVERY: SupportChatDelivery = {
  title: "Chat de suporte",
  summary:
    "Integrei o Crisp ao nosso WebSocket, ao back-end e ao app mobile, levando o atendimento do WhatsApp para dentro do app de delivery.",
  monthlySavingsUsd: 1000,
  integrationNodes: [
    {
      name: "Crisp",
      logo: {
        kind: IntegrationLogoKind.IMAGE,
        src: "/crisp.png",
        isFullBleed: true,
      },
    },
    {
      name: "WebSocket",
      logo: {
        kind: IntegrationLogoKind.VECTOR,
        path: siNodedotjs.path,
        viewBox: SIMPLE_ICON_VIEW_BOX,
        color: NODE_BRAND_COLOR,
      },
    },
    {
      name: "Laravel",
      logo: {
        kind: IntegrationLogoKind.VECTOR,
        path: siLaravel.path,
        viewBox: SIMPLE_ICON_VIEW_BOX,
        color: LARAVEL_BRAND_COLOR,
      },
    },
    {
      name: "App pede.ai",
      logo: {
        kind: IntegrationLogoKind.IMAGE,
        src: "/icone-red.png",
        isFullBleed: false,
      },
    },
  ],
  chatPreview: [
    {
      author: ChatAuthor.SUPPORT,
      text: "Olá! Como posso ajudar com o seu pedido?",
    },
    {
      author: ChatAuthor.CUSTOMER,
      text: "Meu pedido ainda não saiu da loja",
    },
    {
      author: ChatAuthor.SUPPORT,
      text: "Já verifiquei: ele sai para entrega em 5 minutos!",
    },
  ],
};

export const PillarIconKind = {
  BRAND: "brand",
  STROKE: "stroke",
} as const;

export type PillarIcon =
  | { kind: typeof PillarIconKind.BRAND; icon: SimpleIcon }
  | { kind: typeof PillarIconKind.STROKE; path: string };

export interface ArtGeneratorPillar {
  title: string;
  description: string;
  icon: PillarIcon;
}

export interface ArtGeneratorDelivery {
  title: string;
  summary: string;
  pillars: ArtGeneratorPillar[];
}

export const ART_GENERATOR_DELIVERY: ArtGeneratorDelivery = {
  title: "Gerador de artes",
  summary:
    "Desenvolvi o front-end, junto com o back-end, de um gerador de artes com logos e QR codes usadas em campanhas e promoções.",
  pillars: [
    {
      title: "Editor visual com Konva",
      description:
        "Os colaboradores do marketing constroem as próprias artes num editor em canvas, sem depender do time de desenvolvimento.",
      icon: { kind: PillarIconKind.BRAND, icon: siKonva },
    },
    {
      title: "Geração em lote",
      description:
        "Uma arte vira centenas a milhares de versões, cada uma com o logo e o QR code da sua loja.",
      icon: {
        kind: PillarIconKind.STROKE,
        path: "M4 8h12v12H4zM8 4h12v12",
      },
    },
  ],
};

export interface MonitoringPillar {
  title: string;
  description: string;
  logoSrc: string;
}

export interface SlackAlert {
  channel: string;
  botName: string;
  title: string;
  errorMessage: string;
  minifiedLocation: string;
  sourceLocation: string;
}

export interface ErrorFeedItem {
  message: string;
  isNoise: boolean;
}

export interface MonitoringDelivery {
  title: string;
  summary: string;
  pillars: MonitoringPillar[];
  slackAlert: SlackAlert;
  errorFeed: ErrorFeedItem[];
}

export const MONITORING_DELIVERY: MonitoringDelivery = {
  title: "Qualidade e monitoramento",
  summary:
    "Automatizei o monitoramento de erros do front e otimizei o Bugsnag para agilizar as investigações.",
  pillars: [
    {
      title: "Alertas no Slack",
      description:
        "Os erros do front são capturados e enviados automaticamente como logs para o Slack do time.",
      logoSrc: "/slack.svg",
    },
    {
      title: "Bugsnag otimizado",
      description:
        "Redução de ruído e sourcemaps ajustados para chegar direto à linha do código-fonte.",
      logoSrc: "/bugsnag.svg",
    },
  ],
  slackAlert: {
    channel: "alertas-front",
    botName: "Monitor de erros",
    title: "Novo erro no cardápio web",
    errorMessage:
      "TypeError: Cannot read properties of undefined (reading 'price')",
    minifiedLocation: "main.4f2a9c.js:1:28734",
    sourceLocation: "src/features/cart/CartSummary.tsx:42:13",
  },
  errorFeed: [
    { message: "ResizeObserver loop limit exceeded", isNoise: true },
    {
      message: "TypeError: Cannot read properties of undefined",
      isNoise: false,
    },
    { message: "Script error.", isNoise: true },
    { message: "ChunkLoadError: Loading chunk 42 failed", isNoise: false },
    { message: "Erro vindo de extensão do navegador", isNoise: true },
  ],
};
