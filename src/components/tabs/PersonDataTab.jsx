import React from 'react';
import { FormGroup } from '../FormGroup';

export const PersonDataTab = ({ formData, handleInputChange, errors, goToNextStep }) => {
  return (
    <>
      <div className="tab-info result-tab-info">
        <i className="fa fa-info-circle"></i>
        Hier tragen Sie die Personenbezogenen Daten ein, welche im Anschluss von einem Sheriff oder Deputy bearbeitet werden.
      </div>

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
      
      <div className="tab-actions">
        <button 
          className="btn-secondary next-step-button" 
          onClick={goToNextStep}
        >
          Zum Ergebnis-Tab <i className="fa fa-arrow-right"></i>
        </button>
      </div>
    </>
  );
};