import { getCombatantById, updateCombatant } from '../core/GameState.js';
import { isCombatantAlive } from '../combat/Combatant.js';
import { rollAttackTotal } from './RuleCombatRolls.js';
import { resolveAttackHit } from './RuleDodge.js';
import { rollDamageNotation, applyArmorToDamage, applyDamageToState } from './RuleDamage.js';
import { usesHalfArmor } from './BodyDamage.js';
import { resolveCriticalInjuries } from './RuleCriticalInjury.js';

/**
 * @param {import('../core/GameState.js').GameState} state
 * @returns {import('../combat/Combatant.js').Combatant | undefined}
 */
function getPlayer(state) {
    return state.combatants.find((c) => c.isPlayerControlled);
}

/**
 * @param {import('../core/GameState.js').GameState} state
 */
function livingEnemies(state) {
    return state.combatants.filter((c) => !c.isPlayerControlled && isCombatantAlive(c));
}

/**
 * @typedef {object} NpcAttackSource
 * @property {string} name
 * @property {string} damageDice
 * @property {string} rangeCategory
 * @property {string} skillKey
 */

/**
 * @param {import('../core/GameState.js').GameState} state
 * @param {import('../combat/Combatant.js').Combatant} attacker
 * @param {import('../combat/Combatant.js').Combatant} defender
 * @param {NpcAttackSource} weapon
 * @returns {{ nextState: import('../core/GameState.js').GameState, narrativeLines: string[], ruleTraceLines: string[] }}
 */
export function resolveNpcAttack(state, attacker, defender, weapon) {
    const trace = [`RULE resolveNpcAttack: ${attacker.displayName} → ${defender.displayName}`];
    const narrative = [];
    const isMelee = weapon.rangeCategory === 'Melee';

    const { attackTotal, traceLine: attackTrace } = rollAttackTotal(attacker, weapon.skillKey, isMelee);
    trace.push(`attack roll: ${attackTrace}`);

    const hitCheck = resolveAttackHit({
        attackTotal,
        defender,
        isMelee,
        rangeCategory: weapon.rangeCategory,
        distanceMeters: state.distanceMeters ?? 12,
    });
    trace.push(...hitCheck.trace);

    const attackLabel = attacker.displayName;
    const defendLabel = defender.isPlayerControlled ? 'you' : defender.displayName;

    if (!hitCheck.hit) {
        narrative.push(
            `${attackLabel} misses ${defendLabel} with ${weapon.name}. ${hitCheck.narrativeLine}`,
        );
        return { nextState: state, narrativeLines: narrative, ruleTraceLines: trace };
    }

    narrative.push(
        `${attackLabel} hits ${defendLabel} with ${weapon.name}. ${hitCheck.narrativeLine}`,
    );

    const damageNotation = weapon.damageDice ?? '2d6';
    const { total: rawDamage, rolls } = rollDamageNotation(damageNotation);
    trace.push(`damage roll ${damageNotation} → [${rolls.join(', ')}] = ${rawDamage}`);

    let currentDefender = defender;

    const critOutcome = resolveCriticalInjuries(state, currentDefender, attacker, {
        damageRolls: rolls,
        wasHit: true,
    });
    let nextState = critOutcome.nextState;
    narrative.push(...critOutcome.narrativeLines);
    trace.push(...critOutcome.ruleTraceLines);
    currentDefender = getCombatantById(nextState, defender.id) ?? currentDefender;

    const halfArmor = usesHalfArmor('weapon', weapon.rangeCategory, false);
    const armorSP = halfArmor ? Math.ceil(currentDefender.armorSP / 2) : currentDefender.armorSP;
    if (halfArmor) {
        trace.push(`melee ignores half armor: SP ${currentDefender.armorSP} → effective ${armorSP}`);
    } else {
        trace.push(`ranged: full armor SP ${currentDefender.armorSP}`);
    }

    const {
        damageThrough,
        newArmorSP,
        ablated,
        ablationAmount: ablatedBy,
    } = applyArmorToDamage(rawDamage, currentDefender.armorSP, {
        effectiveSP: armorSP,
        ablationAmount: 1,
    });

    if (ablated) {
        trace.push(
            `CP:R armor: ${rawDamage} − SP ${armorSP} = ${damageThrough} HP; ablate −${ablatedBy} SP → ${newArmorSP}`,
        );
    } else if (damageThrough > 0) {
        trace.push(`CP:R armor: ${rawDamage} − SP ${armorSP} = ${damageThrough} HP; armor not ablated`);
    } else {
        trace.push(`CP:R armor: SP ${armorSP} blocks all ${rawDamage} damage; armor not ablated`);
    }

    nextState = applyDamageToState(nextState, currentDefender, damageThrough, newArmorSP);
    const updatedDefender = getCombatantById(nextState, defender.id);

    narrative.push(
        `Damage: ${rawDamage} − SP ${armorSP} = ${damageThrough} to HP${ablated ? `; armor −${ablatedBy} SP (now ${newArmorSP})` : ''}. ${currentDefender.isPlayerControlled ? 'You' : currentDefender.displayName} at ${updatedDefender?.hp ?? 0} HP.`,
    );

    return { nextState, narrativeLines: narrative, ruleTraceLines: trace };
}

/**
 * Each living enemy attacks the player with their primary weapon (ROF attacks each).
 * @param {import('../core/GameState.js').GameState} state
 * @returns {{ nextState: import('../core/GameState.js').GameState, narrativeLines: string[], ruleTraceLines: string[] }}
 */
export function resolveEnemyPhase(state) {
    const trace = ['RULE resolveEnemyPhase'];
    const narrative = ['— Enemy turn —'];

    let nextState = {
        ...state,
        combatPhase: 'enemy',
        playerAttacksRemaining: 0,
        volleySourceId: null,
    };

    const player = getPlayer(nextState);
    if (!player || !isCombatantAlive(player)) {
        trace.push('IF player down THEN skip enemy phase');
        return {
            nextState: { ...nextState, combatPhase: 'player' },
            narrativeLines: [],
            ruleTraceLines: trace,
        };
    }

    for (const enemy of livingEnemies(nextState)) {
        const currentPlayer = getPlayer(nextState);
        if (!currentPlayer || !isCombatantAlive(currentPlayer)) break;

        const weapon = enemy.weapon;
        const rof = weapon.rof ?? 1;
        trace.push(`${enemy.displayName}: ${weapon.name} ROF ${rof}`);

        for (let shot = 0; shot < rof; shot += 1) {
            const defender = getPlayer(nextState);
            if (!defender || !isCombatantAlive(defender)) break;

            const result = resolveNpcAttack(nextState, enemy, defender, weapon);
            nextState = result.nextState;
            narrative.push(...result.narrativeLines);
            trace.push(...result.ruleTraceLines);
        }
    }

    nextState = {
        ...nextState,
        combatPhase: 'player',
        playerAttacksRemaining: 0,
        volleySourceId: null,
    };

    const finalPlayer = getPlayer(nextState);
    if (finalPlayer && !isCombatantAlive(finalPlayer)) {
        narrative.push('You\'re down! Reset to try again.');
        trace.push('IF player.hp <= 0 THEN combat lost');
    } else if (livingEnemies(nextState).length > 0) {
        narrative.push('Your turn — attack again.');
        trace.push('PHASE → player');
    }

    return { nextState, narrativeLines: narrative, ruleTraceLines: trace };
}

/**
 * @param {import('../core/GameState.js').GameState} state
 * @returns {boolean}
 */
export function isPlayerAlive(state) {
    const player = getPlayer(state);
    return Boolean(player && isCombatantAlive(player));
}
