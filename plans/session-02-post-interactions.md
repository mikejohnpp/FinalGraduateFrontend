# Plan: Post Interactions + Modals + Layout Width

## Goal

- Thêm modal bình luận (Facebook-style) và modal chia sẻ
- Thêm tương tác cho các nút trong PostCard (like toggle, emoji picker hover, comment/share open modal)
- Mở rộng chiều rộng layout 3 cột

## Structure mới

```
src/views/home/
├── Home.tsx                              # Sửa max-w layout
src/components/home/
├── PostCard.tsx                          # Sửa: thêm state + tương tác
├── CommentModal.tsx                      # NEW: Modal chi tiết bình luận
├── CommentItem.tsx                       # NEW: 1 bình luận đơn
├── ShareModal.tsx                        # NEW: Modal chia sẻ
├── EmojiPicker.tsx                       # NEW: Popover chọn emoji khi hover nút Like
src/data/mock/
├── home.ts                               # Sửa: thêm mock comments
src/types/
├── HomeFeed.ts                           # Sửa: thêm Comment type
```

## Work Breakdown

### Phase 1: Types + Mock Data

| # | Task | File(s) |
|---|---|---|
| 1 | Thêm `Comment` type, update `Post` type | `src/types/HomeFeed.ts` |
| 2 | Thêm mock comments vào posts | `src/data/mock/home.ts` |

### Phase 2: Modals

| # | Task | File(s) | Chi tiết |
|---|---|---|---|
| 3 | Build `CommentItem.tsx` | `src/components/home/CommentItem.tsx` | Avatar + tên + nội dung + thời gian |
| 4 | Build `CommentModal.tsx` | `src/components/home/CommentModal.tsx` | Dialog shadcn, post gốc trên đầu, danh sách comment dưới, input comment ở cuối |
| 5 | Build `ShareModal.tsx` | `src/components/home/ShareModal.tsx` | Dialog nhỏ, option: chia sẻ lên trang cá nhân, nhóm, tin nhắn... |

### Phase 3: PostCard Interactions

| # | Task | File(s) | Chi tiết |
|---|---|---|---|
| 6 | Build `EmojiPicker.tsx` | `src/components/home/EmojiPicker.tsx` | Popover hiện khi hover nút Like, danh sách 👍❤️😆😮😢😡 |
| 7 | Update `PostCard.tsx` | `src/components/home/PostCard.tsx` | Like toggle (click) + EmojiPicker (hover), click comment/comment-count mở CommentModal, click share mở ShareModal |

### Phase 4: Layout Width

| # | Task | File(s) | Chi tiết |
|---|---|---|---|
| 8 | Mở rộng chiều rộng 3 cột | `src/views/home/Home.tsx`, `src/components/home/NewsFeed.tsx` | Tăng max-w của NewsFeed, tăng sidebar width nếu cần |

## Shadcn components dùng thêm

| Component | Use case |
|---|---|
| `Dialog` | CommentModal, ShareModal |
| `Popover` | EmojiPicker (hover vào nút Like) |
| `ScrollArea` | Danh sách comment trong CommentModal |
| `Input` | Nhập bình luận trong CommentModal |
| `Button` | Send comment, share actions |
| `Avatar` | Comment item avatar |
| `Separator` | Phân cách các section trong modal |

## Note

- Tất cả mock data, không gọi API
- `CommentModal` dùng `<Dialog>` của shadcn với kích thước phù hợp (~700px width, có scroll)
- `EmojiPicker` dùng `<Popover>` mở khi hover nút Like
- `ShareModal` dùng `<Dialog>` dạng compact
