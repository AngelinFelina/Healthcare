import React from 'react';
import Navbar from './Navbar';

function LandingPage({ onStartScan, onNavClick, user, onLogout }) {
  return (
    <div className="landing-page">
      <Navbar onNavClick={onNavClick} user={user} onLogout={onLogout} />
      
      <div className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">MediScan AI Healthcare</h1>
          <p className="hero-subtitle">
            An offline-first, AI-powered healthcare assistant connecting rural communities to essential medical triage and maternal care. Designed to work everywhere.
          </p>
          <div className="hero-buttons">
            <button className="primary-btn" onClick={onStartScan}>SCAN NOW</button>
            <button className="secondary-btn">LEARN MORE</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
