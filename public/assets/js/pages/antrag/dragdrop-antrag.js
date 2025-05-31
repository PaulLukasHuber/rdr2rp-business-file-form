// ===================================
// DRAG & DROP ANTRAG HANDLER v5.0
// Spezialisiert für alle Antragstypen
// ===================================

class DragDropAntrag {
    constructor() {
        this.version = "5.0";
        console.log(`📄 DragDropAntrag v${this.version} initialized`);
    }

    // ===== MAIN IMPORT HANDLER =====
    handleImport(text) {
        console.log(`🔄 v${this.version}: Handling Antrag import...`);
        
        try {
            // Parse the text
            const parsedData = this.parseAntrag(text);
            console.log(`📊 Parsed data:`, JSON.stringify(parsedData, null, 2));

            if (parsedData && parsedData.type && this.validateData(parsedData)) {
                // Fill the form
                this.fillForm(parsedData);
                
                // Clear import field and show success
                this.clearImportField();
                this.showSuccessMessage();
                
                console.log(`✅ v${this.version}: Antrag import completed successfully`);
                return true;
            } else {
                console.log(`❌ v${this.version}: Validation failed`);
                this.showErrorMessage();
                return false;
            }
        } catch (error) {
            console.error(`❌ v${this.version}: Import error:`, error);
            this.showErrorMessage();
            return false;
        }
    }

    // ===== PARSING LOGIC =====
    parseAntrag(text) {
        console.log(`🔄 v${this.version}: Parsing Antrag...`);
        
        const data = {};
        
        try {
            // Detect antrag type
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
            
            // Extract fields based on type
            if (data.type === 'gewerbekutsche') {
                console.log(`🎯 v${this.version}: GEWERBEKUTSCHE - Using specialized extraction`);
                
                data.nummer = DragDropUtils.extractSimpleField(text, 'Genehmigungs-Nummer');
                data.aussteller = DragDropUtils.extractSimpleField(text, 'Ausstellende Person');
                data.telegram = DragDropUtils.extractSimpleField(text, 'Telegrammnummer (Für Rückfragen)');
                data.person = DragDropUtils.extractSimpleField(text, 'Antragstellende Person');
                data.groesse = DragDropUtils.extractSimpleField(text, 'Kutschen Größe');
                data.gewerbe = this.extractGewerbeField(text);
                
                console.log(`🎯 v${this.version}: GEWERBEKUTSCHE final data:`, JSON.stringify(data, null, 2));
            } else {
                // Use standard field mappings for other types
                const fieldMappings = this.getFieldMappings(data.type);
                for (const [key, fieldName] of Object.entries(fieldMappings)) {
                    const value = DragDropUtils.extractSimpleField(text, fieldName);
                    if (value) {
                        data[key] = value;
                    }
                }
                
                // Special handling for Gewerbetelegramm payment status
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
            console.error(`❌ v${this.version}: Antrag parse error:`, error);
            return null;
        }
    }

    // ===== SPECIAL GEWERBE EXTRACTION =====
    extractGewerbeField(text) {
        console.log(`🎯 v${this.version}: Special Gewerbe extraction for Gewerbekutsche`);
        
        const lines = text.split('\n');
        
        // Search for "Gewerbe:" line
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim().toLowerCase();
            
            if (line === 'gewerbe:') {
                if (lines[i + 1]) {
                    const gewerbeValue = lines[i + 1].trim();
                    console.log(`✅ v${this.version}: GEWERBE found via line search:`, gewerbeValue);
                    return gewerbeValue;
                }
            }
        }
        
        // Fallback: regex patterns
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

    // ===== FIELD MAPPINGS =====
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
                bezahlt: 'Bearbeitungsgebühr (100$) bezahlt?'
            }
        };
        return mappings[type] || {};
    }

    // ===== VALIDATION =====
    validateData(data) {
        if (!data || typeof data !== 'object' || !data.type) {
            return false;
        }

        const fieldCount = Object.keys(data).filter(key => key !== 'type' && data[key]).length;
        console.log(`📊 v${this.version}: Antrag validation - field count: ${fieldCount}, type: ${data.type}`);
        return fieldCount >= 1;
    }

    // ===== FORM FILLING =====
    fillForm(data) {
        console.log(`🎯 v${this.version}: Filling Antrag form with data:`, JSON.stringify(data, null, 2));
        
        try {
            // Set antrag type first
            const antragTypeSelect = document.getElementById('antrag-type');
            if (antragTypeSelect) {
                antragTypeSelect.value = data.type;
                antragTypeSelect.dispatchEvent(new Event('change'));
                
                // Trigger form switch if function exists
                if (typeof switchAntragType === 'function') {
                    switchAntragType();
                }
            }
            
            // Wait for form to load, then fill fields
            setTimeout(() => {
                this.fillFieldsByType(data);
            }, 300);

            console.log(`✅ v${this.version}: Antrag form filling completed`);
            
        } catch (error) {
            console.error(`❌ v${this.version}: Error in form filling:`, error);
        }
    }

    // ===== TYPE-SPECIFIC FIELD FILLING =====
    fillFieldsByType(data) {
        console.log(`📝 v${this.version}: Filling fields for type:`, data.type, 'with data:', JSON.stringify(data, null, 2));
        
        switch (data.type) {
            case 'gewerbeantrag':
                DragDropUtils.fillField('gewerbeantrag-person', data.person);
                DragDropUtils.fillField('gewerbeantrag-gewerbe', data.gewerbe);
                DragDropUtils.fillField('gewerbeantrag-telegram', data.telegram);
                DragDropUtils.fillField('gewerbeantrag-konzept', data.konzept);
                break;

            case 'gewerbeauslage':
                DragDropUtils.fillField('gewerbeauslage-person', data.person);
                DragDropUtils.fillField('gewerbeauslage-telegram', data.telegram);
                DragDropUtils.fillField('gewerbeauslage-gewerbe', data.gewerbe);
                break;

            case 'gewerbekutsche':
                DragDropUtils.fillField('gewerbekutsche-nummer', data.nummer);
                DragDropUtils.fillField('gewerbekutsche-aussteller', data.aussteller);
                DragDropUtils.fillField('gewerbekutsche-aussteller-telegram', data.telegram);
                DragDropUtils.fillField('gewerbekutsche-person', data.person);
                DragDropUtils.fillField('gewerbekutsche-gewerbe', data.gewerbe);
                DragDropUtils.fillField('gewerbekutsche-groesse', data.groesse);
                break;

            case 'gewerbetelegramm':
                DragDropUtils.fillField('gewerbetelegramm-person', data.person);
                DragDropUtils.fillField('gewerbetelegramm-gewerbe', data.gewerbe);
                DragDropUtils.fillField('gewerbetelegramm-telegram', data.telegram);
                DragDropUtils.fillField('gewerbetelegramm-wunsch', data.wunsch);

                // Handle payment checkboxes
                if (data.bezahltStatus) {
                    this.setCheckbox('gewerbetelegramm-bezahlt', true);
                    this.setCheckbox('gewerbetelegramm-ausstehend', false);
                } else if (data.ausstehendeStatus) {
                    this.setCheckbox('gewerbetelegramm-ausstehend', true);
                    this.setCheckbox('gewerbetelegramm-bezahlt', false);
                }
                break;
        }
        
        console.log(`✅ v${this.version}: Field filling by type completed`);
    }

    // ===== CHECKBOX HANDLING =====
    setCheckbox(checkboxId, checked) {
        const checkbox = document.getElementById(checkboxId);
        if (checkbox) {
            checkbox.checked = checked;
            console.log(`✅ v${this.version}: Set checkbox ${checkboxId}:`, checked);
        } else {
            console.log(`⚠️ v${this.version}: Checkbox ${checkboxId} not found in DOM`);
        }
    }

    // ===== UI HELPERS =====
    clearImportField() {
        const importTextarea = document.getElementById('import-text');
        if (importTextarea) {
            importTextarea.value = '';
            // Trigger checkImportText to update button state
            if (typeof checkImportText === 'function') {
                checkImportText();
            }
        }
    }

    showSuccessMessage() {
        if (typeof showAntragImportSuccessPopup === 'function') {
            showAntragImportSuccessPopup();
        } else {
            console.log('✅ Antrag erfolgreich importiert!');
        }
    }

    showErrorMessage() {
        if (typeof showAntragImportErrorPopup === 'function') {
            showAntragImportErrorPopup();
        } else {
            console.error('❌ Import fehlgeschlagen!');
        }
    }
}

// ===== INTEGRATION WITH EXISTING SYSTEM =====
if (typeof window !== 'undefined') {
    // Store original functions as backup
    if (typeof window.parseAntragText === 'function') {
        window.parseAntragTextOriginal = window.parseAntragText;
    }
    if (typeof window.fillAntragForm === 'function') {
        window.fillAntragFormOriginal = window.fillAntragForm;
    }

    // Create new handler instance
    window.DragDropAntrag = DragDropAntrag;
    
    // Override global functions
    window.parseAntragText = function(text) {
        console.log('🔧 Global parseAntragText called via DragDropAntrag');
        const handler = new DragDropAntrag();
        return handler.parseAntrag(text);
    };
    
    window.fillAntragForm = function(data) {
        console.log('🔧 Global fillAntragForm called via DragDropAntrag');
        const handler = new DragDropAntrag();
        return handler.fillForm(data);
    };
    
    console.log('🎯 DragDropAntrag v5.0 ready - All Antrag types supported');
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DragDropAntrag };
}