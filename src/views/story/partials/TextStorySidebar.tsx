import { useRef } from "react";
import { Music, X, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BG_COLORS } from "../types";
import { toast } from "sonner";

const MAX_AUDIO_MB = 20;

interface Props {
  textContent: string;
  setTextContent: (v: string) => void;
  selectedBg: string;
  setSelectedBg: (v: string) => void;
  hasMusicText: boolean;
  setHasMusicText: (v: boolean) => void;
  musicFile: File | null;
  setMusicFile: (f: File | null) => void;
  onSubmit: () => void;
  loading?: boolean;
}

export default function TextStorySidebar({
  textContent,
  setTextContent,
  selectedBg,
  setSelectedBg,
  hasMusicText,
  setHasMusicText,
  musicFile,
  setMusicFile,
  onSubmit,
  loading = false,
}: Props) {
  return (
    <div className="flex flex-col flex-1 overflow-y-visible md:overflow-y-auto px-4 py-4 gap-5">
      <div>
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 block">
          Nội dung
        </label>
        <textarea
          value={textContent}
          onChange={(e) => setTextContent(e.target.value)}
          placeholder="Bạn đang nghĩ gì?"
          maxLength={500}
          rows={4}
          className="w-full resize-none rounded-xl bg-muted border border-border px-4 py-3 text-sm text-foreground placeholder-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring transition"
        />
        <p className="text-right text-xs text-muted-foreground/60 mt-1">{textContent.length}/500</p>
      </div>

      <div>
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3 block">
          Màu nền
        </label>
        <div className="grid grid-cols-4 gap-2">
          {BG_COLORS.map((bg) => (
            <button
              key={bg.value}
              onClick={() => setSelectedBg(bg.value)}
              className={cn(
                "h-12 w-full rounded-xl transition-all",
                selectedBg === bg.value && "ring-2 ring-primary ring-offset-2 ring-offset-card scale-105"
              )}
              style={{ background: bg.value }}
              title={bg.label}
            />
          ))}
        </div>
      </div>

      <MusicSection
        hasMusic={hasMusicText}
        setHasMusic={setHasMusicText}
        musicFile={musicFile}
        setMusicFile={setMusicFile}
      />

      <div className="mt-auto pt-4">
        <Button
          disabled={!textContent.trim() || loading}
          onClick={onSubmit}
          className="w-full rounded-xl font-semibold py-5 text-sm"
        >
          {loading ? "Đang đăng..." : "Chia sẻ lên tin"}
        </Button>
      </div>
    </div>
  );
}

export function MusicSection({
  hasMusic,
  setHasMusic,
  musicFile,
  setMusicFile,
}: {
  hasMusic: boolean;
  setHasMusic: (v: boolean) => void;
  musicFile: File | null;
  setMusicFile: (f: File | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const sizeMB = file.size / 1024 / 1024;
    if (sizeMB > MAX_AUDIO_MB) {
      const msg = `File nhạc vượt quá ${MAX_AUDIO_MB}MB (hiện tại: ${sizeMB.toFixed(1)}MB)`;
      toast.error(msg);
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    setMusicFile(file);
  };

  const handleRemove = () => {
    setMusicFile(null);
    setHasMusic(false);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div>
      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 block">
        Nhạc nền
      </label>


      {!hasMusic && (
        <button
          onClick={() => { setHasMusic(true); setTimeout(() => inputRef.current?.click(), 50); }}
          className="flex w-full items-center gap-3 rounded-xl bg-muted hover:bg-accent border border-border px-4 py-3 transition"
        >
          <div className="flex size-8 items-center justify-center rounded-full bg-green-500/20">
            <Music className="size-4 text-green-500" />
          </div>
          <span className="text-sm text-muted-foreground">Thêm nhạc nền (MP3)</span>
        </button>
      )}


      {hasMusic && !musicFile && (
        <div className="flex flex-col gap-2">
          <button
            onClick={() => inputRef.current?.click()}
            className="flex w-full flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-border hover:border-green-500/60 bg-muted hover:bg-accent py-5 transition-all"
          >
            <Upload className="size-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Chọn file MP3</span>
            <span className="text-xs text-muted-foreground/60">Tối đa {MAX_AUDIO_MB}MB</span>
          </button>
          <button
            onClick={() => setHasMusic(false)}
            className="text-xs text-muted-foreground/60 hover:text-muted-foreground text-center transition"
          >
            Huỷ
          </button>
        </div>
      )}



      {hasMusic && musicFile && (
        <div className="rounded-xl border border-green-500/40 bg-green-500/5 p-3 flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-green-500/20">
              <Music className="size-4 text-green-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{musicFile.name}</p>
              <p className="text-xs text-muted-foreground">
                {(musicFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <button
              onClick={handleRemove}
              className="flex size-7 shrink-0 items-center justify-center rounded-full hover:bg-muted transition"
            >
              <X className="size-4 text-muted-foreground" />
            </button>
          </div>

          <audio
            src={URL.createObjectURL(musicFile)}
            controls
            className="w-full h-8"
            style={{ accentColor: "oklch(var(--primary))" }}
          />
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept=".mp3,audio/mpeg"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
