"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { PlayerShell } from "@/components/player/PlayerShell";
import { useStudioStore } from "@/lib/store";
import { DEMO_PLAYLISTS, getDemoPlaylist } from "@/lib/demos";
import { getPlaylist } from "@/lib/db";

export default function PublicPlayerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const loadPlaylist = useStudioStore((s) => s.loadPlaylist);
  const setPlayer = useStudioStore((s) => s.setPlayer);
  const [status, setStatus] = useState<"loading" | "ready" | "missing">(
    "loading"
  );
  const [shareMsg, setShareMsg] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!id) {
        setStatus("missing");
        return;
      }

      const demo =
        getDemoPlaylist(id) || DEMO_PLAYLISTS.find((p) => p.id === id);
      if (demo) {
        if (cancelled) return;
        loadPlaylist(structuredClone(demo));
        setPlayer({ isPlaying: false, songIndex: 0, mediaIndex: 0, currentTime: 0 });
        setStatus("ready");
        return;
      }

      try {
        const local = await Promise.race([
          getPlaylist(id),
          new Promise<null>((resolve) => setTimeout(() => resolve(null), 2500)),
        ]);
        if (cancelled) return;
        if (local) {
          loadPlaylist(local);
          setPlayer({ isPlaying: false, songIndex: 0, mediaIndex: 0, currentTime: 0 });
          setStatus("ready");
        } else {
          setStatus("missing");
        }
      } catch {
        if (!cancelled) setStatus("missing");
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [id, loadPlaylist, setPlayer]);

  if (status === "loading") {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-[#07070b] text-white/60">
        Loading playlist…
      </div>
    );
  }

  if (status === "missing") {
    return (
      <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-4 bg-[#07070b] px-6 text-center text-white">
        <h1 className="font-[family-name:var(--font-display)] text-3xl">
          Playlist not found
        </h1>
        <p className="max-w-md text-sm text-white/55">
          This link may be a local publish from another device. Try a demo from
          the gallery or create your own.
        </p>
        <div className="flex gap-3">
          <Link
            href="/gallery"
            className="rounded-full border border-white/15 px-4 py-2 text-sm hover:bg-white/10"
          >
            Gallery
          </Link>
          <Link
            href="/studio"
            className="rounded-full bg-[#f5d76e] px-4 py-2 text-sm text-black"
          >
            Create yours
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <PlayerShell
        readOnly
        onShare={async () => {
          try {
            await navigator.clipboard.writeText(window.location.href);
            setShareMsg("Link copied");
            setTimeout(() => setShareMsg(null), 1800);
          } catch {
            setShareMsg(null);
          }
        }}
      />
      {shareMsg && (
        <div className="pointer-events-none fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-full border border-white/15 bg-black/70 px-4 py-2 text-xs text-white backdrop-blur">
          {shareMsg}
        </div>
      )}
    </>
  );
}
