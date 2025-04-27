import React from 'react';

export const EmployeeRow = ({ 
  index, 
  employee, 
  role, 
  handleEmployeeChange, 
  removeEmployee, 
  showRemoveButton,
  errors
}) => {
  const handleChange = (field, value) => {
    handleEmployeeChange(index, field, value);
  };
  
  // Get all errors for this employee
  const employeeErrors = [];
  if (errors[`employee_${index}_firstName`]) {
    employeeErrors.push(errors[`employee_${index}_firstName`]);
  }
  if (errors[`employee_${index}_lastName`]) {
    employeeErrors.push(errors[`employee_${index}_lastName`]);
  }
  if (errors[`employee_${index}_telegram`]) {
    employeeErrors.push(errors[`employee_${index}_telegram`]);
  }
  
  return (
    <div className="employee-wrapper">
      <div className="employee-header">
        <span className="employee-role">{role}</span>
        {showRemoveButton && (
          <button 
            type="button" 
            className="remove-employee-btn"
            onClick={() => removeEmployee(index)}
          >
            <i className="fa fa-trash"></i> Eintrag löschen
          </button>
        )}
      </div>
      
      <div className="employee-row">
        <input 
          type="text" 
          placeholder="Vorname" 
          className={`empFirstName ${errors[`employee_${index}_firstName`] ? 'input-error' : ''}`}
          value={employee.firstName}
          onChange={(e) => handleChange('firstName', e.target.value)}
          title="Vorname des Mitarbeiters"
        />
        
        <input 
          type="text" 
          placeholder="Nachname" 
          className={`empLastName ${errors[`employee_${index}_lastName`] ? 'input-error' : ''}`}
          value={employee.lastName}
          onChange={(e) => handleChange('lastName', e.target.value)}
          title="Nachname des Mitarbeiters"
        />
        
        <input 
          type="text" 
          placeholder="Telegramm-Nummer" 
          className={`empTelegram ${errors[`employee_${index}_telegram`] ? 'input-error' : ''}`}
          value={employee.telegram}
          onChange={(e) => handleChange('telegram', e.target.value)}
          title="Telegramm-Nummer (1-10 Ziffern)"
        />
      </div>
      
      {/* Display all employee errors at the bottom of the wrapper */}
      {employeeErrors.length > 0 && (
        <div className="employee-errors">
          {employeeErrors.map((error, i) => (
            <div key={i} className="error-message">
              <i className="fa fa-exclamation-circle"></i> {error}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};