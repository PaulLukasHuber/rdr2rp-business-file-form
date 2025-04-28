import React, { useState } from 'react';

export const DiscordImport = ({ handleDiscordImport, role }) => {
  const [discordText, setDiscordText] = useState('');
  const [importStatus, setImportStatus] = useState('');

  const handleImport = () => {
    if (!discordText.trim()) {
      setImportStatus('error');
      return;
    }

    const success = handleDiscordImport(discordText, role);
    setImportStatus(success ? 'success' : 'error');
    
    // Reset status after 3 seconds
    setTimeout(() => {
      setImportStatus('');
    }, 3000);
  };

  return (
    <div className="discord-import">
      <h3>
        <i className="fa fa-file-import"></i> Discord-Nachricht importieren
      </h3>
      <p className="import-description">
        Füge eine existierende Personenprüfungsakte aus Discord ein, um die Daten zu importieren.
        {role === 'office' 
          ? ' Als Gewerbeamt-Mitarbeiter werden nur die Personendaten importiert.' 
          : ' Als Prüfer werden alle verfügbaren Daten importiert.'}
      </p>
      
      <textarea 
        className="discord-import-textarea"
        placeholder="Discord-Nachricht hier einfügen..."
        value={discordText}
        onChange={(e) => setDiscordText(e.target.value)}
        rows={6}
      />
      
      <div className="import-actions">
        <button 
          className="btn-secondary import-button"
          onClick={handleImport}
        >
          <i className="fa fa-sync"></i> Daten importieren
        </button>
        
        {importStatus === 'success' && (
          <div className="import-status success">
            <i className="fa fa-check-circle"></i> Daten erfolgreich importiert!
          </div>
        )}
        
        {importStatus === 'error' && (
          <div className="import-status error">
            <i className="fa fa-exclamation-circle"></i> Import fehlgeschlagen. Überprüfe den Text.
          </div>
        )}
      </div>
    </div>
  );
};