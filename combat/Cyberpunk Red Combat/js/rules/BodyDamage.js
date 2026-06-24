/**
 * CP:R Friday Night Firefight p.175 — Brawling and Martial Arts BODY damage.
 * | BODY | 4 or Under | 5 to 6 | 7 to 10 | 11 or Higher |
 * | Damage | 1d6 | 2d6 | 3d6 | 4d6 |
 *
 * Melee weapons use weapon classification damage instead (Light 1d6 … VH 4d6).
 * Brawling: full armor. Melee weapons & Martial Arts: half armor (round up).
 */

/**
 * @param {number} body
 * @returns {string}
 */
export function unarmedDamageDiceFromBody(body) {
    if (body <= 4) return '1d6';
    if (body <= 6) return '2d6';
    if (body <= 10) return '3d6';
    return '4d6';
}

/**
 * @param {number} body
 * @returns {string}
 */
export function formatBodyDamageLabel(body) {
    return `${unarmedDamageDiceFromBody(body)} (BODY ${body})`;
}

/**
 * @param {'martial'|'weapon'|'grenade'} kind
 * @param {string} rangeCategory
 * @param {boolean} [martialArts]
 * @returns {boolean}
 */
export function usesHalfArmor(kind, rangeCategory, martialArts = false) {
    if (kind === 'grenade' || rangeCategory === 'Grenade') return false;
    if (kind === 'martial') return martialArts;
    if (kind === 'weapon' && rangeCategory === 'Melee') return true;
    return false;
}

/**
 * @param {import('../combat/Combatant.js').Combatant} attacker
 * @param {{ kind: string, damageDice?: string, usesBodyDamage?: boolean }} source
 * @returns {string}
 */
export function resolveDamageDice(attacker, source) {
    if (source.usesBodyDamage || source.kind === 'martial') {
        return unarmedDamageDiceFromBody(attacker.body);
    }
    return source.damageDice ?? '0';
}
