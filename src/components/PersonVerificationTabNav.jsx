import React from 'react';

export const PersonVerificationTabNav = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'person-tab', icon: 'fa-user', label: 'Personendaten' },
    { id: 'result-tab', icon: 'fa-clipboard-check', label: 'Prüfungsergebnis' }
  ];
  
  return (
    <div className="tabs">
      {tabs.map(tab => (
        <div 
          key={tab.id}
          className={`tab ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => setActiveTab(tab.id)}
        >
          <i className={`fa ${tab.icon}`}></i> {tab.label}
        </div>
      ))}
    </div>
  );
};