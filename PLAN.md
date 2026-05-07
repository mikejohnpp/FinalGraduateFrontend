# Plan: Trang chủ Facebook-style

## Goal

Xây dựng trang chủ Facebook-style với:
- Bố cục 3 cột: Left Sidebar + News Feed + Right Sidebar
- Tái sử dụng `MainLayout.tsx` (đã có Header)
- Mock data hoàn toàn, chưa có API

## Router change

- Di chuyển `Home ("/")` từ `Default` layout sang `MainLayout` trong `src/plugins/routers/index.tsx`

## Structure

```
src/views/home/
├── Home.tsx                          # Layout 3 cột (chỉnh sửa lại)
src/components/home/
├── LeftSidebar.tsx                   # Sidebar trái (profile + shortcuts)
├── NewsFeed.tsx                      # Cột giữa wrapper
├── CreatePostCard.tsx                # Ô tạo bài viết
├── StoriesBar.tsx                    # Thanh stories ngang
├── StoryItem.tsx                     # 1 story circle
├── PostCard.tsx                      # 1 bài post
├── RightSidebar.tsx                  # Sidebar phải (contacts + birthdays)
├── ContactItem.tsx                   # 1 dòng contact
src/data/mock/
├── home.ts                           # Mock data: posts, stories, contacts, shortcuts
src/types/
├── HomeFeed.ts                       # Types: Post, Story, Contact, Shortcut
```

## Layout

```
┌──────────────────────────────────────────────────────────┐
│                       Header (MainLayout)                 │
├──────────────┬──────────────────────────┬─────────────────┤
│  LeftSidebar │      NewsFeed            │  RightSidebar   │
│  (280px)     │      (flex-1)            │  (280px)        │
│              │                          │                 │
│  Profile     │  ┌─ CreatePostCard ──┐   │  Birthdays      │
│  card        │  └──────────────────┘   │                 │
│              │                          │  ──────────     │
│  Shortcuts:  │  ┌─ StoriesBar ──────┐   │                 │
│  - Friends   │  │ ○ ○ ○ ○ ○ ○      │   │  Contacts       │
│  - Groups    │  └──────────────────┘   │  ● Friend 1     │
│  - Saved     │                          │  ● Friend 2     │
│  - ...       │  ┌─ PostCard ────────┐   │  ● Friend 3     │
│              │  │ user + nội dung   │   │  ...            │
│  Footer      │  │ ảnh, like/comment │   │                 │
│  links       │  └──────────────────┘   │                 │
│              │                          │                 │
│              │  ┌─ PostCard ────────┐   │                 │
│              │  └──────────────────┘   │                 │
│              │  ...                    │                 │
└──────────────┴──────────────────────────┴─────────────────┘
```

## Shadcn components used

| Area | Components |
|---|---|
| LeftSidebar | `Sidebar`, `SidebarProvider`, `SidebarMenu`, `Avatar`, `Item` |
| CreatePostCard | `Card`, `Avatar`, `Input`, `Button`, `Separator` |
| StoriesBar | `Avatar` (ring styling), `ScrollArea` |
| PostCard | `Card`, `Avatar`, `Button`, `HoverCard` |
| RightSidebar | `Card`, `Avatar`, `Badge`, `Separator` |
| Scroll | `ScrollArea` cho 3 cột |

## Work Breakdown

| # | Task | File(s) | Status |
|---|---|---|---|
| 1 | Tạo type definitions | `src/types/HomeFeed.ts` | pending |
| 2 | Tạo mock data | `src/data/mock/home.ts` | pending |
| 3 | Sửa router: Home vào MainLayout | `src/plugins/routers/index.tsx` | pending |
| 4 | Build LeftSidebar | `src/components/home/LeftSidebar.tsx` | pending |
| 5 | Build RightSidebar | `src/components/home/RightSidebar.tsx` | pending |
| 6 | Build ContactItem | `src/components/home/ContactItem.tsx` | pending |
| 7 | Build CreatePostCard | `src/components/home/CreatePostCard.tsx` | pending |
| 8 | Build StoriesBar + StoryItem | `src/components/home/StoriesBar.tsx`, `src/components/home/StoryItem.tsx` | pending |
| 9 | Build PostCard | `src/components/home/PostCard.tsx` | pending |
| 10 | Build NewsFeed | `src/components/home/NewsFeed.tsx` | pending |
| 11 | Hoàn thiện Home.tsx | `src/views/home/Home.tsx` | pending |
| 12 | Lint + build kiểm tra | — | pending |
