import React from 'react';
import { FormGroup } from '../FormGroup';

export const GeneralTab = ({ formData, handleInputChange, operationsByCity, errors }) => {
  return (
    <>
      <FormGroup 
        id="note"
        label="Vermerk zum Gewerbeantrag (Link):"
        icon="fa-link"
        error={errors.note}
      >
        <input 
          type="url" 
          id="note" 
          placeholder="https://discord.com/channels/..." 
          value={formData.note}
          onChange={handleInputChange}
          className={errors.note ? 'input-error' : ''}
          title="Bitte einen gültigen Link eingeben (beginnend mit http:// oder https://)"
        />
      </FormGroup>
      
      <FormGroup 
        id="cityCode"
        label="Stadt-Kürzel:"
        icon="fa-city"
        error={errors.cityCode}
      >
        <select 
          id="cityCode" 
          value={formData.cityCode}
          onChange={handleInputChange}
          className={errors.cityCode ? 'input-error' : ''}
        >
          <option value="">-- Bitte wählen --</option>
          <option value="AB">AB - Annesburg</option>
          <option value="AD">AD - Armadillo</option>
          <option value="BW">BW - Blackwater</option>
          <option value="CO">CO - Colter</option>
          <option value="RH">RH - Rhodes</option>
          <option value="SB">SB - Strawberry</option>
          <option value="SD">SD - Saint Denis</option>
          <option value="TW">TW - Tumbleweed</option>
          <option value="VA">VA - Valentine</option>
        </select>
      </FormGroup>
      
      <FormGroup 
        id="operation"
        label="Betrieb:"
        icon="fa-briefcase"
        error={errors.operation}
      >
        <select 
          id="operation" 
          value={formData.operation}
          onChange={handleInputChange}
          className={errors.operation ? 'input-error' : ''}
        >
          <option value="">
            {formData.cityCode ? '-- bitte Betrieb wählen --' : '-- zuerst Stadt wählen --'}
          </option>
          {formData.cityCode && operationsByCity[formData.cityCode]?.map(op => (
            <option key={op} value={op}>{op}</option>
          ))}
        </select>
      </FormGroup>
      
      <FormGroup 
        id="issuedDate"
        label="Ausgestellt am (Gültig ab):"
        icon="fa-calendar-alt"
        error={errors.issuedDate}
      >
        <input 
          type="date" 
          id="issuedDate" 
          min="1899-01-01" 
          max="1899-12-31" 
          value={formData.issuedDate}
          onChange={handleInputChange}
          className={errors.issuedDate ? 'input-error' : ''}
        />
      </FormGroup>
    </>
  );
};