import React, { useState } from 'react';
import { buildAIContext, askAIContextualAssistant } from '../lib/ai';

export default function AssistantPanel({
  assistantOpen,
  translation,
  tradition
}) {
  const [messages, setMessages] = useState([
    {
      sender: 'assistant',
      text: "John 3:16 sits inside Nicodemus's night conversation with Jesus — want the surrounding context, or how other traditions read verse 16?"
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!inputVal.trim() || loading) return;

    const userText = inputVal;
    setInputVal('');
    setMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setLoading(true);

    const contextPayload = buildAIContext({
      book: 'John',
      chapter: 3,
      verse: 16,
      translation,
      tradition: tradition.toLowerCase(),
      trigger: 'chat',
      userInput: userText
    });

    const response = await askAIContextualAssistant(contextPayload);
    setMessages((prev) => [
      ...prev,
      { sender: 'assistant', text: response.message || response.reply }
    ]);
    setLoading(false);
  };

  return (
    <aside class={`assistant ${assistantOpen ? 'open' : ''}`}>
      <div class="assistant-head">
        <i class="ti ti-sparkles"></i>Assistant
      </div>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {messages.map((m, i) => (
          <div
            key={i}
            class="assistant-msg"
            style={
              m.sender === 'user'
                ? { background: 'rgba(255,255,255,0.14)', marginLeft: '12px' }
                : {}
            }
          >
            {m.text}
          </div>
        ))}
        {loading && (
          <div class="assistant-msg" style={{ fontStyle: 'italic', opacity: 0.8 }}>
            Examining context...
          </div>
        )}
      </div>

      <form class="assistant-input" onSubmit={handleSend}>
        <input
          type="text"
          placeholder="Ask about this passage..."
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
        />
        <button type="submit" aria-label="Send">
          <i class="ti ti-arrow-up"></i>
        </button>
      </form>
    </aside>
  );
}
