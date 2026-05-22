# AGENTS

## Commands
- `npm run dev` - Vite dev server
- `npm run build` - `tsc -b` then `vite build`
- `npm run lint` - ESLint flat config
- `npm run preview` - Preview production build

## Entry + App Wiring
- Vite entrypoint is `src/main.tsx`; Redux store is wired there via `Provider`.
- `src/App.tsx` renders `<RouterProvider>`.
- Absolute import alias `@` maps to `src/` (Vite + TS config).

## UI / Styling
- Tailwind v4 via `@tailwindcss/vite`; no separate tailwind.config file.
- shadcn/ui configured in `components.json` (style `base-nova`, base color `neutral`, CSS at `src/index.css`).
- Shared className helper is `src/lib/utils.ts` (clsx + tailwind-merge).

## Component / View / Router Organization

### Directory rules
| Directory | Purpose | Examples |
|---|---|---|
| `src/views/<feature>/` | Route-level page components (one file per route path, default export) | `Login.tsx`, `Home.tsx` |
| `src/views/<feature>/partials/` | Sub-route (child route) components only used inside that feature | `FriendsRequests.tsx`, `FriendsSuggest.tsx` |
| `src/views/layouts/` | Layout wrappers using `<Outlet />` | `Default.tsx`, `MainLayout.tsx` |
| `src/components/ui/` | shadcn/ui primitives — never edit manually | `button.tsx`, `dialog.tsx` |
| `src/components/<feature>/` | Reusable feature-scoped shared components | `friends/FriendsSidebar.tsx` |
| `src/components/` (root) | Truly global shared components | `Header.tsx`, `AutoComplete.tsx` |
| `src/plugins/routers/` | React Router v7 config (`createBrowserRouter`) | `index.tsx` |

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
- Current org: `authRoutes` (Login, Register) sits under `Default` layout; `mainRoutes` (Home, Friends, Profile) and `messengerRoutes` (Messenger) sit under `MainLayout` (which has Header).

### Naming + export conventions
- All component files use PascalCase filenames.
- All components use `export default function`.
- `.tsx` extension for files with JSX; `.ts` for plain TypeScript.

## State Management
- Redux Toolkit with slices in `src/stores/`.
- Use typed `useSelector`/`useDispatch` from `react-redux` directly (no custom wrappers yet).
- Types `RootState` and `AppDispatch` exported from `src/stores/store.ts`.

## Data
- `src/services/` - API service modules (currently just `loginService.ts`).
- `src/data/mock/` - Static mock data for UI development (no API integration yet).
- `src/types/` - TypeScript type definitions (standalone files like `Friend.ts`, or subdirs `base/`, `interfaces/`).
- Mock data approach: exemplar is `friends.ts` and `home.ts` — define types first in `src/types/`, then export typed arrays/objects in `src/data/mock/`.

## Env / External Services
- Vite env vars are declared in `.env` (Supabase, Link Preview API, Firebase); expect missing values locally.
- Firebase config in `src/plugins/firebase/`.

## Language
- UI text is in Vietnamese.
