// ===================================
// SAVE TO REGISTER INTEGRATION v1.1 - CLEAN VERSION
// NUR für gewerbeakte_generator.html
// Fügt nur den "Im Register speichern" Button hinzu
// ===================================

class GewerbeakteSaveIntegration {
    constructor() {
        this.version = "1.1-clean";
        this.apiEndpoint = "./api.php/save-akte";
        console.log(`💾 GewerbeakteSaveIntegration v${this.version} initialized`);
        
        this.init();
    }

    init() {
        // Warte bis DOM geladen ist
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        // Nur auf der Gewerbeakte-Generator-Seite ausführen
        if (!this.isGewerbeakteGenerator()) {
            console.log("❌ Not on Gewerbeakte generator page, skipping");
            return;
        }

        console.log("🎯 Setting up save integration on Gewerbeakte page");
        
        // Füge den "Im Register speichern" Button hinzu
        this.addSaveButton();
        
        // Überwache Formular-Änderungen
        this.watchFormChanges();
    }

    isGewerbeakteGenerator() {
        // Prüfe mehrere Indikatoren für die Gewerbeakte-Seite
        const indicators = [
            window.location.pathname.includes('gewerbeakte_generator'),
            document.title.includes('Gewerbeakte erstellen'),
            document.querySelector('.preview-section') !== null,
            document.getElementById('preview-output') !== null,
            document.getElementById('stadt') !== null
        ];
        
        const isCorrect = indicators.some(indicator => indicator);
        console.log("🔍 Page detection:", { indicators, isCorrect });
        
        return isCorrect;
    }

    addSaveButton() {
        // Finde den Copy-Button in der Preview-Section
        const copyButton = document.querySelector('.preview-section .copy-button');
        
        if (!copyButton) {
            console.warn("⚠️ Copy button not found, retrying in 1 second...");
            setTimeout(() => this.addSaveButton(), 1000);
            return;
        }

        // Prüfe ob Button bereits existiert
        if (document.getElementById('save-to-register-btn')) {
            console.log("✅ Save button already exists");
            return;
        }

        // Erstelle den Save-Button
        const saveButton = document.createElement('button');
        saveButton.className = 'copy-button';
        saveButton.id = 'save-to-register-btn';
        saveButton.innerHTML = '<i class="fa fa-database"></i> Im Register speichern';
        saveButton.style.marginTop = '0.5rem';
        saveButton.style.background = 'linear-gradient(135deg, #35A2A2 0%, #6F3E96 100%)';
        saveButton.disabled = true;
        
        // Event Listener
        saveButton.addEventListener('click', () => this.handleSave());
        
        // Button einfügen
        copyButton.parentNode.insertBefore(saveButton, copyButton.nextSibling);
        
        console.log("✅ Save button added successfully");
        
        // Initial state check
        this.updateButtonState();
    }

    watchFormChanges() {
        // Überwache wichtige Formularfelder
        const fieldsToWatch = ['stadt', 'betrieb', 'datum', 'preview-output'];
        
        fieldsToWatch.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                if (fieldId === 'preview-output') {
                    // Für Preview-Output: MutationObserver
                    const observer = new MutationObserver(() => this.updateButtonState());
                    observer.observe(field, { childList: true, subtree: true, characterData: true });
                } else {
                    // Für normale Felder: change/input events
                    field.addEventListener('change', () => this.updateButtonState());
                    field.addEventListener('input', () => this.updateButtonState());
                }
            }
        });

        // Überwache auch Mitarbeiter-Felder
        document.addEventListener('input', (e) => {
            if (e.target.matches('[data-field]') || e.target.matches('[id*="mitarbeiter"]')) {
                this.updateButtonState();
            }
        });

        console.log("👁️ Form change watchers setup");
    }

    updateButtonState() {
        const saveButton = document.getElementById('save-to-register-btn');
        if (!saveButton) return;

        const isValid = this.validateForm();
        
        saveButton.disabled = !isValid;
        saveButton.style.opacity = isValid ? '1' : '0.6';
        saveButton.style.cursor = isValid ? 'pointer' : 'not-allowed';
    }

    validateForm() {
        // Prüfe Pflichtfelder
        const requiredFields = ['stadt', 'betrieb', 'datum'];
        for (const fieldId of requiredFields) {
            const field = document.getElementById(fieldId);
            if (!field || !field.value.trim()) {
                return false;
            }
        }

        // Prüfe Inhaber-Daten
        const inhaberFields = [
            document.querySelector('[data-field="vorname"][data-index="0"]'),
            document.querySelector('[data-field="nachname"][data-index="0"]'),
            document.querySelector('[data-field="telegram"][data-index="0"]')
        ];

        for (const field of inhaberFields) {
            if (!field || !field.value.trim()) {
                return false;
            }
        }

        // Prüfe ob Vorlage generiert wurde
        const previewOutput = document.getElementById('preview-output');
        if (!previewOutput || 
            previewOutput.textContent.trim() === '' ||
            previewOutput.classList.contains('empty-state') ||
            previewOutput.textContent.includes('Noch keine Vorlage generiert')) {
            return false;
        }

        return true;
    }

    async handleSave() {
        console.log("💾 Starting save process...");

        if (!this.validateForm()) {
            this.showValidationError();
            return;
        }

        const formData = this.collectFormData();
        if (!formData) {
            this.showError('Fehler beim Sammeln der Formulardaten');
            return;
        }

        const loadingToast = this.showLoadingToast();

        try {
            const response = await fetch(this.apiEndpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (loadingToast && typeof Toast !== 'undefined') {
                Toast.dismiss(loadingToast);
            }

            if (result.success) {
                this.showSuccessMessage(result);
                this.updateButtonAfterSave();
            } else {
                this.showError(result.error || 'Unbekannter Fehler beim Speichern');
            }

        } catch (error) {
            if (loadingToast && typeof Toast !== 'undefined') {
                Toast.dismiss(loadingToast);
            }
            
            console.error('❌ Save error:', error);
            this.showError('Verbindungsfehler: ' + error.message);
        }
    }

    collectFormData() {
        try {
            const data = {
                lizenznummer: this.generateLizenznummer(),
                vermerk: this.getFieldValue('vermerk'),
                stadt: this.getFieldValue('stadt'),
                betrieb: this.getFieldValue('betrieb'),
                ausgestellt_am: this.getFieldValue('datum'),
                anzahl_lizenzen: parseInt(this.getFieldValue('anzahl-lizenzen') || '1'),
                sondergenehmigung: this.getFieldValue('sondergenehmigung'),
                sonstiges: this.getFieldValue('sonstiges'),
                mitarbeiter: this.collectMitarbeiter()
            };

            console.log("📊 Collected form data:", data);
            return data;

        } catch (error) {
            console.error("❌ Error collecting form data:", error);
            return null;
        }
    }

    getFieldValue(fieldId) {
        const field = document.getElementById(fieldId);
        return field ? field.value.trim() : '';
    }

    collectMitarbeiter() {
        const mitarbeiter = [];
        const sections = document.querySelectorAll('.mitarbeiter-section');
        
        sections.forEach((section, index) => {
            const vorname = section.querySelector('[data-field="vorname"]')?.value?.trim();
            const nachname = section.querySelector('[data-field="nachname"]')?.value?.trim();
            const telegram = section.querySelector('[data-field="telegram"]')?.value?.trim();

            if (vorname && nachname && telegram) {
                mitarbeiter.push({
                    index: index,
                    vorname: vorname,
                    nachname: nachname,
                    telegram: telegram
                });
            }
        });

        return mitarbeiter;
    }

    generateLizenznummer() {
        const stadt = this.getFieldValue('stadt');
        const betrieb = this.getFieldValue('betrieb');
        
        if (!stadt || !betrieb) return '';

        const tag = String(new Date().getDate()).padStart(2, '0');
        const monat = String(new Date().getMonth() + 1).padStart(2, '0');
        const jahr = 1899;
        const random = String(Math.floor(Math.random() * 1000)).padStart(3, '0');

        return `${stadt}-${betrieb.substring(0, 3).toUpperCase()}-${tag}${monat}${jahr}-${random}`;
    }

    updateButtonAfterSave() {
        const saveButton = document.getElementById('save-to-register-btn');
        if (!saveButton) return;

        saveButton.innerHTML = '<i class="fa fa-check"></i> Gespeichert!';
        saveButton.style.background = 'linear-gradient(135deg, #35A2A2 0%, #2C8080 100%)';
        
        setTimeout(() => {
            saveButton.innerHTML = '<i class="fa fa-database"></i> Im Register speichern';
            saveButton.style.background = 'linear-gradient(135deg, #35A2A2 0%, #6F3E96 100%)';
        }, 3000);
    }

    // === UI MESSAGES ===

    showValidationError() {
        if (typeof Toast !== 'undefined') {
            Toast.validationError([
                'Bitte füllen Sie alle Pflichtfelder aus:',
                '• Stadt, Betrieb und Datum',
                '• Vollständige Inhaber-Daten',
                '• Generieren Sie zuerst die Discord-Vorlage'
            ]);
        } else {
            alert('Bitte füllen Sie alle Pflichtfelder aus und generieren Sie zuerst die Discord-Vorlage.');
        }
    }

    showLoadingToast() {
        if (typeof Toast !== 'undefined') {
            return Toast.loading(
                '💾 Speichere im Register...',
                'Die Gewerbeakte wird im zentralen Register gespeichert...'
            );
        } else {
            console.log('💾 Saving to register...');
            return null;
        }
    }

    showSuccessMessage(result) {
        if (typeof Toast !== 'undefined') {
            Toast.success(
                '✅ Im Register gespeichert!',
                `Die Gewerbeakte wurde erfolgreich gespeichert.\nLizenznummer: ${result.lizenznummer}`
            );
        } else {
            alert(`Erfolgreich gespeichert!\nLizenznummer: ${result.lizenznummer}`);
        }
    }

    showError(message) {
        if (typeof Toast !== 'undefined') {
            Toast.error('❌ Speichern fehlgeschlagen', message);
        } else {
            alert('Fehler: ' + message);
        }
    }
}

// === AUTO-INITIALIZATION ===

if (typeof window !== 'undefined') {
    window.GewerbeakteSaveIntegration = GewerbeakteSaveIntegration;
    window.gewerbeakteSaveIntegration = new GewerbeakteSaveIntegration();
    console.log('💾 Gewerbeakte save integration loaded');
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GewerbeakteSaveIntegration };
}