import type { Metadata } from "next";
import { Anton, Inter } from "next/font/google";
import Preloader from "@/components/Preloader";
import { PageReadyProvider } from "@/contexts/PageReadyContext";
import "./globals.css";

const anton = Anton({
  variable: "--font-anton",
  weight: "400",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Alessandro | Desenvolvedor Front End",
  description: "Portfólio de Alessandro, desenvolvedor front end",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${anton.variable} ${inter.variable}`}>
      <body className="bg-background font-sans text-foreground antialiased">
        <PageReadyProvider>
          <Preloader />
          {children}
        </PageReadyProvider>
      </body>
    </html>
  );
}
