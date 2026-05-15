# Pull Request Protocol

Shared protocol consumed by Claude, GitHub Copilot, and Google Jules when
opening or maintaining a PR against an FFC charity site. Keep this short — the
agents read it on every PR; verbose prose burns context budget.

## Branch naming

| Agent     | Pattern                                |
|-----------|----------------------------------------|
| Claude    | `claude/<short-slug>`                  |
| Copilot   | `copilot/<short-slug>`                 |
| Jules     | `jules/issue-<N>-<short-slug>`         |
| Dependabot| auto                                   |

## Commit messages

[Conventional Commits](https://www.conventionalcommits.org/). Always one of:
`feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `test:`, `chore:`, `ci:`,
`build:`, `perf:`.

Subject ≤ 72 chars. Body explains *why*, not *what*. Wrap body at 100 chars.

## Required-before-PR-open checks

Each agent runs these locally before opening or updating a PR:

```bash
npm run format         # apply Prettier
npm run lint           # ESLint must pass
npm test               # Jest + jest-axe
npm run build          # static export must succeed
```

Optional but encouraged: `npm run test:e2e` for any UI change.

## Draft → ready transition

- Open as **draft** if the PR is still incomplete.
- Mark **ready for review** only when:
  - CI is green
  - You have updated the PR description with a Test Plan section
  - You have referenced the source issue with `Fixes #N` or `Refs #N`

When the PR is marked ready, the `auto-review-on-ready.yml` workflow
automatically dispatches the Copilot review cycle.

## Review cycle expectations

- **Copilot** runs first — up to 7 rounds via `copilot-review-cycle.yml`.
- **Jules** picks up issues labeled `jules`; opens its own PR.
- **Claude** orchestrates: assigns work, summarizes review threads via the
  `pr-manager` agent, requests human review only when Copilot has nothing
  new to flag.

## When to use which agent

| Task                             | Agent    |
|----------------------------------|----------|
| Workflow / data pipeline edits   | Copilot  |
| Frontend UI / visualization      | Jules    |
| Multi-file refactor / planning   | Claude   |
| Dependency updates (minor)       | Dependabot |

## Anti-patterns (do not do)

- Pushing directly to `main`.
- Bypassing pre-commit hooks (`--no-verify`).
- Adding `// eslint-disable-line` without a comment explaining why.
- Hard-coding secrets in PR bodies, commit messages, or test data.
- Renaming kebab-case routes to PascalCase or camelCase.
- Re-running CI to "see if it passes" without changing the code first.

## Out of scope

This document does not cover:

- Local dev environment setup (see `ONBOARDING.md`).
- Release cadence and tagging (see `RELEASING.md`).
- Per-agent setup (see `GITHUB_COPILOT_AGENT_SETUP.md`).
