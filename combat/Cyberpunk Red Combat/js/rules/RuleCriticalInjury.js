import { getStoreItemById } from '../data/GearCatalog.js';
import { updateCombatant } from '../core/GameState.js';
import { applyDamageToCombatant } from '../combat/Combatant.js';
import { markUnstableIfDamaged } from './RuleRest.js';
import {
    BODY_CRITICAL_INJURIES,
    HEAD_CRITICAL_INJURIES,
    CRITICAL_INJURY_BONUS_DAMAGE,
    damageRollTriggersCriticalInjury,
    isMortallyWounded,
    rollCriticalInjuryFromTable,
} from '../data/CriticalInjuries.js';

/**
 * @param {string | undefined} weaponCatalogId
 * @param {string | undefined} [ammoCatalogId]
 * @returns {boolean}
 */
export function allowsCriticalInjury(weaponCatalogId, ammoCatalogId) {
    const weapon = weaponCatalogId ? getStoreItemById(weaponCatalogId) : null;
    const ammo = ammoCatalogId ? getStoreItemById(ammoCatalogId) : null;
    const hay = `${weapon?.specialMechanisms ?? ''} ${ammo?.specialMechanisms ?? ''}`.toLowerCase();
    if (hay.includes('no crit injury')) return false;
    return true;
}

/**
 * @param {import('../combat/Combatant.js').Combatant} attacker
 * @param {string | undefined} weaponCatalogId
 * @returns {number}
 */
function hypurrHammerCritCount(attacker, weaponCatalogId) {
    if (weaponCatalogId !== 'hello_cutie_hypurr_hammer') return 1;
    if ((attacker.body ?? 0) >= 9) return 2;
    return 1;
}

/**
 * @param {import('../core/GameState.js').GameState} state
 * @param {import('../combat/Combatant.js').Combatant} defender
 * @param {import('../combat/Combatant.js').Combatant} attacker
 * @param {object} opts
 * @param {number[]} opts.damageRolls
 * @param {boolean} [opts.aimedHead]
 * @param {string} [opts.weaponCatalogId]
 * @param {string} [opts.ammoCatalogId]
 * @param {boolean} [opts.wasHit]
 * @returns {{ nextState: import('../core/GameState.js').GameState, narrativeLines: string[], ruleTraceLines: string[] }}
 */
export function resolveCriticalInjuries(state, defender, attacker, {
    damageRolls,
    aimedHead = false,
    weaponCatalogId,
    ammoCatalogId,
    wasHit = true,
}) {
    const narrative = [];
    const trace = [];
    let nextState = state;
    let current = defender;

    if (!wasHit || !allowsCriticalInjury(weaponCatalogId, ammoCatalogId)) {
        return { nextState, narrativeLines: narrative, ruleTraceLines: trace };
    }

    const sixesTrigger = damageRollTriggersCriticalInjury(damageRolls);
    const mortalBefore = isMortallyWounded(current);
    let triggers = sixesTrigger ? 1 : 0;
    if (mortalBefore) {
        triggers = Math.max(triggers, 1);
        trace.push('CP:R: Mortally Wounded — Critical Injury on attack damage');
    }

    if (triggers === 0) {
        return { nextState, narrativeLines: narrative, ruleTraceLines: trace };
    }

    if (sixesTrigger) {
        const sixCount = damageRolls.filter((r) => r === 6).length;
        trace.push(`CP:R: ${sixCount}× damage dice rolled 6 → Critical Injury`);
    }

    const table = aimedHead ? HEAD_CRITICAL_INJURIES : BODY_CRITICAL_INJURIES;
    const injuryCount = hypurrHammerCritCount(attacker, weaponCatalogId);
    const totalRolls = injuryCount * triggers;

    if (injuryCount > 1) {
        trace.push(`Hypurr-Hammer (BODY ${attacker.body}): pick ${injuryCount} Critical Injuries`);
    }

    for (let i = 0; i < totalRolls; i += 1) {
        const existing = current.criticalInjuries ?? [];
        const rolled = rollCriticalInjuryFromTable(table, existing);
        if (!rolled) {
            trace.push('IF all injuries already suffered THEN skip duplicate roll');
            break;
        }

        const { injury, rollTotal, dice } = rolled;
        trace.push(
            `Critical Injury table ${aimedHead ? 'head' : 'body'}: 2d6 [${dice.join(', ')}] = ${rollTotal} → ${injury.name}`,
        );
        trace.push(`IF Critical Injury THEN +${CRITICAL_INJURY_BONUS_DAMAGE} bonus HP (ignores armor)`);

        const wounded = markUnstableIfDamaged(
            applyDamageToCombatant(current, CRITICAL_INJURY_BONUS_DAMAGE),
            CRITICAL_INJURY_BONUS_DAMAGE,
        );
        const deathSavePenalty = (current.deathSavePenalty ?? 0)
            + (injury.effect.includes('Death Save Penalty') ? 1 : 0);

        current = {
            ...wounded,
            criticalInjuries: [...existing, injury.id],
            deathSavePenalty,
        };
        nextState = updateCombatant(nextState, current);

        const who = current.isPlayerControlled ? 'You suffer' : `${current.displayName} suffers`;
        narrative.push(
            `${who} Critical Injury: ${injury.name} (+${CRITICAL_INJURY_BONUS_DAMAGE} HP). ${injury.effect}`,
        );
    }

    return { nextState, narrativeLines: narrative, ruleTraceLines: trace };
}
