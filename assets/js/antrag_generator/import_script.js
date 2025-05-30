// ===================================
// ANTRÄGE IMPORT LOGIC
// ===================================
// Toggle Import Section
function toggleImport() {
    const content = document.getElementById('import-content');
    const toggle = document.getElementById('import-toggle');
    const header = document.getElementById('import-header');

    content.classList.toggle('expanded');
    toggle.classList.toggle('expanded');
    header.classList.toggle('expanded');
}

// Main Import Function
function importAntrag() {
    const importText = document.getElementById('import-text').value.trim();

    if (!importText) {
        alert('📋 Bitte fügen Sie zuerst einen Antrag zum Importieren ein!');
        return;
    }

    try {
        // Parse the imported text
        const parsedData = parseAntragText(importText);

        if (parsedData && parsedData.type) {
            // Fill form with parsed data
            fillAntragForm(parsedData);

            // Clear import field
            document.getElementById('import-text').value = '';

            // Show success message
            showAntragImportSuccessPopup();

            // Auto-collapse import section
            setTimeout(() => {
                toggleImport();
            }, 1000);
        } else {
            showAntragImportErrorPopup();
        }
    } catch (error) {
        console.error('Import error:', error);
        showAntragImportErrorPopup();
    }
}

// Parse Antrag Text from Discord Format
function parseAntragText(text) {
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
            return null;
        }

        // Extract fields using regex patterns
        const patterns = {
            person: /Antragstellende Person:\s*```\s*([^`]+?)\s*```/i,
            gewerbe: /Für Gewerbe:\s*```\s*([^`]+?)\s*```/i,
            telegram: /Telegrammnummer \(Für Rückfragen\):\s*```\s*([^`]+?)\s*```/i,
            konzept: /Gewerbekonzept:\s*```\s*([^`]+?)\s*```/i,
            nummer: /Genehmigungs-Nummer:\s*```\s*([^`]+?)\s*```/i,
            aussteller: /Ausstellende Person:\s*```\s*([^`]+?)\s*```/i,
            groesse: /Kutschen Größe:\s*```\s*([^`]+?)\s*```/i,
            wunsch: /Gewünschte Gewerbetelegrammnummer:\s*```\s*([^`]+?)\s*```/i,
            bezahlt: /Bearbeitungsgebühr \(100\$\) bezahlt\?:\s*```\s*([^`]+?)\s*```/i
        };

        // Extract each field
        for (const [key, pattern] of Object.entries(patterns)) {
            const match = text.match(pattern);
            if (match && match[1] && match[1].trim() !== '---') {
                data[key] = match[1].trim();
            }
        }

        // Special handling for payment status
        if (data.bezahlt) {
            data.bezahltStatus = data.bezahlt.toLowerCase().includes('ja');
            data.ausstehendeStatus = data.bezahlt.toLowerCase().includes('ausstehend');
        }

        console.log('Parsed import data:', data);
        return data;

    } catch (error) {
        console.error('Parse error:', error);
        return null;
    }
}

// Fill Antrag Form with Imported Data
function fillAntragForm(data) {
    console.log('Filling form with data:', data);

    // Set antrag type first and trigger form switch
    document.getElementById('antrag-type').value = data.type;

    // Trigger the change event to open the correct form
    const antragSelect = document.getElementById('antrag-type');
    antragSelect.dispatchEvent(new Event('change'));

    // Also call switchAntragType directly to ensure it works
    switchAntragType();

    // Wait a moment for form to load, then fill fields
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

                // Handle payment checkboxes
                if (data.bezahltStatus) {
                    document.getElementById('gewerbetelegramm-bezahlt').checked = true;
                    document.getElementById('gewerbetelegramm-ausstehend').checked = false;
                } else if (data.ausstehendeStatus) {
                    document.getElementById('gewerbetelegramm-ausstehend').checked = true;
                    document.getElementById('gewerbetelegramm-bezahlt').checked = false;
                }
                break;
        }

        console.log('Form filling completed');
    }, 200);
}

// Show Import Success Popup
function showAntragImportSuccessPopup() {
    const popup = document.getElementById('popup-overlay');
    const title = document.getElementById('popup-title');
    const icon = document.getElementById('popup-icon');
    const message = document.getElementById('popup-message');
    const buttons = document.getElementById('popup-buttons');

    if (!popup || !title || !icon || !message || !buttons) {
        alert('✅ Antrag erfolgreich importiert!\n\nSie können jetzt die Daten bearbeiten und den Antrag neu generieren.');
        return;
    }

    title.textContent = '✅ Antrag erfolgreich importiert!';
    icon.textContent = '📥';
    message.innerHTML = `
        <span class="popup-success">Der Antrag wurde erfolgreich geladen!</span><br>
        Sie können jetzt die Daten bearbeiten und eine aktualisierte Version generieren.<br><br>
        <strong>💡 Tipp:</strong> Überprüfen Sie alle Felder vor der Neugenerierung.
    `;

    popup.classList.add('active');
}

// Show Import Error Popup
function showAntragImportErrorPopup() {
    const popup = document.getElementById('popup-overlay');
    const title = document.getElementById('popup-title');
    const icon = document.getElementById('popup-icon');
    const message = document.getElementById('popup-message');
    const buttons = document.getElementById('popup-buttons');

    if (!popup || !title || !icon || !message || !buttons) {
        alert('⚠️ Import fehlgeschlagen!\n\nDer Antrag konnte nicht importiert werden.\nBitte stellen Sie sicher, dass Sie einen vollständigen Antrag aus Discord kopiert haben.');
        return;
    }

    title.textContent = '⚠️ Import fehlgeschlagen';
    icon.textContent = '❌';
    message.innerHTML = `
        <span style="color: #FF8232;">Der Antrag konnte nicht importiert werden!</span><br>
        Bitte stellen Sie sicher, dass Sie einen vollständigen Antrag aus Discord kopiert haben.<br><br>
        <strong>Erforderliches Format:</strong><br>
        • Antragstellende Person: \`\`\`...\`\`\`<br>
        • Für Gewerbe: \`\`\`...\`\`\`<br>
        • Telegrammnummer: \`\`\`...\`\`\`<br>
        • etc.
    `;

    popup.classList.add('active');
}

// Check Import Text and Update Button State
function checkImportText() {
    const importText = document.getElementById('import-text').value.trim();
    const importButton = document.getElementById('import-button');

    if (importText.length > 0) {
        importButton.disabled = false;
        importButton.innerHTML = '<i class="fa-solid fa-file-import"></i> Antrag importieren';
    } else {
        importButton.disabled = true;
        importButton.innerHTML = '<i class="fa-solid fa-circle-info"></i> Antrag eingeben zum Importieren';
    }
}

// Initialize Import Button State
function initializeImportButton() {
    const importTextarea = document.getElementById('import-text');
    const importButton = document.getElementById('import-button');

    // Set initial state
    importButton.disabled = true;
    importButton.innerHTML = '<i class="fa-solid fa-circle-info"></i> Antrag eingeben zum Importieren';

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