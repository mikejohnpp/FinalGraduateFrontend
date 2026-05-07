# 📋 Plan: Messenger Clone với shadcn/ui

## 🎯 Tổng quan dự án

Xây dựng giao diện **Facebook Messenger** clone sử dụng **React + shadcn/ui**, tái hiện đầy đủ layout 3 cột với dark theme, danh sách hội thoại, khung chat, và panel thông tin.

---

## 🗂️ Cấu trúc Layout (3 cột)

```
┌──────────────┬─────────────────────────┬──────────────────┐
│  Sidebar     │     Chat Window         │   Info Panel     │
│  (280px)     │     (flex-1)            │   (300px)        │
│              │                         │                  │
│ - Search bar │ - Chat header           │ - Avatar         │
│ - Tabs       │ - Message list          │ - Name           │
│ - Conv list  │ - Input bar             │ - Action buttons │
│              │                         │ - Accordion info │
└──────────────┴─────────────────────────┴──────────────────┘
```

---

## 📦 Công nghệ & Dependencies

| Package | Mục đích |
|---|---|
| `react` + `vite` | Framework chính |
| `shadcn/ui` | Component library |
| `tailwindcss` | Utility CSS |
| `lucide-react` | Icon set |
| `@radix-ui/*` | Headless UI primitives |
| `clsx` / `tailwind-merge` | Class merging |

---

## 🧩 Mapping shadcn Components → UI Elements

### Sidebar (Cột trái)
| UI Element | shadcn Component |
|---|---|
| Search bar | `<Input>` với icon Search |
| Tab "Tất cả / Chưa đọc / Nhóm" | `<Tabs>` + `<TabsList>` + `<TabsTrigger>` |
| Danh sách hội thoại | `<ScrollArea>` chứa custom `ConversationItem` |
| Avatar người dùng | `<Avatar>` + `<AvatarImage>` + `<AvatarFallback>` |
| Badge tin nhắn mới | `<Badge>` variant `destructive` |
| Button icon (3 chấm, bút) | `<Button variant="ghost" size="icon">` |

### Chat Window (Cột giữa)
| UI Element | shadcn Component |
|---|---|
| Header chat | Custom header + `<Avatar>` + `<Button>` icons |
| Vùng tin nhắn | `<ScrollArea>` + message bubbles |
| Tin nhắn của tôi | Custom bubble (bg blue, rounded-2xl) |
| Tin nhắn đối phương | Custom bubble (bg muted, rounded-2xl) |
| Reaction bar (hover) | `<Popover>` hoặc `<HoverCard>` |
| Input nhập tin nhắn | `<Input>` + `<Button>` emoji/like |
| Dropdown tùy chọn tin nhắn | `<DropdownMenu>` |

### Info Panel (Cột phải)
| UI Element | shadcn Component |
|---|---|
| Avatar lớn | `<Avatar>` size custom |
| Tên & trạng thái | Typography + `<Badge>` |
| Buttons (Trang cá nhân, Tắt thông báo, Tìm kiếm) | `<Button variant="ghost">` với icon |
| Accordion sections | `<Accordion>` + `<AccordionItem>` |
| "Thông tin về đoạn chat" | `<AccordionTrigger>` + `<AccordionContent>` |
| "Tùy chỉnh đoạn chat" | `<AccordionTrigger>` + `<AccordionContent>` |
| "File phương tiện và file" | `<AccordionTrigger>` + `<AccordionContent>` |
| "Quyền riêng tư và hỗ trợ" | `<AccordionTrigger>` + `<AccordionContent>` |

---

## 📁 Cấu trúc File

```
src/
├── components/
│   ├── messenger/
│   │   ├── MessengerLayout.tsx       # Layout chính 3 cột
│   │   ├── Sidebar/
│   │   │   ├── Sidebar.tsx           # Container sidebar
│   │   │   ├── SearchBar.tsx         # Ô tìm kiếm
│   │   │   ├── ConversationTabs.tsx  # Tabs lọc
│   │   │   └── ConversationItem.tsx  # 1 item hội thoại
│   │   ├── ChatWindow/
│   │   │   ├── ChatWindow.tsx        # Container chat
│   │   │   ├── ChatHeader.tsx        # Header với tên + icons
│   │   │   ├── MessageList.tsx       # Danh sách tin nhắn
│   │   │   ├── MessageBubble.tsx     # 1 bong bóng tin nhắn
│   │   │   └── ChatInput.tsx         # Input nhập + gửi
│   │   └── InfoPanel/
│   │       ├── InfoPanel.tsx         # Container info
│   │       ├── ProfileInfo.tsx       # Avatar + tên
│   │       └── InfoAccordion.tsx     # Accordion sections
├── data/
│   └── mockData.ts                   # Mock conversations & messages
├── types/
│   └── messenger.ts                  # TypeScript interfaces
├── lib/
│   └── utils.ts                      # shadcn utility (cn)
└── App.tsx
```

---

## 🎨 Design System (Dark Theme)

```css
/* Màu sắc chính */
--background: #1C1E21        /* Nền tối */
--sidebar-bg: #242526         /* Sidebar */
--chat-bg: #1C1E21            /* Chat area */
--surface: #3A3B3C            /* Cards/Items hover */
--message-sent: #0084FF       /* Bong bóng tin nhắn gửi (xanh) */
--message-received: #3A3B3C   /* Bong bóng nhận */
--primary-text: #E4E6EB        /* Text chính */
--secondary-text: #B0B3B8      /* Text phụ */
--border: #3A3B3C              /* Viền */
```

---

## 🔄 State Management

```typescript
// Dùng useState + Context (không cần Redux cho scope này)

interface MessengerState {
  conversations: Conversation[]     // Danh sách hội thoại
  activeConversationId: string      // ID hội thoại đang mở
  messages: Record<string, Message[]> // Messages theo conversationId
  searchQuery: string               // Từ tìm kiếm
  activeTab: 'all' | 'unread' | 'groups'
}
```

---

## 📝 TypeScript Interfaces

```typescript
interface Conversation {
  id: string
  name: string
  avatar?: string
  lastMessage: string
  timestamp: string
  unreadCount?: number
  isOnline?: boolean
  isMuted?: boolean
  isGroup?: boolean
}

interface Message {
  id: string
  content: string
  senderId: string
  timestamp: string
  type: 'text' | 'image' | 'file' | 'call'
  reactions?: Reaction[]
}

interface Reaction {
  emoji: string
  count: number
  userIds: string[]
}
```

---

## 🚀 Thứ tự Implementation

### Phase 1 – Setup (30 phút)
- [ ] Khởi tạo Vite + React + TypeScript
- [ ] Cài đặt Tailwind CSS
- [ ] Cài đặt shadcn/ui (`npx shadcn@latest init`)
- [ ] Thêm components cần thiết:
  ```bash
  npx shadcn@latest add input button avatar badge tabs
  npx shadcn@latest add scroll-area accordion dropdown-menu
  npx shadcn@latest add popover hover-card separator
  ```

### Phase 2 – Layout & Mock Data (45 phút)
- [ ] Tạo `MessengerLayout.tsx` với 3 cột
- [ ] Tạo `mockData.ts` (5–10 conversations, 20+ messages)
- [ ] Định nghĩa TypeScript interfaces

### Phase 3 – Sidebar (45 phút)
- [ ] `SearchBar` với `<Input>` + icon
- [ ] `ConversationTabs` với `<Tabs>`
- [ ] `ConversationItem` với `<Avatar>`, `<Badge>`
- [ ] `<ScrollArea>` wrap danh sách

### Phase 4 – Chat Window (60 phút)
- [ ] `ChatHeader` với avatar, tên, action buttons
- [ ] `MessageBubble` (sent/received variants)
- [ ] `MessageList` với `<ScrollArea>` + auto-scroll to bottom
- [ ] `ChatInput` với emoji button + send button

### Phase 5 – Info Panel (30 phút)
- [ ] `ProfileInfo` section
- [ ] Action buttons (3 icon buttons)
- [ ] `<Accordion>` với 4 sections

### Phase 6 – Polish (30 phút)
- [ ] Hover states & transitions
- [ ] Active conversation highlight
- [ ] Responsive fallback (ẩn InfoPanel trên tablet)
- [ ] Keyboard shortcuts (Enter to send)

---

## ⌨️ Lệnh cài đặt nhanh

```bash
# 1. Tạo project
npm create vite@latest messenger-clone -- --template react-ts
cd messenger-clone

# 2. Cài Tailwind
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# 3. Cài shadcn
npm install class-variance-authority clsx tailwind-merge lucide-react
npx shadcn@latest init

# 4. Thêm tất cả components cần thiết
npx shadcn@latest add input button avatar badge tabs scroll-area accordion dropdown-menu popover separator tooltip

# 5. Chạy dev server
npm run dev
```

---

## ✅ Checklist hoàn thành

- [ ] Layout 3 cột ổn định, không bị overflow
- [ ] Dark theme đồng bộ toàn bộ UI
- [ ] Click conversation → hiển thị messages đúng
- [ ] Scroll area hoạt động (sidebar + chat)
- [ ] Gửi tin nhắn (mock) → hiện lên danh sách
- [ ] Active state conversation được highlight
- [ ] Accordion mở/đóng mượt
- [ ] Avatar fallback khi không có ảnh
- [ ] Badge unread count hiển thị đúng
- [ ] Responsive cơ bản (ẩn InfoPanel < 1280px)
