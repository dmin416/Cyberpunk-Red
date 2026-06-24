import { DiceRoller } from '../system/DiceRoller.js';

/**
 * CP:R p.128 — Critical Success / Critical Failure on the d10 of a Skill Check.
 * @param {number} fixedTotal - STAT + Skill (or screamsheet skill base) before the d10
 * @returns {{
 *   total: number,
 *   firstDie: number,
 *   extraDie: number | null,
 *   critSuccess: boolean,
 *   critFailure: boolean,
 *   traceLine: string,
 * }}
 */
export function rollD10SkillCheck(fixedTotal) {
    const firstDie = DiceRoller.rollD10();
    let total = fixedTotal + firstDie;
    let extraDie = null;
    let critSuccess = false;
    let critFailure = false;
    const traceParts = [`d10(${firstDie})`];

    if (firstDie === 10) {
        critSuccess = true;
        extraDie = DiceRoller.rollD10();
        total += extraDie;
        traceParts.push(`CRIT SUCCESS +d10(${extraDie})`);
    } else if (firstDie === 1) {
        critFailure = true;
        extraDie = DiceRoller.rollD10();
        total -= extraDie;
        traceParts.push(`CRIT FAILURE −d10(${extraDie})`);
    }

    return {
        total,
        firstDie,
        extraDie,
        critSuccess,
        critFailure,
        traceLine: `${fixedTotal} + ${traceParts.join(' → ')} = ${total}`,
    };
}
