#!/usr/bin/env python3
"""Parse NME 01 Weapons.md into WeaponCatalog.generated.js for the combat app."""

from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
WEAPONS_MD = ROOT / "source/Source Text/Night Market Encyclopedia/01 Weapons.md"
OUT_JS = Path(__file__).resolve().parents[1] / "js/data/WeaponCatalog.generated.js"

SECTION_WEAPON = {
    "Medium Pistols": ("Pistol", "handgun", "M Pistol"),
    "Heavy Pistols": ("Pistol", "handgun", "H Pistol"),
    "Very Heavy Pistols": ("Pistol", "handgun", "VH Pistol"),
    "SMG": ("SMG", "handgun", "M Pistol"),
    "Heavy SMG": ("SMG", "handgun", "H Pistol"),
    "Shotguns": ("Shotgun", "shoulderArms", "Shotgun Shell"),
    "Assault Rifles": ("Assault Rifle", "shoulderArms", "Rifle"),
    "Machine Guns": ("Assault Rifle", "shoulderArms", "Rifle"),
    "Sniper Rifles": ("Assault Rifle", "shoulderArms", "Rifle"),
    "Bows and Crossbows": ("Assault Rifle", "archery", "Arrow"),
    "Grenade Launchers": ("Shotgun", "heavyWeapons", "Grenade"),
    "Rocket Launchers": ("Assault Rifle", "heavyWeapons", "Rocket"),
    "Light Melee Weapons": ("Melee", "meleeWeapon", None),
    "Medium Melee Weapons": ("Melee", "meleeWeapon", None),
    "Heavy Melee Weapons": ("Melee", "meleeWeapon", None),
    "Very Heavy Melee Weapons": ("Melee", "meleeWeapon", None),
    "Thrown Weapons": ("Pistol", "athletics", None),
    "Explosives": ("Shotgun", "heavyWeapons", None),
}

SPECIAL_FEATURES: dict[str, str] = {}


def slugify(name: str) -> str:
    s = name.strip("*").lower()
    s = re.sub(r"[®™]", "", s)
    s = re.sub(r"[^a-z0-9]+", "_", s)
    return s.strip("_")[:80]


def parse_dice(text: str) -> str | None:
    if not text or text.strip() in ("—", "-", ""):
        return None
    m = re.search(r"(\d+d\d+)", text)
    return m.group(1) if m else None


def parse_ammo(magazine: str, special: str, ammo_col: str) -> str | None:
    m = re.search(r"\(([^)]+)\)", magazine or "")
    if m:
        raw = m.group(1).strip()
        mapping = {
            "M Pistol": "M Pistol",
            "H Pistol": "H Pistol",
            "VH Pistol": "VH Pistol",
            "Rifle": "Rifle",
            "Slug": "Shotgun Shell",
            "Shotgun Shell": "Shotgun Shell",
            "Grenade": "Grenade",
            "Rocket": "Rocket",
            "Arrow": "Arrow",
            "Battery": "Battery",
        }
        if raw in mapping:
            return mapping[raw]
        if "Flechette" in raw or "flechette" in special.lower():
            return "Malorian Flechette"
    if "Malorian Flechette" in (ammo_col or ""):
        return "Malorian Flechette"
    if "ModBall" in (magazine or ""):
        return "ModBall"
    return None


def parse_rof(text: str) -> int:
    if not text or text.strip() in ("—", "-"):
        return 1
    m = re.match(r"(\d+)", text.strip())
    return int(m.group(1)) if m else 1


def apply_extra_features(name: str, mech: dict, primary_special: str = "") -> dict:
    ps = (primary_special or "").lower()
    if "lethal or less-than-lethal" in ps:
        mech["hasLethalMode"] = True
        return mech

    extra = SPECIAL_FEATURES.get(name.strip("*"), "")
    if not extra:
        return mech
    el = extra.lower()
    if "inherits stun baton" in el or ("stun gun rules" in el and "less-than-lethal" in el):
        mech["noArmorAblation"] = True
        mech["lessThanLethal"] = True
    if "armor ablation 4" in el:
        mech["armorAblation"] = 4
    if "ablate armor by 2" in el and "acid" in el:
        mech.setdefault("armorAblation", 2)
    return mech


NO_DAMAGE_FALSE_POSITIVES = (
    "no dmg needed",
    "no damage to cover",
    "causes no damage to cover",
    "road flares (no dmg",
)


def parse_combat_mechanics(name: str, special: str, section: str) -> dict:
    s = (special or "").lower()
    mech: dict = {}

    if re.search(r"no armor ablation|won't ablate|not ablate armor|no ablation", s):
        mech["noArmorAblation"] = True

    if "less-than-lethal" in s and ("no ablation" in s or "stun gun" in s or "stun baton" in s or "no crit injury/ablation" in s):
        mech["noArmorAblation"] = True
        mech["lessThanLethal"] = True

    if "unconscious at 1 hp" in s and mech.get("noArmorAblation"):
        mech["lessThanLethal"] = True

    m = re.search(r"ablate armor by (\d+)", s)
    if m:
        mech["armorAblation"] = int(m.group(1))

    if "armor ablation 4" in s or "ablate armor by 4" in s:
        mech["armorAblation"] = 4

    if re.search(r"acid.?−1 sp|acid.?-1 sp", s):
        mech["onHitAblate"] = 1
        mech["noDirectDamage"] = True

    if re.search(r"\bno dmg\b|\bno damage\b", s) and "6d6" not in s:
        if not any(fp in s for fp in NO_DAMAGE_FALSE_POSITIVES):
            mech["noDirectDamage"] = True
            if "direct" not in s and "ignite" not in s:
                mech["noArmorAblation"] = True

    if re.search(r"direct (to )?hp|direct hp|\d+d6 direct", s):
        mech["directHpDamage"] = True
        mech["noArmorAblation"] = True

    if name.lower() == "malorian sub-flechette gun" or "malorian sub-flechette" in name.lower():
        mech["armorAblation"] = 4

    return apply_extra_features(name, mech, special)


def parse_table_row(cols: list[str], section: str) -> dict | None:
    if len(cols) < 10 or "eb" not in cols[1]:
        return None
    name = cols[0].strip()
    if name == "Name":
        return None

    range_cat, skill_key, default_ammo = SECTION_WEAPON.get(section, ("Pistol", "handgun", None))
    damage = parse_dice(cols[3]) or parse_dice(section)
    rof = parse_rof(cols[5])
    ammo_type = parse_ammo(cols[4], cols[9], cols[11] if len(cols) > 11 else "")
    if ammo_type is None:
        ammo_type = default_ammo

    mechanics = parse_combat_mechanics(name, cols[9], section)

    entry = {
        "id": slugify(name),
        "name": name.strip("*"),
        "kind": "weapon",
        "source": f"NME 01 · {section}",
        "cost": cols[1],
        "detail": f"{cols[2]} · {cols[3]} · {cols[4]} · ROF {cols[5]}",
        "weaponCategory": section,
        "weapon": {
            "name": name.strip("*"),
            "rangeCategory": range_cat,
            "skillKey": skill_key,
            "damageDice": damage or "0",
            "rof": rof,
        },
    }
    if ammo_type:
        entry["ammoType"] = ammo_type
    entry.update(mechanics)
    if cols[9] and cols[9] not in ("—", "-"):
        entry["specialMechanisms"] = cols[9]
    return entry


def parse_grenade_row(cols: list[str]) -> dict | None:
    if len(cols) < 10 or "eb" not in cols[1]:
        return None
    name = cols[0].strip()
    if name == "Name":
        return None

    special = cols[9]
    damage_dice = parse_dice(cols[3])
    mechanics = parse_combat_mechanics(name, special, "Grenades")

    if mechanics.get("noDirectDamage") or (not damage_dice and "—" in cols[3]):
        damage = "0"
        mechanics["noArmorAblation"] = True
    elif mechanics.get("directHpDamage"):
        damage = damage_dice or "0"
    else:
        damage = damage_dice or "6d6"

    entry = {
        "id": slugify(name),
        "name": name.strip("*"),
        "kind": "grenade",
        "source": "NME 01 · Grenades",
        "cost": cols[1],
        "detail": special[:120] if special else cols[3],
        "qty": 1,
        "weapon": {
            "name": name.strip("*"),
            "rangeCategory": "Grenade",
            "skillKey": "athletics",
            "damageDice": damage,
            "rof": 1,
        },
    }
    if (
        not mechanics.get("noArmorAblation")
        and not mechanics.get("directHpDamage")
        and not mechanics.get("noDirectDamage")
        and damage not in ("0", None)
    ):
        entry["armorAblation"] = mechanics.get("armorAblation", 2)
    entry.update(mechanics)
    if special and special not in ("—", "-"):
        entry["specialMechanisms"] = special
    return entry


def load_special_features(lines: list[str]) -> None:
    current: str | None = None
    buf: list[str] = []
    for line in lines:
        m = re.match(r"\*\*(.+?)\*\* — (.+)", line.strip())
        if m:
            if current and buf:
                SPECIAL_FEATURES[current] = " ".join(buf)
            current = m.group(1).strip()
            buf = [m.group(2).strip()]
        elif current and line.startswith("**") and " — " in line:
            SPECIAL_FEATURES[current] = " ".join(buf)
            m2 = re.match(r"\*\*(.+?)\*\* — (.+)", line.strip())
            if m2:
                current = m2.group(1).strip()
                buf = [m2.group(2).strip()]
        elif current and line.strip() and not line.startswith("#") and not line.startswith("|"):
            buf.append(line.strip())
    if current and buf:
        SPECIAL_FEATURES[current] = " ".join(buf)


def merge_entries(existing: dict, incoming: dict) -> dict:
    """Prefer richer combat data when same weapon appears in multiple categories."""
    out = {**existing, **incoming}
    out["weapon"] = incoming.get("weapon") or existing.get("weapon")
    for key in (
        "noArmorAblation", "armorAblation", "onHitAblate", "lessThanLethal",
        "noDirectDamage", "directHpDamage", "specialMechanisms",
    ):
        if key in incoming and incoming[key]:
            out[key] = incoming[key]
        elif key in existing:
            out[key] = existing[key]
    cats = set(existing.get("categories") or [existing.get("weaponCategory")])
    cats.add(incoming.get("weaponCategory"))
    out["categories"] = sorted(c for c in cats if c)
    return out


def main() -> None:
    text = WEAPONS_MD.read_text(encoding="utf-8")
    lines = text.splitlines()
    load_special_features(lines)

    weapons_by_id: dict[str, dict] = {}
    grenades: list[dict] = []
    current: str | None = None

    for line in lines:
        if line.startswith("## ") and not line.startswith("## Contents"):
            current = line[3:].strip()
            continue
        if not line.startswith("| ") or line.startswith("|------"):
            continue

        cols = [c.strip() for c in line.strip().strip("|").split("|")]

        if current == "Grenades":
            g = parse_grenade_row(cols)
            if g:
                grenades.append(g)
            continue

        if current == "CEMK Weapons":
            continue

        if current not in SECTION_WEAPON:
            continue

        entry = parse_table_row(cols, current)
        if not entry:
            continue

        eid = entry["id"]
        if eid in weapons_by_id:
            weapons_by_id[eid] = merge_entries(weapons_by_id[eid], entry)
        else:
            entry["categories"] = [current]
            weapons_by_id[eid] = entry

    weapons = sorted(weapons_by_id.values(), key=lambda w: (w.get("weaponCategory", ""), w["name"].lower()))
    grenades = sorted(grenades, key=lambda g: g["name"].lower())

    payload = {"weapons": weapons, "grenades": grenades}
    OUT_JS.parent.mkdir(parents=True, exist_ok=True)
    OUT_JS.write_text(
        "/** Auto-generated by scripts/build_weapon_catalog.py — do not edit by hand. */\n"
        f"export const GENERATED_WEAPON_CATALOG = {json.dumps(payload, indent=2, ensure_ascii=False)};\n",
        encoding="utf-8",
    )
    print(f"Wrote {len(weapons)} weapons and {len(grenades)} grenades to {OUT_JS}")


if __name__ == "__main__":
    main()
