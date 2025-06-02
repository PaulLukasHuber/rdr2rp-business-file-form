// ===================================
// PERSONENPRÜFUNGSAKTE MAIN JAVASCRIPT - UPDATED v2.0
// Mit conditional fields Logik
// ===================================

// Set current date (but limited to 1899)
const today = new Date();
const currentMonth = String(today.getMonth() + 1).padStart(2, '0');
const currentDay = String(today.getDate()).padStart(2, '0');

// Use current month and day, but with year 1899
document.getElementById('datum').value = `1899-${currentMonth}-${currentDay}`;

// Updated Select result function with conditional field logic
function selectResult(resultType) {
    console.log(`🎯 Selected result: ${resultType}`);
    
    // Remove selected class from all radio groups
    document.querySelectorAll('.radio-group').forEach(group => {
        group.classList.remove('selected');
    });

    // Add selected class to clicked group
    event.currentTarget.classList.add('selected');

    // Check the radio button
    document.getElementById(resultType).checked = true;

    // Show/hide conditional fields based on selection
    const conditionalFields = document.getElementById('pruefungsdetails');
    
    if (resultType === 'bestanden' || resultType === 'nicht-bestanden') {
        // Show conditional fields with animation
        console.log(`✅ Showing conditional fields for: ${resultType}`);
        conditionalFields.classList.add('show');
        
        // Set current date when fields become visible
        const datumField = document.getElementById('datum');
        if (datumField && !datumField.value) {
            datumField.value = `1899-${currentMonth}-${currentDay}`;
        }
    } else {
        // Hide conditional fields
        console.log(`❌ Hiding conditional fields for: ${resultType}`);
        conditionalFields.classList.remove('show');
        
        // Clear conditional field values when hidden (INCLUDING details)
        document.getElementById('pruefer').value = '';
        document.getElementById('datum').value = '';
        document.getElementById('details').value = '';
    }
}

// Updated Validate Form Function
function validateForm() {
    const errors = [];

    // Validate Person
    const person = document.getElementById('person').value.trim();
    if (!person) {
        errors.push('Zu überprüfende Person ist erforderlich');
    }

    // Validate Telegram
    const telegram = document.getElementById('telegram').value.trim();
    if (!telegram) {
        errors.push('Telegrammnummer ist erforderlich');
    }

    // Validate Ergebnis (now optional since "ausstehend" is pre-selected)
    const ergebnis = document.querySelector('input[name="ergebnis"]:checked');
    if (!ergebnis) {
        errors.push('Prüfungsstatus muss ausgewählt werden');
    }

    // Validate conditional fields only if "bestanden" or "nicht-bestanden" is selected
    if (ergebnis && (ergebnis.value === 'bestanden' || ergebnis.value === 'nicht-bestanden')) {
        const pruefer = document.getElementById('pruefer').value.trim();
        const datum = document.getElementById('datum').value;
        
        if (!pruefer) {
            errors.push('Prüfer ist erforderlich bei abgeschlossenen Prüfungen');
        }
        if (!datum) {
            errors.push('Prüfungsdatum ist erforderlich bei abgeschlossenen Prüfungen');
        }
    }

    return errors;
}

// Show Form Validation Error - ERSETZT MIT TOAST
function showFormValidationError(errors) {
    if (typeof Toast !== 'undefined') {
        Toast.validationError(errors);
    } else {
        alert('Fehler:\n' + errors.join('\n'));
    }
    highlightErrors();
}

// Updated Highlight Error Fields
function highlightErrors() {
    // Remove previous error highlighting
    document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));

    const errors = validateForm();

    // Highlight specific fields based on errors
    if (errors.some(e => e.includes('Zu überprüfende Person'))) {
        document.getElementById('person').classList.add('error');
    }
    if (errors.some(e => e.includes('Telegrammnummer'))) {
        document.getElementById('telegram').classList.add('error');
    }
    if (errors.some(e => e.includes('Prüfungsstatus'))) {
        document.querySelectorAll('.radio-group').forEach(group => {
            group.style.borderColor = '#FF8232';
        });
    }
    if (errors.some(e => e.includes('Prüfer'))) {
        document.getElementById('pruefer').classList.add('error');
    }
    if (errors.some(e => e.includes('Prüfungsdatum'))) {
        document.getElementById('datum').classList.add('error');
    }

    // Scroll to first error
    const firstError = document.querySelector('.error');
    if (firstError) {
        firstError.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
        firstError.focus();
    }
}

// Show Generate Popup - ERSETZT MIT TOAST
function showGeneratePopup() {
    // First validate the form
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
        showFormValidationError(validationErrors);
        return;
    }

    // Loading Toast anzeigen
    if (typeof Toast !== 'undefined') {
        const loadingToast = Toast.generationProgress(
            '🔄 Prüfungsakte wird generiert...',
            'Bitte warten Sie, während die Personenprüfungsakte formatiert wird...'
        );

        // Simulation der Generierung
        setTimeout(() => {
            Toast.dismiss(loadingToast);
            generateAkte(); // Bestehende Funktion
            Toast.generationSuccess('Personenprüfungsakte');
        }, 1500);
    } else {
        generateAkte();
    }
}

// Show Copy Popup - KORRIGIERT FÜR LEERE VALIDIERUNG
function showCopyPopup() {
    const output = document.getElementById('preview-output').textContent;

    // KORRIGIERTE VALIDIERUNG - Prüft nach dem tatsächlichen HTML-Text
    if (output.trim() === '' ||
        output.includes('Noch keine Vorlage generiert') ||
        output.includes('Füllen Sie das Formular aus')) {
        
        if (typeof Toast !== 'undefined') {
            Toast.warning(
                '📝 Keine Prüfungsakte vorhanden',
                'Bitte generieren Sie zuerst eine Prüfungsakte, bevor Sie sie kopieren.'
            );
        } else {
            alert('Bitte generieren Sie zuerst eine Prüfungsakte!');
        }
        return;
    }

    // Loading Toast
    if (typeof Toast !== 'undefined') {
        const loadingToast = Toast.copyProgress();

        // Simulation des Kopiervorgangs
        setTimeout(() => {
            Toast.dismiss(loadingToast);

            navigator.clipboard.writeText(output).then(() => {
                Toast.copySuccess('Personenprüfungsakte');
            }).catch(() => {
                Toast.copyError('Clipboard-API nicht verfügbar. Bitte kopieren Sie den Text manuell.');
            });
        }, 1000);
    } else {
        // Fallback ohne Toast
        navigator.clipboard.writeText(output).then(() => {
            alert('In Zwischenablage kopiert!');
        }).catch(() => {
            alert('Kopieren fehlgeschlagen. Bitte kopieren Sie den Text manuell.');
        });
    }
}

// Legacy functions for compatibility - NO LONGER NEEDED BUT KEPT FOR SAFETY
function closePopup() {
    console.log('closePopup() called - replaced by Toast system');
}

function copyFromPopup() {
    if (typeof copyToClipboard === 'function') {
        copyToClipboard();
    }
}

// Click outside popup to close - NO LONGER NEEDED
if (document.getElementById('popup-overlay')) {
    document.getElementById('popup-overlay').addEventListener('click', function(e) {
        if (e.target === this) {
            closePopup();
        }
    });
}

// Updated Generate Akte (korrigiert für conditional fields)
function generateAkte() {
    const person = document.getElementById('person').value.trim();
    const telegram = document.getElementById('telegram').value.trim();
    const details = document.getElementById('details').value.trim();

    // Get selected result
    const ergebnisElement = document.querySelector('input[name="ergebnis"]:checked');
    let ergebnisText = '';
    let pruefer = '';
    let datum = '';

    if (ergebnisElement) {
        switch (ergebnisElement.value) {
            case 'bestanden':
                ergebnisText = '✅ Bestanden';
                pruefer = document.getElementById('pruefer').value.trim();
                datum = document.getElementById('datum').value;
                break;
            case 'nicht-bestanden':
                ergebnisText = '❌ Nicht bestanden';
                pruefer = document.getElementById('pruefer').value.trim();
                datum = document.getElementById('datum').value;
                break;
            case 'ausstehend':
                ergebnisText = '⏳ Prüfung ausstehend';
                break;
            default:
                ergebnisText = '---';
        }
    }

    // Format output according to updated template
    let output = `Zu überprüfende Person:\n\`\`\`\n${person || '---'}\n\`\`\`\n`;
    output += `Telegrammnummer (Für Rückfragen):\n\`\`\`\n${telegram || '---'}\n\`\`\`\n`;
    
    // Only include pruefer and datum if result is not "ausstehend"
    if (ergebnisElement && ergebnisElement.value !== 'ausstehend') {
        output += `Geprüft durch:\n\`\`\`\n${pruefer || '---'}\n\`\`\`\n`;
        output += `Geprüft am:\n\`\`\`\n${formatDate(datum) || '---'}\n\`\`\`\n`;
    }
    
    output += `Prüfungsergebnis:\n\`\`\`\n${ergebnisText || '---'}\n\`\`\`\n`;
    output += `Detaillierte Bewertung/Anmerkungen:\n\`\`\`\n${details || '---'}\n\`\`\``;

    const previewOutput = document.getElementById('preview-output');
    previewOutput.className = 'preview-output'; // Entferne empty-state Klasse
    previewOutput.textContent = output;
}

// Format date
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE');
}

// Copy to clipboard - KORRIGIERT FÜR LEERE VALIDIERUNG
function copyToClipboard() {
    const output = document.getElementById('preview-output').textContent;

    // KORRIGIERTE VALIDIERUNG - Prüft nach dem tatsächlichen HTML-Text
    if (output.includes('Noch keine Vorlage generiert') ||
        output.trim() === '') {
        
        if (typeof Toast !== 'undefined') {
            Toast.warning('📝 Keine Prüfungsakte vorhanden', 'Bitte generieren Sie zuerst eine Prüfungsakte!');
        } else {
            alert('Bitte generieren Sie zuerst eine Prüfungsakte!');
        }
        return;
    }

    navigator.clipboard.writeText(output).then(() => {
        // Legacy button update for any existing copy buttons
        const button = event?.target;
        if (button) {
            const originalText = button.textContent;
            button.textContent = '✅ Kopiert!';
            button.style.background = 'linear-gradient(135deg, #35A2A2 0%, #6F3E96 100%)';

            setTimeout(() => {
                button.textContent = originalText;
                button.style.background = 'linear-gradient(135deg, #F4C066 0%, #D99C45 100%)';
            }, 2000);
        }

        // Show toast
        if (typeof Toast !== 'undefined') {
            Toast.copySuccess('Personenprüfungsakte');
        }
    }).catch(() => {
        if (typeof Toast !== 'undefined') {
            Toast.copyError('Clipboard-API nicht verfügbar. Bitte kopieren Sie den Text manuell.');
        } else {
            alert('Kopieren fehlgeschlagen!');
        }
    });
}

// Add hover effects for radio groups
document.querySelectorAll('.radio-group').forEach(group => {
    group.addEventListener('mouseenter', function() {
        if (!this.classList.contains('selected')) {
            this.style.transform = 'translateY(-2px) scale(1.02)';
        }
    });

    group.addEventListener('mouseleave', function() {
        if (!this.classList.contains('selected')) {
            this.style.transform = 'translateY(0) scale(1)';
        }
    });
});

// Remove error styling when user starts typing
document.querySelectorAll('.form-input').forEach(input => {
    input.addEventListener('input', function() {
        this.classList.remove('error');
    });
});

// Remove error styling from radio groups when selection is made
document.querySelectorAll('input[name="ergebnis"]').forEach(radio => {
    radio.addEventListener('change', function() {
        document.querySelectorAll('.radio-group').forEach(group => {
            group.style.borderColor = '#A85F3D';
        });
    });
});

// Toggle Import Section
function toggleImport() {
    const content = document.getElementById('import-content');
    const toggle = document.getElementById('import-toggle');
    const header = document.querySelector('.import-header');
    
    content.classList.toggle('expanded');
    toggle.classList.toggle('expanded');
    header.classList.toggle('expanded');
}

// Placeholder function for import functionality
function importAkte() {
    console.log('Import function called');
    if (typeof Toast !== 'undefined') {
        Toast.info('Import Feature', 'Import-Funktionalität wird geladen...');
    }
}