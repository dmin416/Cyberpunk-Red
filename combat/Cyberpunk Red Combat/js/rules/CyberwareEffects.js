import { getStoreItemById } from '../data/GearCatalog.js';
import { applyDerivedHp } from './HitPoints.js';

/**
 * Parse NME cyberware effect text into mechanical modifiers.
 * @param {import('../data/GearCatalog.js').GearEntry | null | undefined} entry
 * @returns {import('./CyberwareEffects.js').BodyMods | null}
 */
export function parseCyberwareBodyMods(entry) {
    if (!entry?.effect && !entry?.effectSummary) return null;

    const raw = `${entry.effect ?? ''} ${entry.effectSummary ?? ''}`
        .replace(/−/g, '-')
        .replace(/&lt;/g, '<');
    // Ignore parenthetical rule notes (e.g. "negated BODY 14+ or FBC").
    const text = raw.replace(/\([^)]*\)/g, ' ');
    /** @type {Record<string, number>} */
    const mods = {};

    const bodyBonus = text.match(/BODY\s+\+(\d+)/i);
    if (bodyBonus) {
        mods.bodyBonus = Number(bodyBonus[1]);
        const cap = text.match(/max\s+(\d+)/i);
        if (cap) mods.bodyCap = Number(cap[1]);
    } else {
        const setBody = text.match(/BODY\s+(\d+)(?!\s*\+)/i);
        if (setBody) mods.setBody = Number(setBody[1]);
    }

    const sp = text.match(/SP\s+(\d+)\s+body/i);
    if (sp) mods.cyberArmorSP = Number(sp[1]);

    const statPenalty = text.match(/(-\d+)\s*REF,\s*DEX,\s*MOVE/i);
    if (statPenalty) {
        const d = Number(statPenalty[1]);
        mods.refDelta = d;
        mods.dexDelta = d;
        mods.moveDelta = d;
    }

    const fbcCap = text.match(/REF,\s*DEX,\s*MOVE\s+set\s+to\s+(\d+)/i);
    if (fbcCap) mods.fbcStatCap = Number(fbcCap[1]);

    const setMove = text.match(/MOVE\s+(\d+)/i);
    if (setMove && !fbcCap) mods.setMove = Number(setMove[1]);

    return Object.keys(mods).length > 0 ? mods : null;
}

/**
 * @typedef {object} BodyMods
 * @property {number} [bodyBonus]
 * @property {number} [bodyCap]
 * @property {number} [setBody]
 * @property {number} [refDelta]
 * @property {number} [dexDelta]
 * @property {number} [moveDelta]
 * @property {number} [fbcStatCap]
 * @property {number} [setMove]
 * @property {number} [cyberArmorSP]
 */

/**
 * @param {import('../combat/Combatant.js').InventoryItem[]} inventory
 * @returns {BodyMods}
 */
export function aggregateCyberwareMods(inventory) {
    /** @type {BodyMods} */
    const agg = {
        bodyBonus: 0,
        refDelta: 0,
        dexDelta: 0,
        moveDelta: 0,
        cyberArmorSP: 0,
    };

    let bodyCap = Infinity;
    let setBody = null;
    let fbcStatCap = null;
    let setMove = null;

    for (const item of inventory ?? []) {
        if (item.kind !== 'cyberware' || !item.catalogId) continue;
        const mods = parseCyberwareBodyMods(getStoreItemById(item.catalogId));
        if (!mods) continue;

        if (mods.bodyBonus) agg.bodyBonus += mods.bodyBonus;
        if (mods.bodyCap != null) bodyCap = Math.min(bodyCap, mods.bodyCap);
        if (mods.setBody != null) setBody = setBody == null ? mods.setBody : Math.max(setBody, mods.setBody);
        if (mods.refDelta) agg.refDelta += mods.refDelta;
        if (mods.dexDelta) agg.dexDelta += mods.dexDelta;
        if (mods.moveDelta) agg.moveDelta += mods.moveDelta;
        if (mods.fbcStatCap != null) {
            fbcStatCap = fbcStatCap == null ? mods.fbcStatCap : Math.min(fbcStatCap, mods.fbcStatCap);
        }
        if (mods.setMove != null) setMove = setMove == null ? mods.setMove : Math.min(setMove, mods.setMove);
        if (mods.cyberArmorSP) agg.cyberArmorSP = Math.max(agg.cyberArmorSP, mods.cyberArmorSP);
    }

    if (bodyCap !== Infinity) agg.bodyCap = bodyCap;
    if (setBody != null) agg.setBody = setBody;
    if (fbcStatCap != null) agg.fbcStatCap = fbcStatCap;
    if (setMove != null) agg.setMove = setMove;

    return agg;
}

/**
 * @param {import('../combat/Combatant.js').Combatant} player
 * @param {'ref'|'dex'|'body'|'will'|'move'} key
 */
export function getBaseStat(player, key) {
    const baseKey = `base${key.charAt(0).toUpperCase()}${key.slice(1)}`;
    return player[baseKey] ?? player[key];
}

/**
 * Apply installed cyberware (all cyberware in inventory) onto base stats and armor.
 * @param {import('../combat/Combatant.js').Combatant} player
 * @returns {import('../combat/Combatant.js').Combatant}
 */
export function applyCyberwareToPlayer(player) {
    const baseRef = getBaseStat(player, 'ref');
    const baseDex = getBaseStat(player, 'dex');
    const baseBody = getBaseStat(player, 'body');
    const baseWill = getBaseStat(player, 'will');
    const baseMove = getBaseStat(player, 'move');

    const mods = aggregateCyberwareMods(player.inventory);

    let ref = baseRef + (mods.refDelta ?? 0);
    let dex = baseDex + (mods.dexDelta ?? 0);
    let move = baseMove + (mods.moveDelta ?? 0);
    let body = baseBody + (mods.bodyBonus ?? 0);

    if (mods.bodyCap != null) body = Math.min(body, mods.bodyCap);
    if (mods.setBody != null) body = Math.max(body, mods.setBody);
    if (mods.setMove != null) move = mods.setMove;

    if (mods.fbcStatCap != null) {
        ref = Math.min(ref, mods.fbcStatCap);
        dex = Math.min(dex, mods.fbcStatCap);
        move = Math.min(move, mods.fbcStatCap);
    }

    const wornArmor = player._wornArmorSP ?? 0;
    const cyberArmor = mods.cyberArmorSP ?? 0;
    const armorSP = wornArmor + cyberArmor;

    let updated = {
        ...player,
        baseRef,
        baseDex,
        baseBody,
        baseWill,
        baseMove,
        ref,
        dex,
        body,
        will: baseWill,
        move,
        armorSP,
        armorHeadSP: armorSP,
        _wornArmorSP: wornArmor,
        _cyberArmorSP: cyberArmor,
    };

    return applyDerivedHp(updated);
}
