"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef } from "react";
import { Eye, ListMusic, Settings2, Share2, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { MediaStage } from "./MediaStage";
import { LyricsOverlay } from "./LyricsOverlay";
import { ControlBar } from "./ControlBar";
import { useStudioStore } from "@/lib/store";
import { Button } from "@/components/ui/button";

type Props = {
  readOnly?: boolean;
  onShare?: () => void;
  onCustomize?: () => void;
};

export function PlayerShell({ readOnly, onShare, onCustomize }: Props) {
  const playlist = useStudioStore((s) => s.playlist);
  const player = useStudioStore((s) => s.player);
  const setPlayer = useStudioStore((s) => s.setPlayer);
  const nextSong = useStudioStore((s) => s.nextSong);
  const prevSong = useStudioStore((s) => s.prevSong);
  const tickMedia = useStudioStore((s) => s.tickMedia);
  const setLoopMode = useStudioStore((s) => s.setLoopMode);
  const setLyricStyle = useStudioStore((s) => s.setLyricStyle);

  const audioRef = useRef<HTMLAudioElement>(null);
  const rafRef = useRef<number | null>(null);
  const lastTick = useRef<number>(0);

  const song = playlist.songs[player.songIndex];
  const media = playlist.media[player.mediaIndex];
  const accent = playlist.theme.accent;

  const bgUrl = media?.url || playlist.coverUrl;

  useEffect(() => {
    const el = audioRef.current;
    if (!el || !song?.url) return;
    if (el.src !== song.url && !el.src.endsWith(song.url)) {
      el.src = song.url;
      el.load();
    }
    el.volume = player.volume;
    if (player.isPlaying) {
      void el.play().catch(() => setPlayer({ isPlaying: false }));
    } else {
      el.pause();
    }
  }, [song?.url, player.isPlaying, player.volume, player.songIndex, setPlayer]);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    const onTime = () => {
      setPlayer({
        currentTime: el.currentTime,
        duration: Number.isFinite(el.duration) ? el.duration : player.duration,
      });
    };
    const onMeta = () =>
      setPlayer({ duration: Number.isFinite(el.duration) ? el.duration : 0 });
    const onEnded = () => {
      if (playlist.loopMode === "one") {
        el.currentTime = 0;
        setPlayer({ currentTime: 0, mediaElapsed: 0, mediaIndex: 0 });
        void el.play().catch(() => setPlayer({ isPlaying: false }));
        return;
      }
      nextSong();
    };
    el.addEventListener("timeupdate", onTime);
    el.addEventListener("loadedmetadata", onMeta);
    el.addEventListener("ended", onEnded);
    return () => {
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("loadedmetadata", onMeta);
      el.removeEventListener("ended", onEnded);
    };
  }, [
    nextSong,
    player.duration,
    playlist.loopMode,
    setPlayer,
    song?.id,
  ]);

  useEffect(() => {
    const loop = (ts: number) => {
      if (!lastTick.current) lastTick.current = ts;
      const dt = (ts - lastTick.current) / 1000;
      lastTick.current = ts;
      if (player.isPlaying) {
        tickMedia(dt, audioRef.current?.currentTime ?? player.currentTime);
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lastTick.current = 0;
    };
  }, [player.isPlaying, player.currentTime, tickMedia]);

  const photoLabel = useMemo(() => {
    if (!playlist.media.length) return "No photos yet";
    return `Photo ${player.mediaIndex + 1} of ${playlist.media.length}`;
  }, [playlist.media.length, player.mediaIndex]);

  return (
    <div className="relative min-h-[100dvh] overflow-hidden text-white">
      {/* Atmospheric background */}
      <div className="absolute inset-0 -z-20 bg-[#07070b]" />
      {bgUrl && playlist.theme.backgroundBlur ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={bgUrl}
          alt=""
          className="absolute inset-0 -z-10 h-full w-full scale-110 object-cover opacity-40 blur-3xl"
        />
      ) : null}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background: `radial-gradient(ellipse at 50% 20%, ${accent}${Math.round(
            20 + playlist.theme.glowIntensity * 40
          )
            .toString(16)
            .padStart(2, "0")}, transparent 55%), radial-gradient(ellipse at 80% 90%, ${accent}${Math.round(
            10 + playlist.theme.glowIntensity * 24
          )
            .toString(16)
            .padStart(2, "0")}, transparent 40%)`,
        }}
      />

      <audio ref={audioRef} preload="metadata" />

      <div className="mx-auto flex min-h-[100dvh] w-full max-w-3xl flex-col px-4 pb-6 pt-4 md:px-6 md:pt-6">
        <header className="mb-4 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2"
            >
              <Sparkles className="size-4 shrink-0" style={{ color: accent }} />
              <p className="truncate font-[family-name:var(--font-display)] text-2xl tracking-tight md:text-3xl">
                {song?.title || playlist.title}
              </p>
              <WaveMini playing={player.isPlaying} color={accent} />
            </motion.div>
            <p className="mt-1 truncate text-sm text-white/60">
              {song?.artist ? `de @${song.artist}` : `@${playlist.author}`}
              {song?.album ? ` · ${song.album}` : ""}
            </p>
            <p className="mt-0.5 truncate text-xs text-white/40">
              {playlist.title}
              {playlist.description ? ` — ${playlist.description}` : ""}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-1.5">
            {!readOnly ? (
              <>
                <HeaderIcon
                  label="Customize"
                  onClick={onCustomize}
                  accent={accent}
                >
                  <Settings2 className="size-4" />
                </HeaderIcon>
                <HeaderIcon
                  label="Toggle lyrics"
                  onClick={() =>
                    setLyricStyle({ enabled: !playlist.lyricStyle.enabled })
                  }
                  accent={accent}
                  active={playlist.lyricStyle.enabled}
                >
                  <Eye className="size-4" />
                </HeaderIcon>
              </>
            ) : (
              <HeaderIcon
                label="Toggle lyrics"
                onClick={() =>
                  setLyricStyle({ enabled: !playlist.lyricStyle.enabled })
                }
                accent={accent}
                active={playlist.lyricStyle.enabled}
              >
                <Eye className="size-4" />
              </HeaderIcon>
            )}
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={onShare}
              className="h-9 rounded-full border border-white/15 bg-white/10 px-3 text-xs text-white hover:bg-white/15 hover:text-white"
            >
              <Share2 className="size-3.5" />
              Share
            </Button>
          </div>
        </header>

        <div className="relative flex flex-1 flex-col items-center justify-center gap-5">
          <MediaStage
            item={media}
            isPlaying={player.isPlaying}
            accent={accent}
          />
          <LyricsOverlay
            lines={song?.lyrics ?? []}
            currentTime={player.currentTime}
            style={playlist.lyricStyle}
          />
        </div>

        <div className="mt-5 space-y-3">
          <ControlBar
            accent={accent}
            glassOpacity={playlist.theme.glassOpacity}
            isPlaying={player.isPlaying}
            currentTime={player.currentTime}
            duration={player.duration || song?.duration || 0}
            volume={player.volume}
            loopMode={playlist.loopMode}
            photoLabel={photoLabel}
            onTogglePlay={() => {
              if (!song) return;
              setPlayer({ isPlaying: !player.isPlaying });
            }}
            onSeek={(t) => {
              const el = audioRef.current;
              if (el) el.currentTime = t;
              setPlayer({ currentTime: t });
            }}
            onVolume={(v) => setPlayer({ volume: v })}
            onPrev={() => {
              if (player.currentTime > 2) {
                const el = audioRef.current;
                if (el) el.currentTime = 0;
                setPlayer({ currentTime: 0 });
                return;
              }
              prevSong();
            }}
            onNext={() => {
              if (playlist.loopMode === "one") {
                const el = audioRef.current;
                if (el) el.currentTime = 0;
                setPlayer({ currentTime: 0, mediaElapsed: 0, mediaIndex: 0 });
                return;
              }
              nextSong();
            }}
            onToggleLoop={() =>
              setLoopMode(playlist.loopMode === "one" ? "all" : "one")
            }
          />

          <div className="flex items-center justify-between gap-3 px-1">
            <Link
              href="/gallery"
              className="inline-flex items-center gap-1.5 text-xs text-white/55 transition hover:text-white"
            >
              <ListMusic className="size-3.5" />
              Public playlists
            </Link>
            {!readOnly ? (
              <Link
                href="/studio"
                className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs text-white/80 backdrop-blur transition hover:bg-white/15"
              >
                Create Yours
                <span aria-hidden>→</span>
              </Link>
            ) : (
              <Link
                href="/studio"
                className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs text-white/80 backdrop-blur transition hover:bg-white/15"
              >
                Create Yours
                <span aria-hidden>→</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function HeaderIcon({
  children,
  onClick,
  label,
  accent,
  active,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  label: string;
  accent: string;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex size-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/75 transition hover:bg-white/10 hover:text-white"
      style={active ? { color: accent, boxShadow: `0 0 16px ${accent}55` } : undefined}
    >
      {children}
    </button>
  );
}

function WaveMini({ playing, color }: { playing: boolean; color: string }) {
  return (
    <span className="inline-flex h-4 items-end gap-0.5" aria-hidden>
      {[0.55, 1, 0.7, 0.9].map((h, i) => (
        <motion.span
          key={i}
          className="w-0.5 rounded-full"
          style={{ background: color, originY: 1 }}
          animate={
            playing
              ? { scaleY: [0.4, h, 0.45, h * 0.8, 0.4], opacity: 1 }
              : { scaleY: 0.35, opacity: 0.5 }
          }
          transition={
            playing
              ? { duration: 0.9 + i * 0.1, repeat: Infinity, ease: "easeInOut" }
              : { duration: 0.3 }
          }
          initial={false}
        />
      ))}
    </span>
  );
}
