/**
 * CP:R core rulebook ch. 16 — Buying and Selling (Market Price table).
 * @see source/Source Text/Core Rulebook/16 The New Street Economy.md
 */

/** @typedef {'cheap'|'everyday'|'costly'|'premium'|'expensive'|'very_expensive'|'luxury'|'super_luxury'} PriceCategoryKey */

/** @typedef {'mook'|'ganger'|'lieutenant'|'captain'|'boss'|'legend'} ThreatTierId */

/**
 * @typedef {object} PriceCategory
 * @property {PriceCategoryKey} key
 * @property {string} label
 * @property {number} priceEb
 */

/** @type {readonly PriceCategory[]} */
export const CP_R_PRICE_CHART = Object.freeze([
    { key: 'cheap', label: 'Cheap', priceEb: 10 },
    { key: 'everyday', label: 'Everyday', priceEb: 20 },
    { key: 'costly', label: 'Costly', priceEb: 50 },
    { key: 'premium', label: 'Premium', priceEb: 100 },
    { key: 'expensive', label: 'Expensive', priceEb: 500 },
    { key: 'very_expensive', label: 'Very Expensive', priceEb: 1000 },
    { key: 'luxury', label: 'Luxury', priceEb: 5000 },
    { key: 'super_luxury', label: 'Super Luxury', priceEb: 10000 },
]);

/**
 * Loot rewards aligned to CP:R price categories (Mook starts at Costly / 50eb).
 * @type {readonly { id: ThreatTierId, label: string, statLevel: number, priceKey: PriceCategoryKey, cpRLevel: string }[]}
 */
export const THREAT_TIERS = Object.freeze([
    { id: 'mook', label: 'Mook', statLevel: 4, priceKey: 'costly', cpRLevel: 'Mook' },
    { id: 'ganger', label: 'Ganger', statLevel: 5, priceKey: 'premium', cpRLevel: 'Ganger' },
    { id: 'lieutenant', label: 'Lieutenant', statLevel: 6, priceKey: 'expensive', cpRLevel: 'Lieutenant' },
    { id: 'captain', label: 'Captain', statLevel: 7, priceKey: 'very_expensive', cpRLevel: 'Mini-Boss' },
    { id: 'boss', label: 'Boss', statLevel: 8, priceKey: 'luxury', cpRLevel: 'Boss' },
    { id: 'legend', label: 'Legend', statLevel: 9, priceKey: 'super_luxury', cpRLevel: 'Legend' },
]);

/** @type {Readonly<Record<string, ThreatTierId>>} */
export const ENEMY_LEVEL_TO_TIER = Object.freeze({
    Mook: 'mook',
    Ganger: 'ganger',
    'Hardened Mook': 'ganger',
    Lieutenant: 'lieutenant',
    'Mini-Boss': 'captain',
    Captain: 'captain',
    Boss: 'boss',
    Legend: 'legend',
});

/** @type {readonly ThreatTierId[]} */
export const THREAT_TIER_ORDER = Object.freeze([
    'mook', 'ganger', 'lieutenant', 'captain', 'boss', 'legend',
]);

/**
 * @param {PriceCategoryKey} key
 * @returns {number}
 */
export function priceEbForCategory(key) {
    return CP_R_PRICE_CHART.find((p) => p.key === key)?.priceEb ?? 50;
}

/**
 * @param {ThreatTierId} tierId
 * @returns {number}
 */
export function rewardEbForTier(tierId) {
    const tier = THREAT_TIERS.find((t) => t.id === tierId);
    if (!tier) return priceEbForCategory('costly');
    return priceEbForCategory(tier.priceKey);
}

/**
 * @param {ThreatTierId} tierId
 * @returns {string}
 */
export function priceLabelForTier(tierId) {
    const tier = THREAT_TIERS.find((t) => t.id === tierId);
    if (!tier) return 'Costly';
    return CP_R_PRICE_CHART.find((p) => p.key === tier.priceKey)?.label ?? 'Costly';
}

/**
 * @param {ThreatTierId} tierId
 * @returns {string}
 */
export function cpRLevelLabelForTier(tierId) {
    return THREAT_TIERS.find((t) => t.id === tierId)?.cpRLevel ?? 'Mook';
}

/**
 * @param {number} statLevel
 * @returns {ThreatTierId}
 */
export function tierIdFromStatLevel(statLevel) {
    const tier = THREAT_TIERS.find((t) => t.statLevel === statLevel);
    return tier?.id ?? 'mook';
}
