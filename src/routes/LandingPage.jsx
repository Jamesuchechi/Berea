import React, { useState } from 'react';

const CANON_DATA = {
  protestant: {
    name: 'Protestant Canon',
    count: '66 Books',
    description: '39 Old Testament + 27 New Testament books aligned with the Hebrew Tanakh and Greek New Testament.',
    sampleBooks: [
      { name: 'Genesis', type: 'canonical' },
      { name: 'Psalms', type: 'canonical' },
      { name: 'Isaiah', type: 'canonical' },
      { name: 'Matthew', type: 'canonical' },
      { name: 'Romans', type: 'canonical' },
      { name: 'Revelation', type: 'canonical' }
    ]
  },
  catholic: {
    name: 'Catholic Canon',
    count: '73 Books',
    description: 'Includes the 66 canonical books plus 7 Deuterocanonical books (Tobit, Judith, Wisdom, Sirach, Baruch, 1 & 2 Maccabees) and additions to Esther & Daniel.',
    sampleBooks: [
      { name: 'Tobit', type: 'deuterocanon' },
      { name: 'Judith', type: 'deuterocanon' },
      { name: 'Wisdom of Solomon', type: 'deuterocanon' },
      { name: 'Sirach (Ecclesiasticus)', type: 'deuterocanon' },
      { name: 'Baruch', type: 'deuterocanon' },
      { name: '1 & 2 Maccabees', type: 'deuterocanon' }
    ]
  },
  orthodox: {
    name: 'Eastern Orthodox Canon',
    count: '76+ Books',
    description: 'Includes the Septuagint Deuterocanon plus 3 Maccabees, 1 Esdras, Psalm 151, and Prayer of Manasseh (with 4 Maccabees in appendix).',
    sampleBooks: [
      { name: '3 Maccabees', type: 'deuterocanon' },
      { name: '1 Esdras', type: 'deuterocanon' },
      { name: 'Psalm 151', type: 'deuterocanon' },
      { name: 'Prayer of Manasseh', type: 'deuterocanon' },
      { name: 'Wisdom of Sirach', type: 'deuterocanon' },
      { name: 'Tobit & Judith', type: 'deuterocanon' }
    ]
  },
  ethiopian: {
    name: 'Ethiopian Orthodox Tewahedo',
    count: '81 Books',
    description: 'The broadest Christian canon including 1 Enoch, Jubilees, 1-3 Meqabyan, 4 Baruch, and Apostolic ordinances.',
    sampleBooks: [
      { name: '1 Enoch (Henok)', type: 'deuterocanon' },
      { name: 'Jubilees (Kufale)', type: 'deuterocanon' },
      { name: '1-3 Meqabyan', type: 'deuterocanon' },
      { name: '4 Baruch (Rest of Baruch)', type: 'deuterocanon' },
      { name: 'Book of the Covenant', type: 'deuterocanon' },
      { name: 'Didascalia', type: 'deuterocanon' }
    ]
  }
};

const SAMPLE_PROMPTS = [
  {
    id: 'tobit',
    title: 'Why is Tobit in Catholic Bibles but omitted in Protestant Bibles?',
    passage: 'Tobit 1:1-3 & Canon History',
    answer: 'Tobit was included in the Greek Septuagint (LXX) used by early Greek-speaking Christians and affirmed at the Councils of Hippo (393 AD) and Carthage (397 AD). During the Reformation, Martin Luther placed Tobit in the Apocrypha section based on the Hebrew Masoretic text canon finalized by Rabbinic tradition, considering it useful for reading but not equal to holy scripture.'
  },
  {
    id: 'enoch',
    title: 'How does Jude 1:14 quote 1 Enoch?',
    passage: 'Jude 1:14-15 & 1 Enoch 1:9',
    answer: 'Jude 1:14 directly quotes 1 Enoch 1:9 ("Behold, the Lord comes with ten thousands of his holy ones..."). While 1 Enoch was widely venerated by early Christian fathers like Tertullian and remains fully canonical in the Ethiopian Orthodox Church, western church councils omitted it from primary canon due to authorship debates and manuscript preservation.'
  },
  {
    id: 'wisdom',
    title: 'Compare Wisdom in Proverbs 8 and Sirach 24',
    passage: 'Proverbs 8:22 vs Sirach 24:1-12',
    answer: 'Both passages personify Divine Wisdom as created before the ages and dwelling with God. Sirach 24 explicitly identifies Wisdom with the Mosaic Law (Torah) abiding in Jerusalem, bridging Old Testament wisdom literature with the Logos theology developed in John 1:1-14.'
  }
];

const FAQS = [
  {
    question: 'What makes Berea different from traditional Bible apps?',
    answer: 'Berea allows you to study Scripture alongside the Deuterocanon, Apocrypha, and early church writings seamlessly formatted by historic traditions (Protestant, Catholic, Orthodox, Ethiopian). It combines reverence with powerful AI context, visual lineages, and verse-anchored study tools.'
  },
  {
    question: 'How does the Berea AI Study Assistant handle different traditions?',
    answer: 'Berea AI is built to be objective, contextual, and non-dogmatic. Rather than enforcing one theological view, it presents how Catholic, Orthodox, Protestant, and historical scholars interpret a given passage, giving you a complete, transparent picture.'
  },
  {
    question: 'Can I use Berea offline?',
    answer: 'Yes! Berea is built as a modern Progressive Web App (PWA). All text, notes, and saved canons are cached locally so your quiet study time is never interrupted by lost internet connectivity.'
  },
  {
    question: 'Are historical writings clearly distinguished from Canonical Scripture?',
    answer: 'Absolutely. Every book and passage in Berea displays clear badges indicating its canonical status according to your chosen tradition (Canonical, Deuterocanon, Early Church Writing, Pseudepigrapha).'
  }
];

export default function LandingPage({ theme = 'light', setTheme, onNavigateLogin, onNavigateSignup, onEnterApp }) {
  const [selectedCanon, setSelectedCanon] = useState('catholic');
  const [activePromptId, setActivePromptId] = useState('tobit');
  const [openFaqIndex, setOpenFaqIndex] = useState(0);
  const [mockupTab, setMockupTab] = useState('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const activePrompt = SAMPLE_PROMPTS.find(p => p.id === activePromptId) || SAMPLE_PROMPTS[0];

  return (
    <div style={{ background: 'var(--parchment)', color: 'var(--ink)', minHeight: '100vh', position: 'relative', overflowX: 'hidden' }}>
      
      {/* Background Radial Glow */}
      <div className="hero-glow"></div>

      {/* Responsive Sticky Header */}
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 24px',
          borderBottom: '1px solid var(--line)',
          background: 'var(--parchment)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          position: 'sticky',
          top: 0,
          zIndex: 50
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src="/berea_logo.jpg" alt="Berea Logo" style={{ width: '34px', height: '34px', borderRadius: '8px', border: '1px solid var(--line-strong)' }} />
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 600, letterSpacing: '0.01em', color: 'var(--ink)' }}>
            Berea
          </span>
          <span style={{ fontSize: '11px', background: 'var(--parchment-deep)', border: '1px solid var(--line-strong)', padding: '2px 8px', borderRadius: '999px', color: 'var(--gold)', fontWeight: 600 }}>
            Scripture & History
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav style={{ display: 'flex', gap: '28px', fontSize: '14px', fontWeight: 500, color: 'var(--ink-soft)' }} className="landing-desktop-nav">
          <a href="#hero-preview">Canon Switcher</a>
          <a href="#features">What's Inside</a>
          <a href="#assistant-demo">AI Assistant</a>
          <a href="#faq">FAQ</a>
        </nav>

        {/* Desktop Header Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }} className="landing-desktop-actions">
          {/* Interactive Theme Switcher Toggle */}
          <button
            className={`theme-switch ${theme === 'dark' ? 'active' : ''}`}
            onClick={() => setTheme && setTheme(theme === 'dark' ? 'light' : 'dark')}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            aria-label="Toggle Theme"
          >
            <span className="theme-switch-track">
              <span className="theme-switch-icon sun"><i className="ti ti-sun"></i></span>
              <span className="theme-switch-icon moon"><i className="ti ti-moon"></i></span>
              <span className="theme-switch-thumb"></span>
            </span>
          </button>

          <button className="btn btn-ghost" onClick={onNavigateLogin} style={{ borderRadius: '8px', padding: '8px 16px', color: 'var(--ink)' }}>
            Sign in
          </button>
          <button className="btn btn-primary" onClick={onNavigateSignup} style={{ borderRadius: '8px', padding: '8px 18px', boxShadow: '0 4px 14px rgba(36, 58, 43, 0.2)' }}>
            Start reading free
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className="landing-hamburger-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Mobile Menu"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            borderRadius: '8px',
            border: '1.5px solid var(--gold)',
            background: 'var(--parchment-deep)',
            color: 'var(--ink)',
            cursor: 'pointer'
          }}
        >
          {!mobileMenuOpen ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          )}
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink)' }}>Menu</span>
        </button>

        {/* Mobile Slide-Down Drawer Overlay */}
        {mobileMenuOpen && (
          <div className="landing-mobile-drawer">
            <a href="#hero-preview" className="landing-mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
              📖 Canon Switcher
            </a>
            <a href="#features" className="landing-mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
              ✨ What's Inside
            </a>
            <a href="#assistant-demo" className="landing-mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
              💡 AI Study Assistant
            </a>
            <a href="#faq" className="landing-mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
              ❓ FAQ
            </a>
            
            {/* Mobile Theme Switcher */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--line)' }}>
              <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--ink)' }}>🎨 App Mode:</span>
              <button
                className={`theme-switch ${theme === 'dark' ? 'active' : ''}`}
                onClick={() => setTheme && setTheme(theme === 'dark' ? 'light' : 'dark')}
                aria-label="Toggle Theme"
              >
                <span className="theme-switch-track">
                  <span className="theme-switch-icon sun"><i className="ti ti-sun"></i></span>
                  <span className="theme-switch-icon moon"><i className="ti ti-moon"></i></span>
                  <span className="theme-switch-thumb"></span>
                </span>
              </button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '8px' }}>
              <button
                className="btn btn-primary"
                onClick={() => { setMobileMenuOpen(false); onEnterApp(); }}
                style={{ width: '100%', justifyContent: 'center', padding: '12px' }}
              >
                Launch Reader App <i className="ti ti-arrow-right"></i>
              </button>
              <button
                className="btn btn-ghost"
                onClick={() => { setMobileMenuOpen(false); onNavigateLogin(); }}
                style={{ width: '100%', justifyContent: 'center', padding: '10px', background: 'var(--bg-card)', color: 'var(--ink)' }}
              >
                Sign In
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section style={{ padding: '56px 18px 64px', textAlign: 'center', position: 'relative' }}>
        <div style={{ maxWidth: '820px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          
          {/* Illuminated Dropcap */}
          <div className="dropcap-glow-container">
            <div className="dropcap-orbit"></div>
            <div className="dropcap-large" style={{ color: 'var(--gold)' }}>B</div>
          </div>

          <div className="eyebrow" style={{ marginBottom: '12px' }}>
            ✨ For those who search the scriptures daily
          </div>

          <h1 className="gradient-heading" style={{ fontSize: 'clamp(32px, 6.5vw, 52px)', lineHeight: 1.15, margin: '16px 0 20px', letterSpacing: '-0.02em', fontWeight: 600 }}>
            The whole story, not just the sixty-six.
          </h1>

          <p style={{ fontSize: 'clamp(15px, 3.8vw, 18px)', lineHeight: 1.65, color: 'var(--ink-soft)', maxWidth: '640px', margin: '0 auto 32px' }}>
            Scripture, the deuterocanon, and the writings history left out of most Bibles — one reverent, unhurried place to study, guided by a thoughtful assistant.
          </p>

          <div className="hero-ctas-container" style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '44px' }}>
            <button
              className="btn btn-primary"
              onClick={onEnterApp}
              style={{ fontSize: '15px', padding: '13px 26px', borderRadius: '10px', boxShadow: '0 6px 20px rgba(36, 58, 43, 0.25)' }}
            >
              Launch Reader App <i className="ti ti-arrow-right" style={{ fontSize: '18px', marginLeft: '4px' }}></i>
            </button>

            <a
              className="btn btn-ghost"
              href="#hero-preview"
              style={{ fontSize: '15px', padding: '13px 24px', borderRadius: '10px', background: 'var(--bg-card)', color: 'var(--ink)', border: '1px solid var(--line-strong)' }}
            >
              Explore Live Demo
            </a>
          </div>

          {/* Tradition Badges Strip */}
          <div
            className="badges-strip-mobile"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 16px',
              borderRadius: '999px',
              background: 'var(--bg-card)',
              border: '1px solid var(--line-strong)',
              fontSize: '12.5px',
              color: 'var(--ink-soft)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.02)'
            }}
          >
            <span style={{ fontWeight: 600, color: 'var(--ink)' }}>Canons:</span>
            <span className="badge-canonical">Protestant (66)</span>
            <span className="badge-deuterocanon">Catholic (73)</span>
            <span className="badge-deuterocanon">Orthodox (76+)</span>
            <span className="badge-deuterocanon">Ethiopian (81)</span>
          </div>
        </div>
      </section>

      {/* Interactive Hero Canon Switcher Showcase */}
      <section id="hero-preview" style={{ padding: '20px 16px 64px', maxWidth: '1120px', margin: '0 auto' }}>
        <div className="glass-panel" style={{ padding: '28px 20px' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div className="eyebrow" style={{ marginBottom: '6px' }}>Interactive Tradition Switcher</div>
            <h2 style={{ fontSize: 'clamp(22px, 4.5vw, 28px)', color: 'var(--ink)' }}>See How Canon Expands By Tradition</h2>
            <p style={{ color: 'var(--ink-soft)', fontSize: '14.5px', marginTop: '6px' }}>
              Select a historic tradition to view its canonical books and included Deuterocanon writings.
            </p>
          </div>

          {/* Switcher Tabs */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '28px' }}>
            {Object.keys(CANON_DATA).map((key) => (
              <button
                key={key}
                className={`canon-tab-btn ${selectedCanon === key ? 'active' : ''}`}
                onClick={() => setSelectedCanon(key)}
              >
                {CANON_DATA[key].name} ({CANON_DATA[key].count})
              </button>
            ))}
          </div>

          {/* Canon Detail Box */}
          <div style={{ background: 'var(--parchment-deep)', borderRadius: '12px', padding: '20px', border: '1px solid var(--line)' }}>
            <div className="canon-detail-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '19px', color: 'var(--ink)', fontWeight: 600 }}>
                  {CANON_DATA[selectedCanon].name}
                </h3>
                <p style={{ fontSize: '13.5px', color: 'var(--ink-soft)', marginTop: '4px', lineHeight: 1.5 }}>
                  {CANON_DATA[selectedCanon].description}
                </p>
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '28px', color: 'var(--gold)', fontWeight: 600 }}>
                {CANON_DATA[selectedCanon].count}
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--line-strong)', paddingTop: '14px', marginTop: '14px' }}>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ink-faint)', marginBottom: '8px', fontWeight: 600 }}>
                Highlighted Books in this Canon:
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {CANON_DATA[selectedCanon].sampleBooks.map((b, idx) => (
                  <span
                    key={idx}
                    className={b.type === 'deuterocanon' ? 'badge-deuterocanon' : 'badge-canonical'}
                    style={{ padding: '5px 12px', fontSize: '12.5px', borderRadius: '8px' }}
                  >
                    📖 {b.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive App UI Mockup */}
      <section style={{ padding: '40px 16px 72px', background: 'var(--parchment-deep)', color: 'var(--ink)', position: 'relative' }}>
        <div style={{ maxWidth: '1120px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <div className="eyebrow" style={{ color: 'var(--gold)', marginBottom: '8px' }}>Product Experience</div>
            <h2 style={{ fontSize: 'clamp(24px, 4.8vw, 34px)', color: 'var(--ink)' }}>Built For Reverent, Deep Scripture Study</h2>
            <p style={{ color: 'var(--ink-soft)', fontSize: '15px', maxWidth: '600px', margin: '8px auto 0' }}>
              Clean scripture pane paired with an intelligent historical AI assistant.
            </p>
          </div>

          {/* Mockup Frame */}
          <div className="glass-panel" style={{ overflow: 'hidden', padding: 0 }}>
            
            {/* Top Bar Mockup */}
            <div style={{ padding: '12px 16px', background: 'var(--parchment-deep)', borderBottom: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#FF5F56' }}></span>
                <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#FFBD2E' }}></span>
                <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#27C93F' }}></span>
                <span style={{ fontSize: '12.5px', color: 'var(--ink-soft)', marginLeft: '6px', fontWeight: 500 }}>
                  Tobit 1:1-3 (Catholic Canon)
                </span>
              </div>
              <div style={{ fontSize: '11px', background: 'var(--parchment)', padding: '3px 8px', borderRadius: '6px', color: 'var(--ink)' }}>
                ESV / NRSV Catholic
              </div>
            </div>

            {/* Responsive Split Screen Mockup */}
            <div className="mockup-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 340px', minHeight: '360px' }}>
              
              {/* Left Pane: Scripture Text */}
              <div style={{ padding: '24px 20px', background: 'var(--bg-card)', color: 'var(--ink)' }}>
                <div style={{ fontSize: '11px', color: 'var(--gold)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px', fontWeight: 600 }}>
                  Tobit 1:1-3 • Deuterocanon
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '18px', lineHeight: 1.8, color: 'var(--ink)' }}>
                  <span style={{ color: 'var(--gold)', fontWeight: 600, fontSize: '13px', marginRight: '4px' }}>1</span>
                  The book of the words of Tobit son of Tobiel, son of Ananiel, son of Aduel, son of Gabael, of the descendants of Asiel, of the tribe of Naphtali...
                  <br /><br />
                  <span style={{ color: 'var(--gold)', fontWeight: 600, fontSize: '13px', marginRight: '4px' }}>2</span>
                  who in the days of King Shalmaneser of the Assyrians was taken into captivity from Thisbe, which is to the south of Kedesh Naphtali...
                </div>

                <div style={{ marginTop: '20px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{ background: 'var(--parchment-deep)', border: '1px solid var(--line-strong)', padding: '5px 10px', borderRadius: '6px', fontSize: '11.5px', color: 'var(--ink)' }}>
                    🏷️ Historical Context
                  </span>
                  <span style={{ background: 'var(--parchment-deep)', border: '1px solid var(--line-strong)', padding: '5px 10px', borderRadius: '6px', fontSize: '11.5px', color: 'var(--ink)' }}>
                    🔗 Cross References (3)
                  </span>
                </div>
              </div>

              {/* Right Pane: AI Assistant Mockup */}
              <div className="mockup-assistant-pane" style={{ padding: '20px', background: 'var(--parchment-deep)', borderLeft: '1px solid var(--line)', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--gold)', fontSize: '13px', fontWeight: 600, marginBottom: '14px' }}>
                  <i className="ti ti-sparkles"></i> Berea AI Assistant
                </div>

                {/* Interactive Mockup Tabs */}
                <div style={{ display: 'flex', gap: '6px', marginBottom: '14px', borderBottom: '1px solid var(--line)', paddingBottom: '8px' }}>
                  <button
                    onClick={() => setMockupTab('overview')}
                    style={{ background: mockupTab === 'overview' ? 'var(--moss)' : 'transparent', border: 'none', color: mockupTab === 'overview' ? '#fff' : 'var(--ink)', fontSize: '12px', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Overview
                  </button>
                  <button
                    onClick={() => setMockupTab('traditions')}
                    style={{ background: mockupTab === 'traditions' ? 'var(--moss)' : 'transparent', border: 'none', color: mockupTab === 'traditions' ? '#fff' : 'var(--ink)', fontSize: '12px', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Tradition Views
                  </button>
                </div>

                <div style={{ background: 'var(--bg-card)', borderRadius: '10px', padding: '12px', fontSize: '12.5px', lineHeight: 1.6, color: 'var(--ink)', flex: 1, border: '1px solid var(--line)' }}>
                  {mockupTab === 'overview' ? (
                    <p>
                      <strong>Tobit Historical Summary:</strong> Written in Aramaic/Hebrew around 200 BC, Tobit recounts a righteous Israelite living in Assyrian exile. It emphasizes piety and angelic protection.
                    </p>
                  ) : (
                    <p>
                      <strong>Tradition Perspectives:</strong> Catholic & Orthodox churches read Tobit as inspired scripture. Protestant traditions classify Tobit as Apocrypha—valuable for history but not canonical.
                    </p>
                  )}
                </div>

                <div style={{ marginTop: '14px', background: 'var(--parchment)', border: '1px solid var(--line)', borderRadius: '8px', padding: '8px 12px', fontSize: '12px', color: 'var(--ink-soft)' }}>
                  💬 Ask about Tobit's timeline or cross-references...
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid Section */}
      <section id="features" style={{ padding: '80px 16px', maxWidth: '1120px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 48px' }}>
          <div className="eyebrow" style={{ marginBottom: '8px' }}>Purposeful Capabilities</div>
          <h2 style={{ fontSize: 'clamp(24px, 4.5vw, 34px)', color: 'var(--ink)' }}>Everything a Study Bible Has. Then Further.</h2>
          <p style={{ color: 'var(--ink-soft)', fontSize: '15px', marginTop: '8px' }}>
            Every tool is designed to deepen comprehension and reverence—never to gamify scripture reading.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          
          <div className="glass-panel" style={{ padding: '24px 20px' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '13px', color: 'var(--gold)', fontWeight: 600, marginBottom: '10px' }}>I.</div>
            <h3 style={{ fontSize: '19px', color: 'var(--ink)', marginBottom: '8px' }}>Scripture, Done Properly</h3>
            <p style={{ fontSize: '14px', color: 'var(--ink-soft)', lineHeight: 1.6 }}>
              Multiple parallel translations (ESV, NRSV, KJV, Septuagint), instant global search, and clean typography built for unhurried reading.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '24px 20px' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '13px', color: 'var(--gold)', fontWeight: 600, marginBottom: '10px' }}>II.</div>
            <h3 style={{ fontSize: '19px', color: 'var(--ink)', marginBottom: '8px' }}>Beyond the Standard Canon</h3>
            <p style={{ fontSize: '14px', color: 'var(--ink-soft)', lineHeight: 1.6 }}>
              Deuterocanon, 1 Enoch, Jubilees, Wisdom, Sirach, and early church fathers—clearly labeled by origin, never presented as secret knowledge.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '24px 20px' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '13px', color: 'var(--gold)', fontWeight: 600, marginBottom: '10px' }}>III.</div>
            <h3 style={{ fontSize: '19px', color: 'var(--ink)', marginBottom: '8px' }}>A Study Assistant, Not a Chatbot</h3>
            <p style={{ fontSize: '14px', color: 'var(--ink-soft)', lineHeight: 1.6 }}>
              Ask any passage-specific question and receive balanced, historical context comparing Protestant, Catholic, and Orthodox perspectives honestly.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '24px 20px' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '13px', color: 'var(--gold)', fontWeight: 600, marginBottom: '10px' }}>IV.</div>
            <h3 style={{ fontSize: '19px', color: 'var(--ink)', marginBottom: '8px' }}>Visual Lineages & Diagrams</h3>
            <p style={{ fontSize: '14px', color: 'var(--ink-soft)', lineHeight: 1.6 }}>
              Genealogies, historical timelines, and cross-reference maps rendered as interactive visuals right alongside the verse text.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '24px 20px' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '13px', color: 'var(--gold)', fontWeight: 600, marginBottom: '10px' }}>V.</div>
            <h3 style={{ fontSize: '19px', color: 'var(--ink)', marginBottom: '8px' }}>Verse-Anchored Study Notes</h3>
            <p style={{ fontSize: '14px', color: 'var(--ink-soft)', lineHeight: 1.6 }}>
              Highlights, journal entries, and custom tags anchor to exact canonical references, remaining fully searchable across all your study sessions.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '24px 20px' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '13px', color: 'var(--gold)', fontWeight: 600, marginBottom: '10px' }}>VI.</div>
            <h3 style={{ fontSize: '19px', color: 'var(--ink)', marginBottom: '8px' }}>Audio & Offline Engine</h3>
            <p style={{ fontSize: '14px', color: 'var(--ink-soft)', lineHeight: 1.6 }}>
              Listen to scripture read aloud on the go. Entire text collections and study notes stay available offline even when signal drops.
            </p>
          </div>

        </div>
      </section>

      {/* Interactive AI Assistant Demo Sandbox */}
      <section id="assistant-demo" style={{ padding: '64px 16px', background: 'var(--parchment-deep)', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
        <div style={{ maxWidth: '920px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div className="eyebrow" style={{ marginBottom: '6px' }}>Interactive AI Sandbox</div>
            <h2 style={{ fontSize: 'clamp(22px, 4.5vw, 30px)', color: 'var(--ink)' }}>Test How Berea AI Answers Complex Questions</h2>
            <p style={{ color: 'var(--ink-soft)', fontSize: '14.5px', marginTop: '6px' }}>
              Click any sample query below to preview how Berea synthesizes historical and canonical insights.
            </p>
          </div>

          {/* Sample Chips */}
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '24px' }}>
            {SAMPLE_PROMPTS.map((prompt) => (
              <button
                key={prompt.id}
                className={`prompt-chip ${activePromptId === prompt.id ? 'active' : ''}`}
                onClick={() => setActivePromptId(prompt.id)}
              >
                💡 {prompt.title.substring(0, 32)}...
              </button>
            ))}
          </div>

          {/* Response Box */}
          <div className="glass-panel" style={{ padding: '24px 20px', background: 'var(--bg-card)' }}>
            <div className="prompt-response-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid var(--line)', paddingBottom: '10px' }}>
              <div style={{ fontWeight: 600, color: 'var(--ink)', fontSize: '15px' }}>
                Question: "{activePrompt.title}"
              </div>
              <span style={{ fontSize: '11.5px', background: 'var(--parchment-deep)', padding: '4px 10px', borderRadius: '6px', color: 'var(--gold)', fontWeight: 600 }}>
                {activePrompt.passage}
              </span>
            </div>

            <p style={{ fontSize: '14.5px', lineHeight: 1.65, color: 'var(--ink)' }}>
              {activePrompt.answer}
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" style={{ padding: '80px 16px', maxWidth: '840px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div className="eyebrow" style={{ marginBottom: '6px' }}>Questions & Answers</div>
          <h2 style={{ fontSize: 'clamp(24px, 4.5vw, 32px)', color: 'var(--ink)' }}>Frequently Asked Questions</h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {FAQS.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="faq-card"
                onClick={() => setOpenFaqIndex(isOpen ? -1 : idx)}
                style={{ padding: '18px 20px' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 600, fontSize: '16px', color: 'var(--ink)' }}>
                  <span style={{ pr: '12px' }}>{faq.question}</span>
                  <span style={{ fontSize: '18px', color: 'var(--gold)', transition: 'transform 0.2s ease', transform: isOpen ? 'rotate(180deg)' : 'rotate(0)' }}>
                    ↓
                  </span>
                </div>

                {isOpen && (
                  <p style={{ marginTop: '12px', fontSize: '14px', lineHeight: 1.6, color: 'var(--ink-soft)', borderTop: '1px solid var(--line)', paddingTop: '10px' }}>
                    {faq.answer}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Final CTA Banner */}
      <section style={{ padding: '72px 16px', background: 'var(--parchment-deep)', color: 'var(--ink)', textAlign: 'center', borderTop: '1px solid var(--line)' }}>
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(26px, 5vw, 36px)', color: 'var(--ink)', marginBottom: '14px' }}>
            Start Where You Already Are.
          </h2>
          <p style={{ color: 'var(--ink-soft)', fontSize: '15.5px', lineHeight: 1.6, marginBottom: '28px' }}>
            Bring your tradition, your translation, and your study habits. Berea meets you there, then opens the door further.
          </p>

          <button
            className="btn btn-primary"
            onClick={onNavigateSignup}
            style={{ background: 'var(--gold)', color: '#2B2420', fontWeight: 600, fontSize: '15px', padding: '13px 28px', borderRadius: '10px', border: 'none', boxShadow: '0 6px 24px rgba(184, 134, 59, 0.3)', width: '100%', maxWidth: '320px' }}
          >
            Create Your Account Free
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--line)', padding: '28px 16px', textAlign: 'center', fontSize: '13px', color: 'var(--ink-faint)', background: 'var(--parchment)' }}>
        © 2026 Berea. Scripture text licensed per source — see attribution.
      </footer>
    </div>
  );
}
