# 📋 Plan: Trang Cá nhân (Facebook-style Profile)

## 🎯 Tổng quan

Xây dựng trang **Profile** theo layout Facebook:
- Header đã có sẵn trong `MainLayout` → dùng lại qua `<Outlet />`
- Cover photo + Avatar nổi bật phía trên
- Tab điều hướng (Bài viết, Giới thiệu, Bạn bè, Ảnh, ...)
- Layout 2 cột bên dưới tab: Sidebar trái (thông tin) + Feed phải (bài viết)
- Màu mặc định shadcn, không custom CSS variables

---

## 📁 Cấu trúc File (theo AGENTS.md)

```
src/
├── views/
│   └── profile/
│       ├── Profile.tsx                   # Route: /profile/:userId — layout chính
│       └── partials/
│           ├── ProfileCover.tsx          # Cover photo + Avatar + tên + action buttons
│           ├── ProfileTabs.tsx           # Tab bar (Bài viết, Giới thiệu, Bạn bè, Ảnh...)
│           ├── ProfileAbout.tsx          # Sidebar: Thông tin cá nhân
│           ├── ProfileFriends.tsx        # Sidebar: Danh sách bạn bè (grid ảnh)
│           ├── ProfilePhotos.tsx         # Sidebar: Ảnh gần đây (grid)
│           ├── ProfileCreatePost.tsx     # Feed: Ô tạo bài viết
│           └── ProfilePostFeed.tsx       # Feed: Danh sách bài viết
│
├── components/
│   └── profile/
│       ├── PostCard.tsx                  # 1 bài viết (dùng chung cả Home feed)
│       └── FriendMiniCard.tsx            # 1 item bạn bè trong grid
│
├── data/
│   └── mock/
│       ├── profileMock.ts                # Mock thông tin user profile
│       └── postsMock.ts                  # Mock danh sách bài viết
│
├── plugins/
│   └── routers/
│       └── index.tsx                     # Thêm PATH_CONSTRAINT.PROFILE
│
└── types/
    ├── Profile.ts                         # Interface UserProfile
    └── Post.ts                            # Interface Post, Comment
```

> **Quy tắc theo AGENTS.md:**
> - `Profile.tsx` là route-level → `src/views/profile/`
> - Các section bên trong Profile → `src/views/profile/partials/`
> - `PostCard`, `FriendMiniCard` tái sử dụng nhiều nơi → `src/components/profile/`
> - Header dùng lại từ `MainLayout` qua `<Outlet />`, **không tạo lại**
> - Tất cả `export default function`, PascalCase filename

---

## 🗂️ Layout tổng thể

```
┌─────────────────────────────────────────────────────┐
│  Header (từ MainLayout — đã có sẵn)                 │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ██████████████████  Cover Photo  ████████████████  │
│                                                     │
│  [Avatar]  Hoàng Phúc Tạ                            │
│            116 người bạn                            │
│                        [Thêm vào tin] [Chỉnh sửa ▼] │
├─────────────────────────────────────────────────────┤
│  Trang cá nhân | Giới thiệu | Bạn bè | Ảnh | ...   │  ← Tab bar
├───────────────────┬─────────────────────────────────┤
│                   │                                 │
│  Sidebar (trái)   │  Feed (phải)                    │
│  ~40% width       │  ~60% width                     │
│                   │                                 │
│  Thông tin        │  [Bạn đang nghĩ gì?] ← tạo post │
│  cá nhân          │                                 │
│  ─────────        │  PostCard 1                     │
│  Bạn bè           │  PostCard 2                     │
│  (grid 3x2)       │  PostCard 3                     │
│  ─────────        │  ...                            │
│  Ảnh              │                                 │
│  (grid 3x3)       │                                 │
│                   │                                 │
└───────────────────┴─────────────────────────────────┘
```

---

## 🧩 Mapping shadcn Components → UI Elements

### `ProfileCover.tsx` — Cover + Avatar + Actions

| UI Element | shadcn Component | Ghi chú |
|---|---|---|
| Cover photo container | `<div>` với `aspect-[3/1]` | Background image, overflow hidden |
| Avatar | `<Avatar>` size `w-36 h-36` | `ring-4 ring-background` để nổi lên cover |
| Tên người dùng | `<h1 className="text-2xl font-bold">` | |
| Số bạn bè | `<p className="text-muted-foreground">` | |
| Nút "Thêm vào tin" | `<Button>` (default) | Icon `Plus` từ lucide |
| Nút "Chỉnh sửa trang cá nhân" | `<Button variant="secondary">` | |
| Dropdown nút phụ `▼` | `<DropdownMenu>` | Kèm `<DropdownMenuTrigger>` + `<DropdownMenuContent>` |
| Nút "..." (more options) | `<Button variant="ghost" size="icon">` | Icon `Ellipsis` |

### `ProfileTabs.tsx` — Tab điều hướng

| UI Element | shadcn Component | Ghi chú |
|---|---|---|
| Tab container | `<Tabs defaultValue="posts">` | Sticky dưới cover khi scroll |
| Tab items | `<TabsList>` + `<TabsTrigger>` | "Bài viết", "Giới thiệu", "Bạn bè", "Ảnh", "Xem thêm" |
| Nút "Xem thêm ▼" | `<DropdownMenu>` trong TabsTrigger | Các tab ẩn: Video, Check-in, Sports |
| Separator dưới tab | `<Separator>` | Ngăn cách tab với content |

### `ProfileAbout.tsx` — Sidebar: Thông tin cá nhân

| UI Element | shadcn Component | Ghi chú |
|---|---|---|
| Card wrapper | `<Card>` + `<CardHeader>` + `<CardContent>` | |
| Tiêu đề "Thông tin cá nhân" | `<CardTitle>` | |
| Nút edit | `<Button variant="ghost" size="icon">` | Icon `Pencil`, chỉ hiện với owner |
| Từng dòng info (thành phố, học) | `<div className="flex items-center gap-2">` | Icon lucide + text |
| Nút "Thêm nơi ở" | `<Button variant="ghost" className="w-full">` | Chỉ hiện với owner |

### `ProfileFriends.tsx` — Sidebar: Bạn bè

| UI Element | shadcn Component | Ghi chú |
|---|---|---|
| Card wrapper | `<Card>` | |
| Header "Bạn bè · X người" | `<CardHeader>` + `<CardTitle>` | + link "Xem tất cả bạn bè" |
| Grid ảnh bạn bè | `grid grid-cols-3 gap-2` | Dùng `<FriendMiniCard>` |
| Nút "Xem tất cả bạn bè" | `<Button variant="ghost" className="w-full">` | |

### `ProfilePhotos.tsx` — Sidebar: Ảnh

| UI Element | shadcn Component | Ghi chú |
|---|---|---|
| Card wrapper | `<Card>` | |
| Header "Ảnh" | `<CardHeader>` + `<CardTitle>` | + link "Xem tất cả ảnh" |
| Grid ảnh 3x3 | `grid grid-cols-3 gap-1` | `aspect-square`, `object-cover` |

### `ProfileCreatePost.tsx` — Tạo bài viết

| UI Element | shadcn Component | Ghi chú |
|---|---|---|
| Card wrapper | `<Card>` + `<CardContent>` | |
| Avatar + Input | `<Avatar>` + `<Button variant="outline" className="flex-1 rounded-full justify-start">` | Input giả (mở dialog khi click) |
| Separator | `<Separator>` | |
| Row actions bên dưới | `flex justify-around` | |
| Nút "Video trực tiếp" | `<Button variant="ghost">` | Icon `Video` màu đỏ |
| Nút "Ảnh/video" | `<Button variant="ghost">` | Icon `Image` màu xanh lá |
| Nút "Cảm xúc" | `<Button variant="ghost">` | Icon `Smile` màu vàng |

### `PostCard.tsx` — Component bài viết (`src/components/profile/`)

| UI Element | shadcn Component | Ghi chú |
|---|---|---|
| Wrapper | `<Card>` | |
| Header (avatar + tên + thời gian) | `<CardHeader>` + `<Avatar>` | |
| Dropdown options `...` | `<DropdownMenu>` | "Lưu bài viết", "Ẩn bài viết" |
| Nội dung text | `<CardContent>` + `<p>` | Hashtag styled `text-primary` |
| Ảnh đính kèm | `<img>` hoặc grid ảnh | Tuỳ 1 hay nhiều ảnh |
| Thống kê (like, comment) | `<div className="flex justify-between text-muted-foreground text-sm">` | |
| Separator | `<Separator>` | |
| Row actions (Thích, Bình luận, Chia sẻ) | `<Button variant="ghost" className="flex-1">` × 3 | Icon + text |
| Input bình luận | `<Input>` + `<Avatar>` | |

---

## 📝 TypeScript Types

### `src/types/Profile.ts`
```typescript
export interface UserProfile {
  id: string
  name: string
  avatar?: string
  coverPhoto?: string
  friendCount: number
  bio?: string
  location?: string
  education?: string
  workplace?: string
  isOwner: boolean           // true nếu đang xem profile của chính mình
}
```

### `src/types/Post.ts`
```typescript
export interface Post {
  id: string
  authorId: string
  authorName: string
  authorAvatar?: string
  content: string
  images?: string[]
  createdAt: string          // "1 tháng 5 lúc 20:05"
  likeCount: number
  commentCount: number
  shareCount: number
  hashtags?: string[]
}

export interface Comment {
  id: string
  authorId: string
  authorName: string
  authorAvatar?: string
  content: string
  createdAt: string
}
```

---

## 🔌 Router Setup (`src/plugins/routers/index.tsx`)

```typescript
// 1. Thêm vào PATH_CONSTRAINT
export const PATH_CONSTRAINT = {
  // ...existing
  PROFILE: '/profile/:userId',
}

// 2. Lazy import
const Profile = React.lazy(() => import('@/views/profile/Profile'))

// 3. Nested dưới MainLayout (để dùng Header có sẵn)
{
  element: <MainLayout />,          // <-- dùng lại Header từ đây
  children: [
    {
      path: PATH_CONSTRAINT.PROFILE,
      element: (
        <Suspense fallback={<OverlaySpinner show text="Đang tải..." />}>
          <Profile />
        </Suspense>
      )
    },
    // ...other routes dùng MainLayout
  ]
}
```

---

## 🔄 State & Data Flow

```typescript
// Profile.tsx — đọc userId từ params
const { userId } = useParams()

// Local state cho tab active (hoặc URL-based)
const [activeTab, setActiveTab] = useState<'posts' | 'about' | 'friends' | 'photos'>('posts')

// Mock data (chưa có API)
// import { mockProfile } from '@/data/mock/profileMock'
// import { mockPosts } from '@/data/mock/postsMock'

// Sau này: gọi API theo userId
// const profile = await profileService.getProfile(userId)
```

> **Lưu ý:** Chưa có API → dùng `src/data/mock/profileMock.ts` và `postsMock.ts`.
> Redux không cần thiết cho trang này ở giai đoạn mock.

---

## 🧩 shadcn Components cần thêm

```bash
# Kiểm tra, nếu chưa có:
npx shadcn@latest add card tabs separator avatar dropdown-menu button input
```

---

## 🚀 Thứ tự Implementation

### Phase 1 – Types, Mock Data & Router (20 phút)
- [ ] Tạo `src/types/Profile.ts` và `src/types/Post.ts`
- [ ] Tạo `src/data/mock/profileMock.ts` (1 user, đủ fields)
- [ ] Tạo `src/data/mock/postsMock.ts` (3–5 bài, có ảnh + text)
- [ ] Thêm `PATH_CONSTRAINT.PROFILE` + lazy route dưới `MainLayout`

### Phase 2 – Shared Components (25 phút)
- [ ] `src/components/profile/FriendMiniCard.tsx`
  - `<Avatar>` + tên bạn bè, layout grid item
- [ ] `src/components/profile/PostCard.tsx`
  - Full card: header, content, ảnh, stats, action buttons
  - `<DropdownMenu>` cho options `...`

### Phase 3 – ProfileCover (20 phút)
- [ ] `src/views/profile/partials/ProfileCover.tsx`
- [ ] Cover photo `aspect-[3/1]` + Avatar nổi (`-mt-16`)
- [ ] Tên + số bạn bè + action buttons
- [ ] `isOwner` prop → ẩn/hiện nút "Chỉnh sửa"

### Phase 4 – ProfileTabs (15 phút)
- [ ] `src/views/profile/partials/ProfileTabs.tsx`
- [ ] `<Tabs>` với 5 tab: Bài viết, Giới thiệu, Bạn bè, Ảnh, Xem thêm
- [ ] "Xem thêm" mở `<DropdownMenu>`
- [ ] Sticky khi scroll (`sticky top-[60px] z-10`)

### Phase 5 – Sidebar Partials (25 phút)
- [ ] `ProfileAbout.tsx` — thông tin + icon lucide
- [ ] `ProfileFriends.tsx` — `<Card>` + grid `<FriendMiniCard>`
- [ ] `ProfilePhotos.tsx` — `<Card>` + grid ảnh 3x3

### Phase 6 – Feed Partials (25 phút)
- [ ] `ProfileCreatePost.tsx` — ô tạo bài với avatar + input giả + action row
- [ ] `ProfilePostFeed.tsx` — map qua `mockPosts`, render `<PostCard>`

### Phase 7 – Profile.tsx (Lắp ráp) (20 phút)
- [ ] Import và lắp tất cả partials
- [ ] Layout 2 cột: `grid grid-cols-[2fr_3fr] gap-4`
- [ ] Truyền `mockProfile` và `mockPosts` xuống đúng partial
- [ ] `<TabsContent>` cho từng tab

### Phase 8 – Polish (15 phút)
- [ ] Responsive: mobile → 1 cột (`md:grid-cols-[2fr_3fr]`)
- [ ] Hover states mặc định shadcn
- [ ] Avatar fallback (initials) khi không có ảnh
- [ ] `<Skeleton>` loading placeholder (optional)

---

---

## ✏️ TASK: Chỉnh sửa Ảnh bìa & Trang cá nhân

> **Dành cho AI Agent:** Đây là task độc lập, implement sau khi Phase 1–8 hoàn thành.
> Toàn bộ logic chỉnh sửa là **local state** (chưa có API), `isOwner = true` thì mới hiện các nút này.

---

### 📸 Feature 1 — Chỉnh sửa Ảnh bìa (`ProfileCover.tsx`)

**Vị trí nút:** góc dưới-phải của cover photo (`absolute bottom-4 right-4`).

**UI:**
```
[📷 Chỉnh sửa ảnh bìa ▼]   ← Button mở DropdownMenu
```

**Dropdown menu gồm 2 item:**
| Item | Hành động |
|---|---|
| 🖼️ Tải ảnh lên từ máy tính | Trigger `<input type="file" accept="image/*" />` ẩn → `FileReader` → cập nhật state `coverPhoto` |
| 📁 Chọn ảnh từ album | Mở `<CoverPhotoAlbumModal>` |

**`CoverPhotoAlbumModal` (`src/views/profile/partials/CoverPhotoAlbumModal.tsx`):**
- Dùng `<Dialog>` shadcn
- Hiển thị grid ảnh từ `mockPhotos` (lấy từ `postsMock.ts` hoặc tạo `photosMock.ts` riêng)
- Layout: `grid grid-cols-3 gap-2`, mỗi ảnh `aspect-square object-cover rounded cursor-pointer`
- Ảnh đang chọn: `ring-2 ring-primary`
- Footer dialog: nút `Hủy` (`<DialogClose>`) + nút `Đặt làm ảnh bìa` (disabled khi chưa chọn)
- Khi xác nhận → cập nhật state `coverPhoto` trong `ProfileCover`

**State trong `ProfileCover.tsx`:**
```typescript
const [coverPhoto, setCoverPhoto] = useState(profile.coverPhoto)
const [albumModalOpen, setAlbumModalOpen] = useState(false)
const fileInputRef = useRef<HTMLInputElement>(null)

const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => setCoverPhoto(reader.result as string)
  reader.readAsDataURL(file)
}
```

**File mới cần tạo:**
- `src/views/profile/partials/CoverPhotoAlbumModal.tsx`

---

### 👤 Feature 2 — Chỉnh sửa Trang cá nhân (dropdown card từ nút "Chỉnh sửa trang cá nhân")

**Trigger:** Nút `Chỉnh sửa trang cá nhân` trong `ProfileCover.tsx` → toggle state `editPanelOpen`.

**UI tổng thể:** Card/Popover sổ xuống bên dưới nút, layout 2 cột:

```
┌──────────────────────────────────────────────────────────────┐
│  Chỉnh sửa trang cá nhân                              [✕]   │
├─────────────────────────┬────────────────────────────────────┤
│  Giới thiệu             │  Thông tin cá nhân                 │
│  ─────────────────────  │  ──────────────────────────────    │
│  [🤚] Giới thiệu về bạn │  [📍] Vị trí hiện tại             │
│       ← click → input   │  [🏠] Quê quán                    │
│       [Hủy] [Lưu]       │  [🎂] Sinh nhật                   │
│                         │  [💑] Tình trạng mối quan hệ       │
│                         │  [⚧] Giới tính                     │
│                         │  [🗣] Danh xưng                    │
│                         │  [🌐] Ngôn ngữ                     │
└─────────────────────────┴────────────────────────────────────┘
```

**Quy tắc tương tác:**
- Mỗi dòng thông tin có thể click để mở inline input bên dưới dòng đó
- Chỉ **1 dòng được mở tại một thời điểm** (`activeField: string | null`)
- Khi một field đang mở, các field khác không thể click
- Nút **Hủy**: đóng input, khôi phục giá trị cũ
- Nút **Lưu**: cập nhật local state, đóng input

**State:**
```typescript
// Trong ProfileEditPanel.tsx
const [activeField, setActiveField] = useState<string | null>(null)
const [draft, setDraft] = useState<Partial<UserProfile>>(profile)

const handleEdit = (field: string) => {
  if (activeField !== null) return  // block nếu đang có field khác mở
  setActiveField(field)
}

const handleCancel = () => setActiveField(null)

const handleSave = (field: string, value: string) => {
  setDraft(prev => ({ ...prev, [field]: value }))
  setActiveField(null)
}
```

**`EditableRow` component** (dùng nội bộ trong `ProfileEditPanel.tsx`):
```typescript
// Props
interface EditableRowProps {
  icon: LucideIcon
  label: string
  value?: string
  placeholder: string
  field: string
  isActive: boolean
  isLocked: boolean  // true khi field khác đang active
  onEdit: (field: string) => void
  onSave: (field: string, value: string) => void
  onCancel: () => void
}
```

**Khi `isActive = true`:**
```
[icon]  [value hiện tại / placeholder]
        ┌─────────────────────────────┐
        │  <Input value={...} />      │
        └─────────────────────────────┘
        [Hủy]  [Lưu]
```

**Khi `isLocked = true`:** dòng mờ đi (`opacity-50 cursor-not-allowed`), không thể click.

**Phần "Giới thiệu" (cột trái) — field đặc biệt:**
- Dùng `<Textarea>` thay vì `<Input>`
- Hiển thị character count `{length}/101`
- Nút `Công khai ▼` (badge nhỏ, chỉ UI, chưa cần logic)

**shadcn components dùng:**
| Component | Dùng cho |
|---|---|
| `<Card>` + `<CardHeader>` + `<CardContent>` | Wrapper panel |
| `<Input>` | Các field thông tin |
| `<Textarea>` | Field giới thiệu bản thân |
| `<Button>` | Hủy / Lưu |
| `<Badge>` | Nhãn "Công khai" |
| `<Separator>` | Ngăn cách các section |

**File mới cần tạo:**
- `src/views/profile/partials/ProfileEditPanel.tsx` — panel 2 cột chính
- *(EditableRow có thể là component nội bộ trong cùng file hoặc tách ra `src/components/profile/EditableRow.tsx` nếu cần tái dùng)*

**Tích hợp vào `ProfileCover.tsx`:**
```tsx
{isOwner && editPanelOpen && (
  <ProfileEditPanel
    profile={profile}
    onClose={() => setEditPanelOpen(false)}
    onSave={(updatedProfile) => {
      // cập nhật state profile trong Profile.tsx qua callback
    }}
  />
)}
```

---

### 📁 File bổ sung cho Task này

```
src/
├── views/
│   └── profile/
│       └── partials/
│           ├── CoverPhotoAlbumModal.tsx   # Dialog chọn ảnh từ album
│           └── ProfileEditPanel.tsx       # Card chỉnh sửa trang cá nhân (2 cột)
│
├── components/
│   └── profile/
│       └── EditableRow.tsx               # (optional) Row có thể edit inline
│
└── data/
    └── mock/
        └── photosMock.ts                 # Danh sách ảnh mock cho album (nếu tách riêng)
```

---

### 🚀 Thứ tự implement Task này

1. **Cập nhật `UserProfile` type** — thêm field nếu thiếu: `bio`, `location`, `hometown`, `birthday`, `relationship`, `gender`, `pronouns`, `language`
2. **`photosMock.ts`** — tạo mảng 9–12 URL ảnh placeholder
3. **`CoverPhotoAlbumModal.tsx`** — Dialog chọn ảnh từ album
4. **Cập nhật `ProfileCover.tsx`** — thêm nút chỉnh sửa ảnh bìa + dropdown + file input ẩn + gọi modal
5. **`ProfileEditPanel.tsx`** — Panel 2 cột với `EditableRow` + Textarea cho bio
6. **Kết nối `ProfileEditPanel` vào `ProfileCover.tsx`** — toggle `editPanelOpen`, truyền callback `onSave`

---

## ✅ Checklist hoàn thành

- [ ] Route `/profile/:userId` hoạt động, nested dưới `MainLayout`
- [ ] Header từ `MainLayout` hiển thị đúng, không tạo lại
- [ ] Lazy loading + `<Suspense>` đúng AGENTS.md
- [ ] Tất cả components: `export default function` + PascalCase filename
- [ ] Import alias `@/` (không dùng relative `../../`)
- [ ] `isOwner = true` → hiện nút Chỉnh sửa; `false` → hiện nút Thêm bạn
- [ ] Tab switching hoạt động (Bài viết / Giới thiệu / Bạn bè / Ảnh)
- [ ] `PostCard` hiển thị đủ: text, ảnh, like/comment/share
- [ ] Grid bạn bè và grid ảnh render đúng
- [ ] Mobile responsive (1 cột `< md`)
- [ ] Màu mặc định shadcn, không có custom CSS variables