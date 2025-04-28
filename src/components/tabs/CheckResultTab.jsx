import React from 'react';
import { FormGroup } from '../FormGroup';

export const CheckResultTab = ({ formData, handleInputChange, errors }) => {
  return (
    <>
      <div className="tab-info result-tab-info">
        <i className="fa fa-info-circle"></i>
        Hier tragen Sie das Prüfungsergebnis ein, nachdem Sie die Antwort vom Sheriff oder Deputy erhalten haben.
      </div>
      
      <div className="person-summary">
        <h3>Zu überprüfende Person:</h3>
        <p className="summary-data">{formData.personName || '(noch nicht eingegeben)'}</p>
      </div>
      
      <FormGroup 
        id="checkedBy"
        label="Geprüft durch:"
        icon="fa-user-shield"
        error={errors.checkedBy}
      >
        <input 
          type="text" 
          id="checkedBy" 
          placeholder="Name des Sheriffs / Deputy eingeben..." 
          value={formData.checkedBy}
          onChange={handleInputChange}
          className={errors.checkedBy ? 'input-error' : ''}
        />
      </FormGroup>
      
      <FormGroup 
        id="checkedDate"
        label="Geprüft am:"
        icon="fa-calendar-alt"
        error={errors.checkedDate}
      >
        <input 
          type="date" 
          id="checkedDate" 
          min="1899-01-01" 
          max="1899-12-31" 
          value={formData.checkedDate}
          onChange={handleInputChange}
          className={errors.checkedDate ? 'input-error' : ''}
        />
      </FormGroup>
      
      <FormGroup 
        id="checkResult"
        label="Prüfungsergebnis:"
        icon="fa-clipboard-check"
        error={errors.checkResult}
      >
        <div className="result-buttons">
          <label className={`result-button ${formData.checkResult === 'sauber' ? 'active' : ''}`}>
            <input 
              type="radio" 
              name="checkResult" 
              id="checkResult" 
              value="sauber" 
              checked={formData.checkResult === "sauber"}
              onChange={handleInputChange}
            />
            <span className="result-icon"><i className="fa fa-check-circle"></i></span>
            <span className="result-text"> Bestanden</span>
          </label>
          
          <label className={`result-button ${formData.checkResult === 'straffällig' ? 'active' : ''}`}>
            <input 
              type="radio" 
              name="checkResult" 
              id="checkResult" 
              value="straffällig" 
              checked={formData.checkResult === "straffällig"}
              onChange={handleInputChange}
            />
            <span className="result-icon"><i className="fa fa-exclamation-triangle"></i></span>
            <span className="result-text"> Durchgefallen</span>
          </label>
        </div>
        
        {errors.checkResult && (
          <div className="error-message">
            <i className="fa fa-exclamation-circle"></i> {errors.checkResult}
          </div>
        )}
      </FormGroup>
      
      <FormGroup 
        id="resultNotes"
        label="Anmerkungen (optional):"
        icon="fa-comment"
        error={errors.resultNotes}
      >
        <textarea 
          id="resultNotes" 
          rows="2" 
          placeholder="Zusätzliche Anmerkungen zur Prüfung (optional)..." 
          value={formData.resultNotes || ''}
          onChange={handleInputChange}
          className={errors.resultNotes ? 'input-error' : ''}
        />
      </FormGroup>
    </>
  );
};