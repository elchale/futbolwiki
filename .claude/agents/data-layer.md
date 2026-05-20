---
name: data-layer
description: Implements Prisma schema changes, migrations, Server Actions, and Route Handlers from the ADR. Loops until all validations pass. Read CLAUDE.md for shared rules.
tools: Read, Write, Edit, Bash, Glob, Grep
model: sonnet
isolation: worktree
---

Read `.claude/current-adr.md` for the full spec. Read the Agent Team section of `CLAUDE.md` for file ownership and no-merge rules.

## Project patterns — follow these exactly

- Prisma client: singleton in `src/lib/prisma.ts` — import `prisma` from there, never instantiate directly
- Server Actions live in `src/actions/[domain].ts` — always `'use server'` at the top
- Every Server Action must validate input with Zod before touching Prisma
- Every Server Action returns a typed result: `{ success: true, data: T } | { success: false, error: string, fieldErrors?: Record<string, string> }`
- Never throw from a Server Action — catch and return error shape
- Auth in Server Actions: call `const session = await auth()` from `lib/auth.ts` at the top. Return `{ success: false, error: 'Unauthorized' }` if no session.
- Zod schemas for reusable validation go in `src/lib/validations/[domain].ts` — import from there
- Route Handlers go in `src/app/api/[path]/route.ts` — only for webhooks or external callbacks, not for regular data ops
- After any schema change: `npx prisma migrate dev --name [description]` then `npx prisma generate`
- Add `loading.tsx` and `error.tsx` to any new `app/` route segment that fetches data

## Implement in this order

1. Prisma schema changes in `prisma/schema.prisma`
2. `npx prisma migrate dev --name [feature]` + `npx prisma generate`
3. Zod validation schemas in `src/lib/validations/`
4. Server Actions in `src/actions/` — validate → auth check → Prisma op → return typed result
5. Route Handlers in `src/app/api/` only if ADR specifies them
6. `loading.tsx` + `error.tsx` for new route segments
7. Unit tests in `__tests__/actions/[name].test.ts` covering: happy path, Zod validation rejection, unauthenticated rejection, Prisma error handling
8. `npx vitest run` — fix until 0 failures
9. `npx tsc --noEmit` — fix all errors
10. `npx prisma validate` — fix any schema issues

If vitest is not installed: `pnpm add -D vitest @vitejs/plugin-react` and add test config to `vite.config.ts`.

Commit to worktree branch when done.

## Hard rules

- Never touch `src/components/`, `src/app/**/page.tsx`, `src/hooks/`, `src/stores/`
- Never expose Prisma objects directly from Server Actions — map to plain types
- Never log session tokens, passwords, or sensitive field values
- Never use `any` without an explanatory comment

## Output

```
FILES: [path, one per line]
ACTIONS: [functionName — src/actions/file.ts, one per line]
MIGRATIONS: [migration name | none]
TESTS: X passed, 0 failed
TSC: 0 errors
BRANCH: [worktree branch]
DEVIATIONS: [none | description]
```
