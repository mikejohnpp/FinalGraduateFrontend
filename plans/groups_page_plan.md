# 📋 Plan: Tính năng Nhóm (Facebook-style Groups)

## 🎯 Tổng quan

Xây dựng tính năng **Nhóm** theo layout Facebook gồm 5 màn hình chính:

| Route              | Mô tả                                            |
| ------------------ | ------------------------------------------------ |
| `/groups`          | Feed tổng hợp bài viết từ các nhóm đã tham gia   |
| `/groups/discover` | Khám phá nhóm gợi ý                              |
| `/groups/mine`     | Tất cả nhóm đã tham gia                          |
| `/groups/create`   | Tạo nhóm mới (split-screen: form + live preview) |
| `/groups/:groupId` | Trang chi tiết một nhóm                          |

**Nguyên tắc chung:**

- Header dùng lại từ `MainLayout` qua `<Outlet />` — **không tạo lại**
- Groups có sidebar riêng → dùng nested layout `GroupsLayout` đặt tại `src/views/layouts/`
- `partials/` chỉ dùng cho **child route component** — các UI section không phải route đặt tại `src/components/groups/`
- Toàn bộ UI dùng **shadcn mặc định** — **không override màu sắc, không custom CSS variables**
- Tất cả `export default function`, PascalCase filename, import alias `@/`
- Mock data cho tất cả, chưa có API

---

## 📁 Cấu trúc File (theo AGENTS.md)

```
src/
├── views/
│   ├── layouts/
│   │   └── GroupsLayout.tsx              # Layout: sidebar trái + <Outlet /> phải
│   │                                     # (cùng cấp Default.tsx, MainLayout.tsx)
│   └── groups/
│       ├── GroupsFeed.tsx                # Route: /groups
│       ├── GroupsDiscover.tsx            # Route: /groups/discover
│       ├── GroupsMine.tsx                # Route: /groups/mine
│       ├── GroupCreate.tsx               # Route: /groups/create (standalone, không dùng GroupsLayout)
│       └── GroupDetail.tsx               # Route: /groups/:groupId
│       # Không có partials/ — không có child route nào trong feature groups
│
├── components/
│   └── groups/
│       ├── GroupsSidebar.tsx             # Sidebar trái (dùng trong GroupsLayout)
│       ├── GroupCard.tsx                 # Card nhóm — dùng ở Discover + Mine
│       ├── GroupPostCard.tsx             # Card bài viết trong feed nhóm
│       ├── GroupDiscoverSection.tsx      # Section "Gợi ý cho bạn" (horizontal scroll)
│       ├── GroupDiscoverGrid.tsx         # Section "Gợi ý khác" (4-col grid)
│       ├── GroupMineGrid.tsx             # Grid nhóm đã tham gia (3-col)
│       ├── GroupCreateForm.tsx           # Cột trái của GroupCreate (form)
│       ├── GroupCreatePreview.tsx        # Cột phải của GroupCreate (live preview)
│       └── GroupDetailHeader.tsx         # Cover + tabs của GroupDetail
│
├── data/
│   └── mock/
│       ├── groupsMock.ts                 # Danh sách nhóm (joined + suggested)
│       └── groupPostsMock.ts             # Bài viết trong feed nhóm
│
├── plugins/
│   └── routers/
│       └── index.tsx                     # Thêm PATH_CONSTRAINT + groupsRoutes vào mainRoutes
│
└── types/
    ├── Group.ts                           # Interface Group, GroupMember
    └── GroupPost.ts                       # Interface GroupPost, GroupComment
```

> **Lý do không có `views/groups/partials/`:**
> Theo AGENTS.md, `partials/` chỉ dành cho sub-route (child route) components. Tất cả các màn hình groups (`/groups`, `/groups/discover`, ...) đều là **top-level routes** không có child route nào bên trong → không cần `partials/`. Các UI section đặt trong `src/components/groups/` vì chúng là feature-scoped reusable pieces.

---

## 🗂️ Layout tổng thể

```
┌──────────────────────────────────────────────────────────────┐
│  Header (MainLayout — đã có)                                 │
├──────────────────┬───────────────────────────────────────────┤
│                  │                                           │
│  GroupsSidebar   │  <Outlet /> — thay đổi theo route        │
│  ~280px fixed    │                                           │
│                  │  /groups          → GroupsFeed            │
│  [🔍 Tìm nhóm]   │  /groups/discover → GroupsDiscover        │
│  Bảng feed       │  /groups/mine     → GroupsMine            │
│  Khám phá        │  /groups/:id      → GroupDetail           │
│  Nhóm của bạn    │                                           │
│                  │  ─────────────────────────────────────    │
│  [+ Tạo nhóm]    │  /groups/create   → GroupCreate           │
│                  │  (standalone, KHÔNG qua GroupsLayout)     │
│  ─ Nhóm đã tham  │                                           │
│  [group 1]       │                                           │
│  [group 2]       │                                           │
│  ...             │                                           │
│                  │                                           │
└──────────────────┴───────────────────────────────────────────┘
```

---

## 🧩 TypeScript Types

### `src/types/Group.ts`

```typescript
export type GroupPrivacy = "public" | "private";

export interface Group {
  id: string;
  name: string;
  coverPhoto?: string;
  avatar?: string;
  privacy: GroupPrivacy;
  memberCount: number;
  postFrequency?: string; // "10 bài viết/ngày"
  lastAccessed?: string; // "7 phút trước"
  mutualFriends?: string[]; // Tên bạn bè chung
  mutualFriendCount?: number;
  isJoined: boolean;
  role?: "admin" | "moderator" | "member";
}

export interface GroupMember {
  id: string;
  name: string;
  avatar?: string;
  role: "admin" | "moderator" | "member";
}
```

### `src/types/GroupPost.ts`

```typescript
export interface GroupPost {
  id: string;
  groupId: string;
  groupName: string;
  groupAvatar?: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  authorRole?: string; // "Người tham gia ẩn danh", "Người đóng góp nổi bật"
  content: string;
  images?: string[];
  linkPreview?: {
    url: string;
    title: string;
    description?: string;
    image?: string;
  };
  createdAt: string;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  topComments?: GroupComment[];
}

export interface GroupComment {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  createdAt: string;
  likeCount: number;
  replyCount?: number;
}
```

---

## 🔌 Router Setup (`src/plugins/routers/index.tsx`)

```typescript
// 1. Thêm vào PATH_CONSTRAINT
export const PATH_CONSTRAINT = {
  // ...existing (LOGIN, REGISTER, HOME, FRIENDS, PROFILE, MESSENGER...)
  GROUPS:          '/groups',
  GROUPS_DISCOVER: '/groups/discover',
  GROUPS_MINE:     '/groups/mine',
  GROUPS_CREATE:   '/groups/create',
  GROUP_DETAIL:    '/groups/:groupId',
}

// 2. Lazy imports — thêm vào cùng chỗ với các lazy imports hiện có
const GroupsLayout   = React.lazy(() => import('@/views/layouts/GroupsLayout'))
const GroupsFeed     = React.lazy(() => import('@/views/groups/GroupsFeed'))
const GroupsDiscover = React.lazy(() => import('@/views/groups/GroupsDiscover'))
const GroupsMine     = React.lazy(() => import('@/views/groups/GroupsMine'))
const GroupCreate    = React.lazy(() => import('@/views/groups/GroupCreate'))
const GroupDetail    = React.lazy(() => import('@/views/groups/GroupDetail'))

// 3. groupsRoutes — spread vào children của MainLayout
// cùng cấp với mainRoutes (Home, Friends, Profile, Messenger...)
const groupsRoutes = [
  // GroupCreate standalone — không qua GroupsLayout vì cần full-width split-screen
  {
    path: PATH_CONSTRAINT.GROUPS_CREATE,
    element: (
      <Suspense fallback={<OverlaySpinner show text="Đang tải..." />}>
        <GroupCreate />
      </Suspense>
    ),
  },
  // Các routes còn lại qua GroupsLayout (có sidebar)
  {
    element: (
      <Suspense fallback={<OverlaySpinner show text="Đang tải..." />}>
        <GroupsLayout />
      </Suspense>
    ),
    children: [
      { path: PATH_CONSTRAINT.GROUPS,          element: <GroupsFeed /> },
      { path: PATH_CONSTRAINT.GROUPS_DISCOVER, element: <GroupsDiscover /> },
      { path: PATH_CONSTRAINT.GROUPS_MINE,     element: <GroupsMine /> },
      { path: PATH_CONSTRAINT.GROUP_DETAIL,    element: <GroupDetail /> },
    ],
  },
]

// Trong createBrowserRouter:
{
  element: <MainLayout />,
  children: [
    ...mainRoutes,     // Home, Friends, Profile, Messenger (đang có)
    ...groupsRoutes,   // Groups — thêm vào đây
  ],
}
```

---

## 🧩 Mapping shadcn Components → UI Elements

### `GroupsLayout.tsx` (`src/views/layouts/`)

| UI Element   | shadcn Component                                                    | Ghi chú              |
| ------------ | ------------------------------------------------------------------- | -------------------- |
| Wrapper      | `<div className="flex h-[calc(100vh-var(--header-height))]">`       | Trừ chiều cao header |
| Sidebar      | `<GroupsSidebar />` — import từ `@/components/groups/GroupsSidebar` |                      |
| Content area | `<main className="flex-1 overflow-y-auto"><Outlet /></main>`        |                      |

---

### `GroupsSidebar.tsx` (`src/components/groups/`)

| UI Element           | shadcn Component                                                                                  | Ghi chú                                                     |
| -------------------- | ------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| Container            | `<aside className="w-[280px] shrink-0 overflow-y-auto border-r p-3 space-y-1">`                   |                                                             |
| Header "Nhóm" + cog  | `<div className="flex justify-between items-center">` + `<Button variant="ghost" size="icon">`    | Icon `Settings`                                             |
| Search               | `<div className="relative">` + `<Search>` icon + `<Input placeholder="Tìm kiếm nhóm">`            |                                                             |
| Nav item             | `<Button variant="ghost" className="w-full justify-start gap-3">`                                 | Active → `variant="secondary"`, detect bằng `useLocation()` |
| Icon nav             | `LayoutList`, `Compass`, `Users` từ lucide                                                        | size 20                                                     |
| Nút "+ Tạo nhóm mới" | `<Button className="w-full gap-2"><Plus /> Tạo nhóm mới</Button>`                                 | `useNavigate()` → `/groups/create`                          |
| Separator            | `<Separator />`                                                                                   |                                                             |
| List header + link   | `<div className="flex justify-between">` + `<Button variant="link" size="sm">Xem tất cả</Button>` | → `/groups/mine`                                            |
| Item nhóm            | `<Button variant="ghost" className="w-full justify-start gap-3 h-auto py-2">`                     | `<Avatar size="sm">` + tên + lastAccessed                   |

---

### `GroupsFeed.tsx` + `GroupPostCard.tsx`

| UI Element    | shadcn Component                                                                           | Ghi chú                     |
| ------------- | ------------------------------------------------------------------------------------------ | --------------------------- |
| Page wrapper  | `<div className="max-w-2xl mx-auto py-4 px-4 space-y-4">`                                  |                             |
| Tiêu đề       | `<h3 className="text-lg font-semibold">Hoạt động mới đây</h3>`                             |                             |
| Post card     | `<Card>` — component `<GroupPostCard>`                                                     |                             |
| Group header  | `<CardHeader className="pb-2">` + `<Avatar>` nhóm + tên nhóm bold + role muted + time      | `<DropdownMenu>` `...`      |
| Content       | `<CardContent>` + `<p>`                                                                    |                             |
| Link preview  | `<Card className="mt-2 overflow-hidden">`                                                  | thumbnail + title + domain  |
| Ảnh           | `grid grid-cols-2 gap-1` hoặc full-width                                                   |                             |
| Reaction bar  | `<div className="px-4 py-1 flex justify-between text-sm text-muted-foreground">`           |                             |
| Separator     | `<Separator />`                                                                            |                             |
| Action row    | 3 × `<Button variant="ghost" className="flex-1">`                                          | Thích / Bình luận / Chia sẻ |
| Comment       | `<Avatar className="w-7 h-7">` + bubble `<div className="bg-muted rounded-2xl px-3 py-2">` |                             |
| Comment input | `<Avatar>` nhỏ + `<Input placeholder="Viết bình luận...">`                                 |                             |
| Skeleton      | `<Skeleton className="h-48 w-full rounded-xl">`                                            | Cuối feed                   |

---

### `GroupsDiscover.tsx` + `GroupDiscoverSection.tsx` + `GroupDiscoverGrid.tsx`

| UI Element        | shadcn Component                                                                        | Ghi chú                |
| ----------------- | --------------------------------------------------------------------------------------- | ---------------------- |
| Page wrapper      | `<div className="p-4 space-y-6">`                                                       |                        |
| Section header    | `<div className="flex justify-between">` + `<Button variant="link">Xem tất cả</Button>` |                        |
| Horizontal scroll | `<div className="flex gap-3 overflow-x-auto pb-2">`                                     | `GroupDiscoverSection` |
| Card trong scroll | `<GroupCard>` với `className="w-[220px] shrink-0"`                                      |                        |
| 4-col grid        | `<div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">`                | `GroupDiscoverGrid`    |

#### `GroupCard.tsx` (`src/components/groups/`) — dùng ở cả 2 section

| UI Element            | shadcn Component                                                                  | Ghi chú                              |
| --------------------- | --------------------------------------------------------------------------------- | ------------------------------------ |
| Wrapper               | `<Card className="overflow-hidden relative">`                                     |                                      |
| Cover                 | `<img className="aspect-[16/9] object-cover w-full">`                             |                                      |
| Nút ✕                 | `<Button variant="ghost" size="icon" className="absolute top-1 right-1 h-6 w-6">` | Ẩn nếu `!onDismiss`                  |
| Tên nhóm              | `<p className="font-semibold text-sm line-clamp-2">`                              |                                      |
| Thành viên + tần suất | `<p className="text-xs text-muted-foreground">`                                   |                                      |
| Mutual friends        | Overlap `<Avatar className="w-5 h-5 -ml-1">`                                      | Chỉ hiện nếu `mutualFriendCount > 0` |
| Nút "Tham gia nhóm"   | `<Button variant="outline" className="w-full" size="sm">`                         |                                      |

**Props:**

```typescript
interface GroupCardProps {
  group: Group;
  onDismiss?: () => void; // undefined = không hiện nút ✕
  onJoin?: () => void;
  className?: string;
}
```

---

### `GroupsMine.tsx` + `GroupMineGrid.tsx`

| UI Element     | shadcn Component                                                             | Ghi chú                                                                   |
| -------------- | ---------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| Page header    | `<div className="flex justify-between items-center p-4">`                    |                                                                           |
| Tiêu đề        | `<h2 className="text-xl font-bold">Tất cả các nhóm... (N)</h2>`              | N = `joinedGroups.length`                                                 |
| Sort button    | `<Button variant="outline" size="sm"><ArrowUpDown /> Sắp xếp</Button>`       | Chỉ UI                                                                    |
| Grid           | `<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 p-4">` |                                                                           |
| Mine card      | `<Card className="p-3 flex gap-3">`                                          | Layout ngang                                                              |
| Ảnh            | `<img className="w-16 h-16 rounded-lg object-cover shrink-0">`               |                                                                           |
| Tên            | `<p className="font-semibold text-sm truncate">`                             |                                                                           |
| Last accessed  | `<p className="text-xs text-muted-foreground">`                              |                                                                           |
| Nút "Xem nhóm" | `<Button size="sm" className="w-full mt-2">`                                 | → `/groups/:id`                                                           |
| DropdownMenu   | `<DropdownMenu>`                                                             | "Tắt thông báo", "Đánh dấu đã đọc", `<DropdownMenuSeparator>`, "Rời nhóm" |

---

### `GroupCreate.tsx` — Split screen (standalone)

**Layout:** `flex h-[calc(100vh-var(--header-height))]`

State trong `GroupCreate.tsx`:

```typescript
const [groupName, setGroupName] = useState("");
const [privacy, setPrivacy] = useState<GroupPrivacy>("public");
const [invitedFriends, setInvitedFriends] = useState<string[]>([]);
const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");
```

#### `GroupCreateForm.tsx` (`src/components/groups/`)

| UI Element     | shadcn Component                                                        | Ghi chú                                          |
| -------------- | ----------------------------------------------------------------------- | ------------------------------------------------ |
| Breadcrumb     | `<Breadcrumb>`                                                          | "Nhóm" → "Tạo nhóm"                              |
| Tiêu đề        | `<h1 className="text-2xl font-bold">`                                   |                                                  |
| Admin selector | `<Button variant="ghost" className="w-full justify-start h-auto py-2">` | Avatar + tên + "Quản trị viên" + `<ChevronDown>` |
| Input tên nhóm | `<Input placeholder="Tên nhóm" value={groupName} onChange={...}>`       | Controlled                                       |
| Select privacy | `<Select>` + `<SelectTrigger>` + `<SelectContent>`                      | "Công khai" / "Riêng tư"                         |
| Mô tả privacy  | `<p className="text-sm text-muted-foreground">`                         | Thay đổi theo Select                             |
| Input mời bạn  | `<Input placeholder="Mời bạn bè">`                                      |                                                  |
| Tags bạn mời   | `<Badge variant="secondary">tên <X size={12}></Badge>`                  | `flex flex-wrap gap-1`                           |
| Gợi ý bạn      | `<Button variant="link" size="sm">` inline                              |                                                  |
| Nút Tạo        | `<Button className="w-full" disabled={!groupName.trim()}>Tạo</Button>`  |                                                  |

#### `GroupCreatePreview.tsx` (`src/components/groups/`)

| UI Element        | shadcn Component                                                            | Ghi chú                                      |
| ----------------- | --------------------------------------------------------------------------- | -------------------------------------------- |
| Toggle            | 2 × `<Button variant="ghost" size="icon">`                                  | `Monitor`, `Smartphone` icons                |
| Preview card      | `<Card className="overflow-hidden mx-auto">`                                | `max-w-lg` desktop / `max-w-xs` mobile       |
| Cover placeholder | `<div className="aspect-[16/7] bg-muted flex items-center justify-center">` | `<ImageIcon>`                                |
| Tên nhóm          | `<h2>`                                                                      | Reactive: `groupName \|\| 'Tên nhóm'`        |
| Privacy info      | `<p className="text-sm text-muted-foreground">`                             | 🌐/🔒 theo `privacy`                         |
| Tabs (read-only)  | `<Tabs>`                                                                    | Giới thiệu / Bài viết / Thành viên / Sự kiện |
| Post box          | `<div className="border rounded-lg flex gap-2 p-2 m-3">`                    | Placeholder "Bạn đang nghĩ gì?"              |
| About card        | `<Card className="m-3 p-3">`                                                | Privacy + visibility items                   |

---

### `GroupDetail.tsx` + `GroupDetailHeader.tsx`

| UI Element        | shadcn Component                                                                              | Ghi chú           |
| ----------------- | --------------------------------------------------------------------------------------------- | ----------------- |
| Cover             | `<div className="aspect-[16/6] relative"><img className="w-full h-full object-cover"></div>`  |                   |
| Tên nhóm          | `<h1 className="text-3xl font-bold">`                                                         |                   |
| Privacy + members | `<p className="text-muted-foreground">`                                                       |                   |
| Avatar stack      | 3 × `<Avatar className="w-8 h-8 ring-2 ring-background -ml-2 first:ml-0">`                    |                   |
| Actions           | `<Button>Tham gia</Button>` + `<Button variant="outline">Chia sẻ</Button>` + `<DropdownMenu>` |                   |
| Tabs sticky       | `<Tabs>` + `sticky top-[var(--header-height)] z-10 bg-background border-b`                    |                   |
| 2-col layout      | `<div className="grid grid-cols-[2fr_3fr] gap-4 p-4">`                                        | About card + feed |

---

## 📝 Mock Data

### `src/data/mock/groupsMock.ts`

```typescript
import type { Group } from "@/types/Group";

export const joinedGroups: Group[] = [
  {
    id: "g1",
    name: "Hội Đường Dứa Miền Bắc",
    coverPhoto: "https://picsum.photos/seed/g1cover/800/400",
    privacy: "public",
    memberCount: 12400,
    postFrequency: "25 bài viết/ngày",
    lastAccessed: "20 phút trước",
    isJoined: true,
    role: "member",
  },
  // ... 9 nhóm nữa
];

export const suggestedGroups: Group[] = [
  {
    id: "sg1",
    name: "Vibe Code kiếm cơm",
    coverPhoto: "https://picsum.photos/seed/sg1cover/800/400",
    privacy: "public",
    memberCount: 47000,
    postFrequency: "10 bài viết/ngày",
    mutualFriends: ["Hoàng Khang", "Nguyễn Bình"],
    mutualFriendCount: 2,
    isJoined: false,
  },
  // ... 11 nhóm nữa
];
```

### `src/data/mock/groupPostsMock.ts`

```typescript
import type { GroupPost } from '@/types/GroupPost'

// 6–8 bài, đa dạng: text-only, có ảnh, có link preview
export const groupPosts: GroupPost[] = [...]
```

---

## 🚀 Thứ tự Implementation

### Phase 1 – Types, Mock Data & Router (20 phút)

- [ ] `src/types/Group.ts` + `src/types/GroupPost.ts`
- [ ] `src/data/mock/groupsMock.ts` (10 joined + 12 suggested)
- [ ] `src/data/mock/groupPostsMock.ts` (6 bài viết đa dạng)
- [ ] `src/plugins/routers/index.tsx`:
  - Thêm 5 `PATH_CONSTRAINT.GROUPS_*`
  - Thêm 6 lazy imports (`GroupsLayout` từ `@/views/layouts/`, còn lại từ `@/views/groups/`)
  - Tạo `groupsRoutes` array và spread vào `children` của `MainLayout`

### Phase 2 – Shared Components (25 phút)

- [ ] `src/components/groups/GroupCard.tsx`
  - Props: `group`, `onDismiss?`, `onJoin?`, `className?`
  - Cover `aspect-[16/9]` + nút ✕ `absolute` (ẩn nếu không có `onDismiss`)
  - Member count + mutual friends avatar stack
  - "Tham gia nhóm" button
- [ ] `src/components/groups/GroupPostCard.tsx`
  - Header: Avatar nhóm + tên nhóm bold + author role + timestamp + `<DropdownMenu>` `...`
  - Content: text, optional image grid, optional link preview
  - Reaction count + `<Separator>` + 3 action buttons
  - Top 2 comments + "Xem tất cả phản hồi"
  - Comment input cuối

### Phase 3 – Layout & Sidebar (20 phút)

- [ ] `src/views/layouts/GroupsLayout.tsx`
  - `flex h-[calc(100vh-var(--header-height))]`
  - `<GroupsSidebar />` + `<main className="flex-1 overflow-y-auto"><Outlet /></main>`
- [ ] `src/components/groups/GroupsSidebar.tsx`
  - Header + search + 3 nav items (active từ `useLocation()`)
  - "Tạo nhóm mới" button → `/groups/create`
  - `<Separator>` + list `joinedGroups.slice(0, 8)`

### Phase 4 – GroupsFeed (20 phút)

- [ ] `src/views/groups/GroupsFeed.tsx`
  - Centered `max-w-2xl`
  - "Hoạt động mới đây"
  - Map `groupPosts` → `<GroupPostCard>`
  - `<Skeleton>` cuối

### Phase 5 – GroupsDiscover (25 phút)

- [ ] `src/components/groups/GroupDiscoverSection.tsx`
  - Horizontal scroll `suggestedGroups.slice(0, 6)` → `<GroupCard className="w-[220px] shrink-0">`
- [ ] `src/components/groups/GroupDiscoverGrid.tsx`
  - Local state `dismissed: string[]`
  - 4-col grid → `<GroupCard onDismiss={...}>`
- [ ] `src/views/groups/GroupsDiscover.tsx`
  - Compose 2 components trên

### Phase 6 – GroupsMine (20 phút)

- [ ] `src/components/groups/GroupMineGrid.tsx`
  - Header count + sort button
  - 3-col grid: card ngang (ảnh vuông + info + "Xem nhóm" + `<DropdownMenu>`)
- [ ] `src/views/groups/GroupsMine.tsx`
  - `<GroupMineGrid groups={joinedGroups}>`

### Phase 7 – GroupCreate (30 phút)

- [ ] `src/components/groups/GroupCreateForm.tsx`
  - Props: `groupName`, `privacy`, `onGroupNameChange`, `onPrivacyChange`
  - Form fields + Tạo button
- [ ] `src/components/groups/GroupCreatePreview.tsx`
  - Props: `groupName`, `privacy`, `previewMode`, `onPreviewModeChange`
  - Reactive preview
- [ ] `src/views/groups/GroupCreate.tsx`
  - State + layout split + compose 2 components

### Phase 8 – GroupDetail (25 phút)

- [ ] `src/components/groups/GroupDetailHeader.tsx`
  - Cover + info bar + action buttons + sticky tabs
- [ ] `src/views/groups/GroupDetail.tsx`
  - `useParams()` → lookup mock data
  - `<GroupDetailHeader>` + 2-col layout

### Phase 9 – Polish (15 phút)

- [ ] Sidebar `hidden md:flex` cho mobile
- [ ] `<Skeleton>` cho `GroupCard`, `GroupPostCard`
- [ ] Empty state: feed trống, không có nhóm
- [ ] `GroupDetail` not-found state

---

## 🧩 shadcn Components cần kiểm tra / thêm

```bash
npx shadcn@latest add card tabs separator avatar dropdown-menu button input select badge breadcrumb skeleton
```

---

## ✅ Checklist hoàn thành

- [ ] `GroupsLayout.tsx` nằm tại `src/views/layouts/` — cùng cấp `MainLayout.tsx`
- [ ] Không có `views/groups/partials/` — tất cả UI section ở `src/components/groups/`
- [ ] `groupsRoutes` được spread vào `children` của `MainLayout` trong router
- [ ] `GroupCreate` nằm **trực tiếp** trong `groupsRoutes`, không qua `GroupsLayout`
- [ ] Lazy import `GroupsLayout` dùng path `@/views/layouts/GroupsLayout`
- [ ] Lazy import 5 route components dùng path `@/views/groups/...`
- [ ] Header từ `MainLayout` không tạo lại
- [ ] 5 routes hoạt động đúng
- [ ] Sidebar active state từ `useLocation()`
- [ ] `GroupCard` tái sử dụng ở Discover (horizontal + grid) và Mine
- [ ] `GroupPostCard` có đủ: group header, content, reaction, comments, input
- [ ] Horizontal scroll "Gợi ý cho bạn" hoạt động
- [ ] Dismiss hoạt động (local state `GroupDiscoverGrid`)
- [ ] GroupCreate preview reactive realtime
- [ ] Lazy loading + `<Suspense fallback={<OverlaySpinner>}>` đúng pattern
- [ ] Tất cả `export default function` + PascalCase + `.tsx`
- [ ] Tất cả import dùng `@/` — không có relative `../../`
- [ ] Mobile responsive: sidebar ẩn `< md`
- [ ] Màu mặc định shadcn — **không có CSS variable override nào**
