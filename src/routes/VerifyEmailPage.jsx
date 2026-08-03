import React, { useState } from 'react';

export default function VerifyEmailPage({ email = 'user@example.com', onNavigateLogin, onNavigateLanding, onVerifySuccess }) {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resentNotice, setResentNotice] = useState(false);

  const handleCodeChange = (index, value) => {
    if (value.length > 1) value = value[value.length - 1];
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-advance focus to next input box
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleVerifySubmit = (e) => {
    e.preventDefault();
    const fullCode = code.join('');
    if (fullCode.length < 6) {
      alert("Please enter the complete 6-digit verification code.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onVerifySuccess();
    }, 800);
  };

  const handleResend = () => {
    setResentNotice(true);
    setTimeout(() => setResentNotice(false), 4000);
  };

  return (
    <div className="auth-container">
      {/* Read-Only Info Pane (60% Desktop) */}
      <div className="auth-info-pane">
        <div className="auth-info-glow"></div>

        {/* Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src="/berea_logo.jpg" alt="Berea Logo" style={{ width: '34px', height: '34px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)' }} />
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 600, color: '#fff' }}>
              Berea
            </span>
          </div>

          <button className="auth-back-btn-dark" onClick={onNavigateLanding}>
            ← Back to Home
          </button>
        </div>

        {/* Middle Main Info */}
        <div style={{ maxWidth: '580px', margin: '40px 0', zIndex: 2 }}>
          <div className="eyebrow" style={{ color: 'var(--gold)', marginBottom: '8px' }}>
            Account Verification
          </div>

          <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', lineHeight: 1.18, color: '#fff', fontWeight: 600, marginBottom: '20px' }}>
            Check Your Email Inbox
          </h2>

          <p style={{ fontSize: '16px', lineHeight: 1.65, color: '#C7D2C9', marginBottom: '28px' }}>
            We've sent a verification link and a 6-digit security code to <strong>{email}</strong>.
          </p>

          {/* Dual Verification Method Feature Card */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="auth-feature-pill">
              <span style={{ fontSize: '20px' }}>✉️</span>
              <div>
                <strong style={{ display: 'block', color: '#fff', marginBottom: '2px' }}>Option A: Click Magic Link</strong>
                <span style={{ fontSize: '13px', color: '#A9C2AE' }}>Open the email on any device and click "Verify Account".</span>
              </div>
            </div>

            <div className="auth-feature-pill">
              <span style={{ fontSize: '20px' }}>🔢</span>
              <div>
                <strong style={{ display: 'block', color: '#fff', marginBottom: '2px' }}>Option B: Enter 6-Digit Code</strong>
                <span style={{ fontSize: '13px', color: '#A9C2AE' }}>Type in the 6-digit security code directly on the right.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ fontSize: '12.5px', color: '#8FAB95', zIndex: 2 }}>
          Need help? Contact Berea Support.
        </div>
      </div>

      {/* Form Pane (40% Desktop) */}
      <div className="auth-form-pane">
        
        {/* Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
          <button className="auth-back-btn" onClick={onNavigateLogin}>
            ← Back to Sign in
          </button>
        </div>

        {/* Center Verification Form */}
        <div style={{ maxWidth: '360px', margin: '0 auto', width: '100%' }}>
          <h1 style={{ fontSize: '26px', color: 'var(--ink)', marginBottom: '8px', fontWeight: 600 }}>
            Enter Security Code
          </h1>
          <p style={{ fontSize: '13.5px', color: 'var(--ink-soft)', marginBottom: '28px' }}>
            Type the 6-digit code sent to <strong style={{ color: 'var(--ink)' }}>{email}</strong>
          </p>

          <form onSubmit={handleVerifySubmit}>
            {/* 6-Digit OTP Code Input Boxes */}
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '24px' }}>
              {code.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-input-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  style={{
                    width: '44px',
                    height: '50px',
                    textAlign: 'center',
                    fontSize: '20px',
                    fontWeight: 700,
                    borderRadius: '8px',
                    border: '1.5px solid var(--line-strong)',
                    background: 'var(--bg-card)',
                    color: 'var(--ink)',
                    outline: 'none'
                  }}
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '12px', borderRadius: '8px', fontSize: '15px', fontWeight: 600, marginBottom: '20px' }}
            >
              {loading ? "Verifying Code..." : "Verify & Continue to App"} <i className="ti ti-arrow-right" style={{ marginLeft: '4px' }}></i>
            </button>
          </form>

          {/* Resend Notice & Link */}
          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            {resentNotice ? (
              <span style={{ fontSize: '13px', color: 'var(--moss)', fontWeight: 600 }}>
                ✓ Verification code resent! Check your inbox.
              </span>
            ) : (
              <span style={{ fontSize: '13px', color: 'var(--ink-soft)' }}>
                Didn't get the code?{' '}
                <button
                  onClick={handleResend}
                  style={{ background: 'none', border: 'none', color: 'var(--moss-dark)', fontWeight: 600, cursor: 'pointer', padding: 0 }}
                >
                  Resend Code
                </button>
              </span>
            )}
          </div>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', fontSize: '12px', color: 'var(--ink-faint)', marginTop: '24px' }}>
          Check spam folder if email takes more than 1 minute.
        </div>
      </div>
    </div>
  );
}
