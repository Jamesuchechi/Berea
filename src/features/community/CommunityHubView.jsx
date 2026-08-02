import React, { useState } from 'react';

const INITIAL_PRAYERS = [
  {
    id: 1,
    author: 'Brother Matthew',
    category: 'Intercession',
    time: '2 hours ago',
    request: 'Praying for wisdom and peace during our family scripture reading sessions this month.',
    prayedCount: 18,
    hasPrayed: false
  },
  {
    id: 2,
    author: 'Sister Hannah',
    category: 'Praise & Thanksgiving',
    time: '5 hours ago',
    request: 'Praising God for deeper understanding gained while studying the Book of Wisdom and Proverbs!',
    prayedCount: 34,
    hasPrayed: true
  },
  {
    id: 3,
    author: 'Deacon Thomas',
    category: 'Healing',
    time: '1 day ago',
    request: 'Please pray for full recovery and strength for our local community elders.',
    prayedCount: 42,
    hasPrayed: false
  }
];

const GROUP_PLANS = [
  {
    id: 'group-1',
    name: 'Berean Daily Scripture Guild',
    membersCount: 142,
    currentReading: 'Tobit 1–3 & John 3',
    description: 'A global group committed to examining Scriptures daily across Canonical and Deuterocanonical texts.'
  },
  {
    id: 'group-2',
    name: 'Apostolic Fathers Study Circle',
    membersCount: 89,
    currentReading: 'Didache Chapters 1–6',
    description: 'Weekly fellowship reading early Christian writings from Clement, Ignatius, and Polycarp.'
  }
];

const DISCUSSIONS = [
  {
    id: 'disc-1',
    passage: 'John 3:16',
    author: 'Scholar Luke',
    text: 'Comparing the Greek term "monogenes" in John 3:16 with its usage in Septuagint Tobit 3:15.',
    repliesCount: 7,
    isModerated: true
  },
  {
    id: 'disc-2',
    passage: 'Tobit 1:3',
    author: 'Sister Mary',
    text: 'How Almsgiving in Tobit reflects Old Testament charity practices during the Exile.',
    repliesCount: 4,
    isModerated: true
  }
];

export default function CommunityHubView() {
  const [activeTab, setActiveTab] = useState('prayers');
  const [prayers, setPrayers] = useState(INITIAL_PRAYERS);
  const [newPrayerText, setNewPrayerText] = useState('');
  const [newPrayerCategory, setNewPrayerCategory] = useState('Intercession');
  const [newCommentText, setNewCommentText] = useState('');
  const [discussionsList, setDiscussionsList] = useState(DISCUSSIONS);

  const togglePrayed = (id) => {
    setPrayers(prev => prev.map(p => {
      if (p.id === id) {
        return {
          ...p,
          hasPrayed: !p.hasPrayed,
          prayedCount: p.hasPrayed ? p.prayedCount - 1 : p.prayedCount + 1
        };
      }
      return p;
    }));
  };

  const handleAddPrayer = (e) => {
    e.preventDefault();
    if (!newPrayerText.trim()) return;

    const newP = {
      id: Date.now(),
      author: 'You',
      category: newPrayerCategory,
      time: 'Just now',
      request: newPrayerText,
      prayedCount: 1,
      hasPrayed: true
    };

    setPrayers([newP, ...prayers]);
    setNewPrayerText('');
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const newDisc = {
      id: `disc-${Date.now()}`,
      passage: 'General Study',
      author: 'You',
      text: newCommentText,
      repliesCount: 0,
      isModerated: true
    };

    setDiscussionsList([newDisc, ...discussionsList]);
    setNewCommentText('');
  };

  return (
    <main className="reader" style={{ background: 'var(--parchment)', color: 'var(--ink)' }}>
      <div className="reader-inner" style={{ maxWidth: '840px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div className="eyebrow" style={{ color: 'var(--gold)', marginBottom: '6px' }}>
            Phase 6 • Reverent Fellowship
          </div>
          <h2 style={{ fontSize: '28px', color: 'var(--ink)', fontWeight: 600 }}>
            Community & Prayer Wall
          </h2>
          <p style={{ fontSize: '14.5px', color: 'var(--ink-soft)', marginTop: '4px' }}>
            Pray for one another, join group reading circles, and share reverent study discussions.
          </p>

          {/* Tab Switcher */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap', marginTop: '20px' }}>
            <button
              onClick={() => setActiveTab('prayers')}
              style={{
                padding: '8px 18px',
                borderRadius: '999px',
                fontSize: '13px',
                fontWeight: 600,
                border: '1px solid var(--line-strong)',
                background: activeTab === 'prayers' ? 'var(--moss)' : 'var(--bg-card)',
                color: activeTab === 'prayers' ? '#fff' : 'var(--ink)',
                cursor: 'pointer'
              }}
            >
              🙏 Community Prayer Wall
            </button>

            <button
              onClick={() => setActiveTab('groups')}
              style={{
                padding: '8px 18px',
                borderRadius: '999px',
                fontSize: '13px',
                fontWeight: 600,
                border: '1px solid var(--line-strong)',
                background: activeTab === 'groups' ? 'var(--moss)' : 'var(--bg-card)',
                color: activeTab === 'groups' ? '#fff' : 'var(--ink)',
                cursor: 'pointer'
              }}
            >
              👥 Group Reading Plans
            </button>

            <button
              onClick={() => setActiveTab('discussions')}
              style={{
                padding: '8px 18px',
                borderRadius: '999px',
                fontSize: '13px',
                fontWeight: 600,
                border: '1px solid var(--line-strong)',
                background: activeTab === 'discussions' ? 'var(--moss)' : 'var(--bg-card)',
                color: activeTab === 'discussions' ? '#fff' : 'var(--ink)',
                cursor: 'pointer'
              }}
            >
              💬 Moderated Discussions
            </button>
          </div>
        </div>

        {/* Tab 1: Prayer Wall */}
        {activeTab === 'prayers' && (
          <div>
            {/* New Prayer Post Form */}
            <form onSubmit={handleAddPrayer} style={{ background: 'var(--parchment-deep)', border: '1px solid var(--line-strong)', borderRadius: '14px', padding: '20px', marginBottom: '28px' }}>
              <h3 style={{ fontSize: '18px', color: 'var(--ink)', fontWeight: 600, marginBottom: '12px' }}>
                ✍️ Post a Prayer Request
              </h3>

              <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                <select
                  value={newPrayerCategory}
                  onChange={(e) => setNewPrayerCategory(e.target.value)}
                  style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--line-strong)', background: 'var(--bg-card)', color: 'var(--gold)', fontWeight: 600, fontSize: '13px' }}
                >
                  <option value="Intercession">Intercession</option>
                  <option value="Praise & Thanksgiving">Praise & Thanksgiving</option>
                  <option value="Healing">Healing</option>
                  <option value="Wisdom">Wisdom</option>
                </select>
              </div>

              <textarea
                rows="3"
                placeholder="Share your prayer request with fellow Berean study members..."
                value={newPrayerText}
                onChange={(e) => setNewPrayerText(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--line-strong)', background: 'var(--bg-card)', color: 'var(--ink)', fontSize: '13.5px', outline: 'none', resize: 'vertical' }}
              ></textarea>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button type="submit" className="btn btn-primary" style={{ padding: '8px 20px', fontSize: '13.5px' }}>
                  Post to Prayer Wall
                </button>
              </div>
            </form>

            {/* Prayers List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {prayers.map((p) => (
                <div key={p.id} className="card" style={{ background: 'var(--bg-card)', border: '1px solid var(--line-strong)', borderRadius: '14px', padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <strong style={{ fontSize: '15px', color: 'var(--ink)' }}>{p.author}</strong>
                      <span style={{ fontSize: '11px', background: 'var(--parchment-deep)', color: 'var(--gold)', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>
                        {p.category}
                      </span>
                    </div>
                    <span style={{ fontSize: '12px', color: 'var(--ink-faint)' }}>{p.time}</span>
                  </div>

                  <p style={{ fontSize: '14.5px', lineHeight: 1.65, color: 'var(--ink)', marginBottom: '14px' }}>
                    "{p.request}"
                  </p>

                  <button
                    onClick={() => togglePrayed(p.id)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      border: '1px solid var(--line-strong)',
                      background: p.hasPrayed ? 'var(--moss)' : 'var(--parchment-deep)',
                      color: p.hasPrayed ? '#fff' : 'var(--ink)',
                      fontWeight: 600,
                      fontSize: '13px',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    🙏 {p.hasPrayed ? 'Prayed for This' : 'I Prayed for This'} ({p.prayedCount})
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Group Reading Plans */}
        {activeTab === 'groups' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {GROUP_PLANS.map((g) => (
              <div key={g.id} className="card" style={{ background: 'var(--bg-card)', border: '1px solid var(--line-strong)', borderRadius: '16px', padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
                  <h3 style={{ fontSize: '20px', color: 'var(--ink)', fontWeight: 600 }}>{g.name}</h3>
                  <span style={{ fontSize: '12px', background: 'var(--parchment-deep)', color: 'var(--gold)', padding: '3px 10px', borderRadius: '6px', fontWeight: 600 }}>
                    👥 {g.membersCount} Members Active
                  </span>
                </div>

                <p style={{ fontSize: '14px', color: 'var(--ink-soft)', lineHeight: 1.6, marginBottom: '14px' }}>
                  {g.description}
                </p>

                <div style={{ fontSize: '13.5px', color: 'var(--moss-dark)', fontWeight: 600, marginBottom: '16px', background: 'var(--parchment-deep)', padding: '10px 14px', borderRadius: '8px' }}>
                  📖 Current Group Reading: <span style={{ color: 'var(--ink)' }}>{g.currentReading}</span>
                </div>

                <button className="btn btn-primary" onClick={() => alert(`Joined ${g.name}!`)} style={{ padding: '8px 20px', fontSize: '13.5px' }}>
                  Join Group Reading Plan
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Moderated Discussions */}
        {activeTab === 'discussions' && (
          <div>
            <form onSubmit={handleAddComment} style={{ background: 'var(--parchment-deep)', border: '1px solid var(--line-strong)', borderRadius: '14px', padding: '20px', marginBottom: '28px' }}>
              <h3 style={{ fontSize: '18px', color: 'var(--ink)', fontWeight: 600, marginBottom: '8px' }}>
                💬 Start Reverent Study Discussion
              </h3>
              <div style={{ fontSize: '12px', color: 'var(--gold)', fontWeight: 600, marginBottom: '12px' }}>
                🛡️ Automated Reverent Content Filter & Moderation Active
              </div>

              <textarea
                rows="3"
                placeholder="Write a verse study insight or historical comment..."
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--line-strong)', background: 'var(--bg-card)', color: 'var(--ink)', fontSize: '13.5px', outline: 'none', resize: 'vertical' }}
              ></textarea>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button type="submit" className="btn btn-primary" style={{ padding: '8px 20px', fontSize: '13.5px' }}>
                  Post Comment
                </button>
              </div>
            </form>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {discussionsList.map((d) => (
                <div key={d.id} className="card" style={{ background: 'var(--bg-card)', border: '1px solid var(--line-strong)', borderRadius: '14px', padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '12px', background: 'var(--parchment-deep)', color: 'var(--gold)', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
                        📖 {d.passage}
                      </span>
                      <strong style={{ fontSize: '14.5px', color: 'var(--ink)' }}>{d.author}</strong>
                    </div>

                    <span style={{ fontSize: '11px', color: 'var(--moss)', fontWeight: 600 }}>
                      ✓ Verified Moderated
                    </span>
                  </div>

                  <p style={{ fontSize: '14.5px', lineHeight: 1.65, color: 'var(--ink)', marginBottom: '12px' }}>
                    "{d.text}"
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12.5px', color: 'var(--ink-soft)' }}>
                    <span>💬 {d.repliesCount} Replies</span>
                    <button onClick={() => alert("Flagged for moderation review.")} style={{ background: 'none', border: 'none', color: 'var(--ink-faint)', cursor: 'pointer', fontSize: '12px' }}>
                      🚩 Report
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
