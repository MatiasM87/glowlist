"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Images, Mic2, Sparkles, Waves } from "lucide-react";

export default function HomePage() {
  return (
    <div className="relative min-h-[100dvh] overflow-hidden bg-[#07070b] text-white">
      <div className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1800&q=80"
          alt=""
          className="h-full w-full object-cover opacity-55"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/45 to-[#07070b]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(245,215,110,0.22),_transparent_55%)]" />
      </div>

      <div className="relative mx-auto flex min-h-[100dvh] max-w-5xl flex-col px-5 pb-10 pt-6 md:px-8">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-[#f5d76e]" />
            <span className="font-[family-name:var(--font-display)] text-lg tracking-wide">
              Glowlist
            </span>
          </div>
          <Link
            href="/gallery"
            className="text-sm text-white/70 transition hover:text-white"
          >
            Public playlists
          </Link>
        </nav>

        <main className="flex flex-1 flex-col justify-center py-12 md:py-16">
          <motion.p
            initial={{ opacity: 0.85, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="mb-3 text-xs uppercase tracking-[0.35em] text-[#f5d76e]/90"
          >
            Song · Photo · Lyric
          </motion.p>
          <motion.h1
            initial={{ opacity: 0.9, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="max-w-3xl font-[family-name:var(--font-display)] text-[clamp(3rem,10vw,6.5rem)] leading-[0.92] tracking-tight"
            style={{ textShadow: "0 0 40px rgba(245,215,110,0.35)" }}
          >
            Glowlist
          </motion.h1>
          <motion.p
            initial={{ opacity: 0.85, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="mt-5 max-w-lg text-base text-white/70 md:text-lg"
          >
            Loop your songs, stage a photo story, and float three fading lyric
            lines — all with a glow you tune yourself.
          </motion.p>

          <motion.div
            initial={{ opacity: 0.9, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <Link
              href="/studio"
              className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-medium text-black transition hover:scale-[1.03]"
              style={{
                background: "#f5d76e",
                boxShadow: "0 0 32px rgba(245,215,110,0.45)",
              }}
            >
              Open studio
            </Link>
            <Link
              href="/p/demo-forest"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm backdrop-blur transition hover:bg-white/15"
            >
              Play a demo
            </Link>
          </motion.div>
        </main>

        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45, duration: 0.8 }}
          className="grid gap-3 border-t border-white/10 pt-6 sm:grid-cols-3"
        >
          <Feature
            icon={<Waves className="size-4" />}
            title="Loop one or all"
            body="Upload tracks and keep them cycling while photos glide."
          />
          <Feature
            icon={<Images className="size-4" />}
            title="Timed stills & silent clips"
            body="Set photo duration or pin muted video/GIF windows to the song."
          />
          <Feature
            icon={<Mic2 className="size-4" />}
            title="Synced lyric glow"
            body="Three lines fade with color, size, position, and bloom you choose."
          />
        </motion.section>
      </div>
    </div>
  );
}

function Feature({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-sm">
      <div className="mb-2 flex items-center gap-2 text-[#f5d76e]">{icon}</div>
      <h2 className="text-sm font-medium">{title}</h2>
      <p className="mt-1 text-xs leading-relaxed text-white/50">{body}</p>
    </div>
  );
}
