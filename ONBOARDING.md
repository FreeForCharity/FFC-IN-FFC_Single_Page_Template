# Onboarding

From fresh clone to first merged PR. If you only have 10 minutes, follow §1–4
and skip the rest until you need it.

## 1. Prerequisites

- Node.js 20+ (check: `node --version`)
- npm 10+
- Git
- A GitHub account with access to this repo

Optional but recommended:

- [`gh` CLI](https://cli.github.com/) — used by several scripts
- VS Code — `.vscode/extensions.json` lists the editor extensions that match
  this repo's tooling

## 2. Clone and install

```bash
git clone https://github.com/freeforcharity/ffc-in-ffc_single_page_template.git
cd FFC-IN-FFC_Single_Page_Template
npm install
```

First install takes 60–90 seconds — don't cancel.

## 3. Run it locally

```bash
npm run dev        # http://localhost:3000
npm run build      # static export to ./out
npm run preview    # serve ./out at http://localhost:3000
```

If `npm run build` fails on a fresh clone, that's a bug — open an issue.

## 4. Make a change, open a PR

```bash
git checkout -b feat/<your-slug>
# ... edit ...
npm run format
npm run lint
npm test
git commit -m "feat: <conventional commit subject>"
git push -u origin feat/<your-slug>
gh pr create --fill
```

The PR template will be auto-populated. CI runs automatically:

- Format check
- Lint
- Unit + accessibility tests (Jest + jest-axe)
- Static build
- E2E tests (Playwright)
- CodeQL
- Lighthouse

When the PR is **ready for review**, `auto-review-on-ready.yml` automatically
runs the Copilot review cycle.

## 5. Test plans (required in PR body)

Every PR description must include a `## Test plan` section listing the manual
verification steps the reviewer should perform. The PR template has the
section pre-filled.

## 6. Where to find things

| Topic                                  | Doc                                                   |
|----------------------------------------|-------------------------------------------------------|
| Architecture, conventions              | [`AGENTS.md`](./AGENTS.md)                            |
| Claude-specific instructions           | [`CLAUDE.md`](./CLAUDE.md)                            |
| Copilot agent setup                    | [`GITHUB_COPILOT_AGENT_SETUP.md`](./GITHUB_COPILOT_AGENT_SETUP.md) |
| Cloudflare DNS / Pages                 | [`CLOUDFLARE_SETUP.md`](./CLOUDFLARE_SETUP.md)        |
| Release process                        | [`RELEASING.md`](./RELEASING.md)                      |
| MCP servers                            | [`MCP_SERVERS.md`](./MCP_SERVERS.md)                  |
| All docs, indexed                      | [`DOCUMENTATION_INDEX.md`](./DOCUMENTATION_INDEX.md)  |
| Security                               | [`SECURITY.md`](./SECURITY.md), [`THREAT-MODEL.md`](./THREAT-MODEL.md) |
| Governance                             | [`GOVERNANCE.md`](./GOVERNANCE.md)                    |

## 7. Common first issues

Look for the [`good first issue`](https://github.com/freeforcharity/ffc-in-ffc_single_page_template/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22)
label.

## 8. Getting help

- File a question issue using the question template
- See [`SUPPORT.md`](./SUPPORT.md) for non-bug channels
- Security concerns: [`SECURITY.md`](./SECURITY.md)

## 9. What good looks like

You'll know your contribution is on-track when:

- CI is green
- The Copilot review cycle has nothing new to flag
- Your PR body includes a Test plan and links the issue with `Fixes #N`
- Commit subjects follow Conventional Commits

Welcome.
