# 📋 Plan: Trang Đăng nhập & Đăng ký (X-style Layout)

## 🎯 Tổng quan

Xây dựng trang **Login / Register** theo layout kiểu X (Twitter):
- Nửa trái: Logo/Brand lớn full height
- Nửa phải: Form email + mật khẩu (không có đăng nhập bên thứ ba)
- Footer links ở dưới cùng
- Dark theme, tối giản, typographic-heavy

---

## 📁 Cấu trúc File (theo AGENTS.md)

```
src/
├── views/
│   └── auth/
│       ├── Login.tsx               # Route: /login  (top-level route)
│       └── Register.tsx            # Route: /register (top-level route)
│
├── components/
│   └── auth/
│       └── AuthFooter.tsx          # Footer links (About, Privacy, Terms...)
│
├── plugins/
│   └── routers/
│       └── index.tsx               # Thêm PATH_CONSTRAINT.LOGIN, PATH_CONSTRAINT.REGISTER
│
└── types/
    └── Auth.ts                     # Interface LoginPayload, RegisterPayload
```

> **Quy tắc theo AGENTS.md:**
> - `Login.tsx` và `Register.tsx` là route-level → để trong `src/views/auth/`
> - `AuthFooter` dùng chung 2 trang → `src/components/auth/`
> - Tất cả dùng `export default function`
> - File JSX dùng `.tsx`, plain TS dùng `.ts`
> - **Không dùng `<form>` tag** — dùng `<div>` + `onClick` handlers

---

## 🗂️ Layout (2 cột — X style)

```
┌────────────────────────┬───────────────────────────────┐
│                        │                               │
│   Cột trái (50%)       │   Cột phải (50%)              │
│                        │                               │
│   Logo/Brand lớn       │   "Đang xảy ra ngay bây giờ" │
│   căn giữa             │   (heading lớn, font-bold)    │
│   full height          │                               │
│                        │   LOGIN                       │
│                        │   "Chào mừng trở lại."        │
│                        │   [Input: Email]              │
│                        │   [Input: Mật khẩu]           │
│                        │   [Đăng nhập]                 │
│                        │   Quên mật khẩu?              │
│                        │   Chưa có tài khoản? [Đăng ký]│
│                        │                               │
│                        │   REGISTER                    │
│                        │   "Tham gia ngay hôm nay."    │
│                        │   [Input: Email]              │
│                        │   [Input: Mật khẩu]           │
│                        │   [Input: Xác nhận mật khẩu] │
│                        │   [Tạo tài khoản]             │
│                        │   Đã có tài khoản? [Đăng nhập]│
│                        │                               │
├────────────────────────┴───────────────────────────────┤
│   Footer: About · Privacy · Terms · Help · Careers...  │
└────────────────────────────────────────────────────────┘
```

---

## 🧩 Mapping shadcn Components → UI Elements

### Trang Register (`Register.tsx`)

| UI Element | shadcn Component | Ghi chú |
|---|---|---|
| Label "Email" | `<Label>` | htmlFor liên kết với Input |
| Input Email | `<Input type="email">` | Full width, placeholder "you@example.com" |
| Label "Mật khẩu" | `<Label>` | |
| Input Mật khẩu | `<Input type="password">` | Full width |
| Label "Xác nhận mật khẩu" | `<Label>` | |
| Input Xác nhận mật khẩu | `<Input type="password">` | Full width, validate khớp |
| Nút "Tạo tài khoản" | `<Button>` (default) | Full width, `rounded-full`, bg trắng chữ đen |
| Error message | `<p className="text-destructive text-sm">` | Hiện khi validate/submit thất bại |
| "Đã có tài khoản?" + nút | `<p>` + `<Button variant="link">` | Link navigate → `/login` |

### Trang Login (`Login.tsx`)

| UI Element | shadcn Component | Ghi chú |
|---|---|---|
| Label "Email" | `<Label>` | htmlFor liên kết với Input |
| Input Email | `<Input type="email">` | Full width |
| Label "Mật khẩu" | `<Label>` | |
| Input Mật khẩu | `<Input type="password">` | Full width |
| Link "Quên mật khẩu?" | `<Button variant="link">` | Màu `--accent-link` xanh, align right |
| Nút "Đăng nhập" | `<Button>` | Full width, `rounded-full` |
| Error message | `<p className="text-destructive text-sm">` | Hiện khi login thất bại |
| "Chưa có tài khoản?" + nút | `<p>` + `<Button variant="link">` | Link navigate → `/register` |

### Shared Components

| Component | Props | shadcn dùng |
|---|---|---|
| `<AuthFooter>` | — | `<nav>` + array links tĩnh |

---

## 🎨 Styling

Dùng **màu mặc định của shadcn/ui** (`base-nova`, `neutral` theo `components.json`), không override CSS variables. Chỉ dùng Tailwind utilities cho layout và spacing:

- `max-w-sm` cho form container
- `w-64 h-64` cho logo
- Button sizing mặc định của shadcn

---

## 📝 TypeScript Types (`src/types/Auth.ts`)

```typescript
export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  email: string
  password: string
  confirmPassword: string
}
```

---

## 🔌 Router Setup (`src/plugins/routers/index.tsx`)

```typescript
// 1. Thêm vào PATH_CONSTRAINT
export const PATH_CONSTRAINT = {
  // ...existing paths
  LOGIN:    '/login',
  REGISTER: '/register',
}

// 2. Lazy import (code-splitting theo AGENTS.md)
const Login    = React.lazy(() => import('@/views/auth/Login'))
const Register = React.lazy(() => import('@/views/auth/Register'))

// 3. Thêm vào createBrowserRouter
{
  path: PATH_CONSTRAINT.LOGIN,
  element: (
    <Suspense fallback={<OverlaySpinner show text="Đang tải..." />}>
      <Login />
    </Suspense>
  )
},
{
  path: PATH_CONSTRAINT.REGISTER,
  element: (
    <Suspense fallback={<OverlaySpinner show text="Đang tải..." />}>
      <Register />
    </Suspense>
  )
}
```

---

## 🔄 State & Handler Logic

```typescript
// Login.tsx — local state (không cần Redux cho form)
const [email, setEmail]       = useState('')
const [password, setPassword] = useState('')
const [loading, setLoading]   = useState(false)
const [error, setError]       = useState<string | null>(null)
const navigate = useNavigate()

const handleLogin = async () => {
  setLoading(true)
  setError(null)
  try {
    // await loginService(email, password)
    // dispatch(setUser(user))  ← Redux slice nếu cần lưu user
    navigate(PATH_CONSTRAINT.HOME)
  } catch (err) {
    setError('Email hoặc mật khẩu không đúng')
  } finally {
    setLoading(false)
  }
}

// Register.tsx — tương tự, thêm validate confirmPassword
```

> **Lưu ý:** Redux (`authSlice`) chỉ dùng để persist `user` sau login thành công, không quản lý form state.

---

## 🧩 shadcn Components cần thêm

```bash
# Kiểm tra components.json, nếu chưa có thì chạy:
npx shadcn@latest add button input label
```

---

## 🚀 Thứ tự Implementation

### Phase 1 – Types & Router (15 phút)
- [ ] Tạo `src/types/Auth.ts` với `LoginPayload`, `RegisterPayload`
- [ ] Thêm `PATH_CONSTRAINT.LOGIN` + `PATH_CONSTRAINT.REGISTER` vào router
- [ ] Đăng ký 2 lazy routes trong `createBrowserRouter`

### Phase 2 – Shared Component (10 phút)
- [ ] `src/components/auth/AuthFooter.tsx`
  - Array links cố định, `flex flex-wrap gap-x-4 gap-y-2`
  - Text nhỏ, màu muted

### Phase 3 – Register Page (30 phút)
- [ ] `src/views/auth/Register.tsx`
- [ ] Layout `flex h-screen`: cột logo (trái) + cột form (phải)
- [ ] Label + Input: Email, Mật khẩu, Xác nhận mật khẩu
- [ ] Validate `confirmPassword === password` trước khi submit
- [ ] Error state display `text-destructive`
- [ ] Nút "Tạo tài khoản" + loading state
- [ ] Link "Đã có tài khoản?" → `useNavigate('/login')`
- [ ] `<AuthFooter>` ở bottom

### Phase 4 – Login Page (25 phút)
- [ ] `src/views/auth/Login.tsx`
- [ ] Tái sử dụng layout 2 cột
- [ ] Label + Input: Email, Mật khẩu
- [ ] Link "Quên mật khẩu?" (placeholder, chưa có flow)
- [ ] Nút "Đăng nhập" + loading state
- [ ] Error state display `text-destructive`
- [ ] Link "Chưa có tài khoản?" → `useNavigate('/register')`

### Phase 5 – Polish (15 phút)
- [ ] `disabled` + spinner icon khi đang loading
- [ ] Hover/focus states dark-theme consistent
- [ ] Responsive mobile: `flex-col` (ẩn logo, form full width) khi `< md`
- [ ] Kiểm tra không có `<form>` tag nào

---

## ✅ Checklist hoàn thành

- [ ] Routes `/login` và `/register` hoạt động
- [ ] Lazy loading + `<Suspense>` đúng AGENTS.md
- [ ] **Không có `<form>` tag** — chỉ dùng `<div>` + `onClick`
- [ ] Tất cả components: `export default function` + PascalCase filename
- [ ] `.tsx` cho JSX, `.ts` cho plain TypeScript
- [ ] Import alias `@/` hoạt động (không dùng relative `../../`)
- [ ] Validate `confirmPassword` ở Register trước khi submit
- [ ] Navigate Login ↔ Register đúng path
- [ ] Loading + disabled state trên button khi đang submit
- [ ] Error message hiển thị đúng chỗ (`text-destructive`)
- [ ] Mobile responsive (1 cột `< md`)
- [ ] Dark theme đồng bộ `<div className="dark">` từ `App.tsx`
- [ ] `<AuthFooter>` hiển thị đầy đủ ở cả 2 trang