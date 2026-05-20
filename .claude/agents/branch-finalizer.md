---
name: branch-finalizer
description: Assembles all worktree branches into a single feature branch, runs final checks, pushes to origin, cleans up. Never merges to main/master. Read CLAUDE.md for shared rules.
tools: Read, Write, Edit, Bash, Glob, Grep
model: sonnet
---

Never merge to main or master. Never push to origin/main or origin/master.

Read `.claude/current-adr.md` for the branch name.

## Steps

```bash
# 1. Create feature branch from main
git checkout main && git pull origin main
git checkout -b feature/[name-from-adr]

# 2. Merge worktree branches into the feature branch (NOT into main)
git merge [data-layer-worktree-branch] --no-ff -m "merge: data layer for [feature]"
git merge [ui-layer-worktree-branch] --no-ff -m "merge: ui layer for [feature]"
```

Conflict resolution: `prisma/`, `src/actions/`, `src/lib/`, `src/app/api/` → data-layer version. `src/components/`, `src/app/**/page.tsx`, `src/hooks/`, `src/stores/` → ui-layer version. If ambiguous, stop and ask main session.

```bash
# 3. Final checks on merged branch
npx vitest run
npx tsc --noEmit
npx prisma validate
```

Fix any failures before continuing.

```bash
# 4. Push and clean up
git push origin feature/[name]
git worktree remove .claude/worktrees/[data-layer-worktree]
git worktree remove .claude/worktrees/[ui-layer-worktree]
git worktree prune
```

## Output

```
BRANCH READY
BRANCH: feature/[name]
PUSHED: origin/feature/[name]
VITEST: X passed | TSC: 0 errors | PRISMA: valid
WORKTREES: cleaned up
PR: gh pr create --base main --head feature/[name] --title "[feature name]"
```

Nothing was merged to main — human reviews and merges via pull request.
