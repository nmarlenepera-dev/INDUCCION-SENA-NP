import { ApprenticeData } from '../components/CertificateView';
import { appendApprenticeRecord } from './googleSheetsService';

export interface QueuedApprenticeRecord {
  id: string; // Unique idempotency key: fichaNumber-documentNumber-verificationCode
  timestamp: string;
  apprentice: ApprenticeData;
  score: number;
  retryCount: number;
  lastAttempt?: string;
  errorMessage?: string;
}

const QUEUE_STORAGE_KEY = 'sena_pending_sync_queue';
const SYNCED_KEYS_STORAGE_KEY = 'sena_synced_keys_history';

/**
 * Generates an idempotency key to prevent duplicate entries in Google Sheets.
 */
export function getRecordIdempotencyKey(apprentice: ApprenticeData, score: number): string {
  const cleanDoc = (apprentice.documentNumber || '').trim();
  const cleanFicha = (apprentice.fichaNumber || '').trim();
  const cleanCode = (apprentice.verificationCode || '').trim();
  return `${cleanFicha}_${cleanDoc}_${cleanCode}_${score}`;
}

/**
 * Checks whether this record has already been successfully synced.
 */
export function isRecordAlreadySynced(apprentice: ApprenticeData, score: number): boolean {
  try {
    const key = getRecordIdempotencyKey(apprentice, score);
    const raw = localStorage.getItem(SYNCED_KEYS_STORAGE_KEY);
    const syncedKeys: string[] = raw ? JSON.parse(raw) : [];
    return syncedKeys.includes(key);
  } catch {
    return false;
  }
}

/**
 * Marks a record as successfully synced in local history.
 */
export function markRecordAsSynced(apprentice: ApprenticeData, score: number): void {
  try {
    const key = getRecordIdempotencyKey(apprentice, score);
    const raw = localStorage.getItem(SYNCED_KEYS_STORAGE_KEY);
    const syncedKeys: string[] = raw ? JSON.parse(raw) : [];
    if (!syncedKeys.includes(key)) {
      syncedKeys.push(key);
      // Keep only last 100 entries to prevent growth
      if (syncedKeys.length > 100) syncedKeys.shift();
      localStorage.setItem(SYNCED_KEYS_STORAGE_KEY, JSON.stringify(syncedKeys));
    }
  } catch (err) {
    console.warn('Error guardando clave de sincronización:', err);
  }
}

/**
 * Returns all pending items currently stored in the local queue.
 */
export function getPendingQueue(): QueuedApprenticeRecord[] {
  try {
    const raw = localStorage.getItem(QUEUE_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Adds an apprentice to the pending synchronization queue.
 */
export function enqueueApprentice(
  apprentice: ApprenticeData,
  score: number,
  errorMessage?: string
): QueuedApprenticeRecord {
  const queue = getPendingQueue();
  const id = getRecordIdempotencyKey(apprentice, score);

  const existingIndex = queue.findIndex((item) => item.id === id);
  if (existingIndex >= 0) {
    // Update existing record's retry and error message
    queue[existingIndex].retryCount += 1;
    queue[existingIndex].lastAttempt = new Date().toISOString();
    if (errorMessage) queue[existingIndex].errorMessage = errorMessage;
    localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(queue));
    return queue[existingIndex];
  }

  const newRecord: QueuedApprenticeRecord = {
    id,
    timestamp: new Date().toISOString(),
    apprentice,
    score,
    retryCount: 0,
    errorMessage,
  };

  queue.push(newRecord);
  localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(queue));
  return newRecord;
}

/**
 * Removes a record from the pending queue after successful sync.
 */
export function dequeueApprentice(id: string): void {
  try {
    const queue = getPendingQueue();
    const filtered = queue.filter((item) => item.id !== id);
    localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(filtered));
  } catch (err) {
    console.warn('Error removiendo elemento de la cola:', err);
  }
}

/**
 * Flushes all pending records to Google Sheets using the provided token and spreadsheetId.
 * Returns the number of successfully flushed records.
 */
export async function flushPendingQueue(
  accessToken: string,
  spreadsheetId: string
): Promise<{ successCount: number; errors: string[] }> {
  const queue = getPendingQueue();
  if (queue.length === 0) {
    return { successCount: 0, errors: [] };
  }

  let successCount = 0;
  const errors: string[] = [];

  for (const item of queue) {
    try {
      await appendApprenticeRecord(accessToken, spreadsheetId, item.apprentice, item.score);
      markRecordAsSynced(item.apprentice, item.score);
      dequeueApprentice(item.id);
      successCount++;
    } catch (err: any) {
      console.error(`Fallo reintento para ${item.apprentice.fullName}:`, err);
      errors.push(err.message || 'Error desconocido');
      // Increment retry count
      enqueueApprentice(item.apprentice, item.score, err.message);
    }
  }

  return { successCount, errors };
}
