"use client";

import Link from "next/link";
import { useEffect, useMemo } from "react";
import { ArrowLeft, Plus, Sparkles } from "lucide-react";
import { PlaylistCard } from "@/components/gallery/PlaylistCard";
import { useStudioStore } from "@/lib/store";
import { DEMO_PLAYLISTS } from "@/lib/demos";

export default function GalleryPage() {
  const hydrate = useStudioStore((s) => s.hydrate);
  const library = useStudioStore((s) => s.library);

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  const playlists = useMemo(() => {
    const localPublic = library.filter((p) => p.isPublic && !p.isDemo);
    const localIds = new Set(localPublic.map((p) => p.id));
    return [
      ...DEMO_PLAYLISTS.filter((d) => !localIds.has(d.id)),
      ...localPublic,
    ];
  }, [library]);

  return (
    <div className="relative min-h-[100dvh] overflow-hidden bg-[#07070b] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(245,215,110,0.14),_transparent_50%),radial-gradient(ellipse_at_bottom_right,_rgba(94,234,212,0.1),_transparent_45%)]" />
      <div className="relative mx-auto max-w-6xl px-4 py-8 md:px-8 md:py-12">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <Link
              href="/"
              className="mb-4 inline-flex items-center gap-1.5 text-sm text-white/50 transition hover:text-white"
            >
              <ArrowLeft className="size-4" />
              Home
            </Link>
            <h1 className="font-[family-name:var(--font-display)] text-4xl tracking-tight md:text-5xl">
              Public glow
            </h1>
            <p className="mt-2 max-w-xl text-sm text-white/55 md:text-base">
              Showcase playlists with song, photos, and fading lyrics. Open a
              demo or publish your own from Studio.
            </p>
          </div>
          <Link
            href="/studio"
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm text-black transition hover:scale-[1.02]"
            style={{
              background: "#f5d76e",
              boxShadow: "0 0 28px rgba(245,215,110,0.45)",
            }}
          >
            <Plus className="size-4" />
            Create yours
          </Link>
        </div>

        {playlists.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-white/15 px-6 py-16 text-center">
            <Sparkles className="mx-auto mb-3 size-6 text-white/40" />
            <p className="text-white/60">No public playlists yet.</p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {playlists.map((p, i) => (
              <PlaylistCard key={p.id} playlist={p} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
