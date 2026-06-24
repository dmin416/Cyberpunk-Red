import { rollD10SkillCheck } from './RuleCritCheck.js';

/**
 * @param {{ firstDie: number, extraDie: number | null, critSuccess: boolean, critFailure: boolean, total: number }} check
 * @returns {string}
 */
function formatD10CritTrace(check) {
    if (check.critSuccess) {
        return `d10(${check.firstDie}) CRIT SUCCESS +d10(${check.extraDie}) = ${check.total}`;
    }
    if (check.critFailure) {
        return `d10(${check.firstDie}) CRIT FAILURE −d10(${check.extraDie}) = ${check.total}`;
    }
    return `d10(${check.firstDie}) = ${check.total}`;
}

/**
 * CP:R — player characters use STAT + Skill + d10.
 * NPC screamsheet entries store Skill Bases (STAT + Skill combined).
 *
 * @param {import('../combat/Combatant.js').Combatant} combatant
 * @param {string} skillKey
 * @param {boolean} isMelee
 */
export function rollAttackTotal(combatant, skillKey, isMelee) {
    if (combatant.isPlayerControlled) {
        const stat = isMelee ? combatant.dex : combatant.ref;
        const skill = combatant.skills?.[skillKey] ?? 0;
        const check = rollD10SkillCheck(stat + skill);
        return {
            attackTotal: check.total,
            attackDie: check.firstDie,
            critSuccess: check.critSuccess,
            critFailure: check.critFailure,
            traceLine: `${isMelee ? 'DEX' : 'REF'}(${stat}) + ${skillKey}(${skill}) + ${formatD10CritTrace(check)}`,
        };
    }

    const base = combatant.skills?.[skillKey] ?? 0;
    const check = rollD10SkillCheck(base);
    return {
        attackTotal: check.total,
        attackDie: check.firstDie,
        critSuccess: check.critSuccess,
        critFailure: check.critFailure,
        traceLine: `${skillKey} base(${base}) + ${formatD10CritTrace(check)}`,
    };
}

/**
 * @param {import('../combat/Combatant.js').Combatant} defender
 */
export function rollDefenseTotal(defender) {
    if (defender.isPlayerControlled) {
        const evasion = defender.skills?.evasion ?? 0;
        const check = rollD10SkillCheck(defender.dex + evasion);
        return {
            evasion,
            defDie: check.firstDie,
            defenseTotal: check.total,
            critSuccess: check.critSuccess,
            critFailure: check.critFailure,
            traceLine: `DEX(${defender.dex}) + Evasion(${evasion}) + ${formatD10CritTrace(check)}`,
        };
    }

    const evasionBase = defender.skills?.evasion ?? 0;
    const check = rollD10SkillCheck(evasionBase);
    return {
        evasion: evasionBase,
        defDie: check.firstDie,
        defenseTotal: check.total,
        critSuccess: check.critSuccess,
        critFailure: check.critFailure,
        traceLine: `Evasion base(${evasionBase}) + ${formatD10CritTrace(check)}`,
    };
}
