// ===================================
// KORRIGIERTE PERSONENPRÜFUNGSAKTE IMPORT.JS - OHNE ENDLOSSCHLEIFE
// Ersetze die bestehende public/assets/js/pages/personenpruefung/import.js
// ===================================

// Toggle Import Section (erweiterte Version)
function toggleImport() {
    const content = document.getElementById('import-content');
    const toggle = document.getElementById('import-toggle');
    const header = document.querySelector('.import-header');

    content.classList.toggle('expanded');
    toggle.classList.toggle('expanded');
    header.classList.toggle('expanded');
}

// Import Akte Function mit korrigierter Validierung
function importAkte() {
    const importText = document.getElementById('import-text').value.trim();

    if (!importText) {
        alert('📋 Bitte fügen Sie zuerst eine Personenprüfungsakte zum Importieren ein!');
        return;
    }

    try {
        console.log('🔄 importAkte called with text:', importText.substring(0, 200) + '...');
        
        // KORRIGIERTE VALIDIERUNG: Flexiblere Prüfung
        if (!isPersonenprüfungsakte(importText)) {
            console.log('❌ isPersonenprüfungsakte validation failed');
            showPersonenprüfungImportErrorPopup();
            return;
        }

        console.log('✅ isPersonenprüfungsakte validation passed');

        // Parse the imported text - DIREKT ohne Original-Aufruf
        const parsedData = parsePersonenprüfungsakteTextDirect(importText);
        console.log('📊 Parsed data:', JSON.stringify(parsedData, null, 2));

        if (parsedData && validateImportData(parsedData)) {
            console.log('✅ validateImportData passed');
            
            // Fill form with parsed data - DIREKT ohne Original-Aufruf
            fillPersonenprüfungsakteFormDirect(parsedData);

            // Clear import field
            document.getElementById('import-text').value = '';

            // Button-Status nach dem Leeren aktualisieren
            checkImportText();

            // Show success message
            showImportSuccessPopup();

            // Import-Bereich automatisch zuklappen nach 1.5 Sekunden
            setTimeout(() => {
                toggleImport();
            }, 1500);

        } else {
            console.log('❌ validateImportData failed, parsedData:', parsedData);
            showPersonenprüfungImportErrorPopup();
        }
    } catch (error) {
        console.error('❌ Import error:', error);
        showPersonenprüfungImportErrorPopup();
    }
}

// KORRIGIERTE VALIDIERUNG - Flexibel für Code-Blöcke UND Plain-Text
function isPersonenprüfungsakte(text) {
    console.log('🔍 Checking if text is Personenprüfungsakte...');
    
    // Flexiblere Feldprüfung - mit UND ohne Code-Blöcke
    const hasPersonField = /Zu überprüfende Person:/i.test(text);
    const hasTelegramField = /Telegramm/i.test(text);
    const hasPrueferField = /Geprüft durch:/i.test(text);
    const hasDateField = /Geprüft am:/i.test(text);
    const hasResultField = /Prüfungsergebnis:/i.test(text);

    // Mindestens 3 von 5 Feldern müssen vorhanden sein (flexibler)
    const fieldCount = [hasPersonField, hasTelegramField, hasPrueferField, hasDateField, hasResultField]
        .filter(Boolean).length;

    // Ausschließende Kriterien für Gewerbeakte
    const isNotGewerbeakte = !text.includes('Lizenznummer:') &&
        !text.includes('Mitarbeiter (*Nur Inhaber') &&
        !text.includes('Anzahl der herausgebenden Lizenzen') &&
        !text.includes('Sondergenehmigung:');

    // Ausschließende Kriterien für Anträge
    const isNotAntrag = !text.includes('Antragstellende Person:') ||
        (text.includes('Zu überprüfende Person:') && text.includes('Prüfungsergebnis:'));

    console.log(`📊 Field validation:`, {
        hasPersonField,
        hasTelegramField, 
        hasPrueferField,
        hasDateField,
        hasResultField,
        fieldCount,
        isNotGewerbeakte,
        isNotAntrag
    });

    console.log(`Field count: ${fieldCount}/5, Is not Gewerbeakte: ${isNotGewerbeakte}, Is not Antrag: ${isNotAntrag}`);
    
    return fieldCount >= 3 && isNotGewerbeakte && isNotAntrag;
}

// KORRIGIERTE DATEN-VALIDIERUNG - Weniger restriktiv
function validateImportData(data) {
    console.log('🔍 Validating import data:', JSON.stringify(data, null, 2));
    
    if (!data || typeof data !== 'object') {
        console.log('❌ Data is not an object');
        return false;
    }

    // Mindestens 2 der wichtigen Eigenschaften müssen vorhanden sein
    const fields = [data.person, data.telegram, data.pruefer, data.ergebnisType, data.ergebnis];
    const filledFields = fields.filter(Boolean).length;
    const hasBasicData = filledFields >= 2;

    console.log(`📊 Validation result:`, {
        person: !!data.person,
        telegram: !!data.telegram,
        pruefer: !!data.pruefer,
        ergebnisType: !!data.ergebnisType,
        ergebnis: !!data.ergebnis,
        filledFields,
        hasBasicData
    });

    return hasBasicData;
}

// DIREKTE Parse Funktion - KEINE Endlosschleife
function parsePersonenprüfungsakteTextDirect(text) {
    console.log('🔄 parsePersonenprüfungsakteTextDirect called');
    
    const data = {};

    try {
        console.log('🔄 Using direct parsing logic...');
        
        // Extract data with flexible patterns (mit UND ohne Code-Blöcke)
        const patterns = {
            person: [
                /Zu überprüfende Person:\s*```\s*([^`]+?)\s*```/i,
                /Zu überprüfende Person:\s*([^\n]+)/i
            ],
            telegram: [
                /Telegramm.*?:\s*```\s*([^`]+?)\s*```/i,
                /Telegramm.*?:\s*([^\n]+)/i
            ],
            pruefer: [
                /Geprüft durch:\s*```\s*([^`]+?)\s*```/i,
                /Geprüft durch:\s*([^\n]+)/i
            ],
            datum: [
                /Geprüft am:\s*```\s*([^`]+?)\s*```/i,
                /Geprüft am:\s*([^\n]+)/i
            ],
            ergebnis: [
                /Prüfungsergebnis:\s*```\s*([^`]+?)\s*```/is,
                /Prüfungsergebnis:\s*([^```]+?)(?=\n\n|\n[A-ZÄÖÜ]|$)/is
            ]
        };

        // Extract each field using flexible patterns
        for (const [key, patternArray] of Object.entries(patterns)) {
            for (const pattern of patternArray) {
                const match = text.match(pattern);
                if (match && match[1] && match[1].trim() !== '---') {
                    data[key] = match[1].trim();
                    console.log(`✅ Found ${key}:`, data[key]);
                    break;
                }
            }
        }

        // Parse result and details separately
        if (data.ergebnis) {
            const ergebnisLines = data.ergebnis.split('\n');
            data.ergebnisType = ergebnisLines[0].trim();

            // Extract details if present
            const detailsIndex = data.ergebnis.indexOf('Detaillierte Bewertung:');
            if (detailsIndex !== -1) {
                data.details = data.ergebnis.substring(detailsIndex + 'Detaillierte Bewertung:'.length).trim();
            } else {
                // Look for details in subsequent lines
                if (ergebnisLines.length > 1) {
                    const possibleDetails = ergebnisLines.slice(1).join('\n').trim();
                    if (possibleDetails && !possibleDetails.includes('```')) {
                        data.details = possibleDetails;
                    }
                }
            }

            console.log(`✅ Parsed ergebnisType:`, data.ergebnisType);
            if (data.details) {
                console.log(`✅ Parsed details:`, data.details);
            }
        }

        console.log(`📊 Final direct parse result:`, JSON.stringify(data, null, 2));
        return data;

    } catch (error) {
        console.error(`❌ Direct parse error:`, error);
        return null;
    }
}

// DIREKTE Form-Filling Funktion - KEINE Endlosschleife
function fillPersonenprüfungsakteFormDirect(data) {
    console.log('🔄 fillPersonenprüfungsakteFormDirect called with data:', JSON.stringify(data, null, 2));
    
    try {
        // Fill basic fields
        if (data.person) {
            const personField = document.getElementById('person');
            if (personField) {
                personField.value = data.person;
                personField.dispatchEvent(new Event('input', { bubbles: true }));
                personField.dispatchEvent(new Event('change', { bubbles: true }));
                console.log(`✅ Filled person: "${data.person}"`);
            } else {
                console.error('❌ Person field not found');
            }
        }
        
        if (data.telegram) {
            const telegramField = document.getElementById('telegram');
            if (telegramField) {
                telegramField.value = data.telegram;
                telegramField.dispatchEvent(new Event('input', { bubbles: true }));
                telegramField.dispatchEvent(new Event('change', { bubbles: true }));
                console.log(`✅ Filled telegram: "${data.telegram}"`);
            } else {
                console.error('❌ Telegram field not found');
            }
        }
        
        if (data.pruefer) {
            const prueferField = document.getElementById('pruefer');
            if (prueferField) {
                prueferField.value = data.pruefer;
                prueferField.dispatchEvent(new Event('input', { bubbles: true }));
                prueferField.dispatchEvent(new Event('change', { bubbles: true }));
                console.log(`✅ Filled pruefer: "${data.pruefer}"`);
            } else {
                console.error('❌ Pruefer field not found');
            }
        }
        
        if (data.details) {
            const detailsField = document.getElementById('details');
            if (detailsField) {
                detailsField.value = data.details;
                detailsField.dispatchEvent(new Event('input', { bubbles: true }));
                detailsField.dispatchEvent(new Event('change', { bubbles: true }));
                console.log(`✅ Filled details: "${data.details}"`);
            } else {
                console.error('❌ Details field not found');
            }
        }

        // WICHTIG: Datum auf aktuelles Datum setzen (mit Jahr 1899) - Override imported date
        const today = new Date();
        const currentMonth = String(today.getMonth() + 1).padStart(2, '0');
        const currentDay = String(today.getDate()).padStart(2, '0');
        const datumField = document.getElementById('datum');
        if (datumField) {
            datumField.value = `1899-${currentMonth}-${currentDay}`;
            console.log(`✅ Set datum to current date: 1899-${currentMonth}-${currentDay}`);
        } else {
            console.error('❌ Datum field not found');
        }

        // Set result radio button with extensive debugging
        if (data.ergebnisType || data.ergebnis) {
            const ergebnisToCheck = data.ergebnisType || data.ergebnis;
            console.log(`🎯 Setting radio button for: "${ergebnisToCheck}"`);
            
            // Debug: Check what radio buttons exist
            const allRadios = document.querySelectorAll('input[type="radio"]');
            console.log(`📊 Found ${allRadios.length} radio buttons in DOM:`, Array.from(allRadios).map(r => r.id));
            
            let resultValue = '';
            const lowerType = ergebnisToCheck.toLowerCase();
            
            if (ergebnisToCheck.includes('✅') || lowerType.includes('bestanden')) {
                resultValue = 'bestanden';
            } else if (ergebnisToCheck.includes('❌') || lowerType.includes('nicht bestanden')) {
                resultValue = 'nicht-bestanden';
            } else if (ergebnisToCheck.includes('⏳') || lowerType.includes('ausstehend')) {
                resultValue = 'ausstehend';
            }

            console.log(`🎯 Determined result value: "${resultValue}"`);

            if (resultValue) {
                // Clear all selections first
                const allRadioGroups = document.querySelectorAll('.radio-group');
                console.log(`📊 Found ${allRadioGroups.length} radio groups`);
                allRadioGroups.forEach(group => {
                    group.classList.remove('selected');
                });

                // Set the correct selection
                const targetRadio = document.getElementById(resultValue);
                if (targetRadio) {
                    targetRadio.checked = true;
                    const radioGroup = targetRadio.closest('.radio-group');
                    if (radioGroup) {
                        radioGroup.classList.add('selected');
                        console.log(`✅ Successfully set radio button and group for: "${resultValue}"`);
                    } else {
                        console.error(`❌ Radio group not found for radio: "${resultValue}"`);
                    }
                    
                    // Trigger change event
                    targetRadio.dispatchEvent(new Event('change', { bubbles: true }));
                } else {
                    console.error(`❌ Radio button not found for: "${resultValue}"`);
                    console.log(`📊 Available radio button IDs:`, Array.from(allRadios).map(r => r.id));
                }
            } else {
                console.error(`❌ Could not determine result value from: "${ergebnisToCheck}"`);
            }
        }
        
        console.log('✅ Direct form filling completed successfully');
        
    } catch (error) {
        console.error('❌ Error in direct form filling:', error);
    }
}

// GLOBALE Funktionen für DragDrop-Kompatibilität - OHNE Endlosschleife
function parsePersonenprüfungsakteText(text) {
    console.log('🔄 parsePersonenprüfungsakteText called (global)');
    // Verwende IMMER die direkte Funktion, um Endlosschleifen zu vermeiden
    return parsePersonenprüfungsakteTextDirect(text);
}

function fillPersonenprüfungsakteForm(data) {
    console.log('🔄 fillPersonenprüfungsakteForm called (global)');
    // Verwende IMMER die direkte Funktion, um Endlosschleifen zu vermeiden
    return fillPersonenprüfungsakteFormDirect(data);
}

// Show Import Success Popup für Personenprüfungsakte
function showImportSuccessPopup() {
    const popup = document.getElementById('popup-overlay');
    const title = document.getElementById('popup-title');
    const icon = document.getElementById('popup-icon');
    const message = document.getElementById('popup-message');
    const buttons = document.getElementById('popup-buttons');

    if (!popup || !title || !icon || !message || !buttons) {
        alert('✅ Personenprüfungsakte erfolgreich importiert!\n\n📅 Datum wurde auf heute aktualisiert');
        return;
    }

    title.textContent = '✅ Personenprüfungsakte erfolgreich importiert!';
    icon.textContent = '📥';
    message.innerHTML = `
        <span class="popup-success">Die Personenprüfungsakte wurde erfolgreich geladen!</span><br>
        <strong>📅 Datum wurde auf heute aktualisiert</strong><br><br>
        Sie können jetzt die Daten bearbeiten und eine aktualisierte Version generieren.
    `;

    popup.classList.add('active');
}

// Show Import Error Popup für Personenprüfungsakte
function showPersonenprüfungImportErrorPopup() {
    const popup = document.getElementById('popup-overlay');
    const title = document.getElementById('popup-title');
    const icon = document.getElementById('popup-icon');
    const message = document.getElementById('popup-message');
    const buttons = document.getElementById('popup-buttons');

    if (!popup || !title || !icon || !message || !buttons) {
        alert('⚠️ Import fehlgeschlagen!\n\nDie Personenprüfungsakte konnte nicht importiert werden.\nBitte stellen Sie sicher, dass Sie eine vollständige Personenprüfungsakte aus Discord kopiert haben.');
        return;
    }

    title.textContent = '⚠️ Import fehlgeschlagen';
    icon.textContent = '❌';
    message.innerHTML = `
        <span style="color: #FF8232;">Die Personenprüfungsakte konnte nicht importiert werden!</span><br>
        Bitte stellen Sie sicher, dass Sie eine vollständige Personenprüfungsakte aus Discord kopiert haben.<br><br>
        <strong>Erforderliches Format:</strong><br>
        • Zu überprüfende Person: (mit oder ohne Code-Blöcke)<br>
        • Telegrammnummer (Für Rückfragen): <br>
        • Geprüft durch: <br>
        • Geprüft am: <br>
        • Prüfungsergebnis: <br><br>
        <small style="color: #D8C5B0;">💡 Das System erkennt jetzt sowohl Code-Blöcke (\`\`\`) als auch Plain-Text-Format.</small>
    `;

    popup.classList.add('active');
}

// Check Import Text and Update Button State
function checkImportText() {
    const importText = document.getElementById('import-text').value.trim();
    const importButton = document.getElementById('import-button');

    if (importButton) {
        if (importText.length > 0) {
            importButton.disabled = false;
            importButton.innerHTML = '<i class="fa-solid fa-file-import"></i> Akte importieren';
        } else {
            importButton.disabled = true;
            importButton.innerHTML = '<i class="fa-solid fa-circle-info"></i> Akte eingeben zum Importieren';
        }
    }
}

// Initialize Import Button State
function initializeImportButton() {
    const importTextarea = document.getElementById('import-text');
    const importButton = document.getElementById('import-button');

    if (!importTextarea || !importButton) {
        console.log('⚠️ Import elements not found during initialization');
        return;
    }

    // Set initial state
    importButton.disabled = true;
    importButton.innerHTML = '<i class="fa-solid fa-circle-info"></i> Akte eingeben zum Importieren';

    // Add event listeners
    importTextarea.addEventListener('input', checkImportText);
    importTextarea.addEventListener('paste', function() {
        // Delay check to allow paste to complete
        setTimeout(checkImportText, 100);
    });
    importTextarea.addEventListener('keyup', checkImportText);
    
    console.log('✅ Import button initialized successfully');
}

// Call initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeImportButton();
    console.log('✅ Personenprüfungsakte import.js loaded successfully - NO LOOPS');
});