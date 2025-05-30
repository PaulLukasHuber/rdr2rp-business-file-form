// ===================================
// GEWERBEAKTE IMPORT LOGIC
// Separate JavaScript-Datei für Import-Funktionen
// ===================================
// Toggle Import Section
function toggleImport() {
    const content = document.getElementById('import-content');
    const toggle = document.getElementById('import-toggle');
    const header = document.querySelector('.import-header');

    content.classList.toggle('expanded');
    toggle.classList.toggle('expanded');
    header.classList.toggle('expanded');
}

// Main Import Function
function importAkte() {
    const importText = document.getElementById('import-text').value.trim();

    if (!importText) {
        alert('📋 Bitte fügen Sie zuerst eine Gewerbeakte zum Importieren ein!');
        return;
    }

    try {
        // Parse the imported text
        const parsedData = parseGewerbeakteText(importText);

        if (parsedData) {
            // Fill form with parsed data
            fillGewerbeakteForm(parsedData);

            // Clear import field
            document.getElementById('import-text').value = '';

            // Show success message
            showImportSuccessPopup();
        } else {
            showImportErrorPopup();
        }
    } catch (error) {
        console.error('Import error:', error);
        showImportErrorPopup();
    }
}

// Parse Gewerbeakte Text from Discord Format
function parseGewerbeakteText(text) {
    const data = {
        mitarbeiter: []
    };

    try {
        // ===== VALIDIERUNG: Prüfen ob es eine Gewerbeakte ist =====
        const requiredFields = [
            /Vermerk zum Gewerbeantrag:/i,
            /Lizenznummer:/i,
            /Betrieb:/i,
            /Mitarbeiter.*MIT TELEGRAMM NUMMERN/i
        ];

        const foundFields = requiredFields.filter(pattern => pattern.test(text));

        // Wenn weniger als 3 der 4 Pflichtfelder gefunden wurden, ist es keine gültige Gewerbeakte
        if (foundFields.length < 3) {
            console.log(`Validierung fehlgeschlagen: Nur ${foundFields.length}/4 Pflichtfelder gefunden`);
            return null; // Triggert Fehlermeldung
        }

        console.log(`Validierung erfolgreich: ${foundFields.length}/4 Pflichtfelder gefunden`);
        // ===== ENDE VALIDIERUNG =====

        // Extract basic data using regex patterns
        const patterns = {
            vermerk: /Vermerk zum Gewerbeantrag:\s*```\s*([^`]+?)\s*```/i,
            lizenznummer: /Lizenznummer:\s*```\s*([^`]+?)\s*```/i,
            datum: /Ausgestellt am.*?:\s*```\s*([^`]+?)\s*```/i,
            betrieb: /Betrieb:\s*```\s*([^`]+?)\s*```/i,
            anzahlLizenzen: /Anzahl der herausgebenden Lizenzen.*?:\s*```\s*([^`]+?)\s*```/i,
            sondergenehmigung: /Sondergenehmigung:\s*```\s*([^`]+?)\s*```/i,
            sonstiges: /Sonstiges:\s*```\s*([^`]+?)\s*```/i
        };

        // Extract each field
        for (const [key, pattern] of Object.entries(patterns)) {
            const match = text.match(pattern);
            if (match && match[1] && match[1].trim() !== '---') {
                data[key] = match[1].trim();
            }
        }

        // Extract Mitarbeiter section (complex parsing)
        const mitarbeiterMatch = text.match(/Mitarbeiter.*?```\s*(.*?)\s*```/is);
        if (mitarbeiterMatch && mitarbeiterMatch[1]) {
            const mitarbeiterText = mitarbeiterMatch[1].trim();
            if (mitarbeiterText !== '---') {
                // Parse each line of mitarbeiter
                const lines = mitarbeiterText.split('\n').filter(line => line.trim());
                lines.forEach(line => {
                    const trimmedLine = line.trim();
                    if (trimmedLine) {
                        // Parse format: "Rolle: Vorname Nachname (Telegram)"
                        const match = trimmedLine.match(/^(.*?):\s*(.+?)\s*\(([^)]+)\)$/);
                        if (match) {
                            const [, rolle, fullName, telegram] = match;
                            const nameParts = fullName.trim().split(' ');
                            const vorname = nameParts[0] || '';
                            const nachname = nameParts.slice(1).join(' ') || '';

                            data.mitarbeiter.push({
                                rolle: rolle.trim(),
                                vorname: vorname,
                                nachname: nachname,
                                telegram: telegram.trim()
                            });
                        }
                    }
                });
            }
        }

        // Extract Stadt and Betrieb from Lizenznummer if available
        if (data.lizenznummer) {
            const lizenzMatch = data.lizenznummer.match(/^([A-Z]+)-([A-Z]+)-/);
            if (lizenzMatch) {
                data.stadt = lizenzMatch[1];
                data.betriebPrefix = lizenzMatch[2];
            }
        }

        console.log('Parsed import data:', data); // Debug log
        return data;

    } catch (error) {
        console.error('Parse error:', error);
        return null;
    }
}

// Fill Gewerbeakte Form with Imported Data
function fillGewerbeakteForm(data) {
    console.log('Filling form with data:', data); // Debug log

    // Fill basic text fields
    if (data.vermerk) {
        document.getElementById('vermerk').value = data.vermerk;
    }
    if (data.sondergenehmigung) {
        document.getElementById('sondergenehmigung').value = data.sondergenehmigung;
    }
    if (data.sonstiges) {
        document.getElementById('sonstiges').value = data.sonstiges;
    }

    // Set Stadt dropdown
    if (data.stadt) {
        const stadtSelect = document.getElementById('stadt');
        stadtSelect.value = data.stadt;

        // Trigger change event to populate Betrieb options
        stadtSelect.dispatchEvent(new Event('change'));

        // Set Betrieb after options are populated (with delay)
        setTimeout(() => {
            if (data.betrieb) {
                const betriebSelect = document.getElementById('betrieb');
                betriebSelect.value = data.betrieb;
            }
        }, 100);
    }

    // WICHTIG: Set current date (with year 1899) - Override imported date
    const today = new Date();
    const currentMonth = String(today.getMonth() + 1).padStart(2, '0');
    const currentDay = String(today.getDate()).padStart(2, '0');
    document.getElementById('datum').value = `1899-${currentMonth}-${currentDay}`;

    // Clear existing Stellvertreter (keep only Inhaber section)
    const mitarbeiterContainer = document.getElementById('mitarbeiter-container');
    const stellvertreterSections = mitarbeiterContainer.querySelectorAll('.mitarbeiter-section:not(:first-child)');
    stellvertreterSections.forEach(section => section.remove());

    // Reset stellvertreter counter
    if (typeof stellvertreterCounter !== 'undefined') {
        stellvertreterCounter = 1;
    }

    // Fill Mitarbeiter data
    if (data.mitarbeiter && data.mitarbeiter.length > 0) {
        console.log('Processing mitarbeiter:', data.mitarbeiter); // Debug log

        data.mitarbeiter.forEach((mitarbeiter, index) => {
            if (mitarbeiter.rolle === 'Inhaber') {
                // Fill Inhaber (first section)
                const inhaberSection = mitarbeiterContainer.querySelector('.mitarbeiter-section:first-child');
                if (inhaberSection) {
                    const vornameField = inhaberSection.querySelector('[data-field="vorname"][data-index="0"]');
                    const nachnameField = inhaberSection.querySelector('[data-field="nachname"][data-index="0"]');
                    const telegramField = inhaberSection.querySelector('[data-field="telegram"][data-index="0"]');

                    if (vornameField) vornameField.value = mitarbeiter.vorname;
                    if (nachnameField) nachnameField.value = mitarbeiter.nachname;
                    if (telegramField) telegramField.value = mitarbeiter.telegram;
                }
            } else {
                // Add Stellvertreter (call existing function)
                if (typeof addStellvertreter === 'function') {
                    addStellvertreter();

                    // Get the newly added stellvertreter section
                    const stellvertreterSections = mitarbeiterContainer.querySelectorAll('.mitarbeiter-section:not(:first-child)');
                    const currentSection = stellvertreterSections[stellvertreterSections.length - 1];
                    const stellvertreterIndex = stellvertreterSections.length;

                    if (currentSection) {
                        const vornameField = currentSection.querySelector(`[data-field="vorname"][data-index="${stellvertreterIndex}"]`);
                        const nachnameField = currentSection.querySelector(`[data-field="nachname"][data-index="${stellvertreterIndex}"]`);
                        const telegramField = currentSection.querySelector(`[data-field="telegram"][data-index="${stellvertreterIndex}"]`);

                        if (vornameField) vornameField.value = mitarbeiter.vorname;
                        if (nachnameField) nachnameField.value = mitarbeiter.nachname;
                        if (telegramField) telegramField.value = mitarbeiter.telegram;
                    }
                }
            }
        });
    }

    // Update license count and button state (call existing functions)
    if (typeof updateLizenzAnzahl === 'function') {
        updateLizenzAnzahl();
    }
    if (typeof updateAddButton === 'function') {
        updateAddButton();
    }

    console.log('Form filling completed'); // Debug log
}

// Show Import Success Popup
function showImportSuccessPopup() {
    const popup = document.getElementById('popup-overlay');
    const title = document.getElementById('popup-title');
    const icon = document.getElementById('popup-icon');
    const message = document.getElementById('popup-message');
    const buttons = document.getElementById('popup-buttons');

    if (!popup || !title || !icon || !message || !buttons) {
        // Fallback if popup elements don't exist
        alert('✅ Gewerbeakte erfolgreich importiert!\n\n📅 Datum wurde auf heute aktualisiert\n🔢 Neue Lizenznummer wird beim Generieren erstellt');
        return;
    }

    title.textContent = '✅ Gewerbeakte erfolgreich importiert!';
    icon.textContent = '📥';
    message.innerHTML = `
        <span class="popup-success">Die Gewerbeakte wurde erfolgreich geladen!</span><br>
        <strong>📅 Datum wurde auf heute aktualisiert</strong><br>
        <strong>🔢 Neue Lizenznummer wird beim Generieren erstellt</strong><br><br>
        Sie können jetzt die Daten bearbeiten und eine aktualisierte Version generieren.
    `;
    
    popup.classList.add('active');

    // NEU: Import-Bereich automatisch zuklappen
    setTimeout(() => {
        toggleImport();
    }, 1000); // Nach 1 Sekunden zuklappen
}

// Show Import Error Popup
function showImportErrorPopup() {
    const popup = document.getElementById('popup-overlay');
    const title = document.getElementById('popup-title');
    const icon = document.getElementById('popup-icon');
    const message = document.getElementById('popup-message');
    const buttons = document.getElementById('popup-buttons');

    if (!popup || !title || !icon || !message || !buttons) {
        // Fallback if popup elements don't exist
        alert('⚠️ Import fehlgeschlagen!\n\nDie Gewerbeakte konnte nicht importiert werden.\nBitte stellen Sie sicher, dass Sie eine vollständige Gewerbeakte aus Discord kopiert haben.');
        return;
    }

    title.textContent = '⚠️ Import fehlgeschlagen';
    icon.textContent = '❌';
    message.innerHTML = `
        <span style="color: #FF8232;">Die Akte konnte nicht importiert werden!</span><br>
        Bitte stellen Sie sicher, dass Sie eine vollständige <strong>Gewerbeakte</strong> aus Discord kopiert haben.<br><br>
        <strong>Erforderliches Format:</strong><br>
        • Vermerk zum Gewerbeantrag: \`\`\`...\`\`\`<br>
        • Lizenznummer: \`\`\`...\`\`\`<br>
        • Betrieb: \`\`\`...\`\`\`<br>
        • Mitarbeiter (*...MIT TELEGRAMM NUMMERN*): \`\`\`...\`\`\`<br>
        • etc.<br><br>
        <small style="color: #D8C5B0;">⚠️ Personenprüfungsakten oder Anträge können hier nicht importiert werden.</small>
    `;

    popup.classList.add('active');
}

// Utility function to validate import data
function validateImportData(data) {
    if (!data || typeof data !== 'object') {
        console.log('Validation failed: Invalid data type');
        return false;
    }

    // Check if at least some key fields are present
    const hasVermerk = data.vermerk && data.vermerk.length > 0;
    const hasLizenznummer = data.lizenznummer && data.lizenznummer.length > 0;
    const hasBetrieb = data.betrieb && data.betrieb.length > 0;
    const hasMitarbeiter = data.mitarbeiter && Array.isArray(data.mitarbeiter) && data.mitarbeiter.length > 0;

    const validFields = [hasVermerk, hasLizenznummer, hasBetrieb, hasMitarbeiter].filter(Boolean).length;

    console.log('Validation check:', {
        hasVermerk,
        hasLizenznummer,
        hasBetrieb,
        hasMitarbeiter,
        validFields,
        threshold: 2
    });

    // Mindestens 2 Hauptfelder müssen vorhanden sein
    return validFields >= 2;
}

// Debug function to test import parsing
function testImportParsing(testText) {
    console.log('Testing import parsing with text:', testText);
    const result = parseGewerbeakteText(testText);
    console.log('Parse result:', result);
    return result;
}

// Export functions for external use (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        toggleImport,
        importAkte,
        parseGewerbeakteText,
        fillGewerbeakteForm,
        showImportSuccessPopup,
        showImportErrorPopup,
        validateImportData,
        testImportParsing
    };
}

// Initialize import functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Import logic initialized');

    // Add event listeners if elements exist
    const importTextarea = document.getElementById('import-text');
    if (importTextarea) {
        // Add placeholder text and styling
        importTextarea.placeholder = `Kopieren Sie hier die komplette Akte aus Discord ein...`;
    }

    // Log available functions for debugging
    console.log('Available import functions:', {
        toggleImport: typeof toggleImport,
        importAkte: typeof importAkte,
        parseGewerbeakteText: typeof parseGewerbeakteText,
        fillGewerbeakteForm: typeof fillGewerbeakteForm
    });

    // Initialize import button if it exists
    initializeImportButton();
});

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