"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Playlist } from "@/lib/types";

type Props = {
  playlist: Playlist;
  index?: number;
};

export function PlaylistCard({ playlist, index = 0 }: Props) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.45 }}
    >
      <Link
        href={`/p/${playlist.id}`}
        className="group block overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.04] transition hover:border-white/20"
        style={{
          boxShadow: `0 0 0 0 transparent`,
        }}
      >
        <div className="relative aspect-[4/5] overflow-hidden">
          {playlist.coverUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={playlist.coverUrl}
              alt=""
              className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-white/5 text-sm text-white/40">
              No cover
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div
            className="pointer-events-none absolute -inset-10 opacity-0 blur-2xl transition duration-500 group-hover:opacity-60"
            style={{ background: playlist.theme.accent }}
          />
          <div className="absolute inset-x-0 bottom-0 p-4">
            <p
              className="font-[family-name:var(--font-display)] text-xl leading-tight"
              style={{
                textShadow: `0 0 18px ${playlist.theme.accent}66`,
              }}
            >
              {playlist.title}
            </p>
            <p className="mt-1 text-sm text-white/65">
              @{playlist.author}
              {playlist.songs[0] ? ` · ${playlist.songs[0].title}` : ""}
            </p>
            <p className="mt-2 line-clamp-2 text-xs text-white/45">
              {playlist.description || `${playlist.media.length} photos · lyrics glow`}
            </p>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
