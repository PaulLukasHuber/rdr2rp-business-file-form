// ===================================
// DRAG & DROP PERSONENPRÜFUNG HANDLER v6.0
// KOMPLETT NEUER, EINFACHER ANSATZ
// ===================================

class SimpleDragDropPersonenpruefung {
    constructor() {
        this.version = "6.0";
        console.log(`👤 SimpleDragDropPersonenpruefung v${this.version} - Komplett neuer Ansatz`);
    }

    // ===== MAIN HANDLER =====
    handleImport(text) {
        console.log(`🔄 v${this.version}: Starting simple import...`);
        console.log(`📄 Text length: ${text.length} characters`);
        
        try {
            // Schritt 1: Ist es eine Personenprüfungsakte?
            if (!this.isPersonenpruefungsakte(text)) {
                console.log(`❌ Not a Personenprüfungsakte`);
                this.showError();
                return false;
            }
            
            // Schritt 2: Daten extrahieren
            const data = this.extractData(text);
            console.log(`📊 Extracted data:`, data);
            
            if (!data || Object.keys(data).length === 0) {
                console.log(`❌ No data extracted`);
                this.showError();
                return false;
            }
            
            // Schritt 3: Formular füllen
            this.fillForm(data);
            
            // Schritt 4: UI aufräumen
            this.cleanup();
            
            console.log(`✅ Import completed successfully`);
            return true;
            
        } catch (error) {
            console.error(`❌ Import error:`, error);
            this.showError();
            return false;
        }
    }

    // ===== VALIDATION =====
    isPersonenpruefungsakte(text) {
        console.log(`🔍 Checking if text is Personenprüfungsakte...`);
        
        // Einfache Checks
        const hasPersonField = text.includes('Zu überprüfende Person:');
        const hasResultField = text.includes('Prüfungsergebnis:');
        const hasTelegramField = text.includes('Telegramm');
        
        // Ausschließende Checks (keine Gewerbeakte)
        const isNotGewerbeakte = !text.includes('Lizenznummer:') && 
                                !text.includes('Mitarbeiter (*Nur Inhaber') &&
                                !text.includes('Sondergenehmigung:');
        
        const result = hasPersonField && hasResultField && isNotGewerbeakte;
        console.log(`📊 Validation result: ${result} (Person: ${hasPersonField}, Result: ${hasResultField}, NotGewerbe: ${isNotGewerbeakte})`);
        
        return result;
    }

    // ===== DATA EXTRACTION - SUPER EINFACH =====
    extractData(text) {
        console.log(`📥 Starting data extraction...`);
        
        const data = {};
        
        // Zeilen aufteilen
        const lines = text.split('\n').map(line => line.trim());
        console.log(`📄 Total lines: ${lines.length}`);
        
        // Jeden Feldtyp einzeln suchen
        data.person = this.findFieldValue(lines, 'Zu überprüfende Person:');
        data.telegram = this.findFieldValue(lines, 'Telegrammnummer');
        data.pruefer = this.findFieldValue(lines, 'Geprüft durch:');
        data.datum = this.findFieldValue(lines, 'Geprüft am:');
        data.ergebnis = this.findFieldValue(lines, 'Prüfungsergebnis:');
        data.details = this.findFieldValue(lines, 'Detaillierte Bewertung');
        
        // Fallback für Details
        if (!data.details) {
            data.details = this.findFieldValue(lines, 'Anmerkungen:');
        }
        
        console.log(`📊 Raw extracted data:`, data);
        
        // Ergebnis-Typ bestimmen
        if (data.ergebnis) {
            data.ergebnisType = this.determineResultType(data.ergebnis);
            console.log(`🎯 Determined result type: "${data.ergebnisType}"`);
        }
        
        return data;
    }

    // ===== FELD-EXTRAKTION =====
    findFieldValue(lines, fieldName) {
        console.log(`🔍 Looking for field: "${fieldName}"`);
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            
            // Feldname gefunden?
            if (line.toLowerCase().includes(fieldName.toLowerCase())) {
                console.log(`📍 Found field "${fieldName}" at line ${i}: "${line}"`);
                
                // Wert in der gleichen Zeile?
                const colonIndex = line.indexOf(':');
                if (colonIndex !== -1) {
                    const sameLineValue = line.substring(colonIndex + 1).trim();
                    if (sameLineValue && sameLineValue !== '```' && sameLineValue !== '---') {
                        console.log(`✅ Same line value: "${sameLineValue}"`);
                        return sameLineValue;
                    }
                }
                
                // Wert in den nächsten Zeilen suchen
                for (let j = i + 1; j < Math.min(i + 5, lines.length); j++) {
                    const nextLine = lines[j].trim();
                    
                    // Skip leer, ---, ``` oder neue Felder
                    if (!nextLine || 
                        nextLine === '---' || 
                        nextLine === '```' ||
                        nextLine.includes(':')) {
                        continue;
                    }
                    
                    console.log(`✅ Next line value: "${nextLine}"`);
                    return nextLine;
                }
                
                break; // Feld gefunden aber kein Wert
            }
        }
        
        console.log(`❌ No value found for "${fieldName}"`);
        return null;
    }

    // ===== ERGEBNIS-TYP BESTIMMEN =====
    determineResultType(ergebnis) {
        const lower = ergebnis.toLowerCase();
        
        if (ergebnis.includes('✅') || lower.includes('bestanden')) {
            return 'bestanden';
        } else if (ergebnis.includes('❌') || lower.includes('nicht bestanden')) {
            return 'nicht-bestanden';
        } else if (ergebnis.includes('⏳') || lower.includes('ausstehend')) {
            return 'ausstehend';
        }
        
        return null;
    }

    // ===== FORMULAR FÜLLEN - ULTRA EINFACH =====
    fillForm(data) {
        console.log(`📝 Filling form with simple approach...`);
        
        // Basis-Felder füllen
        this.setFieldValue('person', data.person);
        this.setFieldValue('telegram', data.telegram);
        this.setFieldValue('pruefer', data.pruefer);
        this.setFieldValue('details', data.details);
        
        // Aktuelles Datum setzen
        this.setCurrentDate();
        
        // Radio Button setzen
        if (data.ergebnisType) {
            this.setRadioButton(data.ergebnisType);
        }
        
        console.log(`✅ Form filling completed`);
    }

    // ===== UTILITY FUNCTIONS =====
    setFieldValue(fieldId, value) {
        if (!value) return;
        
        const field = document.getElementById(fieldId);
        if (field) {
            field.value = value;
            field.dispatchEvent(new Event('input'));
            console.log(`✅ Set ${fieldId}: "${value}"`);
        } else {
            console.log(`⚠️ Field ${fieldId} not found`);
        }
    }

    setCurrentDate() {
        const today = new Date();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const dateValue = `1899-${month}-${day}`;
        
        const dateField = document.getElementById('datum');
        if (dateField) {
            dateField.value = dateValue;
            console.log(`📅 Set date: ${dateValue}`);
        }
    }

    setRadioButton(resultType) {
        console.log(`🎯 Setting radio button for: "${resultType}"`);
        
        // Alle Gruppen deselektieren
        document.querySelectorAll('.radio-group').forEach(group => {
            group.classList.remove('selected');
        });
        
        // Alle Radio Buttons deaktivieren
        document.querySelectorAll('input[name="ergebnis"]').forEach(radio => {
            radio.checked = false;
        });
        
        // Target Radio finden und aktivieren
        const targetRadio = document.getElementById(resultType);
        if (targetRadio) {
            targetRadio.checked = true;
            
            // Parent Gruppe finden und markieren
            const parentGroup = targetRadio.closest('.radio-group');
            if (parentGroup) {
                parentGroup.classList.add('selected');
                console.log(`✅ Selected radio button: ${resultType}`);
            } else {
                console.log(`⚠️ Parent group not found for: ${resultType}`);
            }
        } else {
            console.log(`⚠️ Radio button not found: ${resultType}`);
        }
    }

    // ===== UI MANAGEMENT =====
    cleanup() {
        // Import-Feld leeren
        const importField = document.getElementById('import-text');
        if (importField) {
            importField.value = '';
        }
        
        // Button-Status aktualisieren
        if (typeof checkImportText === 'function') {
            checkImportText();
        }
        
        // Erfolg anzeigen
        this.showSuccess();
    }

    showSuccess() {
        if (typeof showImportSuccessPopup === 'function') {
            showImportSuccessPopup();
        } else {
            console.log('✅ Import erfolgreich!');
        }
    }

    showError() {
        if (typeof showPersonenprüfungImportErrorPopup === 'function') {
            showPersonenprüfungImportErrorPopup();
        } else {
            console.log('❌ Import fehlgeschlagen!');
        }
    }
}

// ===== INTEGRATION =====
if (typeof window !== 'undefined') {
    console.log('🔄 Integrating SimpleDragDropPersonenpruefung...');
    
    // Globale Instanz erstellen
    window.SimpleDragDropPersonenpruefung = SimpleDragDropPersonenpruefung;
    
    // Handler Instanz für DragDropCore
    window.DragDropPersonenpruefung = SimpleDragDropPersonenpruefung;
    
    // Globale Funktionen überschreiben
    window.parsePersonenprüfungsakteText = function(text) {
        console.log('🔧 parsePersonenprüfungsakteText called via Simple handler');
        const handler = new SimpleDragDropPersonenpruefung();
        return handler.extractData(text);
    };
    
    window.fillPersonenprüfungsakteForm = function(data) {
        console.log('🔧 fillPersonenprüfungsakteForm called via Simple handler');
        const handler = new SimpleDragDropPersonenpruefung();
        return handler.fillForm(data);
    };
    
    console.log('🎯 SimpleDragDropPersonenpruefung v6.0 ready - Ultra-simple approach');
}

// ===== MANUAL TEST FUNCTION =====
if (typeof window !== 'undefined') {
    window.testPersonenprüfungImport = function(testText) {
        console.log('🧪 Testing Personenprüfung import...');
        const handler = new SimpleDragDropPersonenpruefung();
        return handler.handleImport(testText);
    };
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SimpleDragDropPersonenpruefung };
}