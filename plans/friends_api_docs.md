# Tài liệu API - Friends (Bạn bè)

Tài liệu này mô tả chi tiết các API endpoints cho tính năng Bạn bè (Friends) để Frontend tích hợp. Tất cả các endpoint đều đi qua API Gateway với prefix chung là `/users/friends`.

---

## Cấu trúc Response chung

Mọi response thành công sẽ tuân theo cấu trúc `ApiResponse<T>`:

```json
{
  "success": true,
  "message": "Thông báo thành công",
  "data": { ... }, // Có thể là object, array, số, hoặc null
  "code": 200 // hoặc 201
}
```

Mọi response lỗi (4xx, 5xx) sẽ tuân theo cấu trúc `ErrorResponse`:

```json
{
  "success": false,
  "message": "Thông báo lỗi chi tiết",
  "data": null, // Hoặc object chứa chi tiết lỗi validation (nếu code 400)
  "code": "400" // Mã lỗi HTTP dưới dạng string (VD: "400", "404", "409")
}
```

---

## 1. Lấy danh sách bạn bè
**Endpoint:** `GET /users/friends`

**Mô tả:** Lấy danh sách bạn bè đã kết nối (status = ACCEPTED) của một user, có hỗ trợ phân trang dạng cursor.

**Query Parameters:**
- `userId` (Integer, **bắt buộc**): ID của user hiện tại.
- `cursor` (String, optional): ISO 8601 timestamp của item cuối cùng ở page trước (lấy từ trường `nextCursor` của response). Bỏ trống ở page đầu tiên.
- `size` (Integer, optional): Số lượng item mỗi trang. Mặc định: 20.

**Response Thành công (200 OK):**
```json
{
  "success": true,
  "message": "Lấy danh sách bạn bè thành công!",
  "code": 200,
  "data": {
    "data": [
      {
        "user": {
          "id": 2,
          "name": "Nguyen Van A",
          "avatar": "https://...",
          "nickName": "nva"
        },
        "friendSince": "2026-05-30T01:45:00Z",
        "mutualFriendCount": 5
      }
    ],
    "nextCursor": "2026-05-30T01:45:00Z", // Gửi giá trị này vào tham số 'cursor' cho request tiếp theo
    "hasMore": true // true nếu còn dữ liệu, false nếu đã hết
  }
}
```

---

## 2. Lấy danh sách lời mời kết bạn (Pending)
**Endpoint:** `GET /users/friends/requests`

**Mô tả:** Lấy danh sách các lời mời kết bạn **đã nhận** chưa xử lý (status = PENDING).

**Query Parameters:**
- `userId` (Integer, **bắt buộc**): ID của user hiện hành (người nhận lời mời).
- `cursor` (String, optional): ISO 8601 timestamp.
- `size` (Integer, optional): Số lượng mỗi trang. Mặc định: 10.

**Response Thành công (200 OK):**
```json
{
  "success": true,
  "message": "Lấy danh sách lời mời thành công!",
  "code": 200,
  "data": {
    "data": [
      {
        "requestId": 3, // ID của người gửi (dùng cho API accept/decline)
        "sender": {
          "id": 3,
          "name": "Tran Thi B",
          "avatar": "https://...",
          "nickName": null
        },
        "mutualFriendCount": 2,
        "createdAt": "2026-05-30T02:00:00Z"
      }
    ],
    "nextCursor": "2026-05-30T02:00:00Z",
    "hasMore": false
  }
}
```

---

## 3. Lấy số lượng lời mời chưa xử lý (Badge count)
**Endpoint:** `GET /users/friends/requests/count`

**Mô tả:** Lấy tổng số lời mời kết bạn đang chờ (PENDING) để hiển thị badge đỏ.

**Query Parameters:**
- `userId` (Integer, **bắt buộc**): ID của user hiện tại.

**Response Thành công (200 OK):**
```json
{
  "success": true,
  "message": "Lấy số lượng lời mời thành công!",
  "code": 200,
  "data": 4 // Số lượng lời mời
}
```

---

## 4. Gửi lời mời kết bạn
**Endpoint:** `POST /users/friends/requests`

**Mô tả:** Gửi lời mời kết bạn đến một user khác.

**Request Body (JSON):**
```json
{
  "userId": 1,         // ID của người gửi (user hiện tại)
  "targetUserId": 2    // ID của người nhận
}
```

**Response Thành công (201 Created):**
```json
{
  "success": true,
  "message": "Đã gửi lời mời kết bạn!",
  "code": 201,
  "data": null
}
```

**Các lỗi thường gặp (FE cần bắt):**
- **400 Bad Request:** Lỗi dữ liệu không hợp lệ (ví dụ thiếu `userId` hoặc `targetUserId`). Hoặc khi `userId` == `targetUserId` (Tự kết bạn với chính mình). Message: *"Không thể tự kết bạn với chính mình"*.
- **404 Not Found:** `targetUserId` không tồn tại.
- **409 Conflict:**
    - Nếu đã gửi lời mời rồi: *"Lời mời kết bạn đã tồn tại"*
    - Nếu đã là bạn bè rồi: *"Hai người đã là bạn bè"*
    - *(Lưu ý: Nếu user B đã gửi lời mời cho A, giờ A gửi lại cho B -> Backend sẽ tự động ACCEPT luôn và trả về 201)*

---

## 5. Chấp nhận lời mời kết bạn
**Endpoint:** `PUT /users/friends/requests/{requestId}/accept`

**Mô tả:** User hiện hành đồng ý kết bạn với người gửi lời mời.

**Path Variables:**
- `requestId` (Integer): Bằng chính ID của người đã gửi lời mời.

**Query Parameters:**
- `userId` (Integer, **bắt buộc**): ID của user hiện hành (người nhận).

**Response Thành công (200 OK):**
```json
{
  "success": true,
  "message": "Chấp nhận lời mời thành công!",
  "code": 200,
  "data": null
}
```

**Các lỗi thường gặp:**
- **404 Not Found:** Lời mời kết bạn không tồn tại (có thể đã bị xoá hoặc đã xử lý).

---

## 6. Từ chối lời mời kết bạn
**Endpoint:** `PUT /users/friends/requests/{requestId}/decline`

**Mô tả:** User hiện hành từ chối lời mời kết bạn (Backend sẽ xoá bản ghi).

**Path Variables:**
- `requestId` (Integer): ID của người đã gửi.

**Query Parameters:**
- `userId` (Integer, **bắt buộc**): ID của user hiện hành.

**Response Thành công (200 OK):**
```json
{
  "success": true,
  "message": "Đã từ chối lời mời kết bạn!",
  "code": 200,
  "data": null
}
```

**Các lỗi thường gặp:**
- **404 Not Found:** Lời mời kết bạn không tồn tại.

---

## 7. Gợi ý bạn bè
**Endpoint:** `GET /users/friends/suggestions`

**Mô tả:** Hiển thị danh sách gợi ý những người có thể quen biết. Backend ưu tiên người có nhiều bạn chung nhất. Các kết quả đã được lọc bỏ chính mình, bạn bè hiện tại, và những người đang có lời mời kết bạn qua lại.

**Query Parameters:**
- `userId` (Integer, **bắt buộc**): ID của user hiện tại.
- `cursor` (String, optional): String cursor (lấy từ `nextCursor` của trang trước, với endpoint này nó là User ID).
- `size` (Integer, optional): Mặc định: 20.

**Response Thành công (200 OK):**
```json
{
  "success": true,
  "message": "Lấy gợi ý bạn bè thành công!",
  "code": 200,
  "data": {
    "data": [
      {
        "user": {
          "id": 5,
          "name": "Hoang Van C",
          "avatar": "https://...",
          "nickName": null
        },
        "mutualFriendCount": 8
      }
    ],
    "nextCursor": "5",
    "hasMore": true
  }
}
```

---

## 8. Hủy kết bạn (Unfriend)
**Endpoint:** `DELETE /users/friends/{friendUserId}`

**Mô tả:** Xóa quan hệ bạn bè giữa 2 người (xoá 2 chiều).

**Path Variables:**
- `friendUserId` (Integer): ID của người bạn cần huỷ kết bạn.

**Query Parameters:**
- `userId` (Integer, **bắt buộc**): ID của user hiện hành (người yêu cầu huỷ).

**Response Thành công (200 OK):**
```json
{
  "success": true,
  "message": "Đã huỷ kết bạn thành công!",
  "code": 200,
  "data": null
}
```

---

## Ghi chú quan trọng cho Frontend (FE)
1. **Lỗi Authorization:** Với mọi request thiếu token JWT, gateway sẽ trả về lỗi `401 Unauthorized`. Vui lòng đính kèm `Authorization: Bearer {token}` ở header.
2. **Infinite Scroll (Cursor-based Pagination):** Các danh sách (bạn bè, lời mời, gợi ý) đều dùng cursor. Khi scroll tới cuối list, FE cần lấy giá trị `nextCursor` của lần gọi trước đó và truyền vào param `cursor=` cho lần gọi tiếp theo. Dừng gọi API khi `hasMore` = `false`.
3. **Cập nhật UI Optimistic:**
    - Khi bấm "Accept", FE có thể ẩn lời mời đó ra khỏi list Pending và cập nhật lại badge count (`count - 1`) trước khi đợi API trả về.
    - Khi bấm "Thêm bạn bè" (Send request), FE có thể chuyển ngay nút thành "Đã gửi lời mời".
