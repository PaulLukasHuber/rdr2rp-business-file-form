/**
 * MODULAR TOAST SYSTEM v2.3 - SIMPLIFIED CONFIRMATION TOAST
 * - Confirmation Toast Design an normale Toasts angepasst
 * - Entfernte überflüssige Spezial-Effekte
 * - Einheitliches Design für alle Toast-Typen
 * 
 * Features:
 * - Verschiedene Toast-Typen (success, error, warning, info, loading)
 * - Confirmation Toasts mit Ja/Nein Buttons (vereinfachtes Design)
 * - Auto-dismiss mit konfigurierbarer Zeit
 * - Manual dismiss
 * - Progress bar
 * - Responsive design
 * - Accessibility support
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
        console.log('🍞 ToastSystem v2.3 initializing');
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
        // Default options
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

    // ===== TOAST ELEMENT CREATION =====
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

        // Toast HTML zusammenbauen
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

    // ===== SIMPLIFIED CONFIRMATION TOAST METHOD =====
    confirmation(options) {
        const config = {
            type: 'info', // Normale Info-Toast Basis
            title: 'Bestätigung erforderlich',
            message: 'Möchten Sie fortfahren?',
            autoDismiss: false, // Bleibt bis der User eine Aktion wählt
            showClose: false,   // Kein Standard-Close Button
            duration: 0,
            confirmText: ' Ja',
            cancelText: ' Abbrechen',
            onConfirm: () => {},
            onCancel: () => {},
            // ENTFERNT: urgent option
            ...options
        };

        // Toast Element erstellen
        const toast = this.createConfirmationToastElement(config);
        
        // Toast zur Liste hinzufügen
        this.toasts.push({
            element: toast,
            config: config,
            timeoutId: null
        });

        // Toast zum Container hinzufügen
        this.container.insertBefore(toast, this.container.firstChild);

        // Toast anzeigen
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);

        // Auto-dismiss nach längerer Zeit (falls User nicht reagiert)
        if (config.autoDismiss !== false) {
            const autoDismissTime = config.duration || 15000; // 15 Sekunden default
            this.setupAutoDismiss(toast, autoDismissTime);
        }

        return toast;
    }

    // ===== SIMPLIFIED CONFIRMATION TOAST ELEMENT CREATION =====
    createConfirmationToastElement(config) {
        const toast = document.createElement('div');
        toast.className = `toast ${config.type} confirmation-toast`; // ENTFERNT: urgent class
        
        const iconHtml = config.icon || this.icons[config.type] || this.icons.info;

        toast.innerHTML = `
            <div class="toast-icon">${iconHtml}</div>
            <div class="toast-content">
                ${config.title ? `<div class="toast-title">${config.title}</div>` : ''}
                ${config.message ? `<div class="toast-message">${config.message}</div>` : ''}
                <div class="toast-actions">
                    <button class="toast-action-btn toast-confirm-btn">${config.confirmText}</button>
                    <button class="toast-action-btn toast-cancel-btn">${config.cancelText}</button>
                </div>
            </div>
        `;

        // Event listeners hinzufügen
        this.addConfirmationEventListeners(toast, config);

        return toast;
    }

    // ===== CONFIRMATION EVENT LISTENERS =====
    addConfirmationEventListeners(toast, config) {
        const confirmBtn = toast.querySelector('.toast-confirm-btn');
        const cancelBtn = toast.querySelector('.toast-cancel-btn');

        if (confirmBtn) {
            confirmBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (config.onConfirm) {
                    config.onConfirm();
                }
                this.dismiss(toast);
            });
        }

        if (cancelBtn) {
            cancelBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (config.onCancel) {
                    config.onCancel();
                }
                this.dismiss(toast);
            });
        }

        // ENTFERNT: Spezielle Hover-Effekte für Confirmation Toast
        // Standard Toast hover wird verwendet

        // Keyboard navigation
        confirmBtn.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                e.preventDefault();
                cancelBtn.focus();
            }
        });

        cancelBtn.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                e.preventDefault();
                confirmBtn.focus();
            }
        });
    }

    // ===== EVENT LISTENERS FÜR TOAST =====
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

    // ===== CONVENIENCE METHODS =====
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
            type: 'warning',
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

    // ===== SIMPLIFIED IMPORT CONFIRMATION METHOD =====
    importConfirmation(documentType, onConfirm, onCancel) {
        return this.confirmation({
            type: 'info', // Standard info-Toast Design
            title: ' Import bereit',
            message: `Möchten Sie die ${documentType} automatisch importieren und das Formular ausfüllen?`,
            confirmText: ' Ja, importieren',
            cancelText: ' Abbrechen',
            onConfirm: onConfirm,
            onCancel: onCancel
            // ENTFERNT: urgent option
        });
    }

    // ===== VALIDATION ERROR METHOD =====
    validationError(errors, options = {}) {
        const errorList = Array.isArray(errors) ? errors : [errors];
        
        // HTML für die Fehlerliste erstellen (mit besserer Formatierung)
        const errorItems = errorList.map(error => `• ${error}`).join('<br>');
        const message = `Bitte korrigieren Sie folgende Fehler:<br><br><div style="padding-left: 0.5rem; line-height: 1.6;">${errorItems}</div>`;
        
        return this.show({
            type: 'warning',
            title: 'Formular unvollständig',
            message: message,
            duration: 10000, // Längere Anzeigezeit für Validierungsfehler
            showClose: true,
            autoDismiss: true,
            ...options
        });
    }

    // ===== SPEZIELLE METHODS FÜR GENERATION PROCESS =====
    generationProgress(title, message) {
        return this.loading(
            title || 'Wird generiert...',
            message || 'Bitte warten Sie, während die Vorlage erstellt wird...'
        );
    }

    generationSuccess(documentType = 'Vorlage') {
        return this.success(
            'Erfolgreich generiert!',
            `Die ${documentType} wurde erfolgreich erstellt und ist in der Vorschau verfügbar.`
        );
    }

    // ===== SPEZIELLE METHODS FÜR COPY PROCESS =====
    copyProgress() {
        return this.loading(
            'Wird kopiert...',
            'Die Vorlage wird in die Zwischenablage kopiert...'
        );
    }

    copySuccess(documentType = 'Vorlage') {
        return this.success(
            'Erfolgreich kopiert!',
            `Die ${documentType} wurde in die Zwischenablage kopiert. Sie können sie jetzt einfügen (Strg+V).`
        );
    }

    copyError(reason = '') {
        const message = reason 
            ? `Kopieren fehlgeschlagen: ${reason}` 
            : 'Das Kopieren ist fehlgeschlagen. Bitte versuchen Sie es erneut.';
            
        return this.error(
            'Kopieren fehlgeschlagen',
            message
        );
    }

    // ===== SPEZIELLE METHODS FÜR IMPORT PROCESS =====
    importSuccess(documentType = 'Akte') {
        return this.success(
            'Import erfolgreich!',
            `Die ${documentType} wurde erfolgreich importiert und kann jetzt bearbeitet werden.`
        );
    }

    importError(documentType = 'Akte', reason = '') {
        const message = reason 
            ? `Die ${documentType} konnte nicht importiert werden: ${reason}` 
            : `Die ${documentType} konnte nicht importiert werden. Bitte überprüfen Sie das Format.`;
            
        return this.error(
            'Import fehlgeschlagen',
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

console.log('🍞 Toast System v2.3 initialized');