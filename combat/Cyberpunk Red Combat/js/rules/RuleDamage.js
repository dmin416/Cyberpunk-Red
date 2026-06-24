import { DiceRoller } from '../system/DiceRoller.js';
import { applyDamageToCombatant } from '../combat/Combatant.js';
import { updateCombatant } from '../core/GameState.js';
import { createRuleOutcome } from '../core/RuleOutcome.js';
import { markUnstableIfDamaged } from './RuleRest.js';

/**
 * Parse "2d6" style dice (v1 subset).
 * @param {string} notation
 * @returns {{ total: number, rolls: number[] }}
 */
export function rollDamageNotation(notation) {
    if (notation === '0' || notation === '—' || notation === '') {
        return { total: 0, rolls: [] };
    }
    const match = /^(\d+)d(\d+)$/.exec(notation);
    if (!match) {
        return { total: 0, rolls: [] };
    }
    const count = Number(match[1]);
    const sides = Number(match[2]);
    const rolls = [];
    let total = 0;
    for (let i = 0; i < count; i += 1) {
        const r = DiceRoller.rollDie(sides);
        rolls.push(r);
        total += r;
    }
    return { total, rolls };
}

/**
 * CP:R p186 — effective SP blocks damage; ablation shaves full worn SP when rules say so.
 * @param {number} rawDamage
 * @param {number} armorSP - actual worn SP (ablation applies here)
 * @param {{ ablationAmount?: number, onHitAblate?: number, effectiveSP?: number }} [options]
 */
export function applyArmorToDamage(rawDamage, armorSP, options = {}) {
    const effectiveSP = options.effectiveSP ?? armorSP;
    const ablationAmount = options.ablationAmount ?? 1;
    const onHitAblate = options.onHitAblate ?? 0;
    const damageThrough = Math.max(0, rawDamage - Math.max(0, effectiveSP));

    let newArmorSP = armorSP;
    let ablatedBy = 0;

    if (damageThrough > 0 && ablationAmount > 0 && armorSP > 0) {
        newArmorSP = Math.max(0, armorSP - ablationAmount);
        ablatedBy += ablationAmount;
    }

    if (onHitAblate > 0 && newArmorSP > 0) {
        const shaved = Math.min(onHitAblate, newArmorSP);
        newArmorSP -= shaved;
        ablatedBy += shaved;
    }

    return {
        damageThrough,
        newArmorSP,
        ablated: ablatedBy > 0,
        ablationAmount: ablatedBy,
    };
}

/**
 * @param {import('../core/GameState.js').GameState} state
 * @param {import('../combat/Combatant.js').Combatant} defender
 * @param {number} damageThrough
 * @param {number} newArmorSP
 * @returns {import('../core/GameState.js').GameState}
 */
export function applyDamageToState(state, defender, damageThrough, newArmorSP) {
    const wounded = markUnstableIfDamaged(
        applyDamageToCombatant(defender, damageThrough),
        damageThrough,
    );
    const withArmor = { ...wounded, armorSP: newArmorSP };
    return updateCombatant(state, withArmor);
}
