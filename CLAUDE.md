# Agent Team

## ⚠️ Always delegate through the pipeline. Never implement significant code in the main session.

## Shared Rules — single source of truth, not repeated in agent files

**No merging to main/master — ever.**
No agent may run `git merge main`, `git merge master`, or `git push origin main/master`.
All work ends in a feature branch. Human merges via PR.

**Definition of Done:**
- `npx vitest run` exits 0
- `npx tsc --noEmit` exits 0
- `npx prisma validate` exits 0
- `ux-enforcer` outputs `UX APPROVED`
- `e2e-tester` outputs `ALL PATHS VERIFIED`
- `code-reviewer` outputs `APPROVED`
- `branch-finalizer` outputs `BRANCH READY`

**File ownership:**
- Data layer owns: `prisma/`, `src/actions/`, `src/lib/`, `src/types/`, `src/app/api/`
- UI layer owns: `src/components/`, `src/app/**/page.tsx`, `src/app/**/layout.tsx`, `src/hooks/`, `src/stores/`
- Shared: `src/app/**/loading.tsx`, `src/app/**/error.tsx`, `src/app/**/not-found.tsx`
- Agents coordinate on shared files — data layer writes structure, UI layer writes markup

**Branch naming:** `feature/[short-description]`

**ADR file:** `architect-review` writes the ADR to `.claude/current-adr.md`.
Every subsequent agent reads from that file. Never re-pass the full spec in agent prompts.

**Invocation protocol:** Every subagent prompt must include:
- Path to ADR: `.claude/current-adr.md`
- Exact file paths to read/write
- Success criteria

## Pipeline

1. `architect-review` → writes ADR to `.claude/current-adr.md`. Present to human, wait for approval.
2. `data-layer` + `ui-layer` → parallel, worktree-isolated
3. `test-runner` → loops until vitest + tsc + prisma validate all green
4. `ux-enforcer` → fixes UX and design issues directly in code
5. `e2e-tester` → Playwright, all viewports
6. `code-reviewer` → final gate
7. `branch-finalizer` → assembles branch, pushes, cleans up

**Do not start step 2 until the human approves the ADR.**

## Stack

- **Framework:** Next.js 15 App Router — Server Components by default, Client Components only when interactivity requires it
- **Database:** PostgreSQL via Prisma ORM
- **Auth:** NextAuth.js v5 (Auth.js) — session via JWT or database sessions
- **Styling:** Tailwind CSS v4 + shadcn/ui component library
- **Icons:** Lucide React — the ONLY permitted icon library. No ASCII characters as icons. No emoji as icons. No other icon libraries.
- **Toasts:** Sonner — the ONLY permitted toast library
- **Forms:** React Hook Form + Zod — always together, never separately
- **Animation:** Framer Motion — for page transitions, micro-interactions, and meaningful motion
- **Client state:** Zustand
- **Server state / data fetching:** TanStack Query (client) + Next.js server components (server)
- **Testing:** Vitest + Testing Library (unit/integration), Playwright (E2E)
- **Package manager:** pnpm

## Design Standards (Non-Negotiable)

These standards define what "world-class" means for this project. Every component must meet them.

### Icon rule
Icons MUST come from `lucide-react`. Import named exports: `import { ArrowRight, Loader2 } from 'lucide-react'`.
Using ASCII (→, ×, ✓), emoji (🔔, ✅), or any other icon source is a build-blocking violation.

### Typography
- Use a distinctive, intentional font pairing — not Inter, not Roboto, not system-ui defaults
- Display/heading font should have character and personality
- Body font should be highly legible at small sizes
- Load via `next/font` — never via external CDN links
- Type scale must be defined in `tailwind.config.ts` as design tokens

### Color system
- Define a full semantic color system in `tailwind.config.ts`:
  - Surface colors (background, card, overlay)
  - Brand colors (primary, primary-hover, primary-foreground)
  - Status colors (success, warning, error, info) + their foreground pairs
  - Border and muted variants
- Dark mode via `next-themes` with `class` strategy — every component must look correct in both modes
- Never use raw Tailwind color classes like `bg-blue-500` — always use semantic tokens

### Spacing and layout
- Define a spacing scale in `tailwind.config.ts` — use it consistently
- No magic numbers — every margin, padding, gap uses the scale
- Generous whitespace — cramped UIs feel cheap
- Max content width tokens: `max-w-prose` for text, `max-w-screen-xl` for layouts
- Responsive at 375px / 768px / 1024px / 1280px / 1536px — mobile-first

### Motion
- Framer Motion for all meaningful transitions
- Page entry animations: staggered fade-up on content, not instant render
- Micro-interactions on all interactive elements (hover scale, press feedback)
- Loading states use skeleton components (`shadcn/ui` Skeleton) — never raw spinners for content areas
- Loader2 from lucide-react (with `animate-spin`) for button loading states only
- Respect `prefers-reduced-motion` — wrap motion in `useReducedMotion` check

### Component quality
- Every interactive element has hover, focus, active, and disabled states
- Focus rings must be visible — never `outline-none` without a custom focus style
- All components keyboard-navigable
- ARIA labels on all icon-only buttons
- `shadcn/ui` primitives used as the base — never reinvent what shadcn already provides

### Empty states
- Never blank space — every empty list/page has an empty state component
- Empty states include: an icon (from lucide-react), a headline, subtext explaining why it's empty, and a CTA button
- Empty states should feel designed, not like an afterthought

### Error states
- Never raw error strings shown to the user — all errors are human-readable
- 400: inline field-level errors from Zod validation, displayed under each field
- 401: redirect to login page
- 403: dedicated permission-denied UI with explanation
- 404: custom not-found page with navigation back
- 500: "Something went wrong" with a retry button and error boundary
- Network offline: toast banner, not silent failure

## UX Standards (enforced by `ux-enforcer`)

**Async ops:** Every mutation needs loading state (Loader2 on button) + success toast (Sonner, green, 3s) + error toast (Sonner, red, 8s with reason). Never silent after user action.

**Forms:** React Hook Form + Zod always. Inline field errors under each input. Submit disabled during flight. Fields preserved on error, cleared on success. Required fields marked with `*`.

**Navigation:** Clear back/exit on every page and modal. Post-create → detail or list page. Post-delete → list page. No dead-ends. Protected routes redirect to login, never crash.

**Optimistic updates:** Mutations that affect lists (create, delete, reorder) should use optimistic updates via TanStack Query's `onMutate` — don't wait for the server to update the UI.
