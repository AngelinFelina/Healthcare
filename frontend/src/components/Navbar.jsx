import React from 'react';

function Navbar({ onNavClick, user, onLogout }) {
  return (
    <nav className="navbar">
      <div className="navbar-brand" onClick={() => onNavClick('home')} style={{ cursor: 'pointer' }}>
        <span className="brand-logo">Medi</span>Scan
      </div>
      <div className="navbar-menu">
        <button onClick={() => onNavClick('home')} className="nav-link">Home</button>
        {user && (
          <>
            <button onClick={() => onNavClick('dashboard')} className="nav-link">Dashboard</button>
            <button onClick={() => onNavClick('imagescan')} className="nav-link">Image Scan</button>
            <button onClick={() => onNavClick('medicine')} className="nav-link">Medicine</button>
            <button onClick={() => onNavClick('reminder')} className="nav-link">Reminders</button>
          </>
        )}
      </div>
      <div className="navbar-actions">
        {user ? (
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <span style={{ color: 'white', fontWeight: 600 }}>Hi, {user.name.split(' ')[0]} 👋</span>
            <button onClick={onLogout} className="nav-btn secondary-btn" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>Logout</button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <button onClick={() => onNavClick('login')} className="nav-link" style={{ fontWeight: 600 }}>Login</button>
            <button onClick={() => onNavClick('signup')} className="nav-btn contact-btn" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>Sign Up</button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
