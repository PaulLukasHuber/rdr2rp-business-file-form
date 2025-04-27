import React from 'react';

export const FormGroup = ({ id, label, icon, children, error }) => {
  return (
    <div className="form-group">
      <label htmlFor={id}>
        <i className={`fa ${icon}`}></i> {label}
      </label>
      {children}
      {error && (
        <div className="error-message">
          <i className="fa fa-exclamation-circle"></i> {error}
        </div>
      )}
    </div>
  );
};