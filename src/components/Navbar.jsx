import React from 'react';

export const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">📜 GEWERBEAMT</div>
      <ul className="navbar-links">
        <li><a href="/" onClick={(e) => e.preventDefault()}>Startseite</a></li>
        <li><a href="/gewerbeakte" onClick={(e) => e.preventDefault()}>Gewerbeakte erstellen</a></li>
        <li><a href="/antrage" onClick={(e) => e.preventDefault()}>Antrage erstellen</a></li>
        <li><a href="/personenakte" onClick={(e) => e.preventDefault()}>Personenprüfungsakte erstellen</a></li>
      </ul>
    </nav>
  );
};