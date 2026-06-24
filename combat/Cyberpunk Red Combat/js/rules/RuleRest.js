import { createRuleOutcome, rejectCommand } from '../core/RuleOutcome.js';
import { updateCombatant } from '../core/GameState.js';
import { rollD10SkillCheck } from './RuleCritCheck.js';
import { syncPlayerLoadout } from './RuleStore.js';
import {
    getWoundState,
    stabilizationDvForWoundState,
    woundStateLabel,
} from './RuleWoundState.js';
import { hasLivingEnemies } from './RuleAttack.js';

/** CP:R — every Character has First Aid at +2 minimum. */
export const MIN_FIRST_AID = 2;

/** Max days simulated in one "rest until full" action. */
export const MAX_REST_DAYS = 30;

function getPlayer(state) {
    return state.combatants.find((c) => c.isPlayerControlled);
}

/**
 * CP:R stabilize: TECH + First Aid/Paramedic + d10.
 * Solo sim uses WILL + First Aid (min 2) when TECH is not on the sheet.
 * @param {import('../combat/Combatant.js').Combatant} player
 */
function rollStabilization(player) {
    const firstAid = Math.max(MIN_FIRST_AID, player.skills?.firstAid ?? MIN_FIRST_AID);
    const tech = player.tech ?? player.will ?? 6;
    const fixed = tech + firstAid;
    const check = rollD10SkillCheck(fixed);
    return {
        ...check,
        tech,
        firstAid,
    };
}

/**
 * @param {import('../combat/Combatant.js').Combatant} player
 * @returns {import('../combat/Combatant.js').Combatant}
 */
function restoreArmorFromLoadout(player) {
    return syncPlayerLoadout(player);
}

/**
 * @param {import('../core/GameState.js').GameState} state
 * @param {import('../combat/Combatant.js').Combatant} player
 * @param {boolean} [forceStabilizeAttempt]
 */
function attemptStabilization(state, player, forceStabilizeAttempt = false) {
    const wound = getWoundState(player);
    const dv = stabilizationDvForWoundState(wound);
    const narrative = [];
    const trace = ['RULE attemptStabilization'];

    if (!dv) {
        return {
            state,
            player: { ...player, stabilized: true },
            stabilized: true,
            narrative,
            trace: [...trace, 'IF full HP THEN already stable'],
        };
    }

    if (player.stabilized && !forceStabilizeAttempt) {
        trace.push('IF already stabilized THEN skip stabilize roll');
        return { state, player, stabilized: true, narrative, trace };
    }

    const roll = rollStabilization(player);
    trace.push(
        `CP:R stabilize (${woundStateLabel(wound)} DV${dv}): TECH(${roll.tech}) + First Aid(${roll.firstAid}) + ${roll.traceLine}`,
    );

    if (roll.total <= dv) {
        narrative.push(
            `Stabilization failed (${roll.total} vs DV ${dv}). Rest aborted — try again after patching up.`,
        );
        trace.push('IF roll <= DV THEN FAIL (defender wins tie)');
        return {
            state,
            player: { ...player, stabilized: false },
            stabilized: false,
            narrative,
            trace,
        };
    }

    trace.push('IF roll > DV THEN stabilized — natural healing can begin');

    let healed = { ...player, stabilized: true };
    if (wound === 'mortal') {
        healed = { ...healed, hp: 1 };
        narrative.push(
            `Stabilized from Mortally Wounded — adrenaline fades. You wake at 1 HP (CP:R: unconscious 1 minute in combat; skipped between fights).`,
        );
        trace.push('IF Mortally Wounded THEN heal to 1 HP');
    } else {
        narrative.push(`Stabilized (${woundStateLabel(wound)}).`);
    }

    let nextState = updateCombatant(state, healed);
    return {
        state: nextState,
        player: nextState.combatants.find((c) => c.isPlayerControlled) ?? healed,
        stabilized: true,
        narrative,
        trace,
    };
}

/**
 * One full day of rest while stabilized — heal BODY HP (CP:R Trauma Team p.222).
 * @param {import('../core/GameState.js').GameState} state
 * @param {import('../combat/Combatant.js').Combatant} player
 */
function applyRestDay(state, player) {
    const narrative = [];
    const trace = ['RULE applyRestDay'];

    if (!player.stabilized) {
        trace.push('IF not stabilized THEN no HP gain');
        return { state, player, healedBy: 0, narrative, trace, atFull: false };
    }

    const maxHp = player.maxHp ?? 1;
    if (player.hp >= maxHp) {
        trace.push('IF at full HP THEN 0 HP gained');
        return { state, player, healedBy: 0, narrative, trace, atFull: true };
    }

    const healAmount = player.body ?? 1;
    const newHp = Math.min(maxHp, (player.hp ?? 0) + healAmount);
    const gained = newHp - (player.hp ?? 0);

    let healed = restoreArmorFromLoadout({ ...player, hp: newHp });
    if (newHp >= maxHp) {
        healed = { ...healed, stabilized: true };
    }

    let nextState = updateCombatant(state, healed);
    trace.push(`CP:R rest day: +${gained} HP (BODY ${player.body}) → ${newHp}/${maxHp}`);
    trace.push('IF rest day THEN repair armor to full SP (Basic Tech field patch)');

    narrative.push(
        gained > 0
            ? `Rest day: +${gained} HP (${newHp}/${maxHp}). Armor patched to full SP.`
            : 'Rest day: armor patched; already at full HP.',
    );

    return {
        state: nextState,
        player: nextState.combatants.find((c) => c.isPlayerControlled) ?? healed,
        healedBy: gained,
        narrative,
        trace,
        atFull: newHp >= maxHp,
    };
}

/**
 * @param {import('../core/GameState.js').GameState} state
 * @param {{ days?: number, untilFull?: boolean }} [options]
 * @returns {import('../core/RuleOutcome.js').RuleOutcome}
 */
export function ruleRestAndRecover(state, options = {}) {
    if (!state.shoppingOpen) {
        return rejectCommand(state, 'Cannot rest during combat — clear the area first.');
    }

    if (hasLivingEnemies(state)) {
        return rejectCommand(state, 'Cannot rest while enemies are still standing.');
    }

    const player = getPlayer(state);
    if (!player) {
        return rejectCommand(state, 'No player character.');
    }

    const maxHp = player.maxHp ?? 1;
    const needsHeal = (player.hp ?? 0) < maxHp;
    const maxArmor = restoreArmorFromLoadout(player).armorSP ?? 0;
    const needsArmor = (player.armorSP ?? 0) < maxArmor;

    if (!needsHeal && !needsArmor) {
        return rejectCommand(state, 'Already at full HP and armor — no rest needed.');
    }

    const untilFull = Boolean(options.untilFull);
    const requestedDays = untilFull ? MAX_REST_DAYS : Math.max(1, options.days ?? 1);

    const narrative = [];
    const trace = [`RULE ruleRestAndRecover${untilFull ? ' (until full)' : ''}`];
    let nextState = state;
    let current = player;

    if (needsHeal) {
        const stab = attemptStabilization(nextState, current);
        nextState = stab.state;
        current = stab.player;
        narrative.push(...stab.narrative);
        trace.push(...stab.trace);

        if (!stab.stabilized) {
            return createRuleOutcome({ nextState, narrativeLines: narrative, ruleTraceLines: trace });
        }
    } else {
        trace.push('IF full HP THEN skip stabilization — armor patch only');
    }

    let daysApplied = 0;
    for (let d = 0; d < requestedDays; d += 1) {
        if (needsHeal) {
            const day = applyRestDay(nextState, current);
            nextState = day.state;
            current = day.player;
            narrative.push(...day.narrative);
            trace.push(...day.trace);
            daysApplied += 1;

            if (untilFull && day.atFull) break;
            if (!untilFull) break;
        } else {
            current = restoreArmorFromLoadout(current);
            nextState = updateCombatant(nextState, current);
            narrative.push('Rest break: armor patched to full SP.');
            trace.push('CP:R Basic Tech: restore ablated armor SP');
            daysApplied = 1;
            break;
        }
    }

    if (untilFull && (current.hp ?? 0) < maxHp && daysApplied >= MAX_REST_DAYS) {
        narrative.push(`Rested ${MAX_REST_DAYS} days — still not at full HP.`);
        trace.push(`IF ${MAX_REST_DAYS} days exhausted THEN stop`);
    } else if (daysApplied > 1) {
        narrative.push(`Total: ${daysApplied} day(s) rest.`);
        trace.push(`total rest days: ${daysApplied}`);
    }

    return createRuleOutcome({
        nextState,
        narrativeLines: narrative,
        ruleTraceLines: trace,
    });
}

/**
 * Mark player unstabilized when they take HP damage (CP:R — wounds reopen if you push it).
 * @param {import('../combat/Combatant.js').Combatant} combatant
 * @param {number} damageThrough
 * @returns {import('../combat/Combatant.js').Combatant}
 */
export function markUnstableIfDamaged(combatant, damageThrough) {
    if (damageThrough <= 0) return combatant;
    return { ...combatant, stabilized: false };
}

/**
 * @param {import('../combat/Combatant.js').Combatant | undefined} player
 * @returns {boolean}
 */
export function playerNeedsRest(player) {
    if (!player) return false;
    const maxHp = player.maxHp ?? 1;
    if ((player.hp ?? 0) < maxHp) return true;
    if (player.stabilized === false) return true;
    const full = restoreArmorFromLoadout(player);
    return (player.armorSP ?? 0) < (full.armorSP ?? 0);
}
