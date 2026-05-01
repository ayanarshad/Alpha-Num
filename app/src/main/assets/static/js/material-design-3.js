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
            // Add action here
        });
    }
}

/**
 * Enhance Form Elements
 */
function enhanceFormElements() {
    // Auto-enhance input fields (exclude select and checkbox)
    document.querySelectorAll('input:not([type="checkbox"]), textarea').forEach(element => {
        if (!element.classList.contains('md3-text-field-input')) {
            element.classList.add('md3-text-field-input');
        }
    });

    // Auto-enhance buttons
    document.querySelectorAll('button').forEach(button => {
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
        background: rgba(255, 255, 255, 0.25);
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
        color: #ffffff;
        border-radius: 12px;
        font-size: 14px;
        font-weight: 500;
        z-index: 97;
        animation: md3-snackbar-in 0.3s ease-out;
        box-shadow: 0 8px 16px 6px rgba(0, 0, 0, 0.15);
    `;
    
    snackbar.textContent = message;
    document.body.appendChild(snackbar);

    setTimeout(() => {
        snackbar.style.animation = 'md3-snackbar-out 0.3s ease-in';
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
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes md3-snackbar-out {
        from {
            opacity: 1;
            transform: translateY(0);
        }
        to {
            opacity: 0;
            transform: translateY(20px);
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
        background-color: rgba(0, 0, 0, 0.32);
        z-index: 200;
        display: flex;
        align-items: center;
        justify-content: center;
    `;

    const dialog = document.createElement('div');
    dialog.style.cssText = `
        background-color: var(--md3-surface);
        border-radius: var(--md3-corner-lg);
        padding: 24px;
        max-width: 560px;
        width: 90%;
        box-shadow: var(--md3-elevation-5);
        animation: md3-dialog-appear 0.3s ease-out;
    `;

    const titleEl = document.createElement('h2');
    titleEl.className = 'md3-title-large';
    titleEl.textContent = title;
    titleEl.style.marginBottom = '16px';

    const contentEl = document.createElement('p');
    contentEl.className = 'md3-body-large';
    contentEl.textContent = content;
    contentEl.style.marginBottom = '24px';

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
            transform: scale(0.9);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }
`;
document.head.appendChild(dialogStyle);

/**
 * Export Material Design 3 Utilities
 */
window.MaterialDesign3 = {
    enhance: window.enhanceMD3UI,
    createCard: window.createMD3Card,
    createButton: window.createMD3Button,
    showSnackbar: window.showMD3Snackbar,
    showDialog: window.showMD3Dialog
};

console.log('Material Design 3 initialized ✓');
