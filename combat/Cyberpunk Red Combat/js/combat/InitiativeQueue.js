import { isCombatantAlive } from '../combat/Combatant.js';

/**
 * @param {import('../core/GameState.js').GameState} state
 * @param {string[]} orderedIds
 * @returns {import('../core/GameState.js').GameState}
 */
export function setInitiativeOrder(state, orderedIds) {
    return {
        ...state,
        initiativeOrder: orderedIds,
        activeQueueIndex: 0,
    };
}

/**
 * Advance to next living combatant. Skips dead. Wraps rounds.
 * @param {import('../core/GameState.js').GameState} state
 * @param {import('../core/GameState.js').GameState} state
 * @returns {{ nextState: import('../core/GameState.js').GameState, wrappedRound: boolean }}
 */
export function advanceInitiativeQueue(state) {
    if (state.initiativeOrder.length === 0) {
        return { nextState: state, wrappedRound: false };
    }

    const livingIds = state.initiativeOrder.filter((id) => {
        const c = state.combatants.find((x) => x.id === id);
        return c && isCombatantAlive(c);
    });

    if (livingIds.length <= 1) {
        return { nextState: state, wrappedRound: false };
    }

    let idx = state.activeQueueIndex;
    let wrappedRound = false;

    for (let step = 0; step < livingIds.length; step += 1) {
        idx += 1;
        if (idx >= livingIds.length) {
            idx = 0;
            wrappedRound = true;
        }
        const nextId = livingIds[idx];
        const currentId = livingIds[state.activeQueueIndex];
        if (nextId !== currentId) {
            const newIndex = livingIds.indexOf(nextId);
            return {
                nextState: {
                    ...state,
                    initiativeOrder: livingIds,
                    activeQueueIndex: newIndex,
                    roundNumber: wrappedRound ? state.roundNumber + 1 : state.roundNumber,
                },
                wrappedRound,
            };
        }
    }

    return { nextState: state, wrappedRound: false };
}
