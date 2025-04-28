import React from 'react';
import { FormGroup } from '../FormGroup';

export const PersonDataTab = ({ formData, handleInputChange, errors, goToNextStep }) => {
  return (
    <>
      <div className="tab-info">
        <i className="fa fa-info-circle"></i>
        Geben Sie hier die Daten der zu überprüfenden Person ein. Nach Erstellung der Anfrage können Sie die Sheriffs kontaktieren.
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
      
      <div className="workflow-tip">
        <div className="tip-icon"><i className="fa fa-lightbulb"></i></div>
        <div className="tip-content">
          <h4>Hinweis zum Ablauf:</h4>
          <p>Nach dem Ausfüllen der Personendaten können Sie die Discord-Vorlage generieren und an die Sheriffs senden. Sobald Sie das Ergebnis der Überprüfung erhalten, tragen Sie es im nächsten Tab ein.</p>
        </div>
      </div>
      
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