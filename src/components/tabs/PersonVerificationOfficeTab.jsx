import React from 'react';
import { FormGroup } from '../FormGroup';

export const PersonVerificationOfficeTab = ({ formData, handleInputChange, errors, role }) => {
  return (
    <>
      <div className="role-info">
        <i className="fa fa-info-circle"></i>
        {role === 'office' 
          ? 'Als Gewerbeamt-Mitarbeiter geben Sie nur die Grundinformationen ein. Ein Prüfer wird später die Prüfungsinformationen hinzufügen.'
          : 'Hier können Sie die grundlegenden Personendaten bearbeiten.'}
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
      
      {role === 'office' && (
        <div className="verification-note">
          <i className="fa fa-info-circle"></i> Die Prüfungsinformationen werden später vom Prüfer hinzugefügt.
        </div>
      )}
    </>
  );
};