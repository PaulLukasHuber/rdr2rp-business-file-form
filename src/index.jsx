import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Import CSS files
import './index.css';
import './styles/styles.css';
import './styles/validation.css';
import './styles/navbar.css';
import './styles/beta-toast.css';
import './styles/homepage.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);