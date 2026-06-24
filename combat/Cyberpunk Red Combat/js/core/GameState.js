import { GamePhase } from './GamePhase.js';
import { createPlayerCharacter } from '../rules/RuleEncounter.js';
import { syncPlayerLoadout } from '../rules/RuleStore.js';

/**
 * @typedef {object} GameState
 * @property {string} sessionId
 * @property {import('../combat/Combatant.js').Combatant[]} combatants
 * @property {string[]} initiativeOrder - combatant ids, high to low
 * @property {number} activeQueueIndex
 * @property {number} roundNumber
 * @property {GamePhase[keyof GamePhase]} phase
 * @property {number} distanceMeters - simplified: single distance band for demo
 * @property {boolean} moveActionSpent
 * @property {boolean} actionSpent
 * @property {string|null} winnerId
 * @property {number} nextNpcId
 * @property {boolean} shoppingOpen - true while staging gear/enemies before first attack
 * @property {'player'|'enemy'} [combatPhase] - alternating volley phase during combat
 * @property {number} [playerAttacksRemaining] - shots left in current player attack action (ROF)
 * @property {string|null} [volleySourceId] - attack source locked for current ROF volley
 */

/**
 * @returns {GameState}
 */
export function createInitialGameState() {
    const player = syncPlayerLoadout(createPlayerCharacter());
    return {
        sessionId: crypto.randomUUID(),
        combatants: [player],
        initiativeOrder: [],
        activeQueueIndex: 0,
        roundNumber: 0,
        phase: GamePhase.SETUP,
        distanceMeters: 12,
        moveActionSpent: false,
        actionSpent: false,
        winnerId: null,
        nextNpcId: 1,
        shoppingOpen: true,
        combatPhase: 'player',
        playerAttacksRemaining: 0,
        volleySourceId: null,
    };
}

/**
 * @param {GameState} state
 * @param {import('../combat/Combatant.js').Combatant[]} combatants
 * @returns {GameState}
 */
export function withCombatants(state, combatants) {
    return { ...state, combatants };
}

/**
 * @param {GameState} state
 * @param {string} id
 * @returns {import('../combat/Combatant.js').Combatant | undefined}
 */
export function getCombatantById(state, id) {
    return state.combatants.find((c) => c.id === id);
}

/**
 * @param {GameState} state
 * @param {import('../combat/Combatant.js').Combatant} updated
 * @returns {GameState}
 */
export function updateCombatant(state, updated) {
    return {
        ...state,
        combatants: state.combatants.map((c) => (c.id === updated.id ? updated : c)),
    };
}

/**
 * @param {GameState} state
 * @returns {import('../combat/Combatant.js').Combatant | undefined}
 */
export function getActiveCombatant(state) {
    const id = state.initiativeOrder[state.activeQueueIndex];
    return id ? getCombatantById(state, id) : undefined;
}

/**
 * @param {GameState} state
 * @returns {GameState}
 */
export function beginNewTurn(state) {
    return {
        ...state,
        moveActionSpent: false,
        actionSpent: false,
    };
}
