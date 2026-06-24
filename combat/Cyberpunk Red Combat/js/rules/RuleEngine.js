import { PlayerCommandType } from '../core/PlayerCommand.js';
import { rejectCommand } from '../core/RuleOutcome.js';
import {
    ruleResetSession,
    ruleAddEnemy,
} from './RuleEncounter.js';
import { ruleBuyItem, ruleEquipItem, ruleSellItem } from './RuleStore.js';
import { rulePlayerAttack } from './RuleAttack.js';
import { ruleUpdateCharacter } from './RuleCharacter.js';

/**
 * Single entry point for all mechanical resolution.
 */
export function RuleEngine(state, command) {
    switch (command.type) {
        case PlayerCommandType.BUY_ITEM:
            return ruleBuyItem(state, command.payload.catalogId);

        case PlayerCommandType.EQUIP_ITEM:
            return ruleEquipItem(state, command.payload.catalogId);

        case PlayerCommandType.SELL_ITEM:
            return ruleSellItem(state, command.payload.catalogId);

        case PlayerCommandType.ADD_ENEMY:
            return ruleAddEnemy(state, command.payload.templateId);

        case PlayerCommandType.ATTACK:
            return rulePlayerAttack(
                state,
                command.payload.defenderId,
                command.payload.sourceId,
            );

        case PlayerCommandType.RESET_SESSION:
            return ruleResetSession(state);

        case PlayerCommandType.UPDATE_CHARACTER:
            return ruleUpdateCharacter(state, command.payload);

        default:
            return rejectCommand(state, `Unknown command type: ${command.type}`);
    }
}
