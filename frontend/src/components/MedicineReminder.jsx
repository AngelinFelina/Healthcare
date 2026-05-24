import React, { useState, useEffect, useRef } from 'react';
import { medicineDatabase } from '../data/medicineDatabase';

const FREQUENCIES = ['Once', 'Daily', 'Twice Daily', 'Weekly'];
const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिंदी (Hindi)' },
  { code: 'ta', label: 'தமிழ் (Tamil)' },
];

function getReminderText(medicineName, lang) {
  if (lang === 'hi') return `${medicineName} की दवाई लेने का समय हो गया है। कृपया अभी लें।`;
  if (lang === 'ta') return `${medicineName} மருந்து எடுக்கும் நேரம் வந்துவிட்டது. இப்போது எடுங்கள்.`;
  return `Time to take your ${medicineName}. Please take it now.`;
}

function MedicineReminder({ onBack }) {
  const [reminders, setReminders] = useState(() => {
    try { return JSON.parse(localStorage.getItem('mediscan_reminders') || '[]'); }
    catch { return []; }
  });

  const [form, setForm] = useState({
    medicine: '',
    dose: '',
    time: '',
    frequency: 'Daily',
    lang: 'en',
  });
  const [formError, setFormError] = useState('');
  const [firedId, setFiredId] = useState(null);
  const intervalRef = useRef(null);

  // New Upgrade States
  const [isFormOpen, setIsFormOpen] = useState(true);
  const [suggestions, setSuggestions] = useState([]);
  const [activeAlarm, setActiveAlarm] = useState(null);
  const [alarmAudio, setAlarmAudio] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [micError, setMicError] = useState('');
  const [lastFired, setLastFired] = useState(() => {
    try { return JSON.parse(localStorage.getItem('mediscan_reminders_last_fired') || '{}'); }
    catch { return {}; }
  });
  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem('mediscan_reminders_history') || '[]'); }
    catch { return []; }
  });

  // Persist reminders, lastFired, and history logs
  useEffect(() => {
    localStorage.setItem('mediscan_reminders', JSON.stringify(reminders));
  }, [reminders]);

  useEffect(() => {
    localStorage.setItem('mediscan_reminders_last_fired', JSON.stringify(lastFired));
  }, [lastFired]);

  useEffect(() => {
    localStorage.setItem('mediscan_reminders_history', JSON.stringify(history));
  }, [history]);

  // Check reminders every 15 seconds to ensure accuracy and prevent tab sleep delay
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, '0');
      const mm = String(now.getMinutes()).padStart(2, '0');
      const currentTime = `${hh}:${mm}`;
      const todayKey = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;

      reminders.forEach((r) => {
        if (r.enabled && r.time === currentTime) {
          const firedKey = `${r.id}_${todayKey}`;
          if (lastFired[r.id] !== firedKey) {
            fireReminder(r);
            setLastFired((prev) => ({ ...prev, [r.id]: firedKey }));
          }
        }
      });
    }, 15000);
    return () => clearInterval(intervalRef.current);
  }, [reminders, lastFired]);

  // Synthesis Beep Generator using Web Audio API (No audio file assets needed)
  const playAlarmSound = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return null;
      const ctx = new AudioContext();
      
      const playBeep = () => {
        if (ctx.state === 'suspended') {
          ctx.resume();
        }
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime); // High pitch alarm tone
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.05);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.45);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.5);
      };

      playBeep(); // Trigger immediately
      const interval = setInterval(playBeep, 1200); // Repeat every 1.2s

      return { ctx, interval };
    } catch (e) {
      console.error('Failed to trigger electronic alarm:', e);
      return null;
    }
  };

  const stopAlarmSound = (audio) => {
    if (audio) {
      clearInterval(audio.interval);
      try { audio.ctx.close(); }
      catch (e) { console.error(e); }
    }
  };

  const fireReminder = (r) => {
    const text = getReminderText(r.medicine, r.lang);

    // Browser Push Notification
    if (Notification.permission === 'granted') {
      new Notification(`🔔 Medicine Reminder — ${r.medicine}`, {
        body: text,
        icon: '/favicon.ico',
      });
    }

    // Voice Synthesis Text-to-Speech
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Stop any pending voice
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = r.lang === 'hi' ? 'hi-IN' : r.lang === 'ta' ? 'ta-IN' : 'en-US';
      utter.rate = 0.9;
      window.speechSynthesis.speak(utter);
    }

    // Modal alarm popup and synth sounds
    setActiveAlarm(r);
    const audio = playAlarmSound();
    setAlarmAudio(audio);

    setFiredId(r.id);
    setTimeout(() => setFiredId(null), 4000);
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission !== 'granted') {
      await Notification.requestPermission();
    }
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.medicine.trim()) return setFormError('Please enter a medicine name.');
    if (!form.time) return setFormError('Please select a reminder time.');
    setFormError('');

    const newReminder = {
      id: Date.now().toString(),
      ...form,
      enabled: true,
      createdAt: new Date().toISOString(),
    };
    setReminders((prev) => [newReminder, ...prev]);
    setForm({ medicine: '', dose: '', time: '', frequency: 'Daily', lang: 'en' });
    setSuggestions([]);
    requestNotificationPermission();
  };

  const toggleReminder = (id) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
  };

  const deleteReminder = (id) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
  };

  const testReminder = (r) => fireReminder(r);

  const langLabel = (code) => LANGUAGES.find((l) => l.code === code)?.label || code;

  // Autocomplete suggestions
  const handleMedicineChange = (val) => {
    setForm({ ...form, medicine: val });
    if (val.trim().length >= 2) {
      const q = val.toLowerCase().trim();
      const filtered = medicineDatabase.filter(
        (med) =>
          med.name.toLowerCase().includes(q) ||
          med.brand.toLowerCase().includes(q) ||
          med.generic.toLowerCase().includes(q)
      );
      setSuggestions(filtered.slice(0, 5)); // cap at 5 suggestions
    } else {
      setSuggestions([]);
    }
  };

  const selectSuggestion = (name) => {
    setForm({ ...form, medicine: name });
    setSuggestions([]);
  };

  // Voice recognition and parsing for adding reminders
  const handleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setMicError('Speech recognition is not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = form.lang === 'hi' ? 'hi-IN' : form.lang === 'ta' ? 'ta-IN' : 'en-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      setMicError('');
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      console.log('Heard reminder voice command:', transcript);

      let detectedMed = '';
      let detectedTime = '';

      // 1. Scan for matching medicine from our local database
      for (const med of medicineDatabase) {
        if (transcript.includes(med.name.toLowerCase())) {
          detectedMed = med.name;
          break;
        }
        const brands = med.brand.split(',').map((b) => b.trim().toLowerCase());
        for (const brand of brands) {
          if (brand && transcript.includes(brand)) {
            detectedMed = med.name;
            break;
          }
        }
        if (detectedMed) break;
      }

      // Fallback matching: Extract text before "at" or "बजे"
      if (!detectedMed) {
        const medMatch = transcript.match(/(?:for|take|reminder for)\s+([a-z0-9\s]+?)\s+(?:at|on|tomorrow|today|baje|बजे)/i);
        if (medMatch && medMatch[1]) {
          detectedMed = medMatch[1].trim();
        }
      }

      // 2. Parse time formats (e.g. "8:30 pm", "9 am", "20:45", "8:30", "8 30")
      const timeMatch = transcript.match(/\b([0-1]?[0-9]|2[0-3])[:.]([0-5][0-9])\s*(am|pm)?\b/);
      if (timeMatch) {
        let hours = parseInt(timeMatch[1], 10);
        const minutes = timeMatch[2];
        const ampm = timeMatch[3];
        
        if (ampm === 'pm' && hours < 12) hours += 12;
        if (ampm === 'am' && hours === 12) hours = 0;
        
        detectedTime = `${String(hours).padStart(2, '0')}:${minutes}`;
      } else {
        // Match standard integer hours like "8 pm", "9 am"
        const hrMatch = transcript.match(/\b([1-9]|1[0-2])\s*(am|pm)\b/);
        if (hrMatch) {
          let hours = parseInt(hrMatch[1], 10);
          const ampm = hrMatch[2];
          if (ampm === 'pm' && hours < 12) hours += 12;
          if (ampm === 'am' && hours === 12) hours = 0;
          detectedTime = `${String(hours).padStart(2, '0')}:00`;
        }
      }

      // Hindi time format ("9 बजे")
      if (!detectedTime) {
        const hindiTimeMatch = transcript.match(/([0-9]+)\s*(?:बजे|baje)/);
        if (hindiTimeMatch) {
          let hours = parseInt(hindiTimeMatch[1], 10);
          const isPm = transcript.includes('शाम') || transcript.includes('रात') || transcript.includes('dopahar') || transcript.includes('evening') || transcript.includes('night');
          if (isPm && hours < 12) hours += 12;
          detectedTime = `${String(hours).padStart(2, '0')}:00`;
        }
      }

      setForm((prev) => ({
        ...prev,
        medicine: detectedMed || prev.medicine,
        time: detectedTime || prev.time,
      }));

      if (!detectedMed && !detectedTime) {
        setMicError('Could not understand medicine name or time. Try: "Paracetamol at 8:30 PM"');
      } else if (!detectedMed) {
        setMicError(`Recognized time (${detectedTime}), but couldn't parse the medicine name.`);
      } else if (!detectedTime) {
        setMicError(`Recognized medicine (${detectedMed}), but couldn't parse the time.`);
      }
    };

    recognition.onerror = (e) => {
      console.error(e);
      setMicError('Microphone error. Please try again.');
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  // Alarm action handlers
  const snoozeReminder = () => {
    if (!activeAlarm) return;
    stopAlarmSound(alarmAudio);
    setAlarmAudio(null);
    const snoozedReminder = { ...activeAlarm };
    setActiveAlarm(null);

    // Re-fire in 5 minutes
    setTimeout(() => {
      fireReminder(snoozedReminder);
    }, 5 * 60 * 1000);
  };

  const markAsTaken = () => {
    if (!activeAlarm) return;
    stopAlarmSound(alarmAudio);
    setAlarmAudio(null);

    const logEntry = {
      id: Date.now().toString(),
      medicine: activeAlarm.medicine,
      dose: activeAlarm.dose || 'Standard dosage',
      takenAt: new Date().toLocaleString(),
      status: 'Taken',
    };
    setHistory((prev) => [logEntry, ...prev]);
    setActiveAlarm(null);
  };

  const dismissAlarm = () => {
    if (!activeAlarm) return;
    stopAlarmSound(alarmAudio);
    setAlarmAudio(null);
    setActiveAlarm(null);
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return (
    <div className="feature-page-container">
      <div className="feature-glass-panel">
        <button className="back-btn" onClick={onBack}>← Back to Dashboard</button>

        <div className="feature-header">
          <span className="feature-icon-large">⏰</span>
          <div>
            <h1 className="feature-title">Medicine Reminder</h1>
            <p className="feature-subtitle">Smart voice reminders in your language — never miss a dose</p>
          </div>
        </div>

        {/* Add Reminder Form */}
        <div className="reminder-form">
          <div 
            className="reminder-form-header-toggle" 
            onClick={() => setIsFormOpen(!isFormOpen)}
          >
            <h3 className="reminder-form-title" style={{ margin: 0 }}>
              {isFormOpen ? '🔽' : '➕'} Add New Reminder
            </h3>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-light)', fontWeight: 600 }}>
              {isFormOpen ? 'Collapse' : 'Expand'}
            </span>
          </div>

          {isFormOpen && (
            <form onSubmit={handleAdd} style={{ marginTop: '15px' }}>
              <div className="reminder-form-grid">
                <div className="form-group">
                  <label>Medicine Name *</label>
                  <div className="input-mic-group">
                    <div className="reminder-suggestions-container">
                      <input
                        type="text"
                        placeholder="e.g. Paracetamol, Metformin"
                        value={form.medicine}
                        onChange={(e) => handleMedicineChange(e.target.value)}
                        autoComplete="off"
                        style={{ width: '100%' }}
                      />
                      {suggestions.length > 0 && (
                        <ul className="reminder-suggestions-list">
                          {suggestions.map((med) => (
                            <li 
                              key={med.id} 
                              className="reminder-suggestion-item"
                              onClick={() => selectSuggestion(med.name)}
                            >
                              <span>{med.emoji}</span> <strong>{med.name}</strong> <span style={{fontSize: '0.75rem', color: '#888'}}>({med.category})</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <button
                      type="button"
                      className={`mic-btn-small ${isListening ? 'listening' : ''}`}
                      title="Speak medicine name and time to set reminder"
                      onClick={handleVoiceInput}
                    >
                      {isListening ? '🎙️' : '🎤'}
                    </button>
                  </div>
                  {micError && <p style={{ color: '#e74c3c', fontSize: '0.8rem', marginTop: '4px', margin: 0 }}>⚠️ {micError}</p>}
                </div>

                <div className="form-group">
                  <label>Dose (optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. 500mg, 1 tablet"
                    value={form.dose}
                    onChange={(e) => setForm({ ...form, dose: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Reminder Time *</label>
                  <input
                    type="time"
                    value={form.time}
                    onChange={(e) => setForm({ ...form, time: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Frequency</label>
                  <select value={form.frequency} onChange={(e) => setForm({ ...form, frequency: e.target.value })}>
                    {FREQUENCIES.map((f) => <option key={f}>{f}</option>)}
                  </select>
                </div>

                <div className="form-group">
                  <label>Voice Language</label>
                  <select value={form.lang} onChange={(e) => setForm({ ...form, lang: e.target.value })}>
                    {LANGUAGES.map((l) => <option key={l.code} value={l.code}>{l.label}</option>)}
                  </select>
                </div>
              </div>

              {formError && <p className="form-error">⚠️ {formError}</p>}

              <button type="submit" className="add-reminder-btn">🔔 Set Reminder</button>
            </form>
          )}
        </div>

        {/* Active Reminders */}
        <div className="reminders-section">
          <h3 className="reminders-section-title">
            📋 Active Reminders
            <span className="reminder-count">{reminders.filter((r) => r.enabled).length} active</span>
          </h3>

          {reminders.length === 0 ? (
            <div className="no-reminders">
              <span style={{ fontSize: '3rem' }}>🔕</span>
              <p>No reminders set yet. Add one above!</p>
            </div>
          ) : (
            <div className="reminder-list">
              {reminders.map((r) => (
                <div
                  key={r.id}
                  className={`reminder-card ${!r.enabled ? 'disabled' : ''} ${firedId === r.id ? 'fired' : ''}`}
                >
                  <div className="reminder-card-left">
                    <div className="reminder-time-badge">⏰ {r.time}</div>
                    <div className="reminder-info">
                      <strong className="reminder-med-name">{r.medicine}</strong>
                      {r.dose && <span className="reminder-dose">{r.dose}</span>}
                      <div className="reminder-meta">
                        <span className="reminder-freq">{r.frequency}</span>
                        <span className="reminder-lang">🔊 {langLabel(r.lang)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="reminder-card-actions">
                    <button
                      className="test-btn"
                      title="Test voice reminder now"
                      onClick={() => testReminder(r)}
                    >
                      🔊
                    </button>

                    <label className="toggle-switch" title={r.enabled ? 'Disable' : 'Enable'}>
                      <input
                        type="checkbox"
                        checked={r.enabled}
                        onChange={() => toggleReminder(r.id)}
                      />
                      <span className="toggle-slider" />
                    </label>

                    <button
                      className="delete-reminder-btn"
                      title="Delete reminder"
                      onClick={() => deleteReminder(r.id)}
                    >
                      🗑️
                    </button>
                  </div>

                  {firedId === r.id && (
                    <div className="fired-banner">🔔 Reminder firing now!</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Adherence History Log */}
        <div className="history-section">
          <div className="history-header">
            <h3 className="history-title">📋 Adherence History</h3>
            {history.length > 0 && (
              <button className="clear-history-btn" onClick={clearHistory}>
                🗑️ Clear History
              </button>
            )}
          </div>

          {history.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--text-light)', fontSize: '0.95rem', margin: '15px 0' }}>
              No history logs recorded yet. Track your doses by clicking "Marked as Taken" when reminders ring.
            </p>
          ) : (
            <div className="history-list">
              {history.map((item) => (
                <div key={item.id} className="history-item">
                  <div className="history-item-left">
                    <span className="history-med-info">{item.medicine} {item.dose && `(${item.dose})`}</span>
                    <span className="history-time">Taken at: {item.takenAt}</span>
                  </div>
                  <span className="history-status-badge">✅ Taken</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Active Alarm Modal Overlay */}
        {activeAlarm && (
          <div className="alarm-overlay">
            <div className="alarm-card">
              <span className="alarm-icon">🔔</span>
              <h2 className="alarm-title">Medicine Alarm</h2>
              <p className="alarm-subtitle">Time to take your medicine:</p>
              <h3 style={{ color: 'var(--primary-color)', fontSize: '1.8rem', margin: '10px 0' }}>
                {activeAlarm.medicine}
              </h3>
              {activeAlarm.dose && (
                <p style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-light)', margin: '5px 0' }}>
                  💊 Dosage: {activeAlarm.dose}
                </p>
              )}
              <p style={{ fontSize: '0.9rem', color: '#7f8c8d', fontStyle: 'italic', marginTop: '15px' }}>
                "{getReminderText(activeAlarm.medicine, activeAlarm.lang)}"
              </p>
              
              <div className="alarm-buttons">
                <button className="alarm-btn-taken" onClick={markAsTaken}>
                  💊 Marked as Taken
                </button>
                <button className="alarm-btn-snooze" onClick={snoozeReminder}>
                  ⏰ Snooze (5 mins)
                </button>
                <button className="alarm-btn-dismiss" onClick={dismissAlarm}>
                  ❌ Dismiss Alert
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="ai-disclaimer">
          🔔 <em>Reminders use browser notifications and voice synthesis. Please allow notification permission for best experience.</em>
        </div>
      </div>
    </div>
  );
}

export default MedicineReminder;
