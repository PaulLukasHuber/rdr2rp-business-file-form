// ===================================
// DRAG & DROP PERSONENPRÜFUNGSAKTEN HANDLER v5.0
// Spezialisiert für Personenprüfungsakten mit FIXED Radio Buttons & Details
// VOLLSTÄNDIG KORRIGIERTE VERSION
// ===================================

class DragDropPersonenpruefung {
    constructor() {
        this.version = "5.0";
        console.log(`👤 DragDropPersonenpruefung v${this.version} initialized`);
    }

    // ===== MAIN IMPORT HANDLER =====
    handleImport(text) {
        console.log(`🔄 v${this.version}: Handling Personenprüfung import...`);
        
        try {
            // Parse the text
            const parsedData = this.parsePersonenprüfungsakte(text);
            console.log(`📊 Parsed data:`, JSON.stringify(parsedData, null, 2));

            if (parsedData && this.validateData(parsedData)) {
                // Fill the form
                this.fillForm(parsedData);
                
                // Clear import field and show success
                this.clearImportField();
                this.showSuccessMessage();
                
                console.log(`✅ v${this.version}: Personenprüfung import completed successfully`);
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
    parsePersonenprüfungsakte(text) {
        console.log('🔄 v' + this.version + ': Parsing Personenprüfungsakte...');
        console.log('📄 RAW TEXT:', text);
        
        const data = {};

        try {
            // Basic validation
            const hasPersonField = /Zu überprüfende Person:/i.test(text);
            const hasTelegramField = /Telegramm/i.test(text);
            const hasResultField = /Prüfungsergebnis:/i.test(text);

            if (!hasPersonField || !hasResultField) {
                console.log('❌ Not a valid Personenprüfungsakte');
                return null;
            }

            // Extract basic fields mit VERBESSERTER LOGIK
            data.person = this.extractFieldBetweenMarkers(text, 'Zu überprüfende Person:');
            data.telegram = this.extractTelegramField(text);
            data.pruefer = this.extractFieldBetweenMarkers(text, 'Geprüft durch:');
            data.datum = this.extractFieldBetweenMarkers(text, 'Geprüft am:');

            // Extract Prüfungsergebnis with details
            const ergebnisData = this.extractPruefungsergebnis(text);
            data.ergebnisType = ergebnisData.type;
            data.details = ergebnisData.details;

            console.log('📊 v' + this.version + ': Final parsed result:', JSON.stringify(data, null, 2));
            return data;

        } catch (error) {
            console.error('❌ v' + this.version + ': Parse error:', error);
            return null;
        }
    }

    // ===== VERBESSERTE FELD-EXTRAKTION =====
    extractFieldBetweenMarkers(text, fieldName) {
        console.log(`🔍 v${this.version}: Extracting field "${fieldName}" with improved logic`);
        
        try {
            // Erstelle Regex Pattern für das spezifische Feld
            const escapedFieldName = fieldName.replace(/[.*+?^${}()|[\]\\]/g, '\\    // ===== PARSING LOGIC =====
    parsePersonenprüfungsakte(text) {
        console.log(`🔄 v${this.version}: Parsing Personenprüfungsakte...`);
        console.log(`📄 RAW TEXT:`, text);
        
        const data = {};

        try {
            // Basic validation
            const hasPersonField = /Zu überprüfende Person:/i.test(text);
            const hasTelegramField = /Telegramm/i.test(text);
            const hasResultField = /Prüfungsergebnis:/i.test(text);

            if (!hasPersonField || !hasResultField) {
                console.log(`❌ Not a valid Personenprüfungsakte`);
                return null;
            }

            // Extract basic fields
            data.person = DragDropUtils.extractSimpleField(text, 'Zu überprüfende Person');
            data.telegram = this.extractTelegramField(text);
            data.pruefer = DragDropUtils.extractSimpleField(text, 'Geprüft durch');
            data.datum = DragDropUtils.extractSimpleField(text, 'Geprüft am');

            // Extract Prüfungsergebnis with details
            const ergebnisData = this.extractPruefungsergebnis(text);
            data.ergebnisType = ergebnisData.type;
            data.details = ergebnisData.details;

            console.log(`📊 v${this.version}: Final parsed result:`, JSON.stringify(data, null, 2));
            return data;

        } catch (error) {
            console.error(`❌ v${this.version}: Parse error:`, error);
            return null;
        }
    }');
            
            // Pattern 1: Mit Code-Blöcken ```
            const codeBlockPattern = new RegExp(escapedFieldName + '\\s*```\\s*([^`]*?)\\s*```', 'i');
            const codeBlockMatch = text.match(codeBlockPattern);
            
            if (codeBlockMatch && codeBlockMatch[1]) {
                const content = codeBlockMatch[1].trim();
                if (content && content !== '---') {
                    console.log(`✅ Found "${fieldName}" in code block: "${content}"`);
                    return content;
                }
            }
            
            // Pattern 2: Ohne Code-Blöcke - Line-by-line Suche
            const lines = text.split('\n');
            
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i].trim();
                
                if (line.toLowerCase() === fieldName.toLowerCase()) {
                    console.log(`📍 Found field "${fieldName}" at line ${i}`);
                    
                    // Schaue auf die nächste Zeile
                    if (i + 1 < lines.length) {
                        const nextLine = lines[i + 1].trim();
                        if (nextLine && nextLine !== '---' && !nextLine.includes(':')) {
                            console.log(`✅ Found "${fieldName}" content: "${nextLine}"`);
                            return nextLine;
                        }
                    }
                    break;
                }
            }
            
            console.log(`❌ No content found for "${fieldName}"`);
            return null;
            
        } catch (error) {
            console.error(`❌ Error extracting "${fieldName}":`, error);
            return null;
        }
    }

    // ===== TELEGRAM FIELD EXTRACTION =====
    extractTelegramField(text) {
        console.log(`📞 v${this.version}: Special Telegram extraction for Personenprüfungsakte`);
        
        // Verschiedene mögliche Telegram-Feldnamen
        const telegramVariants = [
            'Telegrammnummer (Für Rückfragen):',
            'Telegrammnummer (für Rückfragen):',
            'Telegrammnummer:',
            'Telegram:',
            'Telegramm:'
        ];
        
        // Probiere jeden Variant mit der verbesserten Extraktion
        for (const variant of telegramVariants) {
            const result = this.extractFieldBetweenMarkers(text, variant);
            if (result) {
                console.log(`✅ v${this.version}: Found Telegram with variant: "${variant}" -> "${result}"`);
                return result;
            }
        }
        
        // Fallback: Regex-basierte Suche (für den Fall dass das Format anders ist)
        const telegramPatterns = [
            /Telegrammnummer.*?:\s*```\s*([^`]+?)\s*```/i,
            /Telegrammnummer.*?:\s*([^\n]+)/i,
            /Telegramm.*?:\s*```\s*([^`]+?)\s*```/i,
            /Telegramm.*?:\s*([^\n]+)/i
        ];
        
        for (const pattern of telegramPatterns) {
            const match = text.match(pattern);
            if (match && match[1] && match[1].trim() !== '---') {
                const telegramValue = match[1].trim();
                console.log(`✅ v${this.version}: Found Telegram via regex: "${telegramValue}"`);
                return telegramValue;
            }
        }
        
        console.log(`❌ v${this.version}: No Telegram field found with any method`);
        return null;
    }

    // ===== PRÜFUNGSERGEBNIS EXTRACTION =====
    extractPruefungsergebnis(text) {
        console.log(`🎯 v${this.version}: Extracting Prüfungsergebnis...`);
        
        const result = { type: null, details: null };
        
        try {
            // Extract result type - VERBESSERTE VERSION
            result.type = this.extractFieldBetweenMarkers(text, 'Prüfungsergebnis:');
            if (result.type) {
                console.log(`🎯 Extracted result type: "${result.type}"`);
            }
            
            // Extract details - VERBESSERTE VERSION  
            result.details = this.extractFieldBetweenMarkers(text, 'Detaillierte Bewertung/Anmerkungen:');
            if (result.details) {
                console.log(`✅ Found valid details: "${result.details}"`);
            } else {
                console.log(`⚠️ No details found or details field is empty`);
            }
            
            console.log(`📊 v${this.version}: Final ergebnis extraction:`, result);
            return result;
            
        } catch (error) {
            console.error(`❌ v${this.version}: Error in ergebnis extraction:`, error);
            return result;
        }
    }

    // ===== VALIDATION =====
    validateData(data) {
        if (!data || typeof data !== 'object') {
            return false;
        }

        const fieldCount = [data.person, data.telegram, data.pruefer, data.ergebnisType].filter(Boolean).length;
        console.log(`📊 v${this.version}: Validation - field count: ${fieldCount}`);
        return fieldCount >= 2;
    }

    // ===== FORM FILLING =====
    fillForm(data) {
        console.log(`🎯 v${this.version}: Filling form with data:`, JSON.stringify(data, null, 2));
        
        try {
            // Fill basic fields
            DragDropUtils.fillField('person', data.person);
            DragDropUtils.fillField('telegram', data.telegram);
            DragDropUtils.fillField('pruefer', data.pruefer);
            DragDropUtils.fillField('details', data.details);
            
            // Set current date
            DragDropUtils.setCurrentDate();
            
            // Set radio button for Prüfungsergebnis
            if (data.ergebnisType) {
                this.setRadioButton(data.ergebnisType);
            }
            
            console.log(`✅ v${this.version}: Form filling completed`);
            
        } catch (error) {
            console.error(`❌ v${this.version}: Error in form filling:`, error);
        }
    }

    // ===== RADIO BUTTON LOGIC - COMPLETELY FIXED =====
    setRadioButton(ergebnisType) {
        console.log(`🎯 v${this.version}: FIXED radio button setting for: "${ergebnisType}"`);
        
        // Determine which radio button to select
        let targetId = '';
        const lowerType = ergebnisType.toLowerCase();
        
        console.log(`🔍 Analyzing: "${ergebnisType}" (lower: "${lowerType}")`);
        
        // Pattern matching with detailed logging - KORRIGIERTE REIHENFOLGE!
        // WICHTIG: Zuerst auf "nicht bestanden" prüfen, dann auf "bestanden"
        if (ergebnisType.includes('❌') || 
           lowerType.includes('nicht bestanden') ||
           lowerType.includes('nicht-bestanden') ||
           ergebnisType.startsWith('❌')) {
            targetId = 'nicht-bestanden';
            console.log(`❌ Matched NICHT BESTANDEN pattern`);
        } else if (ergebnisType.includes('⏳') || 
                   lowerType.includes('ausstehend') ||
                   lowerType.includes('prüfung ausstehend') ||
                   ergebnisType.startsWith('⏳')) {
            targetId = 'ausstehend';
            console.log(`⏳ Matched AUSSTEHEND pattern`);
        } else if (ergebnisType.includes('✅') || 
                   (lowerType.includes('bestanden') && !lowerType.includes('nicht'))) {
            targetId = 'bestanden';
            console.log(`✅ Matched BESTANDEN pattern`);
        }
        
        if (!targetId) {
            console.error(`❌ Could not determine radio button for: "${ergebnisType}"`);
            return;
        }
        
        console.log(`🎯 Target radio ID: "${targetId}"`);
        
        // Execute the selection with direct DOM manipulation
        this.executeRadioSelection(targetId);
    }

    // ===== DIRECT RADIO BUTTON SELECTION =====
    executeRadioSelection(radioId) {
        console.log(`🔧 v${this.version}: Executing radio selection for: "${radioId}"`);
        
        try {
            // Step 1: Clear all radio group selections
            const allRadioGroups = document.querySelectorAll('.radio-group');
            console.log(`📊 Found ${allRadioGroups.length} radio groups`);
            
            allRadioGroups.forEach((group, index) => {
                group.classList.remove('selected');
                console.log(`🔄 Cleared selection from group ${index}`);
            });
            
            // Step 2: Find and check the target radio button
            const targetRadio = document.getElementById(radioId);
            if (!targetRadio) {
                console.error(`❌ Radio button "${radioId}" not found in DOM`);
                console.log(`📊 Available radios:`, Array.from(document.querySelectorAll('input[type="radio"]')).map(r => r.id));
                return;
            }
            
            console.log(`✅ Found target radio:`, targetRadio);
            
            // Step 3: Check the radio button
            targetRadio.checked = true;
            console.log(`✅ Checked radio button: ${radioId}`);
            
            // Step 4: Find the parent radio group and add selected class
            const parentGroup = targetRadio.closest('.radio-group');
            if (!parentGroup) {
                console.error(`❌ Parent radio group not found for: ${radioId}`);
                return;
            }
            
            console.log(`✅ Found parent group:`, parentGroup);
            
            // Step 5: Add selected class
            parentGroup.classList.add('selected');
            console.log(`✅ Added 'selected' class to parent group`);
            
            // Step 6: Trigger change event
            targetRadio.dispatchEvent(new Event('change', { bubbles: true }));
            console.log(`✅ Triggered change event`);
            
            // Step 7: Verification
            setTimeout(() => {
                const isChecked = targetRadio.checked;
                const hasSelectedClass = parentGroup.classList.contains('selected');
                console.log(`🔍 VERIFICATION - Radio checked: ${isChecked}, Group has selected: ${hasSelectedClass}`);
                
                if (isChecked && hasSelectedClass) {
                    console.log(`🎉 SUCCESS: Radio button "${radioId}" correctly selected!`);
                } else {
                    console.error(`❌ VERIFICATION FAILED for radio button "${radioId}"`);
                }
            }, 100);
            
        } catch (error) {
            console.error(`❌ Error in radio selection:`, error);
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
        if (typeof showImportSuccessPopup === 'function') {
            showImportSuccessPopup();
        } else {
            console.log('✅ Personenprüfungsakte erfolgreich importiert!');
        }
    }

    showErrorMessage() {
        if (typeof showPersonenprüfungImportErrorPopup === 'function') {
            showPersonenprüfungImportErrorPopup();
        } else {
            console.error('❌ Import fehlgeschlagen!');
        }
    }
}

// ===== INTEGRATION WITH EXISTING SYSTEM =====
// Override the global functions to use our handler
if (typeof window !== 'undefined') {
    // Store original functions as backup
    if (typeof window.parsePersonenprüfungsakteText === 'function') {
        window.parsePersonenprüfungsakteTextOriginal = window.parsePersonenprüfungsakteText;
    }
    if (typeof window.fillPersonenprüfungsakteForm === 'function') {
        window.fillPersonenprüfungsakteFormOriginal = window.fillPersonenprüfungsakteForm;
    }

    // Create new handler instance
    window.DragDropPersonenpruefung = DragDropPersonenpruefung;
    
    // Override global functions
    window.parsePersonenprüfungsakteText = function(text) {
        console.log('🔧 Global parsePersonenprüfungsakteText called via DragDropPersonenpruefung');
        const handler = new DragDropPersonenpruefung();
        return handler.parsePersonenprüfungsakte(text);
    };
    
    window.fillPersonenprüfungsakteForm = function(data) {
        console.log('🔧 Global fillPersonenprüfungsakteForm called via DragDropPersonenpruefung');
        const handler = new DragDropPersonenpruefung();
        return handler.fillForm(data);
    };
    
    console.log('🎯 DragDropPersonenpruefung v5.0 ready - FIXED radio buttons & details extraction + CORRECTED Telegram parsing');
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DragDropPersonenpruefung };
}