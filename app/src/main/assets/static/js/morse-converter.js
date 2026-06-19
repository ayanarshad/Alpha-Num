/* ============================================
   Morse Code Converter App Logic
   ============================================ */

class MorseConverterApp {
    constructor() {
        this.conversions = 0;
        if (window.MaterialDesign3 && window.MaterialDesign3.getStats) {
            this.conversions = window.MaterialDesign3.getStats().conversions || 0;
        }
        this.morseCodeMap = {
            'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
            'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
            'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
            'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
            'Y': '-.--', 'Z': '--..', '0': '-----', '1': '.----', '2': '..---',
            '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...',
            '8': '---..', '9': '----.', '.': '.-.-.-', ',': '--..--', '?': '..--..',
            "'": '.----.', '!': '-.-.--', '/': '-..-.', '(': '-.--.', ')': '-.--.-',
            '&': '.-...', ':': '---...', ';': '-.-.-.', '=': '-...-', '+': '.-.-.',
            '-': '-....-', '_': '..--.-', '"': '.-..-.', '$': '...-..-', '@': '.--.-.',
            ' ': '/'
        };
        // Reverse map for decoding
        this.reverseMorseMap = {};
        for (const [key, value] of Object.entries(this.morseCodeMap)) {
            this.reverseMorseMap[value] = key;
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
            const format = modeElement ? modeElement.value : 'textmorse';
            
            // Handle Ignore Spaces option
            const ignoreSpaces = document.getElementById('ignoreSpaces')?.checked;
            if (ignoreSpaces) {
                input = input.replace(/\s+/g, '');
            }

            let output = '';

            if (format === 'textmorse') {
                const lines = input.split(/\n/);
                const convertedLines = [];
                for (let line of lines) {
                    const upperInput = line.toUpperCase();
                    let morseArr = [];
                    for (let char of upperInput) {
                        if (this.morseCodeMap[char]) {
                            morseArr.push(this.morseCodeMap[char]);
                        } else if (char !== '\r') {
                            // Keep unknown characters
                            morseArr.push(char);
                        }
                    }
                    convertedLines.push(morseArr.join(' '));
                }
                output = convertedLines.join('\n');
            } else if (format === 'morsetext') {
                const lines = input.split(/\n/);
                const decodedLines = [];
                for (let line of lines) {
                    const tokens = line.trim().split(/\s+/);
                    let decodedLine = '';
                    for (let token of tokens) {
                        if (token === '/') {
                            decodedLine += ' ';
                        } else if (this.reverseMorseMap[token]) {
                            decodedLine += this.reverseMorseMap[token];
                        } else if (token.length > 0) {
                            decodedLine += token; // keep unknown
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
                    'Morse',
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
    window.app = new MorseConverterApp();
});
