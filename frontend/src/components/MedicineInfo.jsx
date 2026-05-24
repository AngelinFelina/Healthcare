import React, { useState } from 'react';
import { medicineDatabase, searchMedicine } from '../data/medicineDatabase';

const TABS = ['Overview', 'Dosage', 'Side Effects', 'Warnings'];

function MedicineInfo({ onBack }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [activeTab, setActiveTab] = useState('Overview');

  const handleInput = (val) => {
    setQuery(val);
    setSelected(null);
    setSuggestions(val.length >= 2 ? searchMedicine(val).slice(0, 6) : []);
  };

  const handleSelect = (med) => {
    setSelected(med);
    setQuery(med.name);
    setSuggestions([]);
    setActiveTab('Overview');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const results = searchMedicine(query);
    if (results.length > 0) handleSelect(results[0]);
  };

  return (
    <div className="feature-page-container">
      <div className="feature-glass-panel">
        <button className="back-btn" onClick={onBack}>← Back to Dashboard</button>

        <div className="feature-header">
          <span className="feature-icon-large">💊</span>
          <div>
            <h1 className="feature-title">Medicine Info</h1>
            <p className="feature-subtitle">Search any medicine for simple, clear information</p>
          </div>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="med-search-form" autoComplete="off">
          <div className="med-search-wrap">
            <input
              className="med-search-input"
              type="text"
              placeholder="🔍  Type a medicine name (e.g. Paracetamol, Ibuprofen...)"
              value={query}
              onChange={(e) => handleInput(e.target.value)}
            />
            <button type="submit" className="med-search-btn">Search</button>
          </div>

          {suggestions.length > 0 && (
            <ul className="med-suggestions">
              {suggestions.map((med) => (
                <li key={med.id} className="med-suggestion-item" onClick={() => handleSelect(med)}>
                  <span className="sug-emoji">{med.emoji}</span>
                  <div>
                    <strong>{med.name}</strong>
                    <span className="sug-brand"> — {med.brand.split(',')[0]}</span>
                  </div>
                  <span className="sug-category">{med.category}</span>
                </li>
              ))}
            </ul>
          )}
        </form>

        {/* Quick picks */}
        {!selected && (
          <div className="quick-picks">
            <p className="quick-label">Popular searches:</p>
            <div className="quick-chips">
              {medicineDatabase.slice(0, 6).map((m) => (
                <button key={m.id} className="quick-chip" onClick={() => handleSelect(m)}>
                  {m.emoji} {m.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Result Card */}
        {selected && (
          <div className="med-result-card">
            {/* Header */}
            <div className="med-result-header" style={{ borderColor: selected.color }}>
              <div className="med-emoji-circle" style={{ background: `${selected.color}22`, border: `2px solid ${selected.color}` }}>
                {selected.emoji}
              </div>
              <div className="med-result-titles">
                <h2 className="med-result-name">{selected.name}</h2>
                <p className="med-result-generic">{selected.generic} &bull; {selected.brand}</p>
                <span className="med-category-badge" style={{ background: selected.color }}>{selected.category}</span>
              </div>
            </div>

            {/* Tabs */}
            <div className="med-tabs">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  className={`med-tab ${activeTab === tab ? 'active' : ''}`}
                  style={activeTab === tab ? { borderColor: selected.color, color: selected.color } : {}}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="med-tab-content">
              {activeTab === 'Overview' && (
                <div className="tab-panel">
                  <div className="info-block">
                    <h4>📖 What is it used for?</h4>
                    <p>{selected.usage}</p>
                  </div>
                  <div className="info-block">
                    <h4>🕐 When to take it</h4>
                    <p>{selected.timing}</p>
                  </div>
                  <div className="info-block">
                    <h4>💬 Common interactions</h4>
                    <ul className="simple-list">
                      {selected.interactions.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === 'Dosage' && (
                <div className="tab-panel">
                  <h4 style={{ marginBottom: '16px' }}>📏 Recommended Dosage</h4>
                  {Object.entries(selected.dosage).map(([group, dose]) => (
                    <div key={group} className="dosage-row">
                      <span className="dosage-group">{group.charAt(0).toUpperCase() + group.slice(1)}</span>
                      <span className="dosage-value">{dose}</span>
                    </div>
                  ))}
                  <div className="dosage-note">
                    ⚠️ Always follow the dose prescribed by your doctor. Do not self-medicate.
                  </div>
                </div>
              )}

              {activeTab === 'Side Effects' && (
                <div className="tab-panel">
                  <h4 style={{ marginBottom: '16px' }}>⚡ Possible Side Effects</h4>
                  <p style={{ marginBottom: '12px', color: '#556070', fontSize: '0.9rem' }}>
                    Not everyone gets side effects. Consult a doctor if any of these persist.
                  </p>
                  <ul className="effects-list">
                    {selected.sideEffects.map((eff, i) => (
                      <li key={i} className="effect-item">
                        <span className="effect-dot" />
                        {eff}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {activeTab === 'Warnings' && (
                <div className="tab-panel">
                  <h4 style={{ marginBottom: '16px' }}>🚨 Important Warnings</h4>
                  <ul className="warnings-list">
                    {selected.warnings.map((w, i) => (
                      <li key={i} className="warning-item">
                        <span className="warn-icon">⚠️</span>
                        {w}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="ai-disclaimer">
              💡 <em>This information is for general guidance. Always consult a doctor or pharmacist before taking any medicine.</em>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MedicineInfo;
