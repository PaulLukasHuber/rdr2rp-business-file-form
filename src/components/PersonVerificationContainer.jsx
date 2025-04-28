import React, { useState } from 'react';
import { PersonVerificationTabNav } from './PersonVerificationTabNav';
import { PersonVerificationOfficeTab } from './tabs/PersonVerificationOfficeTab';
import { PersonVerificationExaminerTab } from './tabs/PersonVerificationExaminerTab';
import { DiscordImport } from './DiscordImport';

export const PersonVerificationContainer = ({
  formData,
  handleInputChange,
  generateVerification,
  errors,
  role,
  setRole,
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
          <h3>Diese Funktion befindet sich noch in der Entwicklung</h3>
          <p>Das Formular kann je nach Rolle unterschiedlich ausgefüllt werden. Prüfe die generierte Ausgabe sorgfältig.</p>
        </div>
      </div>
      
      <div className="role-selector">
        <button 
          className={`role-button ${role === 'office' ? 'active' : ''}`} 
          onClick={() => {
            setRole('office');
            setActiveTab('person-tab'); // Bei Wechsel zu Office immer zum ersten Tab
          }}
        >
          <i className="fa fa-building"></i> Gewerbeamt-Mitarbeiter
        </button>
        <button 
          className={`role-button ${role === 'examiner' ? 'active' : ''}`} 
          onClick={() => setRole('examiner')}
        >
          <i className="fa fa-clipboard-check"></i> Prüfer
        </button>
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
          role={role}
        />
      )}
      
      {/* Tab-Navigation */}
      <PersonVerificationTabNav 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        role={role}
      />
      
      {/* Tab-Inhalte */}
      <div id="person-tab" className={`tab-content ${activeTab === 'person-tab' ? 'active' : ''}`}>
        <PersonVerificationOfficeTab 
          formData={formData}
          handleInputChange={handleInputChange}
          errors={errors}
          role={role}
        />
      </div>
      
      {role === 'examiner' && (
        <div id="examiner-tab" className={`tab-content ${activeTab === 'examiner-tab' ? 'active' : ''}`}>
          <PersonVerificationExaminerTab 
            formData={formData}
            handleInputChange={handleInputChange}
            errors={errors}
          />
        </div>
      )}
      
      <button onClick={generateVerification} className="btn-primary">
        <i className="fa fa-paper-plane"></i> Discord Vorlage generieren
      </button>
    </div>
  );
};