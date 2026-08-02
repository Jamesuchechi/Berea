import React, { useState } from 'react';

export default function LoginPage({ onNavigateLanding, onNavigateSignup, onEnterApp }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onEnterApp();
  };

  return (
    <div class="auth-container">
      {/* Read-Only Info Pane (60% Desktop) */}
      <div class="auth-info-pane">
        <div class="auth-info-glow"></div>

        {/* Top Header & Back Button */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src="/berea_logo.png" alt="Berea Logo" style={{ width: '34px', height: '34px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)' }} />
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 600, color: '#fff' }}>
              Berea
            </span>
            <span style={{ fontSize: '11px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.18)', padding: '2px 8px', borderRadius: '999px', color: 'var(--gold)', fontWeight: 600 }}>
              Scripture Study
            </span>
          </div>

          <button class="auth-back-btn-dark" onClick={onNavigateLanding}>
            ← Back to Home
          </button>
        </div>

        {/* Middle Main Content */}
        <div style={{ maxWidth: '580px', margin: '40px 0', zIndex: 2 }}>
          <div class="eyebrow" style={{ color: 'var(--gold)', marginBottom: '8px' }}>
            Return To Scripture Study
          </div>
          
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', lineHeight: 1.18, color: '#fff', fontWeight: 600, marginBottom: '20px' }}>
            The Whole Story, Not Just the Sixty-Six.
          </h2>

          <p style={{ fontSize: '16px', lineHeight: 1.65, color: '#C7D2C9', marginBottom: '28px' }}>
            Log back into your reverent study workspace. Access your personal highlights, custom notes, historical cross-references, and multi-tradition canons seamlessly.
          </p>

          {/* Acts 17:11 Quote Card */}
          <div class="auth-quote-box">
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '42px', color: 'var(--gold)', lineHeight: 0.8, marginBottom: '12px' }}>
              “
            </div>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '18px', lineHeight: 1.6, color: '#F3EEDF', italic: 'true' }}>
              Now these Jews were more noble than those in Thessalonica; they received the word with all eagerness, examining the Scriptures daily to see if these things were so.
            </p>
            <div style={{ fontSize: '12.5px', color: 'var(--gold)', marginTop: '14px', fontWeight: 600, letterSpacing: '0.06em' }}>
              ACTS 17:11 • ESV
            </div>
          </div>

          {/* Feature Bullets */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px', marginTop: '32px' }}>
            <div class="auth-feature-pill">
              <span style={{ fontSize: '18px' }}>📚</span>
              <div>
                <strong style={{ display: 'block', color: '#fff', marginBottom: '2px' }}>4 Historic Canons</strong>
                <span style={{ fontSize: '12.5px', color: '#A9C2AE' }}>Protestant, Catholic, Orthodox & Ethiopian.</span>
              </div>
            </div>

            <div class="auth-feature-pill">
              <span style={{ fontSize: '18px' }}>💡</span>
              <div>
                <strong style={{ display: 'block', color: '#fff', marginBottom: '2px' }}>Berea AI Partner</strong>
                <span style={{ fontSize: '12.5px', color: '#A9C2AE' }}>Context-aware historical insights.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ fontSize: '12.5px', color: '#8FAB95', zIndex: 2 }}>
          © 2026 Berea Study Systems • All notes & text stored securely.
        </div>
      </div>

      {/* Form Pane (40% Desktop) */}
      <div class="auth-form-pane">
        
        {/* Mobile / Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
          <button class="auth-back-btn" onClick={onNavigateLanding}>
            ← Back to Home
          </button>

          <span style={{ fontSize: '13px', color: 'var(--ink-soft)' }}>
            Need an account?{' '}
            <button onClick={onNavigateSignup} style={{ background: 'none', border: 'none', color: 'var(--moss-dark)', fontWeight: 600, cursor: 'pointer', padding: 0 }}>
              Sign up
            </button>
          </span>
        </div>

        {/* Center Form Container */}
        <div style={{ maxWidth: '360px', margin: '0 auto', width: '100%' }}>
          <h1 style={{ fontSize: '28px', color: 'var(--ink)', marginBottom: '8px', fontWeight: 600 }}>
            Sign in to Berea
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--ink-soft)', marginBottom: '28px' }}>
            Enter your credentials to access your reading plans and study notes.
          </p>

          {/* Social Sign-In Button (Google Only) */}
          <div style={{ marginBottom: '24px' }}>
            <button class="social-auth-btn" type="button" onClick={onEnterApp}>
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              Sign in with Google
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0', gap: '12px' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--line-strong)' }}></div>
            <span style={{ fontSize: '12px', color: 'var(--ink-faint)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              or email
            </span>
            <div style={{ flex: 1, height: '1px', background: 'var(--line-strong)' }}></div>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--ink)', marginBottom: '6px' }}>
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
                  padding: '11px 14px',
                  border: '1px solid var(--line-strong)',
                  borderRadius: '8px',
                  fontSize: '14px',
                  background: 'var(--bg-card)',
                  color: 'var(--ink)',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--ink)' }}>
                  Password
                </label>
                <a href="#forgot" onClick={(e) => { e.preventDefault(); alert("Password reset link sent to your email!"); }} style={{ fontSize: '12.5px', color: 'var(--moss-dark)', fontWeight: 500 }}>
                  Forgot?
                </a>
              </div>
              
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '11px 38px 11px 14px',
                    border: '1px solid var(--line-strong)',
                    borderRadius: '8px',
                    fontSize: '14px',
                    background: 'var(--bg-card)',
                    color: 'var(--ink)',
                    outline: 'none'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--ink-soft)', cursor: 'pointer', fontSize: '16px' }}
                >
                  <i class={showPassword ? "ti ti-eye-off" : "ti ti-eye"}></i>
                </button>
              </div>
            </div>

            <button type="submit" class="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px', borderRadius: '8px', fontSize: '15px', fontWeight: 600 }}>
              Sign In to Berea <i class="ti ti-arrow-right" style={{ marginLeft: '4px' }}></i>
            </button>
          </form>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', fontSize: '12.5px', color: 'var(--ink-faint)', marginTop: '24px' }}>
          By signing in, you agree to Berea's Study Terms & Privacy.
        </div>
      </div>
    </div>
  );
}
