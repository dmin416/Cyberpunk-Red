import { createRuleOutcome } from '../core/RuleOutcome.js';
import { DiceRoller } from '../system/DiceRoller.js';
import {
    applyArmorToDamage,
    applyDamageToState,
    rollDamageNotation,
} from './RuleDamage.js';
import { resolveArmorAblation } from './ArmorAblation.js';
import { unarmedDamageDiceFromBody } from './BodyDamage.js';
import { resolveMeleeHitCheck } from './RuleDodge.js';

/**
 * CP:R melee: DEX + Melee Skill + 1d10 vs DEX + Evasion + 1d10.
 * Melee ignores half armor (round up). v1: single strike per action (ROF 2 later).
 * @param {import('../core/GameState.js').GameState} state
 * @param {import('../combat/Combatant.js').Combatant} attacker
 * @param {import('../combat/Combatant.js').Combatant} defender
 */
export function ruleResolveMeleeAttack(state, attacker, defender) {
    const trace = ['RULE ruleResolveMeleeAttack'];
    const narrative = [];

    const skill = attacker.skills.meleeWeapon ?? attacker.skills.brawling ?? 0;
    const meleeWeapon = attacker.weapon.rangeCategory === 'Melee'
        ? attacker.weapon
        : attacker.secondaryWeapon?.rangeCategory === 'Melee'
            ? attacker.secondaryWeapon
            : attacker.weapon;
    const attackDie = DiceRoller.rollD10();
    const attackTotal = attacker.dex + skill + attackDie;

    trace.push(`attack = DEX(${attacker.dex}) + Melee(${skill}) + d10(${attackDie}) = ${attackTotal}`);

    const hitCheck = resolveMeleeHitCheck(attackTotal, defender);
    trace.push(...hitCheck.trace);

    let nextState = state;

    if (hitCheck.hit) {
        narrative.push(
            `${attacker.displayName} strikes ${defender.displayName}: ${hitCheck.narrativeLine}`,
        );

        const isUnarmed = meleeWeapon.skillKey === 'brawling'
            || meleeWeapon.name === 'Unarmed';
        const damageNotation = isUnarmed
            ? unarmedDamageDiceFromBody(attacker.body)
            : meleeWeapon.damageDice;
        const effectiveSP = isUnarmed
            ? defender.armorSP
            : Math.ceil(defender.armorSP / 2);

        trace.push(isUnarmed
            ? `Brawling: BODY ${attacker.body} → ${damageNotation}, full armor`
            : `melee weapon: ${meleeWeapon.name}`);
        if (!isUnarmed) {
            trace.push(`melee ignores half armor: SP ${defender.armorSP} → effective ${effectiveSP}`);
        }
        trace.push(`damage ${damageNotation} → roll`);

        const { total: rawDamage, rolls } = rollDamageNotation(damageNotation);
        trace.push(`[${rolls.join(', ')}] = ${rawDamage}`);

        const {
            damageThrough,
            newArmorSP,
            ablated,
            ablationAmount: ablatedBy,
        } = applyArmorToDamage(rawDamage, defender.armorSP, {
            effectiveSP,
            ablationAmount: resolveArmorAblation({ kind: 'martial' }),
        });

        if (ablated) {
            trace.push(
                `CP:R armor: ${rawDamage} − SP ${effectiveSP} = ${damageThrough} HP; ablate −${ablatedBy} SP → ${newArmorSP}`,
            );
        } else if (damageThrough > 0) {
            trace.push(`CP:R armor: ${rawDamage} − SP ${effectiveSP} = ${damageThrough} HP; armor not ablated`);
        } else {
            trace.push(`CP:R armor: SP ${effectiveSP} blocks all ${rawDamage} damage; armor not ablated`);
        }
        nextState = applyDamageToState(state, defender, damageThrough, newArmorSP);

        const updated = nextState.combatants.find((c) => c.id === defender.id);
        narrative.push(
            `Damage: ${rawDamage} → ${damageThrough} after half-SP. ${defender.displayName} at ${updated?.hp ?? 0} HP.`,
        );
    } else {
        narrative.push(
            `${attacker.displayName} strikes ${defender.displayName}: ${hitCheck.narrativeLine}`,
        );
    }

    return createRuleOutcome({
        nextState,
        narrativeLines: narrative,
        ruleTraceLines: trace,
    });
}
