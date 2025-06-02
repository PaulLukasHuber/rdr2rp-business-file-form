// ===================================
// ANTRAG IMPORT LOGIC - MIT TOAST SYSTEM
// Löst das toggleImport Problem und ersetzt Popups mit Toasts
// ===================================

// Toggle Import Section - SOFORT DEFINIERT
function toggleImport() {
    console.log('🔄 toggleImport called');
    
    const content = document.getElementById('import-content');
    const toggle = document.getElementById('import-toggle');
    const header = document.getElementById('import-header');

    if (!content || !toggle || !header) {
        console.error('❌ Import elements not found:', {
            content: !!content,
            toggle: !!toggle, 
            header: !!header
        });
        return;
    }

    content.classList.toggle('expanded');
    toggle.classList.toggle('expanded');
    header.classList.toggle('expanded');
    
    console.log('✅ toggleImport completed');
}

// Main Import Function - MIT TOAST SYSTEM
function importAntrag() {
    console.log('🚀 importAntrag called with Toast system');
    
    const importText = document.getElementById('import-text');
    if (!importText) {
        console.error('❌ import-text element not found');
        Toast.error('❌ Fehler', 'Import-Textfeld nicht gefunden');
        return;
    }

    const textValue = importText.value.trim();
    if (!textValue) {
        Toast.warning('📋 Import-Feld leer', 'Bitte fügen Sie zuerst einen Antrag zum Importieren ein!');
        return;
    }

    try {
        console.log('🚀 Starting backward compatible import process...');
        
        // Parse the imported text
        const parsedData = parseAntragText(textValue);

        if (parsedData && parsedData.type) {
            console.log('✅ Parse successful, filling form...');
            
            // Fill form with parsed data
            fillAntragForm(parsedData);

            // Clear import field
            importText.value = '';

            // Show success message mit Toast
            showAntragImportSuccessPopup();

            // Auto-collapse import section
            setTimeout(() => {
                toggleImport();
            }, 1000);
        } else {
            console.log('❌ Parse failed, showing error toast');
            showAntragImportErrorPopup();
        }
    } catch (error) {
        console.error('❌ Import error:', error);
        showAntragImportErrorPopup();
    }
}

// Stelle sicher, dass Funktionen global verfügbar sind
window.toggleImport = toggleImport;
window.importAntrag = importAntrag;

// ===================================
// VOLLSTÄNDIGE IMPORT LOGIC
// ===================================

// SPEZIELLE GEWERBE-EXTRAKTION für Gewerbekutsche (unterstützt beide Formate)
function extractGewerbeForGewerbekutsche(text) {
    console.log(`\n🎯 === SPECIAL GEWERBE EXTRACTION FOR GEWERBEKUTSCHE ===`);
    
    // Erst das neue Format versuchen: "Für Gewerbe:"
    console.log(`🔍 Trying NEW format "Für Gewerbe:"...`);
    const newFormatResult = extractField(text, 'Für Gewerbe');
    if (newFormatResult) {
        console.log(`✅ Found with NEW format "Für Gewerbe:": "${newFormatResult}"`);
        return newFormatResult;
    }
    
    // Dann das alte Format versuchen: "Gewerbe:"
    console.log(`🔍 Trying OLD format "Gewerbe:"...`);
    const oldFormatResult = extractField(text, 'Gewerbe');
    if (oldFormatResult) {
        console.log(`✅ Found with OLD format "Gewerbe:": "${oldFormatResult}"`);
        return oldFormatResult;
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
                    !nextLine.includes(':') &&
                    nextLine.length > 1) {
                    console.log(`✅ Found gewerbe value at line ${j}: "${nextLine}"`);
                    return nextLine;
                }
            }
        }
    }
    
    console.log(`❌ Gewerbe field not found in any format`);
    return null;
}

// RÜCKWÄRTSKOMPATIBLE parseAntragText
function parseAntragText(text) {
    console.log(`\n🚀 === STARTING ANTRAG PARSING (BACKWARD COMPATIBLE) ===`);
    console.log(`📄 Text length: ${text.length} characters`);

    const data = {};

    try {
        // Detect antrag type from content
        if (text.includes('Gewerbekonzept:')) {
            data.type = 'gewerbeantrag';
        } else if (text.includes('Kutschen Größe:') || text.includes('Genehmigungs-Nummer:')) {
            data.type = 'gewerbekutsche';
        } else if (text.includes('Gewünschte Gewerbetelegrammnummer:')) {
            data.type = 'gewerbetelegramm';
        } else if (text.includes('Für Gewerbe:') && !text.includes('Gewerbekonzept:')) {
            data.type = 'gewerbeauslage';
        } else {
            console.log('❌ Could not detect Antrag type');
            return null;
        }

        console.log(`✅ Detected Antrag type: ${data.type}`);

        // SPEZIELLE BEHANDLUNG FÜR GEWERBEKUTSCHE
        if (data.type === 'gewerbekutsche') {
            console.log(`🎯 === GEWERBEKUTSCHE DETECTED - BACKWARD COMPATIBLE PROCESSING ===`);
            
            // Standard-Felder extrahieren
            data.nummer = extractField(text, 'Genehmigungs-Nummer');
            data.aussteller = extractField(text, 'Ausstellende Person');
            data.telegram = extractField(text, 'Telegrammnummer (Für Rückfragen)');
            data.person = extractField(text, 'Antragstellende Person');
            data.groesse = extractField(text, 'Kutschen Größe');
            
            // SPEZIELLE GEWERBE-EXTRAKTION (unterstützt beide Formate)
            data.gewerbe = extractGewerbeForGewerbekutsche(text);
            
            console.log(`🎯 GEWERBEKUTSCHE extracted data:`, JSON.stringify(data, null, 2));
        } else {
            // Standard-Extraktion für andere Antragstypen
            const fieldMappings = getFieldMappings(data.type);
            
            for (const [key, fieldName] of Object.entries(fieldMappings)) {
                const value = extractField(text, fieldName);
                if (value) {
                    data[key] = value;
                }
            }
        }

        // Special handling for Gewerbetelegramm payment status
        if (data.type === 'gewerbetelegramm' && data.bezahlt) {
            data.bezahltStatus = data.bezahlt.toLowerCase().includes('ja');
            data.ausstehendeStatus = data.bezahlt.toLowerCase().includes('ausstehend') || data.bezahlt.toLowerCase().includes('nein');
        }

        return data;

    } catch (error) {
        console.error('❌ Parse error:', error);
        return null;
    }
}

// Field Mappings
function getFieldMappings(type) {
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

// Standard extractField Funktion
function extractField(text, fieldName) {
    const escapedFieldName = escapeRegex(fieldName);
    const codeBlockPattern = new RegExp(`${escapedFieldName}:\\s*\`\`\`\\s*([^\`]+?)\\s*\`\`\``, 'i');
    
    let match = text.match(codeBlockPattern);
    
    if (match && match[1] && match[1].trim() !== '---') {
        return match[1].trim();
    }
    
    return null;
}

function escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Fill Antrag Form
function fillAntragForm(data) {
    console.log('🎯 Filling form with data:', data);

    const antragTypeSelect = document.getElementById('antrag-type');
    if (antragTypeSelect) {
        antragTypeSelect.value = data.type;
        antragTypeSelect.dispatchEvent(new Event('change'));
        
        if (typeof switchAntragType === 'function') {
            switchAntragType();
        }
    }

    setTimeout(() => {
        switch (data.type) {
            case 'gewerbeantrag':
                if (data.person) document.getElementById('gewerbeantrag-person').value = data.person;
                if (data.gewerbe) document.getElementById('gewerbeantrag-gewerbe').value = data.gewerbe;
                if (data.telegram) document.getElementById('gewerbeantrag-telegram').value = data.telegram;
                if (data.konzept) document.getElementById('gewerbeantrag-konzept').value = data.konzept;
                break;

            case 'gewerbeauslage':
                if (data.person) document.getElementById('gewerbeauslage-person').value = data.person;
                if (data.telegram) document.getElementById('gewerbeauslage-telegram').value = data.telegram;
                if (data.gewerbe) document.getElementById('gewerbeauslage-gewerbe').value = data.gewerbe;
                break;

            case 'gewerbekutsche':
                if (data.nummer) document.getElementById('gewerbekutsche-nummer').value = data.nummer;
                if (data.aussteller) document.getElementById('gewerbekutsche-aussteller').value = data.aussteller;
                if (data.telegram) document.getElementById('gewerbekutsche-aussteller-telegram').value = data.telegram;
                if (data.person) document.getElementById('gewerbekutsche-person').value = data.person;
                if (data.gewerbe) document.getElementById('gewerbekutsche-gewerbe').value = data.gewerbe;
                if (data.groesse) document.getElementById('gewerbekutsche-groesse').value = data.groesse;
                break;

            case 'gewerbetelegramm':
                if (data.person) document.getElementById('gewerbetelegramm-person').value = data.person;
                if (data.gewerbe) document.getElementById('gewerbetelegramm-gewerbe').value = data.gewerbe;
                if (data.telegram) document.getElementById('gewerbetelegramm-telegram').value = data.telegram;
                if (data.wunsch) document.getElementById('gewerbetelegramm-wunsch').value = data.wunsch;

                if (data.bezahltStatus) {
                    document.getElementById('gewerbetelegramm-bezahlt').checked = true;
                    document.getElementById('gewerbetelegramm-ausstehend').checked = false;
                } else if (data.ausstehendeStatus) {
                    document.getElementById('gewerbetelegramm-ausstehend').checked = true;
                    document.getElementById('gewerbetelegramm-bezahlt').checked = false;
                }
                break;
        }
    }, 200);
}

// Show Success Popup - ERSETZT MIT TOAST
function showAntragImportSuccessPopup() {
    Toast.importSuccess('Antrag');
}

// Show Error Popup - ERSETZT MIT TOAST
function showAntragImportErrorPopup() {
    Toast.importError(
        'Antrag',
        'Bitte stellen Sie sicher, dass Sie einen vollständigen Antrag aus Discord kopiert haben.'
    );
}

// Check Import Text
function checkImportText() {
    const importText = document.getElementById('import-text');
    const importButton = document.getElementById('import-button');

    if (importButton && importText) {
        if (importText.value.trim().length > 0) {
            importButton.disabled = false;
            importButton.innerHTML = '<i class="fa-solid fa-file-import"></i> Antrag importieren';
        } else {
            importButton.disabled = true;
            importButton.innerHTML = '<i class="fa-solid fa-circle-info"></i> Antrag eingeben zum Importieren';
        }
    }
}

// Initialize Import Button
function initializeImportButton() {
    const importTextarea = document.getElementById('import-text');
    const importButton = document.getElementById('import-button');

    if (importTextarea && importButton) {
        importButton.disabled = true;
        importButton.innerHTML = '<i class="fa-solid fa-circle-info"></i> Antrag eingeben zum Importieren';

        importTextarea.addEventListener('input', checkImportText);
        importTextarea.addEventListener('paste', function() {
            setTimeout(checkImportText, 100);
        });
        importTextarea.addEventListener('keyup', checkImportText);
    }
}

// STELLE ALLE FUNKTIONEN GLOBAL BEREIT
window.toggleImport = toggleImport;
window.importAntrag = importAntrag;
window.parseAntragText = parseAntragText;
window.fillAntragForm = fillAntragForm;
window.extractGewerbeForGewerbekutsche = extractGewerbeForGewerbekutsche;
window.showAntragImportSuccessPopup = showAntragImportSuccessPopup;
window.showAntragImportErrorPopup = showAntragImportErrorPopup;
window.checkImportText = checkImportText;
window.initializeImportButton = initializeImportButton;

// SOFORTIGE INITIALISIERUNG
document.addEventListener('DOMContentLoaded', function() {
    initializeImportButton();
});

// FALLBACK: Auch ohne DOMContentLoaded initialisieren
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeImportButton);
} else {
    initializeImportButton();
}