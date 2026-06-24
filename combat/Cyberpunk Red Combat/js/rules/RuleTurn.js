import { GamePhase } from '../core/GamePhase.js';
import { createRuleOutcome, rejectCommand } from '../core/RuleOutcome.js';
import {
    getActiveCombatant,
    getCombatantById,
    updateCombatant,
    beginNewTurn,
} from '../core/GameState.js';
import { advanceInitiativeQueue } from '../combat/InitiativeQueue.js';
import { isCombatantAlive } from '../combat/Combatant.js';
import { ruleResolveRangedAttack } from './RuleRangedAttack.js';
import { ruleResolveMeleeAttack } from './RuleMeleeAttack.js';
import { checkCombatEnd } from './RuleCombatEnd.js';

/**
 * @param {import('../core/GameState.js').GameState} state
 * @param {string} attackerId
 * @param {string} defenderId
 * @returns {import('../core/RuleOutcome.js').RuleOutcome}
 */
export function ruleRangedAttack(state, attackerId, defenderId) {
    if (state.phase !== GamePhase.TURN_ACTIVE) {
        return rejectCommand(state, 'Attacks only during TURN_ACTIVE.');
    }
    if (state.actionSpent) {
        return rejectCommand(state, 'Action already spent this turn.');
    }

    const active = getActiveCombatant(state);
    if (!active || active.id !== attackerId) {
        return rejectCommand(state, 'Only the active combatant may attack.');
    }

    const defender = getCombatantById(state, defenderId);
    if (!defender || !isCombatantAlive(defender)) {
        return rejectCommand(state, 'Invalid or dead target.');
    }

    if (active.weapon.rangeCategory === 'Melee') {
        return rejectCommand(state, 'No ranged weapon equipped.');
    }

    const attackOutcome = ruleResolveRangedAttack(state, active, defender);
    let nextState = {
        ...attackOutcome.nextState,
        actionSpent: true,
    };

    const endCheck = checkCombatEnd(nextState);
    if (endCheck.ended) {
        return createRuleOutcome({
            nextState: endCheck.nextState,
            narrativeLines: [...attackOutcome.narrativeLines, endCheck.narrativeLine],
            ruleTraceLines: [...attackOutcome.ruleTraceLines, ...endCheck.ruleTraceLines],
        });
    }

    return createRuleOutcome({
        nextState,
        narrativeLines: attackOutcome.narrativeLines,
        ruleTraceLines: attackOutcome.ruleTraceLines,
    });
}

/**
 * @param {import('../core/GameState.js').GameState} state
 * @param {string} attackerId
 * @param {string} defenderId
 * @returns {import('../core/RuleOutcome.js').RuleOutcome}
 */
export function ruleMeleeAttack(state, attackerId, defenderId) {
    if (state.phase !== GamePhase.TURN_ACTIVE) {
        return rejectCommand(state, 'Attacks only during TURN_ACTIVE.');
    }
    if (state.actionSpent) {
        return rejectCommand(state, 'Action already spent this turn.');
    }

    const active = getActiveCombatant(state);
    if (!active || active.id !== attackerId) {
        return rejectCommand(state, 'Only the active combatant may attack.');
    }

    const defender = getCombatantById(state, defenderId);
    if (!defender || !isCombatantAlive(defender)) {
        return rejectCommand(state, 'Invalid or dead target.');
    }

    const attackOutcome = ruleResolveMeleeAttack(state, active, defender);
    let nextState = {
        ...attackOutcome.nextState,
        actionSpent: true,
    };

    const endCheck = checkCombatEnd(nextState);
    if (endCheck.ended) {
        return createRuleOutcome({
            nextState: endCheck.nextState,
            narrativeLines: [...attackOutcome.narrativeLines, endCheck.narrativeLine],
            ruleTraceLines: [...attackOutcome.ruleTraceLines, ...endCheck.ruleTraceLines],
        });
    }

    return createRuleOutcome({
        nextState,
        narrativeLines: attackOutcome.narrativeLines,
        ruleTraceLines: attackOutcome.ruleTraceLines,
    });
}

/**
 * @param {import('../core/GameState.js').GameState} state
 * @returns {import('../core/RuleOutcome.js').RuleOutcome}
 */
export function ruleEndTurn(state) {
    if (state.phase !== GamePhase.TURN_ACTIVE) {
        return rejectCommand(state, 'Can only end turn during TURN_ACTIVE.');
    }

    const active = getActiveCombatant(state);
    const trace = ['RULE ruleEndTurn'];
    const narrative = [`${active?.displayName ?? 'Unknown'} ends their turn.`];

    const { nextState: advanced, wrappedRound } = advanceInitiativeQueue(state);
    let nextState = beginNewTurn(advanced);

    if (wrappedRound) {
        narrative.push(`— Round ${nextState.roundNumber} begins.`);
        trace.push(`IF queue wrapped THEN roundNumber = ${nextState.roundNumber}`);
    }

    const newActive = getActiveCombatant(nextState);
    if (newActive) {
        narrative.push(`${newActive.displayName} is now active.`);
    }

    const endCheck = checkCombatEnd(nextState);
    if (endCheck.ended) {
        return createRuleOutcome({
            nextState: endCheck.nextState,
            narrativeLines: [...narrative, endCheck.narrativeLine],
            ruleTraceLines: [...trace, ...endCheck.ruleTraceLines],
        });
    }

    return createRuleOutcome({
        nextState,
        narrativeLines: narrative,
        ruleTraceLines: trace,
    });
}
