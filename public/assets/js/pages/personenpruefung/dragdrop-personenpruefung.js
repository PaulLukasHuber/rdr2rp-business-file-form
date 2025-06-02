// ===================================
// DRAG & DROP PERSONENPRÜFUNG HANDLER v8.0 - CLEAN REWRITE
// Komplett neue, saubere Implementation
// ===================================

class SimpleDragDropPersonenpruefung {
    constructor() {
        this.version = "8.0-clean";
        console.log("SimpleDragDropPersonenpruefung v" + this.version + " - Clean rewrite");
    }

    // ===== MAIN IMPORT HANDLER =====
    handleImport(text) {
        console.log("Starting import process...");
        
        try {
            // Schritt 1: Validierung
            if (!this.isValidPersonenpruefungsakte(text)) {
                console.log("Not a valid Personenprüfungsakte");
                this.showError();
                return false;
            }
            
            // Schritt 2: Daten extrahieren
            const data = this.extractAllData(text);
            if (!data || Object.keys(data).length === 0) {
                console.log("No data could be extracted");
                this.showError();
                return false;
            }
            
            // Schritt 3: Formular füllen
            this.fillFormWithData(data);
            
            // Schritt 4: Cleanup
            this.performCleanup();
            
            console.log("Import completed successfully");
            return true;
            
        } catch (error) {
            console.error("Import error:", error);
            this.showError();
            return false;
        }
    }

    // ===== VALIDATION =====
    isValidPersonenpruefungsakte(text) {
        const hasPersonField = text.includes("Zu überprüfende Person:");
        const hasResultField = text.includes("Prüfungsergebnis:");
        const hasTelegramField = text.includes("Telegramm");
        
        // Nicht eine Gewerbeakte
        const isNotGewerbeakte = !text.includes("Lizenznummer:") && 
                                !text.includes("Mitarbeiter (*Nur Inhaber") &&
                                !text.includes("Sondergenehmigung:");
        
        return hasPersonField && hasResultField && hasTelegramField && isNotGewerbeakte;
    }

    // ===== DATA EXTRACTION =====
    extractAllData(text) {
        const data = {};
        
        // Alle Felder extrahieren
        data.person = this.extractFieldValue(text, "Zu überprüfende Person:");
        data.telegram = this.extractFieldValue(text, "Telegrammnummer");
        data.pruefer = this.extractFieldValue(text, "Geprüft durch:");
        data.datum = this.extractFieldValue(text, "Geprüft am:");
        data.ergebnis = this.extractFieldValue(text, "Prüfungsergebnis:");
        data.details = this.extractFieldValue(text, "Detaillierte Bewertung");
        
        // Fallback für Details
        if (!data.details) {
            data.details = this.extractFieldValue(text, "Anmerkungen:");
        }
        
        // Ergebnis-Typ bestimmen
        if (data.ergebnis) {
            data.ergebnisType = this.determineResultType(data.ergebnis);
        }
        
        console.log("Extracted data:", data);
        return data;
    }

    extractFieldValue(text, fieldName) {
        const lines = text.split("\n");
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            
            if (line.toLowerCase().includes(fieldName.toLowerCase())) {
                // Suche in den nächsten Zeilen
                for (let j = i + 1; j < Math.min(i + 5, lines.length); j++) {
                    const nextLine = lines[j].trim();
                    
                    // Code block content
                    if (nextLine && nextLine !== "---" && nextLine !== "```" && 
                        !nextLine.includes(":") && nextLine.length > 1) {
                        return nextLine;
                    }
                }
                break;
            }
        }
        
        return null;
    }

    determineResultType(ergebnis) {
        const lower = ergebnis.toLowerCase();
        
        if (ergebnis.includes("❌") || lower.includes("nicht bestanden")) {
            return "nicht-bestanden";
        } else if (ergebnis.includes("✅") || (lower.includes("bestanden") && !lower.includes("nicht"))) {
            return "bestanden";
        } else if (ergebnis.includes("⏳") || lower.includes("ausstehend")) {
            return "ausstehend";
        }
        
        return null;
    }

    // ===== FORM FILLING =====
    fillFormWithData(data) {
        console.log("Filling form with data");
        
        // Basis-Felder
        this.setFieldValue("person", data.person);
        this.setFieldValue("telegram", data.telegram);
        
        // Radio Button und conditional fields
        if (data.ergebnisType) {
            this.setRadioButtonAndConditionalFields(data.ergebnisType, data);
        }
        
        // Aktuelles Datum setzen
        this.setCurrentDate();
    }

    setRadioButtonAndConditionalFields(resultType, data) {
        console.log("Setting radio button:", resultType);
        
        // Alle Radio-Gruppen zurücksetzen
        document.querySelectorAll(".radio-group").forEach(function(group) {
            group.classList.remove("selected");
        });
        
        document.querySelectorAll("input[name='ergebnis']").forEach(function(radio) {
            radio.checked = false;
        });
        
        // Target Radio aktivieren
        const targetRadio = document.getElementById(resultType);
        if (targetRadio) {
            targetRadio.checked = true;
            
            const parentGroup = targetRadio.closest(".radio-group");
            if (parentGroup) {
                parentGroup.classList.add("selected");
            }
            
            // Conditional fields handling
            const conditionalFields = document.getElementById("pruefungsdetails");
            
            if (resultType === "bestanden" || resultType === "nicht-bestanden") {
                // Felder anzeigen
                conditionalFields.classList.add("show");
                
                // Felder füllen
                if (data.pruefer) {
                    this.setFieldValue("pruefer", data.pruefer);
                }
                if (data.details) {
                    this.setFieldValue("details", data.details);
                }
                
            } else {
                // Felder verstecken und leeren
                conditionalFields.classList.remove("show");
                this.setFieldValue("pruefer", "");
                this.setFieldValue("details", "");
                document.getElementById("datum").value = "";
            }
        }
    }

    // ===== UTILITY FUNCTIONS =====
    setFieldValue(fieldId, value) {
        if (!value) return;
        
        const field = document.getElementById(fieldId);
        if (field) {
            field.value = value;
            field.dispatchEvent(new Event("input"));
            console.log("Set field " + fieldId + ":", value);
        }
    }

    setCurrentDate() {
        const today = new Date();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");
        const dateValue = "1899-" + month + "-" + day;
        
        const dateField = document.getElementById("datum");
        if (dateField) {
            dateField.value = dateValue;
        }
    }

    // ===== UI MANAGEMENT =====
    performCleanup() {
        // Import-Feld leeren
        const importField = document.getElementById("import-text");
        if (importField) {
            importField.value = "";
        }
        
        // Button-Status aktualisieren
        if (typeof checkImportText === "function") {
            checkImportText();
        }
        
        // Erfolg anzeigen
        this.showSuccess();
    }

    showSuccess() {
        if (typeof showImportSuccessPopup === "function") {
            showImportSuccessPopup();
        } else {
            console.log("Import successful!");
        }
    }

    showError() {
        if (typeof showPersonenprüfungImportErrorPopup === "function") {
            showPersonenprüfungImportErrorPopup();
        } else {
            console.log("Import failed!");
        }
    }
}

// ===== GLOBAL INTEGRATION =====
if (typeof window !== "undefined") {
    // Instanz erstellen
    window.SimpleDragDropPersonenpruefung = SimpleDragDropPersonenpruefung;
    window.DragDropPersonenpruefung = SimpleDragDropPersonenpruefung;
    
    // Globale Funktionen
    window.parsePersonenprüfungsakteText = function(text) {
        const handler = new SimpleDragDropPersonenpruefung();
        return handler.extractAllData(text);
    };
    
    window.fillPersonenprüfungsakteForm = function(data) {
        const handler = new SimpleDragDropPersonenpruefung();
        return handler.fillFormWithData(data);
    };
    
    // Test-Funktion
    window.testPersonenprüfungImport = function(testText) {
        const handler = new SimpleDragDropPersonenpruefung();
        return handler.handleImport(testText);
    };
}

// Export für Module
if (typeof module !== "undefined" && module.exports) {
    module.exports = { SimpleDragDropPersonenpruefung };
}