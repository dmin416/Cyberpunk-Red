/**
 * Single-shot range DVs — CP:R Friday Night Firefight (simplified subset for v1).
 * Keys: weaponRangeCategory → distance band → DV
 */
export const RangeTableDV = Object.freeze({
    Pistol: Object.freeze({
        6: 13,
        12: 15,
        25: 20,
        50: 25,
        100: 30,
    }),
    SMG: Object.freeze({
        6: 15,
        12: 13,
        25: 15,
        50: 20,
        100: 25,
    }),
    Shotgun: Object.freeze({
        6: 13,
        12: 15,
        25: 20,
        50: 25,
        100: 30,
    }),
    'Assault Rifle': Object.freeze({
        6: 17,
        12: 16,
        25: 17,
        50: 20,
        100: 25,
        200: 30,
    }),
    'Grenade Launcher': Object.freeze({
        6: 16,
        12: 15,
        25: 15,
        50: 17,
        100: 20,
        200: 22,
    }),
});

/**
 * @param {string} weaponRangeCategory
 * @param {number} distanceMeters
 * @returns {{ dv: number | null, band: string }}
 */
export function lookupRangeDV(weaponRangeCategory, distanceMeters) {
    const table = RangeTableDV[weaponRangeCategory];
    if (!table) {
        return { dv: null, band: 'unknown' };
    }

    if (distanceMeters <= 6) {
        return { dv: table[6], band: '0–6 m/yds' };
    }
    if (distanceMeters <= 12) {
        return { dv: table[12], band: '7–12 m/yds' };
    }
    if (distanceMeters <= 25) {
        return { dv: table[25], band: '13–25 m/yds' };
    }
    if (distanceMeters <= 50) {
        return { dv: table[50], band: '26–50 m/yds' };
    }
    if (distanceMeters <= 100) {
        return { dv: table[100], band: '51–100 m/yds' };
    }
    if (table[200] && distanceMeters <= 200) {
        return { dv: table[200], band: '101–200 m/yds' };
    }

    return { dv: null, band: 'out of range' };
}
