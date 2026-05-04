# AGENTS

## Commands
- `npm run dev` - Vite dev server
- `npm run build` - `tsc -b` then `vite build`
- `npm run lint` - ESLint flat config
- `npm run preview` - Preview production build

## Entry + App Wiring
- Vite entrypoint is `src/main.tsx`; Redux store is wired there via `Provider`.
- Absolute import alias `@` maps to `src/` (Vite + TS config).

## UI / Styling
- Tailwind v4 is wired through `@tailwindcss/vite`; no separate tailwind.config file.
- shadcn/ui is configured by `components.json` (style `base-sera`, base color `taupe`, CSS at `src/index.css`).
- Shared className helper is `src/lib/utils.ts` (clsx + tailwind-merge).

## Env / External Services
- Vite env vars are declared in `.env` (Supabase, Link Preview API, Firebase); expect missing values locally.
