import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import type { StorageProvider, UploadResult } from "./types";

const accountId = import.meta.env.VITE_R2_ACCOUNT_ID as string | undefined;
const accessKeyId = import.meta.env.VITE_R2_ACCESS_KEY_ID as string | undefined;
const secretAccessKey = import.meta.env.VITE_R2_SECRET_ACCESS_KEY as string | undefined;

export const R2_BUCKET = (import.meta.env.VITE_R2_BUCKET as string) || "media";

const publicBaseUrl = (import.meta.env.VITE_R2_PUBLIC_URL as string | undefined)?.replace(/\/$/, "");

const isConfigured = Boolean(accountId && accessKeyId && secretAccessKey && publicBaseUrl);

const client = isConfigured
    ? new S3Client({
        region: "auto",
        endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
        credentials: {
            accessKeyId: accessKeyId as string,
            secretAccessKey: secretAccessKey as string,
        },
    })
    : null;

export const r2Provider: StorageProvider = {
    name: "r2",
    isConfigured,

    async upload(file: File, path: string): Promise<UploadResult> {
        if (!client || !publicBaseUrl) {
            throw new Error("R2 chưa được cấu hình");
        }

        const body = new Uint8Array(await file.arrayBuffer());

        await client.send(
            new PutObjectCommand({
                Bucket: R2_BUCKET,
                Key: path,
                Body: body,
                ContentType: file.type || undefined,
                CacheControl: "3600",
            }),
        );

        return { url: `${publicBaseUrl}/${path}`, provider: "r2" };
    },
};
