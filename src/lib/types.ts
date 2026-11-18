export type LyricLine = {
  time: number;
  text: string;
};

export type MediaKind = "image" | "video";

export type MediaItem = {
  id: string;
  kind: MediaKind;
  name: string;
  /** Object URL or remote URL */
  url: string;
  /** IndexedDB blob key when local */
  blobKey?: string;
  /** Seconds to show this photo (overrides playlist default) */
  durationSec?: number;
  /** Mute + loop video / GIF-style silent clip */
  silentLoop?: boolean;
  /** Optional window inside the current song (seconds) */
  songStartSec?: number;
  songEndSec?: number;
};

export type Song = {
  id: string;
  title: string;
  artist?: string;
  album?: string;
  url: string;
  blobKey?: string;
  duration?: number;
  lyrics: LyricLine[];
};

export type LyricPosition = "top" | "center" | "bottom";

export type LyricStyle = {
  enabled: boolean;
  color: string;
  fontSize: number;
  position: LyricPosition;
  glow: boolean;
  glowColor: string;
};

export type ThemeSettings = {
  accent: string;
  glowIntensity: number;
  glassOpacity: number;
  backgroundBlur: boolean;
};

export type LoopMode = "one" | "all";

export type Playlist = {
  id: string;
  title: string;
  description: string;
  author: string;
  songs: Song[];
  media: MediaItem[];
  photoDurationSec: number;
  loopMode: LoopMode;
  lyricStyle: LyricStyle;
  theme: ThemeSettings;
  isPublic: boolean;
  coverUrl?: string;
  createdAt: number;
  updatedAt: number;
  /** Demo flag — uses bundled / remote assets */
  isDemo?: boolean;
};

export type PublicPlaylistMeta = {
  id: string;
  title: string;
  description: string;
  author: string;
  coverUrl: string;
  songTitle: string;
  photoCount: number;
  accent: string;
};

export const DEFAULT_LYRIC_STYLE: LyricStyle = {
  enabled: true,
  color: "#ffffff",
  fontSize: 28,
  position: "center",
  glow: true,
  glowColor: "#f5d76e",
};

export const DEFAULT_THEME: ThemeSettings = {
  accent: "#f5d76e",
  glowIntensity: 0.65,
  glassOpacity: 0.18,
  backgroundBlur: true,
};

export function createEmptyPlaylist(partial?: Partial<Playlist>): Playlist {
  const now = Date.now();
  return {
    id: crypto.randomUUID(),
    title: "Untitled Glow",
    description: "",
    author: "you",
    songs: [],
    media: [],
    photoDurationSec: 5,
    loopMode: "all",
    lyricStyle: { ...DEFAULT_LYRIC_STYLE },
    theme: { ...DEFAULT_THEME },
    isPublic: false,
    createdAt: now,
    updatedAt: now,
    ...partial,
  };
}
