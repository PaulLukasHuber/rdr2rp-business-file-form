// ===================================
// DRAG & DROP ANTRAG HANDLER v5.1 - BACKWARD COMPATIBLE
// Unterstützt sowohl "Gewerbe:" als auch "Für Gewerbe:"
// ===================================

class DragDropAntrag {
    constructor() {
        this.version = "5.1-backward-compatible";
        console.log(`📄 DragDropAntrag v${this.version} initialized - Backward Compatible`);
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

    // ===== PARSING LOGIC WITH BACKWARD COMPATIBILITY =====
    parseAntrag(text) {
        console.log(`🔄 v${this.version}: Parsing Antrag with backward compatibility...`);
        
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
            
            // SPEZIELLE BEHANDLUNG FÜR GEWERBEKUTSCHE (BACKWARD COMPATIBLE)
            if (data.type === 'gewerbekutsche') {
                console.log(`🎯 v${this.version}: GEWERBEKUTSCHE - Using backward compatible extraction`);
                
                data.nummer = DragDropUtils.extractSimpleField(text, 'Genehmigungs-Nummer');
                data.aussteller = DragDropUtils.extractSimpleField(text, 'Ausstellende Person');
                data.telegram = DragDropUtils.extractSimpleField(text, 'Telegrammnummer (Für Rückfragen)');
                data.person = DragDropUtils.extractSimpleField(text, 'Antragstellende Person');
                data.groesse = DragDropUtils.extractSimpleField(text, 'Kutschen Größe');
                
                // BACKWARD COMPATIBLE GEWERBE EXTRACTION
                data.gewerbe = this.extractGewerbeBackwardCompatible(text);
                
                console.log(`🎯 v${this.version}: GEWERBEKUTSCHE final data:`, JSON.stringify(data, null, 2));
            } else {
                // Standard extraction für andere Typen
                const fieldMappings = this.getFieldMappings(data.type);
                for (const [key, fieldName] of Object.entries(fieldMappings)) {
                    const value = DragDropUtils.extractSimpleField(text, fieldName);
                    if (value) {
                        data[key] = value;
                    }
                }
                
                // Special handling für Gewerbetelegramm payment status
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

    // ===== BACKWARD COMPATIBLE GEWERBE EXTRACTION =====
    extractGewerbeBackwardCompatible(text) {
        console.log(`🎯 v${this.version}: Backward compatible gewerbe extraction`);
        
        // Erst neues Format versuchen: "Für Gewerbe:"
        console.log(`🔍 Trying NEW format "Für Gewerbe:"...`);
        let result = DragDropUtils.extractSimpleField(text, 'Für Gewerbe');
        if (result) {
            console.log(`✅ Found with NEW format "Für Gewerbe:": "${result}"`);
            return result;
        }
        
        // Dann altes Format versuchen: "Gewerbe:"
        console.log(`🔍 Trying OLD format "Gewerbe:"...`);
        result = DragDropUtils.extractSimpleField(text, 'Gewerbe');
        if (result) {
            console.log(`✅ Found with OLD format "Gewerbe:": "${result}"`);
            return result;
        }
        
        // Manuelle Zeilen-Suche als Fallback
        console.log(`🔍 Trying manual line search for both formats...`);
        const lines = text.split('\n');
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            const lowerLine = line.toLowerCase();
            
            // Suche nach beiden Formaten
            if (lowerLine === 'für gewerbe:' || lowerLine === 'gewerbe:') {
                console.log(`📍 Found gewerbe field at line ${i}: "${line}"`);
                
                // Suche in den nächsten Zeilen nach dem Wert
                for (let j = i + 1; j < Math.min(i + 5, lines.length); j++) {
                    const nextLine = lines[j].trim();
                    
                    if (nextLine && 
                        nextLine !== '---' && 
                        nextLine !== '```' &&
                        !nextLine.toLowerCase().includes(':') &&
                        nextLine.length > 1) {
                        console.log(`✅ Found gewerbe value at line ${j}: "${nextLine}"`);
                        return nextLine;
                    }
                }
            }
        }
        
        console.log(`❌ v${this.version}: Gewerbe not found in any format`);
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
                console.log(`🎯 v${this.version}: Filling GEWERBEKUTSCHE fields (backward compatible)...`);
                DragDropUtils.fillField('gewerbekutsche-nummer', data.nummer);
                DragDropUtils.fillField('gewerbekutsche-aussteller', data.aussteller);
                DragDropUtils.fillField('gewerbekutsche-aussteller-telegram', data.telegram);
                DragDropUtils.fillField('gewerbekutsche-person', data.person);
                DragDropUtils.fillField('gewerbekutsche-gewerbe', data.gewerbe);
                DragDropUtils.fillField('gewerbekutsche-groesse', data.groesse);
                
                if (data.gewerbe) {
                    console.log(`✅ v${this.version}: GEWERBEKUTSCHE gewerbe field filled (backward compatible): "${data.gewerbe}"`);
                }
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

    // ===== TEST FUNCTIONS =====
    testBackwardCompatibility() {
        console.log(`🧪 v${this.version}: Testing backward compatibility...`);
        
        // Test old format
        const oldText = `Genehmigungs-Nummer:
\`\`\`
GK-20250601-123
\`\`\`
Ausstellende Person:
\`\`\`
Max Mustermann
\`\`\`
Telegrammnummer (Für Rückfragen):
\`\`\`
@maxmustermann
\`\`\`
Antragstellende Person:
\`\`\`
John Doe
\`\`\`
Gewerbe:
\`\`\`
Muster-Gewerbe-Alt
\`\`\`
Kutschen Größe:
\`\`\`
Klein (1500kg)
\`\`\``;

        // Test new format
        const newText = `Genehmigungs-Nummer:
\`\`\`
GK-20250601-456
\`\`\`
Ausstellende Person:
\`\`\`
Max Mustermann
\`\`\`
Telegrammnummer (Für Rückfragen):
\`\`\`
@maxmustermann
\`\`\`
Antragstellende Person:
\`\`\`
John Doe
\`\`\`
Für Gewerbe:
\`\`\`
Muster-Gewerbe-Neu
\`\`\`
Kutschen Größe:
\`\`\`
Klein (1500kg)
\`\`\``;

        console.log(`📊 Testing OLD format...`);
        const oldResult = this.parseAntrag(oldText);
        console.log(`Old format result:`, oldResult);

        console.log(`📊 Testing NEW format...`);
        const newResult = this.parseAntrag(newText);
        console.log(`New format result:`, newResult);

        console.log(`🎯 Summary:`);
        console.log(`Old format gewerbe:`, oldResult?.gewerbe);
        console.log(`New format gewerbe:`, newResult?.gewerbe);

        return { old: oldResult, new: newResult };
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
    
    // Override global functions with backward compatibility
    window.parseAntragText = function(text) {
        console.log('🔧 Global parseAntragText called via DragDropAntrag (backward compatible)');
        const handler = new DragDropAntrag();
        return handler.parseAntrag(text);
    };
    
    window.fillAntragForm = function(data) {
        console.log('🔧 Global fillAntragForm called via DragDropAntrag (backward compatible)');
        const handler = new DragDropAntrag();
        return handler.fillForm(data);
    };
    
    // Global test function
    window.testDragDropBackwardCompatibility = function() {
        const handler = new DragDropAntrag();
        return handler.testBackwardCompatibility();
    };
    
    console.log('🎯 DragDropAntrag v5.1 ready - Backward Compatible');
    console.log('✅ Supports OLD format: "Gewerbe:"');
    console.log('✅ Supports NEW format: "Für Gewerbe:"');
    console.log('🧪 Test function: testDragDropBackwardCompatibility()');
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DragDropAntrag };
}