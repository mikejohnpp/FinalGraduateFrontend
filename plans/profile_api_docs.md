# Tài liệu API — Profile (Trang Cá Nhân)

Tài liệu đặc tả chi tiết các API endpoints cho tính năng Profile, dành cho Frontend tích hợp.
Tất cả endpoints đi qua API Gateway (`http://localhost:8080`) với prefix `/users/...`.

---

## Cấu trúc Response chung

**Thành công:**
```json
{
  "success": true,
  "message": "Thông báo thành công",
  "data": { ... },
  "code": 200
}
```

**Lỗi:**
```json
{
  "success": false,
  "message": "Thông báo lỗi chi tiết",
  "data": null,
  "code": "400"
}
```

---

## 1. Lấy thông tin Profile

**Endpoint:** `GET /users/{id}/profile`

**Mô tả:** Lấy toàn bộ thông tin trang cá nhân của một user. Khi xem profile **người khác**, các trường nhạy cảm (`email`, `phoneNumber`) sẽ tự động trả về `null`.

**Headers (bắt buộc):**
- `Authorization: Bearer {token}`
- `X-User-Email`: email của người đang đăng nhập (gateway tự forward)

**Path Variables:**
- `id` (Integer): ID của user cần xem profile.

**Response Thành công (200 OK):**
```json
{
  "success": true,
  "message": "Lấy thông tin người dùng thành công",
  "code": 200,
  "data": {
    "id": 1,
    "userName": "Nguyen Van A",
    "nickName": "nva",
    "avatar": "/uploads/avatars/abc-123.jpg",
    "email": "user1@example.com",       // null nếu xem profile người khác
    "phoneNumber": 123456789,            // null nếu xem profile người khác
    "dateOfBirth": "2000-01-15",
    "role": "USER",
    "isActive": true,
    "coverPhoto": "/uploads/covers/def-456.jpg",
    "friendCount": 42,                   // đếm real-time từ bảng user_friends
    "bio": "Hello world!",
    "location": "Hồ Chí Minh",
    "education": "Đại học Bách Khoa",
    "workplace": "FPT Software",
    "hometown": "Đà Nẵng",
    "relationship": "Độc thân",
    "gender": "Nam",
    "pronouns": "Anh ấy",
    "language": "Tiếng Việt"
  }
}
```

> **FE lưu ý `isOwner`:** Backend KHÔNG trả về trường `isOwner`. FE tự tính bằng cách so sánh `response.data.id === userSlice.userId` trong Redux store. Nếu `email` trả về `null` → đó là profile người khác.

**Các lỗi thường gặp:**
| HTTP Code | Khi nào | Message mẫu |
|-----------|---------|--------------|
| 401 | Thiếu/sai JWT token | *(Gateway trả về)* |
| 404 | `id` không tồn tại hoặc user bị xoá | *"Không tìm thấy Người dùng với id: 999"* |

---

## 2. Cập nhật thông tin Profile

**Endpoint:** `PUT /users/profile?userId={userId}`

**Mô tả:** Cập nhật các thông tin cá nhân. Chỉ các trường **gửi lên** (non-null) mới được cập nhật — trường nào không gửi hoặc gửi `null` thì giữ nguyên giá trị cũ.

**Query Parameters:**
- `userId` (Integer, **bắt buộc**): ID của user đang đăng nhập.

**Request Body (JSON) — `ProfileUpdateRequest`:**
```json
{
  "bio": "Hello world!",          // max 101 ký tự
  "location": "Hồ Chí Minh",     // max 100 ký tự
  "education": "ĐH Bách Khoa",   // max 200 ký tự
  "workplace": "FPT Software",    // max 200 ký tự
  "hometown": "Đà Nẵng",         // max 100 ký tự
  "dateOfBirth": "2000-01-15",    // format: yyyy-MM-dd
  "relationship": "Độc thân",    // max 50 ký tự
  "gender": "Nam",                // max 20 ký tự
  "pronouns": "Anh ấy",          // max 50 ký tự
  "language": "Tiếng Việt"        // max 50 ký tự
}
```

> **Partial Update:** FE có thể chỉ gửi những trường cần sửa. Ví dụ chỉ cập nhật bio:
> ```json
> { "bio": "Bio mới của tôi" }
> ```
> Các trường còn lại (location, education, v.v.) sẽ KHÔNG bị ảnh hưởng.

**Response Thành công (200 OK):**
```json
{
  "success": true,
  "message": "Cập nhật thông tin thành công!",
  "code": 200,
  "data": {
    // UserProfileDTO đầy đủ (giống endpoint GET ở trên) với giá trị đã cập nhật
    "id": 1,
    "userName": "Nguyen Van A",
    "bio": "Bio mới của tôi",
    "friendCount": 42,
    // ... tất cả các trường khác
  }
}
```

**Các lỗi thường gặp:**
| HTTP Code | Khi nào | Message mẫu |
|-----------|---------|--------------|
| 400 | Validation lỗi (ví dụ `bio` > 101 ký tự) | Trả về map field errors trong `data` |
| 401 | Thiếu JWT token | *(Gateway trả về)* |
| 404 | `userId` không tồn tại | *"Không tìm thấy Người dùng với id: 999"* |

**Ví dụ lỗi validation (400):**
```json
{
  "success": false,
  "message": "Validation failed",
  "code": "400",
  "data": {
    "bio": "size must be between 0 and 101"
  }
}
```

---

## 3. Upload Ảnh Đại Diện (Avatar)

**Endpoint:** `POST /users/profile/avatar?userId={userId}`

**Mô tả:** Upload ảnh đại diện mới. Server tự tạo tên file ngẫu nhiên (UUID), lưu vào thư mục local, cập nhật trường `avatar` của user, và trả về URL tĩnh.

**Content-Type:** `multipart/form-data`

**Query Parameters:**
- `userId` (Integer, **bắt buộc**): ID của user.

**Form Data:**
- `file` (File, **bắt buộc**): File ảnh cần upload.

**Ví dụ gọi bằng `fetch`:**
```javascript
const formData = new FormData();
formData.append('file', selectedFile);

const response = await fetch(
  `${BASE_URL}/users/profile/avatar?userId=${userId}`,
  {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: formData  // KHÔNG set Content-Type, browser tự thêm boundary
  }
);
```

**Response Thành công (200 OK):**
```json
{
  "success": true,
  "message": "Cập nhật ảnh đại diện thành công!",
  "code": 200,
  "data": "/uploads/avatars/550e8400-e29b-41d4-a716-446655440000.jpg"
}
```

> **Cách dùng URL trả về:** URL trả về là **đường dẫn tương đối** trên user-service. FE cần ghép với host của user-service để hiển thị ảnh:
> ```
> http://localhost:9090/uploads/avatars/550e8400-e29b-41d4-a716-446655440000.jpg
> ```
> Hoặc nếu đi qua gateway:
> ```
> http://localhost:8080/users/uploads/avatars/550e8400-e29b-41d4-a716-446655440000.jpg
> ```

**Các lỗi thường gặp:**
| HTTP Code | Khi nào | Message mẫu |
|-----------|---------|--------------|
| 400 | Thiếu `file` param hoặc file rỗng | *"Required parameter 'file' is not present"* |
| 400 | Lỗi I/O khi ghi file | *"Lỗi khi upload file"* |
| 404 | `userId` không tồn tại | *"Không tìm thấy Người dùng với id: 999"* |

---

## 4. Upload Ảnh Bìa (Cover Photo)

**Endpoint:** `POST /users/profile/cover?userId={userId}`

**Mô tả:** Upload ảnh bìa mới. Hoạt động tương tự endpoint Avatar.

**Content-Type:** `multipart/form-data`

**Query Parameters:**
- `userId` (Integer, **bắt buộc**): ID của user.

**Form Data:**
- `file` (File, **bắt buộc**): File ảnh cần upload.

**Response Thành công (200 OK):**
```json
{
  "success": true,
  "message": "Cập nhật ảnh bìa thành công!",
  "code": 200,
  "data": "/uploads/covers/7c9e6679-7425-40de-944b-e07fc1f90ae7.png"
}
```

**Các lỗi:** Tương tự endpoint Avatar (xem bảng ở mục 3).

---

## 5. Các API Liên Quan (Đã Có Sẵn — Không Cần BE Làm Thêm)

### 5.1. Bài viết của User (Tab "Bài viết")

**Endpoint:** `GET /users/posts?userId={userId}`

Đã có sẵn! Trả về `List<PostSummaryDTO>` với đầy đủ thông tin bài viết.

### 5.2. Bạn bè của User (Tab "Bạn bè")

**Endpoint:** `GET /users/friends?userId={userId}&cursor={cursor}&size={size}`

Đã có sẵn! Trả về `CursorPageResponse<FriendshipDTO>`.

### 5.3. Ảnh của User (Tab "Ảnh")

⏸ **Tạm hoãn.** Post entity chưa có trường image. Endpoint này sẽ được implement khi có tính năng đính kèm ảnh cho bài viết.

---

## Ghi Chú Quan Trọng Cho Frontend

### 1. Routing qua Gateway
Tất cả request đi qua Gateway (`localhost:8080`), gateway strip prefix `/users` rồi forward sang user-service (`localhost:9090`). Ví dụ:

| FE gọi (qua Gateway) | user-service nhận |
|---|---|
| `GET /users/5/profile` | `GET /5/profile` |
| `PUT /users/profile?userId=5` | `PUT /profile?userId=5` |
| `POST /users/profile/avatar?userId=5` | `POST /profile/avatar?userId=5` |
| `POST /users/profile/cover?userId=5` | `POST /profile/cover?userId=5` |

### 2. Xem Profile Người Khác vs Chính Mình
- Backend **luôn trả về profile** cho mọi user ID hợp lệ (không còn lỗi 403).
- Khi xem **chính mình**: `email` và `phoneNumber` có giá trị thật.
- Khi xem **người khác**: `email = null`, `phoneNumber = null`.
- FE xác định `isOwner` bằng: `profileDTO.id === currentUser.id`

### 3. `friendCount` Là Giá Trị Real-time
`friendCount` được đếm trực tiếp từ bảng `user_friends` mỗi lần gọi API — KHÔNG phải cột lưu sẵn trong bảng `users`. Không cần lo về tính đồng bộ.

### 4. Upload File
- Dùng `multipart/form-data`, field name phải là `file`.
- **KHÔNG** set header `Content-Type` thủ công khi dùng `FormData` — browser tự thêm `multipart/form-data; boundary=...`
- File được lưu local tại thư mục `uploads/` trên user-service server.

### 5. Partial Update
Endpoint `PUT /users/profile` hỗ trợ **partial update** — chỉ gửi những field cần sửa, các field không gửi sẽ giữ nguyên. Đây là cách tiếp cận thân thiện với form UI — FE có thể gửi toàn bộ form data mà không lo ghi đè null.
