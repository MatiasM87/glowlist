"use client";

import { useEffect, useState } from "react";
import { PlayerShell } from "@/components/player/PlayerShell";
import { CustomizePanel } from "@/components/studio/CustomizePanel";
import { useStudioStore } from "@/lib/store";
import { getDemoPlaylist } from "@/lib/demos";

export default function StudioPage() {
  const hydrate = useStudioStore((s) => s.hydrate);
  const panelOpen = useStudioStore((s) => s.panelOpen);
  const setPanelOpen = useStudioStore((s) => s.setPanelOpen);
  const playlist = useStudioStore((s) => s.playlist);
  const loadPlaylist = useStudioStore((s) => s.loadPlaylist);
  const persist = useStudioStore((s) => s.persist);
  const [shareMsg, setShareMsg] = useState<string | null>(null);
  const [seeded, setSeeded] = useState(false);

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (seeded) return;
    const current = useStudioStore.getState().playlist;
    if (current.songs.length || current.media.length) {
      setSeeded(true);
      return;
    }
    const demo = getDemoPlaylist("demo-forest");
    if (!demo) return;
    loadPlaylist({
      ...structuredClone(demo),
      id: crypto.randomUUID(),
      title: "My Glow Playlist",
      author: "you",
      isPublic: false,
      isDemo: false,
    });
    setSeeded(true);
  }, [loadPlaylist, seeded]);

  const onShare = async () => {
    try {
      await persist();
      const url = `${window.location.origin}/p/${playlist.id}`;
      await navigator.clipboard.writeText(url);
      setShareMsg("Link copied");
    } catch {
      setShareMsg("Saved — open from Gallery");
    }
    setTimeout(() => setShareMsg(null), 2000);
  };

  return (
    <>
      <PlayerShell
        onCustomize={() => setPanelOpen(true)}
        onShare={() => void onShare()}
      />
      <CustomizePanel open={panelOpen} onOpenChange={setPanelOpen} />
      {shareMsg && (
        <div className="pointer-events-none fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-full border border-white/15 bg-black/70 px-4 py-2 text-xs text-white backdrop-blur">
          {shareMsg}
        </div>
      )}
    </>
  );
}
