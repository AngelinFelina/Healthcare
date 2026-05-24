import React, { useState } from 'react';

function Login({ onLogin, onBack, onNavigateToSignUp }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      onLogin(data.token, data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="glass-panel auth-panel">
        <button className="back-btn" onClick={onBack}>&larr; Back to Home</button>
        <h2 className="title" style={{ marginTop: '10px' }}>Welcome Back</h2>
        <p className="subtitle">Please login to your account</p>
        
        {error && <div className="offline-banner" style={{background: 'var(--severity-high)'}}>{error}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Enter your email" />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Enter your password" />
          </div>
          
          <button type="submit" className="check-btn" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <p className="auth-switch-text">
          Don't have an account? <span onClick={onNavigateToSignUp}>Sign Up</span>
        </p>
      </div>
    </div>
  );
}

export default Login;
