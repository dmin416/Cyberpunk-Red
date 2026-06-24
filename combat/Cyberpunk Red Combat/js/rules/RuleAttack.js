import { createRuleOutcome, rejectCommand } from '../core/RuleOutcome.js';
import { getCombatantById, updateCombatant } from '../core/GameState.js';
import { isCombatantAlive } from '../combat/Combatant.js';
import { getStoreItemById } from '../data/GearCatalog.js';
import { rewardEbForTier } from '../data/PriceChart.js';
import { getMartialMoveById } from '../data/MartialMoves.js';
import { rollDamageNotation, applyArmorToDamage, applyDamageToState } from './RuleDamage.js';
import {
    findLoadedAmmo,
    resolveArmorAblation,
    resolveOnHitAblate,
    isDirectHpAttack,
    hasNoDirectDamage,
    weaponAmmoType,
} from './ArmorAblation.js';
import {
    formatBodyDamageLabel,
    resolveDamageDice,
    usesHalfArmor,
} from './BodyDamage.js';
import { resolveAttackHit } from './RuleDodge.js';
import { rollAttackTotal } from './RuleCombatRolls.js';
import { resolveEnemyPhase, isPlayerAlive } from './RuleEnemyTurn.js';
import { resolveCriticalInjuries } from './RuleCriticalInjury.js';

function getPlayer(state) {
    return state.combatants.find((c) => c.isPlayerControlled);
}

function livingEnemies(state) {
    return state.combatants.filter((c) => !c.isPlayerControlled && isCombatantAlive(c));
}

/**
 * @typedef {object} AttackSource
 * @property {string} name
 * @property {string} [damageDice]
 * @property {string} rangeCategory
 * @property {'martial'|'weapon'|'grenade'} kind
 * @property {boolean} [usesBodyDamage]
 * @property {boolean} [martialArts]
 * @property {boolean} [consumable]
 * @property {string} [catalogId]
 * @property {string} [weaponCatalogId]
 * @property {string} [ammoCatalogId]
 */

/**
 * @param {import('../combat/Combatant.js').Combatant} player
 * @param {string} sourceId
 * @returns {AttackSource | null}
 */
export function resolveAttackSource(player, sourceId) {
    const martial = getMartialMoveById(sourceId);
    if (martial) {
        return {
            name: martial.name,
            rangeCategory: martial.rangeCategory,
            kind: 'martial',
            usesBodyDamage: true,
            martialArts: martial.martialArts,
        };
    }

    const invItem = (player.inventory ?? []).find((i) => i.catalogId === sourceId);
    if (!invItem) return null;

    const catalog = getStoreItemById(sourceId);
    if (!catalog) return null;

    if (invItem.kind === 'weapon' && catalog.weapon) {
        const ammoType = weaponAmmoType(sourceId);
        const loadedAmmo = catalog.weapon.rangeCategory === 'Melee'
            ? null
            : findLoadedAmmo(player, ammoType);
        return {
            name: catalog.name,
            damageDice: catalog.weapon.damageDice,
            rangeCategory: catalog.weapon.rangeCategory,
            kind: 'weapon',
            usesBodyDamage: false,
            catalogId: sourceId,
            weaponCatalogId: sourceId,
            ammoCatalogId: loadedAmmo?.catalogId,
        };
    }

    if (invItem.kind === 'grenade') {
        const damageDice = catalog.weapon?.damageDice ?? '6d6';
        return {
            name: catalog.name,
            damageDice,
            rangeCategory: 'Grenade',
            kind: 'grenade',
            usesBodyDamage: false,
            consumable: true,
            catalogId: sourceId,
            grenadeCatalogId: sourceId,
        };
    }

    return null;
}

/**
 * @param {string} sourceId
 * @returns {number}
 */
export function getSourceRof(sourceId) {
    const martial = getMartialMoveById(sourceId);
    if (martial) return martial.rof ?? 1;

    const catalog = getStoreItemById(sourceId);
    if (catalog?.weapon) return catalog.weapon.rof ?? 1;
    if (catalog?.kind === 'grenade') return 1;

    return 1;
}

/**
 * @param {import('../core/GameState.js').GameState} state
 * @param {string[]} narrative
 * @param {string[]} trace
 * @param {{ attacksRemainingAfter: number, sourceId: string }} volley
 * @returns {import('../core/RuleOutcome.js').RuleOutcome}
 */
function finishPlayerAttack(state, narrative, trace, { attacksRemainingAfter, sourceId }) {
    let nextState = {
        ...state,
        shoppingOpen: livingEnemies(state).length === 0 ? state.shoppingOpen : false,
        combatPhase: 'player',
        playerAttacksRemaining: attacksRemainingAfter,
        volleySourceId: attacksRemainingAfter > 0 ? sourceId : null,
    };

    if (livingEnemies(nextState).length === 0 || !isPlayerAlive(nextState)) {
        nextState = {
            ...nextState,
            playerAttacksRemaining: 0,
            volleySourceId: null,
        };
        return createRuleOutcome({ nextState, narrativeLines: narrative, ruleTraceLines: trace });
    }

    if (attacksRemainingAfter > 0) {
        narrative.push(`ROF: ${attacksRemainingAfter} attack${attacksRemainingAfter === 1 ? '' : 's'} remaining this action.`);
        trace.push(`IF ROF remaining THEN ${attacksRemainingAfter} shot(s) left`);
        return createRuleOutcome({ nextState, narrativeLines: narrative, ruleTraceLines: trace });
    }

    trace.push('IF ROF exhausted THEN enemy turn');
    const enemyPhase = resolveEnemyPhase(nextState);
    return createRuleOutcome({
        nextState: enemyPhase.nextState,
        narrativeLines: [...narrative, ...enemyPhase.narrativeLines],
        ruleTraceLines: [...trace, ...enemyPhase.ruleTraceLines],
    });
}

/**
 * @param {import('../core/GameState.js').GameState} state
 * @param {string} defenderId
 * @param {string} sourceId
 * @returns {import('../core/RuleOutcome.js').RuleOutcome}
 */
export function rulePlayerAttack(state, defenderId, sourceId) {
    if (livingEnemies(state).length === 0) {
        return rejectCommand(state, 'No enemies to attack.');
    }

    if (!isPlayerAlive(state)) {
        return rejectCommand(state, 'You\'re down — reset to continue.');
    }

    if (state.combatPhase === 'enemy') {
        return rejectCommand(state, 'Enemy turn in progress.');
    }

    const player = getPlayer(state);
    if (!player) {
        return rejectCommand(state, 'No player character.');
    }

    if (
        state.playerAttacksRemaining > 0
        && state.volleySourceId
        && state.volleySourceId !== sourceId
    ) {
        return rejectCommand(
            state,
            `Finish your attack action first (${state.playerAttacksRemaining} shot${state.playerAttacksRemaining === 1 ? '' : 's'} left at ROF).`,
        );
    }

    let defender = getCombatantById(state, defenderId);
    if (!defender || !isCombatantAlive(defender)) {
        return rejectCommand(state, 'Invalid or dead target.');
    }

    const source = resolveAttackSource(player, sourceId);
    if (!source) {
        return rejectCommand(state, 'Invalid attack source.');
    }

    if (source.kind === 'weapon' && source.rangeCategory !== 'Melee' && source.weaponCatalogId) {
        const needed = weaponAmmoType(source.weaponCatalogId);
        if (needed && !source.ammoCatalogId) {
            return rejectCommand(state, `No ${needed} ammo loaded for ${source.name}. Buy ammo and click Equip, or buy a compatible stack.`);
        }
    }

    const rof = getSourceRof(sourceId);
    const startingVolley = (state.playerAttacksRemaining ?? 0) <= 0;
    const attacksRemainingAfter = startingVolley ? rof - 1 : (state.playerAttacksRemaining ?? 0) - 1;

    const trace = ['RULE rulePlayerAttack'];
    if (startingVolley) {
        trace.push(`ROF ${rof}: starting attack action with ${source.name}`);
    } else {
        trace.push(`ROF volley: ${attacksRemainingAfter + 1} shot(s) remaining after this one`);
    }
    const narrative = [];
    const isMelee = source.rangeCategory === 'Melee';

    const skillKey = source.usesBodyDamage
        ? 'brawling'
        : (getStoreItemById(source.weaponCatalogId ?? '')?.weapon?.skillKey ?? (isMelee ? 'meleeWeapon' : 'handgun'));
    const { attackTotal, traceLine: attackTrace } = rollAttackTotal(player, skillKey, isMelee);
    trace.push(`attack roll: ${attackTrace}`);

    const hitCheck = resolveAttackHit({
        attackTotal,
        defender,
        isMelee,
        rangeCategory: source.rangeCategory,
        distanceMeters: state.distanceMeters ?? 12,
    });
    trace.push(...hitCheck.trace);

    if (!hitCheck.hit) {
        narrative.push(`You miss ${defender.displayName} with ${source.name}. ${hitCheck.narrativeLine}`);
        let nextState = { ...state, shoppingOpen: false };

        if (source.kind === 'weapon' && !isMelee && source.ammoCatalogId) {
            const inv = (player.inventory ?? []).map((item) => {
                if (item.catalogId !== source.ammoCatalogId) return item;
                const qty = (item.qty ?? 1) - 1;
                return qty > 0 ? { ...item, qty } : null;
            }).filter(Boolean);
            nextState = updateCombatant(nextState, { ...player, inventory: inv });
            trace.push('IF ranged attack THEN consume 1 round (miss)');
        }

        if (source.consumable && source.catalogId) {
            const inv = (player.inventory ?? []).map((item) => {
                if (item.catalogId !== source.catalogId) return item;
                const qty = (item.qty ?? 1) - 1;
                return qty > 0 ? { ...item, qty } : null;
            }).filter(Boolean);
            nextState = updateCombatant(nextState, { ...player, inventory: inv });
            trace.push(`IF grenade THEN consume 1 × ${source.name} (miss)`);
            narrative.push(`Used 1 × ${source.name}.`);
        }

        return finishPlayerAttack(nextState, narrative, trace, { attacksRemainingAfter, sourceId });
    }

    narrative.push(
        `You hit ${defender.displayName} with ${source.name}. ${hitCheck.narrativeLine}`,
    );

    const catalogId = source.catalogId ?? source.weaponCatalogId ?? source.grenadeCatalogId;
    const directHp = isDirectHpAttack(catalogId);
    const noDamage = hasNoDirectDamage(catalogId);
    const onHitAblatePreview = directHp ? 0 : resolveOnHitAblate(source.weaponCatalogId ?? source.catalogId);

    if (noDamage && !directHp && onHitAblatePreview <= 0) {
        trace.push('attack deals no HP damage — armor not ablated');
        narrative.push(`${source.name} special effect (no HP damage).`);
        let nextState = { ...state, shoppingOpen: false };
        if (source.consumable && source.catalogId) {
            const inv = (player.inventory ?? []).map((item) => {
                if (item.catalogId !== source.catalogId) return item;
                const qty = (item.qty ?? 1) - 1;
                return qty > 0 ? { ...item, qty } : null;
            }).filter(Boolean);
            nextState = updateCombatant(nextState, { ...player, inventory: inv });
            trace.push(`IF grenade THEN consume 1 × ${source.name}`);
        }
        return finishPlayerAttack(nextState, narrative, trace, { attacksRemainingAfter, sourceId });
    }

    const damageNotation = (noDamage && onHitAblatePreview > 0)
        ? '0'
        : directHp
            ? (source.damageDice && source.damageDice !== '0' ? source.damageDice : '3d6')
            : resolveDamageDice(player, source);
    if (source.usesBodyDamage) {
        trace.push(`CP:R Brawling/Martial Arts: BODY ${player.body} → ${damageNotation}`);
    } else if (source.kind === 'weapon' && isMelee) {
        trace.push(`CP:R Melee weapon classification damage: ${damageNotation}`);
    }

    const { total: rawDamage, rolls } = rollDamageNotation(damageNotation);
    trace.push(`damage roll ${damageNotation} → [${rolls.join(', ')}] = ${rawDamage}`);

    const critOutcome = resolveCriticalInjuries(state, defender, player, {
        damageRolls: rolls,
        weaponCatalogId: source.weaponCatalogId ?? source.catalogId,
        ammoCatalogId: source.ammoCatalogId,
        wasHit: true,
    });
    let nextState = critOutcome.nextState;
    narrative.push(...critOutcome.narrativeLines);
    trace.push(...critOutcome.ruleTraceLines);
    defender = getCombatantById(nextState, defenderId) ?? defender;

    const halfArmor = !directHp && usesHalfArmor(source.kind, source.rangeCategory, source.martialArts);
    const armorSP = directHp ? 0 : (halfArmor ? Math.ceil(defender.armorSP / 2) : defender.armorSP);
    if (directHp) {
        trace.push('direct HP damage — bypasses armor, no ablation');
    } else if (halfArmor) {
        trace.push(`melee/martial arts ignores half armor: SP ${defender.armorSP} → effective ${armorSP}`);
    } else if (source.kind === 'martial' && !source.martialArts) {
        trace.push(`Brawling: full armor SP ${defender.armorSP} (does not ignore half)`);
    } else {
        trace.push(`ranged/grenade: full armor SP ${defender.armorSP}`);
    }

    const ablationAmount = directHp ? 0 : resolveArmorAblation({
        kind: source.kind,
        weaponCatalogId: source.weaponCatalogId ?? source.catalogId,
        grenadeCatalogId: source.kind === 'grenade' ? source.catalogId : undefined,
        ammoCatalogId: source.ammoCatalogId,
    });
    const onHitAblate = directHp ? 0 : onHitAblatePreview;

    if (source.kind === 'weapon' && !isMelee) {
        if (source.ammoCatalogId) {
            const ammoItem = (player.inventory ?? []).find((i) => i.catalogId === source.ammoCatalogId);
            trace.push(`loaded ammo: ${ammoItem?.name ?? source.ammoCatalogId}`);
        } else {
            trace.push('no compatible ammo loaded; ablation defaults to basic (1 SP)');
        }
    }

    if (ablationAmount === 0) {
        trace.push('ammo/weapon: no armor ablation');
    } else if (ablationAmount === 2) {
        trace.push('armor-piercing: ablate 2 SP when damage penetrates');
    } else if (ablationAmount === 4) {
        trace.push('flechette: ablate 4 SP when damage penetrates');
    } else {
        trace.push('basic: ablate 1 SP when damage penetrates');
    }

    if (onHitAblate > 0) {
        trace.push(`on-hit effect: ablate ${onHitAblate} SP even if blocked`);
    }

    const {
        damageThrough,
        newArmorSP,
        ablated,
        ablationAmount: ablatedBy,
    } = applyArmorToDamage(rawDamage, defender.armorSP, {
        effectiveSP: directHp ? 0 : armorSP,
        ablationAmount: directHp ? 0 : ablationAmount,
        onHitAblate: directHp ? 0 : onHitAblate,
    });

    if (noDamage && onHitAblate > 0) {
        narrative.push(`${source.name}: no HP damage; armor −${ablatedBy} SP (now ${newArmorSP}).`);
    } else if (ablated) {
        trace.push(
            `CP:R armor: ${rawDamage} − SP ${armorSP} = ${damageThrough} HP; ablate −${ablatedBy} SP → ${newArmorSP}`,
        );
    } else if (damageThrough > 0) {
        trace.push(`CP:R armor: ${rawDamage} − SP ${armorSP} = ${damageThrough} HP; armor not ablated`);
    } else {
        trace.push(`CP:R armor: SP ${armorSP} blocks all ${rawDamage} damage; armor not ablated`);
    }

    nextState = applyDamageToState(nextState, defender, damageThrough, newArmorSP);
    const updatedDefender = nextState.combatants.find((c) => c.id === defenderId);

    narrative.push(
        noDamage && onHitAblate > 0
            ? `${defender.displayName} armor now ${newArmorSP} SP.`
            : `Damage: ${rawDamage} − SP ${armorSP} = ${damageThrough} to HP${ablated ? `; armor −${ablatedBy} SP (now ${newArmorSP})` : ''}. ${defender.displayName} at ${updatedDefender?.hp ?? 0} HP.`,
    );

    nextState = { ...nextState, shoppingOpen: false };

    if (source.kind === 'weapon' && !isMelee && source.ammoCatalogId) {
        const currentPlayer = getPlayer(nextState);
        if (currentPlayer) {
            const inv = (currentPlayer.inventory ?? []).map((item) => {
                if (item.catalogId !== source.ammoCatalogId) return item;
                const qty = (item.qty ?? 1) - 1;
                return qty > 0 ? { ...item, qty } : null;
            }).filter(Boolean);
            nextState = updateCombatant(nextState, { ...currentPlayer, inventory: inv });
            trace.push('IF ranged attack THEN consume 1 round');
        }
    }

    if (source.consumable && source.catalogId) {
        const currentPlayer = getPlayer(nextState);
        if (!currentPlayer) {
            return finishPlayerAttack(nextState, narrative, trace, { attacksRemainingAfter, sourceId });
        }
        const inv = (currentPlayer.inventory ?? []).map((item) => {
            if (item.catalogId !== source.catalogId) return item;
            const qty = (item.qty ?? 1) - 1;
            return qty > 0 ? { ...item, qty } : null;
        }).filter(Boolean);
        nextState = updateCombatant(nextState, { ...currentPlayer, inventory: inv });
        trace.push(`IF grenade THEN consume 1 × ${source.name}`);
        narrative.push(`Used 1 × ${source.name}.`);
    }

    if (updatedDefender && !isCombatantAlive(updatedDefender)) {
        const bounty = updatedDefender.enemyMeta?.bountyEb ?? rewardEbForTier('mook');
        const currentPlayer = getPlayer(nextState);
        if (currentPlayer) {
            nextState = updateCombatant(nextState, {
                ...currentPlayer,
                eurobucks: (currentPlayer.eurobucks ?? 0) + bounty,
            });
        }
        trace.push(`IF defender.hp <= 0 THEN bounty +${bounty}eb`);
        narrative.push(`${defender.displayName} down! +${bounty}eb looted.`);

        if (livingEnemies(nextState).length === 0) {
            nextState = {
                ...nextState,
                shoppingOpen: true,
                playerAttacksRemaining: 0,
                volleySourceId: null,
                combatants: nextState.combatants.filter(
                    (c) => c.isPlayerControlled || isCombatantAlive(c),
                ),
            };
            narrative.push('Area clear. Hit the Night Market to re-arm.');
            trace.push('IF no living enemies THEN shopping unlocked');
            return createRuleOutcome({ nextState, narrativeLines: narrative, ruleTraceLines: trace });
        }
    }

    return finishPlayerAttack(nextState, narrative, trace, { attacksRemainingAfter, sourceId });
}

/**
 * @param {import('../core/GameState.js').GameState} state
 * @returns {boolean}
 */
export function hasLivingEnemies(state) {
    return livingEnemies(state).length > 0;
}

/**
 * @param {import('../combat/Combatant.js').Combatant} player
 * @param {AttackSource} source
 * @returns {string}
 */
export function attackSourceLabel(player, source) {
    if (source.usesBodyDamage) {
        return `${source.name} (${formatBodyDamageLabel(player.body)})`;
    }
    return `${source.name} (${source.damageDice}${source.rangeCategory === 'Melee' ? ' melee' : ''})`;
}
