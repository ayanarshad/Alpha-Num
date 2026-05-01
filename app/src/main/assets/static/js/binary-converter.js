/* ============================================
   Binary Converter App Logic
   ============================================ */

class BinaryConverterApp {
    constructor() {
        this.conversions = 0;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateStats();
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
                    output += input.charCodeAt(i).toString(2).padStart(8, '0') + ' ';
                }
                output = output.trim();
            } else if (format === 'bintext') {
                const binStr = input.replace(/[^01\s]/g, '');
                const bytes = binStr.split(/\s+/).filter(b => b.length > 0);
                for (let byte of bytes) {
                    output += String.fromCharCode(parseInt(byte, 2));
                }
            }
            
            document.getElementById('outputText').textContent = output;
            this.conversions++;
            this.updateStats();
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

    updateStats() {
        const input = document.getElementById('inputText')?.value || '';
        const charCount = input.length;
        const wordCount = input.trim().split(/\s+/).filter(w => w.length > 0).length;

        document.getElementById('charCount').textContent = charCount;
        document.getElementById('wordCount').textContent = wordCount;
        document.getElementById('conversionCount').textContent = this.conversions;
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
