"""Extract Appendix C bios from Street Stories PDF (bio column only)."""
from __future__ import annotations

import re
from pathlib import Path

import fitz

PDF = Path(r"c:\Users\admin\Desktop\Cyberpunk Red\source\PDF\Tales of the RED Street Stories.pdf")
OUT_SRC = Path(
    r"c:\Users\admin\Desktop\Cyberpunk Red\source\Source Text\Tales of the RED Street Stories\11 Appendix C Biographies.md"
)
OUT_SEC = Path(r"c:\Users\admin\Desktop\Cyberpunk Red\source\References\_appendix_c_section.md")

# Include they/she (Sall3 Smite)
PRON = r"he/him|she/her|they/them|she/they|he/they|they/she|it/its"
# Unicode word chars for accented names (de León)
WORD = r"[A-Z0-9]\w*(?:['\-]\w+)*"
NICK = rf"[\"']{WORD}[\"']"
TITLE = r"(?:Mr|Ms|Mrs|Dr|Prof)\."
# Allow lowercase connectors: of, de, the, da, von
CONN = r"(?:of|de|the|da|von|del)"
NAME = (
    rf"(?:512|(?:The[ ]+)?(?:{TITLE}[ ]+)?"
    rf"(?:{WORD}|{NICK})"
    rf"(?:[ ]+(?:{CONN}[ ]+)?(?:The[ ]+)?(?:{WORD}|{NICK})){{0,6}})"
)
ENTRY = re.compile(
    rf"(?:^|(?<=\. )|(?<=\n))"
    rf"(?P<name>{NAME})"
    rf"[ ]*\((?P<pron>{PRON})\):[ ]*",
    re.I | re.M,
)
# Concept / AI entries without pronouns: "Biodrones:" / "The Reaper:"
CONCEPT = re.compile(
    rf"(?:^|(?<=\n))(?P<name>Biodrones|The Reaper|Lord Ruthven's Lieutenants):[ ]*",
    re.I | re.M,
)

JUNK_NAME = re.compile(
    r"(?i)^(appears|stat|block|mentioned|page|bucket|stitch|desire|opera|biographies|ales of|bathed|one red|agents|haven)"
)

doc = fitz.open(PDF)
start = next(p - 1 for _l, t, p in doc.get_toc() if "biograph" in t.lower())

chunks: list[str] = []
for i in range(start, doc.page_count):
    page = doc[i]
    for b in sorted(page.get_text("blocks"), key=lambda x: (round(x[1], 1), round(x[0], 1))):
        x0, _y0, _x1, _y1, text, *_ = b
        t = text.strip()
        # Alternate pages put header lines at x≈63; body at x≈72
        if not t or x0 < 60:
            continue
        letters = [ln.strip() for ln in t.splitlines() if ln.strip()]
        if len(letters) > 6 and all(len(ln) <= 2 for ln in letters):
            continue
        low = re.sub(r"\s+", " ", t).lower()
        if "tales of the red biographies" in low:
            continue
        if low in {"appendix c", "biographies", "appendix c: biographies"}:
            continue
        if re.fullmatch(r"\d{2,3}", t.strip()):
            continue
        # sidebar name lists
        if "/" in t and "(" not in t and ":" not in t and len(t) < 80:
            continue
        t = re.sub(r"\s*\n\s*", " ", t)
        t = re.sub(r"[ \t]+", " ", t).strip()
        chunks.append(t)

rebuilt: list[str] = []
for ch in chunks:
    ch = ch.replace("\u201c", '"').replace("\u201d", '"')
    ch = ch.replace("\u2018", "'").replace("\u2019", "'")
    if ENTRY.match(ch) or CONCEPT.match(ch):
        rebuilt.append("\n" + ch)
    else:
        rebuilt.append((" " if rebuilt else "") + ch)
blob = "".join(rebuilt)

# Merge entry + concept match positions
class Hit:
    def __init__(self, m: re.Match, kind: str):
        self.m = m
        self.kind = kind
        self.start = m.start()
        self.end_header = m.end()
        self.name = m.group("name").strip().strip('"')
        self.pronouns = m.groupdict().get("pron")
        if self.pronouns:
            self.pronouns = self.pronouns.lower()


hits: list[Hit] = []
for m in ENTRY.finditer(blob):
    hits.append(Hit(m, "bio"))
for m in CONCEPT.finditer(blob):
    hits.append(Hit(m, "concept"))
hits.sort(key=lambda h: h.start)

# Drop overlapping (prefer earlier start; if same, prefer ENTRY)
cleaned_hits: list[Hit] = []
for h in hits:
    if cleaned_hits and h.start < cleaned_hits[-1].end_header:
        continue
    cleaned_hits.append(h)
hits = cleaned_hits

entries = []
for i, h in enumerate(hits):
    name = h.name
    if JUNK_NAME.search(name) or "\n" in name or len(name) > 50:
        continue
    if name.count(" ") >= 5 and '"' not in name and "de " not in name.lower():
        continue
    end = hits[i + 1].start if i + 1 < len(hits) else len(blob)
    body = re.sub(r"\s+", " ", blob[h.end_header : end]).strip()
    body = re.split(r"(?i)to learn more, please visit", body)[0]
    body = re.split(r"(?i)night city is a big place", body)[0].strip()

    # Strip trailing sidebar name-list garbage glued before next header
    body = re.sub(
        r"(?i)\s+(Flaxx The Impaler John Doe|Aisha .+ Asher .+ Barbara Dahl)\s*$",
        "",
        body,
    ).strip()

    mission = ""
    missions: list[str] = []
    for label, pat in (
        ("", r"Appears? in ([^\.]+)\."),
        ("(mentioned) ", r"Mentioned in ([^\.]+)\."),
    ):
        for m_app in list(re.finditer(pat, body)):
            missions.append(f"{label}{m_app.group(1).strip()}")
        body = re.sub(pat, "", body)
    if missions:
        # Prefer Appears over Mentioned for primary; keep unique
        seen = []
        for m_s in missions:
            if m_s not in seen:
                seen.append(m_s)
        mission = "; ".join(seen)

    stat = ""
    sb = re.search(r"Stat Blocks? on pages? ([\d ,and]+)\.?", body, re.I)
    if sb:
        stat = re.sub(r"\s+", " ", sb.group(1)).strip()
        body = (body[: sb.start()] + body[sb.end() :]).strip()

    # Cross-ref like "see Lord Ruthven (page 188)"
    body = re.sub(
        r"\s*For more information about the professor, see Lord Ruthven \(page \d+\)\.",
        "",
        body,
    )

    bio = body.strip()
    # Strip trailing sidebar name-index junk (Capitalized tokens, no sentence)
    bio = re.sub(
        r"(?<=[.!?])\s+(?:(?:Mr|Ms|Mrs|Dr|Prof)\.\s+)?(?:The\s+)?[A-Z][\w'.\-]*(?:\s+(?:(?:Mr|Ms|Mrs|Dr|Prof)\.\s+)?(?:The\s+)?[\"']?[A-Z][\w'.\-]*[\"']?){2,}\s*$",
        "",
        bio,
    ).strip()
    bio = bio.rstrip(" .")
    if bio and not bio.endswith((".", "!", "?")):
        bio += "."
    if len(bio) < 15:
        continue
    entries.append(
        {
            "name": name,
            "pronouns": h.pronouns or "—",
            "mission": mission,
            "stat": stat,
            "bio": bio,
            "kind": h.kind,
        }
    )

best: dict[str, dict] = {}
for e in entries:
    key = re.sub(r"[^a-z0-9]+", "", e["name"].casefold())
    if key not in best or len(e["bio"]) > len(best[key]["bio"]):
        best[key] = e
entries = sorted(best.values(), key=lambda e: (e["name"] != "512", e["name"].casefold()))


def write_md(path: Path, for_npcs: bool) -> None:
    lines: list[str] = []
    if for_npcs:
        lines += [
            "## Appendix C: Biographies (Street Stories)",
            "",
            "Full text from PDF **Appendix C: Biographies** (p. 182–198).",
            "Also mirrored in `Tales of the RED Street Stories/11 Appendix C Biographies.md`.",
            "",
            f"**Count:** {len(entries)}",
            "",
        ]
    else:
        lines += [
            "# Appendix C: Biographies",
            "",
            "Book pages 182–198",
            "",
            "Named NPC biographies from *Tales of the RED: Street Stories*.",
            "Source PDF bookmark: **Appendix C: Biographies**.",
            "",
            f"**Count:** {len(entries)} entries",
            "",
            "---",
            "",
        ]
    for e in entries:
        lines.append(f"### {e['name']}")
        lines.append("")
        meta = [f"**Pronouns:** {e['pronouns']}"]
        if e["mission"]:
            meta.append(f"**Appears in:** {e['mission']}")
        if e["stat"]:
            meta.append(f"**Stat block:** p. {e['stat']}")
        if for_npcs:
            meta.append("**Source:** T:SS App. C")
        lines.append(" · ".join(meta))
        lines.append("")
        lines.append(e["bio"])
        lines.append("")
    path.write_text("\n".join(lines), encoding="utf-8")


write_md(OUT_SRC, False)
write_md(OUT_SEC, True)
print(f"COUNT {len(entries)}")
long = [e for e in entries if len(e["bio"]) > 1200]
if long:
    print("LONG:")
    for e in long:
        print(f"  {e['name']}: {len(e['bio'])}c")
for e in entries:
    print(f"- {e['name']} | {e['mission'] or '?'} | {len(e['bio'])}c")
