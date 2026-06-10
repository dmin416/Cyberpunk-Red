"""Debug: show outline page mapping for each book's Index sections."""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from extract_pdf_sections import (
    PDF_DIR,
    SOURCE_TEXT,
    find_section_page,
    parse_index,
    walk_outline,
)

try:
    from pypdf import PdfReader
except ImportError:
    from PyPDF2 import PdfReader


def main():
    for book_dir in sorted(SOURCE_TEXT.iterdir()):
        if not book_dir.is_dir() or book_dir.name == "Core Rulebook":
            continue
        index = book_dir / "Index.md"
        if not index.exists():
            continue
        _, pdf_name, sections = parse_index(index)
        pdf = PDF_DIR / pdf_name
        if not pdf.exists():
            continue
        reader = PdfReader(str(pdf))
        outline = walk_outline(reader, getattr(reader, "outline", None) or [])
        print(f"\n=== {book_dir.name} ({len(reader.pages)} pp) ===")
        for s in sections:
            p = find_section_page(s.name, outline)
            print(f"  {p or '??':>3}  {s.name}")


if __name__ == "__main__":
    main()
