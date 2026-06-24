import { createRuleOutcome, rejectCommand } from '../core/RuleOutcome.js';
import { updateCombatant } from '../core/GameState.js';
import { hasLivingEnemies } from './RuleAttack.js';
import {
    PLAYER_SKILL_FIELDS,
    PLAYER_STAT_FIELDS,
    clampStat,
    SKILL_MIN,
    SKILL_MAX,
} from '../data/PlayerProfile.js';
import { syncPlayerLoadout } from './RuleStore.js';

function getPlayer(state) {
    return state.combatants.find((c) => c.isPlayerControlled);
}

/**
 * @param {import('../core/GameState.js').GameState} state
 * @param {{ stats?: Record<string, number>, skills?: Record<string, number> }} payload
 */
export function ruleUpdateCharacter(state, payload) {
    const inFight = !state.shoppingOpen && hasLivingEnemies(state);
    if (inFight) {
        return rejectCommand(state, 'Cannot edit character during combat.');
    }

    const player = getPlayer(state);
    if (!player) {
        return rejectCommand(state, 'No player character.');
    }

    const trace = ['RULE ruleUpdateCharacter'];
    let updated = { ...player };

    if (payload.stats) {
        for (const { key } of PLAYER_STAT_FIELDS) {
            if (payload.stats[key] == null) continue;
            const val = clampStat(payload.stats[key]);
            const baseKey = `base${key.charAt(0).toUpperCase()}${key.slice(1)}`;
            updated = { ...updated, [baseKey]: val, [key]: val };
            trace.push(`base ${key} → ${val}`);
        }
    }

    if (payload.skills) {
        const skills = { ...updated.skills };
        for (const { key } of PLAYER_SKILL_FIELDS) {
            if (payload.skills[key] == null) continue;
            skills[key] = clampStat(payload.skills[key], SKILL_MIN, SKILL_MAX);
            trace.push(`skill ${key} → ${skills[key]}`);
        }
        updated = { ...updated, skills };
    }

    updated = syncPlayerLoadout(updated);

    return createRuleOutcome({
        nextState: updateCombatant(state, updated),
        ruleTraceLines: trace,
    });
}
