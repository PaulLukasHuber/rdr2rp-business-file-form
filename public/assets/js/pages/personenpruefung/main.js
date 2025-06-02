// Set current date (but limited to 1899)
        const today = new Date();
        const currentMonth = String(today.getMonth() + 1).padStart(2, '0');
        const currentDay = String(today.getDate()).padStart(2, '0');

        // Use current month and day, but with year 1899
        document.getElementById('datum').value = `1899-${currentMonth}-${currentDay}`;

        // Select result function
        function selectResult(resultType) {
            // Remove selected class from all radio groups
            document.querySelectorAll('.radio-group').forEach(group => {
                group.classList.remove('selected');
            });

            // Add selected class to clicked group
            event.currentTarget.classList.add('selected');

            // Check the radio button
            document.getElementById(resultType).checked = true;
        }

        // Validate Form Function
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

            // Validate Datum
            const datum = document.getElementById('datum').value;
            if (!datum) {
                errors.push('Prüfungsdatum ist erforderlich');
            }

            // Validate Ergebnis
            const ergebnis = document.querySelector('input[name="ergebnis"]:checked');
            if (!ergebnis) {
                errors.push('Prüfungsergebnis muss ausgewählt werden');
            }

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
            if (errors.some(e => e.includes('Zu überprüfende Person'))) {
                document.getElementById('person').classList.add('error');
            }
            if (errors.some(e => e.includes('Telegrammnummer'))) {
                document.getElementById('telegram').classList.add('error');
            }
            if (errors.some(e => e.includes('Prüfungsdatum'))) {
                document.getElementById('datum').classList.add('error');
            }
            if (errors.some(e => e.includes('Prüfungsergebnis'))) {
                document.querySelectorAll('.radio-group').forEach(group => {
                    group.style.borderColor = '#FF8232';
                });
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
        }

        // Show Copy Popup - KORRIGIERT FÜR LEERE VALIDIERUNG
        function showCopyPopup() {
            const output = document.getElementById('preview-output').textContent;

            // KORRIGIERTE VALIDIERUNG - Prüft nach dem tatsächlichen HTML-Text
            if (output.trim() === '' ||
                output.includes('Noch keine Vorlage generiert') ||  // ← KORRIGIERT: Tatsächlicher HTML-Text
                output.includes('Füllen Sie das Formular aus')) {
                Toast.warning(
                    '📝 Keine Prüfungsakte vorhanden',
                    'Bitte generieren Sie zuerst eine Prüfungsakte, bevor Sie sie kopieren.'
                );
                return;
            }

            // Loading Toast
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

        // Generate Akte (korrigiert für separates Details-Feld)
        function generateAkte() {
            const person = document.getElementById('person').value.trim();
            const telegram = document.getElementById('telegram').value.trim();
            const pruefer = document.getElementById('pruefer').value.trim();
            const datum = document.getElementById('datum').value;
            const details = document.getElementById('details').value.trim();

            // Get selected result
            const ergebnisElement = document.querySelector('input[name="ergebnis"]:checked');
            let ergebnisText = '';

            if (ergebnisElement) {
                switch (ergebnisElement.value) {
                    case 'bestanden':
                        ergebnisText = '✅ Bestanden';
                        break;
                    case 'nicht-bestanden':
                        ergebnisText = '❌ Nicht bestanden';
                        break;
                    case 'ausstehend':
                        ergebnisText = '⏳ Prüfung ausstehend';
                        break;
                    default:
                        ergebnisText = '---';
                }
            }

            // Format output according to corrected template
            let output = `Zu überprüfende Person:\n\`\`\`\n${person || '---'}\n\`\`\`\n`;
            output += `Telegrammnummer (Für Rückfragen):\n\`\`\`\n${telegram || '---'}\n\`\`\`\n`;
            output += `Geprüft durch:\n\`\`\`\n${pruefer || '---'}\n\`\`\`\n`;
            output += `Geprüft am:\n\`\`\`\n${formatDate(datum) || '---'}\n\`\`\`\n`;
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
            if (output.includes('Noch keine Vorlage generiert') ||  // ← KORRIGIERT: Tatsächlicher HTML-Text
                output.trim() === '') {
                Toast.warning('📝 Keine Prüfungsakte vorhanden', 'Bitte generieren Sie zuerst eine Prüfungsakte!');
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
                Toast.copySuccess('Personenprüfungsakte');
            }).catch(() => {
                Toast.copyError('Clipboard-API nicht verfügbar. Bitte kopieren Sie den Text manuell.');
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