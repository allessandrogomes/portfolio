export interface ContactChannel {
  label: string;
  value: string;
  href: string;
  logoSrc: string;
  isExternal: boolean;
}

export interface SocialProfile {
  name: string;
  href: string;
  logoSrc: string;
}

export interface Contact {
  eyebrow: string;
  heading: string;
  description: string;
  email: ContactChannel;
  whatsapp: ContactChannel;
  resumeUrl: string;
  socials: SocialProfile[];
  footer: string;
}

export const CONTACT: Contact = {
  eyebrow: "Contato",
  heading: "Vamos conversar?",
  description:
    "Tem um projeto para tirar do papel? Também atendo como freelancer, de sites a sistemas completos. E se quiser só trocar uma ideia sobre front-end, me chama por onde preferir.",
  email: {
    label: "E-mail",
    value: "alllessandrogomes@gmail.com",
    href: "mailto:alllessandrogomes@gmail.com",
    logoSrc: "/gmail.svg",
    isExternal: false,
  },
  whatsapp: {
    label: "WhatsApp",
    value: "(74) 99925-8446",
    href: "https://wa.me/5574999258446",
    logoSrc: "/whatsapp.svg",
    isExternal: true,
  },
  resumeUrl: "",
  socials: [
    {
      name: "LinkedIn",
      href: "https://www.linkedin.com/in/allessandrogomes",
      logoSrc: "/linkedin.svg",
    },
    {
      name: "GitHub",
      href: "https://github.com/allessandrogomes",
      logoSrc: "/github.svg",
    },
  ],
  footer: "Alessandro Gomes · Desenvolvedor Front End",
};
