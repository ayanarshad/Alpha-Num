/* ============================================
   AlphaConverter App Logic
   ============================================ */

class AlphaConverterApp {
    constructor() {
        this.conversions = 0;
        if (window.MaterialDesign3 && window.MaterialDesign3.getStats) {
            this.conversions = window.MaterialDesign3.getStats().conversions || 0;
        }
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateStats();
        window.appRestoreHook = (item) => this.restore(item);
    }

    setupEventListeners() {
        document.getElementById('convertBtn')?.addEventListener('click', () => this.convert());
        document.getElementById('clearBtn')?.addEventListener('click', () => this.clear());
        document.getElementById('copyInputBtn')?.addEventListener('click', () => this.copyInput());
        document.getElementById('copyOutputBtn')?.addEventListener('click', () => this.copyOutput());
        document.querySelector('.md3-fab')?.addEventListener('click', () => this.convert());

        const input = document.getElementById('inputText');
        if (input) {
            input.addEventListener('input', () => this.updateStats());
            input.addEventListener('keydown', (e) => {
                if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                    this.convert();
                }
            });
        }
    }

    convert() {
        const input = document.getElementById('inputText')?.value || '';
        if (!input.trim()) {
            this.showSnackbar('Please enter some text');
            return;
        }

        try {
            const format = document.getElementById('formatSelect')?.value || 'simple';
            let output = this.convertText(input, format);
            
            // Apply UpperCase option if checked
            if (document.getElementById('upperCase')?.checked) {
                output = output.toUpperCase();
            }
            
            const outputEl = document.getElementById('outputText');
            outputEl.textContent = output;
            outputEl.classList.add('has-result');
            
            const chars = input.length;
            const words = input.trim().split(/\s+/).filter(w => w.length > 0).length;
            const paragraphs = input.split(/\n+/).filter(p => p.trim().length > 0).length;

            // Increment and save stats in cookie
            if (window.MaterialDesign3 && window.MaterialDesign3.incrementConversions) {
                const updatedStats = window.MaterialDesign3.incrementConversions(chars, words, paragraphs);
                this.conversions = updatedStats.conversions;
            } else {
                this.conversions++;
            }

            this.updateStats();

            // Save to history cookie
            if (window.MaterialDesign3 && window.MaterialDesign3.saveHistoryItem) {
                window.MaterialDesign3.saveHistoryItem(
                    'Alphabet',
                    input,
                    output,
                    chars,
                    words,
                    paragraphs,
                    format,
                    {
                        ignoreSpaces: document.getElementById('ignoreSpaces')?.checked,
                        upperCase: document.getElementById('upperCase')?.checked
                    }
                );
            }

            this.showSnackbar('✓ Conversion complete');
        } catch (error) {
            this.showSnackbar('Error: ' + error.message);
        }
    }

    convertText(input, format) {
        let output = '';
        
        // Handle Ignore Spaces option
        const ignoreSpaces = document.getElementById('ignoreSpaces')?.checked;
        if (ignoreSpaces) {
            input = input.replace(/\s+/g, '');
        }

        if (format === 'binary') {
            for (let i = 0; i < input.length; i++) {
                output += input.charCodeAt(i).toString(2).padStart(8, '0') + ' ';
            }
            return output.trim();
        }

        // Default: Simple Alphabet to Numbers
        for (let char of input) {
            const lower = char.toLowerCase();
            if (lower >= 'a' && lower <= 'z') {
                const num = lower.charCodeAt(0) - 96;
                output += num + ' ';
            } else if (/\d/.test(char)) {
                output += char + ' ';
            } else if (char === ' ') {
                output += '| ';
            } else {
                output += char;
            }
        }
        return output.trim();
    }

    clear() {
        document.getElementById('inputText').value = '';
        const outputEl = document.getElementById('outputText');
        outputEl.textContent = 'Conversion result will appear here…';
        outputEl.classList.remove('has-result');
        this.updateStats();
        this.showSnackbar('🗑 Cleared');
    }

    copyInput() {
        const text = document.getElementById('inputText')?.value;
        if (text) {
            navigator.clipboard.writeText(text).then(() => {
                this.showSnackbar('✓ Input copied');
            });
        }
    }

    copyOutput() {
        const text = document.getElementById('outputText')?.textContent;
        if (text && !text.includes('result will appear')) {
            navigator.clipboard.writeText(text).then(() => {
                this.showSnackbar('✓ Output copied');
            });
        }
    }

    restore(item) {
        const inputEl = document.getElementById('inputText');
        if (inputEl) inputEl.value = item.input;
        
        const formatSelect = document.getElementById('formatSelect');
        if (formatSelect && item.format) formatSelect.value = item.format;
        
        const ignoreSpaces = document.getElementById('ignoreSpaces');
        if (ignoreSpaces) ignoreSpaces.checked = !!item.opts.ignoreSpaces;
        
        const upperCase = document.getElementById('upperCase');
        if (upperCase) upperCase.checked = !!item.opts.upperCase;
        
        this.convert();
    }

    updateStats() {
        const input = document.getElementById('inputText')?.value || '';
        const charCount = input.length;
        const wordCount = input.trim().split(/\s+/).filter(w => w.length > 0).length;
        const paragraphCount = input.split(/\n+/).filter(p => p.trim().length > 0).length;

        document.getElementById('charCount').textContent = charCount;
        document.getElementById('wordCount').textContent = wordCount;
        document.getElementById('paragraphCount').textContent = paragraphCount;
        document.getElementById('conversionCount').textContent = this.conversions;

        // Render lifetime stats from cookie
        if (window.MaterialDesign3 && window.MaterialDesign3.getStats) {
            const stats = window.MaterialDesign3.getStats();
            document.getElementById('charCountLifetime').textContent = stats.characters || 0;
            document.getElementById('wordCountLifetime').textContent = stats.words || 0;
            document.getElementById('paragraphCountLifetime').textContent = stats.paragraphs || 0;
            document.getElementById('conversionCountLifetime').textContent = stats.conversions || 0;
        }
    }

    showSnackbar(message) {
        // Use page's own .snackbar style if available, else fallback
        document.querySelectorAll('.snackbar').forEach(el => el.remove());
        const s = document.createElement('div');
        s.className = 'snackbar';
        s.textContent = message;
        document.body.appendChild(s);
        setTimeout(() => {
            s.style.animation = 'snackOut 0.3s cubic-bezier(0.25,0.8,0.25,1) forwards';
            setTimeout(() => s.remove(), 300);
        }, 2600);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.app = new AlphaConverterApp();
});
