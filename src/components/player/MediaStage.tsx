"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef } from "react";
import type { MediaItem } from "@/lib/types";

type Props = {
  item?: MediaItem;
  isPlaying: boolean;
  accent: string;
};

export function MediaStage({ item, isPlaying, accent }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    el.muted = true;
    if (item?.silentLoop) el.loop = true;
    if (isPlaying) {
      void el.play().catch(() => undefined);
    } else {
      el.pause();
    }
  }, [item, isPlaying]);

  return (
    <div className="relative mx-auto aspect-[3/4] w-full max-w-[min(92vw,420px)] overflow-hidden rounded-[28px] md:max-w-[460px]">
      <div
        className="pointer-events-none absolute -inset-8 -z-10 rounded-[40px] opacity-70 blur-3xl"
        style={{
          background: `radial-gradient(circle at 50% 40%, ${accent}55, transparent 65%)`,
        }}
      />
      <AnimatePresence mode="wait">
        {item ? (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            {item.kind === "video" ? (
              <video
                ref={videoRef}
                src={item.url}
                className="h-full w-full object-cover"
                playsInline
                muted
                loop={item.silentLoop !== false}
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={item.url}
                alt={item.name}
                className="h-full w-full object-cover"
                draggable={false}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex items-center justify-center bg-white/5"
          >
            <p className="px-8 text-center text-sm text-white/50">
              Upload photos or silent video clips to fill this stage
            </p>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="pointer-events-none absolute inset-0 rounded-[28px] ring-1 ring-white/15" />
    </div>
  );
}
