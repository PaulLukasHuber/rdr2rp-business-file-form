import React from 'react';

export const PreviewContainer = ({ discordOutput, copyToClipboard }) => {
  return (
    <div className="preview-container">
      <h2><i className="fa fa-eye"></i> Vorschau</h2>
      <div className="preview-content">
        <div className="form-group">
          <label htmlFor="discordOutput">
            <i className="fa fa-code"></i> Discord-Ausgabe:
          </label>
          <textarea 
            id="discordOutput" 
            rows="20" 
            readOnly 
            value={discordOutput}
            placeholder="Hier erscheint die formatierte Vorlage..."
          />
        </div>
        <button 
          className="btn-secondary"
          onClick={copyToClipboard}
          disabled={!discordOutput}
        >
          <i className="fa fa-copy"></i> In Zwischenablage kopieren
        </button>
      </div>
    </div>
  );
};