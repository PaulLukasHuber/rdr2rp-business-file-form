import React from 'react';
import { TabNav } from './TabNav';
import { GeneralTab } from './tabs/GeneralTab';
import { EmployeesTab } from './tabs/EmployeesTab';
import { OtherTab } from './tabs/OtherTab';

export const FormContainer = ({
  formData,
  activeTab,
  setActiveTab,
  handleInputChange,
  handleEmployeeChange,
  addEmployee,
  removeEmployee,
  generateLicense,
  operationsByCity,
  errors
}) => {
  return (
    <div className="form-container">
      <h1><i className="fa fa-id-card-alt"></i> Gewerbeakten-Formular</h1>
      
      <TabNav activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div id="tab1" className={`tab-content ${activeTab === 'tab1' ? 'active' : ''}`}>
        <GeneralTab 
          formData={formData}
          handleInputChange={handleInputChange}
          operationsByCity={operationsByCity}
          errors={errors}
        />
      </div>
      
      <div id="tab2" className={`tab-content ${activeTab === 'tab2' ? 'active' : ''}`}>
        <EmployeesTab 
          employees={formData.employees}
          handleEmployeeChange={handleEmployeeChange}
          addEmployee={addEmployee}
          removeEmployee={removeEmployee}
          errors={errors}
        />
      </div>
      
      <div id="tab3" className={`tab-content ${activeTab === 'tab3' ? 'active' : ''}`}>
        <OtherTab 
          formData={formData}
          handleInputChange={handleInputChange}
          errors={errors}
        />
      </div>
      
      <button onClick={generateLicense} className="btn-primary">
        <i className="fa fa-paper-plane"></i> Discord Vorlage generieren
      </button>
    </div>
  );
};