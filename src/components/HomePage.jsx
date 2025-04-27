import React from 'react';

export const HomePage = ({ navigateTo }) => {
  return (
    <div className="home-container">
      <div className="home-header">
        <h1>
          <i className="fa fa-scroll"></i> Gewerbeamt
        </h1>
        <p className="home-subtitle">Offizielle Formulare und Dokumente für den Red Dead Redemption 2 Roleplay-Server</p>
      </div>
      
      <div className="cards-container">
        {/* Gewerbeakte Karte - aktiv */}
        <div className="feature-card">
          <div className="card-icon">
            <i className="fa fa-id-card-alt"></i>
          </div>
          <div className="card-content">
            <h3>Gewerbeakte erstellen</h3>
            <p>Erstelle offizielle Gewerbeakten für Betriebe in allen Städten des Westens.</p>
            <button 
              className="card-button" 
              onClick={() => navigateTo('business-license')}
            >
              Formular öffnen <i className="fa fa-arrow-right"></i>
            </button>
          </div>
        </div>
        
        {/* Anträge Karte - inaktiv */}
        <div className="feature-card disabled">
          <div className="card-icon">
            <i className="fa fa-file-alt"></i>
          </div>
          <div className="card-content">
            <h3>Anträge erstellen</h3>
            <p>Erstelle verschiedene Anträge für offizielle Zwecke (in Entwicklung).</p>
            <div className="coming-soon-badge">In Kürze verfügbar</div>
          </div>
        </div>
        
        {/* Personenakte Karte - inaktiv */}
        <div className="feature-card disabled">
          <div className="card-icon">
            <i className="fa fa-user-check"></i>
          </div>
          <div className="card-content">
            <h3>Personenprüfungsakte erstellen</h3>
            <p>Erstelle offizielle Personenprüfungsakten für Bürger der Städte (in Entwicklung).</p>
            <div className="coming-soon-badge">In Kürze verfügbar</div>
          </div>
        </div>
      </div>
      
      <div className="home-info">
        <h2>Über das Gewerbeamt</h2>
        <p>
          Hier können offizielle Gewerbeakten, Anträge und Personenprüfungsakten erstellt werden.
        </p>
        <p>
          <strong>Hinweis:</strong> Diese Anwendung wird ständig weiterentwickelt. Regelmäßige Updates werden
          neue Funktionen und Verbesserungen einführen.
        </p>
      </div>
    </div>
  );
};