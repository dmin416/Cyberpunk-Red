import { GamePhase } from '../core/GamePhase.js';
import { createRuleOutcome, rejectCommand } from '../core/RuleOutcome.js';
import { getCombatantById, withCombatants } from '../core/GameState.js';
import { createCombatant } from '../combat/Combatant.js';
import { setInitiativeOrder } from '../combat/InitiativeQueue.js';
import { DiceRoller } from '../system/DiceRoller.js';
import { combatantFromEnemyTemplate, getEnemyTemplate } from '../data/EnemyCatalog.js';
import { STARTING_EUROBUCKS, UNARMED_WEAPON } from '../data/GearCatalog.js';
import { defaultPlayerSkills } from '../data/PlayerProfile.js';
import { syncPlayerLoadout } from './RuleStore.js';
import { hasLivingEnemies } from './RuleAttack.js';

function getPlayer(state) {
    return state.combatants.find((c) => c.isPlayerControlled);
}

function getEnemies(state) {
    return state.combatants.filter((c) => !c.isPlayerControlled);
}

/**
 * @returns {import('../combat/Combatant.js').Combatant}
 */
export function createPlayerCharacter() {
    const stat = 7;
    const player = syncPlayerLoadout(createCombatant({
        id: 'pc-1',
        displayName: 'You',
        isPlayerControlled: true,
        ref: stat,
        dex: stat,
        body: stat,
        will: stat,
        move: stat,
        baseRef: stat,
        baseDex: stat,
        baseBody: stat,
        baseWill: stat,
        baseMove: stat,
        armorSP: 0,
        eurobucks: STARTING_EUROBUCKS,
        skills: defaultPlayerSkills(stat),
        weapon: { ...UNARMED_WEAPON },
        inventory: [],
    }));
    return player;
}

/**
 * @param {import('../core/GameState.js').GameState} state
 * @param {string} [templateId]
 * @returns {import('../core/RuleOutcome.js').RuleOutcome}
 */
export function ruleAddEnemy(state, templateId = 'boosterganger') {
    if (!state.shoppingOpen && hasLivingEnemies(state)) {
        return rejectCommand(state, 'Fight in progress — finish enemies before adding more.');
    }

    const template = getEnemyTemplate(templateId);
    if (!template) {
        return rejectCommand(state, `Unknown enemy template: ${templateId}`);
    }

    const npcId = `npc-${state.nextNpcId}`;
    const enemy = combatantFromEnemyTemplate(template, npcId);
    const nextState = {
        ...withCombatants(state, [...state.combatants, enemy]),
        nextNpcId: state.nextNpcId + 1,
    };

    return createRuleOutcome({
        nextState,
        narrativeLines: [
            `${enemy.displayName} added (${template.level}, ${template.source}).`,
        ],
        ruleTraceLines: [
            `RULE ruleAddEnemy: template=${templateId}`,
            `SOURCE ${template.source}`,
        ],
    });
}

/**
 * @param {import('../core/GameState.js').GameState} state
 * @returns {import('../core/RuleOutcome.js').RuleOutcome}
 */
export function ruleRollInitiative(state) {
    if (state.phase !== GamePhase.SETUP && state.phase !== GamePhase.INITIATIVE) {
        return rejectCommand(state, 'Initiative can only be rolled before combat begins.');
    }

    const player = getPlayer(state);
    if (!player) {
        return rejectCommand(state, 'No player character.');
    }

    if (getEnemies(state).length === 0) {
        return rejectCommand(state, 'Add at least one enemy before rolling initiative.');
    }

    const trace = ['RULE ruleRollInitiative'];
    const narrative = [];
    const updated = state.combatants.map((c) => {
        const die = DiceRoller.rollD10();
        const total = c.ref + die;
        trace.push(`  ${c.displayName}: REF(${c.ref}) + 1d10(${die}) = ${total}`);
        narrative.push(`${c.displayName} rolls initiative ${total} (REF ${c.ref} + d10 ${die}).`);
        return { ...c, initiativeRoll: die, initiativeTotal: total };
    });

    const sorted = [...updated].sort((a, b) => (b.initiativeTotal ?? 0) - (a.initiativeTotal ?? 0));
    const orderedIds = sorted.map((c) => c.id);

    let next = withCombatants(state, updated);
    next = setInitiativeOrder(next, orderedIds);
    next = {
        ...next,
        phase: GamePhase.TURN_ACTIVE,
        roundNumber: 1,
        moveActionSpent: false,
        actionSpent: false,
    };

    trace.push(`IF all rolled THEN sort DESC → queue [${orderedIds.join(', ')}]`);
    trace.push('PHASE → TURN_ACTIVE');

    const active = getCombatantById(next, orderedIds[0]);
    narrative.push(`— Round 1 begins. ${active?.displayName} acts first.`);

    return createRuleOutcome({
        nextState: next,
        narrativeLines: narrative,
        ruleTraceLines: trace,
    });
}

/**
 * @param {import('../core/GameState.js').GameState} state
 * @returns {import('../core/RuleOutcome.js').RuleOutcome}
 */
export function ruleResetSession(state) {
    const player = syncPlayerLoadout(createPlayerCharacter());
    return createRuleOutcome({
        nextState: {
            ...state,
            sessionId: crypto.randomUUID(),
            combatants: [player],
            initiativeOrder: [],
            activeQueueIndex: 0,
            roundNumber: 0,
            phase: GamePhase.SETUP,
            moveActionSpent: false,
            actionSpent: false,
            winnerId: null,
            nextNpcId: 1,
            distanceMeters: 12,
            shoppingOpen: true,
            combatPhase: 'player',
            playerAttacksRemaining: 0,
            volleySourceId: null,
        },
        narrativeLines: ['Session reset. Buy gear from the Night Market store.'],
        ruleTraceLines: ['RULE ruleResetSession: full reset → SETUP'],
    });
}
