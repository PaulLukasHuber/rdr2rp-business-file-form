import React from 'react';

export const PersonVerificationTabNav = ({ activeTab, setActiveTab, role }) => {
  const tabs = [
    { id: 'person-tab', icon: 'fa-user', label: 'Personendaten' },
    { id: 'examiner-tab', icon: 'fa-star', label: 'Überprüfungsdaten', onlyExaminer: true }
  ];
  
  return (
    <div className="tabs">
      {tabs.map(tab => (
        // Nur anzeigen, wenn es kein Sheriff-exklusiver Tab ist oder wenn die Rolle "examiner" ist
        (!tab.onlyExaminer || role === 'examiner') && (
          <div 
            key={tab.id}
            className={`tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <i className={`fa ${tab.icon}`}></i> {tab.label}
          </div>
        )
      ))}
    </div>
  );
};