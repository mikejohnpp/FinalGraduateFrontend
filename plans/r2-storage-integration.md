# Tích hợp Cloudflare R2 song song với Supabase

## Mục tiêu

Thêm Cloudflare R2 làm storage chính, chạy song song với Supabase (giữ nguyên khả năng dùng lại). Provider được chọn qua biến môi trường, có cơ chế fallback tự động.

## Kiến trúc

Toàn bộ upload đi qua một lớp trừu tượng `StorageProvider`:

```
src/plugins/storage/
├── types.ts              # StorageProvider interface + UploadResult
├── supabaseProvider.ts   # Bọc lại code Supabase cũ
├── r2Provider.ts         # Dùng @aws-sdk/client-s3 (R2 tương thích S3)
└── index.ts              # Selector + fallback + uploadToStorage()
```

`src/utils/mediaUpload.ts` giữ nguyên chữ ký các hàm public (`uploadMediaFile`, `uploadMediaFiles`, `uploadImageToSupabase`) nên các component/hook đang gọi không cần sửa.

## Cách chọn provider

- `VITE_STORAGE_PROVIDER=r2` → ưu tiên R2. Nếu R2 chưa cấu hình đủ, tự fallback sang Supabase.
- `VITE_STORAGE_PROVIDER=supabase` → ưu tiên Supabase, fallback R2.
- `getActiveProvider()` kiểm tra `isConfigured` để quyết định.

## Phân biệt URL R2 vs Supabase

Không cần phân biệt ở FE. Cả hai provider đều trả về **URL công khai đầy đủ** (`https://...`). BE lưu nguyên URL này. Khi hiển thị, `resolveUploadUrl()` đã có sẵn logic: nếu chuỗi bắt đầu bằng `http://` / `https://` thì trả nguyên, không ghép prefix gateway. Vì vậy ảnh từ R2 hay Supabase đều hiển thị đúng mà không cần thay đổi gì.

## Biến môi trường cần thiết (`.env`)

```
VITE_STORAGE_PROVIDER=r2
VITE_R2_ACCOUNT_ID=<account id>
VITE_R2_ACCESS_KEY_ID=<access key>
VITE_R2_SECRET_ACCESS_KEY=<secret key>
VITE_R2_BUCKET=media
VITE_R2_PUBLIC_URL=https://<public-bucket-domain>
```

`VITE_R2_PUBLIC_URL` là domain public của bucket (bật Public Access hoặc gắn custom domain trong Cloudflare Dashboard).

## Cấu hình phía Cloudflare R2

1. Tạo bucket (ví dụ `media`).
2. Bật Public Access hoặc gắn custom domain → lấy URL đặt vào `VITE_R2_PUBLIC_URL`.
3. Tạo R2 API Token (Access Key + Secret Key) trong R2 → Manage API Tokens.
4. Bật CORS cho bucket để cho phép PUT từ origin của FE:

```json
[
  {
    "AllowedOrigins": ["http://localhost:5173"],
    "AllowedMethods": ["GET", "PUT"],
    "AllowedHeaders": ["*"],
    "MaxAgeSeconds": 3000
  }
]
```

## Lưu ý bảo mật (QUAN TRỌNG)

Cách này để Secret Access Key của R2 nằm trong bundle FE → **bất kỳ ai cũng có thể trích xuất và ghi vào bucket**. Chỉ chấp nhận được cho môi trường DEMO.

Trước khi lên production, nên chuyển sang một trong hai hướng:

- BE cấp presigned URL (FE xin URL rồi PUT trực tiếp), hoặc
- FE upload qua BE proxy.

Lớp trừu tượng `StorageProvider` đã sẵn sàng để thêm một provider "presigned" mà không phải sửa các nơi gọi.
