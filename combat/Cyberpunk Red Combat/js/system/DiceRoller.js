/**
 * Seeded optional later; for now uses Math.random with explicit logging in rule trace.
 */
export const DiceRoller = {
    /**
     * @param {number} sides
     * @returns {number} 1..sides
     */
    rollDie(sides) {
        return Math.floor(Math.random() * sides) + 1;
    },

    /** @returns {number} 1..10 */
    rollD10() {
        return this.rollDie(10);
    },
};
