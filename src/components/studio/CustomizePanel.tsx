"use client";

import { useMemo, useState } from "react";
import {
  ImagePlus,
  Music2,
  Trash2,
  Upload,
  Save,
  Globe,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useStudioStore } from "@/lib/store";
import { lyricsToLrc } from "@/lib/lyrics";
import type { LyricPosition } from "@/lib/types";

const ACCENTS = [
  { name: "Gold", value: "#f5d76e" },
  { name: "Cyan", value: "#5eead4" },
  { name: "Rose", value: "#fb7185" },
  { name: "Lime", value: "#a3e635" },
  { name: "Sky", value: "#38bdf8" },
  { name: "Amber", value: "#fbbf24" },
  { name: "Violet", value: "#c084fc" },
  { name: "White", value: "#f8fafc" },
];

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function CustomizePanel({ open, onOpenChange }: Props) {
  const playlist = useStudioStore((s) => s.playlist);
  const addSongs = useStudioStore((s) => s.addSongs);
  const addMedia = useStudioStore((s) => s.addMedia);
  const removeSong = useStudioStore((s) => s.removeSong);
  const removeMedia = useStudioStore((s) => s.removeMedia);
  const updateMedia = useStudioStore((s) => s.updateMedia);
  const updateSong = useStudioStore((s) => s.updateSong);
  const setSongLyrics = useStudioStore((s) => s.setSongLyrics);
  const setPhotoDuration = useStudioStore((s) => s.setPhotoDuration);
  const setLoopMode = useStudioStore((s) => s.setLoopMode);
  const setLyricStyle = useStudioStore((s) => s.setLyricStyle);
  const setTheme = useStudioStore((s) => s.setTheme);
  const updateMeta = useStudioStore((s) => s.updateMeta);
  const persist = useStudioStore((s) => s.persist);
  const publish = useStudioStore((s) => s.publish);
  const library = useStudioStore((s) => s.library);
  const loadPlaylist = useStudioStore((s) => s.loadPlaylist);
  const newPlaylist = useStudioStore((s) => s.newPlaylist);

  const [status, setStatus] = useState<string | null>(null);
  const [lyricDraft, setLyricDraft] = useState("");
  const [selectedSongId, setSelectedSongId] = useState<string | null>(null);

  const activeSongId = selectedSongId || playlist.songs[0]?.id || null;
  const activeSong = useMemo(
    () => playlist.songs.find((s) => s.id === activeSongId),
    [playlist.songs, activeSongId]
  );

  const openLyricsFor = (id: string) => {
    const song = playlist.songs.find((s) => s.id === id);
    setSelectedSongId(id);
    setLyricDraft(song ? lyricsToLrc(song.lyrics) : "");
  };

  const onSave = async () => {
    await persist();
    setStatus("Saved to this device");
    setTimeout(() => setStatus(null), 2200);
  };

  const onPublish = async () => {
    await publish();
    setStatus("Published to your public gallery");
    setTimeout(() => setStatus(null), 2200);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full border-white/10 bg-[#0c0c12]/95 text-white sm:max-w-md"
      >
        <SheetHeader className="text-left">
          <SheetTitle className="font-[family-name:var(--font-display)] text-xl text-white">
            Customize
          </SheetTitle>
          <SheetDescription className="text-white/55">
            Songs, photos, silent clips, lyrics, and glow.
          </SheetDescription>
        </SheetHeader>

        <Tabs defaultValue="media" className="mt-4 flex min-h-0 flex-1 flex-col">
          <TabsList className="grid w-full grid-cols-4 bg-white/5">
            <TabsTrigger value="media">Media</TabsTrigger>
            <TabsTrigger value="lyrics">Lyrics</TabsTrigger>
            <TabsTrigger value="look">Look</TabsTrigger>
            <TabsTrigger value="meta">Meta</TabsTrigger>
          </TabsList>

          <ScrollArea className="mt-4 h-[calc(100dvh-12rem)] pr-3">
            <TabsContent value="media" className="mt-0 space-y-6">
              <section className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-white/80">Songs</Label>
                  <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs hover:bg-white/10">
                    <Music2 className="size-3.5" />
                    Upload audio
                    <input
                      type="file"
                      accept="audio/*"
                      multiple
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files) void addSongs(e.target.files);
                        e.target.value = "";
                      }}
                    />
                  </label>
                </div>
                <div className="space-y-2">
                  {playlist.songs.length === 0 && (
                    <EmptyHint>Drop MP3, WAV, or M4A files to start.</EmptyHint>
                  )}
                  {playlist.songs.map((song) => (
                    <div
                      key={song.id}
                      className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-2"
                    >
                      <div className="min-w-0 flex-1">
                        <Input
                          value={song.title}
                          onChange={(e) =>
                            updateSong(song.id, { title: e.target.value })
                          }
                          className="h-8 border-0 bg-transparent px-1 text-sm"
                        />
                        <Input
                          value={song.artist || ""}
                          placeholder="Artist"
                          onChange={(e) =>
                            updateSong(song.id, { artist: e.target.value })
                          }
                          className="h-7 border-0 bg-transparent px-1 text-xs text-white/60"
                        />
                      </div>
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        onClick={() => removeSong(song.id)}
                      >
                        <Trash2 className="size-3.5 text-white/50" />
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                  <div>
                    <p className="text-sm">Loop mode</p>
                    <p className="text-xs text-white/45">One track or entire set</p>
                  </div>
                  <Select
                    value={playlist.loopMode}
                    onValueChange={(v) => setLoopMode(v as "one" | "all")}
                  >
                    <SelectTrigger className="w-[120px] border-white/15 bg-black/30">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="one">Loop one</SelectItem>
                      <SelectItem value="all">Loop all</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </section>

              <section className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-white/80">Photos & silent video</Label>
                  <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs hover:bg-white/10">
                    <ImagePlus className="size-3.5" />
                    Upload
                    <input
                      type="file"
                      accept="image/*,video/*,.gif"
                      multiple
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files) void addMedia(e.target.files);
                        e.target.value = "";
                      }}
                    />
                  </label>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <Label className="text-xs text-white/55">
                      Default photo duration: {playlist.photoDurationSec}s
                    </Label>
                  </div>
                  <Slider
                    value={[playlist.photoDurationSec]}
                    min={1}
                    max={30}
                    step={1}
                    onValueChange={(v) => setPhotoDuration(v[0] ?? 5)}
                  />
                </div>

                <div className="space-y-3">
                  {playlist.media.length === 0 && (
                    <EmptyHint>
                      Add images, GIFs, or muted video loops timed to the song.
                    </EmptyHint>
                  )}
                  {playlist.media.map((item) => (
                    <div
                      key={item.id}
                      className="space-y-2 rounded-xl border border-white/10 bg-white/5 p-3"
                    >
                      <div className="flex gap-3">
                        <div className="size-14 overflow-hidden rounded-lg bg-black/40">
                          {item.kind === "video" ? (
                            <video
                              src={item.url}
                              className="h-full w-full object-cover"
                              muted
                            />
                          ) : (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={item.url}
                              alt=""
                              className="h-full w-full object-cover"
                            />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm">{item.name}</p>
                          <p className="text-[11px] uppercase tracking-wider text-white/40">
                            {item.kind}
                            {item.silentLoop ? " · silent loop" : ""}
                          </p>
                        </div>
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          onClick={() => removeMedia(item.id)}
                        >
                          <Trash2 className="size-3.5 text-white/50" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label className="text-[11px] text-white/45">
                            Duration (s)
                          </Label>
                          <Input
                            type="number"
                            min={1}
                            max={120}
                            value={item.durationSec ?? ""}
                            placeholder={String(playlist.photoDurationSec)}
                            onChange={(e) =>
                              updateMedia(item.id, {
                                durationSec: e.target.value
                                  ? Number(e.target.value)
                                  : undefined,
                              })
                            }
                            className="h-8 border-white/10 bg-black/30"
                          />
                        </div>
                        {item.kind === "video" && (
                          <div className="flex items-end justify-between gap-2 pb-1">
                            <Label className="text-[11px] text-white/45">
                              Mute + loop
                            </Label>
                            <Switch
                              checked={item.silentLoop !== false}
                              onCheckedChange={(v) =>
                                updateMedia(item.id, { silentLoop: v })
                              }
                            />
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label className="text-[11px] text-white/45">
                            Song start (s)
                          </Label>
                          <Input
                            type="number"
                            min={0}
                            step={0.1}
                            value={item.songStartSec ?? ""}
                            placeholder="optional"
                            onChange={(e) =>
                              updateMedia(item.id, {
                                songStartSec: e.target.value
                                  ? Number(e.target.value)
                                  : undefined,
                              })
                            }
                            className="h-8 border-white/10 bg-black/30"
                          />
                        </div>
                        <div>
                          <Label className="text-[11px] text-white/45">
                            Song end (s)
                          </Label>
                          <Input
                            type="number"
                            min={0}
                            step={0.1}
                            value={item.songEndSec ?? ""}
                            placeholder="optional"
                            onChange={(e) =>
                              updateMedia(item.id, {
                                songEndSec: e.target.value
                                  ? Number(e.target.value)
                                  : undefined,
                              })
                            }
                            className="h-8 border-white/10 bg-black/30"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </TabsContent>

            <TabsContent value="lyrics" className="mt-0 space-y-4">
              <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                <div>
                  <p className="text-sm">Show lyrics</p>
                  <p className="text-xs text-white/45">
                    Three fading lines, no background
                  </p>
                </div>
                <Switch
                  checked={playlist.lyricStyle.enabled}
                  onCheckedChange={(v) => setLyricStyle({ enabled: v })}
                />
              </div>

              {playlist.songs.length === 0 ? (
                <EmptyHint>Upload a song first, then paste LRC or plain lyrics.</EmptyHint>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label>Song</Label>
                    <Select
                      value={activeSongId || undefined}
                      onValueChange={openLyricsFor}
                    >
                      <SelectTrigger className="border-white/15 bg-black/30">
                        <SelectValue placeholder="Choose song" />
                      </SelectTrigger>
                      <SelectContent>
                        {playlist.songs.map((s) => (
                          <SelectItem key={s.id} value={s.id}>
                            {s.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Lyrics (LRC or plain lines)</Label>
                    <Textarea
                      value={
                        lyricDraft ||
                        (activeSong ? lyricsToLrc(activeSong.lyrics) : "")
                      }
                      onChange={(e) => setLyricDraft(e.target.value)}
                      onFocus={() => {
                        if (activeSong && !lyricDraft) {
                          setLyricDraft(lyricsToLrc(activeSong.lyrics));
                        }
                      }}
                      placeholder={`[00:12.00] Soft light through the pines\n[00:16.50] Footsteps slow in morning dew`}
                      className="min-h-40 border-white/15 bg-black/30 font-mono text-xs"
                    />
                    <Button
                      size="sm"
                      disabled={!activeSongId}
                      onClick={() => {
                        if (!activeSongId) return;
                        setSongLyrics(activeSongId, lyricDraft);
                        setStatus("Lyrics synced");
                        setTimeout(() => setStatus(null), 1800);
                      }}
                    >
                      Apply lyrics
                    </Button>
                  </div>
                </>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Color</Label>
                  <Input
                    type="color"
                    value={playlist.lyricStyle.color}
                    onChange={(e) => setLyricStyle({ color: e.target.value })}
                    className="h-10 cursor-pointer border-white/15 bg-black/30 p-1"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Glow color</Label>
                  <Input
                    type="color"
                    value={playlist.lyricStyle.glowColor}
                    onChange={(e) =>
                      setLyricStyle({ glowColor: e.target.value })
                    }
                    className="h-10 cursor-pointer border-white/15 bg-black/30 p-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Size · {playlist.lyricStyle.fontSize}px</Label>
                <Slider
                  value={[playlist.lyricStyle.fontSize]}
                  min={16}
                  max={48}
                  step={1}
                  onValueChange={(v) =>
                    setLyricStyle({ fontSize: v[0] ?? 28 })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Position</Label>
                <Select
                  value={playlist.lyricStyle.position}
                  onValueChange={(v) =>
                    setLyricStyle({ position: v as LyricPosition })
                  }
                >
                  <SelectTrigger className="border-white/15 bg-black/30">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="top">Top</SelectItem>
                    <SelectItem value="center">Center</SelectItem>
                    <SelectItem value="bottom">Bottom</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                <div>
                  <p className="text-sm">Lyric glow</p>
                  <p className="text-xs text-white/45">Soft bloom behind words</p>
                </div>
                <Switch
                  checked={playlist.lyricStyle.glow}
                  onCheckedChange={(v) => setLyricStyle({ glow: v })}
                />
              </div>
            </TabsContent>

            <TabsContent value="look" className="mt-0 space-y-5">
              <div className="space-y-2">
                <Label>Accent glow</Label>
                <div className="grid grid-cols-4 gap-2">
                  {ACCENTS.map((a) => (
                    <button
                      key={a.value}
                      type="button"
                      onClick={() =>
                        setTheme({
                          accent: a.value,
                        })
                      }
                      className="flex flex-col items-center gap-1 rounded-xl border border-white/10 bg-white/5 p-2 transition hover:bg-white/10"
                      style={
                        playlist.theme.accent === a.value
                          ? { boxShadow: `0 0 0 1px ${a.value}, 0 0 18px ${a.value}66` }
                          : undefined
                      }
                    >
                      <span
                        className="size-7 rounded-full"
                        style={{
                          background: a.value,
                          boxShadow: `0 0 14px ${a.value}`,
                        }}
                      />
                      <span className="text-[10px] text-white/55">{a.name}</span>
                    </button>
                  ))}
                </div>
                <Input
                  type="color"
                  value={playlist.theme.accent}
                  onChange={(e) => setTheme({ accent: e.target.value })}
                  className="mt-2 h-10 cursor-pointer border-white/15 bg-black/30 p-1"
                />
              </div>

              <div className="space-y-2">
                <Label>
                  Glow intensity · {Math.round(playlist.theme.glowIntensity * 100)}%
                </Label>
                <Slider
                  value={[playlist.theme.glowIntensity]}
                  min={0}
                  max={1}
                  step={0.05}
                  onValueChange={(v) =>
                    setTheme({ glowIntensity: v[0] ?? 0.65 })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>
                  Glass opacity · {Math.round(playlist.theme.glassOpacity * 100)}%
                </Label>
                <Slider
                  value={[playlist.theme.glassOpacity]}
                  min={0.05}
                  max={0.4}
                  step={0.01}
                  onValueChange={(v) =>
                    setTheme({ glassOpacity: v[0] ?? 0.18 })
                  }
                />
              </div>

              <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                <div>
                  <p className="text-sm">Blurred stage backdrop</p>
                  <p className="text-xs text-white/45">
                    Softens the current photo behind the UI
                  </p>
                </div>
                <Switch
                  checked={playlist.theme.backgroundBlur}
                  onCheckedChange={(v) => setTheme({ backgroundBlur: v })}
                />
              </div>
            </TabsContent>

            <TabsContent value="meta" className="mt-0 space-y-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={playlist.title}
                  onChange={(e) => updateMeta({ title: e.target.value })}
                  className="border-white/15 bg-black/30"
                />
              </div>
              <div className="space-y-2">
                <Label>Author</Label>
                <Input
                  value={playlist.author}
                  onChange={(e) => updateMeta({ author: e.target.value })}
                  className="border-white/15 bg-black/30"
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={playlist.description}
                  onChange={(e) => updateMeta({ description: e.target.value })}
                  className="border-white/15 bg-black/30"
                />
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <Button onClick={() => void onSave()} className="w-full gap-2">
                  <Save className="size-4" />
                  Save playlist
                </Button>
                <Button
                  variant="outline"
                  onClick={() => void onPublish()}
                  className="w-full gap-2 border-white/20 bg-transparent text-white hover:bg-white/10"
                >
                  <Globe className="size-4" />
                  Publish to gallery
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => newPlaylist()}
                  className="w-full text-white/70 hover:bg-white/10 hover:text-white"
                >
                  Start blank playlist
                </Button>
                {status && (
                  <p className="text-center text-xs text-emerald-300/90">
                    {status}
                  </p>
                )}
                {library.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <Label className="text-white/55">Saved on this device</Label>
                    {library.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => loadPlaylist(item)}
                        className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-left text-sm transition hover:bg-white/10"
                      >
                        <span className="truncate">{item.title}</span>
                        <span className="text-[10px] uppercase tracking-wider text-white/35">
                          {item.isPublic ? "public" : "private"}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
                <p className="text-[11px] leading-relaxed text-white/40">
                  Media stays on this device (IndexedDB). Published playlists
                  appear in your local public gallery and can be opened via{" "}
                  <code className="text-white/60">/p/&lt;id&gt;</code>.
                </p>
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0c0c12] to-transparent" />
      </SheetContent>
    </Sheet>
  );
}

function EmptyHint({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 rounded-xl border border-dashed border-white/15 bg-white/[0.03] px-3 py-3 text-xs text-white/45">
      <Upload className="mt-0.5 size-3.5 shrink-0" />
      <p>{children}</p>
    </div>
  );
}
