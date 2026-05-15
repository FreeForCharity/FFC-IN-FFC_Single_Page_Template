# Releasing

How to cut a release for an FFC site built from this template.

## Cadence

There is no fixed release cadence. Cut a release when:

- A user-visible feature lands
- A user-visible bug is fixed
- A dependency security advisory is patched

For pure refactors or doc edits, do not cut a release — just merge to `main`.

## Versioning

[Semantic Versioning 2.0](https://semver.org/). For an FFC charity site, the
public surface is the rendered site itself, so:

- **MAJOR** — Visual redesign, navigation overhaul, or any change that would
  break bookmarks / external links (path changes).
- **MINOR** — A new page, section, or feature visible to site visitors.
- **PATCH** — Bug fix, typo, content update, dependency bump that does not
  change the site's behavior.

## Steps

1. Confirm `main` is green:
   ```bash
   gh run list --branch main --limit 5
   ```
2. Generate release notes:
   ```bash
   npm run release:notes
   # Or pin the range explicitly:
   npm run release:notes -- --from v0.2.0 --to HEAD --out /tmp/notes.md
   ```
3. Tag locally:
   ```bash
   git tag -a v0.3.0 -m "v0.3.0"
   git push origin v0.3.0
   ```
4. Create the GitHub release using the [`RELEASE_TEMPLATE.md`](./.github/RELEASE_TEMPLATE.md)
   structure and paste in the generated notes:
   ```bash
   gh release create v0.3.0 --title "v0.3.0" --notes-file /tmp/notes.md
   ```
5. Verify the deploy workflow runs cleanly against `main` and the new tag.
6. Update [`CHANGELOG.md`](./CHANGELOG.md) with a copy of the notes.

## Pre-release / RC versions

Use `v0.3.0-rc.1` style tags for rehearsal releases. These should NOT trigger
production-facing announcements (e.g., monthly newsletters).

## Hotfix flow

For an urgent fix on a released version:

1. Branch from the tag: `git checkout -b hotfix/<slug> v0.3.0`.
2. Land the fix via normal PR flow (target `main`).
3. After merge, tag the new commit as `v0.3.1`.

## What lives in the release notes

The `generate-release-notes.ts` script groups commits by Conventional Commits
type into these sections:

- Features
- Bug fixes
- Performance
- Refactors
- Tests
- Docs
- Build / CI
- Style
- Other (anything that does not match a known type)

If a commit subject is uninformative ("misc fixes"), edit the generated notes
before publishing — the script doesn't reach back into the commits.

## Out of scope

- Auto-publishing releases on tag push — not enabled by default. Sites can
  opt in via a `release.yml` workflow if desired.
- npm publishing — this template is not published to npm.

See also: [`RELEASE_TEMPLATE.md`](./.github/RELEASE_TEMPLATE.md).
