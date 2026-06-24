import { PlayerCommandType, createPlayerCommand } from '../core/PlayerCommand.js';
import { RuleEngine } from '../rules/RuleEngine.js';
import { isCombatantAlive } from '../combat/Combatant.js';
import { ENEMY_CATALOG } from '../data/EnemyCatalog.js';
import { hasLivingEnemies } from '../rules/RuleAttack.js';

/**
 * Classic game loop: read state → accept command → RuleEngine → apply outcome → render.
 */
export class GameLoop {
    /**
     * @param {import('../core/GameState.js').GameState} initialState
     * @param {import('../ui/UIController.js').UIController} ui
     * @param {import('../system/NarrativeLog.js').NarrativeLog} narrativeLog
     */
    constructor(initialState, ui, narrativeLog) {
        this.state = initialState;
        this.ui = ui;
        this.narrativeLog = narrativeLog;
        this.ruleTraceLines = [];
    }

    /**
     * @param {import('../core/PlayerCommand.js').PlayerCommand} command
     */
    dispatch(command) {
        if (command.type === PlayerCommandType.RESET_SESSION) {
            this.ruleTraceLines = [];
            this.narrativeLog.clear();
            this.ui.clearSelection();
        }

        const outcome = RuleEngine(this.state, command);

        this.state = outcome.nextState;

        for (const line of outcome.narrativeLines) {
            const css = line.includes('Critical Injury') || line.includes('CRIT SUCCESS') || line.includes('CRIT FAILURE')
                ? 'crit'
                : line.includes('You\'re down') || line.includes('Enemy turn')
                    ? 'rule'
                    : line.includes(' hits you') || line.includes(' misses you')
                        ? 'hit'
                        : line.includes('hit') || line.includes('Damage:')
                            ? 'hit'
                            : line.includes('down!') || line.includes('looted')
                                ? 'rule'
                                : line.startsWith('[')
                                    ? 'system'
                                    : 'default';
            this.narrativeLog.append(line, css);
        }

        for (const line of outcome.ruleTraceLines) {
            this.ruleTraceLines.push(line);
        }

        if (command.type === PlayerCommandType.ATTACK) {
            const defenderId = command.payload.defenderId;
            const defender = this.state.combatants.find((c) => c.id === defenderId);
            if (!defender || !isCombatantAlive(defender)) {
                this.ui.clearSelection();
            }
        }

        this.ui.render(this.state, this.getAvailableCommands(), this.ruleTraceLines);
    }

    /**
     * @returns {import('../core/PlayerCommand.js').PlayerCommand[]}
     */
    getAvailableCommands() {
        const commands = [];

        if (!hasLivingEnemies(this.state)) {
            for (const template of ENEMY_CATALOG) {
                commands.push(
                    createPlayerCommand(PlayerCommandType.ADD_ENEMY, { templateId: template.id }),
                );
            }
        } else if (this.state.shoppingOpen) {
            for (const template of ENEMY_CATALOG) {
                commands.push(
                    createPlayerCommand(PlayerCommandType.ADD_ENEMY, { templateId: template.id }),
                );
            }
        }

        commands.push(createPlayerCommand(PlayerCommandType.RESET_SESSION));
        return commands;
    }
}
