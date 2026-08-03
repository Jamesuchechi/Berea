import React, { useState, useEffect } from 'react';
import { buildAIContext, askAIContextualAssistant } from '../lib/ai';
import { createAIConversation, getAIMessages, appendAIMessage } from '../services/aiConversationService';

export default function AssistantPanel({
  assistantOpen,
  setAssistantOpen,
  translation = 'KJV',
  tradition = 'protestant',
  currentBook = 'John',
  currentChapter = 3,
  currentVerse = 16
}) {
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([
    {
      sender: 'assistant',
      text: `Grace and peace! I am Berea AI. I am examining ${currentBook} ${currentChapter}:${currentVerse} through your active ${tradition.charAt(0).toUpperCase() + tradition.slice(1)} tradition lens. How can I assist your study today?`
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile viewport
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 900px)');
    setIsMobile(mq.matches);
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Initialize conversation session
  useEffect(() => {
    let isMounted = true;
    async function initConv() {
      const { data } = await createAIConversation({ title: 'Study Session', book: currentBook, chapter: currentChapter });
      if (data?.id && isMounted) {
        setConversationId(data.id);
        const { data: existingMsgs } = await getAIMessages(data.id);
        if (existingMsgs && existingMsgs.length > 0) {
          setMessages(existingMsgs.map(m => ({ sender: m.sender, text: m.content })));
        }
      }
    }
    initConv();
    return () => { isMounted = false; };
  }, [currentBook, currentChapter]);

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

    if (conversationId) {
      await appendAIMessage({ conversationId, sender: 'user', content: userLabel });
    }

    const contextPayload = buildAIContext({
      book: currentBook,
      chapter: currentChapter,
      verse: currentVerse,
      translation,
      tradition: tradition.toLowerCase(),
      trigger: triggerType,
      userInput: userCustomText || (triggerType === 'chat' ? userLabel : null),
      conversationId,
    });

    const response = await askAIContextualAssistant(contextPayload);
    const replyText = response.message || response.reply;
    setMessages(prev => [
      ...prev,
      { sender: 'assistant', text: replyText }
    ]);
    if (conversationId) {
      await appendAIMessage({ conversationId, sender: 'assistant', content: replyText });
    }
    setLoading(false);
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputVal.trim() || loading) return;
    executeTrigger('chat', inputVal);
  };

  const handleClose = () => {
    if (setAssistantOpen) setAssistantOpen(false);
  };

  return (
    <aside className={`assistant ${assistantOpen ? 'open' : ''}`} style={{ display: 'flex', flexDirection: 'column', background: 'var(--parchment-deep)', borderLeft: '1px solid var(--line-strong)' }}>

      {/* Mobile drag handle — visible tap target at top */}
      {isMobile && (
        <div
          onClick={handleClose}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '10px 0 6px',
            cursor: 'pointer',
            flexShrink: 0
          }}
          aria-label="Close assistant"
          role="button"
        >
          <div style={{
            width: '40px', height: '4px',
            background: 'var(--line-strong)',
            borderRadius: '2px'
          }} />
        </div>
      )}

      {/* Header */}
      <div className="assistant-head" style={{
        padding: isMobile ? '8px 16px 12px' : '14px 16px',
        borderBottom: '1px solid var(--line)',
        background: 'var(--parchment)',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        flexShrink: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--gold)', fontWeight: 600, fontSize: '14px' }}>
          <span>
            <i className="ti ti-sparkles" style={{ marginRight: '6px' }} />
            Berea AI Assistant
          </span>

          {/* Close button — always visible on mobile, shown as X */}
          {isMobile && (
            <button
              onClick={handleClose}
              aria-label="Close AI assistant"
              style={{
                background: 'var(--parchment-deep)',
                border: '1px solid var(--line-strong)',
                borderRadius: '50%',
                width: '28px', height: '28px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--ink)',
                fontSize: '16px',
                lineHeight: 1,
                fontWeight: 300
              }}
            >
              ×
            </button>
          )}
        </div>

        {/* Guardrails line — Groq model name is intentionally omitted */}
        <div style={{ fontSize: '11px', color: 'var(--ink-soft)' }}>
          🛡️ {tradition.charAt(0).toUpperCase() + tradition.slice(1)} tradition lens active
        </div>
      </div>

      {/* Quick Contextual Trigger Bar */}
      <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--line)', display: 'flex', gap: '6px', overflowX: 'auto', background: 'var(--bg-card)', flexShrink: 0 }}>
        <button
          onClick={() => executeTrigger('explain_verse')}
          disabled={loading}
          style={{ fontSize: '11.5px', padding: '4px 8px', borderRadius: '6px', border: '1px solid var(--line-strong)', background: 'var(--parchment-deep)', color: 'var(--ink)', cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'inherit' }}
        >
          💡 Explain V{currentVerse}
        </button>
        <button
          onClick={() => executeTrigger('cross_references')}
          disabled={loading}
          style={{ fontSize: '11.5px', padding: '4px 8px', borderRadius: '6px', border: '1px solid var(--line-strong)', background: 'var(--parchment-deep)', color: 'var(--ink)', cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'inherit' }}
        >
          🔗 Cross Refs
        </button>
        <button
          onClick={() => executeTrigger('expand_note')}
          disabled={loading}
          style={{ fontSize: '11.5px', padding: '4px 8px', borderRadius: '6px', border: '1px solid var(--line-strong)', background: 'var(--parchment-deep)', color: 'var(--ink)', cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'inherit' }}
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
            ⚡ Examining manuscript context &amp; traditions...
          </div>
        )}
      </div>

      {/* Input Form */}
      <form className="assistant-input" onSubmit={handleSend} style={{ padding: '12px 14px', borderTop: '1px solid var(--line)', background: 'var(--parchment)', flexShrink: 0 }}>
        <input
          type="text"
          placeholder={`Ask about ${currentBook} ${currentChapter}:${currentVerse}...`}
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--line-strong)', background: 'var(--bg-card)', color: 'var(--ink)', fontSize: '13.5px', outline: 'none' }}
        />
        <button type="submit" aria-label="Send" style={{ background: 'var(--gold)', color: '#2B2420', border: 'none', borderRadius: '8px', padding: '0 14px', cursor: 'pointer', fontWeight: 600 }}>
          <i className="ti ti-arrow-up" />
        </button>
      </form>
    </aside>
  );
}
