import React, { useState } from 'react';

export default function SignupPage({ onNavigateLogin, onEnterApp }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tradition, setTradition] = useState('Protestant');

  const handleSubmit = (e) => {
    e.preventDefault();
    onEnterApp(tradition);
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
            The whole story, not just the sixty-six.
          </p>
        </div>
        <div style={{ fontSize: '12.5px', color: '#8FAB95' }}>
          Free to start. No card required.
        </div>
      </div>

      <div style={{ padding: '60px 48px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ maxWidth: '320px', margin: '0 auto', width: '100%' }}>
          <h1 style={{ fontSize: '26px', marginBottom: '8px' }}>Create your account</h1>
          <p style={{ fontSize: '14px', color: 'var(--ink-soft)', marginBottom: '28px' }}>
            Set your tradition once — Berea adapts around it.
          </p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12.5px', color: 'var(--ink-soft)', marginBottom: '6px' }}>
                Name
              </label>
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
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
                placeholder="At least 8 characters"
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

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12.5px', color: 'var(--ink-soft)', marginBottom: '6px' }}>
                Your tradition
              </label>
              <select
                value={tradition}
                onChange={(e) => setTradition(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid var(--line-strong)',
                  borderRadius: '8px',
                  fontSize: '14px',
                  background: '#fff'
                }}
              >
                <option value="Protestant">Protestant</option>
                <option value="Catholic">Catholic</option>
                <option value="Orthodox">Orthodox</option>
                <option value="Ethiopian">Ethiopian Orthodox</option>
              </select>
            </div>

            <button type="submit" class="btn btn-primary" style={{ width: '100%', justifyContent: 'center', margin: '6px 0 16px' }}>
              Create account
            </button>
          </form>

          <p style={{ fontSize: '13.5px', color: 'var(--ink-soft)', textAlign: 'center', marginTop: '20px' }}>
            Already have an account?{' '}
            <button
              onClick={onNavigateLogin}
              style={{ background: 'none', border: 'none', color: 'var(--moss-dark)', fontWeight: 500, padding: 0 }}
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
