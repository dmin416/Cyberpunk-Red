import { seriouslyWoundedThreshold } from './HitPoints.js';

/** @typedef {'none'|'light'|'serious'|'mortal'} WoundStateId */

/**
 * CP:R wound states (Trauma Team p.222 / FNFF p.186).
 * @param {import('../combat/Combatant.js').Combatant} combatant
 * @returns {WoundStateId}
 */
export function getWoundState(combatant) {
    const maxHp = combatant.maxHp ?? 1;
    const hp = combatant.hp ?? 0;

    if (hp < 1) return 'mortal';
    if (hp < seriouslyWoundedThreshold(maxHp)) return 'serious';
    if (hp < maxHp) return 'light';
    return 'none';
}

/**
 * @param {WoundStateId} state
 * @returns {number|null}
 */
export function stabilizationDvForWoundState(state) {
    switch (state) {
        case 'light': return 10;
        case 'serious': return 13;
        case 'mortal': return 15;
        default: return null;
    }
}

/**
 * @param {WoundStateId} state
 * @returns {string}
 */
export function woundStateLabel(state) {
    switch (state) {
        case 'light': return 'Lightly Wounded';
        case 'serious': return 'Seriously Wounded';
        case 'mortal': return 'Mortally Wounded';
        default: return 'Full HP';
    }
}
