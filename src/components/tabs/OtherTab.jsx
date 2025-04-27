import React from 'react';
import { FormGroup } from '../FormGroup';

export const OtherTab = ({ formData, handleInputChange, errors }) => {
  return (
    <>
      <FormGroup 
        id="specialPermit"
        label="Sondergenehmigung:"
        icon="fa-certificate"
        error={errors.specialPermit}
      >
        <input 
          type="text" 
          id="specialPermit" 
          placeholder="Details eingeben..." 
          value={formData.specialPermit}
          onChange={handleInputChange}
          className={errors.specialPermit ? 'input-error' : ''}
        />
      </FormGroup>
      
      <FormGroup 
        id="other"
        label="Sonstiges:"
        icon="fa-sticky-note"
        error={errors.other}
      >
        <textarea 
          id="other" 
          rows="3" 
          placeholder="Weitere Anmerkungen..." 
          value={formData.other}
          onChange={handleInputChange}
          className={errors.other ? 'input-error' : ''}
        />
      </FormGroup>
    </>
  );
};