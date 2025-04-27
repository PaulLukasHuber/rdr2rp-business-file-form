import React from 'react';

export const Navbar = ({ currentPage, navigateTo }) => {
  return (
    <nav className="navbar">
      <div className="navbar-logo" onClick={() => navigateTo('home')}>
        <i className="fa fa-scroll"></i> GEWERBEAMT
      </div>
      <ul className="navbar-links">
        <li>
          <button 
            className={`nav-button ${currentPage === 'home' ? 'active' : ''}`}
            onClick={() => navigateTo('home')}
          >
            <i className="fa fa-home"></i> Startseite
          </button>
        </li>
        <li>
          <button 
            className={`nav-button ${currentPage === 'business-license' ? 'active' : ''}`}
            onClick={() => navigateTo('business-license')}
          >
            <i className="fa fa-id-card-alt"></i> Gewerbeakte erstellen
          </button>
        </li>
        <li>
          <button 
            className="nav-button disabled-link"
            title="Funktion noch nicht verfügbar"
            disabled
          >
            <i className="fa fa-file-alt"></i> Anträge erstellen
          </button>
        </li>
        <li>
          <button 
            className="nav-button disabled-link"
            title="Funktion noch nicht verfügbar"
            disabled
          >
            <i className="fa fa-user-check"></i> Personenprüfungsakte erstellen
          </button>
        </li>
      </ul>
    </nav>
  );
};