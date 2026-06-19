/* ============================================
   Material Design 3 - Interactive Features
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    initializeMD3Components();
});

/**
 * Initialize Material Design 3 Components
 */
function initializeMD3Components() {
    // Setup bottom navigation
    setupBottomNavigation();
    
    // Setup floating action button
    setupFloatingActionButton();
    
    // Enhance form elements
    enhanceFormElements();
    
    // Add ripple effects
    setupRippleEffects();

    // Setup Theme (Light / Dark)
    setupThemeToggle();

    // Setup History List rendering
    renderHistoryUI();

    // Setup clear history click handler
    const clearBtn = document.getElementById('clearHistoryBtn');
    if (clearBtn) {
        clearBtn.addEventListener('click', function() {
            clearHistory();
            renderHistoryUI();
            showMD3Snackbar('✓ History cleared');
        });
    }
}

/**
 * Setup Bottom Navigation
 */
function setupBottomNavigation() {
    const navItems = document.querySelectorAll('.md3-nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            navItems.forEach(i => i.classList.remove('md3-nav-active'));
            this.classList.add('md3-nav-active');
        });
    });
}

/**
 * Setup Floating Action Button
 */
function setupFloatingActionButton() {
    const fab = document.querySelector('.md3-fab');
    
    if (fab) {
        fab.addEventListener('click', function() {
            console.log('FAB clicked');
        });
    }
}

/**
 * Enhance Form Elements
 */
function enhanceFormElements() {
    // Auto-enhance input fields (exclude select and checkbox)
    document.querySelectorAll('input:not([type="checkbox"]):not([type="radio"]), textarea').forEach(element => {
        if (!element.classList.contains('md3-text-field-input')) {
            element.classList.add('md3-text-field-input');
        }
    });

    // Auto-enhance buttons
    document.querySelectorAll('button:not(.history-action-btn):not(.theme-toggle-btn)').forEach(button => {
        if (!button.classList.contains('md3-button') && 
            !button.classList.contains('md3-nav-item') &&
            !button.classList.contains('md3-fab')) {
            button.classList.add('md3-button', 'md3-button-filled');
        }
    });

    // Auto-enhance cards
    document.querySelectorAll('.card').forEach(card => {
        if (!card.classList.contains('md3-card')) {
            card.classList.add('md3-card');
        }
    });
}

/**
 * Setup Ripple Effects on Interactive Elements
 */
function setupRippleEffects() {
    const interactiveElements = document.querySelectorAll(
        'button, a, [role="button"], .md3-card'
    );

    interactiveElements.forEach(element => {
        element.addEventListener('click', function(e) {
            // Only create ripple if it's an actual click
            if (e.button === 0) {
                createRipple(e, this);
            }
        });
    });
}

/**
 * Create Material Design Ripple Effect
 */
function createRipple(event, element) {
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    const ripple = document.createElement('span');
    ripple.style.cssText = `
        position: absolute;
        left: ${x}px;
        top: ${y}px;
        width: ${size}px;
        height: ${size}px;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 50%;
        pointer-events: none;
        animation: md3-ripple 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        animation-fill-mode: forwards;
    `;

    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
}

/**
 * Add Ripple Animation Keyframes
 */
const style = document.createElement('style');
style.textContent = `
    @keyframes md3-ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

/* ============================================
   Cookie Helpers
   ============================================ */
function setCookie(name, value, days) {
    try {
        localStorage.setItem(name, value);
        return;
    } catch (e) {
        console.warn("localStorage is not available, falling back to cookies:", e);
    }

    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + encodeURIComponent(value) + expires + "; path=/; SameSite=Lax";
}

function getCookie(name) {
    try {
        const val = localStorage.getItem(name);
        if (val !== null) return val;
    } catch (e) {
        // ignore and fallback
    }

    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
    return null;
}

/* ============================================
   Theme Management (Light / Dark)
   ============================================ */
function setupThemeToggle() {
    let theme = getCookie('theme_preference');
    if (!theme) {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        theme = prefersDark ? 'dark' : 'light';
    }
    
    applyTheme(theme);
    
    // Find or inject button
    let toggleBtn = document.getElementById('themeToggleBtn');
    if (!toggleBtn) {
        toggleBtn = document.createElement('button');
        toggleBtn.id = 'themeToggleBtn';
        toggleBtn.className = 'theme-toggle-btn';
        toggleBtn.title = 'Toggle Theme';
        
        const topAppBarContent = document.querySelector('.md3-top-app-bar-content');
        if (topAppBarContent) {
            topAppBarContent.appendChild(toggleBtn);
        }
    }
    
    updateToggleButtonIcon(toggleBtn, theme);
    
    toggleBtn.addEventListener('click', function() {
        const currentTheme = document.documentElement.classList.contains('dark-theme') ? 'dark' : 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
        setCookie('theme_preference', newTheme, 365);
        updateToggleButtonIcon(toggleBtn, newTheme);
        showMD3Snackbar(`Switched to ${newTheme} theme`);
    });
}

function applyTheme(theme) {
    if (theme === 'dark') {
        document.documentElement.classList.add('dark-theme');
        document.documentElement.classList.remove('light-theme');
    } else {
        document.documentElement.classList.add('light-theme');
        document.documentElement.classList.remove('dark-theme');
    }
}

function updateToggleButtonIcon(btn, theme) {
    if (theme === 'dark') {
        btn.innerHTML = '☀️'; // Sun emoji for Light
    } else {
        btn.innerHTML = '🌙'; // Moon emoji for Dark
    }
}

/* ============================================
   History Cookie Management
   ============================================ */
const HISTORY_COOKIE_KEY = 'converter_history';
const MAX_HISTORY_ITEMS = 6;
const MAX_TEXT_PREVIEW_LEN = 120;

function getHistory() {
    const cookieVal = getCookie(HISTORY_COOKIE_KEY);
    if (!cookieVal) return [];
    try {
        return JSON.parse(cookieVal);
    } catch (e) {
        console.error("Error parsing history cookie:", e);
        return [];
    }
}

function saveHistoryItem(type, input, output, chars, words, paragraphs, format, opts) {
    const history = getHistory();
    
    // Truncate to save space in cookie (4KB limit)
    const truncatedInput = input.length > MAX_TEXT_PREVIEW_LEN 
        ? input.substring(0, MAX_TEXT_PREVIEW_LEN) + '...' 
        : input;
    const truncatedOutput = output.length > MAX_TEXT_PREVIEW_LEN 
        ? output.substring(0, MAX_TEXT_PREVIEW_LEN) + '...' 
        : output;
        
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' ' + 
                    now.toLocaleDateString([], { month: 'short', day: 'numeric' });
                    
    const newItem = {
        type: type,
        time: timeStr,
        input: truncatedInput,
        output: truncatedOutput,
        chars: chars,
        words: words,
        paragraphs: paragraphs,
        format: format,
        opts: opts || {}
    };
    
    // Remove if duplicate input to save space
    const duplicateIndex = history.findIndex(item => item.input === newItem.input && item.type === newItem.type);
    if (duplicateIndex !== -1) {
        history.splice(duplicateIndex, 1);
    }
    
    history.unshift(newItem);
    
    if (history.length > MAX_HISTORY_ITEMS) {
        history.splice(MAX_HISTORY_ITEMS);
    }
    
    setCookie(HISTORY_COOKIE_KEY, JSON.stringify(history), 30);
    renderHistoryUI();
}

function deleteHistoryItem(index) {
    const history = getHistory();
    if (index >= 0 && index < history.length) {
        history.splice(index, 1);
        setCookie(HISTORY_COOKIE_KEY, JSON.stringify(history), 30);
    }
}

function clearHistory() {
    setCookie(HISTORY_COOKIE_KEY, '', -1);
}

function renderHistoryUI() {
    const historyListContainer = document.getElementById('historyList');
    const historyCard = document.getElementById('historyCard');
    if (!historyListContainer) return;
    
    const history = getHistory();
    
    if (history.length === 0) {
        historyListContainer.innerHTML = `
            <div class="history-empty">
                No recent conversions yet.
            </div>
        `;
        const clearBtn = document.getElementById('clearHistoryBtn');
        if (clearBtn) clearBtn.style.display = 'none';
        return;
    }
    
    if (historyCard) {
        historyCard.style.display = 'block';
    }
    const clearBtn = document.getElementById('clearHistoryBtn');
    if (clearBtn) clearBtn.style.display = 'block';
    
    let html = '<div class="history-list">';
    history.forEach((item, index) => {
        html += `
            <div class="history-item" data-index="${index}">
                <div class="history-header">
                    <span class="history-badge">${escapeHtml(item.type)}</span>
                    <span class="history-time">${escapeHtml(item.time)}</span>
                </div>
                <div class="history-text-preview">
                    <strong>Input:</strong> ${escapeHtml(item.input)}
                </div>
                <div class="history-text-preview" style="opacity: 0.85;">
                    <strong>Result:</strong> ${escapeHtml(item.output)}
                </div>
                <div class="history-stats-row">
                    <div class="history-stats-item">Chars: <span>${item.chars}</span></div>
                    <div class="history-stats-item">Words: <span>${item.words}</span></div>
                    <div class="history-stats-item">Paras: <span>${item.paragraphs || 0}</span></div>
                </div>
                <div class="history-actions">
                    <button class="history-action-btn delete" onclick="event.stopPropagation(); window.MaterialDesign3.deleteHistory(${index})">
                        🗑️ Delete
                    </button>
                    <button class="history-action-btn restore" onclick="event.stopPropagation(); window.MaterialDesign3.restoreHistory(${index})">
                        🔄 Restore
                    </button>
                </div>
            </div>
        `;
    });
    html += '</div>';
    historyListContainer.innerHTML = html;
}

function escapeHtml(str) {
    if (!str) return '';
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

/**
 * Enhance Dynamically Loaded Content
 */
window.enhanceMD3UI = function(parentElement = document.body) {
    const elements = {
        inputs: parentElement.querySelectorAll('input:not(.md3-text-field-input)'),
        buttons: parentElement.querySelectorAll('button:not(.md3-button):not(.md3-nav-item):not(.md3-fab)'),
        cards: parentElement.querySelectorAll('.card:not(.md3-card)')
    };

    elements.inputs.forEach(el => el.classList.add('md3-text-field-input'));
    elements.buttons.forEach(el => el.classList.add('md3-button', 'md3-button-filled'));
    elements.cards.forEach(el => el.classList.add('md3-card'));

    setupRippleEffects();
};

/**
 * Utility: Create Material Design 3 Card
 */
window.createMD3Card = function(content) {
    const card = document.createElement('div');
    card.className = 'md3-card';
    card.innerHTML = content;
    return card;
};

/**
 * Utility: Create Material Design 3 Button
 */
window.createMD3Button = function(text, variant = 'filled', onClick = null) {
    const button = document.createElement('button');
    button.className = `md3-button md3-button-${variant}`;
    button.textContent = text;
    button.addEventListener('click', onClick || function() {});
    return button;
};

/**
 * Show Snackbar Notification
 */
window.showMD3Snackbar = function(message, duration = 3000) {
    // Remove existing snackbars to prevent stack up
    document.querySelectorAll('.md3-snackbar-elem').forEach(el => el.remove());

    const snackbar = document.createElement('div');
    snackbar.className = 'md3-snackbar-elem';
    snackbar.style.cssText = `
        position: fixed;
        bottom: 96px;
        left: 16px;
        right: 16px;
        max-width: 568px;
        margin: 0 auto;
        padding: 14px 18px;
        background-color: var(--apple-surface-grouped);
        color: var(--apple-text);
        border: 1px solid var(--apple-border);
        border-radius: 12px;
        font-size: 14px;
        font-weight: 600;
        z-index: 1000;
        animation: md3-snackbar-in 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        box-shadow: var(--apple-shadow);
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    snackbar.textContent = message;
    document.body.appendChild(snackbar);

    setTimeout(() => {
        snackbar.style.animation = 'md3-snackbar-out 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)';
        setTimeout(() => snackbar.remove(), 300);
    }, duration);
};

/**
 * Add Snackbar Animations
 */
const snackbarStyle = document.createElement('style');
snackbarStyle.textContent = `
    @keyframes md3-snackbar-in {
        from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
        }
        to {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }

    @keyframes md3-snackbar-out {
        from {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
        to {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
        }
    }
`;
document.head.appendChild(snackbarStyle);

/**
 * Material Design 3 Dialog/Modal
 */
window.showMD3Dialog = function(title, content, actions = []) {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.4);
        backdrop-filter: blur(5px);
        z-index: 200;
        display: flex;
        align-items: center;
        justify-content: center;
    `;

    const dialog = document.createElement('div');
    dialog.style.cssText = `
        background-color: var(--apple-surface-grouped);
        border-radius: var(--radius-xl);
        border: 1px solid var(--apple-border);
        padding: 24px;
        max-width: 500px;
        width: 90%;
        box-shadow: var(--apple-shadow);
        animation: md3-dialog-appear 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    `;

    const titleEl = document.createElement('h2');
    titleEl.textContent = title;
    titleEl.style.marginBottom = '12px';
    titleEl.style.fontSize = '20px';
    titleEl.style.fontWeight = '800';

    const contentEl = document.createElement('p');
    contentEl.textContent = content;
    contentEl.style.marginBottom = '20px';
    contentEl.style.fontSize = '15px';
    contentEl.style.color = 'var(--apple-text-secondary)';

    const actionsContainer = document.createElement('div');
    actionsContainer.style.cssText = `
        display: flex;
        gap: 12px;
        justify-content: flex-end;
    `;

    actions.forEach(action => {
        const btn = document.createElement('button');
        btn.className = `md3-button md3-button-${action.variant || 'text'}`;
        btn.textContent = action.label;
        btn.addEventListener('click', () => {
            if (action.onClick) action.onClick();
            overlay.remove();
        });
        actionsContainer.appendChild(btn);
    });

    dialog.appendChild(titleEl);
    dialog.appendChild(contentEl);
    dialog.appendChild(actionsContainer);
    overlay.appendChild(dialog);
    document.body.appendChild(overlay);

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) overlay.remove();
    });
};

/**
 * Add Dialog Animation
 */
const dialogStyle = document.createElement('style');
dialogStyle.textContent = `
    @keyframes md3-dialog-appear {
        from {
            opacity: 0;
            transform: scale(0.9) translateY(10px);
        }
        to {
            opacity: 1;
            transform: scale(1) translateY(0);
        }
    }
`;
document.head.appendChild(dialogStyle);

/* ============================================
   Lifetime Statistics Cookie Management
   ============================================ */
const STATS_COOKIE_KEY = 'stats';

function getStats() {
    const cookieVal = getCookie(STATS_COOKIE_KEY);
    if (!cookieVal) {
        return {
            conversions: 0,
            characters: 0,
            words: 0,
            paragraphs: 0
        };
    }
    try {
        return JSON.parse(cookieVal);
    } catch (e) {
        console.error("Error parsing stats cookie:", e);
        return {
            conversions: 0,
            characters: 0,
            words: 0,
            paragraphs: 0
        };
    }
}

function saveStats(stats) {
    setCookie(STATS_COOKIE_KEY, JSON.stringify(stats), 365);
}

function incrementConversions(chars, words, paragraphs) {
    const stats = getStats();
    stats.conversions = (stats.conversions || 0) + 1;
    stats.characters = (stats.characters || 0) + chars;
    stats.words = (stats.words || 0) + words;
    stats.paragraphs = (stats.paragraphs || 0) + paragraphs;
    saveStats(stats);
    return stats;
}

/**
 * Export Material Design 3 Utilities & History/Theme managers
 */
window.MaterialDesign3 = {
    enhance: window.enhanceMD3UI,
    createCard: window.createMD3Card,
    createButton: window.createMD3Button,
    showSnackbar: window.showMD3Snackbar,
    showDialog: window.showMD3Dialog,
    
    // Cookie helpers
    setCookie: setCookie,
    getCookie: getCookie,
    
    // Theme triggers
    applyTheme: applyTheme,
    setupThemeToggle: setupThemeToggle,
    
    // Stats managers
    getStats: getStats,
    incrementConversions: incrementConversions,
    
    // History managers
    getHistory: getHistory,
    saveHistoryItem: saveHistoryItem,
    deleteHistory: function(index) {
        deleteHistoryItem(index);
        renderHistoryUI();
        window.showMD3Snackbar('✓ History item deleted');
    },
    clearHistory: function() {
        clearHistory();
        renderHistoryUI();
        window.showMD3Snackbar('✓ Conversion history cleared');
    },
    restoreHistory: function(index) {
        const history = getHistory();
        if (index >= 0 && index < history.length) {
            const item = history[index];
            if (typeof window.appRestoreHook === 'function') {
                window.appRestoreHook(item);
            } else {
                window.showMD3Snackbar('Error: Restorer hook not loaded');
            }
        }
    },
    refreshHistoryUI: renderHistoryUI
};

console.log('Material Design 3 Theme & History Core initialized ✓');
