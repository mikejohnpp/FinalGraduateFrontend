# Plan: Chức năng Quản lý Nhóm (Group Management)

> Dựa theo AGENTS.md, shadcn/ui mặc định, Tailwind v4, React Router v7, Redux Toolkit.

---

## 1. Cấu trúc thư mục mới

```
src/
├── views/
│   ├── layouts/
│   │   └── GroupAdminLayout.tsx              ← Layout wrapper cho admin (có sidebar)
│   └── groups/partials/
│       ├── GroupCommunityHome.tsx            ← Trang chủ của cộng đồng
│       ├── GroupOverview.tsx                 ← Tổng quan
│       ├── GroupMemberRequests.tsx           ← Yêu cầu làm thành viên
│       └── GroupPendingPosts.tsx             ← Bài viết đang chờ
├── components/groups/
│   ├── GroupAdminSidebar.tsx                 ← Sidebar dùng chung cho admin pages
│   └── GroupAdminHeader.tsx                  ← Header nhóm (avatar, tên, privacy)
├── hooks/
│   └── useGroupAdmin.tsx                     ← Các group admin hooks (dùng mock data)
├── data/mock/
│   ├── groupAdminMock.ts                     ← Mock: IGroupAdmin, IGroupStats
│   ├── groupMembersMock.ts                   ← Mock: IGroupAdminMember[]
│   └── groupPendingPostsMock.ts              ← Mock: IGroupAdminPost[] (status PENDING)
└── types/
    └── interfaces/
        └── group/
            ├── IGroupAdmin.ts
            ├── IGroupAdminMember.ts
            ├── IGroupStats.ts
            └── IGroupAdminPost.ts
```

---

## 2. Types

### `src/types/interfaces/group/IGroupAdmin.ts`
```ts
export interface IGroupAdmin {
  id: number;
  name: string;
  avatarUrl?: string;
  coverUrl?: string;
  privacy: 'PUBLIC' | 'PRIVATE';
  memberCount: number;
  description?: string;
  createdAt: string;
  role: 'ADMIN' | 'MEMBER';
}
```

### `src/types/interfaces/group/IGroupAdminMember.ts`
```ts
export interface IGroupAdminMember {
  id: number;
  userId: number;
  username: string;
  avatarUrl?: string;
  requestedAt: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  joinedPlatformAt?: string;
}
```

### `src/types/interfaces/group/IGroupStats.ts`
```ts
export interface IGroupStats {
  pendingReviews: number;
  reportedContent: number;
  pendingPosts: number;
  memberRequests: number;
  groupStatusViolations: number;
  moderationNotifications: number;
  weeklyPosts: number;
  weeklyPostsChange: number;     // phần trăm thay đổi, e.g. 12.5
  weeklyComments: number;
  weeklyCommentsChange: number;
  weeklyReactions: number;
  weeklyReactionsChange: number;
  activeMembers: number;
  activeMembersChange: number;
  weeklyActivity: { label: string; value: number }[]; // 7 điểm dữ liệu
}
```

### `src/types/interfaces/group/IGroupAdminPost.ts`
```ts
export interface IGroupAdminPost {
  id: number;
  authorId: number;
  authorName: string;
  authorAvatarUrl?: string;
  content: string;
  imageUrls?: string[];
  createdAt: string;             // ISO string
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}
```

---

## 3. Mock Data

### `src/data/mock/groupAdminMock.ts`
```ts
import type { IGroupAdmin } from '@/types/interfaces/group/IGroupAdmin';
import type { IGroupStats } from '@/types/interfaces/group/IGroupStats';

export const mockGroup: IGroupAdmin = {
  id: 1,
  name: 'Nhóm test',
  avatarUrl: 'https://i.pravatar.cc/150?img=10',
  coverUrl: 'https://picsum.photos/seed/group1/1200/400',
  privacy: 'PRIVATE',
  memberCount: 1,
  description: 'Đây là nhóm thử nghiệm tính năng quản lý nhóm.',
  createdAt: '2024-01-15T08:00:00.000Z',
  role: 'ADMIN',
};

export const mockGroupStats: IGroupStats = {
  pendingReviews: 0,
  reportedContent: 0,
  pendingPosts: 3,
  memberRequests: 2,
  groupStatusViolations: 0,
  moderationNotifications: 0,
  weeklyPosts: 8,
  weeklyPostsChange: 12.5,
  weeklyComments: 24,
  weeklyCommentsChange: -5.3,
  weeklyReactions: 47,
  weeklyReactionsChange: 0,
  activeMembers: 1,
  activeMembersChange: 0,
  weeklyActivity: [
    { label: 'Th 8/5', value: 0 },
    { label: 'Th 9/5', value: 1 },
    { label: 'Th 10/5', value: 0 },
    { label: 'Th 11/5', value: 2 },
    { label: 'Th 12/5', value: 1 },
    { label: 'Th 13/5', value: 0 },
    { label: 'Th 14/6', value: 1 },
  ],
};
```

### `src/data/mock/groupMembersMock.ts`
```ts
import type { IGroupAdminMember } from '@/types/interfaces/group/IGroupAdminMember';

export const mockMemberRequests: IGroupAdminMember[] = [
  {
    id: 1,
    userId: 101,
    username: 'Nguyễn Văn An',
    avatarUrl: 'https://i.pravatar.cc/150?img=11',
    requestedAt: '2025-06-13T10:30:00.000Z',
    gender: 'MALE',
    joinedPlatformAt: '2019-03-22T00:00:00.000Z',
  },
  {
    id: 2,
    userId: 102,
    username: 'Trần Thị Bích',
    avatarUrl: 'https://i.pravatar.cc/150?img=47',
    requestedAt: '2025-06-14T08:15:00.000Z',
    gender: 'FEMALE',
    joinedPlatformAt: '2021-07-10T00:00:00.000Z',
  },
  {
    id: 3,
    userId: 103,
    username: 'Lê Hoàng Dũng',
    avatarUrl: undefined,        // fallback to initials avatar
    requestedAt: '2025-06-14T14:00:00.000Z',
    gender: 'MALE',
    joinedPlatformAt: '2017-11-05T00:00:00.000Z',
  },
  {
    id: 4,
    userId: 104,
    username: 'Phạm Minh Châu',
    avatarUrl: 'https://i.pravatar.cc/150?img=23',
    requestedAt: '2025-06-15T07:45:00.000Z',
    gender: 'FEMALE',
    joinedPlatformAt: '2022-01-18T00:00:00.000Z',
  },
];
```

### `src/data/mock/groupPendingPostsMock.ts`
```ts
import type { IGroupAdminPost } from '@/types/interfaces/group/IGroupAdminPost';

export const mockPendingPosts: IGroupAdminPost[] = [
  {
    id: 201,
    authorId: 101,
    authorName: 'Nguyễn Văn An',
    authorAvatarUrl: 'https://i.pravatar.cc/150?img=11',
    content:
      'Chào cả nhóm! Mình vừa tìm được một bài viết rất hay về game localization, chia sẻ để mọi người cùng đọc nhé. Theo mình thì đây là vấn đề cực kỳ thú vị đặc biệt với các tựa game RPG có cốt truyện sâu.',
    imageUrls: ['https://picsum.photos/seed/post201/800/450'],
    createdAt: '2025-06-15T06:20:00.000Z',
    status: 'PENDING',
  },
  {
    id: 202,
    authorId: 102,
    authorName: 'Trần Thị Bích',
    authorAvatarUrl: 'https://i.pravatar.cc/150?img=47',
    content:
      'Hỏi mọi người một chút: có ai biết tool nào để quản lý bản dịch game hiệu quả không? Mình đang tìm cái gì đó có thể handle được context và glossary cùng lúc.',
    imageUrls: [],
    createdAt: '2025-06-15T09:05:00.000Z',
    status: 'PENDING',
  },
  {
    id: 203,
    authorId: 104,
    authorName: 'Phạm Minh Châu',
    authorAvatarUrl: 'https://i.pravatar.cc/150?img=23',
    content: 'Chia sẻ vài tấm ảnh từ sự kiện game jam cuối tuần vừa rồi!',
    imageUrls: [
      'https://picsum.photos/seed/post203a/600/400',
      'https://picsum.photos/seed/post203b/600/400',
      'https://picsum.photos/seed/post203c/600/400',
    ],
    createdAt: '2025-06-15T11:30:00.000Z',
    status: 'PENDING',
  },
];
```

---

## 4. Hooks

### `src/hooks/useGroupAdmin.tsx`

Tất cả hooks đều dùng mock data chờ API backend. Mô phỏng async bằng `setTimeout` (300ms delay) để loading state hoạt động đúng.

```ts
// ─── useGroupInfo(groupId) ────────────────────────────────────────────────────
// Import mockGroup từ groupAdminMock.ts
// State: { group: IGroupAdmin | null, loading: boolean }
// Trả về: { group, loading }
// Khi mount: setTimeout 300ms → setGroup(mockGroup)

// ─── useGroupStats(groupId) ──────────────────────────────────────────────────
// Import mockGroupStats từ groupAdminMock.ts
// State: { stats: IGroupStats | null, loading: boolean }
// Trả về: { stats, loading }
// Khi mount: setTimeout 300ms → setStats(mockGroupStats)

// ─── useGroupMemberRequests(groupId) ─────────────────────────────────────────
// Import mockMemberRequests từ groupMembersMock.ts
// State local: members: IGroupAdminMember[] (bản sao của mock để có thể mutate)
// State: { members, loading, searchQuery, setSearchQuery, sortOrder, setSortOrder, genderFilter, setGenderFilter }
// Actions:
//   approve(memberId): xóa member khỏi list ngay (optimistic), toast.success('Đã phê duyệt thành viên')
//   reject(memberId): xóa member khỏi list ngay (optimistic), toast.success('Đã từ chối yêu cầu')
// Computed:
//   filteredMembers: lọc members theo searchQuery (username, case-insensitive) và genderFilter
//   sortedMembers: sắp xếp filteredMembers theo sortOrder ('newest' | 'oldest')
// Trả về: { members: sortedMembers, loading, approve, reject, searchQuery, setSearchQuery, sortOrder, setSortOrder, genderFilter, setGenderFilter }

// ─── useGroupPendingPosts(groupId) ────────────────────────────────────────────
// Import mockPendingPosts từ groupPendingPostsMock.ts
// State local: posts: IGroupAdminPost[] (bản sao)
// Actions:
//   approvePost(postId): xóa post khỏi list ngay (optimistic), toast.success('Đã phê duyệt bài viết')
//   rejectPost(postId): xóa post khỏi list ngay (optimistic), toast.success('Đã từ chối bài viết')
// Trả về: { posts, loading, approvePost, rejectPost }
```

---

## 5. Router

Thêm vào `src/plugins/routers/groupRoutes.tsx`:

```ts
// Thêm vào GROUP_PATH_CONSTRAINT
GROUP_ADMIN: '/groups/:groupId/admin',
GROUP_COMMUNITY_HOME: '/groups/:groupId/admin/community',
GROUP_OVERVIEW: '/groups/:groupId/admin/overview',
GROUP_MEMBER_REQUESTS: '/groups/:groupId/admin/member-requests',
GROUP_PENDING_POSTS: '/groups/:groupId/admin/pending-posts',
```

Cấu trúc route (lồng dưới `GroupAdminLayout` thay vì thêm vào index):
```ts
// Thêm route riêng (không nằm trong layout chính)
{
  element: <GroupAdminLayout />,
  children: [
    { path: GROUP_PATH_CONSTRAINT.GROUP_COMMUNITY_HOME, element: <GroupCommunityHome /> },
    { path: GROUP_PATH_CONSTRAINT.GROUP_OVERVIEW, element: <GroupOverview /> },
    { path: GROUP_PATH_CONSTRAINT.GROUP_MEMBER_REQUESTS, element: <GroupMemberRequests /> },
    { path: GROUP_PATH_CONSTRAINT.GROUP_PENDING_POSTS, element: <GroupPendingPosts /> },
  ],
}
```

---

## 6. Layout: `GroupAdminLayout.tsx`

**File:** `src/views/layouts/GroupAdminLayout.tsx`

Layout 2 cột:
- Cột trái (fixed, w-72): `<GroupAdminSidebar />`
- Cột phải (flex-1, overflow-y-auto): `<Outlet />`

```
┌──────────────────────────────────────────────────────────────┐
│  [GroupAdminSidebar w-72 fixed]  │  <Outlet /> flex-1        │
│                                  │                           │
│  ┌─ Avatar + Tên nhóm ─────────┐ │                           │
│  │  🔒 Nhóm Riêng tư · N thành │ │                           │
│  │  viên                        │ │                           │
│  └──────────────────────────────┘ │                           │
│                                  │                           │
│  Quản lý                         │                           │
│  ─────────────────────────────── │                           │
│  🏠 Trang chủ của cộng đồng      │                           │
│  📊 Tổng quan                    │                           │
│                                  │                           │
│  Công cụ quản trị  [^]           │                           │
│  ─────────────────────────────── │                           │
│  👤 Yêu cầu làm thành viên  2    │                           │
│  📋 Bài viết đang chờ  3         │                           │
└──────────────────────────────────────────────────────────────┘
```

**Component `GroupAdminSidebar`:**
- Dùng `NavLink` từ react-router-dom để highlight active item
- Active item: `bg-accent text-accent-foreground rounded-lg`
- Inactive item: `hover:bg-accent/50 rounded-lg`
- Badge số lượng bên phải dùng shadcn `<Badge variant="secondary">`
- Collapsible section "Công cụ quản trị" dùng shadcn `<Collapsible>`
- Badge count lấy từ `mockGroupStats` (memberRequests, pendingPosts, v.v.)

---

## 7. Screen 1: Trang chủ của cộng đồng

**File:** `src/views/groups/partials/GroupCommunityHome.tsx`

**Hook dùng:** `useGroupInfo(groupId)` + dùng trực tiếp `mockGroup` cho right sidebar

**Layout tổng thể (2 cột):**
```
┌──────────────────────────────────────────────────────────────────────┐
│  MAIN CONTENT (flex-1)                  │  RIGHT SIDEBAR (w-80)      │
├─────────────────────────────────────────┼────────────────────────────┤
│                                         │  ┌─ Giới thiệu ──────────┐ │
│  ┌─ Post Composer Card ───────────────┐ │  │  🔒 Riêng tư           │ │
│  │  [Avatar]  Bạn viết gì đi...       │ │  │  Chỉ thành viên mới   │ │
│  │  ─────────────────────────────── │ │  │  nhìn thấy mọi người   │ │
│  │  📌 Bài viết ẩn danh              │ │  │  và những gì họ đăng   │ │
│  │  😊 Cảm xúc/hoạt động            │ │  │                         │ │
│  │  📊 Thăm dò ý kiến               │ │  │  👁  Ẩn                │ │
│  └───────────────────────────────────┘ │  │  Chỉ thành viên mới   │ │
│                                         │  │  tìm thấy nhóm này.    │ │
│  ┌─ Đáng chú ý ──────────────────────┐ │  │                         │ │
│  │  1 mục mới  ⓘ              [Thêm] │ │  │  [Tìm hiểu thêm về    │ │
│  │                                   │ │  │   nhóm này]            │ │
│  │  [Card: Nêu bật những điều đáng ] │ │  └─────────────────────── ┘ │
│  │  [chú ý nhất trong nhóm...      ] │ │                            │
│  │  [Card: Sự kiện - Tạo sự kiện   ] │ │                            │
│  └───────────────────────────────────┘ │                            │
│                                         │                            │
│  ┌─ Post Feed (từ groupPostsMock) ───┐ │                            │
│  │  [Post Card 1]                    │ │                            │
│  │  [Post Card 2]                    │ │                            │
│  └───────────────────────────────────┘ │                            │
└──────────────────────────────────────────────────────────────────────┘
```

**Chi tiết Post Composer Card:**
- `Card` với `CardContent`
- Row 1: Avatar (32px, dùng mockGroup.avatarUrl) + `Input` placeholder "Bạn viết gì đi..."
- `Separator`
- Row 2: 3 nút ngang: `📌 Bài viết ẩn danh`, `😊 Cảm xúc/hoạt động`, `📊 Thăm dò ý kiến`
- Click input → chưa cần xử lý (để trống hoặc toast "Tính năng đang phát triển")

**Chi tiết "Đáng chú ý" Section:**
- Header: "Đáng chú ý" + `Badge` "1 mục mới" + `Tooltip` icon ⓘ + `Button` ghost "Thêm"
- Horizontal scroll (`ScrollArea` horizontal) với 2 card mẫu cứng:
  - Card 1: ảnh gradient + "Nêu bật những điều đáng chú ý nhất trong nhóm" + link "Tìm hiểu thêm"
  - Card 2: ảnh minh họa sự kiện + "Sự kiện" + `Button` "Tạo sự kiện"

**Chi tiết Right Sidebar "Giới thiệu":**
- `Card` tiêu đề "Giới thiệu"
- Item 1: icon 🔒 + "Riêng tư" bold + text mô tả
- Item 2: icon 👁 + "Ẩn" bold + text mô tả
- `Button` full-width variant outline: "Tìm hiểu thêm về nhóm này"

**Post Feed:**
- Dùng mock data từ `src/data/mock/groupPostsMock.ts` (đã có) hoặc tạo mới 2-3 post mẫu
- Mỗi post dùng component `GroupPostCard` (tạo mới trong `src/components/groups/`)
- `GroupPostCard` props: `{ post: IGroupPost }`
  - Header: Avatar + tên + thời gian + DropdownMenu (...)
  - Body: content text
  - Media: ảnh nếu có (full-width hoặc grid 2 cột)
  - Footer: `👍 Thích | 💬 Bình luận | ➡️ Gửi` (buttons, chưa cần handler)

---

## 8. Screen 2: Tổng quan (Overview)

**File:** `src/views/groups/partials/GroupOverview.tsx`

**Hook dùng:** `useGroupStats(groupId)`

**Layout tổng thể (1 cột full):**
```
┌───────────────────────────────────────────────────────────────┐
│                                                               │
│  ┌─ Cần xem xét ──────────────────────────────────────────┐  │
│  │  "0 thông tin mới cần xem xét"                          │  │
│  │                                                         │  │
│  │  Grid 2 cột:                                            │  │
│  │  ┌──────────────────────┐  ┌──────────────────────────┐│  │
│  │  │ 🚫 Nội dung bị báo  │  │ 🔔 Thông báo kiểm duyệt ││  │
│  │  │ cáo          0  >   │  │               0  >       ││  │
│  │  │ 0 mục mới hôm nay   │  │ 0 mục mới hôm nay        ││  │
│  │  └──────────────────────┘  └──────────────────────────┘│  │
│  │  ┌──────────────────────┐  ┌──────────────────────────┐│  │
│  │  │ 📋 Bài viết đang chờ│  │ 👤 Yêu cầu làm thành    ││  │
│  │  │               3  >  │  │ viên         2  >        ││  │
│  │  │ 0 mục mới hôm nay   │  │ 0 mục mới hôm nay        ││  │
│  │  └──────────────────────┘  └──────────────────────────┘│  │
│  │  ┌──────────────────────┐                               │  │
│  │  │ 🔵 Trạng thái nhóm  │                               │  │
│  │  │               0  >  │                               │  │
│  │  │ 0 trường hợp vi phạm│                               │  │
│  │  └──────────────────────┘                               │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                               │
│  flex gap-4:                                                  │
│  ┌─ Tóm tắt (flex-1) ──────┐  ┌─ Thành viên HĐ (flex-1) ─┐ │
│  │  "Trong 7 ngày qua"      │  │  "0 trong 7 ngày qua"     │ │
│  │                          │  │   ↗ 0%                    │ │
│  │  📰 Bài viết    8 ↗12.5%│  │                           │ │
│  │  ─────────────────────── │  │  [BarChart recharts]      │ │
│  │  💬 Bình luận  24 ↘5.3% │  │   7 bars, màu primary     │ │
│  │  ─────────────────────── │  │   height 200px            │ │
│  │  👍 Cảm xúc    47 → 0%  │  │                           │ │
│  │  ─────────────────────── │  │                           │ │
│  │  [Xem thông tin chi tiết]│  │  [Xem thông tin chi tiết]│ │
│  └──────────────────────────┘  └───────────────────────────┘ │
└───────────────────────────────────────────────────────────────┘
```

**Chi tiết "Cần xem xét" Card:**
- `Card`, header "Cần xem xét" + subtext dynamic: nếu tổng = 0 → "0 thông tin mới cần xem xét"
- `grid grid-cols-2 gap-3` bên trong:
  - Mỗi ô: `Card` nhỏ, cursor-pointer, `onClick` navigate đến route tương ứng
  - Layout ô: `flex items-center justify-between` → [icon + label] | [số + ChevronRight]
  - Subtext: "N mục mới hôm nay" (text-xs text-muted-foreground)
  - Ô "Trạng thái nhóm": thêm dot tròn màu xanh (bg-blue-500 w-2 h-2 rounded-full) bên cạnh số

**Chi tiết "Tóm tắt thông tin chi tiết" Card:**
- `Card` header "Tóm tắt thông tin chi tiết" + subtext "Trong 7 ngày qua"
- 3 stat rows (Bài viết, Bình luận, Cảm xúc), mỗi row dùng `Card` nhỏ:
  - Bên trái: icon + label
  - Bên phải: số đậm + text phần trăm (màu xanh nếu > 0, đỏ nếu < 0, muted nếu = 0)
  - Dấu mũi tên: ↗ tăng, ↘ giảm, → 0
- `Button` full-width variant outline: "Xem thông tin chi tiết về lượt tương tác"

**Chi tiết "Thành viên hoạt động hàng tuần" Card:**
- `Card` header "Thành viên hoạt động hàng tuần" + icon ⓘ Tooltip
- Subtext: `{stats.activeMembers} trong 7 ngày qua ↗ {stats.activeMembersChange}%`
- `BarChart` (recharts):
  ```
  <BarChart data={stats.weeklyActivity} height={200}>
    <XAxis dataKey="label" />
    <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4,4,0,0]} />
    <CartesianGrid vertical={false} strokeDasharray="3 3" />
  </BarChart>
  ```
- `Button` full-width variant outline

---

## 9. Screen 3: Yêu cầu làm thành viên

**File:** `src/views/groups/partials/GroupMemberRequests.tsx`

**Hook dùng:** `useGroupMemberRequests(groupId)`

**Layout tổng thể:**
```
┌──────────────────────────────────────────────────────────────────────┐
│  h1 "Yêu cầu làm thành viên"                   [≡ Sort icon button] │
│                                                                       │
│  ┌─ Search Input ─────────────────────────────────────────────────┐  │
│  │  🔍 Tìm kiếm theo tên...                                        │  │
│  └─────────────────────────────────────────────────────────────────┘ │
│                                                                       │
│  flex gap-2 flex-wrap:                                                │
│  [Xóa bộ lọc*]  [Thời gian yêu cầu ▾]  [Ngày tham gia ▾]           │
│                  [Giới tính ▾]           [Bộ lọc khác ▾]            │
│  (* chỉ hiện khi có filter active)                                    │
│                                                                       │
│  ── Nếu loading ───────────────────────────────────────────────────  │
│  [Skeleton card × 3]                                                  │
│                                                                       │
│  ── Nếu có kết quả ────────────────────────────────────────────────  │
│  ┌─ Member Card ─────────────────────────────────────────────────┐   │
│  │  flex items-center gap-3:                                      │   │
│  │  [Avatar 48px]  [Tên\nNgày tham gia...]    [Phê duyệt][Từ chối]│  │
│  └───────────────────────────────────────────────────────────────┘   │
│  (lặp lại cho từng member)                                            │
│                                                                       │
│  ── Nếu rỗng ──────────────────────────────────────────────────────  │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │              [SVG 2 người dùng, màu muted]                      │ │
│  │          "Không có thành viên đang chờ nào"                     │ │
│  └─────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────┘
```

**Chi tiết Filter Bar:**
- `Input` với `SearchIcon` absolute bên trái (pl-10), `value={searchQuery}`, `onChange={e => setSearchQuery(e.target.value)}`
- Filter buttons dùng `DropdownMenu`:
  - **"Thời gian yêu cầu"** → items: "Mới nhất trước" (default), "Cũ nhất trước"
  - **"Ngày tham gia"** → items: "Bất kỳ", "Dưới 1 năm", "1-3 năm", "Trên 3 năm"
  - **"Giới tính"** → items: "Tất cả", "Nam", "Nữ"
  - **"Bộ lọc khác"** → placeholder items (chưa cần xử lý)
- "Xóa bộ lọc" Button ghost: chỉ hiện khi `searchQuery !== '' || genderFilter !== 'ALL' || sortOrder !== 'newest'`

**Chi tiết Member Card:**
- `Card` với padding px-4 py-3
- Layout: `flex items-center gap-3`
  - `Avatar` size 48px: `AvatarImage src={member.avatarUrl}` + `AvatarFallback` (2 chữ cái đầu username)
  - Column flex-1:
    - `p` font-semibold: `{member.username}`
    - `p` text-sm text-muted-foreground: `Đã tham gia từ {formatYear(member.joinedPlatformAt)}`
  - `Button` size sm "Phê duyệt" onClick={() => approve(member.id)}
  - `Button` size sm variant outline "Từ chối" onClick={() => reject(member.id)}

**Skeleton loading (3 items):**
```tsx
Array.from({length: 3}).map((_, i) => (
  <Card key={i} className="px-4 py-3">
    <div className="flex items-center gap-3">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-48" />
      </div>
      <Skeleton className="h-8 w-20" />
      <Skeleton className="h-8 w-16" />
    </div>
  </Card>
))
```

**State rỗng:**
- SVG inline (2 silhouette người, màu `text-muted-foreground`, h-24 w-24)
- `p` text-center font-medium: "Không có thành viên đang chờ nào"
- Wrap trong div `flex flex-col items-center justify-center py-20 gap-4`

---

## 10. Screen 4: Bài viết đang chờ

**File:** `src/views/groups/partials/GroupPendingPosts.tsx`

**Hook dùng:** `useGroupPendingPosts(groupId)`

**Layout tổng thể:**
```
┌──────────────────────────────────────────────────────────────────────┐
│                                                                       │
│  ── Nếu loading ───────────────────────────────────────────────────  │
│  [Skeleton card × 2]                                                  │
│                                                                       │
│  ── Nếu có bài viết đang chờ ──────────────────────────────────────  │
│                                                                       │
│  ┌─ Pending Post Card ───────────────────────────────────────────┐   │
│  │  HEADER: flex items-center                                      │   │
│  │  [Avatar 40px] [Tên tác giả / "Đang chờ duyệt · 2 giờ trước"] │   │
│  │                                          [...] DropdownMenu    │   │
│  │                                                                │   │
│  │  BODY:                                                          │   │
│  │  content text (line-clamp-3 nếu dài, nút "Xem thêm")           │   │
│  │                                                                │   │
│  │  MEDIA (nếu có imageUrls):                                      │   │
│  │  - 1 ảnh → img full-width rounded-lg max-h-96 object-cover     │   │
│  │  - 2 ảnh → grid-cols-2 gap-1                                    │   │
│  │  - 3+ ảnh → grid-cols-2: ảnh đầu chiếm col-span-2, 2 ảnh tiếp │   │
│  │             góc phải ảnh cuối: overlay "+N" nếu còn thêm        │   │
│  │                                                                │   │
│  │  SEPARATOR                                                      │   │
│  │                                                                │   │
│  │  FOOTER: flex gap-2                                             │   │
│  │  [✓ Phê duyệt bài viết  flex-1]  [✗ Từ chối bài viết  flex-1] │   │
│  └───────────────────────────────────────────────────────────────┘   │
│  (lặp lại)                                                            │
│                                                                       │
│  ── Nếu rỗng ──────────────────────────────────────────────────────  │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │              [SVG document icon, màu muted, h-20 w-20]          │ │
│  │          "Chưa có bài viết nào để xem xét"   font-medium        │ │
│  │  "Bài viết không cần được quản trị viên phê duyệt trước khi    │ │
│  │   đăng. Bạn có thể thay đổi lựa chọn này trong cài đặt nhóm." │ │
│  │                  [Đi đến phần cài đặt]  Button                  │ │
│  └─────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────┘
```

**Chi tiết Pending Post Card:**
- `Card` với `CardContent` className="p-4 space-y-3"
- **Header:**
  ```
  flex items-start justify-between
  ├── flex items-center gap-2
  │   ├── Avatar 40px
  │   └── div
  │       ├── p font-semibold: authorName
  │       └── p text-xs text-muted-foreground: "Đang chờ duyệt · {timeAgo(post.createdAt)}"
  └── DropdownMenu trigger=Button variant ghost size icon "..."
      └── items: ["Bỏ qua bài viết này"]
  ```
- **Body text:**
  - State `expanded` (useState false)
  - Nếu content.length > 200 và !expanded: hiện 200 ký tự + "... " + Button ghost inline "Xem thêm"
  - Nếu expanded: full text + Button ghost inline "Thu gọn"

- **Media grid logic:**
  ```
  imageUrls.length === 0 → không render
  imageUrls.length === 1 → <img className="w-full rounded-lg max-h-96 object-cover" />
  imageUrls.length === 2 → <div className="grid grid-cols-2 gap-1">2 img</div>
  imageUrls.length >= 3  → <div className="grid grid-cols-2 gap-1">
                              <img className="col-span-2 ..." /> (ảnh 0)
                              <img ... /> (ảnh 1)
                              <div className="relative"> (ảnh 2)
                                <img ... />
                                {length > 3 && <overlay>+{length-3}</overlay>}
                              </div>
                           </div>
  ```

- **Footer:**
  - `Separator` trước footer
  - `div className="flex gap-2 pt-2"`
  - `Button` flex-1 onClick={() => approvePost(post.id)} → toast.success trực tiếp
  - `Button` flex-1 variant outline onClick={() => setConfirmRejectId(post.id)}
  - `AlertDialog` controlled bởi `confirmRejectId` state:
    - Title: "Từ chối bài viết?"
    - Description: "Bài viết này sẽ không được đăng lên nhóm."
    - Actions: "Huỷ" (cancel) + "Từ chối" (destructive → rejectPost(confirmRejectId))

**Skeleton loading:**
```tsx
// 2 skeleton cards
<Card>
  <CardContent className="p-4 space-y-3">
    <div className="flex gap-2">
      <Skeleton className="h-10 w-10 rounded-full" />
      <div className="space-y-1">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-3 w-40" />
      </div>
    </div>
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-3/4" />
    <Skeleton className="h-40 w-full rounded-lg" />
    <div className="flex gap-2">
      <Skeleton className="h-9 flex-1" />
      <Skeleton className="h-9 flex-1" />
    </div>
  </CardContent>
</Card>
```

**State rỗng:**
- SVG document icon (màu muted)
- Text tiêu đề + mô tả + Button "Đi đến phần cài đặt" (navigate đến `/groups/:groupId/settings`)

---

## 11. Shared Components

### `GroupAdminSidebar.tsx`
**Props:** `groupId: number | string`
**Dùng:** `mockGroup` và `mockGroupStats` import trực tiếp (không cần hook)

**Sections:**
1. **Group Header** (padding-x-3 padding-y-4):
   - `Avatar` nhóm 48px
   - `p` font-semibold: mockGroup.name
   - `p` text-sm text-muted-foreground: "🔒 Nhóm Riêng tư · {mockGroup.memberCount} thành viên"

2. **Nav section "Quản lý"** (text-xs font-semibold text-muted-foreground uppercase tracking-wide):
   ```
   NavLink "/community"  → "🏠 Trang chủ của cộng đồng"
   NavLink "/overview"   → "📊 Tổng quan"
   ```

3. **Collapsible "Công cụ quản trị"** (mặc định open):
   ```
   CollapsibleTrigger: flex justify-between items-center
   ├── text "Công cụ quản trị" text-xs font-semibold uppercase
   └── ChevronUp/Down icon
   CollapsibleContent:
   ├── NavLink "/support"          → "Hỗ trợ quản trị"  Badge "1 hđ, 1 tc"
   ├── NavLink "/member-requests"  → "Yêu cầu làm thành viên"  Badge={mockGroupStats.memberRequests}
   ├── NavLink "/badges"           → "Yêu cầu huy hiệu"  Badge={0}
   ├── NavLink "/questions"        → "Câu hỏi chọn thành viên"
   ├── NavLink "/pending-posts"    → "Bài viết đang chờ"  Badge={mockGroupStats.pendingPosts}
   ├── NavLink "/spam"             → "Có thể là spam"  Badge={0}
   ├── NavLink "/scheduled"        → "Bài viết đã lên lịch"
   ├── NavLink "/activity-log"     → "Nhật ký hoạt động"
   ├── NavLink "/rules"            → "Quy tắc nhóm"
   ├── NavLink "/reported"         → "Nội dung bị thành viên báo cáo"  Badge={mockGroupStats.reportedContent}
   └── NavLink "/moderation"       → "Thông báo kiểm duyệt"  Badge={mockGroupStats.moderationNotifications}
   ```

**Styling NavLink** (dùng `className` callback):
```tsx
<NavLink
  to={`/groups/${groupId}/admin${path}`}
  className={({ isActive }) =>
    cn(
      'flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors',
      isActive
        ? 'bg-accent text-accent-foreground font-medium'
        : 'text-foreground hover:bg-accent/50'
    )
  }
>
```

---

## 12. Utility helper (thêm vào `src/utils/stringHelper.tsx` nếu chưa có)

```ts
// timeAgo(isoString): "2 giờ trước", "3 ngày trước", v.v.
export function timeAgo(isoString: string): string { ... }

// formatYear(isoString): "Tháng 3, 2019"
export function formatYear(isoString: string): string { ... }
```

---

## 13. Thứ tự thực hiện cho Agent

1. **Tạo Types** → `src/types/interfaces/group/` (`IGroupAdmin.ts`, `IGroupAdminMember.ts`, `IGroupStats.ts`, `IGroupAdminPost.ts`)
2. **Tạo Mock Data** → `src/data/mock/groupAdminMock.ts`, `groupMembersMock.ts`, `groupPendingPostsMock.ts`
3. **Thêm utility helpers** vào `src/utils/stringHelper.tsx`
4. **Tạo `useGroupAdmin.tsx`** với 4 hooks (chỉ dùng mock chờ API BE, có setTimeout 300ms)
5. **Tạo `GroupAdminSidebar.tsx`** (dùng mock data)
6. **Tạo `GroupAdminLayout.tsx`** (layout wrapper ở thư mục `src/views/layouts/`)
7. **Cập nhật router** → thêm routes vào `src/plugins/routers/groupRoutes.tsx`
8. **Tạo 4 partial views** theo thứ tự:
   - `GroupCommunityHome.tsx`
   - `GroupOverview.tsx`
   - `GroupMemberRequests.tsx`
   - `GroupPendingPosts.tsx`

---

## 14. shadcn Components cần dùng

Chạy lệnh install nếu chưa có:
```bash
npx shadcn@latest add card badge avatar separator collapsible dropdown-menu alert-dialog skeleton scroll-area input button tooltip
```

Ngoài ra dùng `recharts` (đã có) cho BarChart ở Tổng quan.

---

## 15. Lưu ý quan trọng cho Agent

- **Tất cả text UI bằng tiếng Việt** (theo quy ước dự án)
- **Không gọi API thật** — toàn bộ dùng mock data + setTimeout 300ms giả lập loading
- **Không dùng `useSelector`/`useDispatch` trực tiếp trong views** — chỉ dùng qua hooks
- **Màu sắc**: dùng CSS variables của shadcn (`text-foreground`, `bg-accent`, `text-muted-foreground`, v.v.)
- **Icons**: ưu tiên `@hugeicons/react`, fallback `lucide-react`
- **Loading state**: dùng shadcn `Skeleton` cho mọi data-fetching state
- **Toast**: dùng `sonner` (`toast.success(...)`, `toast.error(...)`) sau approve/reject
- **Export**: tất cả components dùng `export default function`
- **Optimistic update**: approve/reject đều xóa item khỏi list ngay, không cần chờ confirm từ server
