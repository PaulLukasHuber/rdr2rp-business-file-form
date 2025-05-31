// ===================================
// DRAG & DROP CORE SYSTEM v5.0
// Grundfunktionalität für alle Dokumenttypen
// ===================================

class DragDropCore {
    constructor() {
        this.version = "5.0";
        this.currentPage = this.detectCurrentPage();
        console.log(`🚀 DragDropCore v${this.version} initializing for page: ${this.currentPage}`);
        
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

        console.log(`✅ Drag & Drop zones initialized for ${importSections.length} sections`);
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
            
            setTimeout(() => {
                this.autoImport(text);
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

    // ===== AUTO-IMPORT LOGIC =====
    autoImport(text) {
        const pageNames = {
            'gewerbeakte': 'Gewerbeakte',
            'personenpruefung': 'Personenprüfungsakte',
            'antrag': 'Antrag'
        };

        const pageName = pageNames[this.currentPage] || 'Dokument';
        const confirmation = this.createConfirmationDialog(
            '📥 Import bereit',
            `Möchten Sie die ${pageName} automatisch importieren?`,
            () => this.executeAutoImport(text),
            () => console.log('Auto-Import cancelled')
        );

        document.body.appendChild(confirmation);
        setTimeout(() => {
            if (confirmation.parentNode) {
                confirmation.remove();
            }
        }, 10000);
    }

    executeAutoImport(text) {
        console.log(`🚀 v${this.version}: Executing auto-import for: ${this.currentPage}`);
        
        // Load the appropriate page-specific handler
        switch (this.currentPage) {
            case 'gewerbeakte':
                if (window.DragDropGewerbeakte) {
                    const handler = new window.DragDropGewerbeakte();
                    handler.handleImport(text);
                } else {
                    console.error('❌ DragDropGewerbeakte handler not loaded');
                }
                break;
            case 'personenpruefung':
                if (window.DragDropPersonenpruefung) {
                    const handler = new window.DragDropPersonenpruefung();
                    handler.handleImport(text);
                } else {
                    console.error('❌ DragDropPersonenpruefung handler not loaded');
                }
                break;
            case 'antrag':
                if (window.DragDropAntrag) {
                    const handler = new window.DragDropAntrag();
                    handler.handleImport(text);
                } else {
                    console.error('❌ DragDropAntrag handler not loaded');
                }
                break;
            default:
                console.log('❌ Unknown page type for auto-import:', this.currentPage);
        }

        // Cleanup after import
        this.postImportCleanup();
    }

    // ===== UI MANAGEMENT =====
    postImportCleanup() {
        setTimeout(() => {
            this.closeImportSection();
            this.disableImportButton();
            this.showImportSuccessToast();
        }, 1500);
    }

    closeImportSection() {
        const importContent = document.getElementById('import-content');
        if (importContent && importContent.classList.contains('expanded')) {
            if (typeof toggleImport === 'function') {
                toggleImport();
            }
        }
    }

    disableImportButton() {
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
            }, 3000);
        }
    }

    // ===== TOAST NOTIFICATIONS =====
    showImportSuccessToast() {
        const toast = this.createToast(
            'success',
            '✅ Import erfolgreich',
            `Die ${this.currentPage} wurde korrekt importiert.`
        );
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            if (toast.parentNode) {
                toast.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => toast.remove(), 300);
            }
        }, 4000);
    }

    showParseErrorToast() {
        const toast = this.createToast(
            'error',
            '⚠️ Import fehlgeschlagen',
            'Die Akte konnte nicht geparst werden.'
        );
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            if (toast.parentNode) {
                toast.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => toast.remove(), 300);
            }
        }, 5000);
    }

    createToast(type, title, message) {
        const toast = document.createElement('div');
        toast.className = `drag-drop-toast ${type}`;
        toast.innerHTML = `
            <div style="font-weight: bold; margin-bottom: 0.3rem;">${title}</div>
            <div style="font-size: 0.9rem; opacity: 0.9;">${message}</div>
        `;
        return toast;
    }

    showDropError(message) {
        alert(`⚠️ ${message}`);
    }

    // ===== DIALOG CREATION =====
    createConfirmationDialog(title, message, onConfirm, onCancel) {
        const overlay = document.createElement('div');
        overlay.className = 'drag-drop-confirmation-overlay';
        overlay.innerHTML = `
            <div class="drag-drop-confirmation">
                <div class="drag-drop-confirmation-header">
                    <h3>${title}</h3>
                    <button class="drag-drop-close" onclick="this.closest('.drag-drop-confirmation-overlay').remove()">×</button>
                </div>
                <div class="drag-drop-confirmation-body">
                    <p>${message}</p>
                </div>
                <div class="drag-drop-confirmation-buttons">
                    <button class="drag-drop-btn-confirm">✅ Ja, importieren</button>
                    <button class="drag-drop-btn-cancel">❌ Abbrechen</button>
                </div>
            </div>
        `;

        const confirmBtn = overlay.querySelector('.drag-drop-btn-confirm');
        const cancelBtn = overlay.querySelector('.drag-drop-btn-cancel');

        confirmBtn.addEventListener('click', () => {
            onConfirm();
            overlay.remove();
        });

        cancelBtn.addEventListener('click', () => {
            onCancel();
            overlay.remove();
        });

        return overlay;
    }

    // ===== EVENT LISTENERS =====
    setupEventListeners() {
        window.addEventListener('dragover', this.preventDefaults, false);
        window.addEventListener('drop', this.preventDefaults, false);
    }

    // ===== STYLES =====
    addStyles() {
        if (document.getElementById('drag-drop-core-styles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'drag-drop-core-styles';
        styles.textContent = `
            .drag-over {
                background: rgba(244, 192, 102, 0.1) !important;
                border: 2px dashed #F4C066 !important;
                transform: scale(1.02);
                transition: all 0.3s ease;
            }

            .drag-drop-toast {
                position: fixed;
                top: 2rem;
                right: 2rem;
                background: linear-gradient(135deg, #2C2623 0%, #1E1A17 100%);
                color: #F5F5F5;
                padding: 1rem 1.5rem;
                border-radius: 10px;
                border: 1px solid rgba(255,255,255,0.1);
                box-shadow: 0 8px 32px rgba(0,0,0,0.3);
                z-index: 3000;
                animation: slideInRight 0.3s ease;
                max-width: 300px;
            }

            .drag-drop-toast.success {
                border-left: 4px solid #35A2A2;
            }

            .drag-drop-toast.error {
                border-left: 4px solid #FF8232;
            }

            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }

            @keyframes slideOutRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }

            .drag-drop-confirmation-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(30, 26, 23, 0.9);
                backdrop-filter: blur(5px);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 2000;
            }

            .drag-drop-confirmation {
                background: linear-gradient(135deg, #2C2623 0%, #1E1A17 100%);
                border: 1px solid rgba(255,255,255,0.1);
                border-radius: 15px;
                padding: 2rem;
                max-width: 450px;
                width: 90%;
                text-align: center;
                box-shadow: 0 20px 40px rgba(0,0,0,0.6);
            }

            .drag-drop-confirmation-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 1.5rem;
            }

            .drag-drop-confirmation-header h3 {
                color: #F4C066;
                margin: 0;
            }

            .drag-drop-close {
                background: #C8491D;
                color: #F5F5F5;
                border: none;
                width: 28px;
                height: 28px;
                border-radius: 50%;
                cursor: pointer;
            }

            .drag-drop-confirmation-buttons {
                display: flex;
                gap: 1rem;
                justify-content: center;
            }

            .drag-drop-btn-confirm {
                background: linear-gradient(135deg, #F4C066 0%, #D99C45 100%);
                color: #2C2623;
                border: none;
                padding: 0.8rem 1.5rem;
                border-radius: 8px;
                cursor: pointer;
                font-weight: bold;
            }

            .drag-drop-btn-cancel {
                background: linear-gradient(135deg, #CB8358 0%, #A85F3D 100%);
                color: #F5F5F5;
                border: none;
                padding: 0.8rem 1.5rem;
                border-radius: 8px;
                cursor: pointer;
                font-weight: bold;
            }
        `;
        
        document.head.appendChild(styles);
    }
}

// ===== UTILITY FUNCTIONS =====
class DragDropUtils {
    static fillField(fieldId, value) {
        if (!value) {
            console.log(`⚠️ No value for ${fieldId}`);
            return;
        }
        
        const field = document.getElementById(fieldId);
        if (field) {
            field.value = value;
            field.dispatchEvent(new Event('input', { bubbles: true }));
            field.dispatchEvent(new Event('change', { bubbles: true }));
            console.log(`✅ Filled ${fieldId}: "${value}"`);
        } else {
            console.error(`❌ Field ${fieldId} not found`);
        }
    }

    static setCurrentDate() {
        const today = new Date();
        const currentMonth = String(today.getMonth() + 1).padStart(2, '0');
        const currentDay = String(today.getDate()).padStart(2, '0');
        const datumField = document.getElementById('datum');
        if (datumField) {
            datumField.value = `1899-${currentMonth}-${currentDay}`;
            console.log(`✅ Set current date: 1899-${currentMonth}-${currentDay}`);
        }
    }

    static extractSimpleField(text, fieldName) {
        console.log(`🔍 Extracting "${fieldName}"`);
        
        const lines = text.split('\n');
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            const lowerLine = line.toLowerCase();
            const lowerField = fieldName.toLowerCase();
            
            if (lowerLine.includes(lowerField + ':')) {
                console.log(`📍 Found field "${fieldName}" at line ${i}: "${line}"`);
                
                // Value on same line after colon
                const colonIndex = line.indexOf(':');
                if (colonIndex !== -1) {
                    const sameLineValue = line.substring(colonIndex + 1).trim();
                    if (sameLineValue && sameLineValue !== '---' && sameLineValue !== '```') {
                        console.log(`✅ Same line value: "${sameLineValue}"`);
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
                        console.log(`✅ Next line value: "${nextLine}"`);
                        return nextLine;
                    }
                }
                break;
            }
        }
        
        console.log(`❌ No value found for "${fieldName}"`);
        return null;
    }
}

// Initialize the core system
function initializeDragDropCore() {
    if (!window.dragDropCore) {
        window.dragDropCore = new DragDropCore();
        window.DragDropUtils = DragDropUtils;
        console.log('🎯 DragDropCore v5.0 initialized');
    }
    return window.dragDropCore;
}

// Auto-Initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeDragDropCore);
} else {
    initializeDragDropCore();
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DragDropCore, DragDropUtils, initializeDragDropCore };
}