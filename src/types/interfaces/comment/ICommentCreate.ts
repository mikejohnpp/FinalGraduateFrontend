import type { MediaInput } from "@/types/interfaces/media/IMedia";

export interface ICommentCreate {
  userId: number;
  content: string;
  parentId?: number | null; // Bỏ qua nếu là comment gốc
  // Tuỳ chọn: bỏ field / null / [] đều hợp lệ khi tạo.
  media?: MediaInput[] | null;
}

export interface ICommentUpdate {
  content: string;
  // Quy tắc BE: null = giữ nguyên media cũ, [] = xoá hết, có phần tử = thay thế toàn bộ.
  media?: MediaInput[] | null;
}
