import React, { useState } from 'react';

const PLANS = [
  {
    id: 'chronological',
    title: '365-Day Whole-Bible & Deuterocanon Journey',
    category: 'Comprehensive',
    duration: '365 Days',
    progress: 34,
    todayReading: 'Tobit 1–3 & Proverbs 8:1-21',
    description: 'Read canonical Scripture, Deuterocanon, and historic Jewish-Christian writings in chronological order.'
  },
  {
    id: 'deuterocanon',
    title: '21-Day Deuterocanon & Wisdom Exploration',
    category: 'Topical',
    duration: '21 Days',
    progress: 65,
    todayReading: 'Wisdom of Solomon 7–9',
    description: 'Deep dive into Wisdom, Sirach, Tobit, Judith, and Maccabees with historical tradition notes.'
  },
  {
    id: 'fathers',
    title: '14-Day Apostolic Fathers & Early Church History',
    category: 'Historical',
    duration: '14 Days',
    progress: 10,
    todayReading: 'Didache Chapters 1–6 (The Two Ways)',
    description: 'Study early 1st–2nd century Christian documents written by Clement of Rome, Ignatius, and Polycarp.'
  }
];

export default function PlansView() {
  const [plans, setPlans] = useState(PLANS);
  const [activePlanId, setActivePlanId] = useState('chronological');
  const [completedToday, setCompletedToday] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiGoal, setAiGoal] = useState('');
  const [aiDays, setAiDays] = useState(30);

  const activePlan = plans.find(p => p.id === activePlanId) || plans[0];

  const handleGeneratePlan = (e) => {
    e.preventDefault();
    if (!aiGoal.trim()) return;

    const newPlan = {
      id: `ai-${Date.now()}`,
      title: `${aiDays}-Day AI Plan: ${aiGoal}`,
      category: 'AI Personalized',
      duration: `${aiDays} Days`,
      progress: 0,
      todayReading: `Day 1: ${aiGoal} Introduction & Readings`,
      description: `Custom AI-generated reading schedule tailored for ${aiDays} days on "${aiGoal}".`
    };

    setPlans([newPlan, ...plans]);
    setActivePlanId(newPlan.id);
    setShowAiModal(false);
    setAiGoal('');
  };

  return (
    <main className="reader" style={{ background: 'var(--parchment)', color: 'var(--ink)' }}>
      <div className="reader-inner" style={{ maxWidth: '780px', margin: '0 auto' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h2 style={{ fontSize: '26px', color: 'var(--ink)', fontWeight: 600 }}>Guided Reading Plans</h2>
            <p style={{ fontSize: '14px', color: 'var(--ink-soft)', marginTop: '4px' }}>
              Structured journeys through Scripture, Deuterocanon, and Church history.
            </p>
          </div>

          <button
            className="btn btn-primary"
            onClick={() => setShowAiModal(!showAiModal)}
            style={{ fontSize: '13px', padding: '8px 16px' }}
          >
            ✨ Generate AI Plan
          </button>
        </div>

        {/* AI Plan Generator Card */}
        {showAiModal && (
          <form onSubmit={handleGeneratePlan} style={{ background: 'var(--parchment-deep)', border: '2px solid var(--gold)', borderRadius: '14px', padding: '20px', marginBottom: '28px' }}>
            <h3 style={{ fontSize: '18px', color: 'var(--ink)', fontWeight: 600, marginBottom: '8px' }}>
              ✨ Generate AI Personalized Reading Plan
            </h3>
            <p style={{ fontSize: '13.5px', color: 'var(--ink-soft)', marginBottom: '16px' }}>
              Tell Berea AI what topic, theme, or book series you want to study.
            </p>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: 'var(--ink)', marginBottom: '4px' }}>
                Study Goal / Topic:
              </label>
              <input
                type="text"
                required
                placeholder="e.g., 'Wisdom in Sirach & James' or 'Prophecies in Isaiah & Revelation'"
                value={aiGoal}
                onChange={(e) => setAiGoal(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--line-strong)', background: 'var(--bg-card)', color: 'var(--ink)', fontSize: '13.5px', outline: 'none' }}
              />
            </div>

            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: 'var(--ink)', marginBottom: '4px' }}>
                Plan Duration (Days):
              </label>
              <select
                value={aiDays}
                onChange={(e) => setAiDays(Number(e.target.value))}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--line-strong)', background: 'var(--bg-card)', color: 'var(--ink)', fontSize: '13.5px', outline: 'none' }}
              >
                <option value={7}>7 Days (Short Intensive)</option>
                <option value={14}>14 Days (Two-Week Study)</option>
                <option value={30}>30 Days (Monthly Journey)</option>
                <option value={40}>40 Days (Lenten / Fasting Journey)</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button type="button" className="btn btn-ghost" onClick={() => setShowAiModal(false)} style={{ fontSize: '13px' }}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" style={{ fontSize: '13px', padding: '8px 18px' }}>
                Build AI Schedule
              </button>
            </div>
          </form>
        )}

        {/* Active Today Reading Card */}
        <div className="card" style={{ background: 'var(--parchment-deep)', border: '2px solid var(--gold)', borderRadius: '16px', padding: '24px', marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--gold)', fontWeight: 700 }}>
              TODAY'S READING ASSIGNMENT
            </span>
            <span style={{ fontSize: '12px', background: 'var(--moss)', color: '#fff', padding: '3px 10px', borderRadius: '6px', fontWeight: 600 }}>
              {activePlan.category}
            </span>
          </div>

          <h3 style={{ fontSize: '20px', color: 'var(--ink)', fontWeight: 600, marginBottom: '6px' }}>
            {activePlan.title}
          </h3>

          <div style={{ fontSize: '16px', color: 'var(--moss)', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            📖 Passage for Today: <span style={{ color: 'var(--ink)' }}>{activePlan.todayReading}</span>
          </div>

          {/* Progress Bar */}
          <div style={{ marginBottom: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', color: 'var(--ink-soft)', marginBottom: '6px' }}>
              <span>Plan Progress</span>
              <span>{activePlan.progress}% Complete</span>
            </div>
            <div style={{ width: '100%', height: '8px', background: 'var(--line-strong)', borderRadius: '999px', overflow: 'hidden' }}>
              <div style={{ width: `${activePlan.progress}%`, height: '100%', background: 'var(--gold)', borderRadius: '999px' }}></div>
            </div>
          </div>

          <button
            onClick={() => setCompletedToday(!completedToday)}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: 'none',
              background: completedToday ? 'var(--moss)' : 'var(--gold)',
              color: completedToday ? '#fff' : '#2B2420',
              fontWeight: 600,
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <i className={completedToday ? "ti ti-circle-check" : "ti ti-check"}></i>
            {completedToday ? "Completed Today's Reading! 🎉" : "Mark Today's Reading Complete"}
          </button>
        </div>

        {/* All Plans Grid */}
        <h3 style={{ fontSize: '20px', color: 'var(--ink)', marginBottom: '16px', fontWeight: 600 }}>
          Available Reading Plans
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {plans.map((p) => (
            <div
              key={p.id}
              className="card"
              onClick={() => setActivePlanId(p.id)}
              style={{
                background: 'var(--bg-card)',
                border: activePlanId === p.id ? '2px solid var(--moss)' : '1px solid var(--line-strong)',
                borderRadius: '12px',
                padding: '20px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <h4 style={{ fontSize: '17px', color: 'var(--ink)', fontWeight: 600 }}>{p.title}</h4>
                <span style={{ fontSize: '12px', color: 'var(--gold)', fontWeight: 600 }}>{p.duration}</span>
              </div>
              <p style={{ fontSize: '14px', color: 'var(--ink-soft)', lineHeight: 1.6 }}>
                {p.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}
