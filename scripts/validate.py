#!/usr/bin/env python3
"""Structural checks for the web-compliance skill.

Catches the failure modes that matter for legally sensitive templates:
uncited requirements, stale review dates, and templates that ask for a
language but have nowhere to put it.

Usage:  python3 scripts/validate.py
Exit code 1 if any ERROR is found. Warnings do not fail the run.
"""
import datetime
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
SKILL = ROOT / "skills" / "web-compliance"
TEMPLATES = SKILL / "templates"
JURISDICTIONS = SKILL / "jurisdictions"
STALE_AFTER_DAYS = 365

errors: list[str] = []
warnings: list[str] = []


def err(msg: str) -> None:
    errors.append(msg)


def warn(msg: str) -> None:
    warnings.append(msg)


# ---------------------------------------------------------------- templates
def check_templates() -> None:
    files = sorted(TEMPLATES.glob("*.md"))
    if not files:
        err("no templates found in templates/")
        return

    for f in files:
        text = f.read_text(encoding="utf-8")
        rel = f.relative_to(ROOT)

        # The skill always asks for an output language, so every template
        # needs somewhere to put the answer.
        if "[LANGUAGE]" not in text:
            err(f"{rel}: no [LANGUAGE] placeholder — the language choice would be discarded")

        # Every template should give the user a way to check the output.
        if not re.search(r"##\s*.*Checklist", text):
            err(f"{rel}: no checklist section")

        # Unresolved placeholders should be bracketed consistently.
        for stray in re.findall(r"\{\{[^}]+\}\}|\$\{[^}]+\}", text):
            warn(f"{rel}: non-bracket placeholder {stray!r} — use [UPPER_SNAKE] instead")

        # Accessibility templates must not silently target the older standard.
        if "accessibility" in f.name or "wcag" in text.lower():
            if "WCAG 2.0" in text and "WCAG 2.1" not in text:
                warn(
                    f"{rel}: mentions WCAG 2.0 but not 2.1 — the EAA requires 2.1 AA, "
                    "so EU-facing sites need the higher bar"
                )


# ----------------------------------------------------------- jurisdictions
def parse_scalar(line: str) -> tuple[str, str] | None:
    """Parse a top-level `key: value` pair, stripping any trailing comment."""
    m = re.match(r"^([a-z_]+):\s*(.*)$", line)
    if not m:
        return None
    value = re.sub(r"\s+#.*$", "", m.group(2)).strip()
    return m.group(1), value


def check_jurisdictions() -> None:
    files = sorted(JURISDICTIONS.glob("*.yaml"))
    if not files:
        err("no jurisdiction packs found in jurisdictions/")
        return

    today = datetime.date.today()
    for f in files:
        text = f.read_text(encoding="utf-8")
        rel = f.relative_to(ROOT)
        top = {}
        for line in text.splitlines():
            kv = parse_scalar(line)
            if kv:
                top.setdefault(kv[0], kv[1])

        for key in ("jurisdiction", "name", "last_reviewed", "consent_model"):
            if key not in top:
                err(f"{rel}: missing required key '{key}'")

        # Stale legal content is the main risk in a repo like this.
        raw = top.get("last_reviewed", "")
        if raw:
            try:
                reviewed = datetime.date.fromisoformat(raw)
                age = (today - reviewed).days
                if age > STALE_AFTER_DAYS:
                    warn(f"{rel}: last_reviewed is {age} days old — re-check the citations")
            except ValueError:
                err(f"{rel}: last_reviewed {raw!r} is not an ISO date (YYYY-MM-DD)")

        cm = top.get("consent_model")
        if cm and cm not in ("opt_in", "opt_out"):
            err(f"{rel}: consent_model {cm!r} must be 'opt_in' or 'opt_out'")

        # Every framework needs a citation; count blocks by their name: key.
        names = re.findall(r"^\s*-\s+id:\s*(\S+)", text, re.M)
        citations = re.findall(r"^\s*citation:\s*(\S+)", text, re.M)
        if len(citations) < len(names):
            err(
                f"{rel}: {len(names)} frameworks but only {len(citations)} citations — "
                "every framework must cite its source"
            )

        if "needs_legal_review: true" in text:
            warn(f"{rel}: still flagged needs_legal_review — not yet signed off by a lawyer")

        # Cross-references must point at packs that actually exist, or a
        # composed prompt will silently miss a jurisdiction.
        codes = {q.stem for q in JURISDICTIONS.glob("*.yaml")}
        ext = top.get("extends")
        if ext and ext not in codes:
            err(f"{rel}: extends '{ext}' but no {ext}.yaml exists")
        for ref in re.findall(r"^\s*-\s+with:\s*(\S+)", text, re.M):
            if ref not in codes:
                err(f"{rel}: conflicts with '{ref}' but no {ref}.yaml exists")


# ------------------------------------------------------------------ disclaimer
def check_disclaimer() -> None:
    for rel in ("README.md", "skills/web-compliance/SKILL.md"):
        p = ROOT / rel
        if not p.exists():
            err(f"{rel}: missing")
            continue
        if "not legal advice" not in p.read_text(encoding="utf-8").lower():
            err(f"{rel}: missing the 'Not legal advice' disclaimer")


def main() -> int:
    check_templates()
    check_jurisdictions()
    check_disclaimer()

    for w in warnings:
        print(f"WARN  {w}")
    for e in errors:
        print(f"ERROR {e}")

    print(
        f"\n{len(list(TEMPLATES.glob('*.md')))} templates, "
        f"{len(list(JURISDICTIONS.glob('*.yaml')))} jurisdictions — "
        f"{len(errors)} error(s), {len(warnings)} warning(s)"
    )
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
