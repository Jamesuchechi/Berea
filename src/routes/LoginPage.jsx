import React, { useState } from 'react';

export default function LoginPage({ onNavigateSignup, onEnterApp }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onEnterApp();
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 440px', minHeight: '100vh' }}>
      <div
        style={{
          background: 'var(--moss-dark)',
          color: '#EFE9DA',
          padding: '60px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}
      >
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '19px', color: '#fff' }}>
          Berea
        </div>
        <div style={{ maxWidth: '420px' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '52px', color: 'var(--gold)', lineHeight: 1, marginBottom: '18px' }}>
            &ldquo;
          </div>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '22px', lineHeight: 1.55, color: '#F3EEDF' }}>
            They examined the scriptures every day, to see if these things were so.
          </p>
          <div style={{ fontSize: '13px', color: '#9FB6A3', marginTop: '16px' }}>
            Acts 17:11
          </div>
        </div>
        <div style={{ fontSize: '12.5px', color: '#8FAB95' }}>
          Welcome back to your study.
        </div>
      </div>

      <div style={{ padding: '60px 48px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ maxWidth: '320px', margin: '0 auto', width: '100%' }}>
          <h1 style={{ fontSize: '26px', marginBottom: '8px' }}>Sign in</h1>
          <p style={{ fontSize: '14px', color: 'var(--ink-soft)', marginBottom: '28px' }}>
            Pick up your reading where you left off.
          </p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12.5px', color: 'var(--ink-soft)', marginBottom: '6px' }}>
                Email
              </label>
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid var(--line-strong)',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12.5px', color: 'var(--ink-soft)', marginBottom: '6px' }}>
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid var(--line-strong)',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              />
            </div>

            <button type="submit" class="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginBottom: '16px' }}>
              Sign in
            </button>
          </form>

          <p style={{ fontSize: '13.5px', color: 'var(--ink-soft)', textAlign: 'center', marginTop: '20px' }}>
            New to Berea?{' '}
            <button
              onClick={onNavigateSignup}
              style={{ background: 'none', border: 'none', color: 'var(--moss-dark)', fontWeight: 500, padding: 0 }}
            >
              Create an account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
