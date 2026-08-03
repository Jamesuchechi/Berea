/**
 * IndexedDB Offline Queue Manager & Auto-Sync Engine
 *
 * Stores queued mutations locally when offline and pushes them to Supabase
 * upon network reconnection using a last-write-wins policy.
 */

const DB_NAME = 'berea_offline_db';
const DB_VERSION = 1;
const STORE_NAME = 'action_queue';

let dbPromise = null;
const statusListeners = new Set();

function openDB() {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      resolve(null);
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = (event) => resolve(event.target.result);
    request.onerror = (event) => {
      console.warn('[offlineQueue] IndexedDB open error:', event.target.error);
      resolve(null);
    };
  });

  return dbPromise;
}

/**
 * Enqueue an action for background synchronization when offline
 */
export async function enqueueAction(type, payload) {
  const db = await openDB();
  const action = {
    id: `queue_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    type,
    payload,
    timestamp: new Date().toISOString(),
  };

  if (db) {
    try {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).add(action);
      await new Promise((res) => (tx.oncomplete = res));
    } catch (err) {
      console.warn('[offlineQueue] Failed to enqueue action to IndexedDB:', err);
    }
  }

  notifyStatusListeners();
  return action;
}

/**
 * Get all queued offline actions
 */
export async function getQueuedActions() {
  const db = await openDB();
  if (!db) return [];

  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const request = tx.objectStore(STORE_NAME).getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => resolve([]);
    } catch {
      resolve([]);
    }
  });
}

/**
 * Remove an action from the queue after successful sync
 */
export async function dequeueAction(id) {
  const db = await openDB();
  if (!db) return;

  try {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).delete(id);
    await new Promise((res) => (tx.oncomplete = res));
  } catch (err) {
    console.warn('[offlineQueue] Error removing item from queue:', err);
  }

  notifyStatusListeners();
}

/**
 * Subscribe to queue status changes (used by Topbar indicator)
 */
export function subscribeQueueStatus(callback) {
  statusListeners.add(callback);
  notifyStatusListeners();

  return () => {
    statusListeners.delete(callback);
  };
}

async function notifyStatusListeners() {
  const actions = await getQueuedActions();
  const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
  const status = {
    isOnline,
    queuedCount: actions.length,
  };

  statusListeners.forEach((cb) => cb(status));
}

// ── Auto-Sync Listener ────────────────────────────────────────────────────────

let syncProcessorHandler = null;

export function registerSyncProcessor(processorFn) {
  syncProcessorHandler = processorFn;
}

export async function triggerQueueSync() {
  if (!navigator.onLine || !syncProcessorHandler) return;

  const actions = await getQueuedActions();
  if (actions.length === 0) return;

  console.log(`[offlineQueue] Reconnected — processing ${actions.length} queued action(s)...`);

  for (const action of actions) {
    try {
      const success = await syncProcessorHandler(action);
      if (success) {
        await dequeueAction(action.id);
      }
    } catch (err) {
      console.warn(`[offlineQueue] Sync failed for action ${action.id}:`, err);
    }
  }

  notifyStatusListeners();
}

if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    notifyStatusListeners();
    triggerQueueSync();
  });

  window.addEventListener('offline', () => {
    notifyStatusListeners();
  });
}
