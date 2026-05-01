/* ============================================
   Modern UI Enhancements
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    // Add smooth page transitions
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.3s ease-in';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
    
    // Enhance form inputs with modern styling
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        if (!input.classList.contains('form-input')) {
            input.classList.add('form-input');
        }
        
        // Add focus effects
        input.addEventListener('focus', function() {
            this.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
        });
        
        input.addEventListener('blur', function() {
            this.style.boxShadow = 'none';
        });
    });
    
    // Enhance buttons with modern styling
    const buttons = document.querySelectorAll('button:not(.jssocials-item)');
    buttons.forEach(button => {
        if (!button.classList.contains('btn') && !button.classList.contains('btn-primary')) {
            button.classList.add('btn', 'btn-primary');
        }
    });
    
    // Add loading animation class to app container
    const appContainer = document.getElementById('app');
    if (appContainer) {
        appContainer.classList.add('fade-in');
    }
    
    // Scroll animation for elements
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for scroll animation
    document.querySelectorAll('.card, .form-group, .input-group').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(10px)';
        el.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
        observer.observe(el);
    });
});

// Helper function to add modern styles to dynamically created elements
function enhanceModernUI(element) {
    if (!element) return;
    
    const inputs = element.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        if (!input.classList.contains('form-input')) {
            input.classList.add('form-input');
        }
    });
    
    const buttons = element.querySelectorAll('button:not(.jssocials-item)');
    buttons.forEach(button => {
        if (!button.classList.contains('btn')) {
            button.classList.add('btn', 'btn-primary');
        }
    });
}

// Export for use in other scripts
window.enhanceModernUI = enhanceModernUI;
