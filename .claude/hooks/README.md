# Claude Code Hooks

These [Claude Code hooks](https://docs.claude.com/en/docs/claude-code/hooks) add a
**real-time** quality-and-security layer to AI-assisted work on this template. The
repo already enforces standards at **commit time** (husky `pre-commit` / `commit-msg`)
and at **CI time** (GitHub Actions + `check-drift.mjs`). These hooks "shift left" those
same protections so a problem is caught the moment the AI tries to make it — before a
commit ever happens.

Hooks are wired in [`.claude/settings.json`](../settings.json) and run automatically
during any Claude Code session in this repo. Each script is plain Node (matching
`scripts/`) and **fails open** — if the hook itself errors it never blocks legitimate
work. The two `PreToolUse` guards read the tool-call JSON on stdin; `format-after-edit`
reads it too, while `session-start` takes no input and only prints context.

| Script                  | Event                                 | What it does                                                                                                                                                            |
| ----------------------- | ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `session-start.mjs`     | `SessionStart`                        | Installs deps if `node_modules` is missing (so lint/test/build can run in fresh web sessions) and primes the model with the pre-commit checklist and active guardrails. |
| `guard-bash.mjs`        | `PreToolUse(Bash)`                    | Blocks a small set of catastrophic / guardrail-bypassing commands.                                                                                                      |
| `guard-file-edit.mjs`   | `PreToolUse(Write\|Edit\|MultiEdit)`  | Blocks writing secret files and secret-looking content.                                                                                                                 |
| `format-after-edit.mjs` | `PostToolUse(Write\|Edit\|MultiEdit)` | Runs Prettier on the edited file so it already passes `format:check`.                                                                                                   |

## What `guard-bash.mjs` blocks

High-signal only — safe variants are intentionally allowed so the hook stays out of the way:

- `rm -rf` aimed at `/`, `~`, `$HOME`, `.`, or `*` (targeted deletes like `rm -rf out` are fine)
- `git commit --no-verify` (skipping the husky format/lint/drift + commitlint checks)
- Force-pushing `main`/`master` (feature-branch force-pushes are allowed)
- Piping a download straight into a shell — `curl … | sh`
- `chmod 777`
- `npm publish` (this template is `private`)

## What `guard-file-edit.mjs` blocks

- Writing secret-bearing files: `.env` (but **not** `.env.example` / `.sample` / `.template`),
  `*.pem`, `*.key`, `*.p12`, `*.pfx`, `credentials.json`, `secrets.json`, SSH private keys
- Writing content matching a known credential pattern (AWS / Google / GitHub / Slack tokens,
  private-key blocks). These regexes are kept in lockstep with `checkSecrets()` in
  `scripts/check-drift.mjs`.

## Testing a hook manually

The `PreToolUse` / `PostToolUse` hooks read a JSON tool call on stdin (`session-start`
takes no input). For example:

```bash
echo '{"tool_input":{"command":"rm -rf /"}}' | node .claude/hooks/guard-bash.mjs; echo "exit=$?"
echo '{"tool_input":{"file_path":".env"}}'   | node .claude/hooks/guard-file-edit.mjs; echo "exit=$?"
```

A blocked call exits `2` and prints the reason to stderr; an allowed call exits `0`.

## Known limitation: self-referential commands

`guard-bash.mjs` matches its patterns anywhere in the command string, so a
command that merely _mentions_ a blocked pattern is also blocked — e.g. a commit
message body or an `echo`/`cat` containing the text `chmod 777` or
`git commit --no-verify`. This is an intentional trade-off: precise shell parsing
would add bypass holes. When you hit it, put the text in a file and pass it by
path (e.g. `git commit -F message.txt`) so the command line stays clean.

## Disabling

Remove the relevant block from `.claude/settings.json` (or delete the `hooks` key entirely)
to turn these off. Child sites adopting this template inherit the hooks automatically.
