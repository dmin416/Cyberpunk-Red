import { createInitialGameState } from './core/GameState.js';
import { GameLoop } from './core/GameLoop.js';
import { PlayerCommandType } from './core/PlayerCommand.js';
import { NarrativeLog } from './system/NarrativeLog.js';
import { UIController } from './ui/UIController.js';

const narrativeLog = new NarrativeLog(document.getElementById('narrativeLog'));

/** @type {GameLoop} */
let gameLoop;

const ui = new UIController(
    {
        walletBar: document.getElementById('walletBar'),
        inventoryList: document.getElementById('inventoryList'),
        storeSearch: document.getElementById('storeSearch'),
        storeCategories: document.getElementById('storeCategories'),
        storeList: document.getElementById('storeList'),
        sessionReadout: document.getElementById('sessionReadout'),
        phaseBanner: document.getElementById('phaseBanner'),
        statusHint: document.getElementById('statusHint'),
        attackPanel: document.getElementById('attackPanel'),
        attackBlock: document.getElementById('attackBlock'),
        attackTargetName: document.getElementById('attackTargetName'),
        attackOptions: document.getElementById('attackOptions'),
        turnActions: document.getElementById('turnActions'),
        narrativeLog: document.getElementById('narrativeLog'),
        ruleTrace: document.getElementById('ruleTrace'),
        addEnemyBar: document.getElementById('addEnemyBar'),
        enemyList: document.getElementById('enemyList'),
        storeSubcategories: document.getElementById('storeSubcategories'),
        characterForm: document.getElementById('characterForm'),
        characterPresets: document.getElementById('characterPresets'),
        characterHint: document.getElementById('characterHint'),
    },
    (command) => {
        if (command.type !== PlayerCommandType.RESET_SESSION) {
            ui.cancelResetConfirm();
        }
        gameLoop.dispatch(command);
    },
    () => {
        ui.render(gameLoop.state, gameLoop.getAvailableCommands(), gameLoop.ruleTraceLines);
    },
);

gameLoop = new GameLoop(createInitialGameState(), ui, narrativeLog);

narrativeLog.append('Shop, tune your character below, add enemies, then fight. Crit checks & Critical Injuries active.', 'system');

ui.render(
    gameLoop.state,
    gameLoop.getAvailableCommands(),
    gameLoop.ruleTraceLines,
);
