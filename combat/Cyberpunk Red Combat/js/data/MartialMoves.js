/**
 * Unarmed / Brawling attacks — damage from BODY (CP:R p.175), not fixed dice.
 * @typedef {object} MartialMove
 * @property {string} id
 * @property {string} name
 * @property {'Melee'} rangeCategory
 * @property {string} skillKey
 * @property {boolean} martialArts - if true, half armor; Brawling uses full armor
 * @property {number} rof
 */

/** @type {MartialMove[]} */
export const MARTIAL_MOVES = [
    {
        id: 'martial_brawling',
        name: 'Brawling Strike',
        rangeCategory: 'Melee',
        skillKey: 'brawling',
        martialArts: false,
        rof: 2,
    },
    {
        id: 'martial_kick',
        name: 'Kick',
        rangeCategory: 'Melee',
        skillKey: 'brawling',
        martialArts: false,
        rof: 1,
    },
    {
        id: 'martial_knee',
        name: 'Knee Strike',
        rangeCategory: 'Melee',
        skillKey: 'brawling',
        martialArts: false,
        rof: 1,
    },
    {
        id: 'martial_arts_strike',
        name: 'Martial Arts Strike',
        rangeCategory: 'Melee',
        skillKey: 'martialArts',
        martialArts: true,
        rof: 2,
    },
];

/**
 * @param {string} id
 * @returns {MartialMove | undefined}
 */
export function getMartialMoveById(id) {
    return MARTIAL_MOVES.find((m) => m.id === id);
}

/**
 * @param {import('../combat/Combatant.js').Combatant} player
 * @returns {boolean}
 */
export function playerHasWeapon(player) {
    return (player.inventory ?? []).some((i) => i.kind === 'weapon');
}
