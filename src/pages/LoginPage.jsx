import React, { useState, useEffect } from 'react';
import { USERS, ROLE_THEMES } from '../config/themes';
import { Eye, EyeOff, Heart, AlertCircle } from 'lucide-react';

const ROLE_COLORS = {
  doctor:      '#1a56db',
  admin:       '#4338ca',
  patient:     '#0891b2',
  birthRecord: '#1e3a8a',
};

export default function LoginPage({ onLogin }) {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw]     = useState(false);
  const [error, setError]       = useState('');
  const [hint, setHint]         = useState(null);

  // Reset theme to neutral on login page
  useEffect(() => {
    const root = document.documentElement;
    root.removeAttribute('data-pm-role');
    root.removeAttribute('data-pm-mode');
    // Reset CSS vars to defaults
    const defaults = ROLE_THEMES.doctor.light;
    Object.entries(defaults).forEach(([k, v]) => root.style.setProperty(k, v));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const user = USERS.find(u => u.email === email.toLowerCase().trim() && u.password === password);
    if (user) {
      onLogin(user);
    } else {
      setError('Incorrect email or password. Please try again.');
    }
  };

  const quickLogin = (user) => {
    setEmail(user.email);
    setPassword(user.password);
    setError('');
    setHint(user);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f2d6b 0%, #1a56db 50%, #0891b2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16,
      fontFamily: "'Roboto', sans-serif",
    }}>
      <div style={{ width: '100%', maxWidth: 440 }}>
        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16,
            background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(10px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 12px',
            border: '1px solid rgba(255,255,255,0.2)',
          }}>
            <Heart size={26} color="#fff" />
          </div>
          <h1 style={{ color: '#fff', fontFamily: "'Roboto Condensed', sans-serif", fontSize: '1.8rem', fontWeight: 700, margin: 0 }}>
            Vista Medical Systems
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem', margin: '6px 0 0' }}>
            Hospital Management System
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: '#fff',
          borderRadius: 20,
          padding: '32px 32px 28px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
        }}>
          <h2 style={{ fontFamily: "'Roboto Condensed', sans-serif", fontSize: '1.25rem', fontWeight: 700, margin: '0 0 24px', color: '#111827' }}>
            Sign in to your account
          </h2>

          {error && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: '#fee2e2', border: '1px solid #fca5a5',
              borderRadius: 8, padding: '10px 14px',
              fontSize: '0.82rem', color: '#dc2626',
              marginBottom: 16,
            }}>
              <AlertCircle size={15} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@vistamedical.co.zw"
                required
                style={{
                  width: '100%', padding: '10px 14px',
                  border: '1px solid #d1d5db', borderRadius: 10,
                  fontSize: '0.875rem', outline: 'none',
                  transition: 'border-color 0.2s',
                  color: '#111827',
                  background: '#f9fafb',
                }}
                onFocus={e => e.target.style.borderColor = '#1a56db'}
                onBlur={e => e.target.style.borderColor = '#d1d5db'}
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={{
                    width: '100%', padding: '10px 40px 10px 14px',
                    border: '1px solid #d1d5db', borderRadius: 10,
                    fontSize: '0.875rem', outline: 'none',
                    color: '#111827', background: '#f9fafb',
                  }}
                  onFocus={e => e.target.style.borderColor = '#1a56db'}
                  onBlur={e => e.target.style.borderColor = '#d1d5db'}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(s => !s)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', padding: 0 }}
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              style={{
                width: '100%', padding: '12px',
                background: 'linear-gradient(135deg, #1a56db, #0891b2)',
                color: '#fff', border: 'none', borderRadius: 10,
                fontWeight: 700, fontSize: '0.9rem',
                cursor: 'pointer', transition: 'opacity 0.2s',
              }}
              onMouseOver={e => e.target.style.opacity = '0.9'}
              onMouseOut={e => e.target.style.opacity = '1'}
            >
              Sign In
            </button>
          </form>

          {/* Quick login pills */}
          <div style={{ marginTop: 24, borderTop: '1px solid #e5e7eb', paddingTop: 20 }}>
            <p style={{ fontSize: '0.75rem', color: '#9ca3af', textAlign: 'center', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Demo Quick Login
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {USERS.map(u => (
                <button
                  key={u.id}
                  onClick={() => quickLogin(u)}
                  style={{
                    padding: '8px 10px',
                    background: hint?.id === u.id ? `${ROLE_COLORS[u.role]}18` : '#f9fafb',
                    border: `1px solid ${hint?.id === u.id ? ROLE_COLORS[u.role] : '#e5e7eb'}`,
                    borderRadius: 8,
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s',
                  }}
                >
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: ROLE_COLORS[u.role] }}>
                    {u.role === 'birthRecord' ? 'Birth Records' : u.role.charAt(0).toUpperCase() + u.role.slice(1)}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#374151', marginTop: 1 }}>{u.name.split(' ')[0]}</div>
                </button>
              ))}
            </div>
            {hint && (
              <p style={{ fontSize: '0.72rem', color: '#6b7280', textAlign: 'center', marginTop: 10, marginBottom: 0 }}>
                Credentials filled — press <strong>Sign In</strong> to continue
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
