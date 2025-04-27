import React from 'react';

export const TabNav = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'tab1', icon: 'fa-info-circle', label: 'Allgemein' },
    { id: 'tab2', icon: 'fa-user-friends', label: 'Mitarbeiter' },
    { id: 'tab3', icon: 'fa-ellipsis-h', label: 'Weitere' }
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