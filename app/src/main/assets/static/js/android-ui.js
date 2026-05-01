/* ============================================
   Android Material Design UI Enhancements
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Material Design components
    initMaterialComponents();
    setupTouchEffects();
    enhanceAccessibility();
});

/**
 * Initialize Material Design components
 */
function initMaterialComponents() {
    // Auto-enhance buttons with Material Design
    document.querySelectorAll('button:not([class*="jssocials"])').forEach(button => {
        if (!button.classList.contains('material-btn')) {
            button.classList.add('material-btn', 'material-btn--primary');
        }
    });

    // Auto-enhance form inputs
    document.querySelectorAll('input, textarea, select').forEach(input => {
        if (!input.classList.contains('material-field__input') && 
            !input.classList.contains('form-control')) {
            // Enhance selects with material design
            if (input.tagName === 'SELECT') {
                input.classList.add('material-select');
            } else if (input.type === 'checkbox') {
                input.classList.add('material-checkbox__input');
            } else {
                input.classList.add('material-field__input');
            }
        }
    });

    // Auto-enhance cards
    document.querySelectorAll('.card').forEach(card => {
        card.classList.add('material-card');
    });

    // Initialize dropdowns
    initMaterialDropdowns();
}

/**
 * Initialize Material Design Dropdowns
 */
function initMaterialDropdowns() {
    document.querySelectorAll('.material-dropdown__trigger').forEach(trigger => {
        const menu = trigger.nextElementSibling;
        if (!menu || !menu.classList.contains('material-dropdown__menu')) return;

        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            const isVisible = menu.classList.contains('visible');
            
            // Close all other dropdowns
            document.querySelectorAll('.material-dropdown__menu.visible').forEach(otherMenu => {
                if (otherMenu !== menu) {
                    otherMenu.classList.remove('visible');
                }
            });

            // Toggle current dropdown
            if (isVisible) {
                menu.classList.remove('visible');
            } else {
                menu.classList.add('visible');
            }
        });

        // Handle menu item clicks
        menu.querySelectorAll('.material-dropdown__item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                
                // Update selected state
                menu.querySelectorAll('.material-dropdown__item').forEach(i => {
                    i.classList.remove('selected');
                    const checkmark = i.querySelector('.material-checkmark');
                    if (checkmark) checkmark.remove();
                });

                item.classList.add('selected');
                
                // Add checkmark
                const checkmark = document.createElement('span');
                checkmark.className = 'material-checkmark';
                item.appendChild(checkmark);

                // Update trigger text
                trigger.textContent = item.textContent.replace('✓', '').trim();

                // Close dropdown
                menu.classList.remove('visible');

                // Trigger change event
                const event = new CustomEvent('dropdown-change', {
                    detail: { value: item.getAttribute('data-value') || item.textContent }
                });
                trigger.dispatchEvent(event);
            });
        });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', () => {
        document.querySelectorAll('.material-dropdown__menu.visible').forEach(menu => {
            menu.classList.remove('visible');
        });
    });
}

/**
 * Setup touch effects for Material Design
 */
function setupTouchEffects() {
    const touchElements = document.querySelectorAll(
        'button, [role="button"], .material-card--clickable, a'
    );

    touchElements.forEach(element => {
        // Skip if already has touch effects
        if (element.hasAttribute('data-touch-setup')) return;
        element.setAttribute('data-touch-setup', 'true');

        // Add ripple effect on touch
        element.addEventListener('touchstart', function(e) {
            // Add active state
            this.style.opacity = '0.8';
        });

        element.addEventListener('touchend', function(e) {
            // Remove active state
            this.style.opacity = '1';
        });

        element.addEventListener('click', function(e) {
            // Create ripple effect
            createRipple(e, this);
        });
    });
}

/**
 * Create material ripple effect on click
 */
function createRipple(event, element) {
    // Get click position
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    // Create ripple element
    const ripple = document.createElement('span');
    ripple.style.cssText = `
        position: absolute;
        left: ${x}px;
        top: ${y}px;
        width: ${size}px;
        height: ${size}px;
        background: rgba(255, 255, 255, 0.5);
        border-radius: 50%;
        pointer-events: none;
        animation: ripple-animation 0.6s ease-out;
    `;

    // Add ripple to element
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);

    // Remove ripple after animation
    setTimeout(() => ripple.remove(), 600);
}

/**
 * Enhance accessibility for Material Design
 */
function enhanceAccessibility() {
    // Add proper ARIA roles
    document.querySelectorAll('[role="button"]').forEach(element => {
        if (!element.hasAttribute('tabindex')) {
            element.setAttribute('tabindex', '0');
        }
        if (!element.hasAttribute('role')) {
            element.setAttribute('role', 'button');
        }
    });

    // Add keyboard support
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            const focused = document.activeElement;
            if (focused && focused.getAttribute('role') === 'button') {
                focused.click();
            }
        }
    });
}

/**
 * Enhance dynamically loaded content
 */
window.enhanceAndroidUI = function(parentElement) {
    if (!parentElement) parentElement = document.body;

    // Enhance buttons
    parentElement.querySelectorAll('button:not([data-enhanced])').forEach(button => {
        button.setAttribute('data-enhanced', 'true');
        if (!button.classList.contains('material-btn')) {
            button.classList.add('material-btn', 'material-btn--primary');
        }
    });

    // Enhance inputs
    parentElement.querySelectorAll('input:not([data-enhanced]), textarea:not([data-enhanced])').forEach(input => {
        input.setAttribute('data-enhanced', 'true');
        if (!input.classList.contains('material-field__input')) {
            input.classList.add('material-field__input');
        }
    });

    // Setup touch effects
    setupTouchEffects();
};

/**
 * Inject ripple animation keyframes
 */
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

/**
 * Utility: Create Material Card
 */
window.createMaterialCard = function(content, clickable = false) {
    const card = document.createElement('div');
    card.classList.add('material-card');
    if (clickable) card.classList.add('material-card--clickable');
    card.innerHTML = content;
    return card;
};

/**
 * Utility: Create Material Button
 */
window.createMaterialButton = function(text, variant = 'primary', onClick = null) {
    const button = document.createElement('button');
    button.classList.add('material-btn', `material-btn--${variant}`);
    button.textContent = text;
    if (onClick) button.addEventListener('click', onClick);
    return button;
};

/**
 * Utility: Show Material Snackbar (Toast-like notification)
 */
window.showMaterialSnackbar = function(message, duration = 3000) {
    const snackbar = document.createElement('div');
    snackbar.classList.add('material-snackbar');
    snackbar.textContent = message;
    snackbar.style.cssText = `
        position: fixed;
        bottom: 16px;
        left: 16px;
        right: 16px;
        max-width: 568px;
        margin: 0 auto;
        padding: 16px;
        background-color: #323232;
        color: #fff;
        border-radius: 4px;
        box-shadow: 0 2px 5px -1px rgba(0, 0, 0, 0.2), 0 2px 8px 0 rgba(0, 0, 0, 0.14);
        z-index: 5000;
        animation: snackbar-in 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        font-size: 14px;
        line-height: 1.5;
    `;

    document.body.appendChild(snackbar);

    setTimeout(() => {
        snackbar.style.animation = 'snackbar-out 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        setTimeout(() => snackbar.remove(), 300);
    }, duration);
};

// Add snackbar animations
const snackbarStyle = document.createElement('style');
snackbarStyle.textContent = `
    @keyframes snackbar-in {
        from {
            opacity: 0;
            transform: translateY(100px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes snackbar-out {
        from {
            opacity: 1;
            transform: translateY(0);
        }
        to {
            opacity: 0;
            transform: translateY(100px);
        }
    }
`;
document.head.appendChild(snackbarStyle);

/**
 * Mobile viewport optimization
 */
function optimizeForMobile() {
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, viewport-fit=cover, user-scalable=yes, maximum-scale=5');
    }

    // Disable pinch-to-zoom on buttons and interactive elements
    document.addEventListener('touchmove', function(e) {
        if (e.touches.length > 1) {
            e.preventDefault();
        }
    }, { passive: false });
}

optimizeForMobile();

/**
 * Utility: Create Material Dropdown
 */
window.createMaterialDropdown = function(triggerText, items = []) {
    const container = document.createElement('div');
    container.className = 'material-dropdown';

    const trigger = document.createElement('button');
    trigger.className = 'material-dropdown__trigger';
    trigger.textContent = triggerText;

    const menu = document.createElement('div');
    menu.className = 'material-dropdown__menu';

    items.forEach(item => {
        const menuItem = document.createElement('button');
        menuItem.className = 'material-dropdown__item';
        menuItem.setAttribute('data-value', item.value || item.text);
        menuItem.textContent = item.text;
        menu.appendChild(menuItem);
    });

    container.appendChild(trigger);
    container.appendChild(menu);
    return container;
};

/**
 * Utility: Create Material Checkbox
 */
window.createMaterialCheckbox = function(label, checked = false) {
    const container = document.createElement('label');
    container.className = 'material-checkbox';

    const input = document.createElement('input');
    input.type = 'checkbox';
    input.className = 'material-checkbox__input';
    input.checked = checked;

    const labelText = document.createElement('span');
    labelText.className = 'material-checkbox__label';
    labelText.textContent = label;

    container.appendChild(input);
    container.appendChild(labelText);
    return container;
};

/**
 * Utility: Enhance Select element to look like Material Dropdown
 */
window.enhanceMaterialSelect = function(selectElement) {
    if (!selectElement) return;
    selectElement.classList.add('material-select');
    
    // Wrap with styling container
    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'position: relative; display: inline-block; width: 100%;';
    selectElement.parentNode.insertBefore(wrapper, selectElement);
    wrapper.appendChild(selectElement);
};

/**
 * Utility: Show Material Snackbar with action
 */
window.showMaterialSnackbarWithAction = function(message, actionText = 'DISMISS', onAction = null, duration = 3000) {
    const snackbar = document.createElement('div');
    snackbar.classList.add('material-snackbar');
    
    const messageEl = document.createElement('span');
    messageEl.textContent = message;
    
    const actionBtn = document.createElement('button');
    actionBtn.textContent = actionText;
    actionBtn.style.cssText = `
        background: none;
        border: none;
        color: #bb86fc;
        font-weight: 500;
        cursor: pointer;
        padding: 0 16px;
        font-size: 14px;
    `;
    
    if (onAction) {
        actionBtn.addEventListener('click', onAction);
    }
    
    snackbar.style.cssText = `
        position: fixed;
        bottom: 16px;
        left: 16px;
        right: 16px;
        max-width: 568px;
        margin: 0 auto;
        padding: 16px;
        background-color: #323232;
        color: #fff;
        border-radius: 4px;
        box-shadow: 0 2px 5px -1px rgba(0, 0, 0, 0.2), 0 2px 8px 0 rgba(0, 0, 0, 0.14);
        z-index: 5000;
        animation: snackbar-in 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        font-size: 14px;
        line-height: 1.5;
        display: flex;
        align-items: center;
        justify-content: space-between;
    `;

    snackbar.appendChild(messageEl);
    snackbar.appendChild(actionBtn);
    document.body.appendChild(snackbar);

    const removeSnackbar = () => {
        snackbar.style.animation = 'snackbar-out 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        setTimeout(() => snackbar.remove(), 300);
    };

    setTimeout(removeSnackbar, duration);
};

// Export for global use
window.MaterialUI = {
    enhance: window.enhanceAndroidUI,
    createCard: window.createMaterialCard,
    createButton: window.createMaterialButton,
    createDropdown: window.createMaterialDropdown,
    createCheckbox: window.createMaterialCheckbox,
    enhanceSelect: window.enhanceMaterialSelect,
    showSnackbar: window.showMaterialSnackbar,
    showSnackbarWithAction: window.showMaterialSnackbarWithAction
};
