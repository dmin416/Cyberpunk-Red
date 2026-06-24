/**
 * Enemy stat blocks — CP:R Screamsheets (p.412+) & DGD templates (p.412+).
 * Skills stored as CP:R Skill Bases (STAT + Skill) for combat resolution.
 */
import {
    ENEMY_LEVEL_TO_TIER,
    THREAT_TIER_ORDER,
    priceLabelForTier,
    rewardEbForTier,
} from './PriceChart.js';

/** @typedef {import('../combat/Combatant.js').WeaponProfile} WeaponProfile */
/** @typedef {import('./PriceChart.js').ThreatTierId} ThreatTierId */

/**
 * @typedef {object} EnemyTemplate
 * @property {string} id
 * @property {string} displayName
 * @property {string} source
 * @property {'Mook'|'Ganger'|'Lieutenant'|'Mini-Boss'|'Boss'|'Legend'} level
 * @property {ThreatTierId} [rewardTier]
 * @property {number} ref
 * @property {number} dex
 * @property {number} body
 * @property {number} will
 * @property {number} move
 * @property {number} hp
 * @property {number} armorHeadSP
 * @property {number} armorBodySP
 * @property {Record<string, number>} skills
 * @property {WeaponProfile} weapon
 * @property {WeaponProfile} [secondaryWeapon]
 * @property {string[]} gear
 * @property {string} [notes]
 */

/** @type {EnemyTemplate[]} */
export const ENEMY_CATALOG = [
    // ── Mook — CP:R / DGD: 33 STAT pts, combat base 10–12, HP 20–35, SP 4–7 ──
    {
        id: 'boosterganger',
        displayName: 'Boosterganger',
        source: 'CP:R Screamsheets · Mook',
        level: 'Mook',
        ref: 6, dex: 5, body: 2, will: 2, move: 6,
        hp: 20,
        armorHeadSP: 4, armorBodySP: 4,
        skills: { handgun: 12, evasion: 7, meleeWeapon: 11, brawling: 9 },
        weapon: {
            name: 'Poor Quality Very Heavy Pistol',
            rangeCategory: 'Pistol',
            skillKey: 'handgun',
            damageDice: '4d6',
            rof: 1,
        },
        secondaryWeapon: {
            name: 'Rippers',
            rangeCategory: 'Melee',
            skillKey: 'meleeWeapon',
            damageDice: '2d6',
            rof: 2,
        },
        gear: ['Very Heavy Pistol Ammo x30', 'Disposable Cellphone', 'Rippers', 'Techhair'],
    },
    {
        id: 'road_ganger',
        displayName: 'Road Ganger',
        source: 'CP:R Screamsheets · Mook',
        level: 'Mook',
        ref: 6, dex: 4, body: 3, will: 3, move: 6,
        hp: 25,
        armorHeadSP: 4, armorBodySP: 4,
        skills: { handgun: 10, evasion: 6, meleeWeapon: 8, shoulderArms: 10, archery: 10 },
        weapon: {
            name: 'Very Heavy Pistol',
            rangeCategory: 'Pistol',
            skillKey: 'handgun',
            damageDice: '4d6',
            rof: 1,
        },
        secondaryWeapon: {
            name: 'Crossbow',
            rangeCategory: 'Assault Rifle',
            skillKey: 'shoulderArms',
            damageDice: '4d6',
            rof: 1,
        },
        gear: ['Very Heavy Pistol Ammo x20', 'Arrow Ammo x20', 'Rope', 'Flashlight', 'Neural Link w/ Interface Plugs'],
    },
    {
        id: 'bodyguard',
        displayName: 'Bodyguard',
        source: 'CP:R Screamsheets · Mook',
        level: 'Mook',
        ref: 6, dex: 5, body: 6, will: 4, move: 6,
        hp: 35,
        armorHeadSP: 7, armorBodySP: 7,
        skills: { handgun: 10, evasion: 7, meleeWeapon: 6, shoulderArms: 10, brawling: 11 },
        weapon: {
            name: 'Poor Quality Shotgun',
            rangeCategory: 'Shotgun',
            skillKey: 'shoulderArms',
            damageDice: '5d6',
            rof: 1,
        },
        secondaryWeapon: {
            name: 'Very Heavy Pistol',
            rangeCategory: 'Pistol',
            skillKey: 'handgun',
            damageDice: '4d6',
            rof: 1,
        },
        gear: ['Slug Ammo x25', 'Very Heavy Pistol Ammo x25', 'Radio Communicator'],
    },
    {
        id: 'security_operative',
        displayName: 'Security Operative',
        source: 'CP:R Screamsheets · Mook',
        level: 'Mook',
        ref: 7, dex: 4, body: 5, will: 3, move: 6,
        hp: 30,
        armorHeadSP: 7, armorBodySP: 7,
        skills: { handgun: 10, evasion: 6, meleeWeapon: 6, shoulderArms: 10, autofire: 10 },
        weapon: {
            name: 'Poor Quality Assault Rifle',
            rangeCategory: 'Assault Rifle',
            skillKey: 'shoulderArms',
            damageDice: '5d6',
            rof: 1,
        },
        secondaryWeapon: {
            name: 'Very Heavy Pistol',
            rangeCategory: 'Pistol',
            skillKey: 'handgun',
            damageDice: '4d6',
            rof: 2,
        },
        gear: ['Rifle Ammo x40', 'Very Heavy Pistol Ammo x20', 'Radio Communicator'],
    },
    {
        id: 'dgd_dunce',
        displayName: 'Dunce (Bozo)',
        source: 'Danger Gal Dossier · Mook',
        level: 'Mook',
        ref: 4, dex: 5, body: 5, will: 4, move: 5,
        hp: 30,
        armorHeadSP: 4, armorBodySP: 4,
        skills: { handgun: 8, evasion: 12, meleeWeapon: 12, brawling: 12 },
        weapon: {
            name: 'PQ Heavy Pistol',
            rangeCategory: 'Pistol',
            skillKey: 'handgun',
            damageDice: '2d6',
            rof: 2,
        },
        secondaryWeapon: {
            name: 'Heavy Melee Weapon (spiked bat)',
            rangeCategory: 'Melee',
            skillKey: 'meleeWeapon',
            damageDice: '3d6',
            rof: 2,
        },
        gear: ['Basic H Pistol Ammo x8', 'Disposable Cell Phone'],
    },

    // ── Ganger — DGD Hardened Mook: +6 STAT, combat base 12+, better gear ──
    {
        id: 'hardened_boosterganger',
        displayName: 'Hardened Boosterganger',
        source: 'Interface RED Vol 2 · Ganger',
        level: 'Ganger',
        ref: 6, dex: 5, body: 4, will: 3, move: 6,
        hp: 30,
        armorHeadSP: 4, armorBodySP: 4,
        skills: { handgun: 12, evasion: 7, meleeWeapon: 12, brawling: 9 },
        weapon: {
            name: 'Poor Quality Very Heavy Pistol',
            rangeCategory: 'Pistol',
            skillKey: 'handgun',
            damageDice: '4d6',
            rof: 1,
        },
        secondaryWeapon: {
            name: 'Wolvers',
            rangeCategory: 'Melee',
            skillKey: 'meleeWeapon',
            damageDice: '3d6',
            rof: 2,
        },
        gear: ['Very Heavy Pistol Ammo x30', 'Black Lace x1', 'Disposable Cellphone', 'Wolvers', 'Techhair'],
    },
    {
        id: 'hardened_road_ganger',
        displayName: 'Hardened Road Ganger',
        source: 'Interface RED Vol 2 · Ganger',
        level: 'Ganger',
        ref: 6, dex: 6, body: 3, will: 3, move: 5,
        hp: 30,
        armorHeadSP: 7, armorBodySP: 7,
        skills: { handgun: 10, evasion: 11, meleeWeapon: 12, shoulderArms: 10 },
        weapon: {
            name: 'Poor Quality Very Heavy Pistol',
            rangeCategory: 'Pistol',
            skillKey: 'handgun',
            damageDice: '4d6',
            rof: 1,
        },
        secondaryWeapon: {
            name: 'Poor Quality Heavy Melee Weapon',
            rangeCategory: 'Melee',
            skillKey: 'meleeWeapon',
            damageDice: '4d6',
            rof: 2,
        },
        gear: ['Very Heavy Pistol Ammo x20', 'Flashlight', 'Rope', 'Neural Link w/ Interface Plugs'],
    },
    {
        id: 'hardened_bodyguard',
        displayName: 'Hardened Bodyguard',
        source: 'Interface RED Vol 2 · Ganger',
        level: 'Ganger',
        ref: 6, dex: 6, body: 7, will: 5, move: 5,
        hp: 40,
        armorHeadSP: 11, armorBodySP: 11,
        skills: { handgun: 10, evasion: 8, meleeWeapon: 6, shoulderArms: 10, brawling: 13 },
        weapon: {
            name: 'Poor Quality Shotgun',
            rangeCategory: 'Shotgun',
            skillKey: 'shoulderArms',
            damageDice: '5d6',
            rof: 1,
        },
        secondaryWeapon: {
            name: 'Brawling',
            rangeCategory: 'Melee',
            skillKey: 'brawling',
            damageDice: '3d6',
            rof: 2,
        },
        gear: ['Slug Ammo x25', 'Radio Communicator'],
    },
    {
        id: 'hardened_security_operative',
        displayName: 'Hardened Security Operative',
        source: 'Interface RED Vol 2 · Ganger',
        level: 'Ganger',
        ref: 7, dex: 4, body: 5, will: 4, move: 4,
        hp: 30,
        armorHeadSP: 11, armorBodySP: 11,
        skills: { handgun: 12, evasion: 6, meleeWeapon: 6, shoulderArms: 12, autofire: 14 },
        weapon: {
            name: 'Poor Quality Assault Rifle',
            rangeCategory: 'Assault Rifle',
            skillKey: 'shoulderArms',
            damageDice: '5d6',
            rof: 1,
        },
        secondaryWeapon: {
            name: 'Poor Quality Very Heavy Pistol',
            rangeCategory: 'Pistol',
            skillKey: 'handgun',
            damageDice: '4d6',
            rof: 2,
        },
        gear: ['Rifle Ammo x40', 'Very Heavy Pistol Ammo x20', 'Radio Communicator'],
    },
    {
        id: 'dgd_knock_knock',
        displayName: 'Knock!Knock! (6th Street)',
        source: 'Danger Gal Dossier · Ganger',
        level: 'Ganger',
        ref: 5, dex: 4, body: 9, will: 5, move: 4,
        hp: 40,
        armorHeadSP: 7, armorBodySP: 7,
        skills: { handgun: 10, evasion: 10, meleeWeapon: 10, shoulderArms: 10, brawling: 6 },
        weapon: {
            name: 'PQ Shotgun',
            rangeCategory: 'Shotgun',
            skillKey: 'shoulderArms',
            damageDice: '5d6',
            rof: 1,
        },
        secondaryWeapon: {
            name: 'Heavy Melee Weapon',
            rangeCategory: 'Melee',
            skillKey: 'meleeWeapon',
            damageDice: '3d6',
            rof: 2,
        },
        gear: ['Junk Shotgun Slug Ammo x8', 'Basic Shotgun Shell Ammo x8', 'Anti-Smog Breathing Mask', 'Handcuffs', 'Radio Communicator'],
        notes: 'Davis Squad — close-range specialist.',
    },

    // ── Lieutenant — CP:R: 44 STAT, combat base 13–14, HP 30–40, SP 11–13 ──
    {
        id: 'netrunner',
        displayName: 'Netrunner',
        source: 'CP:R Screamsheets · Lieutenant',
        level: 'Lieutenant',
        ref: 5, dex: 4, body: 3, will: 5, move: 6,
        hp: 30,
        armorHeadSP: 11, armorBodySP: 11,
        skills: { handgun: 10, evasion: 6, brawling: 6 },
        weapon: {
            name: 'Very Heavy Pistol',
            rangeCategory: 'Pistol',
            skillKey: 'handgun',
            damageDice: '4d6',
            rof: 1,
        },
        gear: ['Very Heavy Pistol Ammo x50', 'Flashlight', 'Virtuality Goggles', 'Neural Link (Interface Plugs)', 'Cyberdeck Programs'],
        notes: '1 per 2 Edgerunners. Bodyweight Suit SP 11.',
    },
    {
        id: 'reclaimer_chief',
        displayName: 'Reclaimer Chief',
        source: 'CP:R Screamsheets · Lieutenant',
        level: 'Lieutenant',
        ref: 6, dex: 6, body: 6, will: 5, move: 6,
        hp: 40,
        armorHeadSP: 11, armorBodySP: 11,
        skills: { handgun: 10, evasion: 8, meleeWeapon: 10, shoulderArms: 10, brawling: 8 },
        weapon: {
            name: 'Shotgun',
            rangeCategory: 'Shotgun',
            skillKey: 'shoulderArms',
            damageDice: '5d6',
            rof: 1,
        },
        secondaryWeapon: {
            name: 'Heavy Pistol',
            rangeCategory: 'Pistol',
            skillKey: 'handgun',
            damageDice: '3d6',
            rof: 2,
        },
        gear: ['Slug Ammo x25', 'Heavy Pistol Ammo x25', 'Agent', 'Grapple Gun', 'Radio Communicator', 'Tent & Camping Equipment'],
    },
    {
        id: 'security_officer',
        displayName: 'Security Officer',
        source: 'CP:R Screamsheets · Lieutenant',
        level: 'Lieutenant',
        ref: 8, dex: 6, body: 7, will: 5, move: 6,
        hp: 40,
        armorHeadSP: 12, armorBodySP: 12,
        skills: { handgun: 10, evasion: 10, meleeWeapon: 10, shoulderArms: 10, autofire: 12, brawling: 10 },
        weapon: {
            name: 'Assault Rifle',
            rangeCategory: 'Assault Rifle',
            skillKey: 'shoulderArms',
            damageDice: '5d6',
            rof: 1,
        },
        secondaryWeapon: {
            name: 'Very Heavy Pistol',
            rangeCategory: 'Pistol',
            skillKey: 'handgun',
            damageDice: '4d6',
            rof: 2,
        },
        gear: ['Rifle Ammo x50', 'Very Heavy Pistol Ammo x30', 'Bulletproof Shield (10 HP)', 'Handcuffs x2', 'Radio Communicator', 'Kerenzikov'],
        notes: 'REF 8 — dodges ranged. Medium Armorjack SP 12.',
    },

    // ── Captain (Mini-Boss) — CP:R: 52 STAT, combat base 14–16, counts as 3 Edgerunners ──
    {
        id: 'outrider',
        displayName: 'Outrider',
        source: 'CP:R Screamsheets · Mini-Boss',
        level: 'Mini-Boss',
        ref: 8, dex: 8, body: 6, will: 6, move: 8,
        hp: 40,
        armorHeadSP: 11, armorBodySP: 11,
        skills: { handgun: 14, evasion: 14, meleeWeapon: 12, shoulderArms: 14, autofire: 12, brawling: 14 },
        weapon: {
            name: 'Assault Rifle',
            rangeCategory: 'Assault Rifle',
            skillKey: 'shoulderArms',
            damageDice: '5d6',
            rof: 1,
        },
        secondaryWeapon: {
            name: 'Very Heavy Pistol',
            rangeCategory: 'Pistol',
            skillKey: 'handgun',
            damageDice: '4d6',
            rof: 2,
        },
        gear: ['Rifle Ammo x60', 'Very Heavy Pistol Ammo x40', 'Handcuffs x2', 'Homing Tracers', 'Radio Communicator', 'Targeting Scope Cybereye'],
        notes: 'Nomad Moto 4. 1 per 3 Edgerunners.',
    },
    {
        id: 'pyro',
        displayName: 'Pyro',
        source: 'CP:R Screamsheets · Mini-Boss',
        level: 'Mini-Boss',
        ref: 8, dex: 6, body: 5, will: 4, move: 6,
        hp: 35,
        armorHeadSP: 11, armorBodySP: 11,
        skills: { handgun: 14, evasion: 13, meleeWeapon: 13, heavyWeapons: 14, brawling: 10 },
        weapon: {
            name: 'Flamethrower',
            rangeCategory: 'Shotgun',
            skillKey: 'heavyWeapons',
            damageDice: '3d6',
            rof: 1,
        },
        secondaryWeapon: {
            name: 'Heavy Pistol',
            rangeCategory: 'Pistol',
            skillKey: 'handgun',
            damageDice: '3d6',
            rof: 2,
        },
        gear: ['Incendiary Shotgun Shells x8', 'Heavy Pistol Ammo x50', 'Incendiary Grenade x1', 'Flashbang Grenade x1', 'Anti-Dazzle Cybereyes'],
        notes: 'Solo Combat Awareness 4.',
    },

    // ── Boss — CP:R Cyberpsycho: full boss fight ──
    {
        id: 'cyberpsycho',
        displayName: 'Cyberpsycho',
        source: 'CP:R Screamsheets · Boss',
        level: 'Boss',
        ref: 8, dex: 8, body: 10, will: 7, move: 7,
        hp: 55,
        armorHeadSP: 11, armorBodySP: 11,
        skills: { handgun: 12, evasion: 13, meleeWeapon: 17, heavyWeapons: 14, autofire: 14, brawling: 15 },
        weapon: {
            name: 'Popup Heavy SMG',
            rangeCategory: 'SMG',
            skillKey: 'handgun',
            damageDice: '3d6',
            rof: 1,
        },
        secondaryWeapon: {
            name: 'Wolvers',
            rangeCategory: 'Melee',
            skillKey: 'meleeWeapon',
            damageDice: '3d6',
            rof: 2,
        },
        gear: ['AP Grenade x2', 'Heavy Pistol Ammo x100', 'Popup Grenade Launcher', 'Cybersnake', 'Grafted Muscle', 'Subdermal Armor', 'Pain Editor'],
        notes: 'EMP 0. Only deploy if the Crew is ready.',
    },

    // ── Legend — DGD Hardened Boss tier: elite Max-Tac response ──
    {
        id: 'max_tac_operator',
        displayName: 'Max-Tac Operator',
        source: 'CP:R / DGD · Legend',
        level: 'Legend',
        ref: 8, dex: 8, body: 8, will: 8, move: 8,
        hp: 50,
        armorHeadSP: 15, armorBodySP: 15,
        skills: { handgun: 16, evasion: 16, meleeWeapon: 14, shoulderArms: 16, autofire: 16, brawling: 14, heavyWeapons: 14 },
        weapon: {
            name: 'Assault Rifle',
            rangeCategory: 'Assault Rifle',
            skillKey: 'shoulderArms',
            damageDice: '5d6',
            rof: 2,
        },
        secondaryWeapon: {
            name: 'Very Heavy Pistol',
            rangeCategory: 'Pistol',
            skillKey: 'handgun',
            damageDice: '4d6',
            rof: 2,
        },
        gear: ['Rifle Ammo x100', 'AP Rifle Ammo x20', 'Very Heavy Pistol Ammo x50', 'Smart Glasses', 'Kerenzikov', 'Subdermal Armor', 'Pain Editor'],
        notes: 'Hardened Boss template. Flak SP 15. Can take a whole Crew.',
    },
];

/**
 * @param {string} templateId
 * @returns {EnemyTemplate | undefined}
 */
export function getEnemyTemplate(templateId) {
    return ENEMY_CATALOG.find((e) => e.id === templateId);
}

/**
 * @param {EnemyTemplate} template
 * @returns {ThreatTierId}
 */
export function rewardTierForTemplate(template) {
    if (template.rewardTier) return template.rewardTier;
    return ENEMY_LEVEL_TO_TIER[template.level] ?? 'mook';
}

/**
 * @param {EnemyTemplate} template
 * @returns {number}
 */
export function bountyForTemplate(template) {
    return rewardEbForTier(rewardTierForTemplate(template));
}

/**
 * @param {EnemyTemplate} template
 * @returns {string}
 */
export function bountyLabelForTemplate(template) {
    const tier = rewardTierForTemplate(template);
    return `${bountyForTemplate(template).toLocaleString()}eb (${priceLabelForTier(tier)})`;
}

/**
 * @returns {Record<ThreatTierId, EnemyTemplate[]>}
 */
export function getEnemiesByTier() {
    /** @type {Record<string, EnemyTemplate[]>} */
    const grouped = Object.fromEntries(THREAT_TIER_ORDER.map((id) => [id, []]));
    for (const enemy of ENEMY_CATALOG) {
        const tier = rewardTierForTemplate(enemy);
        if (!grouped[tier]) grouped[tier] = [];
        grouped[tier].push(enemy);
    }
    return /** @type {Record<ThreatTierId, EnemyTemplate[]>} */ (grouped);
}

/**
 * @param {EnemyTemplate} template
 * @param {string} npcId
 * @returns {import('../combat/Combatant.js').Combatant}
 */
export function combatantFromEnemyTemplate(template, npcId) {
    return {
        id: npcId,
        displayName: template.displayName,
        isPlayerControlled: false,
        ref: template.ref,
        dex: template.dex,
        body: template.body,
        will: template.will ?? template.body,
        move: template.move,
        hp: template.hp,
        maxHp: template.hp,
        armorSP: template.armorBodySP,
        armorHeadSP: template.armorHeadSP,
        skills: { ...template.skills },
        weapon: { ...template.weapon },
        secondaryWeapon: template.secondaryWeapon ? { ...template.secondaryWeapon } : undefined,
        enemyMeta: {
            templateId: template.id,
            source: template.source,
            level: template.level,
            rewardTier: rewardTierForTemplate(template),
            gear: [...template.gear],
            notes: template.notes,
            bountyEb: bountyForTemplate(template),
        },
        inventory: template.gear.map((g) => ({
            kind: 'Gear',
            name: g,
            source: template.source,
        })),
    };
}
