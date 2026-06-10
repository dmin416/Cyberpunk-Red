"""
Extract PDF text into numbered section markdown files per Source Text book folder.
Reads section definitions from each folder's Index.md and maps them to PDF outline pages.
"""
from __future__ import annotations

import re
import sys
from dataclasses import dataclass
from pathlib import Path

try:
    from pypdf import PdfReader
except ImportError:
    from PyPDF2 import PdfReader

ROOT = Path(__file__).resolve().parents[1]
PDF_DIR = ROOT / "PDF"
SOURCE_TEXT = ROOT / "Source Text"

SKIP_OUTLINE = {
    "front cover",
    "back cover",
    "front page",
    "title page",
    "contents",
    "table of contents",
    "cast and crew",
    "cast and crew/title page",
    "introduction/table of contents",
    "introduction/cast and crew",
    "legend",
}


@dataclass
class Section:
    name: str
    summary: str


@dataclass
class OutlineEntry:
    title: str
    page: int  # 1-based book page from bookmark


def normalize(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r"[^\w\s]", "", text)
    text = re.sub(r"\s+", " ", text)
    return text


def parse_index(index_path: Path) -> tuple[str, str, list[Section]]:
    text = index_path.read_text(encoding="utf-8")
    title_match = re.search(r"^# (.+)$", text, re.M)
    title = title_match.group(1) if title_match else index_path.parent.name

    pdf_match = re.search(r"\(<\.\./\.\./PDF/([^>]+)>\)", text)
    pdf_name = pdf_match.group(1) if pdf_match else f"{index_path.parent.name}.pdf"

    sections: list[Section] = []
    blocks = re.split(r"\n### ", text)
    for block in blocks[1:]:
        lines = block.strip().split("\n")
        name = lines[0].strip()
        link_match = re.match(r"\[(.+?)\]\(<[^>]+>\)", name)
        if link_match:
            name = link_match.group(1)
        summary_lines = []
        for line in lines[1:]:
            if line.startswith("- ") or line.startswith("*Text not"):
                break
            if line.strip():
                summary_lines.append(line.strip())
        summary = " ".join(summary_lines)
        sections.append(Section(name=name, summary=summary))

    return title, pdf_name, sections


def walk_outline(reader: PdfReader, items) -> list[OutlineEntry]:
    entries: list[OutlineEntry] = []

    def walk(nodes):
        for item in nodes:
            if isinstance(item, list):
                walk(item)
                continue
            title = getattr(item, "title", str(item)).strip()
            try:
                page = reader.get_destination_page_number(item) + 1
            except Exception:
                continue
            entries.append(OutlineEntry(title=title, page=page))

    walk(items or [])
    return entries


def find_section_page(section_name: str, outline: list[OutlineEntry]) -> int | None:
    target = normalize(section_name)
    for e in outline:
        if normalize(e.title) == target:
            return e.page
    # Prefer shortest outline title that contains the section name
    candidates = [
        e
        for e in outline
        if normalize(e.title) not in SKIP_OUTLINE and target in normalize(e.title)
    ]
    if candidates:
        return min(candidates, key=lambda e: len(e.title)).page
    for e in outline:
        en = normalize(e.title)
        if en in target and len(en) >= 4:
            return e.page
    target_words = set(target.split())
    best_page = None
    best_score = 0
    for e in outline:
        if normalize(e.title) in SKIP_OUTLINE:
            continue
        words = set(normalize(e.title).split())
        score = len(target_words & words)
        if score > best_score:
            best_score = score
            best_page = e.page
    if best_score >= max(2, len(target_words) * 2 // 3):
        return best_page
    return None


def compute_page_ranges(
    sections: list[Section], starts: dict[str, int], total_pages: int
) -> dict[str, tuple[int, int]]:
    """End pages follow PDF order, not index order."""
    ordered = sorted(sections, key=lambda s: starts[s.name])
    ranges: dict[str, tuple[int, int]] = {}
    for i, section in enumerate(ordered):
        start = starts[section.name]
        end = (
            starts[ordered[i + 1].name] - 1
            if i + 1 < len(ordered)
            else total_pages
        )
        if end < start:
            end = start
        ranges[section.name] = (start, end)
    return ranges


# Manual overrides when outline titles differ from index section names
SECTION_PAGE_OVERRIDES: dict[str, dict[str, int]] = {
    "Black Chrome": {"Vehicles": 58, "Weapons": 86},
    "Danger Gal Dossier": {
        "The Factions": 7,
        "Locations": 144,
    },
    "Danger Gal Dossier+": {
        "Faction Plot Hooks": 2,
        "Pinny Arcade Jacket": 11,
        "The Incident": 6,
        "Bonus Bozo NPC": 12,
    },
    "Interface RED Vol 1": {
        "Rocklin Augmentics Cyberchairs": 38,
        "ELO Expansion Pack 1": 47,
    },
    "Interface RED Vol 5": {
        "Breaking Your Stuff": 4,
        "Chasing the Rabbit": 14,
        "All About Agents": 24,
        "Toggle's Temple": 36,
        "Did Someone Say Murder?": 62,
        "Your New Best Friend": 72,
        "Screamsheet Generator": 84,
        "12 Days of REDmas": 98,
        "Solo of Fortune 2045": 106,
    },
    "Mixing Drinks Changing Lives": {"Introduction": 1},
    "Micro Chrome": {"New Gear": 1},
}


def extract_pages_text(reader: PdfReader, start_page: int, end_page: int) -> str:
    parts: list[str] = []
    total = len(reader.pages)
    start = max(1, start_page)
    end = min(total, end_page)
    for i in range(start - 1, end):
        try:
            t = reader.pages[i].extract_text() or ""
        except Exception:
            t = ""
        if t.strip():
            parts.append(t)
    return "\n\n".join(parts)


def slug_anchor(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r"[^\w\s-]", "", text)
    return re.sub(r"\s+", "-", text)


def safe_filename(section_name: str) -> str:
    name = section_name.rstrip("?")
    name = re.sub(r'[<>:"/\\|?*]', "", name)
    return name.strip()


def write_section_file(
    out_dir: Path,
    num: int,
    section: Section,
    filename: str,
    page_start: int,
    page_end: int,
    body: str,
) -> Path:
    path = out_dir / filename
    contents = [
        f"# {section.name}",
        "",
        f"Book pages {page_start}–{page_end}",
        "",
        section.summary,
        "",
        "## Contents",
        "",
        f"- [{section.name}](<{filename}#{slug_anchor(section.name)}>)",
        "",
        "---",
        "",
        "## Text",
        "",
        body.strip() or "*(No text extracted from PDF for this section.)*",
        "",
    ]
    path.write_text("\n".join(contents), encoding="utf-8")
    return path


def extract_book(folder_name: str, dry_run: bool = False) -> bool:
    book_dir = SOURCE_TEXT / folder_name
    index_path = book_dir / "Index.md"
    if not index_path.exists():
        print(f"SKIP {folder_name}: no Index.md")
        return False

    title, pdf_name, sections = parse_index(index_path)
    pdf_path = PDF_DIR / pdf_name
    if not pdf_path.exists():
        print(f"SKIP {folder_name}: missing {pdf_name}")
        return False

    reader = PdfReader(str(pdf_path))
    outline = walk_outline(reader, getattr(reader, "outline", None) or [])
    total_pages = len(reader.pages)
    overrides = SECTION_PAGE_OVERRIDES.get(folder_name, {})

    starts: dict[str, int] = {}
    for section in sections:
        page = overrides.get(section.name) or find_section_page(section.name, outline)
        if page is None:
            print(f"WARN {folder_name}: could not map section '{section.name}'")
            page = max(starts.values()) + 1 if starts else 1
        starts[section.name] = page

    ranges = compute_page_ranges(sections, starts, total_pages)
    files: list[tuple[str, str]] = []
    for i, section in enumerate(sections):
        start, end = ranges[section.name]
        filename = f"{i + 1:02d} {safe_filename(section.name)}.md"
        body = extract_pages_text(reader, start, end)
        files.append((filename, section.name))
        print(f"  {filename}: pp. {start}-{end} ({len(body)} chars)")
        if not dry_run:
            write_section_file(book_dir, i + 1, section, filename, start, end, body)

    if not dry_run:
        update_index_v2(index_path, sections, files)
    print(f"OK {folder_name}: {len(sections)} sections")
    return True


def update_index_v2(index_path: Path, sections: list[Section], files: list[tuple[str, str]]) -> None:
    text = index_path.read_text(encoding="utf-8")
    text = re.sub(r"\*Text not yet extracted\.\*\n?", "", text)

    for section, (fname, sname) in zip(sections, files):
        anchor = slug_anchor(sname)
        block = (
            f"### [{section.name}](<{fname}>)\n\n"
            f"{section.summary}\n\n"
            f"- [{section.name}](<{fname}#{anchor}>)\n\n"
        )
        pattern = (
            rf"### (?:\[{re.escape(section.name)}\]\(<[^>]+>\)|{re.escape(section.name)})\n\n"
            rf"{re.escape(section.summary)}\n\n"
            rf"(?:- \[[^\n]+\n\n)?"
        )
        if re.search(pattern, text):
            text = re.sub(pattern, block, text, count=1)
        else:
            insert = text.find("\n## Contents\n")
            if insert != -1:
                text = text[:insert] + "\n" + block + text[insert:]

    files_table = ["", "## Files", "", "| # | File | Section |", "|---|------|---------|"]
    for i, (fname, sname) in enumerate(files, 1):
        files_table.append(f"| {i} | [{sname}](<{fname}>) | {sname} |")
    if "## Files" in text:
        text = re.sub(r"\n## Files\n.*", "\n" + "\n".join(files_table) + "\n", text, flags=re.S)
    else:
        text = text.rstrip() + "\n" + "\n".join(files_table) + "\n"

    index_path.write_text(text, encoding="utf-8")


def main():
    folders = sorted(
        p.name
        for p in SOURCE_TEXT.iterdir()
        if p.is_dir() and p.name != "Core Rulebook" and (p / "Index.md").exists()
    )
    if len(sys.argv) > 1:
        folders = [f for f in sys.argv[1:] if f != "Core Rulebook"]

    ok = 0
    for folder in folders:
        print(f"\n=== {folder} ===")
        if extract_book(folder):
            ok += 1
    print(f"\nDone: {ok}/{len(folders)} books")


if __name__ == "__main__":
    main()
