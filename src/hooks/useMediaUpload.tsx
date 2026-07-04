import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { uploadMediaFiles, inferMediaType, MAX_MEDIA_SIZE_MB } from "@/utils/mediaUpload";
import type { MediaInput, MediaType } from "@/types/interfaces/media/IMedia";

/** Một item media đang được người dùng chọn (chưa/đã upload). */
export interface DraftMedia {
  id: string; // id cục bộ để render/xoá
  file: File;
  previewUrl: string; // objectURL để preview
  mediaType: MediaType;
}

let seq = 0;
const nextId = () => `m-${Date.now()}-${seq++}`;

/**
 * Quản lý danh sách media người dùng chọn cho một post/comment:
 * - thêm/xoá file, tạo preview (objectURL)
 * - upload toàn bộ lên Supabase khi submit → trả về MediaInput[] đã gán position
 *
 * Dùng cho cả tạo mới và chỉnh sửa (existing media truyền vào để hiển thị lại).
 */
export function useMediaUpload() {
  const [drafts, setDrafts] = useState<DraftMedia[]>([]);
  const [uploading, setUploading] = useState(false);
  const objectUrls = useRef<Set<string>>(new Set());

  // Thu hồi objectURL khi unmount để tránh rò rỉ bộ nhớ
  useEffect(() => {
    const urls = objectUrls.current;
    return () => {
      urls.forEach((u) => URL.revokeObjectURL(u));
      urls.clear();
    };
  }, []);

  const addFiles = useCallback((files: FileList | File[]) => {
    const list = Array.from(files);
    const valid: DraftMedia[] = [];
    for (const file of list) {
      if (file.size > MAX_MEDIA_SIZE_MB * 1024 * 1024) {
        toast.error(`Tệp "${file.name}" vượt quá ${MAX_MEDIA_SIZE_MB}MB`);
        continue;
      }
      const previewUrl = URL.createObjectURL(file);
      objectUrls.current.add(previewUrl);
      valid.push({ id: nextId(), file, previewUrl, mediaType: inferMediaType(file) });
    }
    if (valid.length) setDrafts((prev) => [...prev, ...valid]);
  }, []);

  const removeDraft = useCallback((id: string) => {
    setDrafts((prev) => {
      const target = prev.find((d) => d.id === id);
      if (target) {
        URL.revokeObjectURL(target.previewUrl);
        objectUrls.current.delete(target.previewUrl);
      }
      return prev.filter((d) => d.id !== id);
    });
  }, []);

  const clear = useCallback(() => {
    setDrafts((prev) => {
      prev.forEach((d) => {
        URL.revokeObjectURL(d.previewUrl);
        objectUrls.current.delete(d.previewUrl);
      });
      return [];
    });
  }, []);

  /**
   * Upload tất cả draft hiện tại lên Supabase.
   * Trả về MediaInput[] (đã gán position theo thứ tự) hoặc null nếu lỗi.
   * Nếu không có draft → trả về [] (rỗng).
   */
  const upload = useCallback(async (): Promise<MediaInput[] | null> => {
    if (drafts.length === 0) return [];
    setUploading(true);
    try {
      const result = await uploadMediaFiles(drafts.map((d) => d.file));
      return result;
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Tải lên media thất bại";
      toast.error(msg);
      return null;
    } finally {
      setUploading(false);
    }
  }, [drafts]);

  return {
    drafts,
    uploading,
    hasMedia: drafts.length > 0,
    addFiles,
    removeDraft,
    clear,
    upload,
  };
}
