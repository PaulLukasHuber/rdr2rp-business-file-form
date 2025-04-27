import React, { useState, useEffect } from 'react';

export const BetaToast = () => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 10000);
    
    return () => clearTimeout(timer);

  }, []);

  if (!visible) return null;

  return (
    <div className="beta-toast">
      <div className="beta-toast-content">
        <span className="beta-badge">BETA</span>
        <p>Diese Anwendung befindet sich noch in aktiver Entwicklung.</p>
        <button className="beta-toast-close" onClick={() => setVisible(false)}>
          <i className="fa fa-times"></i>
        </button>
      </div>
    </div>
  );
};