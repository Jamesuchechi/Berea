import React, { useState } from 'react';
import { buildAIContext, askAIContextualAssistant } from '../lib/ai';

export default function AssistantPanel({
  assistantOpen,
  translation = 'ESV',
  tradition = 'Protestant',
  currentBook = 'John',
  currentChapter = 3,
  currentVerse = 16
}) {
  const [messages, setMessages] = useState([
    {
      sender: 'assistant',
      text: `Grace and peace! I am Berea AI. I am examining ${currentBook} ${currentChapter}:${currentVerse} through your active ${tradition} tradition lens. How can I assist your study today?`
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [loading, setLoading] = useState(false);

  const executeTrigger = async (triggerType, userCustomText = null) => {
    if (loading) return;

    const userLabel =
      triggerType === 'explain_verse' ? `💡 Explain verse ${currentVerse}` :
      triggerType === 'cross_references' ? `🔗 Find cross references for ${currentBook} ${currentChapter}:${currentVerse}` :
      triggerType === 'expand_note' ? `✍️ Expand study note context` :
      userCustomText || inputVal;

    if (!userLabel) return;

    if (userCustomText || triggerType === 'chat') setInputVal('');

    setMessages(prev => [...prev, { sender: 'user', text: userLabel }]);
    setLoading(true);

    const contextPayload = buildAIContext({
      book: currentBook,
      chapter: currentChapter,
      verse: currentVerse,
      translation,
      tradition: tradition.toLowerCase(),
      trigger: triggerType,
      userInput: userCustomText || (triggerType === 'chat' ? userLabel : null)
    });

    const response = await askAIContextualAssistant(contextPayload);
    setMessages(prev => [
      ...prev,
      { sender: 'assistant', text: response.message || response.reply }
    ]);
    setLoading(false);
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputVal.trim() || loading) return;
    executeTrigger('chat', inputVal);
  };

  return (
    <aside className={`assistant ${assistantOpen ? 'open' : ''}`} style={{ display: 'flex', flexDirection: 'column', background: 'var(--parchment-deep)', borderLeft: '1px solid var(--line-strong)' }}>
      
      {/* Header with Guardrails Badge */}
      <div className="assistant-head" style={{ padding: '14px 16px', borderBottom: '1px solid var(--line)', background: 'var(--parchment)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--gold)', fontWeight: 600, fontSize: '14px' }}>
          <span><i className="ti ti-sparkles" style={{ marginRight: '6px' }}></i>Berea AI Assistant</span>
          <span style={{ fontSize: '10.5px', background: 'var(--moss)', color: '#fff', padding: '2px 8px', borderRadius: '4px' }}>
            Groq Llama-3.3
          </span>
        </div>
        <div style={{ fontSize: '11px', color: 'var(--ink-soft)' }}>
          🛡️ Multi-Tradition Guardrails Active ({tradition} Lens)
        </div>
      </div>

      {/* Quick Contextual Trigger Bar */}
      <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--line)', display: 'flex', gap: '6px', overflowX: 'auto', background: 'var(--bg-card)' }}>
        <button
          onClick={() => executeTrigger('explain_verse')}
          disabled={loading}
          style={{ fontSize: '11.5px', padding: '4px 8px', borderRadius: '6px', border: '1px solid var(--line-strong)', background: 'var(--parchment-deep)', color: 'var(--ink)', cursor: 'pointer', whiteSpace: 'nowrap' }}
        >
          💡 Explain V{currentVerse}
        </button>
        <button
          onClick={() => executeTrigger('cross_references')}
          disabled={loading}
          style={{ fontSize: '11.5px', padding: '4px 8px', borderRadius: '6px', border: '1px solid var(--line-strong)', background: 'var(--parchment-deep)', color: 'var(--ink)', cursor: 'pointer', whiteSpace: 'nowrap' }}
        >
          🔗 Cross Refs
        </button>
        <button
          onClick={() => executeTrigger('expand_note')}
          disabled={loading}
          style={{ fontSize: '11.5px', padding: '4px 8px', borderRadius: '6px', border: '1px solid var(--line-strong)', background: 'var(--parchment-deep)', color: 'var(--ink)', cursor: 'pointer', whiteSpace: 'nowrap' }}
        >
          ✍️ Expand Note
        </button>
      </div>

      {/* Messages List */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 14px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {messages.map((m, i) => (
          <div
            key={i}
            className="assistant-msg"
            style={{
              padding: '12px 14px',
              borderRadius: '10px',
              fontSize: '13.5px',
              lineHeight: 1.6,
              background: m.sender === 'user' ? 'var(--moss)' : 'var(--bg-card)',
              color: m.sender === 'user' ? '#fff' : 'var(--ink)',
              alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '90%',
              border: m.sender === 'user' ? 'none' : '1px solid var(--line-strong)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
              whiteSpace: 'pre-wrap'
            }}
          >
            {m.text}
          </div>
        ))}

        {loading && (
          <div className="assistant-msg" style={{ fontStyle: 'italic', opacity: 0.8, background: 'var(--bg-card)', color: 'var(--ink)', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--line)' }}>
            ⚡ Berea AI examining manuscript context & traditions...
          </div>
        )}
      </div>

      {/* Input Form */}
      <form className="assistant-input" onSubmit={handleSend} style={{ padding: '12px 14px', borderTop: '1px solid var(--line)', background: 'var(--parchment)' }}>
        <input
          type="text"
          placeholder={`Ask about ${currentBook} ${currentChapter}:${currentVerse} or history...`}
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--line-strong)', background: 'var(--bg-card)', color: 'var(--ink)', fontSize: '13.5px', outline: 'none' }}
        />
        <button type="submit" aria-label="Send" style={{ background: 'var(--gold)', color: '#2B2420', border: 'none', borderRadius: '8px', padding: '0 14px', cursor: 'pointer', fontWeight: 600 }}>
          <i className="ti ti-arrow-up"></i>
        </button>
      </form>
    </aside>
  );
}
