import { useRef, useState } from "react";
import { Video, X, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const MAX_SIZE_MB = 20;
const MAX_DURATION_SEC = 30;

interface Props {
  videoFile: File | null;
  videoPreview: string | null;
  setVideoFile: (f: File | null) => void;
  setVideoPreview: (s: string | null) => void;
  onSubmit: () => void;
  loading?: boolean;
}

export default function VideoStorySidebar({
  videoFile,
  videoPreview,
  setVideoFile,
  setVideoPreview,
  onSubmit,
  loading = false,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [validating, setValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    const sizeMB = file.size / 1024 / 1024;
    if (sizeMB > MAX_SIZE_MB) {
      const msg = `Video vượt quá ${MAX_SIZE_MB}MB (hiện tại: ${sizeMB.toFixed(1)}MB)`;
      setError(msg);
      toast.error(msg);
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    setValidating(true);
    const objectUrl = URL.createObjectURL(file);
    const tempVideo = document.createElement("video");
    tempVideo.preload = "metadata";
    tempVideo.src = objectUrl;

    tempVideo.onloadedmetadata = () => {
      URL.revokeObjectURL(objectUrl);
      setValidating(false);

      if (tempVideo.duration > MAX_DURATION_SEC) {
        const msg = `Video vượt quá ${MAX_DURATION_SEC}s (hiện tại: ${Math.round(tempVideo.duration)}s)`;
        setError(msg);
        toast.error(msg);
        if (inputRef.current) inputRef.current.value = "";
        return;
      }

      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
    };

    tempVideo.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      setValidating(false);
      const msg = "Không thể đọc file video. Vui lòng chọn file khác.";
      setError(msg);
      toast.error(msg);
      if (inputRef.current) inputRef.current.value = "";
    };
  };

  const handleRemove = () => {
    setVideoFile(null);
    setVideoPreview(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="flex flex-col flex-1 overflow-y-auto px-4 py-4 gap-5">
      {!videoPreview ? (
        <button
          onClick={() => inputRef.current?.click()}
          disabled={validating}
          className="flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-border hover:border-pink-500/60 bg-muted hover:bg-accent transition-all py-10 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <div className="flex size-14 items-center justify-center rounded-full bg-pink-500/15">
            <Video className="size-6 text-pink-500" />
          </div>
          <p className="text-sm font-semibold text-foreground">
            {validating ? "Đang kiểm tra..." : "Chọn video từ máy tính"}
          </p>
          <p className="text-xs text-muted-foreground">MP4, MOV, AVI, WEBM</p>
        </button>
      ) : (
        <div className="relative rounded-2xl overflow-hidden">
          <video src={videoPreview} className="w-full h-48 object-cover rounded-2xl" controls />
          <button
            onClick={handleRemove}
            className="absolute top-2 right-2 flex size-7 items-center justify-center rounded-full bg-black/60 hover:bg-black/80 transition"
          >
            <X className="size-4 text-white" />
          </button>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={handleChange}
      />

      {/* Giới hạn */}
      <div className="flex flex-col gap-1 text-center">
        <p className="text-xs text-muted-foreground">
          Tối đa <span className="font-medium text-foreground">{MAX_DURATION_SEC}s</span> và{" "}
          <span className="font-medium text-foreground">{MAX_SIZE_MB}MB</span>
        </p>
        {error && (
          <div className="flex items-center justify-center gap-1.5 text-xs text-destructive mt-1">
            <AlertCircle className="size-3.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      <div className="mt-auto pt-4">
        <Button
          disabled={!videoFile || validating || loading}
          onClick={onSubmit}
          className="w-full rounded-xl font-semibold py-5 text-sm"
        >
          {loading ? "Đang đăng..." : "Chia sẻ lên tin"}
        </Button>
      </div>
    </div>
  );
}
