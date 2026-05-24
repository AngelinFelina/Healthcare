import React from 'react';
import Navbar from './Navbar';

const features = [
  {
    icon: '🧑‍⚕️',
    title: 'Symptom Checker',
    desc: 'AI-powered symptom analysis with triage risk scoring and first-aid advice.',
    route: 'diagnostic',
    color: '#0b9e76',
    tag: 'Most Used',
  },
  {
    icon: '👶',
    title: 'Maternal Health',
    desc: 'Monitor maternal and child health symptoms with specialized AI guidance.',
    route: 'maternal',
    color: '#e91e8c',
    tag: null,
  },
  {
    icon: '📸',
    title: 'AI Image Scan',
    desc: 'Upload a photo of skin, eyes, or wounds for instant AI condition detection.',
    route: 'imagescan',
    color: '#3498db',
    tag: '✨ New',
  },
  {
    icon: '💊',
    title: 'Medicine Info',
    desc: 'Search any medicine for usage, dosage, side effects, and safety warnings.',
    route: 'medicine',
    color: '#9b59b6',
    tag: '✨ New',
  },
  {
    icon: '⏰',
    title: 'Medicine Reminder',
    desc: 'Set smart voice reminders for your medicines in multiple languages.',
    route: 'reminder',
    color: '#f39c12',
    tag: '✨ New',
  },
];

function Dashboard({ onNavClick, user, onLogout }) {
  return (
    <div className="landing-page">
      <Navbar onNavClick={onNavClick} user={user} onLogout={onLogout} />

      <div className="dashboard-page">
        {/* Welcome Header */}
        <div className="dashboard-welcome">
          <div className="dashboard-welcome-icon">🏥</div>
          <h1 className="dashboard-welcome-title">
            Welcome back, {user ? user.name.split(' ')[0] : 'Friend'}!
          </h1>
          <p className="dashboard-welcome-sub">
            MediScan Rural — Your AI health companion. Choose a feature to get started.
          </p>
          <div className="dashboard-badges">
            <span className="badge badge-green">🟢 AI Active</span>
            <span className="badge badge-blue">📡 {navigator.onLine ? 'Online' : 'Offline Mode'}</span>
            <span className="badge badge-purple">🌐 Multilingual</span>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="dashboard-grid">
          {features.map((f) => (
            <button
              key={f.route + f.title}
              className="dashboard-card"
              style={{ '--card-color': f.color }}
              onClick={() => onNavClick(f.route)}
            >
              {f.tag && (
                <span className="card-tag" style={{ background: f.color }}>
                  {f.tag}
                </span>
              )}
              <div className="card-icon" style={{ background: `${f.color}22` }}>
                {f.icon}
              </div>
              <h3 className="card-title">{f.title}</h3>
              <p className="card-desc">{f.desc}</p>
              <div className="card-arrow" style={{ color: f.color }}>
                Get Started →
              </div>
            </button>
          ))}
        </div>

        {/* Footer note */}
        <p className="dashboard-footer-note">
          ⚠️ MediScan is an AI guidance tool. Always consult a qualified doctor for medical decisions.
        </p>
      </div>
    </div>
  );
}

export default Dashboard;
