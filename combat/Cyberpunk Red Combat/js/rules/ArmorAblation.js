import { getStoreItemById } from '../data/GearCatalog.js';

/**
 * Which ammo type a weapon uses (NME 01 / CP:R).
 * @param {string | undefined} weaponCatalogId
 * @returns {string | null}
 */
export function weaponAmmoType(weaponCatalogId) {
    const entry = weaponCatalogId ? getStoreItemById(weaponCatalogId) : null;
    return entry?.ammoType ?? null;
}

/**
 * Equipped ammo stack compatible with the weapon, else first matching stack in inventory.
 * @param {import('../combat/Combatant.js').Combatant} player
 * @param {string | null} ammoType
 * @returns {import('../combat/Combatant.js').InventoryItem | null}
 */
export function findLoadedAmmo(player, ammoType) {
    if (!ammoType) return null;
    const inv = player.inventory ?? [];
    const compatible = inv.filter((item) => {
        if (item.kind !== 'ammo' || (item.qty ?? 0) <= 0) return false;
        const catalog = getStoreItemById(item.catalogId);
        return catalog?.ammoType === ammoType;
    });
    return compatible.find((item) => item.equipped) ?? compatible[0] ?? null;
}

/**
 * @param {import('../data/GearCatalog.js').GearEntry | undefined} entry
 * @param {import('../data/GearCatalog.js').GearEntry | undefined} ammoEntry
 * @returns {number}
 */
export function ablationFromCatalog(entry, ammoEntry) {
    if (entry?.noArmorAblation) return 0;
    if (typeof entry?.armorAblation === 'number') return entry.armorAblation;
    if (ammoEntry?.noArmorAblation) return 0;
    if (typeof ammoEntry?.armorAblation === 'number') return ammoEntry.armorAblation;
    return 1;
}

/**
 * @param {object} params
 * @param {'weapon'|'grenade'|'martial'} params.kind
 * @param {string} [params.weaponCatalogId]
 * @param {string} [params.grenadeCatalogId]
 * @param {string} [params.ammoCatalogId]
 * @returns {number}
 */
export function resolveArmorAblation({
    kind,
    weaponCatalogId,
    grenadeCatalogId,
    ammoCatalogId,
}) {
    if (kind === 'martial') {
        return 1;
    }

    if (kind === 'grenade') {
        const grenade = grenadeCatalogId ? getStoreItemById(grenadeCatalogId) : null;
        return ablationFromCatalog(grenade, undefined);
    }

    const weapon = weaponCatalogId ? getStoreItemById(weaponCatalogId) : null;
    const ammo = ammoCatalogId ? getStoreItemById(ammoCatalogId) : null;
    return ablationFromCatalog(weapon, ammo);
}

/**
 * @param {string | undefined} catalogId
 * @returns {number}
 */
export function resolveOnHitAblate(catalogId) {
    const entry = catalogId ? getStoreItemById(catalogId) : null;
    return entry?.onHitAblate ?? 0;
}

/**
 * @param {string | undefined} catalogId
 * @returns {boolean}
 */
export function isDirectHpAttack(catalogId) {
    const entry = catalogId ? getStoreItemById(catalogId) : null;
    return Boolean(entry?.directHpDamage);
}

/**
 * @param {string | undefined} catalogId
 * @returns {boolean}
 */
export function hasNoDirectDamage(catalogId) {
    const entry = catalogId ? getStoreItemById(catalogId) : null;
    return Boolean(entry?.noDirectDamage);
}
