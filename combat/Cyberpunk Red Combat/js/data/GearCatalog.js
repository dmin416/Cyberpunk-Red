/**

 * Gear from Night Market Encyclopedia — weapons (01), armor (02), grenades (01), ammo (11).

 * Weapons/grenades are generated from NME 01 via scripts/build_weapon_catalog.py

 * @typedef {import('../combat/Combatant.js').InventoryItem} InventoryItem

 */



import { GENERATED_WEAPON_CATALOG } from './WeaponCatalog.generated.js';
import { GENERATED_CYBERWARE_CATALOG } from './CyberwareCatalog.generated.js';



/**

 * @typedef {object} GearEntry

 * @property {string} id

 * @property {string} name

 * @property {'weapon'|'armor'|'grenade'|'ammo'|'gear'|'cyberware'} kind

 * @property {string} source

 * @property {string} cost

 * @property {number} priceEb

 * @property {string} [detail]

 * @property {import('../combat/Combatant.js').WeaponProfile} [weapon]

 * @property {number} [armorSP]

 * @property {number} [qty]

 * @property {string} [ammoType]

 * @property {number} [armorAblation]

 * @property {boolean} [noArmorAblation]

 * @property {boolean} [noDirectDamage]

 * @property {boolean} [directHpDamage]

 * @property {boolean} [lessThanLethal]

 * @property {number} [onHitAblate]

 * @property {boolean} [hasLethalMode]

 * @property {string} [specialMechanisms]

 * @property {string} [weaponCategory]
 * @property {string} [cyberwareCategory]
 * @property {string} [install]
 * @property {string} [humanityLoss]
 * @property {string} [effectSummary]
 * @property {string[]} [categories]
 */



/** @param {string} cost */

export function parsePriceEb(cost) {

    const m = /(\d[\d,]*)\s*eb/i.exec(cost);

    if (!m) return 0;

    return Number(m[1].replace(/,/g, ''));

}



/** @param {Omit<GearEntry, 'priceEb'> & { priceEb?: number }} entry */

function gear(entry) {

    return {

        ...entry,

        priceEb: entry.priceEb ?? parsePriceEb(entry.cost),

    };

}



/** @param {Record<string, unknown>} raw */

function gearFromGenerated(raw) {

    return gear(/** @type {GearEntry} */ (raw));

}



/** @type {GearEntry[]} */

const GENERATED_WEAPONS = GENERATED_WEAPON_CATALOG.weapons.map(gearFromGenerated);



/** @type {GearEntry[]} */

const GENERATED_GRENADES = GENERATED_WEAPON_CATALOG.grenades.map(gearFromGenerated);

/** @type {GearEntry[]} */
const GENERATED_CYBERWARE = GENERATED_CYBERWARE_CATALOG.map(gearFromGenerated);



/** @type {Record<string, GearEntry[]>} */

export const GEAR_CATALOG = {

    weapons: GENERATED_WEAPONS,

    armor: [

        gear({ id: 'leathers', name: 'Leathers', kind: 'armor', source: 'NME 02 / CP:R', cost: '20eb (Everyday)', detail: 'SP 4 · Body or Head', armorSP: 4 }),

        gear({ id: 'kevlar', name: 'Kevlar®', kind: 'armor', source: 'NME 02 / CP:R', cost: '50eb (Costly)', detail: 'SP 7 · Body or Head', armorSP: 7 }),

        gear({ id: 'light_armorjack', name: 'Light Armorjack', kind: 'armor', source: 'NME 02 / CP:R', cost: '100eb (Premium)', detail: 'SP 11 · no penalty', armorSP: 11 }),

        gear({ id: 'dirk_combat_jacket', name: 'The Dirk Combat Jacket', kind: 'armor', source: 'NME 02 Armor', cost: '500eb (Expensive)', detail: 'SP 11 · Leisurewear · concealed clips', armorSP: 11 }),

        gear({ id: 'medium_armorjack', name: 'Medium Armorjack', kind: 'armor', source: 'NME 02 / CP:R', cost: '100eb (Premium)', detail: 'SP 12 · −2 REF, DEX, MOVE', armorSP: 12 }),

        gear({ id: 'heavy_armorjack', name: 'Heavy Armorjack', kind: 'armor', source: 'NME 02 / CP:R', cost: '500eb (Expensive)', detail: 'SP 13 · −2 REF, DEX, MOVE', armorSP: 13 }),

        gear({ id: 'bodyweight_suit', name: 'Bodyweight Suit', kind: 'armor', source: 'NME 02 / CP:R', cost: '1,000eb (V Expensive)', detail: 'SP 11/11 · Body & Head · deck slot', armorSP: 11 }),

        gear({ id: 'flak', name: 'Flak', kind: 'armor', source: 'NME 02 / CP:R', cost: '500eb (Expensive)', detail: 'SP 15 · −4 REF, DEX, MOVE', armorSP: 15 }),

    ],

    grenades: GENERATED_GRENADES,

    cyberware: GENERATED_CYBERWARE,

    ammo: [

        gear({ id: 'basic_m_pistol', name: 'Basic (M Pistol)', kind: 'ammo', source: 'NME 11 / CP:R', cost: '10eb (Cheap)/10', detail: 'Standard · 10 rounds', qty: 10, priceEb: 10, ammoType: 'M Pistol', armorAblation: 1 }),

        gear({ id: 'ap_m_pistol', name: 'Armor-Piercing (M Pistol)', kind: 'ammo', source: 'NME 11 / CP:R', cost: '100eb (Premium)/10', detail: 'Ablate armor by 2', qty: 10, priceEb: 100, ammoType: 'M Pistol', armorAblation: 2 }),

        gear({ id: 'incendiary_m_pistol', name: 'Incendiary (M Pistol)', kind: 'ammo', source: 'NME 11 / CP:R', cost: '100eb (Premium)/10', detail: 'Ignite through armor', qty: 10, priceEb: 100, ammoType: 'M Pistol', armorAblation: 1 }),

        gear({ id: 'rubber_m_pistol', name: 'Rubber (M Pistol)', kind: 'ammo', source: 'NME 11 / CP:R', cost: '10eb (Cheap)/10', detail: 'Less-than-lethal · no ablation', qty: 10, priceEb: 10, ammoType: 'M Pistol', noArmorAblation: true }),

        gear({ id: 'basic_h_pistol', name: 'Basic (H Pistol)', kind: 'ammo', source: 'NME 11 / CP:R', cost: '10eb (Cheap)/10', detail: 'Standard · 10 rounds', qty: 10, priceEb: 10, ammoType: 'H Pistol', armorAblation: 1 }),

        gear({ id: 'ap_h_pistol', name: 'Armor-Piercing (H Pistol)', kind: 'ammo', source: 'NME 11 / CP:R', cost: '100eb (Premium)/10', detail: 'Ablate armor by 2', qty: 10, priceEb: 100, ammoType: 'H Pistol', armorAblation: 2 }),

        gear({ id: 'ap_vh_pistol', name: 'Armor-Piercing (VH Pistol)', kind: 'ammo', source: 'NME 11 / CP:R', cost: '100eb (Premium)/10', detail: 'Ablate armor by 2', qty: 10, priceEb: 100, ammoType: 'VH Pistol', armorAblation: 2 }),

        gear({ id: 'basic_vh_pistol', name: 'Basic (VH Pistol)', kind: 'ammo', source: 'NME 11 / CP:R', cost: '10eb (Cheap)/10', detail: 'Standard · 10 rounds', qty: 10, priceEb: 10, ammoType: 'VH Pistol', armorAblation: 1 }),

        gear({ id: 'basic_shotgun_shell', name: 'Basic (Shotgun Shell)', kind: 'ammo', source: 'NME 11 / CP:R', cost: '10eb (Cheap)/10', detail: 'Slug shells · 10', qty: 10, priceEb: 10, ammoType: 'Shotgun Shell', armorAblation: 1 }),

        gear({ id: 'basic_rifle', name: 'Basic (Rifle)', kind: 'ammo', source: 'NME 11 / CP:R', cost: '10eb (Cheap)/10', detail: 'Standard · 10 rounds', qty: 10, priceEb: 10, ammoType: 'Rifle', armorAblation: 1 }),

        gear({ id: 'ap_rifle', name: 'Armor-Piercing (Rifle)', kind: 'ammo', source: 'NME 11 / CP:R', cost: '100eb (Premium)/10', detail: 'Ablate armor by 2', qty: 10, priceEb: 100, ammoType: 'Rifle', armorAblation: 2 }),

        gear({ id: 'malorian_flechette_ammo', name: 'Malorian Sub-Flechette Ammo', kind: 'ammo', source: 'NME 11', cost: '100eb (Premium)/10', detail: 'Flechette AP · ablate armor by 4', qty: 10, priceEb: 100, ammoType: 'Malorian Flechette', armorAblation: 4 }),

        gear({ id: 'rubber_h_pistol', name: 'Rubber (H Pistol)', kind: 'ammo', source: 'NME 11 / CP:R', cost: '10eb (Cheap)/10', detail: 'Less-than-lethal · no ablation', qty: 10, priceEb: 10, ammoType: 'H Pistol', noArmorAblation: true }),

        gear({ id: 'rubber_vh_pistol', name: 'Rubber (VH Pistol)', kind: 'ammo', source: 'NME 11 / CP:R', cost: '10eb (Cheap)/10', detail: 'Less-than-lethal · no ablation', qty: 10, priceEb: 10, ammoType: 'VH Pistol', noArmorAblation: true }),

        gear({ id: 'rubber_rifle', name: 'Rubber (Rifle)', kind: 'ammo', source: 'NME 11 / CP:R', cost: '10eb (Cheap)/10', detail: 'Less-than-lethal · no ablation', qty: 10, priceEb: 10, ammoType: 'Rifle', noArmorAblation: true }),

    ],

    gear: [

        gear({ id: 'agent', name: 'Agent', kind: 'gear', source: 'CP:R', cost: '100eb (Premium)', detail: 'Phone / agent device' }),

        gear({ id: 'radio_communicator', name: 'Radio Communicator', kind: 'gear', source: 'CP:R', cost: '100eb (Premium)', detail: 'Short-range comms' }),

        gear({ id: 'flashlight', name: 'Flashlight', kind: 'gear', source: 'CP:R', cost: '20eb (Everyday)', detail: 'Handheld light' }),

    ],

};



/** @returns {GearEntry[]} */

export function getAllStoreItems() {

    return [

        ...GEAR_CATALOG.weapons,

        ...GEAR_CATALOG.armor,

        ...GEAR_CATALOG.grenades,

        ...GEAR_CATALOG.cyberware,

        ...GEAR_CATALOG.ammo,

        ...GEAR_CATALOG.gear,

    ];

}



/**

 * @param {string} catalogId

 * @returns {GearEntry | undefined}

 */

export function getStoreItemById(catalogId) {

    return getAllStoreItems().find((g) => g.id === catalogId);

}



/**

 * @param {GearEntry} entry

 * @returns {InventoryItem}

 */

export function inventoryItemFromCatalog(entry) {

    return {

        catalogId: entry.id,

        kind: entry.kind,

        name: entry.name,

        detail: entry.detail,

        cost: entry.cost,

        source: entry.source,

        qty: entry.qty ?? 1,

        priceEb: entry.priceEb,

        equipped: false,

    };

}



export const STARTING_EUROBUCKS = 5000;

/** Encyclopedia weapon sections — order for store sub-tabs. */
const WEAPON_CATEGORY_ORDER = [
    'Medium Pistols',
    'Heavy Pistols',
    'Very Heavy Pistols',
    'SMG',
    'Heavy SMG',
    'Shotguns',
    'Assault Rifles',
    'Machine Guns',
    'Sniper Rifles',
    'Bows and Crossbows',
    'Grenade Launchers',
    'Rocket Launchers',
    'Light Melee Weapons',
    'Medium Melee Weapons',
    'Heavy Melee Weapons',
    'Very Heavy Melee Weapons',
    'Thrown Weapons',
    'Explosives',
];

const WEAPON_TYPE_SHORT_LABELS = {
    'Medium Pistols': 'Med Pistol',
    'Heavy Pistols': 'Heavy Pistol',
    'Very Heavy Pistols': 'VH Pistol',
    'Bows and Crossbows': 'Bows',
    'Grenade Launchers': 'G.Launcher',
    'Rocket Launchers': 'R.Launcher',
    'Light Melee Weapons': 'Light Melee',
    'Medium Melee Weapons': 'Med Melee',
    'Heavy Melee Weapons': 'Heavy Melee',
    'Very Heavy Melee Weapons': 'VH Melee',
    'Thrown Weapons': 'Thrown',
};

/** @returns {{ id: string, label: string }[]} */
export function getWeaponStoreTabs() {
    const present = new Set(
        GEAR_CATALOG.weapons.map((w) => w.weaponCategory).filter(Boolean),
    );
    const tabs = [{ id: 'all', label: 'All Types' }];
    for (const cat of WEAPON_CATEGORY_ORDER) {
        if (present.has(cat)) {
            tabs.push({
                id: cat,
                label: WEAPON_TYPE_SHORT_LABELS[cat] ?? cat,
            });
        }
    }
    for (const cat of present) {
        if (!WEAPON_CATEGORY_ORDER.includes(cat)) {
            tabs.push({ id: cat, label: cat });
        }
    }
    return tabs;
}

/** Encyclopedia cyberware sections — order for store sub-tabs (no CEMK). */
const CYBERWARE_CATEGORY_ORDER = [
    'Neuralware',
    'Internal Body Cyberware',
    'External Body Cyberware',
    'Cyberlimbs',
    'Cyberfingers',
    'Cyberoptics',
    'Cyberaudio',
    'Chipware',
    'Borgware',
    'Fashionware',
    'Bioexotic Packages',
    'FBC Bodies',
    'Cyberware Alternatives',
];

const CYBERWARE_TYPE_SHORT_LABELS = {
    'Internal Body Cyberware': 'Internal',
    'External Body Cyberware': 'External',
    'Bioexotic Packages': 'Bioexotic',
    'FBC Bodies': 'FBC',
    'Cyberware Alternatives': 'Alternatives',
};

/** @returns {{ id: string, label: string }[]} */
export function getCyberwareStoreTabs() {
    const present = new Set(
        GEAR_CATALOG.cyberware.map((c) => c.cyberwareCategory).filter(Boolean),
    );
    const tabs = [{ id: 'all', label: 'All Types' }];
    for (const cat of CYBERWARE_CATEGORY_ORDER) {
        if (present.has(cat)) {
            tabs.push({
                id: cat,
                label: CYBERWARE_TYPE_SHORT_LABELS[cat] ?? cat,
            });
        }
    }
    for (const cat of present) {
        if (!CYBERWARE_CATEGORY_ORDER.includes(cat)) {
            tabs.push({ id: cat, label: cat });
        }
    }
    return tabs;
}



/** Unarmed fallback when no weapon equipped. */

export const UNARMED_WEAPON = {

    name: 'Unarmed',

    rangeCategory: 'Melee',

    skillKey: 'brawling',

    damageDice: '1d6',

    rof: 1,

};


