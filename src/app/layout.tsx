import type { Metadata } from "next";
import { Cormorant_Garamond, Outfit, Syne } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
});

const syne = Syne({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-lyric",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Glowlist — song, photo, lyric",
  description:
    "Upload songs and photos, loop playback, sync fading lyrics, and share glowing public playlists.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${outfit.variable} ${syne.variable} ${cormorant.variable} min-h-[100dvh] bg-[#07070b] font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
