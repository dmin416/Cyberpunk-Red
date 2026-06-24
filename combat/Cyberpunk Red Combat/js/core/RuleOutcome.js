/**
 * Every rule returns this shape. UI and narrative only consume outcomes — never invent rules.
 * @typedef {object} RuleOutcome
 * @property {boolean} accepted - Was the command legal in the current phase?
 * @property {import('./GameState.js').GameState} nextState
 * @property {string[]} narrativeLines - Player-facing prose (derived from facts)
 * @property {string[]} ruleTraceLines - Mechanical audit trail
 */

/**
 * @param {Partial<RuleOutcome> & { nextState: import('./GameState.js').GameState }} partial
 * @returns {RuleOutcome}
 */
export function createRuleOutcome(partial) {
    return {
        accepted: partial.accepted ?? true,
        nextState: partial.nextState,
        narrativeLines: partial.narrativeLines ?? [],
        ruleTraceLines: partial.ruleTraceLines ?? [],
    };
}

/**
 * @param {import('./GameState.js').GameState} state
 * @param {string} reason
 * @returns {RuleOutcome}
 */
export function rejectCommand(state, reason) {
    return createRuleOutcome({
        accepted: false,
        nextState: state,
        narrativeLines: [`[blocked] ${reason}`],
        ruleTraceLines: [`REJECT: ${reason}`],
    });
}
