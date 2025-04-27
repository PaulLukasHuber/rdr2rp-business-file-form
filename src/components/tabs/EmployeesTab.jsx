import React from 'react';
import { FormGroup } from '../FormGroup';
import { EmployeeRow } from '../EmployeeRow';

export const EmployeesTab = ({ 
  employees, 
  handleEmployeeChange, 
  addEmployee, 
  removeEmployee,
  errors 
}) => {
  const roles = ['Inhaber', '1. Stellvertretung', '2. Stellvertretung'];
  
  return (
    <>
      <FormGroup 
        id="employees"
        label="Mitarbeiter (Inhaber & Stellvertretungen):"
        icon="fa-users"
      >
        <div id="employees-container">
          {employees.map((employee, index) => (
            <EmployeeRow 
              key={index}
              index={index}
              employee={employee}
              role={roles[index]}
              handleEmployeeChange={handleEmployeeChange}
              removeEmployee={removeEmployee}
              showRemoveButton={index > 0 && employees.length > 1}
              errors={errors}
            />
          ))}
        </div>
        
        {employees.length < 3 && (
          <button 
            type="button" 
            className="btn-secondary"
            onClick={addEmployee}
          >
            <i className="fa fa-plus"></i> Stellvertreter hinzufügen
          </button>
        )}
      </FormGroup>
      
      <FormGroup 
        id="licenseCount"
        label="Anzahl der herausgegebenen Lizenzen:"
        icon="fa-hashtag"
      >
        <input 
          type="number" 
          id="licenseCount" 
          value={employees.length}
          readOnly
        />
      </FormGroup>
    </>
  );
};