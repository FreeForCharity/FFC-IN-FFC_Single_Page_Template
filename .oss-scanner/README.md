# `.oss-scanner/`: Anthropic OSS Scanner enrollment

[OSS Scanner](https://github.com/anthropics/oss-scanner) is Anthropic's free,
opt-in service that scans open-source projects for vulnerabilities with Claude
and emails reports to the maintainers. Tracking epic:
[FFC-Cloudflare-Automation#1582](https://github.com/FreeForCharity/FFC-Cloudflare-Automation/issues/1582).

| File              | Used by                                                                                                                    |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `Dockerfile`      | The scanner. It builds this image online (repo root as context, checkout at `/src`) and then audits it **with no network** |
| `threat_model.md` | The scanner. It reads this before it starts: attack surface, what matters, the severity rubric                             |
| `project.yaml`    | A staging copy of the enrollment file. It does nothing in this repo                                                        |

The scanner reads `Dockerfile` and `threat_model.md` from `main` on every scan,
so changing them here changes the next scan. No PR to Anthropic is needed.

## Keeping it working

[`.github/workflows/oss-scanner-image.yml`](../.github/workflows/oss-scanner-image.yml)
builds the image on every PR that could affect it. It then runs the unit tests
inside it with `--network none`, which is how the scanner runs its audit. If
that job is red, the scanner's build is broken too, and the only signal from
Anthropic would be an email to `primary_contact`.

To reproduce locally (needs Docker):

```bash
docker build -f .oss-scanner/Dockerfile -t ffc-scan .
docker run --rm --network none ffc-scan pnpm test
docker run --rm --network none ffc-scan pnpm run test:e2e
```

## Enrolling (core maintainer only)

1. Fork <https://github.com/anthropics/oss-scanner> and copy `project.yaml` to
   `projects/ffc-single-page-template/project.yaml`.
2. Run `pip install pyyaml && tools/validate.py`, then
   `tools/check ffc-single-page-template`.
3. Open the PR and complete its checklist. In the optional context section,
   explain that this is one of the two templates Free For Charity charity sites
   are provisioned from, so one defect is copied into many nonprofit sites. It
   also ingests untrusted calendar and Facebook event feeds at build time.

## When a report arrives

Reports are model-generated, private, and have no disclosure deadline. Triage
them in a **private** GitHub security advisory on this repo, never in a public
issue. Fix the issue here, then backport it to the `FFC-EX-*` sites built from
this template, because a template fix does not reach sites that already exist.
To pause reports, set `disabled: true` in the enrolled `project.yaml`. To
withdraw, remove the project directory upstream.
