"""
Consolidate NPCs.md book-by-book into one A–Z entry per person.

Usage:
  python consolidate_npcs.py dgd          # Danger Gal Dossier + Dossier+
  python consolidate_npcs.py tss          # Street Stories (+ App C bios)
  python consolidate_npcs.py hope
  python consolidate_npcs.py core
  python consolidate_npcs.py ir
  python consolidate_npcs.py rest         # MD, BC, MC, SPM, NME
  python consolidate_npcs.py rebuild      # rewrite from JSON only

State: source/References/_npc_consolidated.json
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(r"c:\Users\admin\Desktop\Cyberpunk Red\source\References")
NPCS = ROOT / "NPCs.md"
STATE = ROOT / "_npc_consolidated.json"

BOOK_RANGES = {
    "dgd": ("## Danger Gal Dossier", "## Tales of the RED: Street Stories"),
    "tss": ("## Tales of the RED: Street Stories", "## Tales of the RED: Hope Reborn"),
    "hope": ("## Tales of the RED: Hope Reborn", "## Core Rulebook"),
    "core": ("## Core Rulebook", "## Interface RED Vol 1"),
    "ir": ("## Interface RED Vol 1", "## Mixing Drinks, Changing Lives"),
    "rest": ("## Mixing Drinks, Changing Lives", None),
}

CONSOLIDATED_START = "## Consolidated NPCs"
UNCONSOLIDATED_START = "## Unconsolidated (remaining by book)"
PROGRESS_START = "## Consolidation progress"


def norm_key(name: str) -> str:
    return re.sub(r"[^a-z0-9]+", "", name.strip().casefold())


def parse_aliases(name: str) -> tuple[str, list[str]]:
    name = name.strip()
    aliases: list[str] = []
    if " / " in name and "(" not in name.split(" / ")[0]:
        parts = [p.strip() for p in name.split(" / ") if p.strip()]
        return parts[0], parts[1:]
    m = re.match(r"^(.+?)\s*\((.+)\)\s*$", name)
    if m:
        display = m.group(1).strip()
        inner = m.group(2).strip()
        if inner.lower() in {"blue", "pink"} or display.lower().startswith("dead ringer"):
            return name, aliases
        if "founder" in inner.lower() or "deceased" in inner.lower():
            return name, aliases
        if " / " in inner:
            aliases = [a.strip() for a in inner.split(" / ")]
        else:
            aliases = [inner]
        return display, aliases
    return name, aliases


def load_state() -> dict:
    if STATE.exists():
        return json.loads(STATE.read_text(encoding="utf-8"))
    return {"entries": {}, "folded_books": []}


def save_state(state: dict) -> None:
    STATE.write_text(json.dumps(state, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def merge_entry(
    state: dict,
    *,
    name: str,
    role: str,
    notes: str,
    source: str,
    context: str,
) -> None:
    display, aliases = parse_aliases(name)
    keep_full = name.strip() != display and (
        "founder" in name.lower() or bool(re.search(r"\((Blue|Pink)\)", name))
    )
    key_name = name.strip() if keep_full else display
    key = norm_key(key_name)
    entries = state["entries"]
    if key not in entries:
        entries[key] = {
            "name": key_name,
            "aliases": [],
            "roles": [],
            "notes": [],
            "sources": [],
            "contexts": [],
            "bio": "",
            "meta": {},
        }
    e = entries[key]
    for a in aliases:
        if a and a.casefold() != e["name"].casefold() and a not in e["aliases"]:
            e["aliases"].append(a)
    role = (role or "").strip()
    if role and role not in {"—", "-", "–"} and role not in e["roles"]:
        e["roles"].append(role)
    note = (notes or "").strip()
    if note and note not in {"—", "-", "–"} and note not in e["notes"]:
        e["notes"].append(note)
    src = f"{source}" + (f" · {context}" if context else "")
    if src not in e["sources"]:
        e["sources"].append(src)
    if context and context not in e["contexts"]:
        e["contexts"].append(context)


def parse_tables_in_section(section: str, book_abbr: str) -> list[dict]:
    rows: list[dict] = []
    context = ""
    lines = section.splitlines()
    i = 0
    while i < len(lines):
        line = lines[i]
        if line.startswith("#### "):
            context = line[5:].strip()
        elif line.startswith("### "):
            context = line[4:].strip()
        elif line.startswith("|") and i + 1 < len(lines) and re.match(
            r"^\|[-:\s|]+\|$", lines[i + 1]
        ):
            i += 2
            while i < len(lines) and lines[i].startswith("|"):
                cells = [c.strip() for c in lines[i].strip("|").split("|")]
                if len(cells) >= 2 and cells[0].lower() not in {"name", ""}:
                    name, role = cells[0], cells[1]
                    notes = cells[2] if len(cells) > 2 else ""
                    if name.lower() != "none":
                        rows.append(
                            {
                                "name": name,
                                "role": role,
                                "notes": notes,
                                "context": context,
                                "source": book_abbr,
                            }
                        )
                i += 1
            continue
        i += 1
    return rows


def extract_section(text: str, start: str, end: str | None) -> str:
    if start not in text:
        raise SystemExit(f"Missing section start: {start}")
    a = text.index(start)
    b = text.index(end) if end and end in text else len(text)
    return text[a:b]


def fold_app_c_bios(state: dict, section: str) -> None:
    blocks = re.split(r"(?m)^### ", section)
    for block in blocks[1:]:
        lines = block.splitlines()
        name = lines[0].strip()
        if not name:
            continue
        meta_line = ""
        bio_parts: list[str] = []
        for ln in lines[1:]:
            s = ln.strip()
            if not s:
                continue
            if s.startswith("**") and (
                "Pronouns:" in s or "Appears in:" in s or "Stat block:" in s or "Source:" in s
            ):
                if "Source:" not in s or "Pronouns:" in s:
                    meta_line = s
                continue
            bio_parts.append(s)
        bio = " ".join(bio_parts).strip()
        pronouns = appears = stat = ""
        if meta_line:
            m = re.search(r"\*\*Pronouns:\*\*\s*([^·]+)", meta_line)
            if m:
                pronouns = m.group(1).strip()
            m = re.search(r"\*\*Appears in:\*\*\s*([^·]+)", meta_line)
            if m:
                appears = m.group(1).strip()
            m = re.search(r"\*\*Stat block:\*\*\s*([^·]+)", meta_line)
            if m:
                stat = m.group(1).strip()
        merge_entry(state, name=name, role="", notes="", source="T:SS App. C", context="Biographies")
        key = norm_key(name)
        display, _ = parse_aliases(name)
        e = state["entries"].get(key) or state["entries"].get(norm_key(display))
        if not e:
            continue
        if bio:
            e["bio"] = bio
        if pronouns:
            e["meta"]["pronouns"] = pronouns
        if appears:
            e["meta"]["appears_in"] = appears
        if stat:
            e["meta"]["stat_block"] = stat


def fold_book(book: str, state: dict, text: str) -> None:
    # Prefer Unconsolidated block as source of remaining book text
    src = text
    if UNCONSOLIDATED_START in text:
        src = text.split(UNCONSOLIDATED_START, 1)[1]

    if book == "dgd":
        # DGD may still be at top level on first run
        if "## Danger Gal Dossier" in text and "## Danger Gal Dossier" not in src:
            sec = extract_section(text, *BOOK_RANGES["dgd"])
        else:
            sec = extract_section(src if "## Danger Gal Dossier" in src else text, *BOOK_RANGES["dgd"])
        if "## Danger Gal Dossier+" in sec:
            dgd, plus = sec.split("## Danger Gal Dossier+", 1)
            for r in parse_tables_in_section(dgd, "DGD"):
                merge_entry(
                    state,
                    name=r["name"],
                    role=r["role"],
                    notes=r["notes"],
                    source=r["source"],
                    context=r["context"],
                )
            for r in parse_tables_in_section("### Bonus\n" + plus, "DGD+"):
                merge_entry(
                    state,
                    name=r["name"],
                    role=r["role"],
                    notes=r["notes"],
                    source=r["source"],
                    context=r["context"],
                )
        else:
            for r in parse_tables_in_section(sec, "DGD"):
                merge_entry(
                    state,
                    name=r["name"],
                    role=r["role"],
                    notes=r["notes"],
                    source=r["source"],
                    context=r["context"],
                )
        if "dgd" not in state["folded_books"]:
            state["folded_books"].append("dgd")
        return

    if book == "tss":
        base = src if "## Tales of the RED: Street Stories" in src else text
        sec = extract_section(base, *BOOK_RANGES["tss"])
        if "## Appendix C: Biographies" in sec:
            missions, bios = sec.split("## Appendix C: Biographies", 1)
        else:
            missions, bios = sec, ""
        for r in parse_tables_in_section(missions, "T:SS"):
            merge_entry(
                state,
                name=r["name"],
                role=r["role"],
                notes=r["notes"],
                source=r["source"],
                context=r["context"],
            )
        if bios:
            fold_app_c_bios(state, bios)
        if "tss" not in state["folded_books"]:
            state["folded_books"].append("tss")
        return

    if book == "ir":
        base = src if "## Interface RED Vol 1" in src else text
        for vol in range(1, 6):
            h = f"## Interface RED Vol {vol}"
            if h not in base and h not in text:
                continue
            use = base if h in base else text
            pos = use.index(h)
            endpos = len(use)
            for v2 in range(vol + 1, 6):
                h2 = f"## Interface RED Vol {v2}"
                if h2 in use:
                    endpos = min(endpos, use.index(h2))
            if "## Mixing Drinks, Changing Lives" in use:
                endpos = min(endpos, use.index("## Mixing Drinks, Changing Lives"))
            chunk = use[pos:endpos]
            for r in parse_tables_in_section(chunk, f"IR{vol}"):
                merge_entry(
                    state,
                    name=r["name"],
                    role=r["role"],
                    notes=r["notes"],
                    source=r["source"],
                    context=r["context"],
                )
        if "ir" not in state["folded_books"]:
            state["folded_books"].append("ir")
        return

    if book == "rest":
        base = src if "## Mixing Drinks, Changing Lives" in src else text
        for heading, tag in [
            ("## Mixing Drinks, Changing Lives", "MD"),
            ("## Black Chrome", "BC"),
            ("## Micro Chrome", "MC"),
            ("## Single Player Mode", "SPM"),
            ("## Night Market Encyclopedia / Index", "NME"),
        ]:
            if heading not in base and heading not in text:
                continue
            use = base if heading in base else text
            pos = use.index(heading)
            endpos = len(use)
            for h2, _ in [
                ("## Black Chrome", None),
                ("## Micro Chrome", None),
                ("## Single Player Mode", None),
                ("## Night Market Encyclopedia / Index", None),
            ]:
                if h2 != heading and h2 in use:
                    p2 = use.index(h2)
                    if p2 > pos:
                        endpos = min(endpos, p2)
            chunk = use[pos:endpos]
            for r in parse_tables_in_section(chunk, tag):
                merge_entry(
                    state,
                    name=r["name"],
                    role=r["role"],
                    notes=r["notes"],
                    source=r["source"],
                    context=r["context"],
                )
        if "rest" not in state["folded_books"]:
            state["folded_books"].append("rest")
        return

    # hope / core
    abbr = {"hope": "T:Hope", "core": "CP:R"}[book]
    start, end = BOOK_RANGES[book]
    base = src if start in src else text
    sec = extract_section(base, start, end)
    for r in parse_tables_in_section(sec, abbr):
        merge_entry(
            state,
            name=r["name"],
            role=r["role"],
            notes=r["notes"],
            source=r["source"],
            context=r["context"],
        )
    if book not in state["folded_books"]:
        state["folded_books"].append(book)


def render_entry(e: dict) -> str:
    lines = [f"### {e['name']}", ""]
    if e.get("aliases"):
        lines.append(f"- **Also known as:** {'; '.join(e['aliases'])}")
    meta = e.get("meta") or {}
    if meta.get("pronouns"):
        lines.append(f"- **Pronouns:** {meta['pronouns']}")
    if e["roles"]:
        lines.append("- **Role:** " + " | ".join(e["roles"]))
    if e["contexts"]:
        ctx = []
        for c in e["contexts"]:
            if c and c not in ctx:
                ctx.append(c)
        if ctx:
            lines.append("- **Context:** " + "; ".join(ctx))
    if e["sources"]:
        lines.append("- **Sources:** " + "; ".join(e["sources"]))
    if meta.get("appears_in"):
        lines.append(f"- **Appears in:** {meta['appears_in']}")
    if meta.get("stat_block"):
        lines.append(f"- **Stat block:** {meta['stat_block']}")
    if e["notes"]:
        lines.append("- **Notes:**")
        for n in e["notes"]:
            lines.append(f"  - {n}")
    if e.get("bio"):
        lines.append(f"- **Bio:** {e['bio']}")
    lines.append("")
    return "\n".join(lines)


def render_consolidated(state: dict) -> str:
    folded = ", ".join(state.get("folded_books") or []) or "(none)"
    lines = [
        CONSOLIDATED_START,
        "",
        "One entry per NPC. Notes from each source are merged as books are folded in.",
        "",
        f"**Folded so far:** `{folded}`",
        f"**Entry count:** {len(state['entries'])}",
        "",
    ]
    entries = sorted(
        state["entries"].values(),
        key=lambda e: (e["name"].casefold().lstrip("\"'"), e["name"]),
    )
    letter = ""
    for e in entries:
        ch = e["name"].lstrip("\"'").upper()[:1]
        if ch.isdigit():
            ch = "0–9"
        if ch != letter:
            letter = ch
            lines += [f"## {letter}", ""]
        lines.append(render_entry(e))
    return "\n".join(lines).rstrip() + "\n"


def rebuild_npcs_md(state: dict, original: str) -> str:
    cut_at = None
    for marker in (PROGRESS_START, CONSOLIDATED_START, "## Danger Gal Dossier"):
        if marker in original:
            cut_at = original.index(marker)
            break
    if cut_at is None:
        raise SystemExit("Cannot find cut point for header")
    head = original[:cut_at].rstrip() + "\n"

    remaining = [b for b in ("dgd", "tss", "hope", "core", "ir", "rest") if b not in state["folded_books"]]
    toc = """## Contents

- [Source Abbreviations](#source-abbreviations)
- [Source Pass Checklist](#source-pass-checklist)
- [Consolidation progress](#consolidation-progress)
- [Consolidated NPCs](#consolidated-npcs)
"""
    if remaining:
        toc += "- [Unconsolidated (remaining by book)](#unconsolidated-remaining-by-book)\n"
    toc += "\n"

    if "## Contents" in head and "## Source Abbreviations" in head:
        pre = head.split("## Contents")[0]
        abbr = head.split("## Source Abbreviations", 1)[1]
        head = pre + toc + "---\n\n## Source Abbreviations" + abbr
        head = re.sub(r"\n---\s*\n---\s*\n", "\n---\n\n", head)

    def st(b: str) -> str:
        return "done" if b in state["folded_books"] else "pending"

    progress = f"""## Consolidation progress

| Book | Status |
|------|--------|
| Danger Gal Dossier (+) | {st("dgd")} |
| Tales of the RED: Street Stories (+ App C) | {st("tss")} |
| Tales of the RED: Hope Reborn | {st("hope")} |
| Core Rulebook | {st("core")} |
| Interface RED Vol 1–5 | {st("ir")} |
| Mixing Drinks / Black Chrome / Micro Chrome / SPM / NME | {st("rest")} |

---

"""

    body = render_consolidated(state)

    uncon = ""
    if remaining:
        src_text = original
        if UNCONSOLIDATED_START in original:
            src_text = original.split(UNCONSOLIDATED_START, 1)[1]
        chunks = []
        for b in remaining:
            start, end = BOOK_RANGES[b]
            if start in src_text:
                chunks.append(extract_section(src_text, start, end).rstrip())
            elif start in original:
                chunks.append(extract_section(original, start, end).rstrip())
        if chunks:
            uncon = "\n---\n\n" + UNCONSOLIDATED_START + "\n\n" + "\n\n---\n\n".join(chunks) + "\n"

    footer = (
        "\n---\n\n"
        f"*Last updated: consolidation in progress — folded: {', '.join(state['folded_books']) or 'none'}.*\n"
    )
    return head.rstrip() + "\n\n---\n\n" + progress + body + uncon + footer


def main() -> None:
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)
    cmd = sys.argv[1].lower()
    text = NPCS.read_text(encoding="utf-8")
    state = load_state()

    if cmd == "rebuild":
        pass
    elif cmd in BOOK_RANGES:
        fold_book(cmd, state, text)
        save_state(state)
        print(f"Folded {cmd}: {len(state['entries'])} entries; books={state['folded_books']}")
    else:
        print("Unknown command", cmd)
        sys.exit(1)

    out = rebuild_npcs_md(state, text)
    NPCS.write_text(out, encoding="utf-8")
    print(f"Wrote {NPCS} ({out.count(chr(10)) + 1} lines)")


if __name__ == "__main__":
    main()
