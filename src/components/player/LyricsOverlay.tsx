"use client";

import { AnimatePresence, motion } from "framer-motion";
import { getLyricWindow } from "@/lib/lyrics";
import type { LyricLine, LyricStyle } from "@/lib/types";
import { cn } from "@/lib/utils";

type Props = {
  lines: LyricLine[];
  currentTime: number;
  style: LyricStyle;
};

export function LyricsOverlay({ lines, currentTime, style }: Props) {
  if (!style.enabled || !lines.length) return null;

  const { prev, current, next } = getLyricWindow(lines, currentTime);

  const positionClass =
    style.position === "top"
      ? "items-start pt-[18vh] md:pt-[14vh]"
      : style.position === "bottom"
        ? "items-end pb-[28vh] md:pb-[24vh]"
        : "items-center";

  const glow = style.glow
    ? `0 0 ${12 + style.fontSize / 4}px ${style.glowColor}88, 0 0 ${28 + style.fontSize / 2}px ${style.glowColor}44`
    : "none";

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 z-20 flex justify-center px-6",
        positionClass
      )}
      aria-live="polite"
    >
      <div className="flex w-full max-w-xl flex-col gap-2 text-center md:max-w-2xl">
        <LyricRow
          keyId={prev ? `p-${prev.time}-${prev.text}` : "p-empty"}
          text={prev?.text}
          opacity={0.35}
          fontSize={style.fontSize * 0.72}
          color={style.color}
          glow={glow}
        />
        <LyricRow
          keyId={current ? `c-${current.time}-${current.text}` : "c-empty"}
          text={current?.text}
          opacity={1}
          fontSize={style.fontSize}
          color={style.color}
          glow={glow}
          active
        />
        <LyricRow
          keyId={next ? `n-${next.time}-${next.text}` : "n-empty"}
          text={next?.text}
          opacity={0.4}
          fontSize={style.fontSize * 0.72}
          color={style.color}
          glow={glow}
        />
      </div>
    </div>
  );
}

function LyricRow({
  keyId,
  text,
  opacity,
  fontSize,
  color,
  glow,
  active,
}: {
  keyId: string;
  text?: string;
  opacity: number;
  fontSize: number;
  color: string;
  glow: string;
  active?: boolean;
}) {
  return (
    <div className="min-h-[1.35em]">
      <AnimatePresence mode="wait">
        {text ? (
          <motion.p
            key={keyId}
            initial={{ opacity: 0, y: active ? 10 : 6, filter: "blur(6px)" }}
            animate={{ opacity, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: active ? -8 : -4, filter: "blur(4px)" }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="font-[family-name:var(--font-lyric)] leading-snug tracking-wide"
            style={{
              fontSize,
              color,
              textShadow: glow,
            }}
          >
            {text}
          </motion.p>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
