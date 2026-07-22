import { supabase, MEDIA_BUCKET } from "@/plugins/supabase";
import type { StorageProvider, UploadResult } from "./types";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY as string | undefined;

export const supabaseProvider: StorageProvider = {
    name: "supabase",
    isConfigured: Boolean(supabaseUrl && supabaseKey),

    async upload(file: File, path: string): Promise<UploadResult> {
        const { error } = await supabase.storage.from(MEDIA_BUCKET).upload(path, file, {
            cacheControl: "3600",
            upsert: false,
            contentType: file.type || undefined,
        });

        if (error) {
            throw new Error(`Upload thất bại: ${error.message}`);
        }

        const { data } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path);
        if (!data?.publicUrl) {
            throw new Error("Không lấy được đường dẫn công khai của tệp");
        }

        return { url: data.publicUrl, provider: "supabase" };
    },
};
