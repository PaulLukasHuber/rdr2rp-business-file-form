import React, { useState } from 'react';
import { PersonVerificationTabNav } from './PersonVerificationTabNav';
import { PersonDataTab } from './tabs/PersonDataTab';
import { CheckResultTab } from './tabs/CheckResultTab';
import { DiscordImport } from './DiscordImport';

export const PersonVerificationContainer = ({
  formData,
  handleInputChange,
  generateVerification,
  errors,
  handleDiscordImport
}) => {
  const [showImport, setShowImport] = useState(false);
  const [activeTab, setActiveTab] = useState('person-tab');

  return (
    <div className="form-container">
      <h1 className="two-line-header">
        <i className="fa fa-user-check"></i> 
        <span>Personen<wbr />prüfungs<wbr />akte</span>
      </h1>
      
      <div className="beta-warning">
        <div className="beta-badge">BETA</div>
        <div className="beta-message">
          <h3>Personenprüfungen für Gewerbeanmeldungen</h3>
          <p>Dieses Formular hilft bei der Dokumentation von Personenüberprüfungen durch die Sheriffs. Erstellen Sie zuerst die Anfrage und tragen Sie später das Prüfungsergebnis ein.</p>
        </div>
      </div>
      
      <div className="workflow-status">
        <div className="workflow-steps">
          <div className={`workflow-step ${activeTab === 'person-tab' ? 'active' : 'completed'}`}>
            <span className="step-number">1</span>
            <span className="step-text">Personendaten erfassen</span>
          </div>
          <div className={`workflow-step ${activeTab === 'result-tab' ? 'active' : ''}`}>
            <span className="step-number">2</span>
            <span className="step-text">Prüfungsergebnis eintragen</span>
          </div>
        </div>
      </div>
      
      <button 
        className="toggle-import-button" 
        onClick={() => setShowImport(!showImport)}
      >
        <i className={`fa ${showImport ? 'fa-chevron-up' : 'fa-file-import'}`}></i> 
        {showImport ? 'Import ausblenden' : 'Discord-Nachricht importieren'}
      </button>
      
      {showImport && (
        <DiscordImport 
          handleDiscordImport={handleDiscordImport} 
          hasCheckResult={formData.checkResult !== ''}
        />
      )}
      
      {/* Tab-Navigation */}
      <PersonVerificationTabNav 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
      />
      
      {/* Tab-Inhalte */}
      <div id="person-tab" className={`tab-content ${activeTab === 'person-tab' ? 'active' : ''}`}>
        <PersonDataTab 
          formData={formData}
          handleInputChange={handleInputChange}
          errors={errors}
          goToNextStep={() => setActiveTab('result-tab')}
        />
      </div>
      
      <div id="result-tab" className={`tab-content ${activeTab === 'result-tab' ? 'active' : ''}`}>
        <CheckResultTab 
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