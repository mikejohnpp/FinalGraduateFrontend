### 📝 Nội dung File: master_design_plan.md

```markdown
# 📜 MASTER DESIGN PLAN: TIỆM CŨ CHILL SHOP

## 🎨 1. HỆ THỐNG DESIGN TOKENS & QUY TẮC CHUNG (GLOBAL RULES)
*Thiết kế ưu tiên **Desktop First**, tập trung vào cảm giác curated và uy tín.*

### Bảng màu (Color Palette)
| Token | Giá trị Hex | Ứng dụng |
| :--- | :--- | :--- |
| **Background** | #FBF7F2 | Nền chính toàn trang |
| **Primary** | #D85A30 | CTA chính, Badge nổi bật, Accent |
| **Primary Light** | #FAECE7 | Nền Badge phụ, Chip stats, Background Zone nhẹ |
| **Card Surface** | #FFFFFF | Bề mặt các thẻ nội dung |
| **Border Warm** | #E8C4A8 | Viền Card tạo cảm giác ấm cúng |
| **Text Primary** | #1A1208 | Tiêu đề và nội dung quan trọng |
| **Text Secondary** | #7A6455 | Mô tả phụ, label, ngày tháng |

### Quy tắc Typography & Bo góc
* **Typography:** Sử dụng font Sans-serif.
    * **Tiêu đề:** 16px (Medium/500).
    * **Nội dung:** 13px (Regular/400).
    * **Label nhỏ:** 11px - 12px.
* **Bo góc (Border Radius):**
    * **Card:** 10px.
    * **Button:** 8px.
    * **Badge/Chip:** Pill (99px).
* **Container:** Max-width 1200px, căn giữa, padding 2 bên 24px.

---

## 🏗️ 2. CHI TIẾT MÀN HÌNH "SHOP UY TÍN" (EDITORIAL PAGE)

### Cấu trúc các Zone (Sắp xếp từ trên xuống)
* **ZONE A — Hero (Shop của tuần):** Card full-width, bố cục 2 cột (Ảnh 320px bên trái, nội dung bên phải). Chứa Badge "Shop của tuần" và CTA "Ghé thăm shop".
* **ZONE B — Top Shop theo danh mục:** Hệ thống Filter Tabs cuộn ngang. Grid 4 cột (Desktop). Card ảnh tỉ lệ 1:1, hiển thị tên shop và rating.
* **ZONE C — Shop mới xác nhận:** Grid 6 cột (Desktop). Card nhỏ gọn, ảnh tỉ lệ 3:4, hiển thị badge "Mới" cho các shop tham gia dưới 30 ngày.
* **ZONE D — Tiêu chí uy tín:** Section nền #FAF7F2. Flexbox chứa 4 mục (Icon Tabler 32px + Text mô tả) về xác minh danh tính và hỗ trợ khách hàng.

---

## 📦 3. CHI TIẾT MÀN HÌNH "LỊCH SỬ ĐƠN HÀNG" (ORDER MANAGEMENT)

### Cấu trúc Layout
* **Zone A (Account Summary):** Banner nền #FAECE7, hiển thị Avatar, tên người dùng và các chỉ số nhanh (Đơn đang giao, Voucher).
* **Zone B (Order List):**
    * **Filter Tabs:** Tất cả, Chờ xác nhận, Đang giao, Hoàn thành, Đã hủy.
    * **Order Card:** Border #E8C4A8. Header chứa Mã đơn/Trạng thái. Body chứa ảnh sản phẩm (1:1). Footer chứa Tổng tiền và nút Hành động.
* **Zone C (Interaction):**
    * **Hủy đơn:** Chỉ xuất hiện khi trạng thái là "Chờ xác nhận". Sử dụng Ghost Button (viền cam, chữ cam).
    * **Modal:** Yêu cầu lý do hủy đơn trước khi thực hiện.

---

## ⚙️ 4. LOGIC XỬ LÝ TRẠNG THÁI & RESPONSIVE

### Trạng thái hệ thống (States)
* **Loading:** Skeleton pulse màu #EDE8E3 khớp chính xác với layout grid của từng trang.
* **Empty:** Ẩn Zone C nếu không có shop mới. Hiển thị thông báo nhẹ nhàng trong Zone B nếu danh mục trống.
* **Error:** Banner #FEF2EE có viền cam, icon cảnh báo và nút "Thử lại".

### Quy tắc Thích ứng (Mobile Adaptation)
* **Zone A:** Chuyển từ 2 cột sang Stack (ảnh trên, text dưới).
* **Zone B/C:** Chuyển Grid sang dạng cuộn ngang (Horizontal Scroll) hoặc Grid 2 cột tùy độ phức tạp.
* **Zone D:** Chuyển từ hàng ngang sang Grid 2x2.

---

## 📐 5. WIREFRAME LAYOUT (MARKDOWN REFERENCE)

################################################################################
#  [LOGO TIỆM CŨ]     [TÌM KIẾM...]      [GIỎ HÀNG]  [AVATAR NGƯỜI DÙNG]       #  <-- Header
################################################################################

--------------------------------------------------------------------------------
|                                                                              |
|  ZONE A: ACCOUNT HERO (Nền: #FAECE7 | Bo góc: 12px)                          |
|  __________________________________________________________________________  |
| |                                     |                                    | |
| |  [AVATAR] Chào bạn, Trâm Anh!       |  (3) Đang giao   (1) Chờ xác nhận  | |
| |  "Chúc bạn một ngày thật chill"     |  (V) 02 Voucher  (*) 1.200 Points  | |
| |_____________________________________|____________________________________| |
|                                                                              |
--------------------------------------------------------------------------------

      [ TẤT CẢ ]  [ Chờ xác nhận ]  [ Đang giao ]  [ Hoàn thành ]  [ Đã hủy ]    <-- Filter Tabs (Zone B)
      (Active: #D85A30)

--------------------------------------------------------------------------------
|  ZONE B: DANH SÁCH ĐƠN HÀNG (Dạng Card | Border: #E8C4A8 | Bo góc: 10px)      |
|                                                                              |
|  __________________________________________________________________________  |
| | Đơn hàng: #TC12345678 - 11/05/2026               [ TRẠNG THÁI: ĐANG GIAO ] | <-- Badge: #D85A30
| | ------------------------------------------------------------------------ | |
| | [ Ảnh ]  Tên sản phẩm: Váy lụa tơ tằm cổ V                1.550.000đ     | |
| | [ 1:1 ]  Phân loại: Màu Kem / Size M   (x1)                              | |
| | ------------------------------------------------------------------------ | |
| |                                                Tổng số tiền: 1.550.000đ  | |
| |                                     [ XEM CHI TIẾT ] [ THEO DÕI ĐƠN ]    | | <-- CTA Buttons
| |__________________________________________________________________________| |
|                                                                              |
|  __________________________________________________________________________  |
| | Đơn hàng: #TC88899911 - 05/05/2026              [ TRẠNG THÁI: CHỜ XÁC NHẬN]| | <-- Badge: #FAECE7
| | ------------------------------------------------------------------------ | |
| | [ Ảnh ]  Tên sản phẩm: Áo Cardigan len mỏng                450.000đ      | |
| | [ 1:1 ]  Phân loại: Be nhạt / Freesize  (x1)                             | |
| | ------------------------------------------------------------------------ | |
| |                                                  Tổng số tiền: 450.000đ  | |
| |                                     [ XEM CHI TIẾT ] [ HỦY ĐƠN ]         | | <-- Hủy đơn: Ghost Button
| |__________________________________________________________________________| |
|                                                                              |
--------------------------------------------------------------------------------

--------------------------------------------------------------------------------
| ZONE D: TIÊU CHÍ UY TÍN (Nền: #FAF7F2 | Icons: Tabler Icons)                 |
|                                                                              |
|  (i) Xác minh identity    (truck) Giao đúng hẹn    (headset) Hỗ trợ 24/7     |
|      Chính chủ 100%           Tỉ lệ > 95%             Phản hồi < 1h          |