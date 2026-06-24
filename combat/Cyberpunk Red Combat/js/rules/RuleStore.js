import { createRuleOutcome, rejectCommand } from '../core/RuleOutcome.js';
import { updateCombatant } from '../core/GameState.js';
import {
    getStoreItemById,
    inventoryItemFromCatalog,
    UNARMED_WEAPON,
} from '../data/GearCatalog.js';
import { applyCyberwareToPlayer } from './CyberwareEffects.js';

/** Sell back for half purchase price (rounded down). */
export function sellPriceEb(priceEb) {
    return Math.floor((priceEb ?? 0) / 2);
}

function getPlayer(state) {
    return state.combatants.find((c) => c.isPlayerControlled);
}

/**
 * Apply equipped weapon + armor from inventory onto combatant stats.
 * @param {import('../combat/Combatant.js').Combatant} player
 */
export function syncPlayerLoadout(player) {
    const inv = player.inventory ?? [];
    const equippedWeapon = inv.find((i) => i.kind === 'weapon' && i.equipped);
    const equippedArmor = inv.find((i) => i.kind === 'armor' && i.equipped);

    const weaponEntry = equippedWeapon ? getStoreItemById(equippedWeapon.catalogId) : null;
    const armorEntry = equippedArmor ? getStoreItemById(equippedArmor.catalogId) : null;
    const wornArmorSP = armorEntry?.armorSP ?? 0;

    let updated = {
        ...player,
        weapon: weaponEntry?.weapon
            ? { ...weaponEntry.weapon }
            : { ...UNARMED_WEAPON },
        _wornArmorSP: wornArmorSP,
    };

    updated = applyCyberwareToPlayer(updated);
    return updated;
}

/**
 * @param {import('../core/GameState.js').GameState} state
 * @param {string} catalogId
 * @returns {import('../core/RuleOutcome.js').RuleOutcome}
 */
export function ruleBuyItem(state, catalogId) {
    if (!state.shoppingOpen) {
        return rejectCommand(state, 'Cannot shop during combat.');
    }

    const player = getPlayer(state);
    if (!player) {
        return rejectCommand(state, 'No player character.');
    }

    const entry = getStoreItemById(catalogId);
    if (!entry) {
        return rejectCommand(state, `Unknown store item: ${catalogId}`);
    }

    if ((player.eurobucks ?? 0) < entry.priceEb) {
        return rejectCommand(state, `Not enough eurobucks (need ${entry.priceEb}eb, have ${player.eurobucks ?? 0}eb).`);
    }

    const inv = [...(player.inventory ?? [])];
    const stackable = entry.kind === 'ammo' || entry.kind === 'grenade';
    const existing = stackable ? inv.find((i) => i.catalogId === entry.id) : null;

    if (existing) {
        existing.qty = (existing.qty ?? 1) + (entry.qty ?? 1);
    } else {
        inv.push(inventoryItemFromCatalog(entry));
    }

    let updated = {
        ...player,
        eurobucks: (player.eurobucks ?? 0) - entry.priceEb,
        inventory: inv,
    };

    const hasWeapon = inv.some((i) => i.kind === 'weapon' && i.equipped);
    const hasArmor = inv.some((i) => i.kind === 'armor' && i.equipped);
    if (entry.kind === 'weapon' && !hasWeapon) {
        const item = inv.find((i) => i.catalogId === entry.id);
        if (item) item.equipped = true;
    }
    if (entry.kind === 'armor' && !hasArmor) {
        const item = inv.find((i) => i.catalogId === entry.id);
        if (item) item.equipped = true;
    }

    if (entry.kind === 'ammo' && entry.ammoType) {
        const ammoId = existing?.catalogId ?? entry.id;
        for (const item of inv) {
            if (item.kind === 'ammo') {
                item.equipped = item.catalogId === ammoId;
            }
        }
    }

    if (entry.kind === 'weapon' && entry.ammoType) {
        const compatible = inv.filter((i) => {
            if (i.kind !== 'ammo' || (i.qty ?? 0) <= 0) return false;
            const cat = getStoreItemById(i.catalogId);
            return cat?.ammoType === entry.ammoType;
        });
        if (compatible.length > 0 && !compatible.some((i) => i.equipped)) {
            compatible[0].equipped = true;
        }
    }

    updated = syncPlayerLoadout(updated);

    return createRuleOutcome({
        nextState: updateCombatant(state, updated),
        narrativeLines: [`Purchased ${entry.name} for ${entry.priceEb}eb.`],
        ruleTraceLines: [
            'RULE ruleBuyItem',
            `IF phase === SETUP AND eurobucks >= ${entry.priceEb} THEN add ${entry.id}`,
            `BALANCE ${updated.eurobucks}eb remaining`,
        ],
    });
}

/**
 * @param {import('../core/GameState.js').GameState} state
 * @param {string} catalogId
 * @returns {import('../core/RuleOutcome.js').RuleOutcome}
 */
export function ruleSellItem(state, catalogId) {
    if (!state.shoppingOpen) {
        return rejectCommand(state, 'Cannot sell during combat.');
    }

    const player = getPlayer(state);
    if (!player) {
        return rejectCommand(state, 'No player character.');
    }

    const inv = [...(player.inventory ?? [])];
    const idx = inv.findIndex((i) => i.catalogId === catalogId);
    if (idx < 0) {
        return rejectCommand(state, 'Item not in inventory.');
    }

    const item = inv[idx];
    const entry = getStoreItemById(catalogId);
    const unitPrice = item.priceEb ?? entry?.priceEb ?? 0;
    const refund = sellPriceEb(unitPrice);
    const stackable = item.kind === 'ammo' || item.kind === 'grenade';
    const qty = item.qty ?? 1;

    if (stackable && qty > 1) {
        inv[idx] = { ...item, qty: qty - 1 };
    } else {
        inv.splice(idx, 1);
    }

    let updated = {
        ...player,
        eurobucks: (player.eurobucks ?? 0) + refund,
        inventory: inv,
    };

    updated = syncPlayerLoadout(updated);

    const soldLabel = stackable && qty > 1 ? `1× ${item.name}` : item.name;

    return createRuleOutcome({
        nextState: updateCombatant(state, updated),
        narrativeLines: [`Sold ${soldLabel} for ${refund}eb.`],
        ruleTraceLines: [
            'RULE ruleSellItem',
            `REFUND ${refund}eb (50% of ${unitPrice}eb)`,
            `BALANCE ${updated.eurobucks}eb remaining`,
        ],
    });
}

/**
 * @param {import('../core/GameState.js').GameState} state
 * @param {string} catalogId
 * @returns {import('../core/RuleOutcome.js').RuleOutcome}
 */
export function ruleEquipItem(state, catalogId) {
    if (!state.shoppingOpen) {
        return rejectCommand(state, 'Cannot change loadout during combat.');
    }

    const player = getPlayer(state);
    if (!player) {
        return rejectCommand(state, 'No player character.');
    }

    const item = (player.inventory ?? []).find((i) => i.catalogId === catalogId);
    if (!item) {
        return rejectCommand(state, 'Item not in inventory.');
    }

    if (item.kind !== 'weapon' && item.kind !== 'armor' && item.kind !== 'ammo') {
        return rejectCommand(state, 'Only weapons, armor, and ammo can be equipped.');
    }

    const inv = (player.inventory ?? []).map((i) => {
        if (i.kind !== item.kind) return i;
        return { ...i, equipped: i.catalogId === catalogId };
    });

    let updated = syncPlayerLoadout({ ...player, inventory: inv });

    return createRuleOutcome({
        nextState: updateCombatant(state, updated),
        narrativeLines: [`Equipped ${item.name}.`],
        ruleTraceLines: [`RULE ruleEquipItem: ${catalogId}`],
    });
}
