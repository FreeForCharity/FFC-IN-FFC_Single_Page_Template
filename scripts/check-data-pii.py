#!/usr/bin/env python3
"""
Generic PII scanner. Walks configured directories and fails (exit 1) if any
file contains a string matching a high-confidence PII pattern.

Patterns: email, US phone, SSN-shape.

Usage:
    python3 scripts/check-data-pii.py [paths...]

Default scan roots: content/ data/ public/ (only those that exist).

Skip via inline comment marker `pii-allow` on the same line.

Closes #230.
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

PATTERNS = {
    "email":      re.compile(r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b"),
    "us_phone":   re.compile(r"\b(?:\+?1[ .-]?)?\(?[2-9]\d{2}\)?[ .-]?\d{3}[ .-]?\d{4}\b"),
    "ssn_shape":  re.compile(r"\b\d{3}-\d{2}-\d{4}\b"),
}

# Trusted addresses (org-public emails) that should never trip the scan.
ALLOW_EMAILS = {
    "support@freeforcharity.org",
    "info@freeforcharity.org",
    "security@freeforcharity.org",
}

SKIP_DIRS = {".git", "node_modules", ".next", "out", "coverage", "playwright-report"}
SKIP_EXT  = {".png", ".jpg", ".jpeg", ".gif", ".webp", ".avif", ".ico", ".pdf",
             ".woff", ".woff2", ".ttf", ".otf", ".mp4", ".webm", ".zip", ".gz"}

def iter_files(roots):
    for root in roots:
        if not root.exists():
            continue
        for p in root.rglob("*"):
            if not p.is_file():
                continue
            if any(part in SKIP_DIRS for part in p.parts):
                continue
            if p.suffix.lower() in SKIP_EXT:
                continue
            yield p

def scan(p: Path):
    hits = []
    try:
        text = p.read_text(encoding="utf-8", errors="ignore")
    except Exception:
        return hits
    for i, line in enumerate(text.splitlines(), 1):
        if "pii-allow" in line:
            continue
        for name, pat in PATTERNS.items():
            for m in pat.finditer(line):
                if name == "email" and m.group(0).lower() in ALLOW_EMAILS:
                    continue
                hits.append((i, name, m.group(0)))
    return hits

def main(argv):
    roots = [Path(a) for a in argv[1:]] or [Path("content"), Path("data"), Path("public")]
    found = 0
    for f in iter_files(roots):
        hits = scan(f)
        if hits:
            for line, name, match in hits:
                print(f"{f}:{line}: {name}: {match}")
            found += len(hits)
    if found:
        print(f"\nPII scan FAILED — {found} match(es). Add 'pii-allow' on the line to whitelist, or remove the data.", file=sys.stderr)
        return 1
    print("PII scan passed.")
    return 0

if __name__ == "__main__":
    sys.exit(main(sys.argv))
