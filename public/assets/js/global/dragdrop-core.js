// ===================================
// DRAG & DROP CORE SYSTEM v6.1 - SMART CONFIRMATION
// Confirmation Toast nur bei Drag & Drop, nicht bei manuellem Import
// Vereinfachtes Design passend zu anderen Toasts
// ===================================

class DragDropCore {
    constructor() {
        this.version = "6.1";
        this.currentPage = this.detectCurrentPage();
        console.log(`🚀 DragDropCore v${this.version} initializing`);
        
        this.initializeDragDrop();
        this.setupEventListeners();
        this.addStyles();
    }

    // ===== PAGE DETECTION =====
    detectCurrentPage() {
        const pathname = window.location.pathname;
        if (pathname.includes('gewerbeakte')) return 'gewerbeakte';
        if (pathname.includes('personenpruefung')) return 'personenpruefung';
        if (pathname.includes('antrag')) return 'antrag';
        return 'unknown';
    }

    // ===== DRAG & DROP INITIALIZATION =====
    initializeDragDrop() {
        const importSections = document.querySelectorAll('.import-section');
        const importTextareas = document.querySelectorAll('#import-text');

        importSections.forEach(section => {
            this.makeDragDropZone(section);
        });

        importTextareas.forEach(textarea => {
            this.makeDragDropZone(textarea);
        });
    }

    makeDragDropZone(element) {
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            element.addEventListener(eventName, this.preventDefaults, false);
        });

        ['dragenter', 'dragover'].forEach(eventName => {
            element.addEventListener(eventName, (e) => this.highlight(e.currentTarget), false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            element.addEventListener(eventName, (e) => this.unhighlight(e.currentTarget), false);
        });

        element.addEventListener('drop', (e) => this.handleDrop(e), false);
    }

    // ===== EVENT HANDLERS =====
    preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    highlight(element) {
        element.classList.add('drag-over');
        if (element.classList.contains('import-section')) {
            const header = element.querySelector('.import-header');
            if (header) {
                header.style.borderColor = '#F4C066';
                header.style.background = 'rgba(244, 192, 102, 0.3)';
            }
        }
    }

    unhighlight(element) {
        element.classList.remove('drag-over');
        if (element.classList.contains('import-section')) {
            const header = element.querySelector('.import-header');
            if (header) {
                header.style.borderColor = '';
                header.style.background = '';
            }
        }
    }

    async handleDrop(e) {
        const files = e.dataTransfer.files;
        const items = e.dataTransfer.items;

        // First, try to get text from clipboard
        if (items.length > 0) {
            for (let item of items) {
                if (item.kind === 'string' && item.type === 'text/plain') {
                    item.getAsString((text) => {
                        this.processDroppedText(text);
                    });
                    return;
                }
            }
        }

        // If no text, try to process files
        if (files.length > 0) {
            await this.processDroppedFiles(files);
        }
    }

    // ===== FILE/TEXT PROCESSING =====
    processDroppedText(text) {
        console.log(`🔄 v${this.version}: Processing dropped text for ${this.currentPage}:`, text.substring(0, 200) + '...');
        
        const importTextarea = document.getElementById('import-text');
        if (importTextarea) {
            importTextarea.value = text;
            importTextarea.dispatchEvent(new Event('input'));
            
            // Trigger checkImportText if available
            if (typeof checkImportText === 'function') {
                checkImportText();
            }
            
            setTimeout(() => {
                // WICHTIG: fromDragDrop = true (zeigt Confirmation Toast)
                this.autoImport(text, true);
            }, 500);
        }
    }

    async processDroppedFiles(files) {
        for (let file of files) {
            if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
                try {
                    const text = await this.readFileAsText(file);
                    this.processDroppedText(text);
                    break;
                } catch (error) {
                    console.error('Error reading file:', error);
                    this.showDropError('Datei konnte nicht gelesen werden.');
                }
            } else {
                this.showDropError('Nur Text-Dateien (.txt) werden unterstützt.');
            }
        }
    }

    readFileAsText(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = (e) => reject(e);
            reader.readAsText(file);
        });
    }

    // ===== SMART AUTO-IMPORT LOGIC =====
    autoImport(text, fromDragDrop = false) {
        const pageNames = {
            'gewerbeakte': 'Gewerbeakte',
            'personenpruefung': 'Personenprüfungsakte',
            'antrag': 'Antrag'
        };

        const pageName = pageNames[this.currentPage] || 'Dokument';
        
        if (fromDragDrop) {
            // ===== DRAG & DROP: Zeige Confirmation Toast =====
            console.log(`🔔 v${this.version}: Drag & Drop detected - showing confirmation toast for ${pageName}`);
            
            if (window.Toast && typeof window.Toast.importConfirmation === 'function') {
                window.Toast.importConfirmation(
                    pageName,
                    () => {
                        console.log(`✅ v${this.version}: User confirmed import for ${pageName}`);
                        this.executeAutoImport(text, fromDragDrop);
                    },
                    () => {
                        console.log(`❌ v${this.version}: User cancelled import for ${pageName}`);
                        this.showImportCancelledToast();
                    }
                );
            } else {
                // Fallback: direkter Import ohne Bestätigung
                console.warn(`⚠️ v${this.version}: Toast system not available, using direct import`);
                this.executeAutoImport(text, fromDragDrop);
            }
        } else {
            // ===== MANUELLER IMPORT: Direkt ohne Confirmation =====
            console.log(`⚡ v${this.version}: Manual import detected - direct import for ${pageName}`);
            this.executeAutoImport(text, fromDragDrop);
        }
    }

    executeAutoImport(text, fromDragDrop = false) {
        console.log(`🚀 v${this.version}: Executing auto-import for: ${this.currentPage} (fromDragDrop: ${fromDragDrop})`);
        
        // Load the appropriate page-specific handler
        switch (this.currentPage) {
            case 'gewerbeakte':
                if (window.DragDropGewerbeakte) {
                    const handler = new window.DragDropGewerbeakte();
                    handler.handleImport(text);
                } else {
                    console.error('❌ DragDropGewerbeakte handler not loaded');
                    this.showHandlerError('Gewerbeakte');
                }
                break;
            case 'personenpruefung':
                if (window.DragDropPersonenpruefung || window.SimpleDragDropPersonenpruefung) {
                    const HandlerClass = window.DragDropPersonenpruefung || window.SimpleDragDropPersonenpruefung;
                    const handler = new HandlerClass();
                    handler.handleImport(text);
                } else {
                    console.error('❌ DragDropPersonenpruefung handler not loaded');
                    this.showHandlerError('Personenprüfungsakte');
                }
                break;
            case 'antrag':
                if (window.DragDropAntrag) {
                    const handler = new window.DragDropAntrag();
                    handler.handleImport(text);
                } else {
                    console.error('❌ DragDropAntrag handler not loaded');
                    this.showHandlerError('Antrag');
                }
                break;
            default:
                console.log('❌ Unknown page type for auto-import:', this.currentPage);
                this.showDropError('Unbekannter Seitentyp für Auto-Import.');
        }

        // Post-import cleanup (nur bei Drag & Drop)
        if (fromDragDrop) {
            this.postImportCleanupMinimal();
        }
    }

    // ===== PUBLIC API FÜR MANUELLEN IMPORT =====
    /**
     * Für manuellen Import von Import-Buttons
     * Zeigt KEINE Confirmation
     */
    manualImport(text) {
        console.log(`📝 v${this.version}: Manual import triggered`);
        this.autoImport(text, false); // fromDragDrop = false
    }

    // ===== UI MANAGEMENT =====
    postImportCleanupMinimal() {
        setTimeout(() => {
            this.closeImportSection();
            this.updateImportButtonState();
        }, 1500);
    }

    closeImportSection() {
        const importContent = document.getElementById('import-content');
        if (importContent && importContent.classList.contains('expanded')) {
            if (typeof toggleImport === 'function') {
                console.log(`🔄 v${this.version}: Auto-closing import section`);
                toggleImport();
            }
        }
    }

    updateImportButtonState() {
        const importButton = document.getElementById('import-button');
        const importTextarea = document.getElementById('import-text');
        
        if (importButton && importTextarea) {
            importTextarea.value = '';
            importButton.disabled = true;
            importButton.innerHTML = '<i class="fa-solid fa-check"></i> Import erfolgreich';
            importButton.style.background = 'linear-gradient(135deg, #35A2A2 0%, #6F3E96 100%)';
            
            setTimeout(() => {
                importButton.innerHTML = '<i class="fa-solid fa-circle-info"></i> Akte eingeben zum Importieren';
                importButton.style.background = '';
                
                // Trigger checkImportText if available
                if (typeof checkImportText === 'function') {
                    checkImportText();
                }
            }, 3000);
        }
    }

    showImportCancelledToast() {
        if (window.Toast) {
            window.Toast.info(
                'Import abgebrochen',
                'Der automatische Import wurde abgebrochen. Sie können den Text manuell importieren.',
                { duration: 4000 }
            );
        }
    }

    showHandlerError(documentType) {
        if (window.Toast) {
            window.Toast.error(
                'Handler nicht verfügbar',
                `Der ${documentType}-Handler konnte nicht geladen werden. Bitte laden Sie die Seite neu.`,
                { duration: 8000 }
            );
        }
    }

    showDropError(message) {
        if (window.Toast) {
            window.Toast.error(
                'Drag & Drop Fehler',
                message,
                { duration: 6000 }
            );
        } else {
            // Fallback for old browsers
            alert(`⚠️ ${message}`);
        }
    }

    // ===== EVENT LISTENERS =====
    setupEventListeners() {
        // Prevent default drag behaviors globally
        window.addEventListener('dragover', this.preventDefaults, false);
        window.addEventListener('drop', this.preventDefaults, false);
    }

    // ===== SIMPLIFIED STYLES =====
    addStyles() {
        if (document.getElementById('drag-drop-core-styles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'drag-drop-core-styles';
        styles.textContent = `
            /* ===== DRAG & DROP CORE STYLES v6.1 ===== */
            .drag-over {
                background: rgba(244, 192, 102, 0.15) !important;
                border: 2px dashed #F4C066 !important;
                border-radius: 12px !important;
                transform: scale(1.02);
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                box-shadow: 0 8px 24px rgba(244, 192, 102, 0.3);
            }

            .drag-over .import-header {
                background: rgba(244, 192, 102, 0.3) !important;
                border-color: #F4C066 !important;
                border-radius: 10px !important;
            }

            #import-text.drag-over {
                background: rgba(244, 192, 102, 0.1) !important;
                border: 2px dashed #F4C066 !important;
                border-radius: 8px !important;
                transform: scale(1.02);
                box-shadow: 0 0 15px rgba(244, 192, 102, 0.4);
            }

            /* Enhanced hover effects */
            .import-section:hover {
                border-radius: 12px;
                transition: all 0.2s ease;
            }

            .import-section:hover .import-header {
                border-radius: 10px;
            }

            /* Responsive adjustments */
            @media (max-width: 768px) {
                .drag-over {
                    transform: scale(1.01);
                }
            }

            /* High contrast mode support */
            @media (prefers-contrast: high) {
                .drag-over {
                    border: 3px dashed #F4C066 !important;
                    background: rgba(244, 192, 102, 0.25) !important;
                }
            }

            /* Reduced motion support */
            @media (prefers-reduced-motion: reduce) {
                .drag-over {
                    transform: none !important;
                    transition: none !important;
                }
            }
        `;
        
        document.head.appendChild(styles);
    }

    // ===== UTILITY METHODS =====
    getVersion() {
        return this.version;
    }

    getCurrentPage() {
        return this.currentPage;
    }

    isToastSystemAvailable() {
        return !!(window.Toast && typeof window.Toast.importConfirmation === 'function');
    }

    // ===== DEBUG METHODS =====
    debugInfo() {
        console.log(`🐛 DragDropCore Debug Info v${this.version}:`);
        console.log(`   Current Page: ${this.currentPage}`);
        console.log(`   Toast System Available: ${this.isToastSystemAvailable()}`);
        console.log(`   Active Toasts: ${window.Toast ? window.Toast.count() : 'N/A'}`);
        console.log(`   Available Handlers:`, {
            gewerbeakte: !!window.DragDropGewerbeakte,
            personenpruefung: !!(window.DragDropPersonenpruefung || window.SimpleDragDropPersonenpruefung),
            antrag: !!window.DragDropAntrag
        });
        console.log(`   Public Methods:`);
        console.log(`     - dragDropCore.manualImport(text) // Für manuellen Import ohne Confirmation`);
        console.log(`     - dragDropCore.autoImport(text, fromDragDrop) // Für programmatischen Import`);
    }

    // ===== TEST METHODS =====
    testDragDropImport() {
        console.log(`🧪 Testing Drag & Drop import (shows confirmation)...`);
        this.autoImport('Test text for drag drop', true);
    }

    testManualImport() {
        console.log(`🧪 Testing Manual import (no confirmation)...`);
        this.autoImport('Test text for manual import', false);
    }
}

// ===== UTILITY FUNCTIONS =====
class DragDropUtils {
    static fillField(fieldId, value) {
        if (!value) {
            console.log(`⚠️ DragDropUtils: No value for ${fieldId}`);
            return;
        }
        
        const field = document.getElementById(fieldId);
        if (field) {
            field.value = value;
            field.dispatchEvent(new Event('input', { bubbles: true }));
            field.dispatchEvent(new Event('change', { bubbles: true }));
            console.log(`✅ DragDropUtils: Filled ${fieldId}: "${value}"`);
        } else {
            console.error(`❌ DragDropUtils: Field ${fieldId} not found`);
        }
    }

    static setCurrentDate() {
        const today = new Date();
        const currentMonth = String(today.getMonth() + 1).padStart(2, '0');
        const currentDay = String(today.getDate()).padStart(2, '0');
        const datumField = document.getElementById('datum');
        if (datumField) {
            datumField.value = `1899-${currentMonth}-${currentDay}`;
            console.log(`✅ DragDropUtils: Set current date: 1899-${currentMonth}-${currentDay}`);
        }
    }

    static extractSimpleField(text, fieldName) {
        console.log(`🔍 DragDropUtils: Extracting "${fieldName}"`);
        
        const lines = text.split('\n');
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            const lowerLine = line.toLowerCase();
            const lowerField = fieldName.toLowerCase();
            
            if (lowerLine.includes(lowerField + ':')) {
                console.log(`📍 DragDropUtils: Found field "${fieldName}" at line ${i}: "${line}"`);
                
                // Value on same line after colon
                const colonIndex = line.indexOf(':');
                if (colonIndex !== -1) {
                    const sameLineValue = line.substring(colonIndex + 1).trim();
                    if (sameLineValue && sameLineValue !== '---' && sameLineValue !== '```') {
                        console.log(`✅ DragDropUtils: Same line value: "${sameLineValue}"`);
                        return sameLineValue;
                    }
                }
                
                // Value on next line(s)
                for (let j = i + 1; j < Math.min(i + 5, lines.length); j++) {
                    const nextLine = lines[j].trim();
                    if (nextLine && 
                        nextLine !== '---' && 
                        nextLine !== '```' &&
                        !nextLine.toLowerCase().includes(':') &&
                        nextLine.length > 1) {
                        console.log(`✅ DragDropUtils: Next line value: "${nextLine}"`);
                        return nextLine;
                    }
                }
                break;
            }
        }
        
        console.log(`❌ DragDropUtils: No value found for "${fieldName}"`);
        return null;
    }

    static showToast(type, title, message) {
        if (window.Toast) {
            return window.Toast[type](title, message);
        } else {
            console.warn(`Toast system not available: ${type} - ${title}: ${message}`);
        }
    }

    static debugLogField(fieldId, value, success = true) {
        const status = success ? '✅' : '❌';
        const action = success ? 'Filled' : 'Failed to fill';
        console.log(`${status} DragDropUtils: ${action} ${fieldId}: "${value}"`);
    }
}

// ===== INITIALIZATION FUNCTIONS =====
function initializeDragDropCore() {
    if (!window.dragDropCore) {
        window.dragDropCore = new DragDropCore();
        window.DragDropUtils = DragDropUtils;
        
        // Make debug and test functions globally available
        window.debugDragDrop = () => window.dragDropCore.debugInfo();
        window.testDragDropImport = () => window.dragDropCore.testDragDropImport();
        window.testManualImport = () => window.dragDropCore.testManualImport();
    }
    return window.dragDropCore;
}

// ===== AUTO-INITIALIZE =====
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeDragDropCore);
} else {
    initializeDragDropCore();
}

// Add a delay to ensure Toast system is loaded
setTimeout(() => {
    if (window.dragDropCore && !window.dragDropCore.isToastSystemAvailable()) {
        console.warn('⚠️ Toast system not available after initialization. Some features may be limited.');
    }
}, 1000);

// ===== EXPORT =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DragDropCore, DragDropUtils, initializeDragDropCore };
}

console.log('🎯 DragDropCore v6.1 initialized');