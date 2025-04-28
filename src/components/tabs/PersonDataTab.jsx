import React from 'react';
import { FormGroup } from '../FormGroup';

export const PersonDataTab = ({ formData, handleInputChange, errors, goToNextStep }) => {
  return (
    <>
      <div className="workflow-tip">
        <div className="tip-icon"><i className="fa fa-lightbulb"></i></div>
        <div className="tip-content">
          <h4>Hinweis zum Ablauf:</h4>
          <p>Nachdem Sie die Personendaten ausgefüllt haben, erstellen Sie die Discord-Vorlage und laden sie im Discord unter dem Reiter „Anträge“ hoch. Nach Erhalt des Prüfergebnisses importieren Sie die vorhandene Akte, ergänzen das Ergebnis im nächsten Tab und ersetzen anschließend die ursprüngliche Akte im Reiter „Anträge“ durch die aktualisierte Version.</p>
        </div>
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