import { supabase } from '../lib/supabase';
import { enqueueAction } from './offlineQueue';

/**
 * Service for managing persistent AI conversations and messages.
 */

/**
 * Fetch all AI conversations for the logged-in user
 */
export async function getAIConversations() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: getLocalConversations(), error: null };

    const { data, error } = await supabase
      .from('ai_conversation')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) throw error;
    saveLocalConversations(data);
    return { data, error: null };
  } catch (err) {
    console.warn('[AIConversationService] Fetch conversations error, returning local cache:', err.message);
    return { data: getLocalConversations(), error: null };
  }
}

/**
 * Fetch messages for a specific conversation
 */
export async function getAIMessages(conversationId) {
  if (!conversationId) return { data: [], error: null };

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: getLocalMessages(conversationId), error: null };

    const { data, error } = await supabase
      .from('ai_message')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    saveLocalMessages(conversationId, data);
    return { data, error: null };
  } catch (err) {
    console.warn('[AIConversationService] Fetch messages error, returning local cache:', err.message);
    return { data: getLocalMessages(conversationId), error: null };
  }
}

/**
 * Create a new AI conversation session
 */
export async function createAIConversation({ title = 'Scripture Study', book = 'John', chapter = 3 }) {
  const newId = crypto.randomUUID ? crypto.randomUUID() : `conv-${Date.now()}`;
  const now = new Date().toISOString();

  const conversationPayload = {
    id: newId,
    title: `${title} (${book} ${chapter})`,
    context_book: book,
    context_chapter: chapter,
    created_at: now,
    updated_at: now,
  };

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      addLocalConversation({ ...conversationPayload, user_id: 'local-user' });
      return { data: conversationPayload, error: null };
    }

    const { data, error } = await supabase
      .from('ai_conversation')
      .insert({ ...conversationPayload, user_id: user.id })
      .select()
      .single();

    if (error) {
      await enqueueAction('ai_conversation', { ...conversationPayload, user_id: user.id });
      addLocalConversation({ ...conversationPayload, user_id: user.id });
      return { data: conversationPayload, error: null };
    }

    addLocalConversation(data);
    return { data, error: null };
  } catch (err) {
    addLocalConversation({ ...conversationPayload, user_id: 'offline' });
    return { data: conversationPayload, error: null };
  }
}

/**
 * Append a message to an active conversation
 */
export async function appendAIMessage({ conversationId, sender, content, metadata = {} }) {
  if (!conversationId || !content) return { data: null, error: 'Missing parameters' };

  const messagePayload = {
    id: crypto.randomUUID ? crypto.randomUUID() : `msg-${Date.now()}`,
    conversation_id: conversationId,
    sender,
    content,
    metadata,
    created_at: new Date().toISOString(),
  };

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      addLocalMessage(conversationId, messagePayload);
      return { data: messagePayload, error: null };
    }

    const { data, error } = await supabase
      .from('ai_message')
      .insert(messagePayload)
      .select()
      .single();

    if (error) {
      await enqueueAction('ai_message', messagePayload);
      addLocalMessage(conversationId, messagePayload);
      return { data: messagePayload, error: null };
    }

    addLocalMessage(conversationId, data);
    return { data, error: null };
  } catch (err) {
    addLocalMessage(conversationId, messagePayload);
    return { data: messagePayload, error: null };
  }
}

// ─── LocalStorage Cache Helpers ───────────────────────────────────────────────

const LOCAL_CONV_KEY = 'berea_ai_conversations_v1';
const LOCAL_MSG_PREFIX = 'berea_ai_messages_';

function getLocalConversations() {
  try {
    const raw = localStorage.getItem(LOCAL_CONV_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalConversations(convs) {
  try {
    localStorage.setItem(LOCAL_CONV_KEY, JSON.stringify(convs));
  } catch (e) {
    console.warn('LocalStorage save error:', e);
  }
}

function addLocalConversation(conv) {
  const convs = getLocalConversations();
  const filtered = convs.filter(c => c.id !== conv.id);
  saveLocalConversations([conv, ...filtered]);
}

function getLocalMessages(convId) {
  try {
    const raw = localStorage.getItem(`${LOCAL_MSG_PREFIX}${convId}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalMessages(convId, msgs) {
  try {
    localStorage.setItem(`${LOCAL_MSG_PREFIX}${convId}`, JSON.stringify(msgs));
  } catch (e) {
    console.warn('LocalStorage msg save error:', e);
  }
}

function addLocalMessage(convId, msg) {
  const msgs = getLocalMessages(convId);
  saveLocalMessages(convId, [...msgs, msg]);
}
