let stellvertreterCounter = 1;

        // Stadt-Betrieb Zuordnung
        const stadtBetriebe = {
            'AB': ['Mining Company', 'Saloon'],
            'AD': ['Bestatter', 'Brauerei', 'Büchsenmacher', 'Farm', 'Gestüt McFarlane', 'Jagdbund', 'Pizzeria (Event Gewerbe)', 'Saloon', 'Tierarzt'],
            'BW': ['Büchsenmacher', 'Farm', 'Metzger Manzanita Post', 'Schmied', 'Tabakhändler'],
            'CO': ['Büchsenmacher', 'Saloon', 'Schmied'],
            'RH': ['Brauerei', 'Farm', 'Jagdbund', 'Schmied'],
            'SB': ['Bäckerei', 'Gestüt Lavendel'],
            'SD': ['Bestatter', 'Bäckerei', 'Büchsenmacher', 'Gestüt Saint Denis', 'Gärtnerei', 'Holzfäller', 'Jagdbund', 'Kutschenbauer', 'Saloon', 'Tabakhändler', 'Theater', 'Train Company', 'Zeitung'],
            'TW': ['Mining Company'],
            'VA': ['Büchsenmacher', 'Farm', 'Gestüt Emerald', 'Schneider', 'Tierarzt']
        };

        // Tab switching
        function switchTab(tabName) {
            // Hide all tabs
            document.querySelectorAll('.tab-content').forEach(tab => {
                tab.classList.remove('active');
            });

            // Remove active class from all buttons
            document.querySelectorAll('.tab-button').forEach(btn => {
                btn.classList.remove('active');
            });

            // Show selected tab
            document.getElementById(tabName).classList.add('active');

            // Add active class to clicked button
            event.target.classList.add('active');
        }

        // Stadt selection handler
        document.getElementById('stadt').addEventListener('change', function() {
            const betriebSelect = document.getElementById('betrieb');
            const selectedStadt = this.value;

            // Clear betrieb options
            betriebSelect.innerHTML = '<option value="">— Bitte wählen —</option>';

            if (selectedStadt && stadtBetriebe[selectedStadt]) {
                stadtBetriebe[selectedStadt].forEach(betrieb => {
                    const option = document.createElement('option');
                    option.value = betrieb;
                    option.textContent = betrieb;
                    betriebSelect.appendChild(option);
                });
                betriebSelect.disabled = false;
            } else {
                betriebSelect.disabled = true;
            }
        });

        // Add Stellvertreter
        function addStellvertreter() {
            const container = document.getElementById('mitarbeiter-container');
            const currentStellvertreter = container.querySelectorAll('.mitarbeiter-section').length - 1; // -1 für Inhaber

            // Maximal 2 Stellvertreter erlauben
            if (currentStellvertreter >= 2) {
                Toast.warning('Maximum erreicht', 'Maximal 2 Stellvertreter erlaubt!');
                return;
            }

            const stellvertreterDiv = document.createElement('div');
            stellvertreterDiv.className = 'mitarbeiter-section';
            stellvertreterDiv.innerHTML = `
                <div class="mitarbeiter-header">
                    <span class="mitarbeiter-title">${stellvertreterCounter}. Stellvertretung</span>
                    <button class="delete-button" onclick="removeStellvertreter(this)"><i class="fa fa-trash"></i> Eintrag löschen</button>
                </div>
                <div class="mitarbeiter-fields">
                    <input type="text" class="form-input" placeholder="Vorname" data-field="vorname" data-index="${stellvertreterCounter}">
                    <input type="text" class="form-input" placeholder="Nachname" data-field="nachname" data-index="${stellvertreterCounter}">
                    <input type="text" class="form-input" placeholder="Telegramm-Nr." data-field="telegram" data-index="${stellvertreterCounter}">
                </div>
            `;

            container.appendChild(stellvertreterDiv);
            stellvertreterCounter++;
            updateLizenzAnzahl();
            updateAddButton();
        }

        // Remove Stellvertreter
        function removeStellvertreter(button) {
            button.closest('.mitarbeiter-section').remove();
            updateLizenzAnzahl();
            updateAddButton();
        }

        // Update license count
        function updateLizenzAnzahl() {
            const mitarbeiterSections = document.querySelectorAll('.mitarbeiter-section').length;
            document.getElementById('anzahl-lizenzen').value = mitarbeiterSections;
        }

        // Update Add Button State
        function updateAddButton() {
            const addButton = document.querySelector('.add-button');
            const container = document.getElementById('mitarbeiter-container');
            const currentStellvertreter = container.querySelectorAll('.mitarbeiter-section').length - 1; // -1 für Inhaber

            if (currentStellvertreter >= 2) {
                addButton.disabled = true;
                addButton.textContent = 'Maximum erreicht (2 Stellvertreter)';
                addButton.style.opacity = '0.6';
                addButton.style.cursor = 'not-allowed';
            } else {
                addButton.disabled = false;
                addButton.textContent = '+ Stellvertreter hinzufügen';
                addButton.style.opacity = '1';
                addButton.style.cursor = 'pointer';
            }
        }

        // Validate Form Function
        function validateForm() {
            const errors = [];

            // Validate Vermerk (URL)
            const vermerk = document.getElementById('vermerk').value.trim();
            if (!vermerk) {
                errors.push('Vermerk zum Gewerbeantrag ist erforderlich');
            } else if (!validateURL(document.getElementById('vermerk'))) {
                errors.push('Vermerk muss eine gültige URL sein (http:// oder https://)');
            }

            // Validate Stadt
            const stadt = document.getElementById('stadt').value;
            if (!stadt) {
                errors.push('Stadt-Kürzel muss ausgewählt werden');
            }

            // Validate Betrieb
            const betrieb = document.getElementById('betrieb').value;
            if (!betrieb) {
                errors.push('Betrieb muss ausgewählt werden');
            }

            // Validate Datum
            const datum = document.getElementById('datum').value;
            if (!datum) {
                errors.push('Ausstellungsdatum ist erforderlich');
            }

            // Validate Mitarbeiter (at least Inhaber)
            const inhaberVorname = document.querySelector('[data-field="vorname"][data-index="0"]').value.trim();
            const inhaberNachname = document.querySelector('[data-field="nachname"][data-index="0"]').value.trim();
            const inhaberTelegram = document.querySelector('[data-field="telegram"][data-index="0"]').value.trim();

            if (!inhaberVorname) {
                errors.push('Inhaber-Vorname ist erforderlich');
            }
            if (!inhaberNachname) {
                errors.push('Inhaber-Nachname ist erforderlich');
            }
            if (!inhaberTelegram) {
                errors.push('Inhaber-Telegrammnummer ist erforderlich');
            }

            // Validate Stellvertreter (if any exist, they must be complete)
            const stellvertreterSections = document.querySelectorAll('.mitarbeiter-section:not(:first-child)');
            stellvertreterSections.forEach((section, index) => {
                const vorname = section.querySelector('[data-field="vorname"]').value.trim();
                const nachname = section.querySelector('[data-field="nachname"]').value.trim();
                const telegram = section.querySelector('[data-field="telegram"]').value.trim();

                // If any field is filled, all must be filled
                if (vorname || nachname || telegram) {
                    if (!vorname) errors.push(`${index + 1}. Stellvertreter: Vorname fehlt`);
                    if (!nachname) errors.push(`${index + 1}. Stellvertreter: Nachname fehlt`);
                    if (!telegram) errors.push(`${index + 1}. Stellvertreter: Telegrammnummer fehlt`);
                }
            });

            return errors;
        }

        // Show Form Validation Error - ERSETZT MIT TOAST
        function showFormValidationError(errors) {
            Toast.validationError(errors);
            highlightErrors();
        }

        // Highlight Error Fields
        function highlightErrors() {
            // Remove previous error highlighting
            document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));

            const errors = validateForm();

            // Highlight specific fields based on errors
            if (errors.some(e => e.includes('Vermerk zum Gewerbeantrag'))) {
                document.getElementById('vermerk').classList.add('error');
            }
            if (errors.some(e => e.includes('Stadt-Kürzel'))) {
                document.getElementById('stadt').classList.add('error');
            }
            if (errors.some(e => e.includes('Betrieb'))) {
                document.getElementById('betrieb').classList.add('error');
            }
            if (errors.some(e => e.includes('Ausstellungsdatum'))) {
                document.getElementById('datum').classList.add('error');
            }
            if (errors.some(e => e.includes('Inhaber-Vorname'))) {
                document.querySelector('[data-field="vorname"][data-index="0"]').classList.add('error');
            }
            if (errors.some(e => e.includes('Inhaber-Nachname'))) {
                document.querySelector('[data-field="nachname"][data-index="0"]').classList.add('error');
            }
            if (errors.some(e => e.includes('Inhaber-Telegrammnummer'))) {
                document.querySelector('[data-field="telegram"][data-index="0"]').classList.add('error');
            }

            // Highlight Stellvertreter errors
            const stellvertreterSections = document.querySelectorAll('.mitarbeiter-section:not(:first-child)');
            stellvertreterSections.forEach((section, index) => {
                if (errors.some(e => e.includes(`${index + 1}. Stellvertreter: Vorname`))) {
                    section.querySelector('[data-field="vorname"]').classList.add('error');
                }
                if (errors.some(e => e.includes(`${index + 1}. Stellvertreter: Nachname`))) {
                    section.querySelector('[data-field="nachname"]').classList.add('error');
                }
                if (errors.some(e => e.includes(`${index + 1}. Stellvertreter: Telegrammnummer`))) {
                    section.querySelector('[data-field="telegram"]').classList.add('error');
                }
            });

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
            const loadingToast = Toast.generationProgress(
                '🔄 Vorlage wird generiert...',
                'Bitte warten Sie, während die Gewerbeakte formatiert wird...'
            );

            // Simulation der Generierung
            setTimeout(() => {
                Toast.dismiss(loadingToast);
                generateAkte(); // Bestehende Funktion

                // Prüfen ob Generation erfolgreich
                const output = document.getElementById('preview-output').textContent;
                if (output.includes('⚠️ Bitte korrigieren Sie zuerst den Vermerk-Link')) {
                    Toast.error(
                        '⚠️ Fehler bei der Generierung',
                        'Bitte überprüfen Sie den Vermerk-Link und stellen Sie sicher, dass alle Pflichtfelder ausgefüllt sind.'
                    );
                } else {
                    Toast.generationSuccess('Gewerbeakte');
                }
            }, 1500);
        }

        // Show Copy Popup - ERSETZT MIT TOAST
        function showCopyPopup() {
            // Validierung
            const vermerkInput = document.getElementById('vermerk');
            if (!validateURL(vermerkInput)) {
                Toast.copyError('Der Vermerk-Link ist ungültig');
                return;
            }

            const output = document.getElementById('preview-output').textContent;
            if (output.includes('⚠️ Bitte korrigieren Sie zuerst den Vermerk-Link')) {
                Toast.copyError('Bitte korrigieren Sie zuerst den Vermerk-Link');
                return;
            }

            if (output.trim() === '' || output.includes('Noch keine Vorlage generiert')) {
                Toast.warning(
                    '📝 Keine Vorlage vorhanden',
                    'Bitte generieren Sie zuerst eine Vorlage, bevor Sie sie kopieren.'
                );
                return;
            }

            // Loading Toast
            const loadingToast = Toast.copyProgress();

            // Simulation des Kopiervorgangs
            setTimeout(() => {
                Toast.dismiss(loadingToast);

                navigator.clipboard.writeText(output).then(() => {
                    Toast.copySuccess('Gewerbeakte');
                }).catch(() => {
                    Toast.copyError('Clipboard-API nicht verfügbar. Bitte kopieren Sie den Text manuell.');
                });
            }, 1000);
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

        // Generate Akte
        function generateAkte() {
            // Validiere URL vor der Generation
            const vermerkInput = document.getElementById('vermerk');
            if (!validateURL(vermerkInput)) {
                document.getElementById('preview-output').textContent = '⚠️ Bitte korrigieren Sie zuerst den Vermerk-Link, bevor Sie die Vorlage generieren können.';
                return;
            }

            const vermerk = document.getElementById('vermerk').value;
            const stadt = document.getElementById('stadt').value;
            const betrieb = document.getElementById('betrieb').value;
            const datum = document.getElementById('datum').value;
            const sondergenehmigung = document.getElementById('sondergenehmigung').value;
            const sonstiges = document.getElementById('sonstiges').value;
            const anzahlLizenzen = document.getElementById('anzahl-lizenzen').value;

            // Generate license number
            const lizenznummer = generateLizenznummer(stadt, betrieb);

            // Collect Mitarbeiter
            const mitarbeiter = [];
            document.querySelectorAll('.mitarbeiter-section').forEach((section, index) => {
                const vorname = section.querySelector('[data-field="vorname"]').value;
                const nachname = section.querySelector('[data-field="nachname"]').value;
                const telegram = section.querySelector('[data-field="telegram"]').value;

                if (vorname && nachname && telegram) {
                    const rolle = index === 0 ? 'Inhaber' : `${index}. Stellvertretung`;
                    mitarbeiter.push(`${rolle}: ${vorname} ${nachname} (${telegram})`);
                }
            });

            // Format output
            let output = `Vermerk zum Gewerbeantrag:\n\`\`\`\n${vermerk || '---'}\n\`\`\`\n`;
            output += `Lizenznummer:\n\`\`\`\n${lizenznummer}\n\`\`\`\n`;
            output += `Ausgestellt am (*Gültigkeit ab*):\n\`\`\`\n${formatDate(datum) || '---'}\n\`\`\`\n`;
            output += `Betrieb:\n\`\`\`\n${betrieb || '---'}\n\`\`\`\n`;
            output += `Mitarbeiter (*Nur Inhaber & evt. Stellvertretung* **:bangbang:MIT TELEGRAMM NUMMERN :bangbang:**)\n\`\`\`\n`;

            if (mitarbeiter.length > 0) {
                output += mitarbeiter.join('\n');
            } else {
                output += '---';
            }

            output += `\n\`\`\`\n`;
            output += `Anzahl der herausgebenden Lizenzen (*1x bei nur Inhaber, 2x bei Inhaber mit Stellvertretung, 3x bei Inhaber mit 2 Stellvertretungen*):\n\`\`\`\n${anzahlLizenzen}\n\`\`\`\n`;
            output += `Sondergenehmigung:\n\`\`\`\n${sondergenehmigung || '---'}\n\`\`\`\n`;
            output += `Sonstiges:\n\`\`\`\n${sonstiges || '---'}\n\`\`\``;

            document.getElementById('preview-output').textContent = output;
        }

        // Generate license number
        function generateLizenznummer(stadt, betrieb) {
            if (!stadt || !betrieb) return '---';

            const tag = String(new Date().getDate()).padStart(2, '0');
            const monat = String(new Date().getMonth() + 1).padStart(2, '0');
            const jahr = 1899; // Fixed year as per requirement
            const random = String(Math.floor(Math.random() * 1000)).padStart(3, '0');

            return `${stadt}-${betrieb.substring(0, 3).toUpperCase()}-${tag}${monat}${jahr}-${random}`;
        }

        // Format date
        function formatDate(dateString) {
            if (!dateString) return '';
            const date = new Date(dateString);
            return date.toLocaleDateString('de-DE');
        }

        // Copy to clipboard - UPDATED WITH TOAST INTEGRATION
        function copyToClipboard() {
            // Validiere URL vor dem Kopieren
            const vermerkInput = document.getElementById('vermerk');
            if (!validateURL(vermerkInput)) {
                Toast.copyError('Bitte korrigieren Sie zuerst den Vermerk-Link.');
                return;
            }

            const output = document.getElementById('preview-output').textContent;

            // Prüfen ob die Ausgabe einen Fehler enthält
            if (output.includes('⚠️ Bitte korrigieren Sie zuerst den Vermerk-Link')) {
                Toast.copyError('Bitte korrigieren Sie zuerst den Vermerk-Link.');
                return;
            }

            if (output.trim() === '' || output.includes('Noch keine Vorlage generiert')) {
                Toast.warning('📝 Keine Vorlage vorhanden', 'Bitte generieren Sie zuerst eine Vorlage.');
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
                Toast.copySuccess('Gewerbeakte');
            }).catch(() => {
                Toast.copyError('Clipboard-API nicht verfügbar. Bitte kopieren Sie den Text manuell.');
            });
        }

        // Validate URL function
        function validateURL(input) {
            const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
            const value = input.value.trim();
            const errorElement = document.getElementById('vermerk-error');

            if (value === '') {
                // Leeres Feld ist erlaubt
                input.style.borderColor = '#A85F3D';
                if (errorElement) errorElement.style.display = 'none';
                return true;
            }

            // Prüfen ob es mit http:// oder https:// beginnt
            if (!value.startsWith('http://') && !value.startsWith('https://')) {
                input.style.borderColor = '#FF8232';
                if (errorElement) errorElement.style.display = 'block';
                return false;
            }

            // Prüfen ob es eine gültige URL ist
            try {
                new URL(value);
                input.style.borderColor = '#35A2A2'; // Grün für gültig
                if (errorElement) errorElement.style.display = 'none';
                return true;
            } catch (e) {
                input.style.borderColor = '#FF8232';
                if (errorElement) errorElement.style.display = 'block';
                return false;
            }
        }

        // Set current date (but limited to 1899)
        const today = new Date();
        const currentMonth = String(today.getMonth() + 1).padStart(2, '0');
        const currentDay = String(today.getDate()).padStart(2, '0');

        // Use current month and day, but with year 1899
        document.getElementById('datum').value = `1899-${currentMonth}-${currentDay}`;

        // URL Validation Event Listeners
        document.getElementById('vermerk').addEventListener('input', function() {
            validateURL(this);
        });

        document.getElementById('vermerk').addEventListener('blur', function() {
            validateURL(this);
        });

        // Update license count on page load
        updateLizenzAnzahl();
        updateAddButton();