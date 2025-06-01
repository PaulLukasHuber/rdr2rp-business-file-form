/**
 * MODULAR TOAST SYSTEM v2.0
 * - Unten rechts positioniert
 * - Keine Action Buttons
 * - Verbessertes Stacking (neue schieben alte nach oben)
 * 
 * Features:
 * - Verschiedene Toast-Typen (success, error, warning, info, loading)
 * - Auto-dismiss mit konfigurierbarer Zeit
 * - Manual dismiss
 * - Progress bar
 * - Responsive design
 * - Accessibility support
 * - Verbessertes Toast stacking
 */

class ToastSystem {
    constructor() {
        this.container = null;
        this.toasts = [];
        this.maxToasts = 5;
        this.defaultDuration = 5000;
        
        // Icons für verschiedene Toast-Typen
        this.icons = {
            success: '<i class="fa fa-check"></i>',
            error: '<i class="fa fa-times"></i>',
            warning: '<i class="fa fa-exclamation-triangle"></i>',
            info: '<i class="fa fa-info-circle"></i>',
            loading: '<i class="fa fa-spinner"></i>'
        };
        
        this.init();
        console.log('🍞 ToastSystem v2.0 initialized - Bottom right, no buttons, improved stacking');
    }

    // ===== INITIALIZATION =====
    init() {
        this.createContainer();
        this.addEventListeners();
    }

    createContainer() {
        // Prüfen ob Container bereits existiert
        this.container = document.getElementById('toast-container');
        
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.id = 'toast-container';
            this.container.className = 'toast-container';
            document.body.appendChild(this.container);
        }
    }

    addEventListeners() {
        // Global escape key listener
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.dismissAll();
            }
        });
    }

    // ===== MAIN TOAST CREATION METHOD =====
    show(options) {
        // Default options (OHNE actions)
        const config = {
            type: 'info',
            title: '',
            message: '',
            duration: this.defaultDuration,
            autoDismiss: true,
            showClose: true,
            icon: null,
            ...options
        };

        // Validierung
        if (!config.title && !config.message) {
            console.error('Toast must have at least a title or message');
            return null;
        }

        // Toast Element erstellen
        const toast = this.createToastElement(config);
        
        // Toast zur Liste hinzufügen
        this.toasts.push({
            element: toast,
            config: config,
            timeoutId: null
        });

        // Toast zum Container hinzufügen (am Anfang für besseres Stacking)
        this.container.insertBefore(toast, this.container.firstChild);

        // Toast anzeigen (nach kleiner Verzögerung für Animation)
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);

        // Auto-dismiss setup
        if (config.autoDismiss && config.duration > 0) {
            this.setupAutoDismiss(toast, config.duration);
        }

        // Overflow management
        this.manageToastOverflow();

        return toast;
    }

    // ===== TOAST ELEMENT CREATION (VEREINFACHT - KEINE BUTTONS) =====
    createToastElement(config) {
        const toast = document.createElement('div');
        toast.className = `toast ${config.type}`;
        
        // Icon
        const iconHtml = config.icon || this.icons[config.type] || this.icons.info;

        // Close button
        const closeButtonHtml = config.showClose ? '<button class="toast-close" aria-label="Toast schließen">×</button>' : '';

        // Progress bar (nur für auto-dismiss)
        const progressHtml = config.autoDismiss && config.duration > 0 
            ? `<div class="toast-progress" style="animation-duration: ${config.duration}ms;"></div>` 
            : '';

        // Toast HTML zusammenbauen (OHNE Actions)
        toast.innerHTML = `
            <div class="toast-icon">${iconHtml}</div>
            <div class="toast-content">
                ${config.title ? `<div class="toast-title">${config.title}</div>` : ''}
                ${config.message ? `<div class="toast-message">${config.message}</div>` : ''}
            </div>
            ${closeButtonHtml}
            ${progressHtml}
        `;

        // Event listeners hinzufügen
        this.addToastEventListeners(toast, config);

        return toast;
    }

    // ===== EVENT LISTENERS FÜR TOAST (VEREINFACHT) =====
    addToastEventListeners(toast, config) {
        // Close button
        const closeButton = toast.querySelector('.toast-close');
        if (closeButton) {
            closeButton.addEventListener('click', (e) => {
                e.stopPropagation();
                this.dismiss(toast);
            });
        }

        // Hover pause/resume für auto-dismiss
        if (config.autoDismiss) {
            let timeoutId = null;
            
            toast.addEventListener('mouseenter', () => {
                const progressBar = toast.querySelector('.toast-progress');
                if (progressBar) {
                    progressBar.style.animationPlayState = 'paused';
                }
                
                // Clear timeout
                const toastData = this.toasts.find(t => t.element === toast);
                if (toastData && toastData.timeoutId) {
                    clearTimeout(toastData.timeoutId);
                }
            });

            toast.addEventListener('mouseleave', () => {
                const progressBar = toast.querySelector('.toast-progress');
                if (progressBar) {
                    progressBar.style.animationPlayState = 'running';
                }
                
                // Restart timeout with remaining time
                const toastData = this.toasts.find(t => t.element === toast);
                if (toastData) {
                    toastData.timeoutId = setTimeout(() => {
                        this.dismiss(toast);
                    }, config.duration);
                }
            });
        }
    }

    // ===== AUTO-DISMISS SETUP =====
    setupAutoDismiss(toast, duration) {
        const toastData = this.toasts.find(t => t.element === toast);
        if (toastData) {
            toastData.timeoutId = setTimeout(() => {
                this.dismiss(toast);
            }, duration);
        }
    }

    // ===== TOAST DISMISSAL =====
    dismiss(toast) {
        if (!toast || !toast.parentNode) return;

        // Timeout clearen
        const toastData = this.toasts.find(t => t.element === toast);
        if (toastData && toastData.timeoutId) {
            clearTimeout(toastData.timeoutId);
        }

        // Hide animation
        toast.classList.add('hide');

        // Element nach Animation entfernen
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
            
            // Aus Array entfernen
            this.toasts = this.toasts.filter(t => t.element !== toast);
        }, 300);
    }

    dismissAll() {
        this.toasts.forEach(toastData => {
            this.dismiss(toastData.element);
        });
    }

    // ===== OVERFLOW MANAGEMENT =====
    manageToastOverflow() {
        if (this.toasts.length > this.maxToasts) {
            // Älteste Toasts entfernen (die letzten im Array, da neue am Anfang eingefügt werden)
            const toastsToRemove = this.toasts.slice(this.maxToasts);
            toastsToRemove.forEach(toastData => {
                this.dismiss(toastData.element);
            });
        }
    }

    // ===== CONVENIENCE METHODS (OHNE ACTIONS) =====
    success(title, message, options = {}) {
        return this.show({
            type: 'success',
            title,
            message,
            ...options
        });
    }

    error(title, message, options = {}) {
        return this.show({
            type: 'error',
            title,
            message,
            duration: 8000, // Errors bleiben länger
            ...options
        });
    }

    warning(title, message, options = {}) {
        return this.show({
            type: 'warning',
            title,
            message,
            duration: 6000,
            ...options
        });
    }

    info(title, message, options = {}) {
        return this.show({
            type: 'info',
            title,
            message,
            ...options
        });
    }

    loading(title, message, options = {}) {
        return this.show({
            type: 'loading',
            title,
            message,
            autoDismiss: false, // Loading toasts dismisst man normalerweise manuell
            showClose: false,
            ...options
        });
    }

    // ===== SPEZIELLE METHODS FÜR FORM VALIDATION (OHNE ACTIONS) =====
    validationError(errors, options = {}) {
        const errorList = Array.isArray(errors) ? errors : [errors];
        const message = errorList.map(error => `• ${error}`).join('<br>');
        
        return this.error(
            '⚠️ Formular unvollständig',
            `Bitte korrigieren Sie folgende Fehler:<br><br>${message}`,
            {
                duration: 10000, // Längere Anzeigezeit für Validierungsfehler
                ...options
            }
        );
    }

    // ===== SPEZIELLE METHODS FÜR GENERATION PROCESS (OHNE ACTIONS) =====
    generationProgress(title, message) {
        return this.loading(
            title || '🔄 Wird generiert...',
            message || 'Bitte warten Sie, während die Vorlage erstellt wird...'
        );
    }

    generationSuccess(documentType = 'Vorlage') {
        return this.success(
            '✅ Erfolgreich generiert!',
            `Die ${documentType} wurde erfolgreich erstellt und ist in der Vorschau verfügbar.`
        );
    }

    // ===== SPEZIELLE METHODS FÜR COPY PROCESS (OHNE ACTIONS) =====
    copyProgress() {
        return this.loading(
            '📋 Wird kopiert...',
            'Die Vorlage wird in die Zwischenablage kopiert...'
        );
    }

    copySuccess(documentType = 'Vorlage') {
        return this.success(
            '✅ Erfolgreich kopiert!',
            `Die ${documentType} wurde in die Zwischenablage kopiert. Sie können sie jetzt einfügen (Strg+V).`
        );
    }

    copyError(reason = '') {
        const message = reason 
            ? `Kopieren fehlgeschlagen: ${reason}` 
            : 'Das Kopieren ist fehlgeschlagen. Bitte versuchen Sie es erneut.';
            
        return this.error(
            '⚠️ Kopieren fehlgeschlagen',
            message
        );
    }

    // ===== SPEZIELLE METHODS FÜR IMPORT PROCESS (OHNE ACTIONS) =====
    importSuccess(documentType = 'Akte') {
        return this.success(
            '✅ Import erfolgreich!',
            `Die ${documentType} wurde erfolgreich importiert und kann jetzt bearbeitet werden.`
        );
    }

    importError(documentType = 'Akte', reason = '') {
        const message = reason 
            ? `Die ${documentType} konnte nicht importiert werden: ${reason}` 
            : `Die ${documentType} konnte nicht importiert werden. Bitte überprüfen Sie das Format.`;
            
        return this.error(
            '⚠️ Import fehlgeschlagen',
            message
        );
    }

    // ===== UTILITY METHODS =====
    update(toast, newOptions) {
        if (!toast) return;

        const toastData = this.toasts.find(t => t.element === toast);
        if (!toastData) return;

        // Update config
        Object.assign(toastData.config, newOptions);

        // Update content if needed
        if (newOptions.title !== undefined) {
            const titleElement = toast.querySelector('.toast-title');
            if (titleElement) {
                titleElement.textContent = newOptions.title;
            }
        }

        if (newOptions.message !== undefined) {
            const messageElement = toast.querySelector('.toast-message');
            if (messageElement) {
                messageElement.innerHTML = newOptions.message;
            }
        }

        // Update type/class if needed
        if (newOptions.type !== undefined) {
            toast.className = `toast ${newOptions.type} show`;
        }
    }

    count() {
        return this.toasts.length;
    }

    clear() {
        this.dismissAll();
    }
}

// ===== GLOBAL INSTANCE =====
window.Toast = new ToastSystem();

// ===== GLOBAL CONVENIENCE FUNCTIONS =====
window.showToast = (type, title, message, options) => {
    return window.Toast[type](title, message, options);
};

window.dismissAllToasts = () => {
    window.Toast.dismissAll();
};

// ===== AUTO-INITIALIZE =====
document.addEventListener('DOMContentLoaded', () => {
    if (!window.Toast) {
        window.Toast = new ToastSystem();
    }
});

// ===== EXPORT FÜR MODULE =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ToastSystem;
}

console.log('🍞 Toast System v2.0 loaded - Bottom right, no buttons, improved stacking!');