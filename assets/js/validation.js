// File: assets/js/validation.js
// Copyright (c) 2025 Paul-Lukas Huber and Tobias Schmidt
// MIT License - see LICENSE file for details
// ==============================
// Form validation functions

/**
 * Creates an error message element
 * @param {string} message - Error message text
 * @return {HTMLElement} Error message element
 */
function createErrorMessage(message) {
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-message';
  errorDiv.innerHTML = `<i class="fa fa-exclamation-circle"></i> ${message}`;
  return errorDiv;
}

/**
 * Removes all error messages and styling
 */
function clearErrors() {
  document.querySelectorAll('.error-message').forEach(el => el.remove());
  document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
}

/**
 * Displays an error message for an element
 * @param {HTMLElement} element - Element with error
 * @param {string} message - Error message text
 * @return {boolean} Always returns false for chaining
 */
function showError(element, message) {
  element.classList.add('input-error');
  const errorMessage = createErrorMessage(message);
  element.parentNode.appendChild(errorMessage);
  return false;
}

/**
 * Validates a URL string
 * @param {string} url - URL to validate
 * @return {boolean} Whether URL is valid
 */
function validateUrl(url) {
  const pattern = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;
  return pattern.test(url);
}

/**
 * Validates a telegram number
 * @param {string} number - Telegram number to validate
 * @return {boolean} Whether number is valid
 */
function validateTelegramNumber(number) {
  return /^\d{1,10}$/.test(number.trim()) || number.trim() === "" || number.trim() === "---";
}

/**
 * Validates the entire form
 * @return {boolean} Whether form is valid
 */
function validateForm() {
  clearErrors();
  let isValid = true;
  
  // Validating note (link)
  const noteInput = document.getElementById('note');
  const noteValue = noteInput.value.trim();
  if (!noteValue) {
    isValid = showError(noteInput, 'Bitte geben Sie einen Link ein');
  } else if (!validateUrl(noteValue)) {
    isValid = showError(noteInput, 'Bitte geben Sie einen gültigen Link ein');
  }
  
  // Validating city
  const citySelect = document.getElementById('cityCode');
  if (!citySelect.value) {
    isValid = showError(citySelect, 'Bitte wählen Sie eine Stadt');
  }
  
  // Validating operation
  const operationSelect = document.getElementById('operation');
  if (!operationSelect.value) {
    isValid = showError(operationSelect, 'Bitte wählen Sie einen Betrieb');
  }
  
  // Validating date
  const dateInput = document.getElementById('issuedDate');
  if (!dateInput.value) {
    isValid = showError(dateInput, 'Bitte wählen Sie ein Datum');
  }
  
  // Validating employees
  const employeeContainers = document.querySelectorAll('.employee-wrapper');
  employeeContainers.forEach((container, index) => {
    const firstNameInput = container.querySelector('.empFirstName');
    const lastNameInput = container.querySelector('.empLastName');
    const telegramInput = container.querySelector('.empTelegram');
    
    // First employee (Inhaber) is required
    if (index === 0) {
      if (!firstNameInput.value.trim()) {
        isValid = showError(firstNameInput, 'Vorname ist erforderlich');
      }
      
      if (!lastNameInput.value.trim()) {
        isValid = showError(lastNameInput, 'Nachname ist erforderlich');
      }
    }
    
    // Validate telegram format if provided
    const telegramValue = telegramInput.value.trim();
    if (telegramValue && telegramValue !== "---" && !validateTelegramNumber(telegramValue)) {
      isValid = showError(telegramInput, 'Telegramm-Nummer muss zwischen 1 und 10 Ziffern haben');
    }
  });
  
  return isValid;
}

// Export validation functions
window.validation = {
  clearErrors,
  showError,
  validateUrl,
  validateTelegramNumber,
  validateForm
};