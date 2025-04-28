import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { FormContainer } from './components/FormContainer';
import { PersonVerificationContainer } from './components/PersonVerificationContainer';
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

// Initial form state for business license
const initialBusinessFormState = {
  note: '',
  cityCode: '',
  operation: '',
  issuedDate: getDefaultDate(),
  employees: [{ firstName: '', lastName: '', telegram: '' }],
  specialPermit: '',
  other: ''
};

// Initial form state for person verification
const initialVerificationFormState = {
  personName: '',
  telegramNumber: '',
  checkedBy: '',
  checkedDate: getDefaultDate(),
  checkResult: ''
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
  
  // State for the business form data
  const [businessFormData, setBusinessFormData] = useState(initialBusinessFormState);
  
  // State for the verification form data
  const [verificationFormData, setVerificationFormData] = useState(initialVerificationFormState);
  
  // State for the active tab (for business license)
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
    // Reset Discord output when changing pages
    setDiscordOutput('');
  };
  
  // Handle input changes for business license
  const handleBusinessInputChange = (e) => {
    const { id, value } = e.target;
    
    if (id === 'cityCode') {
      // Reset operation when city changes
      setBusinessFormData({
        ...businessFormData,
        cityCode: value,
        operation: ''
      });
    } else {
      setBusinessFormData({
        ...businessFormData,
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
  
  // Handle input changes for person verification
  const handleVerificationInputChange = (e) => {
    const { id, value } = e.target;
    
    setVerificationFormData({
      ...verificationFormData,
      [id]: value
    });
    
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
    const newEmployees = [...businessFormData.employees];
    newEmployees[index] = {
      ...newEmployees[index],
      [field]: value
    };
    
    setBusinessFormData({
      ...businessFormData,
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
    if (businessFormData.employees.length < 3) {
      setBusinessFormData({
        ...businessFormData,
        employees: [
          ...businessFormData.employees,
          { firstName: '', lastName: '', telegram: '' }
        ]
      });
    }
  };
  
  // Remove employee
  const removeEmployee = (index) => {
    if (businessFormData.employees.length > 1) {
      const newEmployees = [...businessFormData.employees];
      newEmployees.splice(index, 1);
      setBusinessFormData({
        ...businessFormData,
        employees: newEmployees
      });
    }
  };
  
  // Validate the business license form
  const validateBusinessForm = () => {
    const newErrors = {};
    
    // Validate note (link)
    if (!businessFormData.note.trim()) {
      newErrors.note = 'Bitte geben Sie einen Link ein';
    } else if (!/^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/.test(businessFormData.note)) {
      newErrors.note = 'Bitte geben Sie einen gültigen Link ein';
    }
    
    // Validate city
    if (!businessFormData.cityCode) {
      newErrors.cityCode = 'Bitte wählen Sie eine Stadt';
    }
    
    // Validate operation
    if (!businessFormData.operation) {
      newErrors.operation = 'Bitte wählen Sie einen Betrieb';
    }
    
    // Validate date
    if (!businessFormData.issuedDate) {
      newErrors.issuedDate = 'Bitte wählen Sie ein Datum';
    }
    
    // Validate employees
    businessFormData.employees.forEach((emp, index) => {
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
  
  // Validate the person verification form
  const validateVerificationForm = () => {
    const newErrors = {};
    
    // Validate person name
    if (!verificationFormData.personName.trim()) {
      newErrors.personName = 'Bitte geben Sie einen Namen ein';
    }
    
    // Validate telegram number
    const telegramValue = verificationFormData.telegramNumber.trim();
    if (!telegramValue) {
      newErrors.telegramNumber = 'Telegramm-Nummer ist erforderlich';
    } else if (telegramValue !== "---" && !/^\d{1,10}$/.test(telegramValue)) {
      newErrors.telegramNumber = 'Telegramm-Nummer muss zwischen 1 und 10 Ziffern haben';
    }
    
    // Validate checked by
    if (!verificationFormData.checkedBy.trim()) {
      newErrors.checkedBy = 'Bitte geben Sie den Namen des Prüfers ein';
    }
    
    // Validate checked date
    if (!verificationFormData.checkedDate) {
      newErrors.checkedDate = 'Bitte wählen Sie ein Datum';
    }
    
    // Validate check result
    if (!verificationFormData.checkResult.trim()) {
      newErrors.checkResult = 'Bitte geben Sie ein Prüfungsergebnis ein';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Generate the business license
  const generateLicense = () => {
    if (!validateBusinessForm()) {
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
    const licenseNumber = businessFormData.cityCode + ' - ' + generateRandomString(8);
    
    // Format employees
    const formattedEmployees = businessFormData.employees.map(emp => 
      `${emp.firstName || '---'} ${emp.lastName || '---'} - ${emp.telegram || '---'}`
    ).join('\n');
    
    // Generate discord template
    const template =
      `Vermerk zum Gewerbeantrag:\n\`\`\`${businessFormData.note}\`\`\`\n` +
      `Lizenznummer:\n\`\`\`${licenseNumber}\`\`\`\n` +
      `Ausgestellt am (*Gültigkeit ab*):\n\`\`\`${businessFormData.issuedDate}\`\`\`\n` +
      `Betrieb:\n\`\`\`${businessFormData.operation}\`\`\`\n` +
      `Mitarbeiter (Inhaber & Stellvertretungen):\n\`\`\`${formattedEmployees}\`\`\`\n` +
      `Anzahl der herausgegebenen Lizenzen:\n\`\`\`${businessFormData.employees.length}\`\`\`\n` +
      `Sondergenehmigung:\n\`\`\`${businessFormData.specialPermit || '---'}\`\`\`\n` +
      `Sonstiges:\n\`\`\`${businessFormData.other || '---'}\`\`\``;
      
    setDiscordOutput(template);
    
    // Show success message
    setSuccessMessage('Gewerbeakte erfolgreich generiert!');
    setTimeout(() => setSuccessMessage(''), 3000);
    
    // Scroll to preview on small screens
    if (window.innerWidth <= 968) {
      document.querySelector('.preview-container')?.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  // Generate the person verification
  const generateVerification = () => {
    if (!validateVerificationForm()) {
      return;
    }
    
    // Generate discord template with line break at the beginning and placeholder for result
    const template =
      `\n# Vorlage | Personenprüfungsakte\n` +
      `Formular für Personenprüfungen\n` +
      `Zu überprüfende Person:\n\`\`\`\n${verificationFormData.personName || '---'}\n\`\`\`\n` +
      `Telegrammnummer (Für Rückfragen):\n\`\`\`\n${verificationFormData.telegramNumber || '---'}\n\`\`\`\n` +
      `Geprüft durch:\n\`\`\`\n${verificationFormData.checkedBy || '---'}\n\`\`\`\n` +
      `Geprüft am:\n\`\`\`\n${verificationFormData.checkedDate || '---'}\n\`\`\`\n` +
      `Prüfungsergebnis:\n\`\`\`\n---\n\`\`\``;
      
    setDiscordOutput(template);
    
    // Show success message
    setSuccessMessage('Personenprüfungsakte erfolgreich generiert!');
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
            formData={businessFormData}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            handleInputChange={handleBusinessInputChange}
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
    } else if (currentPage === 'person-verification') {
      return (
        <div className="page-container">
          <PersonVerificationContainer 
            formData={verificationFormData}
            handleInputChange={handleVerificationInputChange}
            generateVerification={generateVerification}
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