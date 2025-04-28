import React from 'react';
import { FormGroup } from '../FormGroup';

export const PersonVerificationTab = ({ formData, handleInputChange, errors }) => {
  return (
    <>
      <FormGroup 
        id="personName"
        label="Zu überprüfende Person:"
        icon="fa-user"
        error={errors.personName}
      >
        <input 
          type="text" 
          id="personName" 
          placeholder="Vor- und Nachname eingeben..." 
          value={formData.personName}
          onChange={handleInputChange}
          className={errors.personName ? 'input-error' : ''}
        />
      </FormGroup>
      
      <FormGroup 
        id="telegramNumber"
        label="Telegrammnummer (Für Rückfragen):"
        icon="fa-paper-plane"
        error={errors.telegramNumber}
      >
        <input 
          type="text" 
          id="telegramNumber" 
          placeholder="Telegrammnummer eingeben..." 
          value={formData.telegramNumber}
          onChange={handleInputChange}
          className={errors.telegramNumber ? 'input-error' : ''}
        />
      </FormGroup>
      
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
      
      <div className="verification-note">
        <i className="fa fa-info-circle"></i> Das Prüfungsergebnis wird später hinzugefügt und ist kein Teil dieses Formulars.
      </div>
    </>
  );
};