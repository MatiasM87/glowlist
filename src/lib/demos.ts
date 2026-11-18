import type { Playlist } from "./types";

const FOREST_LYRICS = `[00:00.00] Soft light through the pines
[00:04.00] Footsteps slow in morning dew
[00:08.00] Birds write lines across the sky
[00:12.00] I breathe the gold you leave behind
[00:16.00] Every leaf remembers you
[00:20.00] Lost in woods, found in tune
[00:24.00] Echoes fold into my chest
[00:28.00] Morning walk, we never rest
[00:32.00] Soft light through the pines
[00:36.00] Footsteps slow in morning dew
[00:40.00] Hold this hush a little more
[00:44.00] Forest echoes, open door`;

const NIGHT_LYRICS = `[00:00.00] Neon rivers on wet glass
[00:04.00] City pulse in second gear
[00:08.00] Your silhouette in window frames
[00:12.00] Night drive, nowhere near
[00:16.00] Dashboard glow, a quiet vow
[00:20.00] Miles unwind like silver thread
[00:24.00] We chase the edge of afterglow
[00:28.00] Until the sky turns red
[00:32.00] Neon rivers on wet glass
[00:36.00] City pulse in second gear
[00:40.00] Hold the wheel, release the past
[00:44.00] Night drive, we disappear`;

import { parseLyrics } from "./lyrics";

export const DEMO_PLAYLISTS: Playlist[] = [
  {
    id: "demo-forest",
    title: "Lost in the Woods",
    description: "A misty forest walk with gold-hour glow and fading lyrics.",
    author: "elena_m",
    songs: [
      {
        id: "demo-forest-song",
        title: "Morning Walk",
        artist: "elena_m",
        album: "Forest Echoes",
        url: "/demos/forest-echoes.wav",
        duration: 45,
        lyrics: parseLyrics(FOREST_LYRICS),
      },
    ],
    media: [
      {
        id: "f1",
        kind: "image",
        name: "Mist pines",
        url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=80",
        durationSec: 5,
      },
      {
        id: "f2",
        kind: "image",
        name: "Golden path",
        url: "https://images.unsplash.com/photo-1511497584788-876760111969?w=1200&q=80",
        durationSec: 5,
      },
      {
        id: "f3",
        kind: "image",
        name: "Sun shafts",
        url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200&q=80",
        durationSec: 6,
      },
      {
        id: "f4",
        kind: "image",
        name: "Moss light",
        url: "https://images.unsplash.com/photo-1425913397330-cf8af2ff40a1?w=1200&q=80",
        durationSec: 5,
      },
    ],
    photoDurationSec: 5,
    loopMode: "all",
    lyricStyle: {
      enabled: true,
      color: "#fff8e7",
      fontSize: 30,
      position: "center",
      glow: true,
      glowColor: "#f5d76e",
    },
    theme: {
      accent: "#f5d76e",
      glowIntensity: 0.7,
      glassOpacity: 0.16,
      backgroundBlur: true,
    },
    isPublic: true,
    isDemo: true,
    coverUrl:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80",
    createdAt: Date.now() - 86400000 * 3,
    updatedAt: Date.now() - 86400000,
  },
  {
    id: "demo-night",
    title: "Night Drive",
    description: "Cyan glass, wet streets, and lyrics that drift with the beat.",
    author: "kai_nova",
    songs: [
      {
        id: "demo-night-song",
        title: "Afterglow Lane",
        artist: "kai_nova",
        album: "Midnight Glass",
        url: "/demos/night-drive.wav",
        duration: 45,
        lyrics: parseLyrics(NIGHT_LYRICS),
      },
    ],
    media: [
      {
        id: "n1",
        kind: "image",
        name: "Rain neon",
        url: "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1200&q=80",
        durationSec: 4,
      },
      {
        id: "n2",
        kind: "image",
        name: "City blur",
        url: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=1200&q=80",
        durationSec: 5,
      },
      {
        id: "n3",
        kind: "image",
        name: "Tunnel light",
        url: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=1200&q=80",
        durationSec: 5,
      },
      {
        id: "n4",
        kind: "image",
        name: "Skyline dusk",
        url: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=1200&q=80",
        durationSec: 6,
      },
    ],
    photoDurationSec: 5,
    loopMode: "one",
    lyricStyle: {
      enabled: true,
      color: "#e8fbff",
      fontSize: 28,
      position: "bottom",
      glow: true,
      glowColor: "#5eead4",
    },
    theme: {
      accent: "#5eead4",
      glowIntensity: 0.75,
      glassOpacity: 0.2,
      backgroundBlur: true,
    },
    isPublic: true,
    isDemo: true,
    coverUrl:
      "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800&q=80",
    createdAt: Date.now() - 86400000 * 2,
    updatedAt: Date.now() - 3600000,
  },
  {
    id: "demo-coast",
    title: "Salt & Silk",
    description: "Rose-gold shore stills with soft lyric fades.",
    author: "mira.waves",
    songs: [
      {
        id: "demo-coast-song",
        title: "Tide Letters",
        artist: "mira.waves",
        album: "Salt & Silk",
        url: "/demos/forest-echoes.wav",
        duration: 45,
        lyrics: parseLyrics(`[00:00.00] Salt on skin, silk on air
[00:05.00] Waves rewrite the shoreline prayer
[00:10.00] Your name dissolves in brighter foam
[00:15.00] Every tide brings something home
[00:20.00] Horizon thin as evening glass
[00:25.00] We let the slower hours pass
[00:30.00] Soft as silk, sharp as spray
[00:35.00] Hold this light, don't look away
[00:40.00] Salt on skin, silk on air`),
      },
    ],
    media: [
      {
        id: "c1",
        kind: "image",
        name: "Shore gold",
        url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80",
        durationSec: 5,
      },
      {
        id: "c2",
        kind: "image",
        name: "Soft dunes",
        url: "https://images.unsplash.com/photo-1505144808419-1957a94ca61e?w=1200&q=80",
        durationSec: 5,
      },
      {
        id: "c3",
        kind: "image",
        name: "Pink dusk",
        url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&q=80",
        durationSec: 6,
      },
    ],
    photoDurationSec: 5,
    loopMode: "all",
    lyricStyle: {
      enabled: true,
      color: "#fff0f5",
      fontSize: 32,
      position: "top",
      glow: true,
      glowColor: "#fb7185",
    },
    theme: {
      accent: "#fb7185",
      glowIntensity: 0.6,
      glassOpacity: 0.18,
      backgroundBlur: true,
    },
    isPublic: true,
    isDemo: true,
    coverUrl:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
    createdAt: Date.now() - 86400000,
    updatedAt: Date.now() - 7200000,
  },
];

export function getDemoPlaylist(id: string): Playlist | undefined {
  return DEMO_PLAYLISTS.find((p) => p.id === id);
}
