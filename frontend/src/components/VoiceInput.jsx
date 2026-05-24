import React, { useState } from 'react';
import '../index.css';

const VoiceInput = ({ onKeywordsDetected, lang, t }) => {
  const [isListening, setIsListening] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const startListening = () => {
    // Map our app languages to browser speech API codes
    const langMap = {
      'en': 'en-IN', // Indian English is better for accents
      'hi': 'hi-IN',
      'ta': 'ta-IN'
    };

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setErrorMsg(t.voiceError);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = langMap[lang] || 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      setErrorMsg('');
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      console.log("Heard:", transcript);
      
      // Simple Keyword Extraction
      const keywords = [];
      if (transcript.includes('fever') || transcript.includes('बुखार') || transcript.includes('காய்ச்சல்')) keywords.push('fever');
      if (transcript.includes('cough') || transcript.includes('खांसी') || transcript.includes('இருமல்')) keywords.push('cough');
      if (transcript.includes('headache') || transcript.includes('सिरदर्द') || transcript.includes('தலைவலி')) keywords.push('headache');
      if (transcript.includes('pain') || transcript.includes('दर्द') || transcript.includes('வலி')) {
        if (transcript.includes('stomach') || transcript.includes('पेट') || transcript.includes('வயிற்று')) keywords.push('stomach_pain');
        if (transcript.includes('chest') || transcript.includes('छाती') || transcript.includes('நெஞ்சு')) keywords.push('chest_pain');
      }
      if (transcript.includes('vomit') || transcript.includes('उल्टी') || transcript.includes('வாந்தி')) keywords.push('vomiting');
      if (transcript.includes('dizzy') || transcript.includes('चक्कर') || transcript.includes('மயக்கம்')) keywords.push('dizziness');
      if (transcript.includes('tired') || transcript.includes('थकान') || transcript.includes('சோர்வு')) keywords.push('tiredness');
      if (transcript.includes('swell') || transcript.includes('सूजन') || transcript.includes('வீக்கம்')) keywords.push('swelling');
      if (transcript.includes('bleed') || transcript.includes('रक्तस्राव') || transcript.includes('இரத்தப்போக்கு')) keywords.push('bleeding');

      onKeywordsDetected(keywords);
    };

    recognition.onerror = (event) => {
      console.error(event);
      if (event.error !== 'no-speech') {
        setErrorMsg(t.voiceError);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  return (
    <div className="voice-input-container" style={{ textAlign: 'center', marginBottom: '20px' }}>
      <button 
        onClick={startListening} 
        disabled={isListening}
        className={`voice-btn ${isListening ? 'listening' : ''}`}
        style={{
          background: isListening ? '#e74c3c' : 'var(--primary-color)',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '60px',
          height: '60px',
          fontSize: '24px',
          cursor: 'pointer',
          boxShadow: isListening ? '0 0 15px rgba(231, 76, 60, 0.6)' : '0 4px 10px rgba(11, 158, 118, 0.3)',
          transition: 'all 0.3s ease'
        }}
      >
        🎤
      </button>
      <div style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginTop: '8px' }}>
        {isListening ? t.listening : t.voiceHint}
      </div>
      {errorMsg && <div style={{ color: '#e74c3c', fontSize: '0.85rem', marginTop: '4px' }}>{errorMsg}</div>}
    </div>
  );
};

export default VoiceInput;
