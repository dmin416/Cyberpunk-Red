import { PlayerCommandType, createPlayerCommand } from '../core/PlayerCommand.js';
import { isCombatantAlive } from '../combat/Combatant.js';
import { getEnemyTemplate, bountyLabelForTemplate, getEnemiesByTier } from '../data/EnemyCatalog.js';
import { THREAT_TIERS, rewardEbForTier, priceLabelForTier } from '../data/PriceChart.js';
import { getAllStoreItems, getStoreItemById, getWeaponStoreTabs, getCyberwareStoreTabs } from '../data/GearCatalog.js';
import { sellPriceEb } from '../rules/RuleStore.js';
import { getBaseStat } from '../rules/CyberwareEffects.js';
import { weaponAmmoType, findLoadedAmmo } from '../rules/ArmorAblation.js';
import { MARTIAL_MOVES, playerHasWeapon } from '../data/MartialMoves.js';
import { PLAYER_SKILL_FIELDS, PLAYER_STAT_FIELDS, CHARACTER_PRESETS, characterPresetPayload } from '../data/PlayerProfile.js';
import { maxHpFromBodyWill } from '../rules/HitPoints.js';
import { hasLivingEnemies, attackSourceLabel, getSourceRof } from '../rules/RuleAttack.js';
import { isPlayerAlive } from '../rules/RuleEnemyTurn.js';
import { formatCriticalInjuryLabels } from '../data/CriticalInjuries.js';
import { formatBodyDamageLabel } from '../rules/BodyDamage.js';

const COMMAND_LABELS = {
    [PlayerCommandType.RESET_SESSION]: 'Reset',
};

const INVENTORY_SECTIONS = ['weapon', 'armor', 'cyberware', 'grenade', 'ammo', 'gear'];
const SECTION_LABELS = {
    weapon: 'Weapons',
    armor: 'Armor',
    cyberware: 'Cyberware',
    grenade: 'Grenades',
    ammo: 'Ammunition',
    gear: 'Gear',
};

const STORE_CATEGORIES = [
    { id: 'all', label: 'All' },
    { id: 'weapon', label: 'Weapons' },
    { id: 'armor', label: 'Armor' },
    { id: 'cyberware', label: 'Cyberware' },
    { id: 'grenade', label: 'Grenades' },
    { id: 'ammo', label: 'Ammo' },
    { id: 'gear', label: 'Gear' },
];

/**
 * Renders GameState and wires player input to GameLoop.dispatch.
 */
export class UIController {
    /**
     * @param {object} elements
     * @param {(cmd: import('../core/PlayerCommand.js').PlayerCommand) => void} onCommand
     * @param {() => void} [onRefresh]
     */
    constructor(elements, onCommand, onRefresh) {
        this.el = elements;
        this.onCommand = onCommand;
        this.onRefresh = onRefresh;
        this.lastState = null;
        this.storeCategory = 'all';
        this.storeSubType = 'all';
        this.storeSearch = '';
        this.selectedEnemyId = null;
        this._characterBound = false;
        this.resetConfirmPending = false;
        this._resetConfirmTimer = null;

        this.el.storeSearch.addEventListener('input', (e) => {
            this.storeSearch = e.target.value.trim().toLowerCase();
            if (this.lastState) this.renderStore(this.lastState);
        });

        this.el.storeList.addEventListener('click', (e) => {
            const btn = e.target.closest('[data-buy-id]');
            if (btn) {
                this.onCommand(createPlayerCommand(PlayerCommandType.BUY_ITEM, {
                    catalogId: btn.getAttribute('data-buy-id'),
                }));
            }
        });

        this.el.inventoryList.addEventListener('click', (e) => {
            const equipBtn = e.target.closest('[data-equip-id]');
            if (equipBtn) {
                e.stopPropagation();
                this.onCommand(createPlayerCommand(PlayerCommandType.EQUIP_ITEM, {
                    catalogId: equipBtn.getAttribute('data-equip-id'),
                }));
                return;
            }

            const row = e.target.closest('[data-sell-id]');
            if (!row || !this.lastState?.shoppingOpen) return;

            this.onCommand(createPlayerCommand(PlayerCommandType.SELL_ITEM, {
                catalogId: row.getAttribute('data-sell-id'),
            }));
        });

        this.el.enemyList.addEventListener('click', (e) => {
            const card = e.target.closest('[data-enemy-id]');
            if (!card || card.classList.contains('enemy-card--dead')) return;
            this.selectedEnemyId = card.getAttribute('data-enemy-id');
            if (this.onRefresh) this.onRefresh();
        });

        this.el.attackOptions.addEventListener('click', (e) => {
            const btn = e.target.closest('[data-attack-source]');
            if (!btn || !this.selectedEnemyId) return;
            this.onCommand(createPlayerCommand(PlayerCommandType.ATTACK, {
                defenderId: this.selectedEnemyId,
                sourceId: btn.getAttribute('data-attack-source'),
            }));
        });

        if (this.el.characterPresets) {
            this.el.characterPresets.addEventListener('click', (e) => {
                const btn = e.target.closest('[data-char-preset]');
                if (!btn || btn.disabled) return;
                const level = Number(btn.getAttribute('data-char-preset'));
                this.onCommand(createPlayerCommand(
                    PlayerCommandType.UPDATE_CHARACTER,
                    characterPresetPayload(level),
                ));
            });
        }
    }

    clearSelection() {
        this.selectedEnemyId = null;
        this.cancelResetConfirm();
    }

    cancelResetConfirm() {
        this.resetConfirmPending = false;
        if (this._resetConfirmTimer) {
            clearTimeout(this._resetConfirmTimer);
            this._resetConfirmTimer = null;
        }
    }

    /** @param {import('../core/PlayerCommand.js').PlayerCommand} cmd */
    _handleResetClick(cmd) {
        if (!this.resetConfirmPending) {
            this.resetConfirmPending = true;
            if (this._resetConfirmTimer) clearTimeout(this._resetConfirmTimer);
            this._resetConfirmTimer = setTimeout(() => {
                this.cancelResetConfirm();
                if (this.onRefresh) this.onRefresh();
            }, 6000);
            if (this.onRefresh) this.onRefresh();
            return;
        }
        this.cancelResetConfirm();
        this.onCommand(cmd);
    }

    /**
     * @param {import('../core/GameState.js').GameState} state
     * @param {import('../core/PlayerCommand.js').PlayerCommand[]} commands
     * @param {string[]} ruleTraceLines
     */
    render(state, commands, ruleTraceLines) {
        this.lastState = state;
        this.renderWallet(state);
        this.renderInventory(state);
        this.renderStore(state);
        this.renderAttackPanel(state);
        this.renderStatus(state, commands);
        this.renderEnemies(state, commands);
        this.renderCharacterCustomizer(state);
        this.el.ruleTrace.textContent = ruleTraceLines.join('\n');
    }

    /** @param {import('../core/GameState.js').GameState} state */
    getPlayer(state) {
        return state.combatants.find((c) => c.isPlayerControlled);
    }

    /** @param {import('../core/GameState.js').GameState} state */
    getEnemies(state) {
        return state.combatants.filter((c) => !c.isPlayerControlled);
    }

    /** @param {import('../core/GameState.js').GameState} state */
    renderWallet(state) {
        const player = this.getPlayer(state);
        const eb = player?.eurobucks ?? 0;
        const inFight = !state.shoppingOpen && hasLivingEnemies(state) && isPlayerAlive(state);
        const sp = player?.armorSP ?? 0;
        const spNote = sp > 0 ? ` · SP ${sp}` : '';
        const rofNote = inFight && (state.playerAttacksRemaining ?? 0) > 0
            ? ` · ${state.playerAttacksRemaining} shot${state.playerAttacksRemaining === 1 ? '' : 's'} left`
            : '';
        this.el.walletBar.innerHTML = `
            <span class="wallet-eb"><strong>${eb.toLocaleString()}eb</strong>${spNote}${rofNote}</span>
            <span class="wallet-equipped">${inFight ? 'In combat' : !isPlayerAlive(state) && hasLivingEnemies(state) ? 'Down' : state.shoppingOpen ? 'Staging — click gear to sell' : 'Shopping open'}</span>`;
    }

    /** @param {import('../core/GameState.js').GameState} state */
    renderInventory(state) {
        const player = this.getPlayer(state);
        const canSell = state.shoppingOpen;

        if (!player) {
            this.el.inventoryList.innerHTML = '<p class="empty-note">—</p>';
            return;
        }

        const items = player.inventory ?? [];
        if (items.length === 0) {
            this.el.inventoryList.innerHTML = '<p class="empty-note">Nothing bought yet. Shop below.</p>';
            return;
        }

        const byKind = Object.fromEntries(INVENTORY_SECTIONS.map((k) => [k, []]));
        for (const item of items) {
            const key = INVENTORY_SECTIONS.includes(item.kind) ? item.kind : 'gear';
            byKind[key].push(item);
        }

        const html = INVENTORY_SECTIONS
            .filter((k) => byKind[k].length > 0)
            .map((kind) => {
                const rows = byKind[kind].map((item) => {
                    const qty = item.qty != null && item.qty > 1 ? ` ×${item.qty}` : '';
                    const catalog = item.catalogId ? getStoreItemById(item.catalogId) : null;
                    const dmg = catalog?.weapon?.damageDice;
                    const hl = catalog?.humanityLoss;
                    const unitPrice = item.priceEb ?? catalog?.priceEb ?? 0;
                    const refund = sellPriceEb(unitPrice);
                    const equipBtn = canSell && (item.kind === 'weapon' || item.kind === 'armor' || item.kind === 'ammo') && !item.equipped
                        ? `<button type="button" class="btn-mini" data-equip-id="${item.catalogId}">Equip</button>`
                        : '';
                    const sellHint = canSell
                        ? `<span class="inventory-item__sell">Sell ${refund.toLocaleString()}eb</span>`
                        : '';
                    const sellable = canSell && item.catalogId;
                    return `
                    <div class="inventory-item${item.equipped ? ' inventory-item--equipped' : ''}${sellable ? ' inventory-item--sellable' : ''}"
                        ${sellable ? `data-sell-id="${item.catalogId}" role="button" tabindex="0"` : ''}>
                        <div class="inventory-item__row">
                            <span class="inventory-item__name">${item.name}${qty}${item.equipped ? ' ★' : ''}</span>
                            ${equipBtn}
                        </div>
                        ${item.detail ? `<span class="inventory-item__detail">${item.detail}${dmg ? ` · ${dmg}` : ''}${hl ? ` · HL ${hl}` : ''}</span>` : ''}
                        ${sellHint}
                    </div>`;
                }).join('');
                return `
                <div class="inventory-section">
                    <h3 class="sub-title">${SECTION_LABELS[kind]}</h3>
                    ${rows}
                </div>`;
            })
            .join('');

        this.el.inventoryList.innerHTML = html;
    }

    /** @param {import('../core/GameState.js').GameState} state */
    renderStore(state) {
        const player = this.getPlayer(state);
        const canBuy = state.shoppingOpen;
        const balance = player?.eurobucks ?? 0;

        this.el.storeCategories.innerHTML = STORE_CATEGORIES.map((cat) => `
            <button
                type="button"
                class="store-cat${this.storeCategory === cat.id ? ' store-cat--active' : ''}"
                data-cat="${cat.id}"
            >${cat.label}</button>`).join('');

        this.el.storeCategories.querySelectorAll('.store-cat').forEach((btn) => {
            btn.addEventListener('click', () => {
                this.storeCategory = btn.getAttribute('data-cat') ?? 'all';
                if (this.storeCategory !== 'weapon' && this.storeCategory !== 'cyberware') {
                    this.storeSubType = 'all';
                }
                if (this.lastState) this.renderStore(this.lastState);
            });
        });

        const showSubTabs = this.storeCategory === 'weapon' || this.storeCategory === 'cyberware';
        this.el.storeSubcategories.hidden = !showSubTabs;

        if (showSubTabs) {
            const subTabs = this.storeCategory === 'weapon'
                ? getWeaponStoreTabs()
                : getCyberwareStoreTabs();
            this.el.storeSubcategories.innerHTML = subTabs.map((tab) => `
                <button
                    type="button"
                    class="store-subcat${this.storeSubType === tab.id ? ' store-subcat--active' : ''}"
                    data-sub-type="${tab.id}"
                >${tab.label}</button>`).join('');

            this.el.storeSubcategories.querySelectorAll('.store-subcat').forEach((btn) => {
                btn.addEventListener('click', () => {
                    this.storeSubType = btn.getAttribute('data-sub-type') ?? 'all';
                    if (this.lastState) this.renderStore(this.lastState);
                });
            });
        } else {
            this.el.storeSubcategories.innerHTML = '';
        }

        if (!canBuy) {
            this.el.storeList.innerHTML = '<p class="empty-note">Store closed during combat. Clear enemies first.</p>';
            return;
        }

        let items = getAllStoreItems();
        if (this.storeCategory !== 'all') {
            items = items.filter((i) => i.kind === this.storeCategory);
        }
        if (this.storeCategory === 'weapon' && this.storeSubType !== 'all') {
            items = items.filter((i) => i.weaponCategory === this.storeSubType);
        }
        if (this.storeCategory === 'cyberware' && this.storeSubType !== 'all') {
            items = items.filter((i) => i.cyberwareCategory === this.storeSubType);
        }
        if (this.storeSearch) {
            items = items.filter((i) => {
                const hay = `${i.name} ${i.detail ?? ''} ${i.source} ${i.weaponCategory ?? ''} ${i.cyberwareCategory ?? ''} ${i.specialMechanisms ?? ''} ${i.effectSummary ?? ''} ${i.humanityLoss ?? ''} ${i.install ?? ''}`.toLowerCase();
                return hay.includes(this.storeSearch);
            });
        }

        if (items.length === 0) {
            this.el.storeList.innerHTML = '<p class="empty-note">No matches.</p>';
            return;
        }

        this.el.storeList.innerHTML = items.map((item) => {
            const affordable = balance >= item.priceEb;
            const extra = item.kind === 'cyberware' && item.humanityLoss
                ? `<div class="store-item__meta">HL ${item.humanityLoss}${item.install ? ` · ${item.install}` : ''}</div>`
                : '';
            return `
            <div class="store-item">
                <div class="store-item__head">
                    <span class="store-item__name">${item.name}</span>
                    <span class="store-item__price">${item.priceEb.toLocaleString()}eb</span>
                </div>
                <div class="store-item__detail">${item.detail ?? item.effectSummary ?? ''}</div>
                ${extra}
                <button
                    type="button"
                    class="btn-action btn-action--buy"
                    data-buy-id="${item.id}"
                    ${!affordable ? 'disabled' : ''}
                >Buy</button>
            </div>`;
        }).join('');
    }

    /**
     * @param {import('../core/GameState.js').GameState} state
     * @param {import('../core/PlayerCommand.js').PlayerCommand[]} commands
     */
    renderStatus(state, commands) {
        const player = this.getPlayer(state);
        const inFight = !state.shoppingOpen && hasLivingEnemies(state) && isPlayerAlive(state);
        const playerDown = !isPlayerAlive(state) && hasLivingEnemies(state);

        const skillSummary = PLAYER_SKILL_FIELDS
            .map(({ key, label }) => `${label} ${player?.skills?.[key] ?? 0}`)
            .join(' · ');

        this.el.phaseBanner.textContent = playerDown
            ? 'Phase: DOWN'
            : inFight
                ? `Phase: COMBAT${(state.playerAttacksRemaining ?? 0) > 0 ? ` · ${state.playerAttacksRemaining} ROF left` : ''}`
                : 'Phase: SHOPPING';

        const critNote = player?.criticalInjuries?.length
            ? `<dt>Critical Injuries</dt><dd>${formatCriticalInjuryLabels(player.criticalInjuries)}</dd>`
            : '';

        this.el.sessionReadout.innerHTML = `
            <dt>Stats</dt><dd>REF ${player?.ref ?? 0} · DEX ${player?.dex ?? 0} · BODY ${player?.body ?? 0} · WILL ${player?.will ?? 0} · MOVE ${player?.move ?? 0}</dd>
            <dt>Skills</dt><dd>${skillSummary}</dd>
            <dt>You</dt><dd>HP ${player?.hp ?? 0}/${player?.maxHp ?? 0} <span class="derived-note">(10 + 5×⌈(BODY+WILL)/2⌉)</span> · SP ${player?.armorSP ?? 0}</dd>
            ${critNote}
            <dt>Target</dt><dd>${this.selectedEnemyId
                ? state.combatants.find((c) => c.id === this.selectedEnemyId)?.displayName ?? '—'
                : 'Click an enemy →'}</dd>
        `;

        this.el.statusHint.textContent = this.resetConfirmPending
            ? 'Reset armed — click Confirm reset? again within 6s, or do anything else to cancel.'
            : playerDown
            ? 'You\'re down. Reset to try again.'
            : inFight
                ? (state.playerAttacksRemaining ?? 0) > 0
                    ? `ROF volley — ${state.playerAttacksRemaining} attack${state.playerAttacksRemaining === 1 ? '' : 's'} remaining with locked weapon.`
                    : 'Click an enemy, then pick a weapon or martial move to attack.'
                : state.shoppingOpen && hasLivingEnemies(state)
                    ? 'Enemies staged. Shop or add more, then click a target and attack.'
                    : 'Buy gear, add enemies on the right, then fight for eurobucks.';

        this.el.turnActions.innerHTML = '';
        for (const cmd of commands.filter((c) => c.type === PlayerCommandType.RESET_SESSION)) {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = `btn-action btn-action--danger${this.resetConfirmPending ? ' btn-action--armed' : ''}`;
            btn.textContent = this.resetConfirmPending ? 'Confirm reset?' : (COMMAND_LABELS[cmd.type] ?? cmd.type);
            btn.addEventListener('click', () => this._handleResetClick(cmd));
            this.el.turnActions.appendChild(btn);
        }
    }

    /** @param {import('../core/GameState.js').GameState} state */
    renderAttackPanel(state) {
        if (!this.selectedEnemyId || !hasLivingEnemies(state) || !isPlayerAlive(state)) {
            if (this.el.attackBlock) this.el.attackBlock.hidden = true;
            return;
        }

        const enemy = state.combatants.find((c) => c.id === this.selectedEnemyId);
        if (!enemy || !isCombatantAlive(enemy)) {
            this.selectedEnemyId = null;
            if (this.el.attackBlock) this.el.attackBlock.hidden = true;
            return;
        }

        const player = this.getPlayer(state);
        const volleyLocked = (state.playerAttacksRemaining ?? 0) > 0 && state.volleySourceId;
        if (this.el.attackBlock) this.el.attackBlock.hidden = false;
        this.el.attackTargetName.textContent = enemy.displayName;

        const sections = [];

        const weapons = (player?.inventory ?? []).filter((i) => i.kind === 'weapon');
        const grenades = (player?.inventory ?? []).filter((i) => i.kind === 'grenade' && (i.qty ?? 1) > 0);

        if (weapons.length > 0) {
            sections.push({
                title: 'Weapons',
                buttons: weapons.map((item) => {
                    const cat = getStoreItemById(item.catalogId);
                    const dmg = cat?.weapon?.damageDice ?? '?';
                    const ammoType = weaponAmmoType(item.catalogId);
                    const loaded = ammoType ? findLoadedAmmo(player, ammoType) : null;
                    const ammoNote = ammoType
                        ? (loaded ? ` · ${loaded.name} ×${loaded.qty ?? 1}` : ' · no ammo')
                        : '';
                    const rof = getSourceRof(item.catalogId);
                    const rofNote = ` · ROF ${rof}`;
                    const src = {
                        name: item.name,
                        damageDice: dmg,
                        rangeCategory: cat?.weapon?.rangeCategory ?? 'Melee',
                        kind: 'weapon',
                        usesBodyDamage: false,
                    };
                    const volleyBlocked = volleyLocked && state.volleySourceId !== item.catalogId;
                    return {
                        id: item.catalogId,
                        label: `${attackSourceLabel(player, src)}${rofNote}${ammoNote}`,
                        disabled: Boolean(ammoType && !loaded) || volleyBlocked,
                    };
                }),
            });
        }

        if (grenades.length > 0) {
            sections.push({
                title: 'Grenades',
                buttons: grenades.map((item) => ({
                    id: item.catalogId,
                    label: `${item.name} ×${item.qty ?? 1} · ROF 1`,
                    disabled: volleyLocked && state.volleySourceId !== item.catalogId,
                })),
            });
        }

        const martialTitle = playerHasWeapon(player) ? 'Unarmed (BODY damage)' : 'Unarmed — BODY damage';
        sections.push({
            title: martialTitle,
            buttons: MARTIAL_MOVES.map((m) => ({
                id: m.id,
                label: `${m.name} (${formatBodyDamageLabel(player.body)}${m.martialArts ? ', half armor' : ''}) · ROF ${m.rof}`,
                disabled: volleyLocked && state.volleySourceId !== m.id,
            })),
        });

        this.el.attackOptions.innerHTML = sections.map((sec) => `
            <div class="attack-section">
                <h4 class="attack-section__title">${sec.title}</h4>
                <div class="attack-section__buttons">
                    ${sec.buttons.map((b) => `
                        <button type="button" class="btn-action btn-action--attack" data-attack-source="${b.id}"${b.disabled ? ' disabled' : ''}>
                            ${b.label}
                        </button>`).join('')}
                </div>
            </div>`).join('');
    }

    /**
     * @param {import('../core/GameState.js').GameState} state
     * @param {import('../core/PlayerCommand.js').PlayerCommand[]} commands
     */
    renderEnemies(state, commands) {
        const addCommands = commands.filter((c) => c.type === PlayerCommandType.ADD_ENEMY);

        this.el.addEnemyBar.innerHTML = '';
        if (addCommands.length > 0) {
            const byTier = getEnemiesByTier();
            const templateById = Object.fromEntries(
                addCommands.map((cmd) => [cmd.payload.templateId, getEnemyTemplate(cmd.payload.templateId)]),
            );

            for (const tier of THREAT_TIERS) {
                const templates = (byTier[tier.id] ?? []).filter((t) => templateById[t.id]);
                if (templates.length === 0) continue;

                const section = document.createElement('div');
                section.className = 'enemy-tier-section';
                section.innerHTML = `
                    <h3 class="enemy-tier-section__title">
                        ${tier.label}
                        <span class="enemy-tier-section__meta">${tier.cpRLevel} · stat preset ${tier.statLevel} · ${rewardEbForTier(tier.id).toLocaleString()}eb (${priceLabelForTier(tier.id)})</span>
                    </h3>`;

                const row = document.createElement('div');
                row.className = 'enemy-tier-section__buttons';

                for (const template of templates) {
                    const cmd = addCommands.find((c) => c.payload.templateId === template.id);
                    if (!cmd) continue;
                    const btn = document.createElement('button');
                    btn.type = 'button';
                    btn.className = 'btn-action btn-action--add';
                    btn.innerHTML = `+ ${template.displayName}<span class="enemy-add-meta">${template.level} · ${bountyLabelForTemplate(template)}</span>`;
                    btn.title = `${template.source}${template.notes ? `\n${template.notes}` : ''}`;
                    btn.addEventListener('click', () => this.onCommand(cmd));
                    row.appendChild(btn);
                }

                section.appendChild(row);
                this.el.addEnemyBar.appendChild(section);
            }
        } else if (!state.shoppingOpen && hasLivingEnemies(state)) {
            this.el.addEnemyBar.innerHTML = '<p class="empty-note">Fight in progress.</p>';
        }

        const enemies = this.getEnemies(state);

        if (enemies.length === 0) {
            this.el.enemyList.innerHTML = '<p class="empty-note">No enemies. Add one above.</p>';
            return;
        }

        this.el.enemyList.innerHTML = enemies
            .map((enemy) => {
                const alive = isCombatantAlive(enemy);
                const selected = enemy.id === this.selectedEnemyId;
                const meta = enemy.enemyMeta;
                const levelBadge = meta ? `<span class="enemy-card__badge">${meta.level}</span>` : '';
                const bounty = meta?.bountyEb ? `<span class="enemy-card__bounty">${meta.bountyEb}eb bounty</span>` : '';
                const crits = enemy.criticalInjuries?.length
                    ? `<div class="enemy-card__crits">Crit: ${formatCriticalInjuryLabels(enemy.criticalInjuries)}</div>`
                    : '';

                return `
                <div
                    class="enemy-card ${alive ? '' : 'enemy-card--dead'}${selected ? ' enemy-card--selected' : ''}${alive ? ' enemy-card--clickable' : ''}"
                    data-enemy-id="${enemy.id}"
                    role="button"
                    tabindex="${alive ? '0' : '-1'}"
                >
                    <div class="enemy-card__header">
                        <div class="enemy-card__name">${enemy.displayName}</div>
                        ${levelBadge}
                    </div>
                    ${meta ? `<div class="enemy-card__source">${meta.source}</div>` : ''}
                    <div class="enemy-card__stats">HP ${enemy.hp}/${enemy.maxHp} · SP ${enemy.armorSP}</div>
                    ${crits}
                    ${bounty}
                    ${alive ? '' : '<div class="enemy-card__dead">Down</div>'}
                </div>`;
            })
            .join('');
    }

    /** @param {import('../core/GameState.js').GameState} state */
    renderCharacterCustomizer(state) {
        if (!this.el.characterForm) return;

        const player = this.getPlayer(state);
        const inFight = !state.shoppingOpen && hasLivingEnemies(state);
        const disabled = inFight ? 'disabled' : '';

        if (this.el.characterPresets) {
            this.el.characterPresets.innerHTML = `
                <span class="character-presets__label">Presets</span>
                ${CHARACTER_PRESETS.map((preset) => `
                    <button
                        type="button"
                        class="char-preset-btn"
                        data-char-preset="${preset.level}"
                        title="Set all stats and skills to ${preset.level}"
                        ${disabled}
                    >${preset.label} <span class="char-preset-btn__level">${preset.level}</span></button>`).join('')}`;
        }

        if (this.el.characterHint) {
            this.el.characterHint.textContent = inFight
                ? 'Locked during combat.'
                : 'Adjust stats and skills — changes apply immediately.';
        }

        const derivedMaxHp = maxHpFromBodyWill(player?.body ?? 1, player?.will ?? 1);
        const cyberSp = player?._cyberArmorSP ?? 0;
        const wornSp = player?._wornArmorSP ?? 0;
        const cyberNote = cyberSp > 0
            ? `<p class="char-cyber-note">Cyberware: +${cyberSp} SP${wornSp > 0 ? ` (worn ${wornSp} + cyber ${cyberSp})` : ''}</p>`
            : '';

        const statFields = PLAYER_STAT_FIELDS.map(({ key, label }) => {
            const baseVal = player ? getBaseStat(player, key) : 1;
            const effective = player?.[key] ?? baseVal;
            const modNote = effective !== baseVal
                ? `<span class="char-field__mod">→ ${effective}</span>`
                : '';
            return `
            <label class="char-field">
                <span class="char-field__label">${label}${modNote}</span>
                <input
                    type="number"
                    class="char-field__input"
                    data-char-stat="${key}"
                    min="1"
                    max="20"
                    value="${baseVal}"
                    ${disabled}
                />
            </label>`;
        }).join('');

        const skillFields = PLAYER_SKILL_FIELDS.map(({ key, label }) => `
            <label class="char-field">
                <span class="char-field__label">${label}</span>
                <input
                    type="number"
                    class="char-field__input"
                    data-char-skill="${key}"
                    min="0"
                    max="20"
                    value="${player?.skills?.[key] ?? 0}"
                    ${disabled}
                />
            </label>`).join('');

        this.el.characterForm.innerHTML = `
            <fieldset class="char-fieldset" ${disabled ? 'disabled' : ''}>
                <legend class="char-fieldset__legend">Stats</legend>
                <div class="char-fieldset__grid">${statFields}</div>
                <p class="char-derived-hp">
                    Hit Points: <strong>${player?.hp ?? derivedMaxHp} / ${derivedMaxHp}</strong>
                    <span class="char-derived-hp__formula">CP:R — 10 + 5×⌈(BODY ${player?.body ?? 1} + WILL ${player?.will ?? 1}) / 2⌉</span>
                </p>
                ${cyberNote}
            </fieldset>
            <fieldset class="char-fieldset" ${disabled ? 'disabled' : ''}>
                <legend class="char-fieldset__legend">Skills</legend>
                <div class="char-fieldset__grid">${skillFields}</div>
            </fieldset>`;

        if (!this._characterBound) {
            this._characterBound = true;
            this.el.characterForm.addEventListener('change', (e) => {
                const statKey = e.target.getAttribute('data-char-stat');
                const skillKey = e.target.getAttribute('data-char-skill');
                if (!statKey && !skillKey) return;

                const payload = { stats: {}, skills: {} };
                if (statKey) payload.stats[statKey] = Number(e.target.value);
                if (skillKey) payload.skills[skillKey] = Number(e.target.value);

                this.onCommand(createPlayerCommand(PlayerCommandType.UPDATE_CHARACTER, payload));
            });
        }
    }
}
