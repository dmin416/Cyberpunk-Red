import { lookupRangeDV } from '../data/RangeTableDV.js';
import { rollDefenseTotal } from './RuleCombatRolls.js';

/** CP:R p.174 — REF 8+ may dodge ranged attacks (DEX + Evasion + 1d10). */
export const DODGE_REF_THRESHOLD = 8;

/**
 * @param {import('../combat/Combatant.js').Combatant} defender
 * @returns {boolean}
 */
export function canDodgeRanged(defender) {
    return (defender.ref ?? 0) >= DODGE_REF_THRESHOLD;
}

/**
 * @param {import('../combat/Combatant.js').Combatant} defender
 * @returns {{ evasion: number, defDie: number, defenseTotal: number }}
 */
export function rollEvasionDefense(defender) {
    const { evasion, defDie, defenseTotal } = rollDefenseTotal(defender);
    return { evasion, defDie, defenseTotal };
}

/**
 * CP:R melee — DEX + Melee Skill + 1d10 vs DEX + Evasion + 1d10.
 * @param {number} attackTotal
 * @param {import('../combat/Combatant.js').Combatant} defender
 */
export function resolveMeleeHitCheck(attackTotal, defender) {
    const { evasion, defDie, defenseTotal, traceLine } = rollDefenseTotal(defender);
    const hit = attackTotal > defenseTotal;
    return {
        hit,
        defenseTotal,
        defenseMode: 'evasion',
        trace: [
            `CP:R melee: ${traceLine}`,
            hit ? 'IF attackTotal > defenseTotal THEN HIT' : 'ELSE MISS (defender wins tie)',
        ],
        narrativeLine: hit
            ? `Attack ${attackTotal} vs dodge ${defenseTotal} — hit.`
            : `Attack ${attackTotal} vs dodge ${defenseTotal} — miss.`,
    };
}

/**
 * CP:R ranged — range DV, or auto-dodge if REF ≥ 8.
 * @param {number} attackTotal
 * @param {import('../combat/Combatant.js').Combatant} defender
 * @param {string} rangeCategory
 * @param {number} distanceMeters
 */
export function resolveRangedHitCheck(attackTotal, defender, rangeCategory, distanceMeters) {
    if (canDodgeRanged(defender)) {
        const { evasion, defDie, defenseTotal, traceLine } = rollDefenseTotal(defender);
        const hit = attackTotal > defenseTotal;
        return {
            hit,
            defenseTotal,
            defenseMode: 'dodge',
            trace: [
                `CP:R: REF ${defender.ref} ≥ ${DODGE_REF_THRESHOLD} — auto dodge`,
                traceLine,
                hit ? 'IF attackTotal > dodge THEN HIT' : 'ELSE MISS (defender wins tie)',
            ],
            narrativeLine: hit
                ? `Attack ${attackTotal} vs dodge ${defenseTotal} — hit.`
                : `Attack ${attackTotal} vs dodge ${defenseTotal} — ${defender.displayName} dodges.`,
        };
    }

    const category = rangeCategory === 'Grenade' ? 'Grenade Launcher' : rangeCategory;
    const { dv, band } = lookupRangeDV(category, distanceMeters);

    if (dv == null) {
        return {
            hit: false,
            defenseTotal: null,
            defenseMode: 'range',
            trace: [`range lookup: ${category} @ ${distanceMeters}m → out of range`],
            narrativeLine: `${defender.displayName} is out of range.`,
        };
    }

    const hit = attackTotal > dv;
    return {
        hit,
        defenseTotal: dv,
        defenseMode: 'range',
        trace: [
            `CP:R: REF ${defender.ref} < ${DODGE_REF_THRESHOLD} — range DV ${dv} (${band})`,
            hit ? 'IF attackTotal > DV THEN HIT' : 'ELSE MISS (DV wins tie)',
        ],
        narrativeLine: hit
            ? `Attack ${attackTotal} vs DV ${dv} (${band}) — hit.`
            : `Attack ${attackTotal} vs DV ${dv} — miss.`,
    };
}

/**
 * @param {object} opts
 * @param {number} opts.attackTotal
 * @param {import('../combat/Combatant.js').Combatant} opts.defender
 * @param {boolean} opts.isMelee
 * @param {string} opts.rangeCategory
 * @param {number} opts.distanceMeters
 */
export function resolveAttackHit({ attackTotal, defender, isMelee, rangeCategory, distanceMeters }) {
    if (isMelee) {
        return resolveMeleeHitCheck(attackTotal, defender);
    }
    return resolveRangedHitCheck(attackTotal, defender, rangeCategory, distanceMeters);
}
