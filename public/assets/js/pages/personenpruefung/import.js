// Toggle Import Section (erweiterte Version)
function toggleImport() {
    const content = document.getElementById('import-content');
    const toggle = document.getElementById('import-toggle');
    const header = document.querySelector('.import-header');

    content.classList.toggle('expanded');
    toggle.classList.toggle('expanded');
    header.classList.toggle('expanded'); // Header-Klasse hinzufügen/entfernen
}

// Import Akte Function mit Validierung
function importAkte() {
    const importText = document.getElementById('import-text').value.trim();

    if (!importText) {
        alert('📋 Bitte fügen Sie zuerst eine Personenprüfungsakte zum Importieren ein!');
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

            // NEU: Button-Status nach dem Leeren aktualisieren
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

    // Mindestens 4 von 5 Feldern müssen vorhanden sein
    const fieldCount = [hasPersonField, hasTelegramField, hasPrueferField, hasDateField, hasResultField]
        .filter(Boolean).length;

    // Ausschließende Kriterien für Gewerbeakte
    const isNotGewerbeakte = !text.includes('Lizenznummer:') &&
        !text.includes('Mitarbeiter (*Nur Inhaber') &&
        !text.includes('Anzahl der herausgebenden Lizenzen') &&
        !text.includes('Sondergenehmigung:');

    console.log(`Field count: ${fieldCount}/5, Is not Gewerbeakte: ${isNotGewerbeakte}`);
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

// Parse Personenprüfungsakte Text (korrigierte und umbenannte Funktion)
function parsePersonenprüfungsakteText(text) {
    const data = {};

    try {
        // Extract data between ``` blocks - FLEXIBLERE PATTERNS
        const patterns = {
            person: /Zu überprüfende Person:\s*```\s*([^`]+?)\s*```/i,
            telegram: /Telegramm.*?:\s*```\s*([^`]+?)\s*```/i, // FLEXIBLER - akzeptiert verschiedene Varianten
            pruefer: /Geprüft durch:\s*```\s*([^`]+?)\s*```/i,
            datum: /Geprüft am:\s*```\s*([^`]+?)\s*```/i,
            ergebnis: /Prüfungsergebnis:\s*```\s*([^`]+?)\s*```/is
        };

        // Extract each field
        for (const [key, pattern] of Object.entries(patterns)) {
            const match = text.match(pattern);
            if (match && match[1] && match[1].trim() !== '---') {
                data[key] = match[1].trim();
                console.log(`Found ${key}: ${data[key]}`); // Debug
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
            }
        }

        console.log('Parsed data:', data); // Debug
        return data;
    } catch (error) {
        console.error('Parse error:', error);
        return null;
    }
}

// Fill Personenprüfungsakte Form (korrigierte und umbenannte Funktion)
function fillPersonenprüfungsakteForm(data) {
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

    // Set result radio button
    if (data.ergebnisType) {
        let resultValue = '';
        if (data.ergebnisType.includes('✅') || data.ergebnisType.toLowerCase().includes('bestanden')) {
            resultValue = 'bestanden';
        } else if (data.ergebnisType.includes('❌') || data.ergebnisType.toLowerCase().includes('nicht bestanden')) {
            resultValue = 'nicht-bestanden';
        } else if (data.ergebnisType.includes('⏳') || data.ergebnisType.toLowerCase().includes('ausstehend')) {
            resultValue = 'ausstehend';
        }

        if (resultValue) {
            // Clear all selections
            document.querySelectorAll('.radio-group').forEach(group => {
                group.classList.remove('selected');
            });

            // Set the correct selection
            const targetRadio = document.getElementById(resultValue);
            if (targetRadio) {
                targetRadio.checked = true;
                targetRadio.closest('.radio-group').classList.add('selected');
            }
        }
    }
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
        • Zu überprüfende Person: \`\`\`...\`\`\`<br>
        • Telegrammnummer (Für Rückfragen): \`\`\`...\`\`\`<br>
        • Geprüft durch: \`\`\`...\`\`\`<br>
        • Geprüft am: \`\`\`...\`\`\`<br>
        • Prüfungsergebnis: \`\`\`...\`\`\`
    `;

    popup.classList.add('active');
}

// Check Import Text and Update Button State
function checkImportText() {
    const importText = document.getElementById('import-text').value.trim();
    const importButton = document.getElementById('import-button');

    if (importText.length > 0) {
        importButton.disabled = false;
        importButton.innerHTML = '<i class="fa-solid fa-file-import"></i> Akte importieren';
    } else {
        importButton.disabled = true;
        importButton.innerHTML = '<i class="fa-solid fa-circle-info"></i> Akte eingeben zum Importieren';
    }
}

// Initialize Import Button State
function initializeImportButton() {
    const importTextarea = document.getElementById('import-text');
    const importButton = document.getElementById('import-button');

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

// Call initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeImportButton();
});