import type { LyricLine } from "./types";

/** Parse LRC or plain newline lyrics into timed lines. */
export function parseLyrics(input: string): LyricLine[] {
  const trimmed = input.trim();
  if (!trimmed) return [];

  const lrcLine =
    /^\[(\d{1,2}):(\d{2})(?:\.(\d{1,3}))?\]\s*(.*)$/;
  const lines = trimmed.split(/\r?\n/);
  const timed: LyricLine[] = [];
  let plainIndex = 0;

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;
    const match = line.match(lrcLine);
    if (match) {
      const min = Number(match[1]);
      const sec = Number(match[2]);
      const frac = match[3] ? Number(match[3].padEnd(3, "0")) / 1000 : 0;
      timed.push({
        time: min * 60 + sec + frac,
        text: match[4].trim(),
      });
    } else {
      // Untimed: spread every 4 seconds
      timed.push({ time: plainIndex * 4, text: line });
      plainIndex += 1;
    }
  }

  return timed.sort((a, b) => a.time - b.time);
}

export function lyricsToLrc(lines: LyricLine[]): string {
  return lines
    .map((l) => {
      const m = Math.floor(l.time / 60);
      const s = Math.floor(l.time % 60);
      const cs = Math.floor((l.time % 1) * 100);
      return `[${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}.${String(cs).padStart(2, "0")}] ${l.text}`;
    })
    .join("\n");
}

/** Three-line window centered on the active lyric. */
export function getLyricWindow(
  lines: LyricLine[],
  currentTime: number
): { prev?: LyricLine; current?: LyricLine; next?: LyricLine; index: number } {
  if (!lines.length) return { index: -1 };

  let index = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].time <= currentTime) index = i;
    else break;
  }

  if (index < 0) {
    return { next: lines[0], index: -1 };
  }

  return {
    prev: lines[index - 1],
    current: lines[index],
    next: lines[index + 1],
    index,
  };
}
