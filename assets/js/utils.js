// File: assets/js/utils.js
// ==============================
// Utility functions used across the application

/**
 * Generates a random string of specified length
 * @param {number} length - Length of the string to generate
 * @return {string} Random string
 */
function generateRandomString(length) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Displays a success message that fades out after a delay
 * @param {string} message - The message to display
 * @param {number} duration - How long to show the message in ms
 */
function showSuccessMessage(message, duration = 3000) {
  const successDiv = document.createElement('div');
  successDiv.className = 'success-message';
  successDiv.innerHTML = `<i class="fa fa-check-circle"></i> ${message}`;
  
  // Add to form container
  const formContainer = document.querySelector('.form-container');
  formContainer.insertBefore(successDiv, formContainer.firstChild);
  
  // Auto remove after specified duration
  setTimeout(() => {
    successDiv.classList.add('fade-out');
    setTimeout(() => successDiv.remove(), 500);
  }, duration);
}

/**
 * Copies text to clipboard
 * @param {string} text - Text to copy
 * @return {boolean} Success status
 */
function copyToClipboard(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  const success = document.execCommand('copy');
  document.body.removeChild(textarea);
  return success;
}

// Export functions to make them available to other modules
window.utils = {
  generateRandomString,
  showSuccessMessage,
  copyToClipboard
};