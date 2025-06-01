// ===================================
// DRAG & DROP GEWERBEAKTE HANDLER v5.0
// Spezialisiert für Gewerbeakten mit Mitarbeiter-Handling
// ===================================

class DragDropGewerbeakte {
    constructor() {
        this.version = "5.0";
        console.log(`🏢 DragDropGewerbeakte v${this.version} initialized`);
    }

    // ===== MAIN IMPORT HANDLER =====
    handleImport(text) {
        console.log(`🔄 v${this.version}: Handling Gewerbeakte import...`);
        
        try {
            // Parse the text
            const parsedData = this.parseGewerbeakte(text);
            console.log(`📊 Parsed data:`, JSON.stringify(parsedData, null, 2));

            if (parsedData && this.validateData(parsedData)) {
                // Fill the form
                this.fillForm(parsedData);
                
                // Clear import field and show success
                this.clearImportField();
                this.showSuccessMessage();
                
                console.log(`✅ v${this.version}: Gewerbeakte import completed successfully`);
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
    parseGewerbeakte(text) {
        console.log(`🔄 v${this.version}: Parsing Gewerbeakte...`);
        
        const data = { mitarbeiter: [] };

        try {
            // Validation: Check if it's a Gewerbeakte
            const requiredFields = [
                /Vermerk zum Gewerbeantrag:/i,
                /Lizenznummer:/i,
                /Betrieb:/i,
                /Mitarbeiter.*MIT TELEGRAMM NUMMERN/i
            ];

            const foundFields = requiredFields.filter(pattern => pattern.test(text));
            
            if (foundFields.length < 3) {
                console.log(`❌ Gewerbeakte validation failed: Only ${foundFields.length}/4 required fields found`);
                return null;
            }

            console.log(`✅ v${this.version}: Gewerbeakte validation passed: ${foundFields.length}/4 fields found`);

            // Extract basic data using flexible patterns
            const patterns = {
                vermerk: [
                    /Vermerk zum Gewerbeantrag:\s*```\s*([^`]+?)\s*```/i,
                    /Vermerk zum Gewerbeantrag:\s*([^\n]+)/i
                ],
                lizenznummer: [
                    /Lizenznummer:\s*```\s*([^`]+?)\s*```/i,
                    /Lizenznummer:\s*([^\n]+)/i
                ],
                datum: [
                    /Ausgestellt am.*?:\s*```\s*([^`]+?)\s*```/i,
                    /Ausgestellt am.*?:\s*([^\n]+)/i
                ],
                betrieb: [
                    /Betrieb:\s*```\s*([^`]+?)\s*```/i,
                    /Betrieb:\s*([^\n]+)/i
                ],
                anzahlLizenzen: [
                    /Anzahl der herausgebenden Lizenzen.*?:\s*```\s*([^`]+?)\s*```/i,
                    /Anzahl.*Lizenzen.*?:\s*([^\n]+)/i
                ],
                sondergenehmigung: [
                    /Sondergenehmigung:\s*```\s*([^`]+?)\s*```/i,
                    /Sondergenehmigung:\s*([^\n]+)/i
                ],
                sonstiges: [
                    /Sonstiges:\s*```\s*([^`]+?)\s*```/i,
                    /Sonstiges:\s*([^\n]+)/i
                ]
            };

            // Extract each field using multiple patterns
            for (const [key, patternArray] of Object.entries(patterns)) {
                for (const pattern of patternArray) {
                    const match = text.match(pattern);
                    if (match && match[1] && match[1].trim() !== '---') {
                        data[key] = match[1].trim();
                        console.log(`✅ v${this.version}: Found ${key}:`, data[key]);
                        break;
                    }
                }
            }

            // Extract Mitarbeiter section
            data.mitarbeiter = this.extractMitarbeiter(text);

            // Extract Stadt and Betrieb from Lizenznummer if available
            if (data.lizenznummer) {
                const lizenzMatch = data.lizenznummer.match(/^([A-Z]+)-([A-Z]+)-/);
                if (lizenzMatch) {
                    data.stadt = lizenzMatch[1];
                    data.betriebPrefix = lizenzMatch[2];
                    console.log(`✅ v${this.version}: Extracted from Lizenznummer - Stadt: ${data.stadt}, BetriebPrefix: ${data.betriebPrefix}`);
                }
            }

            console.log(`📊 v${this.version}: Final Gewerbeakte parse result:`, JSON.stringify(data, null, 2));
            return data;

        } catch (error) {
            console.error(`❌ v${this.version}: Gewerbeakte parse error:`, error);
            return null;
        }
    }

    // ===== MITARBEITER EXTRACTION =====
    extractMitarbeiter(text) {
        const mitarbeiter = [];
        
        try {
            console.log(`👥 v${this.version}: Extracting Mitarbeiter from Gewerbeakte...`);
            
            // Method 1: Standard code block extraction
            const mitarbeiterMatch = text.match(/Mitarbeiter.*?```\s*(.*?)\s*```/is);
            if (mitarbeiterMatch && mitarbeiterMatch[1]) {
                const mitarbeiterText = mitarbeiterMatch[1].trim();
                console.log(`📝 Mitarbeiter block content:`, mitarbeiterText);
                
                if (mitarbeiterText !== '---') {
                    const lines = mitarbeiterText.split('\n').filter(line => line.trim());
                    lines.forEach(line => {
                        const parsedMitarbeiter = this.parseMitarbeiterLine(line);
                        if (parsedMitarbeiter) {
                            mitarbeiter.push(parsedMitarbeiter);
                        }
                    });
                }
            }
            
            // Method 2: Fallback - line by line search if no code block found
            if (mitarbeiter.length === 0) {
                console.log(`🔍 v${this.version}: No code block found, trying line-by-line extraction...`);
                const lines = text.split('\n');
                let inMitarbeiterSection = false;
                
                for (let i = 0; i < lines.length; i++) {
                    const line = lines[i].trim();
                    
                    if (line.toLowerCase().includes('mitarbeiter') && line.toLowerCase().includes('telegramm')) {
                        inMitarbeiterSection = true;
                        continue;
                    }
                    
                    if (inMitarbeiterSection) {
                        if (line.includes(':') && (line.includes('Inhaber') || line.includes('Stellvertretung'))) {
                            const parsedMitarbeiter = this.parseMitarbeiterLine(line);
                            if (parsedMitarbeiter) {
                                mitarbeiter.push(parsedMitarbeiter);
                            }
                        } else if (line.trim() === '' || line.includes('Anzahl') || line.includes('Sondergenehmigung')) {
                            break;
                        }
                    }
                }
            }
            
            console.log(`👥 v${this.version}: Extracted ${mitarbeiter.length} Mitarbeiter:`, mitarbeiter);
            return mitarbeiter;
            
        } catch (error) {
            console.error(`❌ v${this.version}: Mitarbeiter extraction error:`, error);
            return [];
        }
    }

    parseMitarbeiterLine(line) {
        const trimmedLine = line.trim();
        console.log(`👤 v${this.version}: Parsing Mitarbeiter line:`, trimmedLine);
        
        // Pattern: "Rolle: Vorname Nachname (Telegram)"
        const match = trimmedLine.match(/^(.*?):\s*(.+?)\s*\(([^)]+)\)$/);
        if (match) {
            const [, rolle, fullName, telegram] = match;
            const nameParts = fullName.trim().split(' ');
            const vorname = nameParts[0] || '';
            const nachname = nameParts.slice(1).join(' ') || '';

            const mitarbeiter = {
                rolle: rolle.trim(),
                vorname: vorname,
                nachname: nachname,
                telegram: telegram.trim()
            };
            
            console.log(`✅ v${this.version}: Parsed Mitarbeiter:`, mitarbeiter);
            return mitarbeiter;
        }
        
        console.log(`⚠️ v${this.version}: Could not parse Mitarbeiter line:`, trimmedLine);
        return null;
    }

    // ===== VALIDATION =====
    validateData(data) {
        if (!data || typeof data !== 'object') {
            return false;
        }

        const hasVermerk = data.vermerk && data.vermerk.length > 0;
        const hasLizenznummer = data.lizenznummer && data.lizenznummer.length > 0;
        const hasBetrieb = data.betrieb && data.betrieb.length > 0;
        const hasMitarbeiter = data.mitarbeiter && Array.isArray(data.mitarbeiter) && data.mitarbeiter.length > 0;

        const validFields = [hasVermerk, hasLizenznummer, hasBetrieb, hasMitarbeiter].filter(Boolean).length;
        console.log(`📊 v${this.version}: Gewerbeakte validation - valid fields: ${validFields}/4`);
        
        return validFields >= 2;
    }

    // ===== FORM FILLING =====
    fillForm(data) {
        console.log(`🎯 v${this.version}: Filling Gewerbeakte form with data:`, JSON.stringify(data, null, 2));
        
        try {
            // Fill basic text fields
            if (data.vermerk) {
                DragDropUtils.fillField('vermerk', data.vermerk);
            }
            if (data.sondergenehmigung) {
                DragDropUtils.fillField('sondergenehmigung', data.sondergenehmigung);
            }
            if (data.sonstiges) {
                DragDropUtils.fillField('sonstiges', data.sonstiges);
            }

            // Set Stadt dropdown
            if (data.stadt) {
                const stadtSelect = document.getElementById('stadt');
                if (stadtSelect) {
                    stadtSelect.value = data.stadt;
                    stadtSelect.dispatchEvent(new Event('change'));
                    
                    setTimeout(() => {
                        if (data.betrieb) {
                            DragDropUtils.fillField('betrieb', data.betrieb);
                        }
                    }, 200);
                }
            }

            // Set current date (with year 1899)
            DragDropUtils.setCurrentDate();

            // Handle Mitarbeiter data
            this.fillMitarbeiterData(data.mitarbeiter || []);

            console.log(`✅ v${this.version}: Gewerbeakte form filling completed`);
            
        } catch (error) {
            console.error(`❌ v${this.version}: Error in form filling:`, error);
        }
    }

    // ===== MITARBEITER FORM FILLING =====
    fillMitarbeiterData(mitarbeiterArray) {
        console.log(`👥 v${this.version}: Filling Mitarbeiter data:`, mitarbeiterArray);
        
        const mitarbeiterContainer = document.getElementById('mitarbeiter-container');
        if (!mitarbeiterContainer) {
            console.error('❌ Mitarbeiter container not found');
            return;
        }

        // Clear existing Stellvertreter
        const stellvertreterSections = mitarbeiterContainer.querySelectorAll('.mitarbeiter-section:not(:first-child)');
        stellvertreterSections.forEach(section => section.remove());

        // Reset stellvertreter counter if it exists
        if (typeof window.stellvertreterCounter !== 'undefined') {
            window.stellvertreterCounter = 1;
        }

        if (mitarbeiterArray && mitarbeiterArray.length > 0) {
            mitarbeiterArray.forEach((mitarbeiter, index) => {
                if (mitarbeiter.rolle === 'Inhaber') {
                    // Fill Inhaber (first section)
                    const inhaberSection = mitarbeiterContainer.querySelector('.mitarbeiter-section:first-child');
                    if (inhaberSection) {
                        this.fillMitarbeiterSection(inhaberSection, mitarbeiter, 0);
                    }
                } else {
                    // Add Stellvertreter
                    if (typeof window.addStellvertreter === 'function') {
                        window.addStellvertreter();

                        const stellvertreterSections = mitarbeiterContainer.querySelectorAll('.mitarbeiter-section:not(:first-child)');
                        const currentSection = stellvertreterSections[stellvertreterSections.length - 1];
                        const stellvertreterIndex = stellvertreterSections.length;

                        if (currentSection) {
                            this.fillMitarbeiterSection(currentSection, mitarbeiter, stellvertreterIndex);
                        }
                    }
                }
            });
        }

        // Update license count and button state
        setTimeout(() => {
            if (typeof window.updateLizenzAnzahl === 'function') {
                window.updateLizenzAnzahl();
            }
            if (typeof window.updateAddButton === 'function') {
                window.updateAddButton();
            }
        }, 100);
    }

    fillMitarbeiterSection(section, mitarbeiter, index) {
        const vornameField = section.querySelector(`[data-field="vorname"][data-index="${index}"]`);
        const nachnameField = section.querySelector(`[data-field="nachname"][data-index="${index}"]`);
        const telegramField = section.querySelector(`[data-field="telegram"][data-index="${index}"]`);

        if (vornameField) vornameField.value = mitarbeiter.vorname || '';
        if (nachnameField) nachnameField.value = mitarbeiter.nachname || '';
        if (telegramField) telegramField.value = mitarbeiter.telegram || '';
        
        console.log(`✅ v${this.version}: Filled Mitarbeiter section ${index}:`, mitarbeiter);
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
            console.log('✅ Gewerbeakte erfolgreich importiert!');
        }
    }

    showErrorMessage() {
        if (typeof showImportErrorPopup === 'function') {
            showImportErrorPopup();
        } else {
            console.error('❌ Import fehlgeschlagen!');
        }
    }
}

// ===== INTEGRATION WITH EXISTING SYSTEM =====
if (typeof window !== 'undefined') {
    // Store original functions as backup
    if (typeof window.parseGewerbeakteText === 'function') {
        window.parseGewerbeakteTextOriginal = window.parseGewerbeakteText;
    }
    if (typeof window.fillGewerbeakteForm === 'function') {
        window.fillGewerbeakteFormOriginal = window.fillGewerbeakteForm;
    }

    // Create new handler instance
    window.DragDropGewerbeakte = DragDropGewerbeakte;
    
    // Override global functions
    window.parseGewerbeakteText = function(text) {
        console.log('🔧 Global parseGewerbeakteText called via DragDropGewerbeakte');
        const handler = new DragDropGewerbeakte();
        return handler.parseGewerbeakte(text);
    };
    
    window.fillGewerbeakteForm = function(data) {
        console.log('🔧 Global fillGewerbeakteForm called via DragDropGewerbeakte');
        const handler = new DragDropGewerbeakte();
        return handler.fillForm(data);
    };
    
    console.log('🎯 DragDropGewerbeakte v5.0 ready - Full Mitarbeiter support');
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DragDropGewerbeakte };
}