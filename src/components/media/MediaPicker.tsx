import { useRef } from "react";
import { ImagePlus, X, FileIcon, Music2, Video } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DraftMedia } from "@/hooks/useMediaUpload";
import { MEDIA_ACCEPT } from "@/utils/mediaUpload";

interface MediaPickerProps {
  drafts: DraftMedia[];
  onAdd: (files: FileList | File[]) => void;
  onRemove: (id: string) => void;
  disabled?: boolean;
  /** Kiểu trigger: "button" (nút icon nhỏ) hoặc "dropzone" (khối lớn). */
  variant?: "button" | "dropzone";
  className?: string;
}

/** Preview một draft media theo loại. */
export function DraftPreview({ draft, onRemove }: { draft: DraftMedia; onRemove: (id: string) => void }) {
  return (
    <div className="group relative size-20 shrink-0 overflow-hidden rounded-lg border border-border bg-muted">
      {draft.mediaType === "IMAGE" ? (
        <img src={draft.previewUrl} alt="" className="size-full object-cover" />
      ) : draft.mediaType === "VIDEO" ? (
        <div className="flex size-full flex-col items-center justify-center gap-1 text-muted-foreground">
          <Video className="size-6" />
          <span className="max-w-full truncate px-1 text-[9px]">{draft.file.name}</span>
        </div>
      ) : draft.mediaType === "AUDIO" ? (
        <div className="flex size-full flex-col items-center justify-center gap-1 text-muted-foreground">
          <Music2 className="size-6" />
          <span className="max-w-full truncate px-1 text-[9px]">{draft.file.name}</span>
        </div>
      ) : (
        <div className="flex size-full flex-col items-center justify-center gap-1 text-muted-foreground">
          <FileIcon className="size-6" />
          <span className="max-w-full truncate px-1 text-[9px]">{draft.file.name}</span>
        </div>
      )}

      <button
        type="button"
        onClick={() => onRemove(draft.id)}
        className="absolute top-1 right-1 flex size-5 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/80"
      >
        <X className="size-3" />
      </button>
    </div>
  );
}

/**
 * Chọn / preview / xoá media trước khi submit.
 * Không tự upload — việc upload do hook `useMediaUpload.upload()` xử lý khi submit.
 */
export default function MediaPicker({
  drafts,
  onAdd,
  onRemove,
  disabled,
  variant = "button",
  className,
}: MediaPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handlePick = () => {
    if (!disabled) inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) onAdd(e.target.files);
    e.target.value = ""; // cho phép chọn lại cùng file
  };

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <input
        ref={inputRef}
        type="file"
        accept={MEDIA_ACCEPT}
        multiple
        hidden
        onChange={handleChange}
      />

      {drafts.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {drafts.map((d) => (
            <DraftPreview key={d.id} draft={d} onRemove={onRemove} />
          ))}
        </div>
      )}

      {variant === "dropzone" ? (
        <button
          type="button"
          onClick={handlePick}
          disabled={disabled}
          className="flex items-center justify-center gap-2 rounded-lg border border-dashed border-border py-3 text-sm text-muted-foreground transition-colors hover:border-ring hover:text-foreground disabled:opacity-50"
        >
          <ImagePlus className="size-5" />
          Thêm ảnh / video / âm thanh
        </button>
      ) : (
        <button
          type="button"
          onClick={handlePick}
          disabled={disabled}
          className="flex size-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:opacity-50"
          title="Thêm media"
        >
          <ImagePlus className="size-4" />
        </button>
      )}
    </div>
  );
}
