import React from 'react';

/**
 * Top-level error boundary — catches any unhandled render error in the app tree.
 * Without this, a single component crash white-screens the entire app.
 *
 * Usage (main.jsx):
 *   <ErrorBoundary>
 *     <App />
 *   </ErrorBoundary>
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // In Phase 1 this will be wired to a real error-reporting service (e.g. Sentry).
    console.error('[Berea] Unhandled render error:', error, info.componentStack);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <div style={styles.overlay}>
        <div style={styles.card}>
          <div style={styles.icon}>⚠️</div>
          <h1 style={styles.title}>Something went wrong</h1>
          <p style={styles.subtitle}>
            An unexpected error occurred. Your data is safe — this is a display problem only.
          </p>
          {this.state.error && (
            <details style={styles.details}>
              <summary style={styles.summary}>Technical details</summary>
              <pre style={styles.pre}>{this.state.error.toString()}</pre>
            </details>
          )}
          <div style={styles.actions}>
            <button style={styles.btnPrimary} onClick={this.handleReload}>
              Reload app
            </button>
            <button style={styles.btnSecondary} onClick={this.handleReset}>
              Try to recover
            </button>
          </div>
        </div>
      </div>
    );
  }
}

const styles = {
  overlay: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--bg, #0f0f13)',
    padding: '1rem',
    fontFamily: "'Inter', system-ui, sans-serif",
  },
  card: {
    background: 'var(--surface, #1a1a24)',
    border: '1px solid var(--border, rgba(255,255,255,0.08))',
    borderRadius: '1rem',
    padding: '2.5rem 2rem',
    maxWidth: '480px',
    width: '100%',
    textAlign: 'center',
    boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
  },
  icon: {
    fontSize: '3rem',
    marginBottom: '1rem',
  },
  title: {
    color: 'var(--text, #f0ede6)',
    fontSize: '1.5rem',
    fontWeight: 700,
    margin: '0 0 0.75rem',
  },
  subtitle: {
    color: 'var(--text-muted, rgba(240,237,230,0.6))',
    fontSize: '0.95rem',
    lineHeight: 1.6,
    margin: '0 0 1.5rem',
  },
  details: {
    textAlign: 'left',
    marginBottom: '1.5rem',
  },
  summary: {
    cursor: 'pointer',
    color: 'var(--text-muted, rgba(240,237,230,0.5))',
    fontSize: '0.8rem',
    userSelect: 'none',
  },
  pre: {
    marginTop: '0.5rem',
    padding: '0.75rem',
    background: 'rgba(255,255,255,0.04)',
    borderRadius: '0.5rem',
    fontSize: '0.75rem',
    color: '#f87171',
    overflowX: 'auto',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  },
  actions: {
    display: 'flex',
    gap: '0.75rem',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  btnPrimary: {
    padding: '0.65rem 1.5rem',
    background: 'linear-gradient(135deg, #7c5cbf, #5b8dee)',
    color: '#fff',
    border: 'none',
    borderRadius: '0.5rem',
    fontWeight: 600,
    fontSize: '0.9rem',
    cursor: 'pointer',
  },
  btnSecondary: {
    padding: '0.65rem 1.5rem',
    background: 'transparent',
    color: 'var(--text-muted, rgba(240,237,230,0.6))',
    border: '1px solid var(--border, rgba(255,255,255,0.12))',
    borderRadius: '0.5rem',
    fontWeight: 600,
    fontSize: '0.9rem',
    cursor: 'pointer',
  },
};
