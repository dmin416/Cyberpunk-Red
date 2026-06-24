/** CP:R stat and skill fields exposed in the character customizer. */

export const PLAYER_STAT_FIELDS = Object.freeze([
    { key: 'ref', label: 'REF' },
    { key: 'dex', label: 'DEX' },
    { key: 'body', label: 'BODY' },
    { key: 'will', label: 'WILL' },
    { key: 'move', label: 'MOVE' },
]);

export const PLAYER_SKILL_FIELDS = Object.freeze([
    { key: 'handgun', label: 'Handgun' },
    { key: 'shoulderArms', label: 'Shoulder Arms' },
    { key: 'heavyWeapons', label: 'Heavy Weapons' },
    { key: 'meleeWeapon', label: 'Melee Weapon' },
    { key: 'brawling', label: 'Brawling' },
    { key: 'athletics', label: 'Athletics' },
    { key: 'archery', label: 'Archery' },
    { key: 'evasion', label: 'Evasion' },
]);

export const STAT_MIN = 1;
export const STAT_MAX = 20;
export const SKILL_MIN = 0;
export const SKILL_MAX = 20;

/** Quick-fill presets — all stats and skills set to the same rating. */
export const CHARACTER_PRESETS = Object.freeze([
    { id: 'mook', label: 'Mook', level: 4 },
    { id: 'ganger', label: 'Ganger', level: 5 },
    { id: 'lieutenant', label: 'Lieutenant', level: 6 },
    { id: 'captain', label: 'Captain', level: 7 },
    { id: 'boss', label: 'Boss', level: 8 },
    { id: 'legend', label: 'Legend', level: 9 },
]);

/**
 * @param {number} level
 * @returns {{ stats: Record<string, number>, skills: Record<string, number> }}
 */
export function characterPresetPayload(level) {
    const stats = Object.fromEntries(PLAYER_STAT_FIELDS.map(({ key }) => [key, level]));
    const skills = Object.fromEntries(PLAYER_SKILL_FIELDS.map(({ key }) => [key, level]));
    return { stats, skills };
}

/** @returns {Record<string, number>} */
export function defaultPlayerSkills(stat = 7) {
    return Object.fromEntries(PLAYER_SKILL_FIELDS.map(({ key }) => [key, stat]));
}

/**
 * @param {number} value
 * @param {number} min
 * @param {number} max
 */
export function clampStat(value, min = STAT_MIN, max = STAT_MAX) {
    return Math.max(min, Math.min(max, Math.round(Number(value) || min)));
}
