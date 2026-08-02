import React, { useState } from 'react';
import { signInWithGoogle } from '../services/authService';

export default function SignupPage({ onNavigateLanding, onNavigateLogin, onNavigateVerifyEmail, onEnterApp }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [tradition, setTradition] = useState('Protestant');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onNavigateVerifyEmail) {
      onNavigateVerifyEmail(email, tradition);
    } else {
      onEnterApp(tradition);
    }
  };

  return (
    <div className="auth-container">
      {/* Read-Only Info Pane (60% Desktop) */}
      <div className="auth-info-pane">
        <div className="auth-info-glow"></div>

        {/* Top Header & Back Button */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src="/berea_logo.png" alt="Berea Logo" style={{ width: '34px', height: '34px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)' }} />
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 600, color: '#fff' }}>
              Berea
            </span>
            <span style={{ fontSize: '11px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.18)', padding: '2px 8px', borderRadius: '999px', color: 'var(--gold)', fontWeight: 600 }}>
              Scripture & History
            </span>
          </div>

          <button className="auth-back-btn-dark" onClick={onNavigateLanding}>
            ← Back to Home
          </button>
        </div>

        {/* Middle Main Content */}
        <div style={{ maxWidth: '580px', margin: '40px 0', zIndex: 2 }}>
          <div className="eyebrow" style={{ color: 'var(--gold)', marginBottom: '8px' }}>
            Start Your Journey Free
          </div>
          
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', lineHeight: 1.18, color: '#fff', fontWeight: 600, marginBottom: '20px' }}>
            The Whole Story, Not Just the Sixty-Six.
          </h2>

          <p style={{ fontSize: '16px', lineHeight: 1.65, color: '#C7D2C9', marginBottom: '24px' }}>
            Berea gives you one reverent, unhurried space to study Holy Scripture, the Deuterocanon, and early church writings alongside an intelligent historical assistant.
          </p>

          {/* Acts 17:11 Quote Card */}
          <div className="auth-quote-box">
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '42px', color: 'var(--gold)', lineHeight: 0.8, marginBottom: '12px' }}>
              “
            </div>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '18px', lineHeight: 1.6, color: '#F3EEDF', italic: 'true' }}>
              They received the word with all eagerness, examining the Scriptures daily to see if these things were so.
            </p>
            <div style={{ fontSize: '12.5px', color: 'var(--gold)', marginTop: '14px', fontWeight: 600, letterSpacing: '0.06em' }}>
              ACTS 17:11 • BEREA INSPIRATION
            </div>
          </div>

          {/* Feature Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px', marginTop: '28px' }}>
            <div className="auth-feature-pill">
              <span style={{ fontSize: '18px' }}>✝️</span>
              <div>
                <strong style={{ display: 'block', color: '#fff', marginBottom: '2px' }}>Tradition Lens</strong>
                <span style={{ fontSize: '12.5px', color: '#A9C2AE' }}>Adapts book ordering to your tradition.</span>
              </div>
            </div>

            <div className="auth-feature-pill">
              <span style={{ fontSize: '18px' }}>🌿</span>
              <div>
                <strong style={{ display: 'block', color: '#fff', marginBottom: '2px' }}>No Hidden Data</strong>
                <span style={{ fontSize: '12.5px', color: '#A9C2AE' }}>All texts clearly labeled with origins.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ fontSize: '12.5px', color: '#8FAB95', zIndex: 2 }}>
          Free forever. No credit card required.
        </div>
      </div>

      {/* Form Pane (40% Desktop) */}
      <div className="auth-form-pane">
        
        {/* Top Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <button className="auth-back-btn" onClick={onNavigateLanding}>
            ← Back to Home
          </button>

          <span style={{ fontSize: '13px', color: 'var(--ink-soft)' }}>
            Already have an account?{' '}
            <button onClick={onNavigateLogin} style={{ background: 'none', border: 'none', color: 'var(--moss-dark)', fontWeight: 600, cursor: 'pointer', padding: 0 }}>
              Sign in
            </button>
          </span>
        </div>

        {/* Center Form Container */}
        <div style={{ maxWidth: '360px', margin: '0 auto', width: '100%' }}>
          <h1 style={{ fontSize: '28px', color: 'var(--ink)', marginBottom: '6px', fontWeight: 600 }}>
            Create your account
          </h1>
          <p style={{ fontSize: '13.5px', color: 'var(--ink-soft)', marginBottom: '24px' }}>
            Set your tradition once — Berea adapts scripture order and study tools around it.
          </p>

          {/* Social Signup (Google Only) */}
          <div style={{ marginBottom: '20px' }}>
            <button className="social-auth-btn" type="button" onClick={async () => {
              try {
                await signInWithGoogle();
              } catch (err) {
                console.error("Google sign up error:", err);
              }
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              Sign up with Google
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', margin: '16px 0', gap: '10px' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--line-strong)' }}></div>
            <span style={{ fontSize: '11.5px', color: 'var(--ink-faint)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              or continue with email
            </span>
            <div style={{ flex: 1, height: '1px', background: 'var(--line-strong)' }}></div>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 500, color: 'var(--ink)', marginBottom: '5px' }}>
                Full Name
              </label>
              <input
                type="text"
                required
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid var(--line-strong)',
                  borderRadius: '8px',
                  fontSize: '13.5px',
                  background: 'var(--bg-card)',
                  color: 'var(--ink)',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 500, color: 'var(--ink)', marginBottom: '5px' }}>
                Email Address
              </label>
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid var(--line-strong)',
                  borderRadius: '8px',
                  fontSize: '13.5px',
                  background: 'var(--bg-card)',
                  color: 'var(--ink)',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 500, color: 'var(--ink)', marginBottom: '5px' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 36px 10px 12px',
                    border: '1px solid var(--line-strong)',
                    borderRadius: '8px',
                    fontSize: '13.5px',
                    background: 'var(--bg-card)',
                    color: 'var(--ink)',
                    outline: 'none'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--ink-soft)', cursor: 'pointer', fontSize: '15px' }}
                >
                  <i className={showPassword ? "ti ti-eye-off" : "ti ti-eye"}></i>
                </button>
              </div>
            </div>

            {/* Tradition Selection Card */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 500, color: 'var(--ink)', marginBottom: '5px' }}>
                Select Your Study Tradition
              </label>
              <select
                value={tradition}
                onChange={(e) => setTradition(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid var(--line-strong)',
                  borderRadius: '8px',
                  fontSize: '13.5px',
                  background: 'var(--bg-card)',
                  outline: 'none',
                  color: 'var(--gold)',
                  fontWeight: 600
                }}
              >
                <option value="Protestant">Protestant (66 Books)</option>
                <option value="Catholic">Catholic (73 Books including Tobit, Judith, Sirach)</option>
                <option value="Orthodox">Orthodox (76+ Books including 3 Maccabees, 1 Esdras)</option>
                <option value="Ethiopian">Ethiopian Orthodox Tewahedo (81 Books including 1 Enoch, Jubilees)</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px', borderRadius: '8px', fontSize: '14.5px', fontWeight: 600 }}>
              Create Free Account <i className="ti ti-arrow-right" style={{ marginLeft: '4px' }}></i>
            </button>
          </form>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', fontSize: '12px', color: 'var(--ink-faint)', marginTop: '20px' }}>
          By creating an account, you agree to Berea's Study Terms.
        </div>
      </div>
    </div>
  );
}
