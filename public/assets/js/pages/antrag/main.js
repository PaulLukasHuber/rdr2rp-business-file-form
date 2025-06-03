// ===================================
// ANTRAG GENERATOR - KOMPLETT NEU GESCHRIEBEN
// Einfach und funktional ohne komplexe Animationen
// ===================================

let currentAntragType = '';

// Toggle Import Section
function toggleImport() {
    const content = document.getElementById('import-content');
    const toggle = document.getElementById('import-toggle');
    const header = document.getElementById('import-header');

    content.classList.toggle('expanded');
    toggle.classList.toggle('expanded');
    header.classList.toggle('expanded');
}

// Switch Antrag Type - KOMPLETT NEU UND EINFACH
function switchAntragType() {
    const selectedType = document.getElementById('antrag-type').value;
    const generateBtn = document.getElementById('generate-btn');
    const antragContent = document.getElementById('antrag-creation-content');

    // Alle Formulare verstecken (jetzt mit .antrag-form)
    document.querySelectorAll('.antrag-form').forEach(form => {
        form.style.display = 'none';
        form.classList.remove('active');
    });

    // Preview leeren
    clearPreview();

    if (selectedType) {
        // Content-Bereich anzeigen (falls noch nicht sichtbar)
        if (antragContent.style.display === 'none' || antragContent.style.display === '') {
            antragContent.style.display = 'block';
            antragContent.classList.add('expanded');
        }

        // Gewähltes Formular anzeigen
        const targetForm = document.getElementById(selectedType + '-form');
        if (targetForm) {
            targetForm.style.display = 'block';
            targetForm.classList.add('active');
        }

        // Button aktivieren und anzeigen
        generateBtn.disabled = false;
        generateBtn.style.display = 'block';
        generateBtn.style.visibility = 'visible';
        generateBtn.style.opacity = '1';
        generateBtn.innerHTML = '<i class="fas fa-paper-plane"></i> ' + getAntragTypeName(selectedType) + ' generieren';
        
        currentAntragType = selectedType;

        // Auto-generate Genehmigungs-Nummer für Gewerbekutsche
        if (selectedType === 'gewerbekutsche') {
            generateGenehmigungsNummer();
        }

    } else {
        // Alles verstecken wenn nichts gewählt
        antragContent.style.display = 'none';
        antragContent.classList.remove('expanded');
        
        generateBtn.disabled = true;
        generateBtn.style.opacity = '0.6';
        generateBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Antrag generieren';
        
        currentAntragType = '';
    }
}

// Get Antrag Type Name
function getAntragTypeName(type) {
    const names = {
        'gewerbeantrag': 'Gewerbeantrag',
        'gewerbeauslage': 'Gewerbeauslage',
        'gewerbekutsche': 'Gewerbekutsche-Genehmigung',
        'gewerbetelegramm': 'Gewerbetelegrammnummer'
    };
    return names[type] || 'Antrag';
}

// Generate Genehmigungs-Nummer
function generateGenehmigungsNummer() {
    const jahr = new Date().getFullYear();
    const monat = String(new Date().getMonth() + 1).padStart(2, '0');
    const tag = String(new Date().getDate()).padStart(2, '0');
    const random = String(Math.floor(Math.random() * 1000)).padStart(3, '0');

    const nummer = `GK-${jahr}${monat}${tag}-${random}`;
    document.getElementById('gewerbekutsche-nummer').value = nummer;
}

// Clear Preview
function clearPreview() {
    const previewOutput = document.getElementById('preview-output');
    previewOutput.className = 'preview-output empty-state';
    previewOutput.innerHTML = `
        <div style="text-align: center; color: #D8C5B0; font-style: italic;">
            <div style="font-size: 3rem; margin-bottom: 1rem;"><i class="fa fa-clipboard"></i></div>
            <div style="font-size: 1.2rem; margin-bottom: 0.5rem;">Noch kein Antrag generiert</div>
            <div style="font-size: 0.9rem;">Wählen Sie einen Antragstyp aus und füllen Sie das Formular aus</div>
        </div>
    `;
}

// Toggle Checkbox
function toggleCheckbox(checkboxId) {
    const checkbox = document.getElementById(checkboxId);
    checkbox.checked = !checkbox.checked;

    // Für Gewerbetelegramm - mutual exclusive checkboxes
    if (checkboxId === 'gewerbetelegramm-bezahlt' && checkbox.checked) {
        document.getElementById('gewerbetelegramm-ausstehend').checked = false;
    } else if (checkboxId === 'gewerbetelegramm-ausstehend' && checkbox.checked) {
        document.getElementById('gewerbetelegramm-bezahlt').checked = false;
    }
}

// Validate Form Function
function validateForm() {
    const errors = [];

    if (!currentAntragType) {
        errors.push('Bitte wählen Sie einen Antragstyp aus');
        return errors;
    }

    switch (currentAntragType) {
        case 'gewerbeantrag':
            if (!document.getElementById('gewerbeantrag-person').value.trim()) {
                errors.push('Antragstellende Person ist erforderlich');
            }
            if (!document.getElementById('gewerbeantrag-gewerbe').value.trim()) {
                errors.push('Gewerbe ist erforderlich');
            }
            if (!document.getElementById('gewerbeantrag-telegram').value.trim()) {
                errors.push('Telegrammnummer ist erforderlich');
            }
            if (!document.getElementById('gewerbeantrag-konzept').value.trim()) {
                errors.push('Gewerbekonzept ist erforderlich');
            }
            break;

        case 'gewerbeauslage':
            if (!document.getElementById('gewerbeauslage-person').value.trim()) {
                errors.push('Antragstellende Person ist erforderlich');
            }
            if (!document.getElementById('gewerbeauslage-telegram').value.trim()) {
                errors.push('Telegrammnummer ist erforderlich');
            }
            if (!document.getElementById('gewerbeauslage-gewerbe').value.trim()) {
                errors.push('Gewerbe ist erforderlich');
            }
            break;

        case 'gewerbekutsche':
            if (!document.getElementById('gewerbekutsche-aussteller').value.trim()) {
                errors.push('Ausstellende Person ist erforderlich');
            }
            if (!document.getElementById('gewerbekutsche-aussteller-telegram').value.trim()) {
                errors.push('Telegrammnummer des Ausstellers ist erforderlich');
            }
            if (!document.getElementById('gewerbekutsche-person').value.trim()) {
                errors.push('Antragstellende Person ist erforderlich');
            }
            if (!document.getElementById('gewerbekutsche-gewerbe').value.trim()) {
                errors.push('Gewerbe ist erforderlich');
            }
            if (!document.getElementById('gewerbekutsche-groesse').value) {
                errors.push('Kutschen-Größe muss ausgewählt werden');
            }
            break;

        case 'gewerbetelegramm':
            if (!document.getElementById('gewerbetelegramm-person').value.trim()) {
                errors.push('Antragstellende Person ist erforderlich');
            }
            if (!document.getElementById('gewerbetelegramm-gewerbe').value.trim()) {
                errors.push('Gewerbe ist erforderlich');
            }
            if (!document.getElementById('gewerbetelegramm-telegram').value.trim()) {
                errors.push('Telegrammnummer ist erforderlich');
            }
            if (!document.getElementById('gewerbetelegramm-wunsch').value.trim()) {
                errors.push('Gewünschte Gewerbetelegrammnummer ist erforderlich');
            }
            break;
    }

    return errors;
}

// Show Form Validation Error
function showFormValidationError(errors) {
    if (typeof Toast !== 'undefined' && Toast.validationError) {
        Toast.validationError(errors);
        highlightErrors();
    } else {
        alert('Bitte korrigieren Sie folgende Fehler:\n\n' + errors.join('\n'));
    }
}

// Highlight Error Fields
function highlightErrors() {
    // Remove previous error highlighting
    document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));

    const errors = validateForm();

    // Highlight fields based on current form type
    if (currentAntragType === 'gewerbeantrag') {
        if (errors.some(e => e.includes('Antragstellende Person'))) {
            document.getElementById('gewerbeantrag-person').classList.add('error');
        }
        if (errors.some(e => e.includes('Gewerbe ist erforderlich'))) {
            document.getElementById('gewerbeantrag-gewerbe').classList.add('error');
        }
        if (errors.some(e => e.includes('Telegrammnummer'))) {
            document.getElementById('gewerbeantrag-telegram').classList.add('error');
        }
        if (errors.some(e => e.includes('Gewerbekonzept'))) {
            document.getElementById('gewerbeantrag-konzept').classList.add('error');
        }
    }
    // ... weitere Antragstypen (gekürzt für Übersichtlichkeit)

    // Scroll to first error
    const firstError = document.querySelector('.error');
    if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstError.focus();
    }
}

// Show Generate Popup
function showGeneratePopup() {
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
        showFormValidationError(validationErrors);
        return;
    }

    if (typeof Toast !== 'undefined' && Toast.generationProgress) {
        const loadingToast = Toast.generationProgress(
            '🔄 Antrag wird generiert...',
            'Bitte warten Sie, während der Antrag formatiert wird...'
        );

        setTimeout(() => {
            Toast.dismiss(loadingToast);
            generateAntrag();
            Toast.generationSuccess(getAntragTypeName(currentAntragType));
        }, 1500);
    } else {
        generateAntrag();
        alert('Antrag wurde erfolgreich generiert!');
    }
}

// Show Copy Popup
function showCopyPopup() {
    const output = document.getElementById('preview-output').textContent;

    if (output.trim() === '' ||
        output.includes('Noch keine Vorlage generiert') ||
        output.includes('Noch kein Antrag generiert') ||
        output.includes('Wählen Sie einen Antragstyp aus')) {
        
        if (typeof Toast !== 'undefined' && Toast.warning) {
            Toast.warning(
                '📝 Kein Antrag vorhanden',
                'Bitte generieren Sie zuerst einen Antrag, bevor Sie ihn kopieren.'
            );
        } else {
            alert('Bitte generieren Sie zuerst einen Antrag, bevor Sie ihn kopieren.');
        }
        return;
    }

    if (typeof Toast !== 'undefined' && Toast.copyProgress) {
        const loadingToast = Toast.copyProgress();

        setTimeout(() => {
            Toast.dismiss(loadingToast);
            navigator.clipboard.writeText(output).then(() => {
                Toast.copySuccess(getAntragTypeName(currentAntragType));
            }).catch(() => {
                Toast.copyError('Clipboard-API nicht verfügbar. Bitte kopieren Sie den Text manuell.');
            });
        }, 1000);
    } else {
        navigator.clipboard.writeText(output).then(() => {
            alert('Antrag wurde erfolgreich in die Zwischenablage kopiert!');
        }).catch(() => {
            alert('Kopieren fehlgeschlagen. Bitte kopieren Sie den Text manuell.');
        });
    }
}

// Generate Antrag
function generateAntrag() {
    let output = '';

    switch (currentAntragType) {
        case 'gewerbeantrag':
            output = generateGewerbeantrag();
            break;
        case 'gewerbeauslage':
            output = generateGewerbeauslage();
            break;
        case 'gewerbekutsche':
            output = generateGewerbekutsche();
            break;
        case 'gewerbetelegramm':
            output = generateGewerbetelegramm();
            break;
    }

    const previewOutput = document.getElementById('preview-output');
    previewOutput.className = 'preview-output';
    previewOutput.textContent = output;
}

// Generate Functions
function generateGewerbeantrag() {
    const person = document.getElementById('gewerbeantrag-person').value.trim();
    const gewerbe = document.getElementById('gewerbeantrag-gewerbe').value.trim();
    const telegram = document.getElementById('gewerbeantrag-telegram').value.trim();
    const konzept = document.getElementById('gewerbeantrag-konzept').value.trim();

    let output = `Antragstellende Person:\n\`\`\`\n${person || '---'}\n\`\`\`\n`;
    output += `Für Gewerbe:\n\`\`\`\n${gewerbe || '---'}\n\`\`\`\n`;
    output += `Telegrammnummer (Für Rückfragen):\n\`\`\`\n${telegram || '---'}\n\`\`\`\n`;
    output += `Gewerbekonzept:\n\`\`\`\n${konzept || '---'}\n\`\`\``;

    return output;
}

function generateGewerbeauslage() {
    const person = document.getElementById('gewerbeauslage-person').value.trim();
    const telegram = document.getElementById('gewerbeauslage-telegram').value.trim();
    const gewerbe = document.getElementById('gewerbeauslage-gewerbe').value.trim();

    let output = `Antragstellende Person:\n\`\`\`\n${person || '---'}\n\`\`\`\n`;
    output += `Telegrammnummer (Für Rückfragen):\n\`\`\`\n${telegram || '---'}\n\`\`\`\n`;
    output += `Für Gewerbe:\n\`\`\`\n${gewerbe || '---'}\n\`\`\``;

    return output;
}

function generateGewerbekutsche() {
    const nummer = document.getElementById('gewerbekutsche-nummer').value.trim();
    const aussteller = document.getElementById('gewerbekutsche-aussteller').value.trim();
    const ausstellerTelegram = document.getElementById('gewerbekutsche-aussteller-telegram').value.trim();
    const person = document.getElementById('gewerbekutsche-person').value.trim();
    const gewerbe = document.getElementById('gewerbekutsche-gewerbe').value.trim();
    const groesse = document.getElementById('gewerbekutsche-groesse').value;

    let output = `Genehmigungs-Nummer:\n\`\`\`\n${nummer || '---'}\n\`\`\`\n`;
    output += `Ausstellende Person:\n\`\`\`\n${aussteller || '---'}\n\`\`\`\n`;
    output += `Telegrammnummer (Für Rückfragen):\n\`\`\`\n${ausstellerTelegram || '---'}\n\`\`\`\n`;
    output += `Antragstellende Person:\n\`\`\`\n${person || '---'}\n\`\`\`\n`;
    output += `Für Gewerbe:\n\`\`\`\n${gewerbe || '---'}\n\`\`\`\n`;
    output += `Kutschen Größe:\n\`\`\`\n${groesse || '---'}\n\`\`\`\n`;
    output += `Hiermit Genehmige ich, **${aussteller || 'NAME'}**,\nMitarbeiter des Gewerbeamts der Stadt\nSaint Denis, die Abholung der Gewerbekutsche`;

    return output;
}

function generateGewerbetelegramm() {
    const person = document.getElementById('gewerbetelegramm-person').value.trim();
    const gewerbe = document.getElementById('gewerbetelegramm-gewerbe').value.trim();
    const telegram = document.getElementById('gewerbetelegramm-telegram').value.trim();
    const wunsch = document.getElementById('gewerbetelegramm-wunsch').value.trim();
    const bezahlt = document.getElementById('gewerbetelegramm-bezahlt').checked;
    const ausstehend = document.getElementById('gewerbetelegramm-ausstehend').checked;

    let bezahltStatus = '---';
    if (bezahlt) {
        bezahltStatus = 'Ja';
    } else if (ausstehend) {
        bezahltStatus = 'Nein, ausstehend';
    }

    let output = `Antragstellende Person:\n\`\`\`\n${person || '---'}\n\`\`\`\n`;
    output += `Für Gewerbe:\n\`\`\`\n${gewerbe || '---'}\n\`\`\`\n`;
    output += `Telegrammnummer (Für Rückfragen):\n\`\`\`\n${telegram || '---'}\n\`\`\`\n`;
    output += `Gewünschte Gewerbetelegrammnummer:\n\`\`\`\n${wunsch || '---'}\n\`\`\`\n`;
    output += `Bearbeitungsgebühr (100$) bezahlt?:\n\`\`\`\n${bezahltStatus}\n\`\`\``;

    return output;
}

// Import Function (Placeholder)
function importAntrag() {
    if (typeof Toast !== 'undefined' && Toast.info) {
        Toast.info('Import-Funktion', 'Import-Funktion wird von den separaten JavaScript-Dateien bereitgestellt.');
    } else {
        alert('Import-Funktion würde hier implementiert werden');
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    const creationContent = document.getElementById('antrag-creation-content');
    const generateBtn = document.getElementById('generate-btn');
    
    // Initial setup
    if (creationContent) {
        creationContent.style.display = 'none';
        creationContent.classList.remove('expanded');
    }
    if (generateBtn) {
        generateBtn.disabled = true;
        generateBtn.style.opacity = '0.6';
    }

    // Error highlighting removal
    document.querySelectorAll('.form-input, .form-select').forEach(input => {
        input.addEventListener('input', function() {
            this.classList.remove('error');
        });
        input.addEventListener('change', function() {
            this.classList.remove('error');
        });
    });
});