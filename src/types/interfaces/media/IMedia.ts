/** Loại media hỗ trợ theo API. Nếu bỏ trống/sai giá trị BE mặc định IMAGE. */
export type MediaType = "IMAGE" | "VIDEO" | "AUDIO" | "FILE";

/**
 * Item media dùng khi TẠO/SỬA post & comment.
 * - url: bắt buộc, tối đa 1000 ký tự (link đã upload lên storage).
 * - mediaType: tuỳ chọn (BE default IMAGE).
 * - position: tuỳ chọn (BE tự đánh số theo thứ tự mảng nếu bỏ trống).
 */
export interface MediaInput {
    url: string;
    mediaType?: MediaType;
    position?: number;
}

/**
 * Item media trả về trong response (đã sort theo position tăng dần).
 * Luôn có thêm `id`. Nếu không có media, BE trả `[]` (không null).
 */
export interface MediaItem {
    id: number;
    url: string;
    mediaType: MediaType;
    position: number;
}
