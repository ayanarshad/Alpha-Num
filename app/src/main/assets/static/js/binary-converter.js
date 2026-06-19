/* ============================================
   Binary Converter App Logic
   ============================================ */

class BinaryConverterApp {
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
        let input = document.getElementById('inputText')?.value || '';
        if (!input.trim()) {
            this.showSnackbar('Please enter some text');
            return;
        }

        try {
            const modeElement = document.querySelector('input[name="convMode"]:checked');
            const format = modeElement ? modeElement.value : 'textbin';
            
            // Handle Ignore Spaces option
            const ignoreSpaces = document.getElementById('ignoreSpaces')?.checked;
            if (ignoreSpaces) {
                input = input.replace(/\s+/g, '');
            }

            let output = '';

            if (format === 'textbin') {
                for (let i = 0; i < input.length; i++) {
                    const char = input[i];
                    if (char === '\n') {
                        output = output.trim() + '\n';
                    } else if (char === '\r') {
                        // skip carriage return
                    } else {
                        output += char.charCodeAt(0).toString(2).padStart(8, '0') + ' ';
                    }
                }
                output = output.trim();
            } else if (format === 'bintext') {
                const lines = input.split(/\n/);
                const decodedLines = [];
                for (let line of lines) {
                    const bytes = line.trim().split(/ +/).filter(b => b.length > 0);
                    let decodedLine = '';
                    for (let byte of bytes) {
                        const cleanByte = byte.replace(/[^01]/g, '');
                        if (cleanByte.length > 0) {
                            decodedLine += String.fromCharCode(parseInt(cleanByte, 2));
                        }
                    }
                    decodedLines.push(decodedLine);
                }
                output = decodedLines.join('\n');
            }
            
            document.getElementById('outputText').textContent = output;
            
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
                    'Binary',
                    input,
                    output,
                    chars,
                    words,
                    paragraphs,
                    format,
                    {
                        ignoreSpaces: document.getElementById('ignoreSpaces')?.checked
                    }
                );
            }

            this.showSnackbar('✓ Conversion complete');
        } catch (error) {
            this.showSnackbar('Error: ' + error.message);
        }
    }

    clear() {
        document.getElementById('inputText').value = '';
        document.getElementById('outputText').textContent = 'Conversion result will appear here...';
        this.updateStats();
        this.showSnackbar('Cleared');
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
        
        const ignoreSpaces = document.getElementById('ignoreSpaces');
        if (ignoreSpaces) ignoreSpaces.checked = !!item.opts.ignoreSpaces;

        const modeRadios = document.getElementsByName('convMode');
        if (modeRadios && item.format) {
            modeRadios.forEach(radio => {
                radio.checked = (radio.value === item.format);
            });
        }
        
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
        const snackbar = document.createElement('div');
        snackbar.style.cssText = `
            position: fixed;
            bottom: 96px;
            left: 16px;
            right: 16px;
            max-width: 568px;
            margin: 0 auto;
            padding: 16px;
            background-color: #323232;
            color: white;
            border-radius: 8px;
            font-size: 14px;
            z-index: 1000;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            animation: slideUp 0.3s ease;
        `;
        snackbar.textContent = message;
        document.body.appendChild(snackbar);

        setTimeout(() => {
            snackbar.remove();
        }, 2500);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.app = new BinaryConverterApp();
});
