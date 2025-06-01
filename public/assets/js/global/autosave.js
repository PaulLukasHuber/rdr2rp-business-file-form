// ===================================
// AUTO-SAVE & DRAFTS SYSTEM v1.0
// Globales System für alle RDR2RP Formulare
// ===================================

class AutoSaveManager {
    constructor() {
        this.version = "1.0";
        this.currentPage = this.detectCurrentPage();
        this.saveDelay = 3000; // 3 Sekunden
        this.saveTimeout = null;
        this.isEnabled = this.checkStorageSupport();
        this.isMonitoring = false;
        this.lastSaveTime = null;
        this.statusElement = null;
        
        console.log(`💾 AutoSaveManager v${this.version} initialized for: ${this.currentPage}`);
        
        if (this.isEnabled) {
            this.init();
        } else {
            console.warn('⚠️ Storage not supported - Auto-Save disabled');
        }
    }

    // ===== INITIALIZATION =====
    detectCurrentPage() {
        const pathname = window.location.pathname;
        if (pathname.includes('gewerbeakte')) return 'gewerbeakte';
        if (pathname.includes('personenpruefung')) return 'personenpruefung';
        if (pathname.includes('antrag')) return 'antrag';
        return 'unknown';
    }

    checkStorageSupport() {
        try {
            const testKey = '__autosave_test__';
            localStorage.setItem(testKey, 'test');
            localStorage.removeItem(testKey);
            
            sessionStorage.setItem(testKey, 'test');
            sessionStorage.removeItem(testKey);
            
            return true;
        } catch (e) {
            return false;
        }
    }

    init() {
        // Check for recovery on page load
        setTimeout(() => {
            this.checkForRecovery();
        }, 1000);

        // Start monitoring form changes
        this.startMonitoring();

        // Add status indicator
        this.addStatusIndicator();

        // Handle page unload
        window.addEventListener('beforeunload', (e) => {
            this.saveFormState('auto');
        });
    }

    // ===== FORM MONITORING =====
    startMonitoring() {
        if (this.isMonitoring) return;
        
        console.log('🔍 Starting form monitoring...');
        this.isMonitoring = true;

        // Monitor all form inputs
        const formInputs = document.querySelectorAll('input, textarea, select');
        formInputs.forEach(input => {
            ['input', 'change', 'keyup'].forEach(eventType => {
                input.addEventListener(eventType, () => {
                    this.debouncedSave();
                });
            });
        });

        // Monitor radio button groups specifically
        document.addEventListener('click', (e) => {
            if (e.target.type === 'radio' || e.target.closest('.radio-group')) {
                this.debouncedSave();
            }
        });

        console.log(`✅ Monitoring ${formInputs.length} form inputs`);
    }

    debouncedSave() {
        if (!this.isEnabled) return;

        // Clear existing timeout
        if (this.saveTimeout) {
            clearTimeout(this.saveTimeout);
        }

        // Update status to show saving
        this.updateStatus('saving', 'Speichere...');

        // Set new timeout
        this.saveTimeout = setTimeout(() => {
            this.saveFormState('auto');
        }, this.saveDelay);
    }

    // ===== FORM STATE MANAGEMENT =====
    saveFormState(type = 'auto') {
        try {
            const formData = this.serializeForm();
            
            if (this.isFormEmpty(formData)) {
                console.log('📝 Form is empty - skipping save');
                return false;
            }

            const saveData = {
                timestamp: new Date().toISOString(),
                page: this.currentPage,
                type: type, // 'auto' or 'manual'
                formData: formData
            };

            if (type === 'auto') {
                // Auto-save to sessionStorage (temporary)
                sessionStorage.setItem(`autosave_${this.currentPage}`, JSON.stringify(saveData));
                this.updateStatus('saved', 'Automatisch gespeichert');
                this.lastSaveTime = new Date();
                console.log('💾 Auto-saved form state');
            }

            return true;
        } catch (error) {
            console.error('❌ Save failed:', error);
            this.updateStatus('error', 'Speichern fehlgeschlagen');
            return false;
        }
    }

    serializeForm() {
        const formData = {};

        // Serialize regular inputs
        document.querySelectorAll('input, textarea, select').forEach(input => {
            if (input.id) {
                if (input.type === 'radio') {
                    if (input.checked) {
                        formData[input.name || input.id] = input.value;
                    }
                } else if (input.type === 'checkbox') {
                    formData[input.id] = input.checked;
                } else {
                    formData[input.id] = input.value;
                }
            }
        });

        // Serialize Mitarbeiter data (specific to Gewerbeakte)
        if (this.currentPage === 'gewerbeakte') {
            formData.mitarbeiter = this.serializeMitarbeiter();
        }

        // Serialize selected radio groups (for Personenprüfung)
        if (this.currentPage === 'personenpruefung') {
            const selectedRadio = document.querySelector('input[name="ergebnis"]:checked');
            if (selectedRadio) {
                formData.ergebnis = selectedRadio.value;
            }
        }

        // Serialize current antrag type (for Antrag)
        if (this.currentPage === 'antrag') {
            const antragType = document.getElementById('antrag-type');
            if (antragType) {
                formData.currentAntragType = antragType.value;
            }
        }

        return formData;
    }

    serializeMitarbeiter() {
        const mitarbeiter = [];
        const sections = document.querySelectorAll('.mitarbeiter-section');
        
        sections.forEach((section, index) => {
            const vorname = section.querySelector(`[data-field="vorname"]`)?.value || '';
            const nachname = section.querySelector(`[data-field="nachname"]`)?.value || '';
            const telegram = section.querySelector(`[data-field="telegram"]`)?.value || '';
            
            if (vorname || nachname || telegram) {
                mitarbeiter.push({
                    index: index,
                    rolle: index === 0 ? 'Inhaber' : `${index}. Stellvertretung`,
                    vorname: vorname,
                    nachname: nachname,
                    telegram: telegram
                });
            }
        });

        return mitarbeiter;
    }

    isFormEmpty(formData) {
        // Check if form has any meaningful data
        for (const [key, value] of Object.entries(formData)) {
            if (value && value !== '' && value !== 'unknown') {
                if (key === 'mitarbeiter' && Array.isArray(value)) {
                    // Check if mitarbeiter array has any data
                    if (value.length > 0 && value.some(m => m.vorname || m.nachname || m.telegram)) {
                        return false;
                    }
                } else {
                    return false;
                }
            }
        }
        return true;
    }

    // ===== RECOVERY SYSTEM =====
    checkForRecovery() {
        if (!this.isEnabled) return;

        const autoSaveKey = `autosave_${this.currentPage}`;
        const savedData = sessionStorage.getItem(autoSaveKey);

        if (savedData) {
            try {
                const saveData = JSON.parse(savedData);
                const saveTime = new Date(saveData.timestamp);
                const timeDiff = Date.now() - saveTime.getTime();
                
                // Only offer recovery if save is less than 24 hours old
                if (timeDiff < 24 * 60 * 60 * 1000) {
                    this.showRecoveryDialog(saveData, saveTime);
                } else {
                    // Clean up old auto-save
                    sessionStorage.removeItem(autoSaveKey);
                }
            } catch (error) {
                console.error('❌ Recovery check failed:', error);
            }
        }
    }

    showRecoveryDialog(saveData, saveTime) {
        console.log('🔄 Showing recovery dialog');

        // Use existing popup system if available
        const popup = document.getElementById('popup-overlay');
        if (popup) {
            this.showRecoveryPopup(saveData, saveTime);
        } else {
            // Fallback to confirm dialog
            const timeStr = saveTime.toLocaleString('de-DE');
            const confirmed = confirm(
                `🔄 Nicht gespeicherte Änderungen gefunden!\n\n` +
                `Automatisch gespeichert: ${timeStr}\n\n` +
                `Möchten Sie Ihre letzte Arbeit wiederherstellen?`
            );
            
            if (confirmed) {
                this.restoreFormState(saveData);
            } else {
                this.clearAutoSave();
            }
        }
    }

    showRecoveryPopup(saveData, saveTime) {
        const popup = document.getElementById('popup-overlay');
        const title = document.getElementById('popup-title');
        const icon = document.getElementById('popup-icon');
        const message = document.getElementById('popup-message');
        const buttons = document.getElementById('popup-buttons');

        if (!popup || !title || !icon || !message || !buttons) {
            // Fallback to confirm
            return this.showRecoveryDialog(saveData, saveTime);
        }

        title.textContent = '🔄 Nicht gespeicherte Änderungen gefunden';
        icon.textContent = '💾';
        
        const timeStr = saveTime.toLocaleString('de-DE');
        message.innerHTML = `
            <div style="text-align: center;">
                <p>Möchten Sie Ihre letzte Arbeit wiederherstellen?</p>
                <small style="color: #D8C5B0;">Automatisch gespeichert: ${timeStr}</small>
            </div>
        `;

        buttons.innerHTML = `
            <button class="popup-button" onclick="window.autoSaveManager.restoreAndContinue()">
                ✅ Wiederherstellen
            </button>
            <button class="popup-button secondary" onclick="window.autoSaveManager.discardAndStart()">
                🗑️ Neu anfangen
            </button>
        `;
        buttons.style.display = 'flex';

        // Store save data for later use
        this.pendingRestore = saveData;

        popup.classList.add('active');
    }

    restoreAndContinue() {
        if (this.pendingRestore) {
            this.restoreFormState(this.pendingRestore);
            this.pendingRestore = null;
        }
        this.closePopup();
    }

    discardAndStart() {
        this.clearAutoSave();
        this.pendingRestore = null;
        this.closePopup();
    }

    closePopup() {
        const popup = document.getElementById('popup-overlay');
        if (popup) {
            popup.classList.remove('active');
        }
    }

    restoreFormState(saveData) {
        console.log('🔄 Restoring form state...');

        try {
            const formData = saveData.formData;

            // Restore regular form fields
            Object.entries(formData).forEach(([key, value]) => {
                if (key === 'mitarbeiter') {
                    this.restoreMitarbeiter(value);
                } else if (key === 'ergebnis') {
                    this.restoreErgebnis(value);
                } else if (key === 'currentAntragType') {
                    this.restoreAntragType(value);
                } else {
                    const element = document.getElementById(key);
                    if (element) {
                        if (element.type === 'checkbox') {
                            element.checked = value;
                        } else {
                            element.value = value;
                            // Trigger change event for dropdowns
                            element.dispatchEvent(new Event('change'));
                        }
                    }
                }
            });

            this.updateStatus('restored', 'Wiederhergestellt');
            console.log('✅ Form state restored successfully');

        } catch (error) {
            console.error('❌ Restore failed:', error);
            this.updateStatus('error', 'Wiederherstellung fehlgeschlagen');
        }
    }

    restoreMitarbeiter(mitarbeiterData) {
        if (!Array.isArray(mitarbeiterData)) return;

        // Clear existing stellvertreter first
        const container = document.getElementById('mitarbeiter-container');
        if (!container) return;

        const stellvertreterSections = container.querySelectorAll('.mitarbeiter-section:not(:first-child)');
        stellvertreterSections.forEach(section => section.remove());

        // Restore mitarbeiter data
        mitarbeiterData.forEach((mitarbeiter, index) => {
            if (index === 0) {
                // Restore Inhaber
                const inhaberSection = container.querySelector('.mitarbeiter-section:first-child');
                if (inhaberSection) {
                    this.fillMitarbeiterSection(inhaberSection, mitarbeiter, 0);
                }
            } else {
                // Add and restore Stellvertreter
                if (typeof window.addStellvertreter === 'function') {
                    window.addStellvertreter();
                    const newSection = container.querySelector('.mitarbeiter-section:last-child');
                    if (newSection) {
                        this.fillMitarbeiterSection(newSection, mitarbeiter, index);
                    }
                }
            }
        });

        // Update counters
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
        const vornameField = section.querySelector(`[data-field="vorname"]`);
        const nachnameField = section.querySelector(`[data-field="nachname"]`);
        const telegramField = section.querySelector(`[data-field="telegram"]`);

        if (vornameField) vornameField.value = mitarbeiter.vorname || '';
        if (nachnameField) nachnameField.value = mitarbeiter.nachname || '';
        if (telegramField) telegramField.value = mitarbeiter.telegram || '';
    }

    restoreErgebnis(ergebnisValue) {
        const radioButton = document.getElementById(ergebnisValue);
        if (radioButton) {
            radioButton.checked = true;
            const radioGroup = radioButton.closest('.radio-group');
            if (radioGroup) {
                // Clear all selections first
                document.querySelectorAll('.radio-group').forEach(group => {
                    group.classList.remove('selected');
                });
                // Select current group
                radioGroup.classList.add('selected');
            }
        }
    }

    restoreAntragType(antragType) {
        const antragSelect = document.getElementById('antrag-type');
        if (antragSelect && antragType) {
            antragSelect.value = antragType;
            antragSelect.dispatchEvent(new Event('change'));
            if (typeof window.switchAntragType === 'function') {
                setTimeout(() => window.switchAntragType(), 100);
            }
        }
    }

    // ===== STATUS MANAGEMENT =====
    addStatusIndicator() {
        // Only add if not already present
        if (document.getElementById('autosave-status')) return;

        const formSection = document.querySelector('.form-section');
        if (!formSection) return;

        const statusHtml = `
            <div class="autosave-status" id="autosave-status" style="
                background: rgba(35, 162, 162, 0.1);
                border: 1px solid rgba(35, 162, 162, 0.3);
                border-radius: 6px;
                padding: 0.5rem 1rem;
                margin-bottom: 1rem;
                display: flex;
                align-items: center;
                gap: 0.5rem;
                font-size: 0.9rem;
                color: #35A2A2;
                opacity: 0;
                transition: opacity 0.3s ease;
            ">
                <i class="fa-solid fa-clock" id="autosave-icon"></i>
                <span id="autosave-text">Auto-Save bereit</span>
                <small id="autosave-timestamp"></small>
            </div>
        `;

        formSection.insertAdjacentHTML('afterbegin', statusHtml);
        this.statusElement = document.getElementById('autosave-status');
    }

    updateStatus(status, text, showTime = true) {
        if (!this.statusElement) return;

        const icon = document.getElementById('autosave-icon');
        const textElement = document.getElementById('autosave-text');
        const timestamp = document.getElementById('autosave-timestamp');

        if (!icon || !textElement || !timestamp) return;

        // Update status
        this.statusElement.className = 'autosave-status';
        
        switch (status) {
            case 'saving':
                this.statusElement.classList.add('saving');
                icon.className = 'fa-solid fa-spinner fa-spin';
                textElement.textContent = text;
                timestamp.textContent = '';
                break;
                
            case 'saved':
                icon.className = 'fa-solid fa-check';
                textElement.textContent = text;
                if (showTime) {
                    const timeStr = new Date().toLocaleTimeString('de-DE', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                    });
                    timestamp.textContent = `um ${timeStr}`;
                }
                break;
                
            case 'restored':
                icon.className = 'fa-solid fa-undo';
                textElement.textContent = text;
                timestamp.textContent = '';
                break;
                
            case 'error':
                this.statusElement.classList.add('error');
                icon.className = 'fa-solid fa-exclamation-triangle';
                textElement.textContent = text;
                timestamp.textContent = '';
                break;
        }

        // Show status
        this.statusElement.style.opacity = '1';

        // Auto-hide after 5 seconds for non-error states
        if (status !== 'error') {
            setTimeout(() => {
                if (this.statusElement) {
                    this.statusElement.style.opacity = '0.7';
                }
            }, 5000);
        }
    }

    // ===== UTILITY METHODS =====
    clearAutoSave() {
        const autoSaveKey = `autosave_${this.currentPage}`;
        sessionStorage.removeItem(autoSaveKey);
        console.log('🗑️ Auto-save cleared');
    }

    manualSave() {
        return this.saveFormState('manual');
    }

    // ===== PUBLIC API =====
    enable() {
        this.isEnabled = true;
        this.startMonitoring();
        console.log('✅ Auto-Save enabled');
    }

    disable() {
        this.isEnabled = false;
        this.isMonitoring = false;
        if (this.saveTimeout) {
            clearTimeout(this.saveTimeout);
        }
        console.log('⏸️ Auto-Save disabled');
    }

    getStatus() {
        return {
            enabled: this.isEnabled,
            monitoring: this.isMonitoring,
            page: this.currentPage,
            lastSave: this.lastSaveTime,
            hasAutoSave: !!sessionStorage.getItem(`autosave_${this.currentPage}`)
        };
    }
}

// ===== INITIALIZATION =====
function initializeAutoSave() {
    if (!window.autoSaveManager && typeof AutoSaveManager !== 'undefined') {
        window.autoSaveManager = new AutoSaveManager();
        console.log('🎯 AutoSaveManager ready');
    }
    return window.autoSaveManager;
}

// Auto-Initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAutoSave);
} else {
    initializeAutoSave();
}

// Export for module environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AutoSaveManager, initializeAutoSave };
}