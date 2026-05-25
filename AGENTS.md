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
| Method | Signature | Notes |
|---|---|---|
| `get` | `get<T>(url, params?, config?)` | Query params as object |
| `post` | `post<T>(url, data?, config?)` | JSON body |
| `put` | `put<T>(url, data, config?)` | JSON body |
| `delete` | `delete<T>(url, config?)` | |
| `postWithFile` | `postWithFile<T>(url, data)` | Sets `multipart/form-data` |
| `ExportFile` | `ExportFile<T>(url)` | GET, responseType blob |
| `ExportFileWithData` | `ExportFileWithData<T>(url, data[])` | POST, responseType blob |

### BaseService — `src/types/base/BaseService.ts`
- Abstract base class for all service modules. Extend it, never instantiate directly.
- Wraps `http.*` calls and unwraps `ApiResultGeneric<T>.data` automatically.
- **Do not** access `.data` manually on responses when using BaseService methods.

#### Methods
| Method | Returns | Notes |
|---|---|---|
| `getList<T>(url, id?, params?)` | `Array<T>` | Appends `id` to URL if provided |
| `getSingle<T>(url, id?, params?)` | `T \| null` | |
| `create<T>(url, data)` | `boolean` | |
| `createAndGetData<T>(url, data)` | `T \| null` | |
| `update<T>(url, data)` | `boolean` | |
| `updateAndGetData<T>(url, data)` | `T \| null` | |
| `delete(url, id[])` | `boolean` | Joins ids with comma in URL |

### API constants — `src/common/constants.ts`
- `API` object: central registry of all API path segments.
- `AUTH_TOKEN_NAME = "access_token"` — localStorage key for JWT.
- Add new endpoint paths here; never hardcode strings in services.

```ts
export const API = {
  REFRESH: "api/auth/refresh-token",
  LOGIN: "api/auth/login",
  LOGOUT: "api/auth/logout",
  POST: {
    GET_LIST: "users/posts",
    GET_DETAILS: "users/posts"
  }
};
```

### Service pattern
- Each feature service extends `BaseService` and uses `http` for non-standard calls.
- Singleton export: `export default new XxxService()`.
- Example: `src/services/userService.ts` (UserService), `src/services/postService.ts` (PostService).

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
| Directory | Purpose | Examples |
|---|---|---|
| `src/views/<feature>/` | Route-level page components (one file per route path, default export) | `Login.tsx`, `Home.tsx` |
| `src/views/<feature>/partials/` | Sub-route (child route) components only used inside that feature | `FriendsRequests.tsx`, `FriendsSuggest.tsx` |
| `src/views/layouts/` | Layout wrappers using `<Outlet />` | `Default.tsx`, `MainLayout.tsx`, `GroupsLayout.tsx` |
| `src/components/ui/` | shadcn/ui primitives — never edit manually | `button.tsx`, `dialog.tsx` |
| `src/components/<feature>/` | Reusable feature-scoped shared components | `friends/FriendsSidebar.tsx` |
| `src/components/` (root) | Truly global shared components | `Header.tsx`, `AutoComplete.tsx`, `OverlaySpinner.tsx` |
| `src/plugins/routers/` | React Router v7 config (`createBrowserRouter`) | `index.tsx` |

### Existing views (current routes)
| Feature | Files |
|---|---|
| Auth | `src/views/auth/Login.tsx`, `Register.tsx` |
| Home | `src/views/home/Home.tsx` |
| Friends | `src/views/friends/Friends.tsx` + `partials/` |
| Profile | `src/views/profile/Profile.tsx` + `partials/` |
| Groups | `src/views/groups/GroupsFeed.tsx`, `GroupsMine.tsx`, `GroupsDiscover.tsx`, `GroupDetail.tsx`, `GroupCreate.tsx` |
| Messenger | `src/views/messenger/Messenger.tsx` |

### Layouts
- `Default.tsx` — bare layout (auth pages: Login, Register).
- `MainLayout.tsx` — layout with `<Header />` (Home, Friends, Profile, Messenger).
- `GroupsLayout.tsx` — layout for group sub-routes.

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
- Current org: `authRoutes` (Login, Register) → `Default` layout; `mainRoutes` (Home, Friends, Profile, Messenger) → `MainLayout`; group sub-routes → `GroupsLayout`.

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
| Slice | File | State fields |
|---|---|---|
| `user` | `userSlice.ts` | `userId`, `username`, `accessToken`, `loginSuccess`, `isLoading` |
| `post` | `postSlice.ts` | `list: IPost[]` |
| `counter` | `counterSlice.ts` | dev/test only |

### userSlice actions — `userActions`
`setUsername`, `setUserId`, `setAccessToken`, `setLoginSuccess`, `setIsLoading`, `resetUser`

### postSlice async thunks
- `getPostList` — fetches `API.POST.GET_LIST` via `postService.getList<IPost>`.
- `getPostDetails(id)` — fetches `API.POST.GET_DETAILS/{id}` via `postService.getSingle<IPostDetails>`.

## Hooks — `src/hooks/`

| Hook | File | Purpose |
|---|---|---|
| `useLoginUser()` | `useUser.tsx` | Login flow: calls `userService.login`, dispatches to `userSlice`, navigates to HOME |
| `useLogoutUser()` | `useUser.tsx` | Logout flow: calls `userService.logout`, resets store, clears token, redirects |
| `useMobile()` | `use-mobile.ts` | Returns `true` when viewport is mobile width |

- Business logic for auth should live in `useLoginUser`/`useLogoutUser`, not in view components.

## Utilities — `src/utils/`

| File | Exports |
|---|---|
| `redirectHelper.ts` | `RedirectLogin()`, `RedirectLoginAndResetParam()`, `RemoveToken()` |
| `stringHelper.tsx` | String manipulation helpers |

## Data
- `src/services/` — API service modules extending `BaseService`.
  - `userService.ts` — `login()`, `logout()`
  - `postService.ts` — inherits `BaseService` CRUD methods
- `src/data/mock/` — Static mock data for UI development.
  - `friends.ts`, `home.ts`, `groupsMock.ts`, `groupPostsMock.ts`, `messengerData.ts`, `photosMock.ts`, `postsMock.ts`, `profileMock.ts`
- Mock data approach: define types first in `src/types/`, then export typed arrays/objects in `src/data/mock/`.

## Env / External Services
- Vite env vars declared in `.env`. All must be prefixed `VITE_`.

| Variable | Purpose |
|---|---|
| `VITE_SERVER_API` | Backend base URL (default: `http://localhost:8080`) |
| `VITE_SUPABASE_URL` / `VITE_SUPABASE_KEY` | Supabase (optional) |
| `VITE_LINK_PREVIEW_API_KEY` / `VITE_LINK_PREVIEW_ENDPOINT` | Link preview API |
| `VITE_FIREBASE_*` | Firebase config (auth/storage) |

- Firebase config in `src/plugins/firebase/`.
- Vite proxy for `/api` and `/users` is defined but **commented out**; direct requests go to `VITE_SERVER_API`.

## Language
- UI text is in Vietnamese.
