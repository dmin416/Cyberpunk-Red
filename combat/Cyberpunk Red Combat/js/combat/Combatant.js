/**
 * @typedef {object} WeaponProfile
 * @property {string} name
 * @property {'Pistol'|'SMG'|'Shotgun'|'Assault Rifle'|'Melee'} rangeCategory
 * @property {string} skillKey - key on combatant.skills
 * @property {string} damageDice - e.g. "2d6", "3d6"
 * @property {number} rof
 */

/**
 * @typedef {object} InventoryItem
 * @property {string} [catalogId]
 * @property {string} name
 * @property {string} kind
 * @property {string} [detail]
 * @property {string} [cost]
 * @property {string} [source]
 * @property {number} [qty]
 * @property {number} [priceEb]
 * @property {boolean} [equipped]
 */

/**
 * @typedef {object} EnemyMeta
 * @property {string} templateId
 * @property {string} source
 * @property {string} level
 * @property {string} [rewardTier]
 * @property {string[]} gear
 * @property {number} [bountyEb]
 * @property {string} [notes]
 */

/**
 * @typedef {object} Combatant
 * @property {string} id
 * @property {string} displayName
 * @property {boolean} isPlayerControlled
 * @property {number} ref
 * @property {number} dex
 * @property {number} body
 * @property {number} will
 * @property {number} move
 * @property {number} hp
 * @property {number} maxHp
 * @property {number} armorSP
 * @property {Record<string, number>} skills - e.g. handgun, evasion, meleeWeapon
 * @property {WeaponProfile} weapon
 * @property {WeaponProfile} [secondaryWeapon]
 * @property {number} [armorHeadSP]
 * @property {EnemyMeta} [enemyMeta]
 * @property {InventoryItem[]} [inventory]
 * @property {number} [eurobucks]
 * @property {number} [initiativeRoll]
 * @property {number} [initiativeTotal]
 * @property {string[]} [criticalInjuries] - active Critical Injury ids
 * @property {number} [deathSavePenalty]
 */

/**
 * @param {Partial<Combatant> & Pick<Combatant, 'id'|'displayName'>} partial
 * @returns {Combatant}
 */
export function createCombatant(partial) {
    return {
        isPlayerControlled: false,
        ref: 6,
        dex: 6,
        body: 5,
        will: 5,
        move: 6,
        hp: 20,
        maxHp: 20,
        armorSP: 0,
        skills: { handgun: 6, evasion: 6, meleeWeapon: 4 },
        weapon: {
            name: 'Medium Pistol',
            rangeCategory: 'Pistol',
            skillKey: 'handgun',
            damageDice: '2d6',
            rof: 2,
        },
        inventory: [],
        criticalInjuries: [],
        deathSavePenalty: 0,
        ...partial,
    };
}

/**
 * @param {Combatant} combatant
 * @returns {boolean}
 */
export function isCombatantAlive(combatant) {
    return combatant.hp > 0;
}

/**
 * @param {Combatant} combatant
 * @param {number} amount
 * @returns {Combatant}
 */
export function applyDamageToCombatant(combatant, amount) {
    const hp = Math.max(0, combatant.hp - amount);
    return { ...combatant, hp };
}
