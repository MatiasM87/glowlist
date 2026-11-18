"use client";

import { create } from "zustand";
import {
  createEmptyPlaylist,
  type LoopMode,
  type LyricStyle,
  type MediaItem,
  type Playlist,
  type Song,
  type ThemeSettings,
} from "./types";
import {
  deletePlaylist as dbDelete,
  listPlaylists,
  savePlaylist,
  storeFile,
} from "./db";
import { parseLyrics } from "./lyrics";
import { DEMO_PLAYLISTS } from "./demos";

type PlayerState = {
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  songIndex: number;
  mediaIndex: number;
  volume: number;
  mediaElapsed: number;
};

type StudioStore = {
  playlist: Playlist;
  library: Playlist[];
  hydrated: boolean;
  player: PlayerState;
  panelOpen: boolean;
  setPanelOpen: (open: boolean) => void;
  hydrate: () => Promise<void>;
  loadPlaylist: (playlist: Playlist) => void;
  newPlaylist: () => void;
  updateMeta: (patch: Partial<Pick<Playlist, "title" | "description" | "author">>) => void;
  setLoopMode: (mode: LoopMode) => void;
  setPhotoDuration: (sec: number) => void;
  setLyricStyle: (patch: Partial<LyricStyle>) => void;
  setTheme: (patch: Partial<ThemeSettings>) => void;
  addSongs: (files: FileList | File[]) => Promise<void>;
  removeSong: (id: string) => void;
  setSongLyrics: (songId: string, raw: string) => void;
  updateSong: (songId: string, patch: Partial<Song>) => void;
  addMedia: (files: FileList | File[]) => Promise<void>;
  removeMedia: (id: string) => void;
  updateMedia: (id: string, patch: Partial<MediaItem>) => void;
  reorderMedia: (from: number, to: number) => void;
  setPlayer: (patch: Partial<PlayerState>) => void;
  nextSong: () => void;
  prevSong: () => void;
  nextMedia: () => void;
  tickMedia: (dt: number, songTime: number) => void;
  persist: () => Promise<void>;
  publish: () => Promise<void>;
  removeFromLibrary: (id: string) => Promise<void>;
  publicLibrary: () => Playlist[];
};

const initialPlayer: PlayerState = {
  currentTime: 0,
  duration: 0,
  isPlaying: false,
  songIndex: 0,
  mediaIndex: 0,
  volume: 0.85,
  mediaElapsed: 0,
};

export const useStudioStore = create<StudioStore>((set, get) => ({
  playlist: createEmptyPlaylist({ title: "My Glow Playlist" }),
  library: [],
  hydrated: false,
  player: initialPlayer,
  panelOpen: false,

  setPanelOpen: (open) => set({ panelOpen: open }),

  hydrate: async () => {
    try {
      const library = await listPlaylists();
      set({ library, hydrated: true });
    } catch {
      set({ hydrated: true });
    }
  },

  loadPlaylist: (playlist) =>
    set({
      playlist: structuredClone(playlist),
      player: { ...initialPlayer },
    }),

  newPlaylist: () =>
    set({
      playlist: createEmptyPlaylist({ title: "My Glow Playlist" }),
      player: { ...initialPlayer },
    }),

  updateMeta: (patch) =>
    set((s) => ({ playlist: { ...s.playlist, ...patch, updatedAt: Date.now() } })),

  setLoopMode: (mode) =>
    set((s) => ({ playlist: { ...s.playlist, loopMode: mode } })),

  setPhotoDuration: (sec) =>
    set((s) => ({
      playlist: { ...s.playlist, photoDurationSec: Math.max(1, Math.min(60, sec)) },
    })),

  setLyricStyle: (patch) =>
    set((s) => ({
      playlist: {
        ...s.playlist,
        lyricStyle: { ...s.playlist.lyricStyle, ...patch },
      },
    })),

  setTheme: (patch) =>
    set((s) => ({
      playlist: { ...s.playlist, theme: { ...s.playlist.theme, ...patch } },
    })),

  addSongs: async (files) => {
    const list = Array.from(files);
    const songs: Song[] = [];
    for (const file of list) {
      if (!file.type.startsWith("audio/")) continue;
      const { key, url } = await storeFile(file);
      songs.push({
        id: crypto.randomUUID(),
        title: file.name.replace(/\.[^.]+$/, ""),
        url,
        blobKey: key,
        lyrics: [],
      });
    }
    if (!songs.length) return;
    set((s) => ({
      playlist: {
        ...s.playlist,
        songs: [...s.playlist.songs, ...songs],
        updatedAt: Date.now(),
      },
    }));
  },

  removeSong: (id) =>
    set((s) => ({
      playlist: {
        ...s.playlist,
        songs: s.playlist.songs.filter((x) => x.id !== id),
      },
      player: {
        ...s.player,
        songIndex: Math.min(
          s.player.songIndex,
          Math.max(0, s.playlist.songs.filter((x) => x.id !== id).length - 1)
        ),
      },
    })),

  setSongLyrics: (songId, raw) =>
    set((s) => ({
      playlist: {
        ...s.playlist,
        songs: s.playlist.songs.map((song) =>
          song.id === songId ? { ...song, lyrics: parseLyrics(raw) } : song
        ),
      },
    })),

  updateSong: (songId, patch) =>
    set((s) => ({
      playlist: {
        ...s.playlist,
        songs: s.playlist.songs.map((song) =>
          song.id === songId ? { ...song, ...patch } : song
        ),
      },
    })),

  addMedia: async (files) => {
    const list = Array.from(files);
    const media: MediaItem[] = [];
    for (const file of list) {
      const isImage = file.type.startsWith("image/");
      const isVideo = file.type.startsWith("video/");
      if (!isImage && !isVideo) continue;
      const { key, url } = await storeFile(file);
      media.push({
        id: crypto.randomUUID(),
        kind: isVideo ? "video" : "image",
        name: file.name,
        url,
        blobKey: key,
        silentLoop: isVideo,
      });
    }
    if (!media.length) return;
    set((s) => ({
      playlist: {
        ...s.playlist,
        media: [...s.playlist.media, ...media],
        coverUrl: s.playlist.coverUrl || media[0]?.url,
        updatedAt: Date.now(),
      },
    }));
  },

  removeMedia: (id) =>
    set((s) => ({
      playlist: {
        ...s.playlist,
        media: s.playlist.media.filter((m) => m.id !== id),
      },
    })),

  updateMedia: (id, patch) =>
    set((s) => ({
      playlist: {
        ...s.playlist,
        media: s.playlist.media.map((m) => (m.id === id ? { ...m, ...patch } : m)),
      },
    })),

  reorderMedia: (from, to) =>
    set((s) => {
      const media = [...s.playlist.media];
      const [item] = media.splice(from, 1);
      media.splice(to, 0, item);
      return { playlist: { ...s.playlist, media } };
    }),

  setPlayer: (patch) => set((s) => ({ player: { ...s.player, ...patch } })),

  nextSong: () => {
    const { playlist, player } = get();
    if (!playlist.songs.length) return;
    if (playlist.loopMode === "one") {
      set({ player: { ...player, currentTime: 0, mediaElapsed: 0, mediaIndex: 0 } });
      return;
    }
    const next = (player.songIndex + 1) % playlist.songs.length;
    set({
      player: {
        ...player,
        songIndex: next,
        currentTime: 0,
        mediaElapsed: 0,
        mediaIndex: 0,
      },
    });
  },

  prevSong: () => {
    const { playlist, player } = get();
    if (!playlist.songs.length) return;
    if (player.currentTime > 2) {
      set({ player: { ...player, currentTime: 0 } });
      return;
    }
    const prev =
      (player.songIndex - 1 + playlist.songs.length) % playlist.songs.length;
    set({
      player: {
        ...player,
        songIndex: prev,
        currentTime: 0,
        mediaElapsed: 0,
        mediaIndex: 0,
      },
    });
  },

  nextMedia: () => {
    const { playlist, player } = get();
    if (!playlist.media.length) return;
    const next = (player.mediaIndex + 1) % playlist.media.length;
    set({ player: { ...player, mediaIndex: next, mediaElapsed: 0 } });
  },

  tickMedia: (dt, songTime) => {
    const { playlist, player } = get();
    const items = playlist.media;
    if (!items.length) return;

    // Prefer media windows tied to song time
    const windowed = items
      .map((m, i) => ({ m, i }))
      .filter(
        ({ m }) =>
          m.songStartSec != null &&
          m.songEndSec != null &&
          songTime >= m.songStartSec &&
          songTime < m.songEndSec
      );
    if (windowed.length) {
      const pick = windowed[windowed.length - 1];
      if (pick.i !== player.mediaIndex) {
        set({ player: { ...player, mediaIndex: pick.i, mediaElapsed: 0 } });
      }
      return;
    }

    const current = items[player.mediaIndex];
    if (!current || current.kind === "video") {
      // videos advance on their own end / via manual next for silent loops with duration
      if (current?.kind === "video" && current.songStartSec == null) {
        const dur = current.durationSec ?? playlist.photoDurationSec;
        const elapsed = player.mediaElapsed + dt;
        if (elapsed >= dur) {
          get().nextMedia();
        } else {
          set({ player: { ...player, mediaElapsed: elapsed } });
        }
      }
      return;
    }

    const dur = current.durationSec ?? playlist.photoDurationSec;
    const elapsed = player.mediaElapsed + dt;
    if (elapsed >= dur) {
      get().nextMedia();
    } else {
      set({ player: { ...player, mediaElapsed: elapsed } });
    }
  },

  persist: async () => {
    const { playlist } = get();
    const toSave = {
      ...playlist,
      isDemo: false,
      coverUrl: playlist.coverUrl || playlist.media[0]?.url,
    };
    await savePlaylist(toSave);
    const library = await listPlaylists();
    set({ library, playlist: toSave });
  },

  publish: async () => {
    const { playlist } = get();
    const published = {
      ...playlist,
      isPublic: true,
      isDemo: false,
      coverUrl: playlist.coverUrl || playlist.media[0]?.url,
      updatedAt: Date.now(),
    };
    await savePlaylist(published);
    const library = await listPlaylists();
    set({ library, playlist: published });
  },

  removeFromLibrary: async (id) => {
    await dbDelete(id);
    const library = await listPlaylists();
    set({ library });
  },

  publicLibrary: () => {
    const { library } = get();
    const localPublic = library.filter((p) => p.isPublic);
    const demoIds = new Set(localPublic.map((p) => p.id));
    return [
      ...DEMO_PLAYLISTS.filter((d) => !demoIds.has(d.id)),
      ...localPublic,
    ];
  },
}));
