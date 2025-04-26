// File: assets/js/main.js
// ==============================
// Main application logic - initialize everything here

// Data constants
const operationsByCity = {
  AB: ['Mining Company Annesburg','Saloon Annesburg'],
  AD: ['Bestatter Armadillo','Bäckerei Armadillo','Brauerei Armadillo','Büchsenmacher Armadillo','Farm Armadillo','Gestüt Armadillo','Jagdbund Armadillo','Pizzeria Armadillo (Event Gewerbe)','Saloon Armadillo','Tierarzt Armadillo','Schneider Valentine'],
  BW: ['Metzger Blackwater','Büchsenmacher Blackwater','Tabakhändler Blackwater','Saloon Blackwater','Farm Blackwater'],
  CO: ['Schmied Colter','Saloon Colter'],
  RH: ['Jagdbund Rhodes','Schmied Rhodes','Farm Rhodes'],
  SB: ['Bäckerei Strawberry','Brauerei Strawberry','Gestüt Strawberry','Holzfäller Strawberry'],
  SD: ['Jagdbund Saint Denis','Bäckerei Saint Denis','Bestatter Saint Denis','Brauerei Valentine','Brauerei Saint Denis','Büchsenmacher Saint Denis','Gärtnerei Saint Denis','Gestüt Saint Denis','Kutschenbauer Saint Denis','Saloon Saint Denis','Tabakhändler Saint Denis','Theater Saint Denis','Train Company Saint Denis','Zeitung Saint Denis'],
  TW: ['Mining Company Tumbleweed'],
  VA: ['Farm Valentine','Brauerei Valentine','Saloon Valentine','Tierarzt Valentine','Büchsenmacher Valentine','Schneider Valentine']
};

// DOM elements
let discordOutput, generateBtn, copyBtn;

/**
 * Initializes the application
 */
function initApp() {
  // Initialize tab navigation
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab, .tab-content').forEach(el => el.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(tab.dataset.tab).classList.add('active');
    });
  });
  
  // Initialize city selection
  document.getElementById('cityCode').addEventListener('change', function() {
    const city = this.value;
    const op = document.getElementById('operation');
    op.innerHTML = city
      ? '<option value="">-- bitte Betrieb wählen --</option>'
      : '<option value="">-- zuerst Stadt wählen --</option>';
    (operationsByCity[city] || []).forEach(o => {
      const opt = document.createElement('option');
      opt.value = o;
      opt.textContent = o;
      op.appendChild(opt);
    });
  });
  
  // Get DOM references
  discordOutput = document.getElementById('discordOutput');
  generateBtn = document.getElementById('generateBtn');
  copyBtn = document.getElementById('copyBtn');
  
  // Initialize employees module
  window.employees.initEmployees();
  
  // Set up generate button
  generateBtn.addEventListener('click', generateLicense);
  
  // Set up copy button
  copyBtn.addEventListener('click', () => {
    if (discordOutput.value) {
      discordOutput.select();
      document.execCommand('copy');
      
      const originalText = copyBtn.innerHTML;
      copyBtn.innerHTML = '<i class="fa fa-check"></i> Kopiert!';
      
      setTimeout(() => {
        copyBtn.innerHTML = originalText;
      }, 2000);
    }
  });
  
  // Set default date if not set
  if (!document.getElementById('issuedDate').value) {
    const today = new Date();
    const year = 1899;
    const month = today.getMonth() + 1;
    const day = today.getDate();
    document.getElementById('issuedDate').value = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  }
  
  // Set up field validation events
  document.getElementById('note').addEventListener('blur', function() {
    window.validation.clearErrors();
    if (this.value.trim() && !window.validation.validateUrl(this.value.trim())) {
      window.validation.showError(this, 'Bitte geben Sie einen gültigen Link ein');
    }
  });
}

/**
 * Generates the business file form text from form data
 */
function generateLicense() {
  // Validate form first
  if (!window.validation.validateForm()) {
    // If validation fails, scroll to the first error
    const firstError = document.querySelector('.error-message');
    if (firstError) {
      firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    return;
  }
  
  // Get form values
  const note = document.getElementById('note').value.trim();
  const city = document.getElementById('cityCode').value;
  const operation = document.getElementById('operation').value;
  const license = city + ' - ' + window.utils.generateRandomString(8);
  const issued = document.getElementById('issuedDate').value || '---';
  const specialPermit = document.getElementById('specialPermit').value.trim() || '---';
  const other = document.getElementById('other').value.trim() || '---';
  
  // Get employee data
  const employees = window.employees.getEmployeeData().join('\n');
  
  // Generate discord template
  const template =
    `Vermerk zum Gewerbeantrag:\n\`\`\`${note}\`\`\`\n` +
    `Lizenznummer:\n\`\`\`${license}\`\`\`\n` +
    `Ausgestellt am (*Gültigkeit ab*):\n\`\`\`${issued}\`\`\`\n` +
    `Betrieb:\n\`\`\`${operation}\`\`\`\n` +
    `Mitarbeiter (Inhaber & Stellvertretungen):\n\`\`\`${employees}\`\`\`\n` +
    `Anzahl der herausgegebenen Lizenzen:\n\`\`\`${document.getElementById('licenseCount').value}\`\`\`\n` +
    `Sondergenehmigung:\n\`\`\`${specialPermit}\`\`\`\n` +
    `Sonstiges:\n\`\`\`${other}\`\`\``;
  
  // Update output
  discordOutput.value = template;
  
  // Show success message
  window.utils.showSuccessMessage('Lizenz erfolgreich generiert!');
  
  // Scroll to preview on small screens
  if (window.innerWidth <= 968) {
    document.querySelector('.preview-container').scrollIntoView({ behavior: 'smooth' });
  }
}

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', initApp);