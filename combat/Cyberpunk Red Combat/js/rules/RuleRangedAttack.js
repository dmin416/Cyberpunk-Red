import { createRuleOutcome } from '../core/RuleOutcome.js';
import { DiceRoller } from '../system/DiceRoller.js';
import {
    applyArmorToDamage,
    applyDamageToState,
    rollDamageNotation,
} from './RuleDamage.js';
import { resolveArmorAblation } from './ArmorAblation.js';
import { resolveRangedHitCheck } from './RuleDodge.js';

/**
 * CP:R ranged: REF + Weapon Skill + 1d10 vs range DV OR DEX + Evasion + 1d10.
 * v1: defender always uses evasion if REF >= 8 OR always range DV for NPC demo simplicity.
 * @param {import('../core/GameState.js').GameState} state
 * @param {import('../combat/Combatant.js').Combatant} attacker
 * @param {import('../combat/Combatant.js').Combatant} defender
 */
export function ruleResolveRangedAttack(state, attacker, defender) {
    const trace = ['RULE ruleResolveRangedAttack'];
    const narrative = [];

    const skill = attacker.skills[attacker.weapon.skillKey] ?? 0;
    const attackDie = DiceRoller.rollD10();
    const attackTotal = attacker.ref + skill + attackDie;

    trace.push(`attackTotal = REF(${attacker.ref}) + skill(${skill}) + d10(${attackDie}) = ${attackTotal}`);

    const hitCheck = resolveRangedHitCheck(
        attackTotal,
        defender,
        attacker.weapon.rangeCategory,
        state.distanceMeters,
    );
    trace.push(...hitCheck.trace);
    const hit = hitCheck.hit;
    let nextState = state;

    if (hit) {
        narrative.push(
            `${attacker.displayName} shoots ${defender.displayName}: ${hitCheck.narrativeLine}`,
        );
    } else {
        narrative.push(
            `${attacker.displayName} shoots ${defender.displayName}: ${hitCheck.narrativeLine}`,
        );
    }

    if (hit) {
        const { total: rawDamage, rolls } = rollDamageNotation(attacker.weapon.damageDice);
        trace.push(`damage roll ${attacker.weapon.damageDice} → [${rolls.join(', ')}] = ${rawDamage}`);
        const ablationAmount = resolveArmorAblation({ kind: 'weapon', weaponCatalogId: undefined });
        const {
            damageThrough,
            newArmorSP,
            ablated,
            ablationAmount: ablatedBy,
        } = applyArmorToDamage(rawDamage, defender.armorSP, { ablationAmount });
        if (ablated) {
            trace.push(
                `CP:R armor: ${rawDamage} − SP ${defender.armorSP} = ${damageThrough} HP; ablate −${ablatedBy} SP → ${newArmorSP}`,
            );
        } else if (damageThrough > 0) {
            trace.push(`CP:R armor: ${rawDamage} − SP ${defender.armorSP} = ${damageThrough} HP; armor not ablated`);
        } else {
            trace.push(`CP:R armor: SP ${defender.armorSP} blocks all ${rawDamage} damage; armor not ablated`);
        }
        nextState = applyDamageToState(state, defender, damageThrough, newArmorSP);
        const updated = nextState.combatants.find((c) => c.id === defender.id);
        narrative.push(
            `Damage: ${rawDamage} → ${damageThrough} after armor. ${defender.displayName} at ${updated?.hp ?? 0} HP.`,
        );
    }

    return createRuleOutcome({
        nextState,
        narrativeLines: narrative,
        ruleTraceLines: trace,
    });
}
