// ===================================
// PERSONENPRÜFUNGSAKTE IMPORT LOGIC - MIT TOAST SYSTEM
// Separate JavaScript-Datei für Import-Funktionen
// KORRIGIERTE VERSION - Beste Option
// ===================================

// Toggle Import Section (erweiterte Version)
function toggleImport() {
    const content = document.getElementById('import-content');
    const toggle = document.getElementById('import-toggle');
    const header = document.querySelector('.import-header');
    
    content.classList.toggle('expanded');
    toggle.classList.toggle('expanded');
    header.classList.toggle('expanded'); // Header-Klasse hinzufügen/entfernen
}

// Import Akte Function mit Validierung - MIT TOAST SYSTEM
function importAkte() {
    const importText = document.getElementById('import-text').value.trim();
    
    if (!importText) {
        Toast.warning('📋 Import-Feld leer', 'Bitte fügen Sie zuerst eine Personenprüfungsakte zum Importieren ein!');
        return;
    }
    
    try {
        // VALIDIERUNG: Prüfen ob es eine Personenprüfungsakte ist
        if (!isPersonenprüfungsakte(importText)) {
            showPersonenprüfungImportErrorPopup();
            return;
        }
        
        // Parse the imported text
        const parsedData = parsePersonenprüfungsakteText(importText);
        
        if (parsedData && validateImportData(parsedData)) {
            // Fill form with parsed data
            fillPersonenprüfungsakteForm(parsedData);
            
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
            showPersonenprüfungImportErrorPopup();
        }
    } catch (error) {
        console.error('Import error:', error);
        showPersonenprüfungImportErrorPopup();
    }
}

// Prüfen ob es sich um eine Personenprüfungsakte handelt (korrigiert)
function isPersonenprüfungsakte(text) {
    // Grundlegende Struktur prüfen
    const hasPersonField = /Zu überprüfende Person:\s*```/i.test(text);
    const hasTelegramField = /Telegramm/i.test(text) && /```/g.test(text);
    const hasPrueferField = /Geprüft durch:\s*```/i.test(text);
    const hasDateField = /Geprüft am:\s*```/i.test(text);
    const hasResultField = /Prüfungsergebnis:\s*```/i.test(text);
    // Optional: Details-Feld kann vorhanden sein, muss aber nicht
    const hasDetailsField = /Detaillierte Bewertung\/Anmerkungen:\s*```/i.test(text);
    
    // Mindestens 4 von 5 Grundfeldern müssen vorhanden sein
    const fieldCount = [hasPersonField, hasTelegramField, hasPrueferField, hasDateField, hasResultField]
        .filter(Boolean).length;
    
    // Ausschließende Kriterien für Gewerbeakte
    const isNotGewerbeakte = !text.includes('Lizenznummer:') && 
                            !text.includes('Mitarbeiter (*Nur Inhaber') &&
                            !text.includes('Anzahl der herausgebenden Lizenzen') &&
                            !text.includes('Sondergenehmigung:');
    
    console.log(`Field count: ${fieldCount}/5, Has details: ${hasDetailsField}, Is not Gewerbeakte: ${isNotGewerbeakte}`);
    return fieldCount >= 4 && isNotGewerbeakte;
}

// Validierung der importierten Daten
function validateImportData(data) {
    if (!data || typeof data !== 'object') {
        return false;
    }
    
    // Mindestens eine der wichtigen Eigenschaften muss vorhanden sein
    const hasBasicData = data.person || data.telegram || data.pruefer || data.ergebnisType;
    
    return hasBasicData;
}

// Parse Personenprüfungsakte Text (korrigiert für separates Details-Feld)
function parsePersonenprüfungsakteText(text) {
    const data = {};
    
    try {
        // Extract data between ``` blocks - mit separatem Details-Feld
        const patterns = {
            person: /Zu überprüfende Person:\s*```\s*([^`]+?)\s*```/i,
            telegram: /Telegramm.*?:\s*```\s*([^`]+?)\s*```/i, // Flexibler
            pruefer: /Geprüft durch:\s*```\s*([^`]+?)\s*```/i,
            datum: /Geprüft am:\s*```\s*([^`]+?)\s*```/i,
            ergebnis: /Prüfungsergebnis:\s*```\s*([^`]+?)\s*```/i, // Nur das Ergebnis
            details: /Detaillierte Bewertung\/Anmerkungen:\s*```\s*([^`]+?)\s*```/i // Separates Details-Feld
        };
        
        // Extract each field
        for (const [key, pattern] of Object.entries(patterns)) {
            const match = text.match(pattern);
            if (match && match[1] && match[1].trim() !== '---') {
                data[key] = match[1].trim();
                console.log(`Found ${key}: ${data[key]}`); // Debug
            }
        }
        
        // Setze ergebnisType für die Radio-Button-Logik
        if (data.ergebnis) {
            data.ergebnisType = data.ergebnis.trim();
        }
        
        console.log('Parsed data:', data); // Debug
        return data;
    } catch (error) {
        console.error('Parse error:', error);
        return null;
    }
}

// Fill Personenprüfungsakte Form (KORRIGIERT - Beste Option)
function fillPersonenprüfungsakteForm(data) {
    console.log(`🔧 Filling form with data:`, data); // Debug
    
    // Fill basic fields
    if (data.person) document.getElementById('person').value = data.person;
    if (data.telegram) document.getElementById('telegram').value = data.telegram;
    if (data.pruefer) document.getElementById('pruefer').value = data.pruefer;
    if (data.details) document.getElementById('details').value = data.details;
    
    // WICHTIG: Datum auf aktuelles Datum setzen (mit Jahr 1899) - Override imported date
    const today = new Date();
    const currentMonth = String(today.getMonth() + 1).padStart(2, '0');
    const currentDay = String(today.getDate()).padStart(2, '0');
    document.getElementById('datum').value = `1899-${currentMonth}-${currentDay}`;
    console.log(`📅 Set datum to: 1899-${currentMonth}-${currentDay}`);
    
    // Set result radio button - PRÄZISE VERSION (KORRIGIERT)
    if (data.ergebnisType) {
        let resultValue = '';
        const cleanType = data.ergebnisType.toLowerCase().trim();
        
        console.log(`🎯 Processing ergebnisType: "${data.ergebnisType}" -> cleaned: "${cleanType}"`);
        
        // Präzise Erkennung - RICHTIGE REIHENFOLGE!
        if (data.ergebnisType.includes('❌') || 
            cleanType === 'nicht bestanden' || 
            cleanType.startsWith('nicht bestanden') ||
            cleanType.includes('nicht bestanden')) {
            resultValue = 'nicht-bestanden';
            console.log(`✅ Detected: NICHT BESTANDEN`);
        } else if (data.ergebnisType.includes('✅') || 
                  cleanType === 'bestanden' || 
                  (cleanType.includes('bestanden') && !cleanType.includes('nicht'))) {
            resultValue = 'bestanden';
            console.log(`✅ Detected: BESTANDEN`);
        } else if (data.ergebnisType.includes('⏳') || 
                  cleanType.includes('ausstehend') ||
                  cleanType.includes('prüfung ausstehend')) {
            resultValue = 'ausstehend';
            console.log(`✅ Detected: AUSSTEHEND`);
        }
        
        console.log(`🎯 Final resultValue: "${resultValue}"`);
        
        if (resultValue) {
            // Clear all selections first
            document.querySelectorAll('.radio-group').forEach(group => {
                group.classList.remove('selected');
            });
            
            // Set the correct selection
            const targetRadio = document.getElementById(resultValue);
            if (targetRadio) {
                targetRadio.checked = true;
                const radioGroup = targetRadio.closest('.radio-group');
                if (radioGroup) {
                    radioGroup.classList.add('selected');
                    console.log(`✅ Successfully set radio button: ${resultValue} and selected group`);
                } else {
                    console.error(`❌ Radio group not found for: ${resultValue}`);
                }
            } else {
                console.error(`❌ Radio button not found for: ${resultValue}`);
                // Debug: Show all available radio buttons
                const allRadios = document.querySelectorAll('input[type="radio"]');
                console.log(`📊 Available radio buttons:`, Array.from(allRadios).map(r => r.id));
            }
        } else {
            console.warn(`⚠️ Could not determine result value from: "${data.ergebnisType}"`);
        }
    }
    
    console.log(`✅ Form filling completed successfully`);
}

// Show Import Success Popup für Personenprüfungsakte - ERSETZT MIT TOAST
function showImportSuccessPopup() {
    Toast.importSuccess('Personenprüfungsakte');
}

// Show Import Error Popup für Personenprüfungsakte - ERSETZT MIT TOAST
function showPersonenprüfungImportErrorPopup() {
    Toast.importError(
        'Personenprüfungsakte',
        'Bitte stellen Sie sicher, dass Sie eine vollständige Personenprüfungsakte aus Discord kopiert haben.'
    );
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

    if (importTextarea && importButton) {
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
    }
}

// Debug function to test import parsing
function testImportParsing(testText) {
    console.log('🧪 Testing import parsing with text:', testText);
    const result = parsePersonenprüfungsakteText(testText);
    console.log('🧪 Parse result:', result);
    return result;
}

// Debug function to test specific ergebnis values
function testErgebnisDetection() {
    const testCases = [
        '✅ Bestanden',
        '❌ Nicht bestanden', 
        '⏳ Prüfung ausstehend',
        'Bestanden',
        'Nicht bestanden',
        'Prüfung ausstehend'
    ];
    
    console.log('🧪 Testing Ergebnis Detection:');
    testCases.forEach(testCase => {
        const data = { ergebnisType: testCase };
        const cleanType = testCase.toLowerCase().trim();
        
        let resultValue = '';
        if (testCase.includes('❌') || 
            cleanType === 'nicht bestanden' || 
            cleanType.startsWith('nicht bestanden') ||
            cleanType.includes('nicht bestanden')) {
            resultValue = 'nicht-bestanden';
        } else if (testCase.includes('✅') || 
                  cleanType === 'bestanden' || 
                  (cleanType.includes('bestanden') && !cleanType.includes('nicht'))) {
            resultValue = 'bestanden';
        } else if (testCase.includes('⏳') || 
                  cleanType.includes('ausstehend')) {
            resultValue = 'ausstehend';
        }
        
        console.log(`🎯 "${testCase}" -> "${resultValue}"`);
    });
}

// Export functions for external use (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        toggleImport,
        importAkte,
        parsePersonenprüfungsakteText,
        fillPersonenprüfungsakteForm,
        showImportSuccessPopup,
        showPersonenprüfungImportErrorPopup,
        validateImportData,
        testImportParsing,
        testErgebnisDetection
    };
}

// Initialize import functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // Add event listeners if elements exist
    const importTextarea = document.getElementById('import-text');
    if (importTextarea) {
        // Add placeholder text and styling
        importTextarea.placeholder = `Kopieren Sie hier die komplette Akte aus Discord ein...`;
    }
    
    // Initialize import button
    initializeImportButton();
});