import { r2Provider } from "./r2Provider";
import { supabaseProvider } from "./supabaseProvider";
import type { StorageProvider, StorageProviderName, UploadResult } from "./types";

export type { StorageProvider, StorageProviderName, UploadResult };

const preferred = ((import.meta.env.VITE_STORAGE_PROVIDER as string) || "r2").toLowerCase();

const providers: Record<StorageProviderName, StorageProvider> = {
    r2: r2Provider,
    supabase: supabaseProvider,
};

export function getActiveProvider(): StorageProvider {
    const primary = providers[preferred as StorageProviderName];
    if (primary?.isConfigured) return primary;

    const fallback = preferred === "r2" ? supabaseProvider : r2Provider;
    if (fallback.isConfigured) return fallback;

    return primary ?? r2Provider;
}

function buildObjectPath(file: File): string {
    const dotIdx = file.name.lastIndexOf(".");
    const ext = dotIdx >= 0 ? file.name.slice(dotIdx) : "";
    const rand = Math.random().toString(16).slice(2, 8);
    return `${Date.now()}-${rand}${ext}`;
}

export async function uploadToStorage(file: File): Promise<UploadResult> {
    const provider = getActiveProvider();
    const path = buildObjectPath(file);
    return provider.upload(file, path);
}
