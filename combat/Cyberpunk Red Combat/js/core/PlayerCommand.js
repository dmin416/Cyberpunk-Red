/** @readonly */
export const PlayerCommandType = Object.freeze({
    BUY_ITEM: 'BUY_ITEM',
    EQUIP_ITEM: 'EQUIP_ITEM',
    ADD_ENEMY: 'ADD_ENEMY',
    ROLL_INITIATIVE: 'ROLL_INITIATIVE',
    RANGED_ATTACK: 'RANGED_ATTACK',
    MELEE_ATTACK: 'MELEE_ATTACK',
    END_TURN: 'END_TURN',
    ATTACK: 'ATTACK',
    RESET_SESSION: 'RESET_SESSION',
    SELL_ITEM: 'SELL_ITEM',
    UPDATE_CHARACTER: 'UPDATE_CHARACTER',
});

/**
 * @param {string} type
 * @param {Record<string, unknown>} [payload]
 */
export function createPlayerCommand(type, payload = {}) {
    return Object.freeze({ type, payload });
}
