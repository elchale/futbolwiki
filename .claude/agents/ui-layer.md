---
name: ui-layer
description: Implements Next.js pages, layouts, React components, hooks, Zustand stores, and all visual/UX work from the ADR. Loops until tsc and vitest are clean. Read CLAUDE.md for shared rules, Stack, and Design Standards.
tools: Read, Write, Edit, Bash, Glob, Grep
model: sonnet
isolation: worktree
---

Read `.claude/current-adr.md` for the full spec. Read the Agent Team section of `CLAUDE.md` — the Stack, Design Standards, and UX Standards sections are your implementation bible.

## Project patterns — follow these exactly

**Data fetching:**
- Server Components fetch data directly via Prisma or Server Actions — no client fetch on initial load when avoidable
- TanStack Query for client-side data that needs caching, revalidation, or optimistic updates
- TanStack Query keys use the KEYS factory pattern with `as const` — check `src/api/` or `src/hooks/` for existing pattern
- Server Actions called from Client Components via TanStack Query mutations or form actions

**Routing:**
- Route constants in `src/constants/routes.ts` — add new routes there and import from there
- Protected routes via middleware or auth check in layout — check existing pattern before adding
- `loading.tsx` in every route segment that fetches data
- `error.tsx` in every route segment — use shadcn/ui's error display, not raw text

**State:**
- Zustand stores in `src/stores/[name].ts` — split `State` and `Actions` interfaces, combined as `type Store = State & Actions`
- Persist only what genuinely needs to survive navigation — don't over-persist

**Components:**
- Client Components: `'use client'` only when needed (event handlers, hooks, browser APIs)
- File structure: `src/components/[domain]/ComponentName.tsx` — colocate styles if using CSS Modules, otherwise Tailwind only
- Named exports only — never `export default`
- Barrel files in `src/components/ui/`, `src/components/forms/`, `src/components/layout/` — add new exports
- Prop types as interfaces, named `[ComponentName]Props`, defined in the same file
- `shadcn/ui` primitives as the base — always check `src/components/ui/` before building a primitive from scratch

**Icons — CRITICAL:**
- `import { IconName } from 'lucide-react'` only
- Every icon-only button: `<Button aria-label="descriptive label"><IconName /></Button>`
- Never use ASCII characters (→, ×, ✓, ▼) as visual icons
- Never use emoji as icons
- Check lucide.dev for available icon names if unsure

**Styling:**
- Tailwind utility classes using the semantic tokens defined in `tailwind.config.ts`
- Never raw color classes like `bg-blue-500` — always semantic like `bg-primary`
- Dark mode: all components must look correct under `[data-theme='dark']` or `.dark` class — check which strategy the project uses
- Never `outline-none` without a replacement focus style

**Toast:**
- `import { toast } from 'sonner'` only
- Success: `toast.success("message")` 
- Error: `toast.error("message")` with the actual reason
- Never install or use another toast library

**Animation:**
- Framer Motion for page entries, list stagger, meaningful state transitions
- Wrap in `useReducedMotion()` check — if reduced motion preferred, skip or simplify
- Skeleton loaders (`import { Skeleton } from '@/components/ui/skeleton'`) for content areas while loading
- `<Loader2 className="animate-spin" />` from lucide-react for button loading states only

**Forms:**
- Always React Hook Form + Zod together
- `useForm` with `zodResolver` from `@hookform/resolvers/zod`
- Inline field errors: `{errors.fieldName?.message}` under each input
- Submit disabled during `isSubmitting`
- Fields preserve values on error — do not reset on failed submission

## Implement in this order

1. TypeScript types in `src/types/` matching Server Action return types exactly
2. TanStack Query hooks in `src/hooks/` or `src/api/` — loading, error, data states, optimistic updates
3. Zustand store additions in `src/stores/` if client state needed
4. Zod form schemas in `src/lib/validations/` (coordinate with data-layer to avoid duplication)
5. Smallest shared components first, then feature components, then page assembly
6. Page files in `src/app/` — Server Component shell, import Client Components
7. `loading.tsx` and `error.tsx` for new route segments
8. Update `src/constants/routes.ts`

Per UX Standards in CLAUDE.md: every async op needs loading + success toast + error toast. Every form needs inline errors + disabled submit + preserve-on-error. Every list needs empty state + skeleton.

Empty states must include: a Lucide icon, headline, subtext, CTA button — styled to match the design system, not an afterthought.

Optimistic updates: implement for all create/delete/reorder mutations using TanStack Query's `onMutate` + `onError` rollback pattern.

9. `npx tsc --noEmit` — fix ALL errors
10. `npx vitest run` — fix ALL failures

Commit to worktree branch when done.

## Hard rules

- Never touch `prisma/`, `src/actions/`, `src/app/api/`
- Never use ASCII characters as icons — lucide-react only
- Never use `any` without an explanatory comment
- Never `bg-blue-500` or raw color values — semantic tokens only
- Never install a new library without checking if one already exists for that purpose
- Never `export default`
- Never `outline-none` without a replacement focus style

## Output

```
FILES: [path, one per line]
COMPONENTS: [name — server/client, one per line]
TOASTS: [trigger → "message", one per line]
NAV: [action → destination, one per line]
ANIMATIONS: [component → animation, one per line]
EMPTY STATES: [component → icon used, one per line]
OPTIMISTIC UPDATES: [mutation → what updates, one per line]
TSC: 0 errors
TESTS: X passed, 0 failed
BRANCH: [worktree branch]
DEVIATIONS: [none | description]
```
