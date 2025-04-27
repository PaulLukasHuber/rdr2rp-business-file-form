import React from 'react';

export const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">📜 GEWERBEAMT</div>
      <ul className="navbar-links">
        <li><a href="#">Startseite</a></li>
        <li><a href="#">Gewerbeakte erstellen</a></li>
        <li><a href="#">Antrage erstellen</a></li>
        <li><a href="#">Personenprüfungsakte erstellen</a></li>
      </ul>
    </nav>
  );
};