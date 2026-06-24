/**
 * Append-only combat log. Facts only — no generative prose.
 */
export class NarrativeLog {
    constructor(rootElement) {
        this.rootElement = rootElement;
        this.entries = [];
    }

    /**
     * @param {string} text
     * @param {'system'|'rule'|'hit'|'miss'|'crit'|'default'} [cssClass]
     */
    append(text, cssClass = 'default') {
        this.entries.push({ text, cssClass });
        const el = document.createElement('div');
        el.className = `log-entry log-entry--${cssClass}`;
        el.textContent = text;
        this.rootElement.appendChild(el);
        this.rootElement.scrollTop = this.rootElement.scrollHeight;
    }

    clear() {
        this.entries = [];
        this.rootElement.innerHTML = '';
    }
}
