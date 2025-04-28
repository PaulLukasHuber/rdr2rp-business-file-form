import React from 'react';
import { FormGroup } from '../FormGroup';

export const PersonVerificationExaminerTab = ({ formData, handleInputChange, errors }) => {
  return (
    <>
      <div className="role-info examiner">
        <i className="fa fa-info-circle"></i>
        Hier können Sie als Prüfer die Prüfungsinformationen eingeben und das Prüfungsergebnis hinzufügen.
      </div>
      
      <FormGroup 
        id="checkedBy"
        label="Geprüft durch:"
        icon="fa-user-check"
        error={errors.checkedBy}
      >
        <input 
          type="text" 
          id="checkedBy" 
          placeholder="Name des Prüfers eingeben..." 
          value={formData.checkedBy}
          onChange={handleInputChange}
          className={errors.checkedBy ? 'input-error' : ''}
        />
      </FormGroup>
      
      <FormGroup 
        id="checkedDate"
        label="Geprüft am:"
        icon="fa-calendar-alt"
        error={errors.checkedDate}
      >
        <input 
          type="date" 
          id="checkedDate" 
          min="1899-01-01" 
          max="1899-12-31" 
          value={formData.checkedDate}
          onChange={handleInputChange}
          className={errors.checkedDate ? 'input-error' : ''}
        />
      </FormGroup>
      
      <FormGroup 
        id="checkResult"
        label="Prüfungsergebnis:"
        icon="fa-clipboard-check"
        error={errors.checkResult}
      >
        <textarea 
          id="checkResult" 
          rows="3" 
          placeholder="Ergebnis der Prüfung eingeben..." 
          value={formData.checkResult}
          onChange={handleInputChange}
          className={errors.checkResult ? 'input-error' : ''}
        />
      </FormGroup>
    </>
  );
};