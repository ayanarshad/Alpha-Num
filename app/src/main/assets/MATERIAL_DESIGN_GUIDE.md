# Material Design 3 - Android App Components Guide

## ✨ Latest Updates

Your app now has **complete Material Design 3** implementation with comprehensive dark mode support, proper corner radius, checkmarks, and dropdown menus.

---

## 🎨 Key Features Implemented

### 1. **Checkmarks (✓) Icons**
Checkmarks appear in:
- **Checkboxes**: Native Material Design checkboxes with animated checkmarks
- **Dropdown items**: Selected items show a checkmark icon
- **Custom**: Easy to add to any component

**Usage:**
```html
<!-- Checkbox with checkmark -->
<label class="material-checkbox">
    <input type="checkbox" class="material-checkbox__input" checked>
    <span class="material-checkbox__label">Enable notifications</span>
</label>

<!-- Dropdown item with checkmark -->
<button class="material-dropdown__item selected">
    Selected Option
    <span class="material-checkmark"></span>
</button>
```

**JavaScript:**
```javascript
const checkbox = MaterialUI.createCheckbox("Option", true);
document.body.appendChild(checkbox);
```

---

### 2. **Corner Radius - Material Design 3 Specs**

The app now uses **Material Design 3 corner radius** values:

| Size | Value | Usage |
|------|-------|-------|
| **Small** | 4px | Minor components, text selection |
| **Medium** | 12px | **Buttons, inputs, cards, dropdowns** ⭐ |
| **Large** | 28px | FABs, large dialogs, prominent components |

**Examples:**
```css
/* Medium corner radius (default for most components) */
border-radius: var(--corner-medium); /* 12px */

/* Large corner radius (FABs, large dialogs) */
border-radius: var(--corner-large); /* 28px */

/* Small corner radius (text selection) */
border-radius: var(--corner-small); /* 4px */
```

---

### 3. **Dropdown Menu with Dark Mode**

Material Design dropdown menus with:
- Smooth animations (0.2s cubic-bezier)
- Proper elevation shadows
- Selected state with checkmark
- Full dark mode support
- Touch-optimized
- Accessible keyboard navigation

**HTML Usage:**
```html
<div class="material-dropdown">
    <button class="material-dropdown__trigger">Select Option</button>
    <div class="material-dropdown__menu">
        <button class="material-dropdown__item" data-value="opt1">
            Option 1
        </button>
        <button class="material-dropdown__item" data-value="opt2">
            Option 2
        </button>
        <button class="material-dropdown__item" data-value="opt3">
            Option 3
        </button>
    </div>
</div>
```

**JavaScript Creation:**
```javascript
const dropdown = MaterialUI.createDropdown("Choose Language", [
    { text: "English", value: "en" },
    { text: "Spanish", value: "es" },
    { text: "French", value: "fr" }
]);
document.body.appendChild(dropdown);
```

**Events:**
```javascript
document.querySelector('.material-dropdown__trigger')
    .addEventListener('dropdown-change', (e) => {
        console.log("Selected:", e.detail.value);
    });
```

---

### 4. **Dark Mode Support**

The entire app automatically responds to system dark mode:

**Light Mode Colors:**
- Background: #ffffff
- Surface: #ffffff
- Text: #212121
- Secondary text: #757575
- Hint text: #bdbdbd

**Dark Mode Colors:**
- Background: #121212
- Surface: #1e1e1e
- Text: #ffffff
- Secondary text: #b3b3b3
- Hint text: #808080

**Dark Mode Features:**
✓ Dropdown menus adapt to dark background
✓ Checkboxes border color changes
✓ Inputs get proper dark styling
✓ Buttons maintain contrast
✓ Cards have proper surface color
✓ Select dropdowns show white arrow icon

**Dark Mode Trigger:**
Users' system preferences automatically apply:
- macOS: Settings → General → Appearance
- Windows: Settings → Personalization → Colors
- Android: Developer options or System settings
- iOS: Settings → Display & Brightness

---

## 📦 Component Library

### Available Components

1. **Material Dropdown**
   - Classes: `material-dropdown`, `material-dropdown__trigger`, `material-dropdown__menu`, `material-dropdown__item`
   - Features: Smooth animations, checkmarks, dark mode

2. **Material Checkbox**
   - Classes: `material-checkbox`, `material-checkbox__input`, `material-checkbox__label`
   - Features: Animated checkmark, disabled state, dark mode

3. **Material Select**
   - Class: `material-select`
   - Features: Custom arrow icon, dark mode support

4. **Material Buttons**
   - Primary: `material-btn material-btn--primary`
   - Secondary: `material-btn material-btn--secondary`
   - Outlined: `material-btn material-btn--outlined`
   - Text: `material-btn material-btn--text`

5. **Material Cards**
   - Class: `material-card`
   - Features: Elevation, smooth shadows, hover effects

6. **Material Text Fields**
   - Classes: `material-field`, `material-field__input`, `material-field__label`
   - Features: Floating labels, focus states, dark mode

7. **Material Chips**
   - Class: `material-chip`
   - States: Default, active (`material-chip--active`)

8. **Material Top App Bar**
   - Class: `android-top-bar`
   - Features: Sticky positioning, elevation

---

## 🎯 JavaScript API

All utilities are available via `window.MaterialUI`:

```javascript
// Create components programmatically
const dropdown = MaterialUI.createDropdown("Select", items);
const checkbox = MaterialUI.createCheckbox("Label", checked);
const button = MaterialUI.createButton("Click me", "primary", callback);
const card = MaterialUI.createCard(content);

// Enhance existing elements
MaterialUI.enhance(element);
MaterialUI.enhanceSelect(selectElement);

// Show notifications
MaterialUI.showSnackbar("Message", 3000);
MaterialUI.showSnackbarWithAction("Undo?", "UNDO", callback, 5000);
```

---

## 🌙 Dark Mode Testing

**To test dark mode:**

1. **Firefox Developer Tools:**
   - Press F12 → Settings (⚙️) → Inspector → Emulate CSS media feature prefers-color-scheme

2. **Chrome DevTools:**
   - Press F12 → 3 dots → More tools → Rendering → Emulate CSS media feature prefers-color-scheme

3. **System Settings:**
   - Windows 11: Settings → Personalization → Colors → Dark
   - macOS: System Preferences → General → Dark
   - Android: Settings → Display → Dark theme

---

## 📐 Spacing System

Material Design 3 spacing (following the app's `--spacing-*` variables):

| Variable | Value | Usage |
|----------|-------|-------|
| `--spacing-xs` | 4px | Minimal spacing |
| `--spacing-sm` | 8px | Small gaps |
| `--spacing-md` | 16px | Standard spacing |
| `--spacing-lg` | 24px | Large sections |
| `--spacing-xl` | 32px | Extra large gaps |

---

## 🎬 Animations

All Material Design 3 animations use `cubic-bezier(0.4, 0, 0.2, 1)` for smooth, natural motion:

| Component | Duration | Easing |
|-----------|----------|--------|
| Ripple effect | 0.6s | linear |
| Dropdown open/close | 0.2s | cubic-bezier |
| Elevation change | 0.2s | cubic-bezier |
| Button press | 0.2s | cubic-bezier |
| Snackbar | 0.3s | cubic-bezier |

---

## 📱 Mobile Optimization

The app is fully optimized for mobile:
- Touch-friendly button sizes (min 40px height)
- Smooth scrolling with `-webkit-overflow-scrolling: touch`
- Safe area support for notched devices
- Proper viewport scaling
- Responsive grid layouts
- Ripple feedback on touch

---

## ♿ Accessibility

Full accessibility support:
- ARIA roles and attributes
- Keyboard navigation (Tab, Enter, Space)
- Focus indicators
- Screen reader support
- Contrast ratios meet WCAG AA
- Touch target minimum 40x40px

---

## 📚 Demo Page

Visit: `material-design-demo.html`

This demo showcases:
- All checkmark implementations
- Dropdown menus in action
- Corner radius examples
- Dark mode examples
- All button types
- Form components
- Material cards
- Chips and dividers

---

## 🔄 Component Integration

To integrate into existing pages:

```html
<!-- Add to head -->
<link rel="stylesheet" href="static/css/android-material.css">
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">

<!-- Add to body (before closing tag) -->
<script src="static/js/android-ui.js"></script>
```

Then use Material Design components as shown above.

---

## 🎨 Color Palette

**Light Mode:**
- Primary: `#6200ee` (Purple)
- Primary variant: `#3700b3` (Dark Purple)
- Secondary: `#03dac6` (Teal)
- Secondary variant: `#018786` (Dark Teal)
- Error: `#cf6679` (Red)
- Background: `#ffffff` (White)
- Surface: `#ffffff` (White)

**Dark Mode:**
- Primary: `#bb86fc` (Light Purple)
- Secondary: `#03dac6` (Teal - same)
- Background: `#121212` (Dark)
- Surface: `#1e1e1e` (Dark Gray)

---

## 🚀 Performance

- Optimized CSS with CSS variables
- Hardware-accelerated animations
- Minimal repaints
- Touch event debouncing
- Lazy component initialization
- Small bundle size

---

## 📝 Notes

- All components use Material Design 3 specifications
- Full dark mode support with system preference detection
- Android app-like feel with proper Material elevation and spacing
- All animations use recommended Material timing curves
- Touch feedback with ripple effects
- Proper corner radius on all interactive elements

---

**Version**: Material Design 3  
**Last Updated**: April 2026  
**Status**: ✅ Production Ready
