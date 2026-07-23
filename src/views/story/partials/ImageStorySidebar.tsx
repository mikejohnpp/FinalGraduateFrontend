import { useRef } from "react";
import { Image, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MusicSection } from "./TextStorySidebar";

interface Props {
  imageFile: File | null;
  imagePreview: string | null;
  setImageFile: (f: File | null) => void;
  setImagePreview: (s: string | null) => void;
  overlayText: string;
  setOverlayText: (v: string) => void;
  hasMusicText: boolean;
  setHasMusicText: (v: boolean) => void;
  musicFile: File | null;
  setMusicFile: (f: File | null) => void;
  onSubmit: () => void;
  loading?: boolean;
}

export default function ImageStorySidebar({
  imageFile,
  imagePreview,
  setImageFile,
  setImagePreview,
  overlayText,
  setOverlayText,
  hasMusicText,
  setHasMusicText,
  musicFile,
  setMusicFile,
  onSubmit,
  loading = false,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  return (
    <div className="flex flex-col flex-1 overflow-y-auto px-4 py-4 gap-5">
      {!imagePreview ? (
        <button
          onClick={() => inputRef.current?.click()}
          className="flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-border hover:border-primary/60 bg-muted hover:bg-accent transition-all py-10"
        >
          <div className="flex size-14 items-center justify-center rounded-full bg-primary/10">
            <Image className="size-6 text-primary" />
          </div>
          <p className="text-sm font-semibold text-foreground">Chọn ảnh từ máy tính</p>
          <p className="text-xs text-muted-foreground">JPG, PNG, GIF, WEBP</p>
        </button>
      ) : (
        <div className="relative rounded-2xl overflow-hidden">
          <img src={imagePreview} className="w-full h-48 object-cover" alt="preview" />
          <button
            onClick={() => { setImageFile(null); setImagePreview(null); }}
            className="absolute top-2 right-2 flex size-7 items-center justify-center rounded-full bg-black/60 hover:bg-black/80 transition"
          >
            <X className="size-4 text-white" />
          </button>
        </div>
      )}
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleChange} />

      <div>
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 block">
          Chú thích
        </label>
        <textarea
          value={overlayText}
          onChange={(e) => setOverlayText(e.target.value)}
          placeholder="Thêm chú thích vào ảnh..."
          rows={3}
          maxLength={200}
          className="w-full resize-none rounded-xl bg-muted border border-border px-4 py-3 text-sm text-foreground placeholder-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring transition"
        />
      </div>

      <MusicSection
        hasMusic={hasMusicText}
        setHasMusic={setHasMusicText}
        musicFile={musicFile}
        setMusicFile={setMusicFile}
      />

      <div className="mt-auto pt-4">
        <Button
          disabled={!imageFile || loading}
          onClick={onSubmit}
          className="w-full rounded-xl font-semibold py-5 text-sm"
        >
          {loading ? "Đang đăng..." : "Chia sẻ lên tin"}
        </Button>
      </div>
    </div>
  );
}
