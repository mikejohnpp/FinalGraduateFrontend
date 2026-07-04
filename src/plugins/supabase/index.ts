import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY as string;

if (!supabaseUrl || !supabaseKey) {
    console.warn(
        "[supabase] VITE_SUPABASE_URL hoặc VITE_SUPABASE_KEY chưa được cấu hình. Tính năng upload media sẽ không hoạt động.",
    );
}

/**
 * Supabase client singleton dùng cho upload media (Storage).
 * Cấu hình qua env: VITE_SUPABASE_URL, VITE_SUPABASE_KEY.
 */
export const supabase = createClient(supabaseUrl ?? "", supabaseKey ?? "");

/** Tên bucket lưu media của post/comment. */
export const MEDIA_BUCKET = (import.meta.env.VITE_SUPABASE_MEDIA_BUCKET as string) || "media";

export default supabase;
