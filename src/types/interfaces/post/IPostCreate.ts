import type { MediaInput } from "@/types/interfaces/media/IMedia";

export interface IPostCreate {
  userId: number;
  content: string;
  isGroupPosted?: boolean;
  groupId?: number | null;
  // Tuỳ chọn: bỏ field / null / [] đều hợp lệ khi tạo.
  media?: MediaInput[] | null;
}

export interface IPostUpdate {
  content: string;
  // Quy tắc BE: null = giữ nguyên media cũ, [] = xoá hết, có phần tử = thay thế toàn bộ.
  media?: MediaInput[] | null;
}
