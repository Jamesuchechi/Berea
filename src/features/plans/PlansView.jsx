import { useState, useEffect } from 'react';
import { fetchReadingPlans, getUserPlanProgress, completePlanDay } from '../../services/planService';

export default function PlansView() {
  const [plans, setPlans] = useState([]);
  const [activePlanId, setActivePlanId] = useState('');
  const [planProgress, setPlanProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiGoal, setAiGoal] = useState('');
  const [aiDays, setAiDays] = useState(30);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const planData = await fetchReadingPlans();
      setPlans(planData);

      if (planData.length > 0) {
        const firstId = planData[0].id;
        setActivePlanId(firstId);
        const prog = await getUserPlanProgress(firstId);
        setPlanProgress(prog);
      }
    } catch (err) {
      setError('Failed to load reading plans. Using local fallback.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSelectPlan = async (planId) => {
    setActivePlanId(planId);
    const prog = await getUserPlanProgress(planId);
    setPlanProgress(prog);
  };

  const handleToggleCompleteDay = async () => {
    if (!activePlanId || !planProgress) return;

    const currentDay = planProgress.currentDay;
    const result = await completePlanDay(activePlanId, currentDay);

    if (result.progress) {
      setPlanProgress(result.progress);
    }
  };

  const activePlan = plans.find(p => p.id === activePlanId) || plans[0];
  const percentComplete = activePlan && planProgress
    ? Math.min(100, Math.round((planProgress.completedDays.length / activePlan.durationDays) * 100))
    : 0;

  const handleGeneratePlan = (e) => {
    e.preventDefault();
    if (!aiGoal.trim()) return;

    const newPlan = {
      id: `ai-${Date.now()}`,
      slug: `ai-${Date.now()}`,
      title: `${aiDays}-Day AI Plan: ${aiGoal}`,
      description: `Custom AI-generated reading schedule tailored for ${aiDays} days on "${aiGoal}".`,
      durationDays: aiDays,
      kind: 'ai_generated',
      isPublic: true,
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

        {/* Error Notification Banner */}
        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>⚠️ {error}</span>
            <button onClick={loadData} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '4px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>
              Retry
            </button>
          </div>
        )}

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

        {/* Loading Indicator */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--ink-soft)' }}>
            <i className="ti ti-loader-2 spin" style={{ fontSize: '28px', display: 'block', marginBottom: '12px' }} />
            <span>Loading reading plans & progress...</span>
          </div>
        )}

        {/* Active Plan Progress Card */}
        {!loading && activePlan && (
          <div className="card" style={{ background: 'var(--parchment-deep)', border: '2px solid var(--gold)', borderRadius: '16px', padding: '24px', marginBottom: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--gold)', fontWeight: 700 }}>
                ACTIVE READING ASSIGNMENT (DAY {planProgress?.currentDay || 1})
              </span>
              <span style={{ fontSize: '12px', background: 'var(--moss)', color: '#fff', padding: '3px 10px', borderRadius: '6px', fontWeight: 600 }}>
                {activePlan.kind}
              </span>
            </div>

            <h3 style={{ fontSize: '20px', color: 'var(--ink)', fontWeight: 600, marginBottom: '6px' }}>
              {activePlan.title}
            </h3>

            <div style={{ fontSize: '14px', color: 'var(--ink-soft)', marginBottom: '16px' }}>
              {activePlan.description}
            </div>

            {/* Progress Bar */}
            <div style={{ marginBottom: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', color: 'var(--ink-soft)', marginBottom: '6px' }}>
                <span>Plan Progress</span>
                <span>{percentComplete}% Complete ({planProgress?.completedDays?.length || 0} / {activePlan.durationDays} days)</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: 'var(--line-strong)', borderRadius: '999px', overflow: 'hidden' }}>
                <div style={{ width: `${percentComplete}%`, height: '100%', background: 'var(--gold)', borderRadius: '999px' }}></div>
              </div>
            </div>

            <button
              onClick={handleToggleCompleteDay}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: 'none',
                background: planProgress?.completedDays?.includes(planProgress?.currentDay) ? 'var(--moss)' : 'var(--gold)',
                color: '#fff',
                fontWeight: 600,
                fontSize: '14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <i className="ti ti-check" />
              {planProgress?.completedDays?.includes(planProgress?.currentDay)
                ? `Day ${planProgress.currentDay} Completed! 🎉`
                : `Complete Day ${planProgress?.currentDay || 1} Reading`}
            </button>
          </div>
        )}

        {/* All Available Plans List */}
        {!loading && (
          <>
            <h3 style={{ fontSize: '20px', color: 'var(--ink)', marginBottom: '16px', fontWeight: 600 }}>
              Available Reading Plans
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {plans.map((p) => (
                <div
                  key={p.id}
                  className="card"
                  onClick={() => handleSelectPlan(p.id)}
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
                    <span style={{ fontSize: '12px', color: 'var(--gold)', fontWeight: 600 }}>{p.durationDays} Days</span>
                  </div>
                  <p style={{ fontSize: '14px', color: 'var(--ink-soft)', lineHeight: 1.6 }}>
                    {p.description}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}

      </div>
    </main>
  );
}
