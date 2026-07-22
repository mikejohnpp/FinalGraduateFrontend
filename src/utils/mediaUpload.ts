import { uploadToStorage } from "@/plugins/storage";
import type { MediaType, MediaInput } from "@/types/interfaces/media/IMedia";

/** Suy ra MediaType từ MIME type của file. Mặc định FILE nếu không khớp. */
export function inferMediaType(file: File): MediaType {
    const mime = file.type.toLowerCase();
    if (mime.startsWith("image/")) return "IMAGE";
    if (mime.startsWith("video/")) return "VIDEO";
    if (mime.startsWith("audio/")) return "AUDIO";
    return "FILE";
}

/** Giới hạn kích thước upload (MB) — mặc định 25MB. */
export const MAX_MEDIA_SIZE_MB = 25;

/** Định dạng file được chấp nhận trong input. */
export const MEDIA_ACCEPT = "image/*,video/*,audio/*";

/**
 * Upload một file lên storage và trả về MediaInput (url + mediaType).
 * `position` sẽ được gán ở tầng gọi (theo thứ tự mảng).
 * @throws Error nếu upload thất bại hoặc file quá lớn.
 */
export async function uploadMediaFile(file: File): Promise<MediaInput> {
    if (file.size > MAX_MEDIA_SIZE_MB * 1024 * 1024) {
        throw new Error(`Tệp "${file.name}" vượt quá ${MAX_MEDIA_SIZE_MB}MB`);
    }

    const { url } = await uploadToStorage(file);
    return { url, mediaType: inferMediaType(file) };
}

/**
 * Upload nhiều file song song, gán `position` theo thứ tự mảng đầu vào.
 * @throws Error nếu bất kỳ file nào thất bại.
 */
export async function uploadMediaFiles(files: File[]): Promise<MediaInput[]> {
    const uploaded = await Promise.all(files.map((f) => uploadMediaFile(f)));
    return uploaded.map((m, index) => ({ ...m, position: index }));
}

/** Giới hạn kích thước ảnh profile (avatar/cover) — mặc định 10MB. */
export const MAX_IMAGE_SIZE_MB = 10;

/** Định dạng ảnh được chấp nhận cho avatar/cover. */
export const IMAGE_ACCEPT = "image/*";

/**
 * Upload một ảnh (avatar/cover) lên storage và trả về public URL.
 * Chỉ chấp nhận file ảnh.
 * @throws Error nếu không phải ảnh, quá lớn, hoặc upload thất bại.
 */
export async function uploadImageToSupabase(file: File): Promise<string> {
    if (!file.type.toLowerCase().startsWith("image/")) {
        throw new Error("Chỉ chấp nhận tệp ảnh");
    }
    if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
        throw new Error(`Ảnh vượt quá ${MAX_IMAGE_SIZE_MB}MB`);
    }

    const { url } = await uploadToStorage(file);
    return url;
}
