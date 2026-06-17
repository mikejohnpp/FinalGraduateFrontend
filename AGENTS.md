# AGENTS

## Commands

- `npm run dev` - Vite dev server (port 3000)
- `npm run build` - `tsc -b` then `vite build`
- `npm run lint` - ESLint flat config
- `npm run preview` - Preview production build

## Entry + App Wiring

- Vite entrypoint is `src/main.tsx`; Redux store is wired there via `Provider`.
- `src/App.tsx` renders `<RouterProvider>`.
- Absolute import alias `@` maps to `src/` (Vite + TS config).
- Backend API base URL is set via `VITE_SERVER_API` (default `http://localhost:8080`).

## UI / Styling

- Tailwind v4 via `@tailwindcss/vite`; no separate tailwind.config file.
- shadcn/ui configured in `components.json` (style `base-nova`, base color `neutral`, CSS at `src/index.css`).
- Shared className helper is `src/lib/utils.ts` (clsx + tailwind-merge).
- Icons: `@hugeicons/react` (primary) and `lucide-react` (secondary/shadcn compat).
- Fonts: `@fontsource-variable/inter`, `figtree`, `noto-sans`, `playfair-display` — imported in `src/index.css`.
- Charts: `recharts`.
- Toast/notifications: `sonner`.
- Theme: `next-themes` (dark/light mode support).
- Drawer: `vaul`.
- Headless primitives: `@base-ui/react`.

## HTTP / API Layer

### Http class — `src/lib/http.ts`

- Central Axios wrapper. **All API calls must go through this, never raw axios.**
- Default export is a singleton: `import http from "@/lib/http"`.
- Constructor accepts a `baseURL` and wires request/response interceptors automatically.
- **Token management**: reads `access_token` from `localStorage` on every request via request interceptor.
- **Auto refresh**: on 401, pauses queued requests, calls `POST /api/auth/refresh-token` (with credentials), retries after new token. On failure, clears token and redirects to login.
- **403 handling**: saves `PATH` to localStorage, clears token, redirects to login.

#### Methods (all return `T` directly — never `AxiosResponse<T>`)

| Method               | Signature                            | Notes                               |
| -------------------- | ------------------------------------ | ----------------------------------- |
| `get`                | `get<T>(url, params?, config?)`      | Query params as object              |
| `post`               | `post<T>(url, data?, config?)`       | JSON body                           |
| `put`                | `put<T>(url, data, config?)`         | JSON body                           |
| `delete`             | `delete<T>(url, config?)`            |                                     |
| `deleteWithBody`     | `deleteWithBody<T>(url, data)`       | DELETE with JSON body (e.g. unlike) |
| `postWithFile`       | `postWithFile<T>(url, data)`         | Sets `multipart/form-data`          |
| `ExportFile`         | `ExportFile<T>(url)`                 | GET, responseType blob              |
| `ExportFileWithData` | `ExportFileWithData<T>(url, data[])` | POST, responseType blob             |

### BaseService — `src/types/base/BaseService.ts`

- Abstract base class for all service modules. Extend it, never instantiate directly.
- Wraps `http.*` calls and unwraps `ApiResultGeneric<T>.data` automatically.
- **Do not** access `.data` manually on responses when using BaseService methods.

#### Methods

| Method                            | Returns     | Notes                           |
| --------------------------------- | ----------- | ------------------------------- |
| `getList<T>(url, id?, params?)`   | `Array<T>`  | Appends `id` to URL if provided |
| `getSingle<T>(url, id?, params?)` | `T \| null` |                                 |
| `create<T>(url, data)`            | `boolean`   |                                 |
| `createAndGetData<T>(url, data)`  | `T \| null` |                                 |
| `update<T>(url, data)`            | `boolean`   |                                 |
| `updateAndGetData<T>(url, data)`  | `T \| null` |                                 |
| `delete(url, id[])`               | `boolean`   | Joins ids with comma in URL     |

### API constants — `src/common/constants.ts`

- `API` object: central registry of all API path segments.
- `AUTH_TOKEN_NAME = "access_token"` — localStorage key for JWT.
- Add new endpoint paths here; never hardcode strings in services.

```ts
export const API = {
  REFRESH: "auth/refresh-token",
  LOGIN: "auth/login",
  LOGOUT: "auth/logout",
  REGISTER: "auth/register",
  ACTIVE: "auth/active",
  POST: {
    BASE: "users/posts", // CRUD, like/unlike
    SUGGESTED: "users/posts/suggested", // Infinite scroll feed
    SEARCH: "users/posts/search", // Standard pagination
  },
  COMMENT: {
    PATH: "comments",
    REPLIES_PATH: "replies",
    LIKE_PATH: "like",
  },
  ADMIN: {
    USERS: "users/admin/users",
    GROUPS: "users/admin/groups",
    SENTIMENT_OVERVIEW: "users/admin/sentiment/overview", // Overview 3 nhãn (post + comment)
    SENTIMENT_ITEMS: "users/admin/sentiment/items", // Drill-down list (paginated)
    REPORT_OVERVIEW: "users/admin/reports/overview", // System dashboard stats
    REPORT_EXPORT: "users/admin/reports/export", // CSV blob download
  },
};
```

### Service pattern

- Each feature service extends `BaseService` and uses `http` for non-standard calls.
- Singleton export: `export default new XxxService()`.
- Example: `src/services/userService.ts` (UserService), `src/services/postService.ts` (PostService).
- **Keep services thin.** If a service only needs standard CRUD or inherited methods, just extend `BaseService` with an empty class body (see `postService.ts` or `commentService.ts`). Only add custom methods when the endpoint doesn't fit the `BaseService` pattern (e.g. `login()`, `activate()` in `userService.ts`).
- API calls from hooks should use the inherited `BaseService` methods (`getList`, `getSingle`, `create`, …) directly — don't wrap them again in the service.

## Types

### Directory layout

```
src/types/
├── base/
│   ├── BaseService.ts       # Service base class
│   └── IBase.tsx            # Minimal base interface
├── interfaces/
│   ├── auth/                # Auth-related interfaces (LoggedIn, TokenResult, ...)
│   ├── post/                # Post interfaces (IPost, IPostDetails, ...)
│   ├── comment/             # Comment interfaces (IComment, ICommentCreate, ...)
│   ├── result/              # ApiResult, ApiResultGeneric<T>
│   └── IFriend.ts
├── Auth.ts
├── Friend.ts
├── Group.ts
├── GroupPost.ts
├── HomeFeed.ts
├── LoginCredentials.ts
├── messenger.ts
├── Post.ts
└── Profile.ts
```

### ApiResult shape — `src/types/interfaces/result/apiResult.ts`

- `ApiResultGeneric<T>` — typed response: `{ data: T | null, success: boolean, code: number, ... }`
- `ApiResult` — untyped (no generic) for endpoints that return no data.
- All `http.*` calls should be typed with one of these: `http.get<ApiResultGeneric<MyType>>(...)`.

## Component / View / Router Organization

### Directory rules

| Directory                       | Purpose                                                               | Examples                                               |
| ------------------------------- | --------------------------------------------------------------------- | ------------------------------------------------------ |
| `src/views/<feature>/`          | Route-level page components (one file per route path, default export) | `Login.tsx`, `Home.tsx`                                |
| `src/views/<feature>/partials/` | Sub-route (child route) components only used inside that feature      | `FriendsRequests.tsx`, `FriendsSuggest.tsx`            |
| `src/views/layouts/`            | Layout wrappers using `<Outlet />`                                    | `Default.tsx`, `MainLayout.tsx`, `GroupsLayout.tsx`    |
| `src/components/ui/`            | shadcn/ui primitives — never edit manually                            | `button.tsx`, `dialog.tsx`                             |
| `src/components/<feature>/`     | Reusable feature-scoped shared components                             | `friends/FriendsSidebar.tsx`                           |
| `src/components/` (root)        | Truly global shared components                                        | `Header.tsx`, `AutoComplete.tsx`, `OverlaySpinner.tsx` |
| `src/plugins/routers/`          | React Router v7 config (`createBrowserRouter`)                        | `index.tsx`                                            |

### Existing views (current routes)

| Feature   | Files                                                                                                                       |
| --------- | --------------------------------------------------------------------------------------------------------------------------- |
| Auth      | `src/views/auth/Login.tsx`, `Register.tsx`, `ActivateAccount.tsx`                                                           |
| Home      | `src/views/home/Home.tsx`                                                                                                   |
| Friends   | `src/views/friends/Friends.tsx` + `partials/`                                                                               |
| Profile   | `src/views/profile/Profile.tsx` + `partials/`                                                                               |
| Groups    | `src/views/groups/GroupsFeed.tsx`, `GroupsMine.tsx`, `GroupsDiscover.tsx`, `GroupDetail.tsx`, `GroupCreate.tsx`             |
| Messenger | `src/views/messenger/Messenger.tsx`                                                                                         |
| Admin     | `src/views/admin/UserManagement.tsx`, `GroupManagement.tsx`, `SentimentStats.tsx`, `SentimentItems.tsx`, `SystemReport.tsx` |

### Admin feature — `src/views/admin/`

- Quản trị toàn hệ thống, bảo vệ bởi `AdminLayout` (chỉ `ROLE_ADMIN`), tách khỏi `MainLayout`.
- Routes định nghĩa trong `src/plugins/routers/adminRoutes.tsx` (`/admin`, `/admin/users`, `/admin/groups`, `/admin/sentiment`, `/admin/sentiment/items`, `/admin/reports`).
- **Thống kê cảm xúc** (`SentimentStats.tsx`): 2 Pie chart (recharts) cho post + comment, nhãn `positive|neutral|negative`. Click slice → drill-down sang `SentimentItems.tsx`.
- **Drill-down** (`SentimentItems.tsx`): bảng phân trang, **bộ lọc lưu trong URL query** (`useSearchParams`) làm nguồn sự thật — reload/share link giữ nguyên filter.
- **Báo cáo hệ thống** (`SystemReport.tsx`): dashboard thẻ số liệu + nút xuất CSV (blob download).
- Bộ lọc dùng chung qua `src/components/admin/SentimentFilters.tsx` — dạng **draft cục bộ, chỉ áp dụng khi nhấn "Áp dụng"** (parent remount qua `key={JSON.stringify(filter)}`).

### Layouts

- `Default.tsx` — bare layout (auth pages: Login, Register).
- `MainLayout.tsx` — layout with `<Header />` (Home, Friends, Profile, Messenger).
- `GroupsLayout.tsx` — layout for group sub-routes.
- `AdminLayout.tsx` — admin sidebar + auth guard (`ROLE_ADMIN`), wraps all `/admin/*` routes.

### When to create what

- **New top-level route** → `src/views/<feature>/<Name>.tsx` (e.g. `/chat` → `src/views/chat/Chat.tsx`)
- **Child/nested route of a feature** → `src/views/<feature>/partials/<Name>.tsx`
- **UI piece reused across multiple features** → `src/components/<Name>.tsx`
- **UI piece reused only within one feature** → `src/components/<feature>/<Name>.tsx`
- **Layout wrapping multiple routes** → `src/views/layouts/<Name>.tsx`

### Router conventions

- Define path constants in `PATH_CONSTRAINT` object in `src/plugins/routers/index.tsx`.
- Use `React.lazy()` for code-splitting all route-level imports.
- Every layout route wraps children in `<Suspense fallback={<OverlaySpinner show text="Đang tải..." />}>`.
- Components use default exports; router imports them via dynamic `import()`.
- Current org: `authRoutes` (Login, Register, ActivateAccount) → `Default` layout; `mainRoutes` (Home, Friends, Profile, Messenger) → `MainLayout`; group sub-routes → `GroupsLayout`.

### Naming + export conventions

- All component files use PascalCase filenames.
- All components use `export default function`.
- `.tsx` extension for files with JSX; `.ts` for plain TypeScript.

## State Management

- Redux Toolkit with slices in `src/stores/`.
- Use typed `useSelector`/`useDispatch` from `react-redux` directly (no custom wrappers yet).
- Types `RootState` and `AppDispatch` exported from `src/stores/store.ts`.
- `thunkExtra.ts` defines the `ThunkExtra` type passed as extra arg to thunks (currently empty).

### Existing slices

| Slice     | File              | State fields                                                                                           |
| --------- | ----------------- | ------------------------------------------------------------------------------------------------------ |
| `user`    | `userSlice.ts`    | `userId`, `username`, `accessToken`, `loginSuccess`, `isLoading`                                       |
| `post`    | `postSlice.ts`    | `suggestedFeed: { items, nextCursor, hasMore }`, `currentPost`                                         |
| `comment` | `commentSlice.ts` | `commentsByPost: Record<number, CommentFeedState>`, `repliesByComment: Record<number, ReplyFeedState>` |
| `counter` | `counterSlice.ts` | dev/test only                                                                                          |

### userSlice actions — `userActions`

`setUsername`, `setUserId`, `setAccessToken`, `setLoginSuccess`, `setIsLoading`, `resetUser`

### postSlice — `src/stores/postSlice.ts`

State: `{ suggestedFeed: { items, nextCursor, hasMore }, currentPost }`

Actions (`postActions`):

- `setSuggestedFeed(CursorPageResponse<IPost>)` — first load
- `appendSuggestedPosts(CursorPageResponse<IPost>)` — load more (infinite scroll)
- `setCurrentPost(IPostDetails | null)` — single post view
- `updateLikeCount({ postId, delta })` — optimistic like/unlike
- `removePost(postId)` — soft delete from feed
- `prependPost(IPost)` — add newly created post to top of feed

## Hooks — `src/hooks/`

| Hook                                           | File                | Purpose                                                                                     |
| ---------------------------------------------- | ------------------- | ------------------------------------------------------------------------------------------- |
| `useLoginUser()`                               | `useUser.tsx`       | Login flow: calls `userService.login`, dispatches to `userSlice`, navigates to HOME         |
| `useLogoutUser()`                              | `useUser.tsx`       | Logout flow: calls `userService.logout`, resets store, clears token, redirects              |
| `useUserRegister()`                            | `useUser.tsx`       | Registration flow: calls `userService.register`, handles validation, returns success status |
| `useUserActivate()`                            | `useUser.tsx`       | Activation flow: calls `userService.activate(code)`, exposes status/error for UI            |
| `useSuggestedFeed(userId)`                     | `usePost.tsx`       | Infinite scroll feed: loads suggested posts, exposes `loadMore`, `hasMore`                  |
| `useCreatePost()`                              | `usePost.tsx`       | Tạo bài viết, prepend vào feed, trả về `create`, `loading`, `error`                         |
| `usePostDetail(id)`                            | `usePost.tsx`       | Lấy chi tiết 1 bài viết vào `currentPost` store                                             |
| `useUpdatePost()`                              | `usePost.tsx`       | Cập nhật bài viết, cập nhật `currentPost` store                                             |
| `useDeletePost()`                              | `usePost.tsx`       | Xoá bài viết, xoá khỏi feed trong store                                                     |
| `useLikePost()`                                | `usePost.tsx`       | Like/unlike optimistic, cập nhật `likeCount` trong store                                    |
| `useComments(postId)`                          | `useComment.tsx`    | Lấy danh sách comment gốc (infinite scroll)                                                 |
| `useReplies(postId, commentId)`                | `useComment.tsx`    | Lấy replies của comment (lazy load)                                                         |
| `useCreateComment(postId)`                     | `useComment.tsx`    | Tạo comment/reply mới                                                                       |
| `useEditComment(postId)`                       | `useComment.tsx`    | Sửa nội dung comment                                                                        |
| `useDeleteComment(postId)`                     | `useComment.tsx`    | Xóa comment (gửi userId qua URL query)                                                      |
| `useLikeComment(postId)`                       | `useComment.tsx`    | Like/unlike comment optimistic                                                              |
| `useMobile()`                                  | `use-mobile.ts`     | Returns `true` when viewport is mobile width                                                |
| `useSentimentOverview(filter)`                 | `useAdminStats.tsx` | Admin: lấy overview cảm xúc (3 nhãn × post/comment) theo bộ lọc                             |
| `useSentimentItems(filter, type, page, size?)` | `useAdminStats.tsx` | Admin: drill-down danh sách post/comment có phân trang                                      |
| `useReportOverview()`                          | `useAdminStats.tsx` | Admin: số liệu tổng quan hệ thống cho dashboard báo cáo                                     |
| `useExportReport()`                            | `useAdminStats.tsx` | Admin: xuất CSV (blob download), check `Content-Type` để bắt lỗi JSON                       |
| `useGroupOptions()`                            | `useAdminStats.tsx` | Admin: danh sách nhóm cho dropdown lọc                                                      |

### Service → Hook → UI architecture

This project follows a strict three-layer convention:

| Layer                                                  | Responsibility                                                                                                                                  | Accesses store?     | Example            |
| ------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- | ------------------- | ------------------ |
| **Service** (`src/services/`)                          | Thin API wrapper. Extends `BaseService` and exposes inherited CRUD + any non-standard endpoints. No business logic.                             | ❌ Never            | `postService.ts`   |
| **Hook** (`src/hooks/`)                                | All business logic: calls service methods, dispatches to Redux store, manages local state, handles errors, and returns the states the UI needs. | ✅ Yes              | `useUser.tsx`      |
| **View / Component** (`src/views/`, `src/components/`) | Pure presentation. Consumes only the values returned by hooks. Should **never** import `useSelector`/`useDispatch` or services directly.        | ❌ Never (use hook) | `RegisterForm.tsx` |

**Rules:**

1. **Services are thin** — if standard CRUD is enough, an empty `extends BaseService` class is all you need (see `postService.ts`). Hooks call `BaseService` methods (`getList`, `getSingle`, `create`, …) via the service singleton.
2. **Hooks own the logic** — receiving API responses, dispatching actions, computing derived state, error handling, and navigation all happen here. Return an object of states/callbacks for the UI.
3. **Views stay dumb** — never use `useSelector`, `useDispatch`, or call services directly in views/components. Everything comes from the hook's return value.

## Utilities — `src/utils/`

| File                  | Exports                                                                                                   |
| --------------------- | --------------------------------------------------------------------------------------------------------- |
| `redirectHelper.ts`   | `RedirectLogin()`, `RedirectLoginAndResetParam()`, `RemoveToken()`                                        |
| `stringHelper.tsx`    | String manipulation helpers                                                                               |
| `DinhDangThoiGian.ts` | Định dạng thời gian ISO sang `vi-VN` (dùng trong bảng admin)                                              |
| `sentimentParams.ts`  | Đọc/ghi bộ lọc cảm xúc qua URL query (`parseSentimentFilter`, `sentimentFilterToParams`, `parseItemType`) |

## Data

- `src/services/` — API service modules extending `BaseService`.
  - `userService.ts` — `login()`, `logout()`, `register()`, `activate()`
  - `postService.ts` — inherits `BaseService` CRUD methods
  - `commentService.ts` — inherits `BaseService` CRUD methods
  - `adminService.ts` — user/group CRUD + `getSentimentOverview()`, `getSentimentItems()`, `getReportOverview()`, `exportReport()` (CSV blob)
- `src/types/interfaces/admin/` — Admin type definitions.
  - `ISentiment.ts` — `SentimentLabel` (`positive|neutral|negative`), `SentimentItemType` (`post|comment`), `SentimentOverviewDTO`, `SentimentItemDTO`, `SentimentFilter`
  - `IReport.ts` — `ReportOverviewDTO` (số liệu tổng quan hệ thống)

- `src/types/interfaces/post/` — Post type definitions.
  - `IPost.ts` — `PostSummaryDTO` (list view, has `commentCount`, `likeCount`, `content`)
  - `IPostDetails.ts` — `PostDetailDTO` (detail/create/update view)
  - `IPostCreate.ts` — `IPostCreate` (request body tạo), `IPostUpdate` (request body cập nhật)
  - `IPostPage.ts` — `CursorPageResponse<T>` (infinite scroll), `PageResponse<T>` (standard pagination)
- `src/types/interfaces/comment/` — Comment type definitions.
  - `IComment.ts` — `CommentDTO`
  - `ICommentCreate.ts` — `ICommentCreate`, `ICommentUpdate`
- `src/data/mock/` — Static mock data for UI development.
  - `friends.ts`, `home.ts`, `groupsMock.ts`, `groupPostsMock.ts`, `messengerData.ts`, `photosMock.ts`, `postsMock.ts`, `profileMock.ts`
- Mock data approach: define types first in `src/types/`, then export typed arrays/objects in `src/data/mock/`.

## Env / External Services

- Vite env vars declared in `.env`. All must be prefixed `VITE_`.

| Variable                                                   | Purpose                                             |
| ---------------------------------------------------------- | --------------------------------------------------- |
| `VITE_SERVER_API`                                          | Backend base URL (default: `http://localhost:8080`) |
| `VITE_SUPABASE_URL` / `VITE_SUPABASE_KEY`                  | Supabase (optional)                                 |
| `VITE_LINK_PREVIEW_API_KEY` / `VITE_LINK_PREVIEW_ENDPOINT` | Link preview API                                    |
| `VITE_FIREBASE_*`                                          | Firebase config (auth/storage)                      |

- Firebase config in `src/plugins/firebase/`.
- Vite proxy for `/api` and `/users` is defined but **commented out**; direct requests go to `VITE_SERVER_API`.

## Language

- UI text is in Vietnamese.
