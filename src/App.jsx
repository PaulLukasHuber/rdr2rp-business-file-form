import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { FormContainer } from './components/FormContainer';
import { PreviewContainer } from './components/PreviewContainer';
import { Footer } from './components/Footer';
import { BetaToast } from './components/BetaToast';
import { HomePage } from './components/HomePage';

// Data constants for the application
const operationsByCity = {
  AB: ['Mining Company','Saloon'],
  AD: ['Bestatter','Brauer','Büchsenmacher','Farm','Gestüt','Jagdbund','Pizzeria (Event Gewerbe)','Saloon','Tierarzt'],
  BW: ['Büchsenmacher','Farm','Metzger','Saloon','Schmied','Tabakhändler'],
  CO: ['Büchsenmacher','Saloon','Schmied'],
  RH: ['Farm','Jagdbund','Schmied'],
  SB: ['Bäckerei','Brauerei','Gestüt','Holzfäller'],
  SD: ['Bestatter','Bäckerei','Büchsenmacher','Gestüt','Gärtnerei','Jagdbund','Kutschenbauer','Saloon','Tabakhändler','Theater','Train Company','Zeitung'],
  TW: ['Mining Company'],
  VA: ['Brauerei','Büchsenmacher','Farm','Gestüt','Schneider','Tierarzt']
};

// Initial form state
const initialFormState = {
  note: '',
  cityCode: '',
  operation: '',
  issuedDate: getDefaultDate(),
  employees: [{ firstName: '', lastName: '', telegram: '' }],
  specialPermit: '',
  other: ''
};

// Get default date for the form (current day in 1899)
function getDefaultDate() {
  const today = new Date();
  const year = 1899;
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  const day = today.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Generate random string for license number
function generateRandomString(length) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export default function App() {
  // State for current page
  const [currentPage, setCurrentPage] = useState('home');
  
  // State for the form data
  const [formData, setFormData] = useState(initialFormState);
  
  // State for the active tab
  const [activeTab, setActiveTab] = useState('tab1');
  
  // State for the generated output
  const [discordOutput, setDiscordOutput] = useState('');
  
  // State for success message
  const [successMessage, setSuccessMessage] = useState('');
  
  // State for validation errors
  const [errors, setErrors] = useState({});
  
  // Navigation function
  const navigateTo = (page) => {
    setCurrentPage(page);
    // Reset any success messages when changing pages
    setSuccessMessage('');
  };
  
  // Handle input changes
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    
    if (id === 'cityCode') {
      // Reset operation when city changes
      setFormData({
        ...formData,
        cityCode: value,
        operation: ''
      });
    } else {
      setFormData({
        ...formData,
        [id]: value
      });
    }
    
    // Clear error for this field
    if (errors[id]) {
      setErrors({
        ...errors,
        [id]: null
      });
    }
  };
  
  // Handle employee changes
  const handleEmployeeChange = (index, field, value) => {
    const newEmployees = [...formData.employees];
    newEmployees[index] = {
      ...newEmployees[index],
      [field]: value
    };
    
    setFormData({
      ...formData,
      employees: newEmployees
    });
    
    // Clear error for this employee field
    const errorKey = `employee_${index}_${field}`;
    if (errors[errorKey]) {
      setErrors({
        ...errors,
        [errorKey]: null
      });
    }
  };
  
  // Add employee
  const addEmployee = () => {
    if (formData.employees.length < 3) {
      setFormData({
        ...formData,
        employees: [
          ...formData.employees,
          { firstName: '', lastName: '', telegram: '' }
        ]
      });
    }
  };
  
  // Remove employee
  const removeEmployee = (index) => {
    if (formData.employees.length > 1) {
      const newEmployees = [...formData.employees];
      newEmployees.splice(index, 1);
      setFormData({
        ...formData,
        employees: newEmployees
      });
    }
  };
  
  // Validate the form
  const validateForm = () => {
    const newErrors = {};
    
    // Validate note (link)
    if (!formData.note.trim()) {
      newErrors.note = 'Bitte geben Sie einen Link ein';
    } else if (!/^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/.test(formData.note)) {
      newErrors.note = 'Bitte geben Sie einen gültigen Link ein';
    }
    
    // Validate city
    if (!formData.cityCode) {
      newErrors.cityCode = 'Bitte wählen Sie eine Stadt';
    }
    
    // Validate operation
    if (!formData.operation) {
      newErrors.operation = 'Bitte wählen Sie einen Betrieb';
    }
    
    // Validate date
    if (!formData.issuedDate) {
      newErrors.issuedDate = 'Bitte wählen Sie ein Datum';
    }
    
    // Validate employees
    formData.employees.forEach((emp, index) => {
      if (!emp.firstName.trim()) {
        newErrors[`employee_${index}_firstName`] = 'Vorname ist erforderlich';
      }
      
      if (!emp.lastName.trim()) {
        newErrors[`employee_${index}_lastName`] = 'Nachname ist erforderlich';
      }
      
      const telegramValue = emp.telegram.trim();
      if (!telegramValue) {
        newErrors[`employee_${index}_telegram`] = 'Telegramm-Nummer ist erforderlich';
      } else if (telegramValue !== "---" && !/^\d{1,10}$/.test(telegramValue)) {
        newErrors[`employee_${index}_telegram`] = 'Telegramm-Nummer muss zwischen 1 und 10 Ziffern haben';
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Generate the license
  const generateLicense = () => {
    if (!validateForm()) {
      // Only navigate to a tab with errors if there are errors
      const firstErrorField = Object.keys(errors)[0];
      if (firstErrorField?.startsWith('employee_')) {
        setActiveTab('tab2');
      } else if (firstErrorField === 'specialPermit' || firstErrorField === 'other') {
        setActiveTab('tab3');
      } else if (firstErrorField && (firstErrorField === 'note' || firstErrorField === 'cityCode' || 
                 firstErrorField === 'operation' || firstErrorField === 'issuedDate')) {
        setActiveTab('tab1');
      }
      return;
    }
    
    // Generate license number
    const licenseNumber = formData.cityCode + ' - ' + generateRandomString(8);
    
    // Format employees
    const formattedEmployees = formData.employees.map(emp => 
      `${emp.firstName || '---'} ${emp.lastName || '---'} - ${emp.telegram || '---'}`
    ).join('\n');
    
    // Generate discord template
    const template =
      `Vermerk zum Gewerbeantrag:\n\`\`\`${formData.note}\`\`\`\n` +
      `Lizenznummer:\n\`\`\`${licenseNumber}\`\`\`\n` +
      `Ausgestellt am (*Gültigkeit ab*):\n\`\`\`${formData.issuedDate}\`\`\`\n` +
      `Betrieb:\n\`\`\`${formData.operation}\`\`\`\n` +
      `Mitarbeiter (Inhaber & Stellvertretungen):\n\`\`\`${formattedEmployees}\`\`\`\n` +
      `Anzahl der herausgegebenen Lizenzen:\n\`\`\`${formData.employees.length}\`\`\`\n` +
      `Sondergenehmigung:\n\`\`\`${formData.specialPermit || '---'}\`\`\`\n` +
      `Sonstiges:\n\`\`\`${formData.other || '---'}\`\`\``;
      
    setDiscordOutput(template);
    
    // Show success message
    setSuccessMessage('Gewerbeakte erfolgreich generiert!');
    setTimeout(() => setSuccessMessage(''), 3000);
    
    // Scroll to preview on small screens
    if (window.innerWidth <= 968) {
      document.querySelector('.preview-container')?.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  // Copy to clipboard
  const copyToClipboard = () => {
    if (discordOutput) {
      navigator.clipboard.writeText(discordOutput)
        .then(() => {
          setSuccessMessage('In Zwischenablage kopiert!');
          setTimeout(() => setSuccessMessage(''), 2000);
        })
        .catch(err => {
          console.error('Fehler beim Kopieren: ', err);
        });
    }
  };
  
  // Render the content based on the current page
  const renderContent = () => {
    if (currentPage === 'home') {
      return <HomePage navigateTo={navigateTo} />;
    } else if (currentPage === 'business-license') {
      return (
        <div className="page-container">
          <FormContainer 
            formData={formData}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            handleInputChange={handleInputChange}
            handleEmployeeChange={handleEmployeeChange}
            addEmployee={addEmployee}
            removeEmployee={removeEmployee}
            generateLicense={generateLicense}
            operationsByCity={operationsByCity}
            errors={errors}
          />
          
          <PreviewContainer 
            discordOutput={discordOutput}
            copyToClipboard={copyToClipboard}
          />
        </div>
      );
    }
  };
  
  return (
    <div className="app">
      <Navbar currentPage={currentPage} navigateTo={navigateTo} />
      
      {renderContent()}
      
      <Footer />
      
      {/* Beta Toast Benachrichtigung */}
      <BetaToast />
      
      {/* Success message rendered outside normal document flow */}
      {successMessage && (
        <div className="success-message">
          <i className="fa fa-check-circle"></i> {successMessage}
        </div>
      )}
    </div>
  );
}