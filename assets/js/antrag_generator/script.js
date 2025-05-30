        let currentAntragType = '';

        // Switch Antrag Type
        function switchAntragType() {
            const selectedType = document.getElementById('antrag-type').value;
            const generateBtn = document.getElementById('generate-btn');
            const mainContainer = document.querySelector('.main-container');

            // Hide all forms
            document.querySelectorAll('.dynamic-form').forEach(form => {
                form.classList.remove('active');
            });

            // Clear preview
            clearPreview();

            if (selectedType) {
                // Show selected form
                const targetForm = document.getElementById(selectedType + '-form');
                if (targetForm) {
                    targetForm.classList.add('active');
                    generateBtn.disabled = false;
                    generateBtn.innerHTML = '<i class="fas fa-paper-plane"></i> ' + getAntragTypeName(selectedType) + ' generieren';
                    currentAntragType = selectedType;

                    // Aktiviere Grid-Layout
                    mainContainer.classList.add('has-active-form');

                    // Auto-generate Genehmigungs-Nummer for Gewerbekutsche
                    if (selectedType === 'gewerbekutsche') {
                        generateGenehmigungsNummer();
                    }
                }
            } else {
                generateBtn.disabled = true;
                generateBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Antrag generieren';
                currentAntragType = '';

                // Deaktiviere Grid-Layout
                mainContainer.classList.remove('has-active-form');
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
            document.getElementById('preview-output').innerHTML = `
                <div style="text-align: center; color: #D8C5B0; font-style: italic; padding: 2rem;">
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

            // For Gewerbetelegramm payment checkboxes - make them mutually exclusive
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

            // Highlight specific fields based on errors and current form type
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
            } else if (currentAntragType === 'gewerbeauslage') {
                if (errors.some(e => e.includes('Antragstellende Person'))) {
                    document.getElementById('gewerbeauslage-person').classList.add('error');
                }
                if (errors.some(e => e.includes('Telegrammnummer ist erforderlich'))) {
                    document.getElementById('gewerbeauslage-telegram').classList.add('error');
                }
                if (errors.some(e => e.includes('Gewerbe ist erforderlich'))) {
                    document.getElementById('gewerbeauslage-gewerbe').classList.add('error');
                }
            } else if (currentAntragType === 'gewerbekutsche') {
                if (errors.some(e => e.includes('Ausstellende Person'))) {
                    document.getElementById('gewerbekutsche-aussteller').classList.add('error');
                }
                if (errors.some(e => e.includes('Telegrammnummer des Ausstellers'))) {
                    document.getElementById('gewerbekutsche-aussteller-telegram').classList.add('error');
                }
                if (errors.some(e => e.includes('Antragstellende Person'))) {
                    document.getElementById('gewerbekutsche-person').classList.add('error');
                }
                if (errors.some(e => e.includes('Gewerbe ist erforderlich'))) {
                    document.getElementById('gewerbekutsche-gewerbe').classList.add('error');
                }
                if (errors.some(e => e.includes('Kutschen-Größe'))) {
                    document.getElementById('gewerbekutsche-groesse').classList.add('error');
                }
            } else if (currentAntragType === 'gewerbetelegramm') {
                if (errors.some(e => e.includes('Antragstellende Person'))) {
                    document.getElementById('gewerbetelegramm-person').classList.add('error');
                }
                if (errors.some(e => e.includes('Gewerbe ist erforderlich'))) {
                    document.getElementById('gewerbetelegramm-gewerbe').classList.add('error');
                }
                if (errors.some(e => e.includes('Telegrammnummer ist erforderlich'))) {
                    document.getElementById('gewerbetelegramm-telegram').classList.add('error');
                }
                if (errors.some(e => e.includes('Gewünschte Gewerbetelegrammnummer'))) {
                    document.getElementById('gewerbetelegramm-wunsch').classList.add('error');
                }
            }

            if (errors.some(e => e.includes('Antragstyp'))) {
                document.getElementById('antrag-type').classList.add('error');
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
            title.textContent = '🔄 Antrag wird generiert...';
            icon.textContent = '⚙️';
            message.textContent = 'Bitte warten Sie, während der Antrag formatiert wird...';
            message.className = 'popup-message';
            buttons.style.display = 'none';

            // Show popup
            popup.classList.add('active');

            // Simulate processing time
            setTimeout(() => {
                // Generate the document (validation already passed)
                generateAntrag();
                showSuccessPopup();
            }, 1500); // 1.5 second delay for better UX
        }

        // Show Success Popup
        function showSuccessPopup() {
            const title = document.getElementById('popup-title');
            const icon = document.getElementById('popup-icon');
            const message = document.getElementById('popup-message');
            const buttons = document.getElementById('popup-buttons');

            title.textContent = '✅ Antrag erfolgreich generiert!';
            icon.textContent = '🎉';
            message.innerHTML = `
                <span class="popup-success">Die Discord-Vorlage wurde erfolgreich erstellt!</span><br>
                Sie können sie jetzt in der Vorschau sehen und kopieren.
            `;
            buttons.innerHTML = `
                <button class="popup-button" onclick="closePopup()">✅ Verstanden</button>
                <button class="popup-button secondary" onclick="copyFromPopup()">📋 Jetzt kopieren</button>
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
            message.textContent = 'Der Antrag wird in die Zwischenablage kopiert...';
            message.className = 'popup-message';
            buttons.style.display = 'none';

            // Show popup
            popup.classList.add('active');

            // Simulate copying process
            setTimeout(() => {
                const output = document.getElementById('preview-output').textContent;

                // Check if output is empty or default
                if (output.trim() === '' ||
                    output.includes('Noch kein Antrag generiert') ||
                    output.includes('Wählen Sie einen Antragstyp aus')) {
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
                <span class="popup-success">Der Antrag wurde erfolgreich in die Zwischenablage kopiert!</span><br>
                Sie können ihn jetzt in Discord oder einem anderen Programm einfügen (Strg+V).
            `;
        }

        // Show Empty Content Popup
        function showEmptyContentPopup() {
            const title = document.getElementById('popup-title');
            const icon = document.getElementById('popup-icon');
            const message = document.getElementById('popup-message');
            const buttons = document.getElementById('popup-buttons');

            title.textContent = '📝 Kein Antrag vorhanden';
            icon.textContent = '📋';
            message.innerHTML = `
                <span style="color: #F4C066;">Es ist noch kein Antrag zum Kopieren vorhanden!</span><br>
                Bitte generieren Sie zuerst einen Antrag, bevor Sie ihn kopieren.
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

            document.getElementById('preview-output').textContent = output;
        }

        // Generate Gewerbeantrag
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

        // Generate Gewerbeauslage
        function generateGewerbeauslage() {
            const person = document.getElementById('gewerbeauslage-person').value.trim();
            const telegram = document.getElementById('gewerbeauslage-telegram').value.trim();
            const gewerbe = document.getElementById('gewerbeauslage-gewerbe').value.trim();

            let output = `Antragstellende Person:\n\`\`\`\n${person || '---'}\n\`\`\`\n`;
            output += `Telegrammnummer (Für Rückfragen):\n\`\`\`\n${telegram || '---'}\n\`\`\`\n`;
            output += `Für Gewerbe:\n\`\`\`\n${gewerbe || '---'}\n\`\`\``;

            return output;
        }

        // Generate Gewerbekutsche
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
            output += `Gewerbe:\n\`\`\`\n${gewerbe || '---'}\n\`\`\`\n`;
            output += `Kutschen Größe:\n\`\`\`\n${groesse || '---'}\n\`\`\`\n`;
            output += `Hiermit Genehmige ich, **${aussteller || 'NAME'}**,\nMitarbeiter des Gewerbeamts der Stadt\nSaint Denis, die Abholung der Gewerbekutsche`;

            return output;
        }

        // Generate Gewerbetelegramm
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

        // Copy to clipboard
        function copyToClipboard() {
            const output = document.getElementById('preview-output').textContent;

            // Check if output is empty or default
            if (output.includes('Noch kein Antrag generiert') || output.trim() === '') {
                alert('📝 Bitte generieren Sie zuerst einen Antrag!');
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

        // Close popup when clicking outside
        document.getElementById('popup-overlay').addEventListener('click', function(e) {
            if (e.target === this) {
                closePopup();
            }
        });

        // Remove error styling when user starts typing/selecting
        document.querySelectorAll('.form-input, .form-select').forEach(input => {
            input.addEventListener('input', function() {
                this.classList.remove('error');
            });

            input.addEventListener('change', function() {
                this.classList.remove('error');
            });
        });