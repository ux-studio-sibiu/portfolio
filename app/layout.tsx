import type { Metadata, Viewport } from "next";
import { Archivo, JetBrains_Mono } from "next/font/google";
import { ScrollHighlights } from "@/app/components/scroll-highlights/scroll-highlights";
import "@/app/styles/globals.scss";

const archivo = Archivo({
  // latin-ext as well as latin: the name in Contact is set with Romanian
  // diacritics, and T-comma and a-breve are both outside the latin subset.
  // Without it those two letters alone drop to a fallback face, which at
  // display size is impossible to miss.
  subsets: ["latin", "latin-ext"],
  variable: "--font-archivo",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Razvan Turcanu — Frontend Developer",
  description: "Selected work by a frontend developer building fast, functional interfaces.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${archivo.variable} ${jetbrainsMono.variable}`}>
      <body>
        {children}
        <ScrollHighlights />
      </body>
    </html>
  );
}
