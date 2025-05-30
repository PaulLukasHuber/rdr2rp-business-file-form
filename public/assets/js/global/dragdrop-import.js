// ===================================
// UNIVERSAL DRAG & DROP IMPORT SYSTEM v3.0
// Komplett überarbeitet mit Cache-Busting
// ===================================

class DragDropImporter {
    constructor() {
        this.version = "3.0";
        console.log(`🚀 DragDropImporter v${this.version} initializing...`);
        this.initializeDragDrop();
        this.setupEventListeners();
        this.initializeFlexibleParsing();
    }

    // Initialize flexible parsing for Discord text without code blocks
    initializeFlexibleParsing() {
        setTimeout(() => {
            this.integrateFlexibleParsers();
        }, 100);
    }

    // Integrate flexible parsers with existing systems
    integrateFlexibleParsers() {
        // Store original parsers as backup
        if (typeof window.parseGewerbeakteText === 'function') {
            window.parseGewerbeakteTextOriginal = window.parseGewerbeakteText;
            window.parseGewerbeakteText = (text) => this.parseGewerbeakteFlexible(text);
        }
        
        if (typeof window.parsePersonenprüfungsakteText === 'function') {
            window.parsePersonenprüfungsakteTextOriginal = window.parsePersonenprüfungsakteText;
            window.parsePersonenprüfungsakteText = (text) => this.parsePersonenprüfungFlexible(text);
        }
        
        if (typeof window.parseAntragText === 'function') {
            window.parseAntragTextOriginal = window.parseAntragText;
            window.parseAntragText = (text) => this.parseAntragFlexible(text);
        }
        
        // Override fillAntragForm to ensure compatibility
        if (typeof window.fillAntragForm === 'function') {
            window.fillAntragFormOriginal = window.fillAntragForm;
            window.fillAntragForm = (data) => this.fillAntragFormEnhanced(data);
        }
        
        console.log(`🔧 Flexible parsing v${this.version} integrated`);
    }

    // Initialize Drag & Drop für alle Import-Bereiche
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

    // Mache Element zu Drag & Drop Zone
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

    // Drop-Event Handler
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

    // Verarbeite gedropten Text
    processDroppedText(text) {
        console.log(`🔄 v${this.version}: Processing dropped text:`, text.substring(0, 200) + '...');
        
        const importTextarea = document.getElementById('import-text');
        if (importTextarea) {
            importTextarea.value = text;
            importTextarea.dispatchEvent(new Event('input'));
            
            setTimeout(() => {
                this.autoImport();
            }, 500);
        }
    }

    // Verarbeite gedropte Dateien
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

    // Auto-Import basierend auf aktuellem Seitentyp
    autoImport() {
        const currentPage = this.detectCurrentPage();
        this.showAutoImportConfirmation(currentPage);
    }

    detectCurrentPage() {
        const pathname = window.location.pathname;
        if (pathname.includes('gewerbeakte')) return 'gewerbeakte';
        if (pathname.includes('personenpruefung')) return 'personenpruefung';
        if (pathname.includes('antrag')) return 'antrag';
        return 'unknown';
    }

    showAutoImportConfirmation(pageType) {
        const pageNames = {
            'gewerbeakte': 'Gewerbeakte',
            'personenpruefung': 'Personenprüfungsakte',
            'antrag': 'Antrag'
        };

        const pageName = pageNames[pageType] || 'Dokument';
        const confirmation = this.createConfirmationDialog(
            '📥 Import bereit',
            `Möchten Sie die ${pageName} automatisch importieren?`,
            () => this.executeAutoImport(pageType),
            () => console.log('Auto-Import cancelled')
        );

        document.body.appendChild(confirmation);
        setTimeout(() => {
            if (confirmation.parentNode) {
                confirmation.remove();
            }
        }, 10000);
    }

    // VERBESSERTE AUTO-IMPORT FUNKTION
    executeAutoImport(pageType) {
        console.log(`🚀 v${this.version}: Executing auto-import for page type:`, pageType);
        
        const importText = document.getElementById('import-text').value;
        console.log(`📝 Import text:`, importText);
        
        switch (pageType) {
            case 'gewerbeakte':
                if (typeof importAkte === 'function') {
                    console.log('🔧 Calling importAkte...');
                    importAkte();
                    this.postImportCleanup();
                } else {
                    console.error('❌ importAkte function not found');
                }
                break;
            case 'personenpruefung':
                if (typeof importAkte === 'function') {
                    console.log('🔧 Calling importAkte (Personenprüfung)...');
                    importAkte();
                    this.postImportCleanup();
                } else {
                    console.error('❌ importAkte function not found');
                }
                break;
            case 'antrag':
                if (typeof importAntrag === 'function') {
                    console.log('🔧 Calling importAntrag...');
                    const testParse = this.parseAntragFlexible(importText);
                    console.log(`🔍 v${this.version}: Pre-import parse test:`, JSON.stringify(testParse, null, 2));
                    
                    if (testParse && testParse.type) {
                        importAntrag();
                        this.postImportCleanup();
                    } else {
                        console.error('❌ Parse test failed, not importing');
                        this.showParseErrorToast();
                    }
                } else {
                    console.error('❌ importAntrag function not found');
                }
                break;
            default:
                console.log('❌ Unknown page type for auto-import:', pageType);
        }
    }

    // KOMPLETT NEUE ANTRAG-PARSER LOGIK
    parseAntragFlexible(text) {
        if (window.parseAntragTextOriginal) {
            const originalResult = window.parseAntragTextOriginal(text);
            console.log(`📊 v${this.version}: Original parser returned:`, JSON.stringify(originalResult, null, 2));
            
            const originalDataCount = originalResult ? Object.keys(originalResult).filter(key => key !== 'type' && originalResult[key]).length : 0;
            console.log(`📊 Original parser data count:`, originalDataCount);
            
            if (originalResult && originalResult.type && originalDataCount >= 2) {
                console.log('✅ Using original parser result (has enough data)');
                return originalResult;
            } else {
                console.log('⚠️ Original parser has insufficient data, trying flexible parser');
            }
        }
        
        const flexibleResult = this.parseAntragTextFlexible(text);
        console.log(`📊 v${this.version}: Flexible parser returned:`, JSON.stringify(flexibleResult, null, 2));
        
        return flexibleResult;
    }

    // KERN-FUNKTION: Flexible Antrag Parser
    parseAntragTextFlexible(text) {
        const data = {};
        
        try {
            console.log(`🔄 v${this.version}: Starting flexible Antrag parsing...`);
            console.log(`📄 Full text:`, text);
            
            // Detect type
            if (text.includes('Gewerbekonzept')) {
                data.type = 'gewerbeantrag';
            } else if (text.includes('Kutschen Größe') || text.includes('Genehmigungs-Nummer')) {
                data.type = 'gewerbekutsche';
            } else if (text.includes('Gewünschte Gewerbetelegrammnummer')) {
                data.type = 'gewerbetelegramm';
            } else if (text.includes('Für Gewerbe') && !text.includes('Gewerbekonzept')) {
                data.type = 'gewerbeauslage';
            } else {
                console.log('❌ Could not detect Antrag type');
                return null;
            }
            
            console.log(`✅ v${this.version}: Detected Antrag type:`, data.type);
            
            // KRITISCHER FIX: Einfache direkte Extraktion für Gewerbekutsche
            if (data.type === 'gewerbekutsche') {
                console.log(`🎯 v${this.version}: GEWERBEKUTSCHE - Using direct extraction method`);
                
                // Parse mit direkter Zeilen-Extraktion - KORREKTE FELDNAMEN
                data.nummer = this.extractFieldSimple(text, 'Genehmigungs-Nummer');
                data.aussteller = this.extractFieldSimple(text, 'Ausstellende Person');
                data.telegram = this.extractFieldSimple(text, 'Telegrammnummer (Für Rückfragen)'); // VOLLSTÄNDIGER NAME!
                data.person = this.extractFieldSimple(text, 'Antragstellende Person');
                data.groesse = this.extractFieldSimple(text, 'Kutschen Größe');
                
                // SPEZIAL für Gewerbe: Mehrere Versuche
                data.gewerbe = this.extractGewerbeField(text);
                
                console.log(`🎯 v${this.version}: GEWERBEKUTSCHE final data:`, JSON.stringify(data, null, 2));
            } else {
                // Normale Feldmappings für andere Typen
                const fieldMappings = this.getFieldMappings(data.type);
                for (const [key, fieldName] of Object.entries(fieldMappings)) {
                    const value = this.extractFieldSimple(text, fieldName);
                    if (value) {
                        data[key] = value;
                    }
                }
                
                // SPEZIAL-BEHANDLUNG für Gewerbetelegramm Checkboxen
                if (data.type === 'gewerbetelegramm' && data.bezahlt) {
                    console.log(`🎯 v${this.version}: Processing payment status for Gewerbetelegramm:`, data.bezahlt);
                    data.bezahltStatus = data.bezahlt.toLowerCase().includes('ja');
                    data.ausstehendeStatus = data.bezahlt.toLowerCase().includes('ausstehend') || data.bezahlt.toLowerCase().includes('nein');
                    console.log(`✅ v${this.version}: Payment status - bezahlt: ${data.bezahltStatus}, ausstehend: ${data.ausstehendeStatus}`);
                }
            }
            
            const filledFields = Object.keys(data).filter(key => key !== 'type' && data[key]).length;
            console.log(`📊 v${this.version}: Filled fields count:`, filledFields);
            
            if (filledFields < 1) {
                console.log('❌ Not enough fields parsed, returning null');
                return null;
            }
            
            return data;
            
        } catch (error) {
            console.error(`❌ v${this.version}: Flexible Antrag parse error:`, error);
            return null;
        }
    }

    // NEUE EINFACHE FIELD-EXTRAKTION
    extractFieldSimple(text, fieldName) {
        console.log(`🔍 v${this.version}: Extracting field "${fieldName}"`);
        
        // Method 1: Line-by-line search
        const lines = text.split('\n');
        console.log(`📝 All lines:`, lines);
        
        const fieldLineIndex = lines.findIndex(line => {
            const cleanLine = line.trim().toLowerCase();
            const cleanField = fieldName.toLowerCase();
            return cleanLine === cleanField + ':' || cleanLine.startsWith(cleanField + ':');
        });
        
        console.log(`🔍 Field "${fieldName}" found at line index:`, fieldLineIndex);
        
        if (fieldLineIndex !== -1) {
            // Check if value is on same line
            const currentLine = lines[fieldLineIndex].trim();
            const colonIndex = currentLine.indexOf(':');
            if (colonIndex !== -1 && currentLine.length > colonIndex + 1) {
                const sameLineValue = currentLine.substring(colonIndex + 1).trim();
                if (sameLineValue && sameLineValue !== '---') {
                    console.log(`✅ v${this.version}: Same line value for "${fieldName}":`, sameLineValue);
                    return sameLineValue;
                }
            }
            
            // Check next line
            if (lines[fieldLineIndex + 1]) {
                const nextLineValue = lines[fieldLineIndex + 1].trim();
                if (nextLineValue && nextLineValue !== '---') {
                    console.log(`✅ v${this.version}: Next line value for "${fieldName}":`, nextLineValue);
                    return nextLineValue;
                }
            }
        }
        
        // Method 2: Regex fallback
        const regex = new RegExp(`${fieldName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}:\\s*([^\\n]+)`, 'i');
        const match = text.match(regex);
        if (match && match[1] && match[1].trim() !== '---') {
            console.log(`✅ v${this.version}: Regex value for "${fieldName}":`, match[1].trim());
            return match[1].trim();
        }
        
        console.log(`❌ v${this.version}: No value found for "${fieldName}"`);
        return null;
    }

    // SPEZIAL-FUNKTION für Gewerbe-Feld
    extractGewerbeField(text) {
        console.log(`🎯 v${this.version}: SPECIAL GEWERBE EXTRACTION`);
        console.log(`📄 Text for Gewerbe extraction:`, text);
        
        // Method 1: Direct line search for "Gewerbe:"
        const lines = text.split('\n');
        console.log(`📝 Lines for Gewerbe search:`, lines);
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim().toLowerCase();
            console.log(`🔍 Checking line ${i}: "${lines[i]}"`);
            
            if (line === 'gewerbe:') {
                if (lines[i + 1]) {
                    const gewerbeValue = lines[i + 1].trim();
                    console.log(`✅ v${this.version}: GEWERBE found via line search:`, gewerbeValue);
                    return gewerbeValue;
                }
            }
        }
        
        // Method 2: Regex patterns
        const patterns = [
            /gewerbe:\s*\n\s*([^\n]+)/i,
            /gewerbe:\s*([^\n]+)/i,
            /gewerbe[:\s]+([^\n]+)/i
        ];
        
        for (const pattern of patterns) {
            const match = text.match(pattern);
            if (match && match[1] && match[1].trim() !== '---') {
                console.log(`✅ v${this.version}: GEWERBE found via regex:`, match[1].trim());
                return match[1].trim();
            }
        }
        
        console.log(`❌ v${this.version}: GEWERBE not found with any method`);
        return null;
    }

    getFieldMappings(type) {
        const mappings = {
            'gewerbeantrag': {
                person: 'Antragstellende Person',
                gewerbe: 'Für Gewerbe',
                telegram: 'Telegrammnummer (Für Rückfragen)',
                konzept: 'Gewerbekonzept'
            },
            'gewerbeauslage': {
                person: 'Antragstellende Person',
                gewerbe: 'Für Gewerbe',
                telegram: 'Telegrammnummer (Für Rückfragen)'
            },
            'gewerbetelegramm': {
                person: 'Antragstellende Person',
                gewerbe: 'Für Gewerbe',
                telegram: 'Telegrammnummer (Für Rückfragen)',
                wunsch: 'Gewünschte Gewerbetelegrammnummer',
                bezahlt: 'Bearbeitungsgebühr (100$) bezahlt?' // FEHLTE!
            }
        };
        return mappings[type] || {};
    }

    // Enhanced fillAntragForm with better debugging
    fillAntragFormEnhanced(data) {
        console.log(`🎯 v${this.version}: Enhanced fillAntragForm called with data:`, JSON.stringify(data, null, 2));
        
        if (!data || !data.type) {
            console.error('❌ No data or type provided to fillAntragForm');
            return;
        }
        
        try {
            if (window.fillAntragFormOriginal) {
                console.log('🔧 Calling original fillAntragForm...');
                window.fillAntragFormOriginal(data);
                
                setTimeout(() => {
                    this.verifyFormFilling(data);
                }, 500);
            } else {
                console.log('🔧 Using fallback form filling...');
                this.fillAntragFormDirect(data);
            }
        } catch (error) {
            console.error('❌ Error in fillAntragForm, using direct fallback:', error);
            this.fillAntragFormDirect(data);
        }
    }

    // Direct form filling as fallback
    fillAntragFormDirect(data) {
        console.log(`🎯 v${this.version}: Direct form filling for type:`, data.type);
        
        const antragTypeSelect = document.getElementById('antrag-type');
        if (antragTypeSelect) {
            antragTypeSelect.value = data.type;
            antragTypeSelect.dispatchEvent(new Event('change'));
            
            if (typeof switchAntragType === 'function') {
                switchAntragType();
            }
        }
        
        setTimeout(() => {
            this.fillFieldsByType(data);
        }, 300);
    }

    fillFieldsByType(data) {
        console.log(`📝 v${this.version}: Filling fields for type:`, data.type, 'with data:', JSON.stringify(data, null, 2));
        
        switch (data.type) {
            case 'gewerbeantrag':
                this.fillField('gewerbeantrag-person', data.person);
                this.fillField('gewerbeantrag-gewerbe', data.gewerbe);
                this.fillField('gewerbeantrag-telegram', data.telegram);
                this.fillField('gewerbeantrag-konzept', data.konzept);
                break;

            case 'gewerbeauslage':
                this.fillField('gewerbeauslage-person', data.person);
                this.fillField('gewerbeauslage-telegram', data.telegram);
                this.fillField('gewerbeauslage-gewerbe', data.gewerbe);
                break;

            case 'gewerbekutsche':
                this.fillField('gewerbekutsche-nummer', data.nummer);
                this.fillField('gewerbekutsche-aussteller', data.aussteller);
                this.fillField('gewerbekutsche-aussteller-telegram', data.telegram);
                this.fillField('gewerbekutsche-person', data.person);
                this.fillField('gewerbekutsche-gewerbe', data.gewerbe); // KRITISCH!
                this.fillField('gewerbekutsche-groesse', data.groesse);
                break;

            case 'gewerbetelegramm':
                this.fillField('gewerbetelegramm-person', data.person);
                this.fillField('gewerbetelegramm-gewerbe', data.gewerbe);
                this.fillField('gewerbetelegramm-telegram', data.telegram);
                this.fillField('gewerbetelegramm-wunsch', data.wunsch);

                // Handle payment checkboxes
                console.log(`🎯 v${this.version}: Setting checkboxes - bezahltStatus: ${data.bezahltStatus}, ausstehendeStatus: ${data.ausstehendeStatus}`);
                if (data.bezahltStatus) {
                    this.setCheckbox('gewerbetelegramm-bezahlt', true);
                    this.setCheckbox('gewerbetelegramm-ausstehend', false);
                } else if (data.ausstehendeStatus) {
                    this.setCheckbox('gewerbetelegramm-ausstehend', true);
                    this.setCheckbox('gewerbetelegramm-bezahlt', false);
                }
                break;
        }
        
        console.log(`✅ v${this.version}: Field filling completed`);
    }

    fillField(fieldId, value) {
        if (!value) {
            console.log(`⚠️ v${this.version}: No value provided for ${fieldId}`);
            return;
        }
        
        const field = document.getElementById(fieldId);
        if (field) {
            field.value = value;
            console.log(`✅ v${this.version}: Filled ${fieldId}:`, value);
        } else {
            console.log(`⚠️ v${this.version}: Field ${fieldId} not found in DOM`);
        }
    }

    verifyFormFilling(data) {
        console.log(`🔍 v${this.version}: Verifying form filling...`);
        
        let anyFieldFilled = false;
        
        switch (data.type) {
            case 'gewerbeauslage':
                anyFieldFilled = this.checkField('gewerbeauslage-person') || 
                                 this.checkField('gewerbeauslage-gewerbe') || 
                                 this.checkField('gewerbeauslage-telegram');
                break;
            case 'gewerbekutsche':
                anyFieldFilled = this.checkField('gewerbekutsche-person') || 
                                 this.checkField('gewerbekutsche-gewerbe') || 
                                 this.checkField('gewerbekutsche-nummer');
                break;
        }
        
        if (!anyFieldFilled) {
            console.log('⚠️ Form appears empty, trying direct filling...');
            this.fillAntragFormDirect(data);
        } else {
            console.log('✅ Form appears to be filled correctly');
        }
    }

    setCheckbox(checkboxId, checked) {
        const checkbox = document.getElementById(checkboxId);
        if (checkbox) {
            checkbox.checked = checked;
            console.log(`✅ v${this.version}: Set checkbox ${checkboxId}:`, checked);
        } else {
            console.log(`⚠️ v${this.version}: Checkbox ${checkboxId} not found in DOM`);
        }
    }

    checkField(fieldId) {
        const field = document.getElementById(fieldId);
        const hasValue = field && field.value && field.value.trim() !== '';
        console.log(`🔍 v${this.version}: Field ${fieldId}: ${hasValue ? 'filled' : 'empty'} (value: "${field?.value || 'none'}")`);
        return hasValue;
    }

    // Cleanup nach erfolgreichem Import
    postImportCleanup() {
        setTimeout(() => {
            this.closeImportSection();
            this.disableImportButton();
            this.showImportSuccessToast();
            console.log(`🧹 v${this.version}: Post-import cleanup completed`);
        }, 1500);
    }

    closeImportSection() {
        const importContent = document.getElementById('import-content');
        if (importContent && importContent.classList.contains('expanded')) {
            if (typeof toggleImport === 'function') {
                toggleImport();
            } else {
                importContent.classList.remove('expanded');
                const importToggle = document.getElementById('import-toggle');
                const importHeader = document.querySelector('.import-header');
                if (importToggle) importToggle.classList.remove('expanded');
                if (importHeader) importHeader.classList.remove('expanded');
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
            importButton.style.opacity = '0.8';
            
            setTimeout(() => {
                importButton.innerHTML = '<i class="fa-solid fa-circle-info"></i> Akte eingeben zum Importieren';
                importButton.style.background = '';
                importButton.style.opacity = '';
            }, 3000);
        }
    }

    showImportSuccessToast() {
        const toast = this.createToast(
            'success',
            '✅ Import erfolgreich',
            'Die Akte wurde importiert und das Formular ausgefüllt.'
        );
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            if (toast.parentNode) {
                toast.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => toast.remove(), 300);
            }
        }, 4000);
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

    showParseErrorToast() {
        const toast = this.createToast(
            'error',
            '⚠️ Import fehlgeschlagen',
            'Der Text konnte nicht geparst werden. Bitte prüfen Sie das Format.'
        );
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            if (toast.parentNode) {
                toast.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => toast.remove(), 300);
            }
        }, 5000);
    }

    showDropError(message) {
        if (typeof showImportErrorPopup === 'function') {
            const originalMessage = document.getElementById('popup-message');
            if (originalMessage) {
                const temp = originalMessage.innerHTML;
                originalMessage.innerHTML = `
                    <span style="color: #FF8232;">${message}</span><br>
                    Bitte versuchen Sie es erneut oder verwenden Sie das manuelle Import-Feld.
                `;
                
                document.getElementById('popup-overlay')?.classList.add('active');
                
                setTimeout(() => {
                    originalMessage.innerHTML = temp;
                }, 3000);
            }
        } else {
            alert(`⚠️ ${message}`);
        }
    }

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

    setupEventListeners() {
        window.addEventListener('dragover', this.preventDefaults, false);
        window.addEventListener('drop', this.preventDefaults, false);
    }

    enhanceImportSections() {
        const importSections = document.querySelectorAll('.import-section');
        
        importSections.forEach(section => {
            const importTitle = section.querySelector('.import-title');
            if (importTitle && !importTitle.querySelector('.drag-drop-hint')) {
                let textContainer = importTitle.querySelector('.import-title-text');
                if (!textContainer) {
                    const textSpan = Array.from(importTitle.childNodes).find(node => 
                        node.nodeType === Node.TEXT_NODE || 
                        (node.nodeType === Node.ELEMENT_NODE && !node.classList.contains('fa-solid'))
                    );
                    
                    if (textSpan) {
                        textContainer = document.createElement('div');
                        textContainer.className = 'import-title-text';
                        textContainer.appendChild(textSpan);
                        importTitle.appendChild(textContainer);
                    }
                }
                
                if (textContainer) {
                    const hint = document.createElement('div');
                    hint.className = 'drag-drop-hint';
                    hint.innerHTML = '<i class="fa-solid fa-upload"></i>Oder Datei hierher ziehen';
                    textContainer.appendChild(hint);
                }
            }
        });
    }

    // Placeholder functions for other parsers
    parseGewerbeakteFlexible(text) {
        if (window.parseGewerbeakteTextOriginal) {
            return window.parseGewerbeakteTextOriginal(text);
        }
        return null;
    }

    parsePersonenprüfungFlexible(text) {
        if (window.parsePersonenprüfungsakteTextOriginal) {
            return window.parsePersonenprüfungsakteTextOriginal(text);
        }
        return null;
    }
}

// CSS Styles für Drag & Drop (dynamisch hinzufügen)
function addDragDropStyles() {
    if (document.getElementById('drag-drop-styles')) return;
    
    const styles = document.createElement('style');
    styles.id = 'drag-drop-styles';
    styles.textContent = `
        .drag-over {
            background: rgba(244, 192, 102, 0.1) !important;
            border: 2px dashed #F4C066 !important;
            transform: scale(1.02);
            transition: all 0.3s ease;
        }

        .drag-drop-hint {
            color: #D8C5B0 !important;
            font-size: 0.75rem !important;
            font-style: normal !important;
            opacity: 0.7 !important;
            transition: opacity 0.3s ease !important;
            margin-top: 0 !important;
            margin-bottom: 0 !important;
            line-height: 1.2 !important;
            display: block !important;
            text-align: left !important;
            margin-left: 0 !important;
            padding: 0 !important;
        }

        .drag-drop-hint i {
            font-size: 0.8rem !important;
            color: #F4C066 !important;
            margin-right: 0.3rem !important;
        }

        .import-section .import-title {
            display: flex !important;
            flex-direction: row !important;
            align-items: flex-start !important;
            gap: 0.5rem !important;
            flex: 1 !important;
        }

        .import-section .import-title-text {
            display: flex !important;
            flex-direction: column !important;
            align-items: flex-start !important;
            line-height: 1.1 !important;
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
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }

        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
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

// Initialize Drag & Drop System
function initializeDragDropImport() {
    addDragDropStyles();
    const importer = new DragDropImporter();
    importer.enhanceImportSections();
    console.log('🎯 Drag & Drop Import System v3.0 CACHE-BUSTED - Multi-word Gewerbe support');
    return importer;
}

// Auto-Initialize wenn DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeDragDropImport);
} else {
    initializeDragDropImport();
}

// Export für externe Nutzung
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DragDropImporter, initializeDragDropImport };
}