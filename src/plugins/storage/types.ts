export type StorageProviderName = "r2" | "supabase";

export interface UploadResult {
    url: string;
    provider: StorageProviderName;
}

export interface StorageProvider {
    name: StorageProviderName;
    isConfigured: boolean;
    upload(file: File, path: string): Promise<UploadResult>;
}
