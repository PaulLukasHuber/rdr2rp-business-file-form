// File: assets/js/employees.js
// Copyright (c) 2025 Paul-Lukas Huber and Tobias Schmidt
// MIT License - see LICENSE file for details
  // ==============================
  // Employee management functions
  
  // Constants
  const maxEmployees = 3;
  const roles = ['Inhaber', '1. Stellvertretung', '2. Stellvertretung'];
  
  // DOM references
  let container, addBtn, licenseCountInput;
  
  /**
   * Initializes employee management
   * @param {Object} options - Configuration options
   */
  function initEmployees(options = {}) {
    container = document.getElementById('employees-container');
    addBtn = document.getElementById('addEmployeeBtn');
    licenseCountInput = document.getElementById('licenseCount');
    
    // Add initial employee row
    container.appendChild(createEmployeeRow());
    updateEmployees();
    
    // Set up event listeners
    addBtn.addEventListener('click', () => {
      if (container.children.length < maxEmployees) {
        container.appendChild(createEmployeeRow());
        updateEmployees();
      }
    });
  }
  
  /**
   * Creates a new employee row
   * @return {HTMLElement} Employee row element
   */
  function createEmployeeRow() {
    const idx = container.children.length;
    const wrapper = document.createElement('div');
    wrapper.className = 'employee-wrapper';
    
    const header = document.createElement('div');
    header.className = 'employee-header';
    
    const roleLabel = document.createElement('span');
    roleLabel.className = 'employee-role';
    roleLabel.textContent = roles[idx] || '';
    
    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'remove-employee-btn';
    removeBtn.innerHTML = '<i class="fa fa-trash"></i> Eintrag löschen';
    removeBtn.addEventListener('click', () => {
      if (container.children.length > 1) {
        wrapper.remove();
        updateEmployees();
      }
    });
    
    header.append(roleLabel, removeBtn);
    wrapper.appendChild(header);
  
    const row = document.createElement('div');
    row.className = 'employee-row';
    
    // Field definitions with validation attributes
    const fieldDefinitions = [
      {
        placeholder: 'Vorname', 
        className: 'empFirstName',
        required: idx === 0, // Only required for the first employee (Inhaber)
        title: 'Vorname des Mitarbeiters'
      },
      {
        placeholder: 'Nachname', 
        className: 'empLastName',
        required: idx === 0, // Only required for the first employee (Inhaber)
        title: 'Nachname des Mitarbeiters'
      },
      {
        placeholder: 'Telegramm-Nummer', 
        className: 'empTelegram',
        pattern: '\\d{1,10}',
        title: 'Telegramm-Nummer (1-10 Ziffern)'
      }
    ];
    
    // Create inputs with enhanced attributes
    fieldDefinitions.forEach(def => {
      const inp = document.createElement('input');
      inp.type = 'text';
      inp.placeholder = def.placeholder;
      inp.className = def.className;
      
      // Add validation attributes
      if (def.required) inp.setAttribute('required', '');
      if (def.pattern) inp.setAttribute('pattern', def.pattern);
      if (def.title) inp.setAttribute('title', def.title);
      
      // Add event listeners for validation
      inp.addEventListener('focus', function() {
        this.classList.remove('input-error');
        const errorMsg = this.parentNode.querySelector('.error-message');
        if (errorMsg) errorMsg.remove();
      });
      
      // For telegram field add specific validation
      if (def.className === 'empTelegram') {
        inp.addEventListener('blur', function() {
          const value = this.value.trim();
          if (value && value !== '---' && !window.validation.validateTelegramNumber(value)) {
            window.validation.showError(this, 'Telegramm-Nummer muss zwischen 1 und 10 Ziffern haben');
          }
        });
      }
      
      row.appendChild(inp);
    });
    
    wrapper.appendChild(row);
    return wrapper;
  }
  
  /**
   * Updates employee UI after changes
   */
  function updateEmployees() {
    const rows = container.querySelectorAll('.employee-wrapper');
    rows.forEach((w, i) => {
      w.querySelector('.employee-role').textContent = roles[i] || '';
      w.querySelector('.remove-employee-btn').style.display = (i > 0 && rows.length > 1) ? 'inline-flex' : 'none';
    });
    
    // Hide button instead of just disabling it when maximum is reached
    if (rows.length >= maxEmployees) {
      addBtn.style.display = 'none';
    } else {
      addBtn.style.display = 'flex';
    }
    
    licenseCountInput.value = rows.length;
  }
  
  /**
   * Gets all employee data in formatted array
   * @return {Array} Formatted employee data
   */
  function getEmployeeData() {
    return [...container.querySelectorAll('.employee-row')].map(r => {
      const fn = r.querySelector('.empFirstName').value.trim() || '---';
      const ln = r.querySelector('.empLastName').value.trim() || '---';
      const tg = r.querySelector('.empTelegram').value.trim() || '---';
      return `${fn} ${ln} - ${tg}`;
    });
  }
  
  // Export employee functions
  window.employees = {
    initEmployees,
    createEmployeeRow,
    updateEmployees,
    getEmployeeData,
    maxEmployees,
    roles
  };