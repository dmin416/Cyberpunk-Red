import { GamePhase } from '../core/GamePhase.js';
import { isCombatantAlive } from '../combat/Combatant.js';

/**
 * @param {import('../core/GameState.js').GameState} state
 * @returns {{ ended: boolean, nextState: import('../core/GameState.js').GameState, narrativeLine: string, ruleTraceLines: string[] }}
 */
export function checkCombatEnd(state) {
    const living = state.combatants.filter(isCombatantAlive);

    if (living.length > 1) {
        return {
            ended: false,
            nextState: state,
            narrativeLine: '',
            ruleTraceLines: [],
        };
    }

    const winner = living[0];
    const trace = ['RULE checkCombatEnd', `IF living.count <= 1 THEN COMBAT_END`];
    const line = winner
        ? `Combat over. ${winner.displayName} is the last one standing.`
        : 'Combat over. Everyone is down.';

    return {
        ended: true,
        nextState: {
            ...state,
            phase: GamePhase.COMBAT_END,
            winnerId: winner?.id ?? null,
        },
        narrativeLine: line,
        ruleTraceLines: trace,
    };
}
