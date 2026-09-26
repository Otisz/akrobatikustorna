# WordPress lives on an orphan branch of the Laravel repo

This WordPress site is the `wordpress` orphan branch of the `akrobatikustorna` repository, which holds the
Laravel site it replaces on `main`. A separate repository was the obvious alternative and was nearly chosen,
because Bedrock and Laravel collide head-on at the project root: both own `composer.json`, `.env`, `config/`
and a webroot, with the same names and entirely different meanings. An orphan branch avoids that collision
completely — it shares no history and no files — while keeping both sites in one place, and Forge is happy
with it because it deploys one branch per site.

## Consequences

- The two branches are checked out simultaneously as **git worktrees**, not switched in place:
  `git worktree add --orphan -b wordpress ~/Projects/base`. Switching branches in a single checkout would
  replace the entire working tree each time.
- Diffs and merges between `wordpress` and `main` are meaningless by design. Never merge them.
- The `wordpress` branch inherits nothing, so it needs its own `.gitignore` and its own
  `.github/workflows`; the Laravel lint and test jobs on `main` do not apply here.
