import { DiceRoller } from '../system/DiceRoller.js';

/** CP:R p.187 — bonus HP when a Critical Injury is suffered. */
export const CRITICAL_INJURY_BONUS_DAMAGE = 5;

/**
 * @typedef {object} CriticalInjuryEntry
 * @property {number} roll - 2d6 total
 * @property {string} id
 * @property {string} name
 * @property {string} effect
 */

/** @type {CriticalInjuryEntry[]} */
export const BODY_CRITICAL_INJURIES = [
    { roll: 2, id: 'dismembered_arm', name: 'Dismembered Arm', effect: 'Arm gone; drop held items. +1 Base Death Save Penalty.' },
    { roll: 3, id: 'dismembered_hand', name: 'Dismembered Hand', effect: 'Hand gone; drop held items. +1 Base Death Save Penalty.' },
    { roll: 4, id: 'collapsed_lung', name: 'Collapsed Lung', effect: '−2 MOVE (min 1). +1 Base Death Save Penalty.' },
    { roll: 5, id: 'broken_ribs', name: 'Broken Ribs', effect: 'Re-suffer 5 bonus damage when moving >4m in a Turn.' },
    { roll: 6, id: 'broken_arm', name: 'Broken Arm', effect: 'Arm unusable; drop held items.' },
    { roll: 7, id: 'foreign_object_body', name: 'Foreign Object', effect: 'Re-suffer 5 bonus damage when moving >4m in a Turn.' },
    { roll: 8, id: 'broken_leg', name: 'Broken Leg', effect: '−4 MOVE (min 1).' },
    { roll: 9, id: 'torn_muscle', name: 'Torn Muscle', effect: '−2 to Melee Attacks.' },
    { roll: 10, id: 'spinal_injury', name: 'Spinal Injury', effect: 'Next Turn: no Action (Move only). +1 Base Death Save Penalty.' },
    { roll: 11, id: 'crushed_fingers', name: 'Crushed Fingers', effect: '−4 to Actions involving that hand.' },
    { roll: 12, id: 'dismembered_leg', name: 'Dismembered Leg', effect: 'Leg gone; −6 MOVE (min 1); cannot dodge. +1 Base Death Save Penalty.' },
];

/** @type {CriticalInjuryEntry[]} */
export const HEAD_CRITICAL_INJURIES = [
    { roll: 2, id: 'lost_eye', name: 'Lost Eye', effect: '−4 Ranged Attacks & visual Perception. +1 Base Death Save Penalty.' },
    { roll: 3, id: 'brain_injury', name: 'Brain Injury', effect: '−2 to all Actions. +1 Base Death Save Penalty.' },
    { roll: 4, id: 'damaged_eye', name: 'Damaged Eye', effect: '−2 Ranged Attacks & visual Perception.' },
    { roll: 5, id: 'concussion', name: 'Concussion', effect: '−2 to all Actions.' },
    { roll: 6, id: 'broken_jaw', name: 'Broken Jaw', effect: '−4 to Actions involving speech.' },
    { roll: 7, id: 'foreign_object_head', name: 'Foreign Object', effect: 'Re-suffer 5 bonus damage when moving >4m in a Turn.' },
    { roll: 8, id: 'whiplash', name: 'Whiplash', effect: '+1 Base Death Save Penalty.' },
    { roll: 9, id: 'cracked_skull', name: 'Cracked Skull', effect: 'Head aimed shots ×3 damage through SP. +1 Base Death Save Penalty.' },
    { roll: 10, id: 'damaged_ear', name: 'Damaged Ear', effect: '−2 hearing Perception; Move penalty after fast movement.' },
    { roll: 11, id: 'crushed_windpipe', name: 'Crushed Windpipe', effect: 'Cannot speak. +1 Base Death Save Penalty.' },
    { roll: 12, id: 'lost_ear', name: 'Lost Ear', effect: '−4 hearing Perception; Move penalty. +1 Base Death Save Penalty.' },
];

/**
 * @param {CriticalInjuryEntry[]} table
 * @param {string[]} existingIds
 * @returns {{ injury: CriticalInjuryEntry, rollTotal: number, dice: [number, number] } | null}
 */
export function rollCriticalInjuryFromTable(table, existingIds) {
    for (let attempt = 0; attempt < 24; attempt += 1) {
        const d1 = DiceRoller.rollDie(6);
        const d2 = DiceRoller.rollDie(6);
        const rollTotal = d1 + d2;
        const injury = table.find((e) => e.roll === rollTotal);
        if (injury && !existingIds.includes(injury.id)) {
            return { injury, rollTotal, dice: [d1, d2] };
        }
    }
    return null;
}

/**
 * @param {number[]} damageRolls
 * @returns {boolean}
 */
export function damageRollTriggersCriticalInjury(damageRolls) {
    return (damageRolls ?? []).filter((r) => r === 6).length >= 2;
}

/** @type {CriticalInjuryEntry[]} */
export const ALL_CRITICAL_INJURIES = [...BODY_CRITICAL_INJURIES, ...HEAD_CRITICAL_INJURIES];

/**
 * @param {string[]} ids
 * @returns {string}
 */
export function formatCriticalInjuryLabels(ids) {
    if (!ids?.length) return '';
    return ids
        .map((id) => ALL_CRITICAL_INJURIES.find((e) => e.id === id)?.name ?? id)
        .join(', ');
}

/**
 * @param {import('../combat/Combatant.js').Combatant} combatant
 * @returns {boolean}
 */
export function isMortallyWounded(combatant) {
    return combatant.hp < 1;
}
