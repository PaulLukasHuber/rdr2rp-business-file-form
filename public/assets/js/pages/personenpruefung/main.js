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

        // Show Form Validation Error Popup
        function showFormValidationError(errors) {
            const title = document.getElementById('popup-title');
            const icon = document.getElementById('popup-icon');
            const message = document.getElementById('popup-message');
            const buttons = document.getElementById('popup-buttons');

            title.textContent = '⚠️ Formular unvollständig';
            icon.textContent = '📝';

            let errorList = '<span style="color: #FF8232;">Bitte korrigieren Sie folgende Fehler:</span><br><br>';
            errorList += '<div style="text-align: left; padding-left: 1rem;">';
            errors.forEach(error => {
                errorList += `• ${error}<br>`;
            });
            errorList += '</div>';

            message.innerHTML = errorList;
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

        // Show Generate Popup
        function showGeneratePopup() {
            const popup = document.getElementById('popup-overlay');
            const title = document.getElementById('popup-title');
            const icon = document.getElementById('popup-icon');
            const message = document.getElementById('popup-message');
            const buttons = document.getElementById('popup-buttons');

            // First validate the form
            const validationErrors = validateForm();
            if (validationErrors.length > 0) {
                // Show popup immediately with errors
                popup.classList.add('active');
                showFormValidationError(validationErrors);
                return;
            }

            // Reset popup to loading state
            title.textContent = '🔄 Prüfungsakte wird generiert...';
            icon.textContent = '⚙️';
            message.textContent = 'Bitte warten Sie, während die Personenprüfungsakte formatiert wird...';
            message.className = 'popup-message';
            buttons.style.display = 'none';

            // Show popup
            popup.classList.add('active');

            // Simulate processing time
            setTimeout(() => {
                // Generate the document (validation already passed)
                generateAkte();
                showSuccessPopup();
            }, 1500); // 1.5 second delay for better UX
        }

        // Show Success Popup
        function showSuccessPopup() {
            const title = document.getElementById('popup-title');
            const icon = document.getElementById('popup-icon');
            const message = document.getElementById('popup-message');
            const buttons = document.getElementById('popup-buttons');

            title.textContent = '✅ Prüfungsakte erfolgreich generiert!';
            icon.textContent = '🎉';
            message.innerHTML = `
                <span class="popup-success">Die Discord-Vorlage wurde erfolgreich erstellt!</span><br>
                Sie können sie jetzt in der Vorschau sehen und kopieren.
            `;
            buttons.style.display = 'flex';
        }

        // Close Popup
        function closePopup() {
            const popup = document.getElementById('popup-overlay');
            popup.classList.remove('active');
        }

        // Copy from Popup
        function copyFromPopup() {
            copyToClipboard();
            closePopup();
        }

        // Show Copy Popup
        function showCopyPopup() {
            const popup = document.getElementById('popup-overlay');
            const title = document.getElementById('popup-title');
            const icon = document.getElementById('popup-icon');
            const message = document.getElementById('popup-message');
            const buttons = document.getElementById('popup-buttons');

            // Reset popup to loading state
            title.textContent = '📋 Wird kopiert...';
            icon.textContent = '📝';
            message.textContent = 'Die Prüfungsakte wird in die Zwischenablage kopiert...';
            message.className = 'popup-message';
            buttons.style.display = 'none';

            // Show popup
            popup.classList.add('active');

            // Simulate copying process
            setTimeout(() => {
                const output = document.getElementById('preview-output').textContent;

                // Check if output is empty or default
                if (output.trim() === '' ||
                    output.includes('Noch keine Prüfungsakte generiert') ||
                    output.includes('Füllen Sie das Formular aus')) {
                    showEmptyContentPopup();
                    return;
                }

                // Try to copy to clipboard
                navigator.clipboard.writeText(output).then(() => {
                    showCopySuccessPopup();
                }).catch(() => {
                    showCopyFailurePopup();
                });
            }, 1000); // 1 second delay
        }

        // Show Copy Success Popup
        function showCopySuccessPopup() {
            const title = document.getElementById('popup-title');
            const icon = document.getElementById('popup-icon');
            const message = document.getElementById('popup-message');
            const buttons = document.getElementById('popup-buttons');

            title.textContent = '✅ Erfolgreich kopiert!';
            icon.textContent = '🎉';
            message.innerHTML = `
                <span class="popup-success">Die Personenprüfungsakte wurde erfolgreich in die Zwischenablage kopiert!</span><br>
                Sie können sie jetzt in Discord oder einem anderen Programm einfügen (Strg+V).
            `;
        }

        // Show Empty Content Popup
        function showEmptyContentPopup() {
            const title = document.getElementById('popup-title');
            const icon = document.getElementById('popup-icon');
            const message = document.getElementById('popup-message');
            const buttons = document.getElementById('popup-buttons');

            title.textContent = '📝 Keine Prüfungsakte vorhanden';
            icon.textContent = '📋';
            message.innerHTML = `
                <span style="color: #F4C066;">Es ist noch keine Prüfungsakte zum Kopieren vorhanden!</span><br>
                Bitte generieren Sie zuerst die Prüfungsakte, bevor Sie sie kopieren.
            `;
        }

        // Show Copy Failure Popup
        function showCopyFailurePopup() {
            const title = document.getElementById('popup-title');
            const icon = document.getElementById('popup-icon');
            const message = document.getElementById('popup-message');
            const buttons = document.getElementById('popup-buttons');

            title.textContent = '⚠️ Kopieren fehlgeschlagen';
            icon.textContent = '🔧';
            message.innerHTML = `
                <span style="color: #FF8232;">Das Kopieren ist fehlgeschlagen!</span><br>
                Bitte versuchen Sie es erneut oder kopieren Sie den Text manuell aus der Vorschau.
            `;
            buttons.innerHTML = `
                <button class="popup-button" onclick="retryFromPopup()">🔄 Erneut versuchen</button>
                <button class="popup-button secondary" onclick="closePopup()">❌ Abbrechen</button>
            `;
            buttons.style.display = 'flex';
        }

        // Retry Copy from Popup
        function retryFromPopup() {
            closePopup();
            setTimeout(() => showCopyPopup(), 300);
        }

        // Close popup when clicking outside
        document.getElementById('popup-overlay').addEventListener('click', function(e) {
            if (e.target === this) {
                closePopup();
            }
        });

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

            document.getElementById('preview-output').textContent = output;
        }

        // Format date
        function formatDate(dateString) {
            if (!dateString) return '';
            const date = new Date(dateString);
            return date.toLocaleDateString('de-DE');
        }

        // Copy to clipboard
        function copyToClipboard() {
            const output = document.getElementById('preview-output').textContent;

            // Check if output is empty or default
            if (output.includes('Noch keine Prüfungsakte generiert') || output.trim() === '') {
                alert('📝 Bitte generieren Sie zuerst eine Prüfungsakte!');
                return;
            }

            navigator.clipboard.writeText(output).then(() => {
                const button = event.target;
                const originalText = button.textContent;
                button.textContent = '✅ Kopiert!';
                button.style.background = 'linear-gradient(135deg, #35A2A2 0%, #6F3E96 100%)';

                setTimeout(() => {
                    button.textContent = originalText;
                    button.style.background = 'linear-gradient(135deg, #F4C066 0%, #D99C45 100%)';
                }, 2000);
            }).catch(() => {
                alert('❌ Kopieren fehlgeschlagen. Bitte versuchen Sie es erneut.');
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