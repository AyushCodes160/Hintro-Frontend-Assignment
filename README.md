# Hintro Dashboard

A mock dashboard for Hintro built against the provided mock API and Figma design. Switch between two mock users to compare the empty state and the populated state side-by-side, submit feedback that persists in `localStorage`, and explore stats and recent calls pulled live from the backend.

**Live demo:** http://localhost:8080 (after running `npm run dev`)

---

## Tech stack

| Layer | Choice |
|---|---|
| Framework | [TanStack Start](https://tanstack.com/start) + React 19 + TypeScript |
| Routing | TanStack Router (file-based, `src/routes/`) |
| Data fetching | TanStack Query (`useQuery` per endpoint, keyed by user id) |
| Styling | Tailwind CSS v4 with `@theme` + OKLCH CSS variables |
| UI primitives | Radix UI via shadcn/ui (`src/components/ui/`) |
| Icons | lucide-react |
| Toasts | sonner |
| Build | Vite 7 (with Cloudflare adapter wired up for optional deploy) |

---

## Setup & run

Requires **Node.js 20+** and **npm**.

```bash
# 1. install deps
npm install

# 2. run the dev server (hot reload)
npm run dev
# → http://localhost:8080

# 3. production build
npm run build

# 4. preview the production build locally
npm run preview

# 5. lint / format
npm run lint
npm run format
```

The mock backend lives at `https://mock-backend-hintro.vercel.app` and is hard-coded in [`src/lib/api.ts`](src/lib/api.ts). No `.env` is required.

---

## Two-user demo

Pick a user from the avatar menu in the top-right corner. The choice is persisted to `localStorage` so it survives reload.

| User | Header `x-user-id` | What you see |
|---|---|---|
| `u1` — empty state | `u1` | Stats all zero, "No Recent Calls" illustration, no subscription |
| `u2` — populated state | `u2` | Random stats and call history each request |

Every API query is keyed by the active user id, so switching triggers an automatic refetch.

---

## Features

- **Live API integration** — `GET /api/auth/profile`, `GET /api/call-sessions/stats`, `GET /api/call-sessions` are all wired up with `x-user-id` header injection.
- **Stat cards** — Total Sessions, Average Duration, AI Used, Last Session. Durations are formatted from seconds to the Figma convention (`14m 22sec`, `2h 30m`, `45sec`). Last session is shown as a relative time (`5 days ago`).
- **Recent calls** — grouped by day with headings like *April 29th*, each row showing the call title, a decorative waveform, and the start time.
- **Empty states** — `u1` shows a dashed-border card with a "Start a Call" CTA when there's no history.
- **Loading skeletons** — placeholders show while history is loading.
- **API error toast** — if any query fails, the user gets a toast instead of a silent dash.
- **Sidebar feedback flow** — 2-step dialog (rate 1–5 → category + message). Submissions are stored in `localStorage` under `hintro:feedback`.
- **Feedback history dialog** — a separate sidebar item lists every feedback entry stored locally.
- **Logout confirmation** — opens a dialog from the avatar menu; logout is mocked with a toast.
- **Locked nav items** — Call Insights, Knowledge Base, Prompts, Boxy Controls show a "available on paid plan" toast when clicked.
- **Responsive layout** — sidebar slides out on mobile with a backdrop overlay; stat grid collapses from 4 → 2 → 1 columns.
- **Themeable** — every color is a CSS custom property in OKLCH (`src/styles.css`). No hex literals in components.

---

## Project structure

```
src/
├── components/
│   ├── ui/                       # shadcn/ui primitives (untouched)
│   ├── AppSidebar.tsx            # nav + feedback triggers
│   ├── FeedbackDialog.tsx        # 2-step feedback form
│   ├── FeedbackHistoryDialog.tsx # localStorage viewer
│   ├── LogoutDialog.tsx
│   ├── RecentCalls.tsx           # date-grouped call list + empty state
│   ├── StatCard.tsx
│   └── UserAvatarMenu.tsx        # u1/u2 switcher + logout
├── lib/
│   ├── api.ts                    # fetch wrapper + types
│   ├── feedback-store.ts         # localStorage helpers
│   ├── format.ts                 # duration / date / time formatters
│   └── user-context.tsx          # active-user React context
├── routes/
│   ├── __root.tsx                # providers (QueryClient, UserProvider, Toaster)
│   └── index.tsx                 # Dashboard page
└── styles.css                    # Tailwind v4 + CSS variables
```

---

## Conventions

- **No hardcoded colors.** All component styles reference CSS variables (`bg-card`, `text-foreground`, `var(--stat-pink-bg)`, etc.) defined once in `src/styles.css`.
- **API base + user id are centralized.** A single `request()` helper injects the `x-user-id` header; routes call `api.profile(userId)` etc.
- **All API data is consumed from queries.** Nothing is hardcoded — empty states are driven by what the API actually returns.
- **Time formatting lives in `src/lib/format.ts`.** The API gives durations in seconds and timestamps in ISO 8601; the dashboard formats them per the Figma copy (`14m 22sec`, `April 29th`, `11:00 am`, `5 days ago`).
- **Path alias `@/`** resolves to `src/` (`vite-tsconfig-paths`).

---

## localStorage keys

| Key | Purpose |
|---|---|
| `hintro:user-id` | Active mock user (`u1` or `u2`) |
| `hintro:feedback` | Array of feedback entries (`{ id, rating, category, message, createdAt }`) |

Both are written and read by code in `src/lib/`.

---

## Assumptions

- The Figma references icons + copy that match the Hintro mock — exact pixel parity wasn't possible without Figma access during development, so the focus has been on layout fidelity, the correct API wiring, and the empty/filled state contract.
- The decorative waveform on each call row is a static SVG; the API doesn't expose waveform data.
- Locked sidebar items (Call Insights, Knowledge Base, Prompts, Boxy Controls) are placeholders in the design and only show a toast — no routes are scaffolded for them.
- The "Start New Call" / "Watch Tutorial" / "Upgrade" / kebab menu actions are out of scope for the mock and show a toast on click.
- The mock backend may go cold between requests; the error toast covers that case.

---

## Scripts reference

| Script | What it does |
|---|---|
| `npm run dev` | Start Vite dev server on `:8080` |
| `npm run build` | Production build (client + SSR bundles) |
| `npm run build:dev` | Build in development mode (source maps, no minify) |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint |
| `npm run format` | Run Prettier across the repo |
