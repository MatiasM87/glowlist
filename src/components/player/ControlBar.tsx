"use client";

import {
  Pause,
  Play,
  Repeat,
  Repeat1,
  SkipBack,
  SkipForward,
  Volume2,
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { formatTime } from "@/lib/format";
import type { LoopMode } from "@/lib/types";
import { cn } from "@/lib/utils";

type Props = {
  accent: string;
  glassOpacity: number;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  loopMode: LoopMode;
  photoLabel: string;
  onTogglePlay: () => void;
  onSeek: (t: number) => void;
  onVolume: (v: number) => void;
  onPrev: () => void;
  onNext: () => void;
  onToggleLoop: () => void;
};

export function ControlBar({
  accent,
  glassOpacity,
  isPlaying,
  currentTime,
  duration,
  volume,
  loopMode,
  photoLabel,
  onTogglePlay,
  onSeek,
  onVolume,
  onPrev,
  onNext,
  onToggleLoop,
}: Props) {
  return (
    <div
      className="w-full rounded-2xl border border-white/15 px-4 py-3 shadow-2xl backdrop-blur-xl md:px-5"
      style={{
        background: `linear-gradient(135deg, rgba(255,255,255,${glassOpacity + 0.06}), rgba(255,255,255,${glassOpacity * 0.5}))`,
        boxShadow: `0 20px 60px rgba(0,0,0,0.45), 0 0 40px ${accent}22`,
        ["--primary" as string]: accent,
        ["--ring" as string]: accent,
      }}
    >
      <div className="mb-2 flex items-center justify-between gap-3 text-[11px] uppercase tracking-[0.18em] text-white/65">
        <button
          type="button"
          onClick={onToggleLoop}
          className="inline-flex items-center gap-1.5 transition hover:text-white"
        >
          {loopMode === "one" ? (
            <Repeat1 className="size-3.5" style={{ color: accent }} />
          ) : (
            <Repeat className="size-3.5" style={{ color: accent }} />
          )}
          <span>{loopMode === "one" ? "Loop One" : "Loop All"}</span>
        </button>
        <span className="truncate text-white/55 normal-case tracking-normal">
          {photoLabel}
        </span>
      </div>

      <div className="mb-3 flex items-center gap-3">
        <span className="w-9 shrink-0 text-xs tabular-nums text-white/60">
          {formatTime(currentTime)}
        </span>
        <Slider
          value={[Number.isFinite(currentTime) ? currentTime : 0]}
          max={Math.max(duration || 1, 1)}
          step={0.1}
          onValueChange={(v) => onSeek(v[0] ?? 0)}
          className="flex-1 **:[[role=slider]]:border-0 **:[[role=slider]]:shadow-[0_0_12px_var(--glow)]"
          style={{ ["--glow" as string]: accent }}
        />
        <span className="w-9 shrink-0 text-right text-xs tabular-nums text-white/60">
          {formatTime(duration)}
        </span>
      </div>

      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1 md:gap-2">
          <IconButton onClick={onPrev} label="Previous">
            <SkipBack className="size-5 fill-current" />
          </IconButton>
          <button
            type="button"
            onClick={onTogglePlay}
            className={cn(
              "mx-1 flex size-12 items-center justify-center rounded-full text-black transition hover:scale-105 active:scale-95"
            )}
            style={{
              background: accent,
              boxShadow: `0 0 24px ${accent}88`,
            }}
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <Pause className="size-5 fill-current" />
            ) : (
              <Play className="ml-0.5 size-5 fill-current" />
            )}
          </button>
          <IconButton onClick={onNext} label="Next">
            <SkipForward className="size-5 fill-current" />
          </IconButton>
        </div>

        <div className="flex w-[38%] max-w-[160px] items-center gap-2">
          <Volume2 className="size-4 shrink-0 text-white/70" />
          <Slider
            value={[volume]}
            max={1}
            step={0.01}
            onValueChange={(v) => onVolume(v[0] ?? 0)}
          />
        </div>
      </div>
    </div>
  );
}

function IconButton({
  children,
  onClick,
  label,
}: {
  children: React.ReactNode;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex size-10 items-center justify-center rounded-full text-white/85 transition hover:bg-white/10 hover:text-white"
    >
      {children}
    </button>
  );
}
