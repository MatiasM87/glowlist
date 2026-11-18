import { openDB, type IDBPDatabase } from "idb";
import type { Playlist } from "./types";

const DB_NAME = "glow-playlist";
const DB_VERSION = 1;

type GlowDB = {
  blobs: {
    key: string;
    value: Blob;
  };
  playlists: {
    key: string;
    value: Playlist;
  };
};

let dbPromise: Promise<IDBPDatabase<GlowDB>> | null = null;

function getDb() {
  if (typeof window === "undefined") {
    throw new Error("IndexedDB is only available in the browser");
  }
  if (!dbPromise) {
    dbPromise = openDB<GlowDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains("blobs")) {
          db.createObjectStore("blobs");
        }
        if (!db.objectStoreNames.contains("playlists")) {
          db.createObjectStore("playlists", { keyPath: "id" });
        }
      },
    });
  }
  return dbPromise;
}

export async function saveBlob(key: string, blob: Blob) {
  const db = await getDb();
  await db.put("blobs", blob, key);
}

export async function getBlob(key: string): Promise<Blob | undefined> {
  const db = await getDb();
  return db.get("blobs", key);
}

export async function deleteBlob(key: string) {
  const db = await getDb();
  await db.delete("blobs", key);
}

export async function savePlaylist(playlist: Playlist) {
  const db = await getDb();
  // Strip runtime object URLs that aren't blob keys / remote
  const serializable: Playlist = {
    ...playlist,
    songs: playlist.songs.map((s) => ({
      ...s,
      url: s.blobKey ? "" : s.url,
    })),
    media: playlist.media.map((m) => ({
      ...m,
      url: m.blobKey ? "" : m.url,
    })),
    updatedAt: Date.now(),
  };
  await db.put("playlists", serializable);
}

export async function listPlaylists(): Promise<Playlist[]> {
  const db = await getDb();
  const all = await db.getAll("playlists");
  return Promise.all(all.map(hydratePlaylist));
}

export async function getPlaylist(id: string): Promise<Playlist | null> {
  const db = await getDb();
  const raw = await db.get("playlists", id);
  if (!raw) return null;
  return hydratePlaylist(raw);
}

export async function deletePlaylist(id: string) {
  const db = await getDb();
  const existing = await db.get("playlists", id);
  if (existing) {
    for (const s of existing.songs) {
      if (s.blobKey) await db.delete("blobs", s.blobKey);
    }
    for (const m of existing.media) {
      if (m.blobKey) await db.delete("blobs", m.blobKey);
    }
  }
  await db.delete("playlists", id);
}

async function hydratePlaylist(playlist: Playlist): Promise<Playlist> {
  const songs = await Promise.all(
    playlist.songs.map(async (s) => {
      if (s.blobKey) {
        const blob = await getBlob(s.blobKey);
        if (blob) return { ...s, url: URL.createObjectURL(blob) };
      }
      return s;
    })
  );
  const media = await Promise.all(
    playlist.media.map(async (m) => {
      if (m.blobKey) {
        const blob = await getBlob(m.blobKey);
        if (blob) return { ...m, url: URL.createObjectURL(blob) };
      }
      return m;
    })
  );
  return { ...playlist, songs, media };
}

export async function storeFile(file: File): Promise<{ key: string; url: string }> {
  const key = crypto.randomUUID();
  await saveBlob(key, file);
  return { key, url: URL.createObjectURL(file) };
}
