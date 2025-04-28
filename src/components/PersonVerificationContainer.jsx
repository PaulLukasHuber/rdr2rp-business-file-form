import React from 'react';
import { PersonVerificationTab } from './tabs/PersonVerificationTab';

export const PersonVerificationContainer = ({
  formData,
  handleInputChange,
  generateVerification,
  errors
}) => {
  return (
    <div className="form-container">
      <h1 className="two-line-header">
        <i className="fa fa-user-check"></i> 
        <span>Personen<wbr />prüfungs<wbr />akte</span>
      </h1>
      
      <div className="beta-warning">
        <div className="beta-badge">BETA</div>
        <div className="beta-message">
          <h3>Diese Funktion befindet sich noch in der Entwicklung</h3>
          <p>Das Formular kann noch nicht vollständig ausgefüllt werden und entspricht möglicherweise nicht der endgültigen Discord-Vorlage. Bitte prüfe die generierte Ausgabe sorgfältig.</p>
        </div>
      </div>
      
      <div className="verification-content">
        <PersonVerificationTab 
          formData={formData}
          handleInputChange={handleInputChange}
          errors={errors}
        />
      </div>
      
      <button onClick={generateVerification} className="btn-primary">
        <i className="fa fa-paper-plane"></i> Discord Vorlage generieren
      </button>
    </div>
  );
};