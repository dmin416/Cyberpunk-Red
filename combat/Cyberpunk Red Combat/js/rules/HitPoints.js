/**
 * CP:R Fitted for the Future p.79 — derived Hit Points.
 * HP = 10 + 5 × ceil((BODY + WILL) / 2)
 */

/**
 * @param {number} body
 * @param {number} will
 * @returns {number}
 */
export function maxHpFromBodyWill(body, will) {
    const avg = Math.ceil((body + will) / 2);
    return 10 + 5 * avg;
}

/**
 * Seriously Wounded threshold — less than half max HP (round up).
 * @param {number} maxHp
 * @returns {number}
 */
export function seriouslyWoundedThreshold(maxHp) {
    return Math.ceil(maxHp / 2);
}

/**
 * Recompute maxHp from BODY/WILL and adjust current HP (full if was at max).
 * @param {import('../combat/Combatant.js').Combatant} combatant
 * @returns {import('../combat/Combatant.js').Combatant}
 */
export function applyDerivedHp(combatant) {
    const will = combatant.will ?? combatant.body;
    const maxHp = maxHpFromBodyWill(combatant.body, will);
    const prevMax = combatant.maxHp ?? maxHp;
    let hp = combatant.hp ?? maxHp;

    if (prevMax > 0 && hp >= prevMax) {
        hp = maxHp;
    } else if (hp > maxHp) {
        hp = maxHp;
    }

    return { ...combatant, will, maxHp, hp };
}
