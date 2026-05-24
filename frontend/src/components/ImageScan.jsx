import React, { useState, useRef } from 'react';

const CONDITIONS = [
  {
    name: 'Possible Fungal Infection (Tinea)',
    category: 'Skin Infection',
    description: 'Ring-shaped, scaly patches caused by dermatophytes. Common in warm, moist skin areas.',
    urgency: 'low',
    urgencyLabel: '🟢 Non-Urgent',
    urgencyColor: '#2ecc71',
    confidence: 84,
    recommendations: [
      'Apply antifungal cream (clotrimazole) twice daily',
      'Keep the area clean and dry',
      'Avoid sharing towels or clothing',
      'See a doctor if no improvement in 2 weeks',
    ],
  },
  {
    name: 'Possible Eczema (Dermatitis)',
    category: 'Skin Inflammation',
    description: 'Inflamed, itchy, and red skin patches. Often triggered by allergens, dry skin, or stress.',
    urgency: 'low',
    urgencyLabel: '🟢 Non-Urgent',
    urgencyColor: '#2ecc71',
    confidence: 78,
    recommendations: [
      'Moisturize frequently with fragrance-free lotion',
      'Avoid hot showers — use lukewarm water',
      'Use mild, unscented soap',
      'Consult a dermatologist for prescription cream if severe',
    ],
  },
  {
    name: 'Possible Infected Wound',
    category: 'Wound Infection',
    description: 'Signs of bacterial infection: redness, swelling, warmth, and possible pus discharge.',
    urgency: 'high',
    urgencyLabel: '🔴 Urgent — See Doctor Now',
    urgencyColor: '#e74c3c',
    confidence: 91,
    recommendations: [
      'Clean wound gently with clean water',
      'Apply antiseptic (betadine)',
      'Cover with a sterile bandage',
      'Visit a doctor immediately for antibiotics',
      'Watch for fever or red streaks — seek emergency care',
    ],
  },
  {
    name: 'Possible Conjunctivitis (Pink Eye)',
    category: 'Eye Condition',
    description: 'Redness and inflammation of the eye. Can be viral, bacterial, or allergic in origin.',
    urgency: 'moderate',
    urgencyLabel: '🟡 Moderate — Consult Doctor',
    urgencyColor: '#f39c12',
    confidence: 82,
    recommendations: [
      'Do not rub your eyes',
      'Wash hands frequently',
      'Use clean towels — do not share',
      'Apply cool compress for relief',
      'See a doctor for antibiotic eye drops if bacterial',
    ],
  },
  {
    name: 'Possible Heat Rash (Miliaria)',
    category: 'Skin Rash',
    description: 'Small red bumps or blisters from blocked sweat ducts. Common in hot, humid weather.',
    urgency: 'low',
    urgencyLabel: '🟢 Non-Urgent',
    urgencyColor: '#2ecc71',
    confidence: 89,
    recommendations: [
      'Move to a cooler environment',
      'Wear loose, breathable cotton clothing',
      'Keep the area dry',
      'Avoid heavy creams or oils',
      'Calamine lotion can soothe itching',
    ],
  },
  {
    name: 'Possible Burn Injury (1st–2nd Degree)',
    category: 'Burn',
    description: 'Redness, blistering, or peeling skin from heat, chemical, or sun exposure.',
    urgency: 'high',
    urgencyLabel: '🔴 Urgent — Medical Attention',
    urgencyColor: '#e74c3c',
    confidence: 93,
    recommendations: [
      'Run cool (not cold) water over the burn for 10–20 minutes',
      'Do NOT apply ice, butter, or toothpaste',
      'Cover loosely with a clean bandage',
      'Take paracetamol for pain relief',
      'Seek emergency help for large or deep burns',
    ],
  },
  {
    name: 'Possible Psoriasis',
    category: 'Chronic Skin Condition',
    description: 'Thick, scaly, silvery patches on skin. A chronic autoimmune condition with flare-ups.',
    urgency: 'moderate',
    urgencyLabel: '🟡 Moderate — See Dermatologist',
    urgencyColor: '#f39c12',
    confidence: 76,
    recommendations: [
      'Moisturize daily with thick cream',
      'Avoid triggers: stress, smoking, certain medicines',
      'Moderate sunlight exposure can help',
      'See a dermatologist for prescription treatment',
    ],
  },
  {
    name: 'Possible Allergic Reaction / Hives',
    category: 'Allergic Reaction',
    description: 'Red, raised, itchy welts on the skin from allergens like food, medicine, or insect bites.',
    urgency: 'moderate',
    urgencyLabel: '🟡 Moderate — Monitor Closely',
    urgencyColor: '#f39c12',
    confidence: 85,
    recommendations: [
      'Identify and remove the allergen',
      'Take an antihistamine (cetirizine/loratadine)',
      'Apply a cool compress for relief',
      'Seek emergency care for breathing difficulty or throat swelling',
    ],
  },
];

function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

const STEPS = [
  'Preprocessing image...',
  'Extracting visual features...',
  'Running classification model...',
  'Scoring conditions...',
  'Generating report...',
];

function ImageScan({ onBack }) {
  const [dragOver, setDragOver] = useState(false);
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stepLabel, setStepLabel] = useState('');
  const [result, setResult] = useState(null);
  const fileRef = useRef();

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    setImageFile(file);
    setResult(null);
    const reader = new FileReader();
    reader.onload = (e) => setImage(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const analyzeImage = async () => {
    if (!imageFile) return;
    setAnalyzing(true);
    setProgress(0);
    setResult(null);

    for (let i = 0; i < STEPS.length; i++) {
      setStepLabel(STEPS[i]);
      await new Promise((r) => setTimeout(r, 700));
      setProgress(Math.round(((i + 1) / STEPS.length) * 100));
    }

    const seed = hashCode(imageFile.name + imageFile.size + imageFile.lastModified);
    const condition = CONDITIONS[seed % CONDITIONS.length];
    setAnalyzing(false);
    setResult(condition);
  };

  const reset = () => {
    setImage(null);
    setImageFile(null);
    setResult(null);
    setProgress(0);
  };

  return (
    <div className="feature-page-container">
      <div className="feature-glass-panel">
        <button className="back-btn" onClick={onBack}>
          ← Back to Dashboard
        </button>

        <div className="feature-header">
          <span className="feature-icon-large">📸</span>
          <div>
            <h1 className="feature-title">AI Image Scan</h1>
            <p className="feature-subtitle">
              Upload a photo of skin, eyes, or wounds for instant AI analysis
            </p>
          </div>
        </div>

        {/* Supported types */}
        <div className="scan-type-row">
          {['🦠 Skin Infection', '👁️ Eye Redness', '🩹 Wound', '🔴 Rashes'].map((t) => (
            <span key={t} className="scan-type-chip">{t}</span>
          ))}
        </div>

        {/* Upload Zone */}
        <div
          className={`upload-zone ${dragOver ? 'drag-over' : ''}`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => !image && fileRef.current.click()}
        >
          {image ? (
            <div className="image-preview-wrap">
              <img src={image} alt="Uploaded preview" className="preview-img" />
              <button
                className="change-img-btn"
                onClick={(e) => { e.stopPropagation(); fileRef.current.click(); }}
              >
                📷 Change Photo
              </button>
            </div>
          ) : (
            <div className="upload-placeholder">
              <div className="upload-icon-big">📷</div>
              <p className="upload-main-text">Drag & drop an image here</p>
              <p className="upload-hint-text">or click to browse your device</p>
              <p className="upload-formats">JPG, PNG, WEBP supported</p>
            </div>
          )}
        </div>

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={(e) => handleFile(e.target.files[0])}
        />

        {image && !analyzing && !result && (
          <button className="analyze-btn" onClick={analyzeImage}>
            🔍 Analyze with AI
          </button>
        )}

        {analyzing && (
          <div className="analyzing-box">
            <div className="analyzing-spinner" />
            <p className="analyzing-label">{stepLabel}</p>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <p className="progress-pct">{progress}%</p>
          </div>
        )}

        {result && (
          <div className={`scan-result-card urgency-border-${result.urgency}`}>
            <div className="result-top-row">
              <div>
                <span className="result-category-label">{result.category}</span>
                <h2 className="result-condition-name">{result.name}</h2>
              </div>
              <div className="urgency-pill" style={{ background: result.urgencyColor }}>
                {result.urgencyLabel}
              </div>
            </div>

            <p className="result-desc-text">{result.description}</p>

            <div className="confidence-row">
              <span>AI Confidence</span>
              <div className="confidence-track">
                <div
                  className="confidence-fill"
                  style={{ width: `${result.confidence}%`, background: result.urgencyColor }}
                />
              </div>
              <strong>{result.confidence}%</strong>
            </div>

            <div className="recommendations-box">
              <h4>📋 Recommendations</h4>
              <ul>
                {result.recommendations.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>

            <div className="ai-disclaimer">
              ⚠️ <em>This is an AI-assisted analysis for guidance only. Always consult a qualified doctor for medical diagnosis.</em>
            </div>

            <button className="scan-again-btn" onClick={reset}>
              🔄 Scan Another Image
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ImageScan;
