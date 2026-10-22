import { ApprenticeData } from '../components/CertificateView';
import { getAccessToken, auth } from './googleAuth';
import {
  findOrCreateInductionSheet,
  appendApprenticeRecord,
} from './googleSheetsService';
import {
  isRecordAlreadySynced,
  markRecordAsSynced,
  enqueueApprentice,
  dequeueApprentice,
  flushPendingQueue,
  getPendingQueue,
} from './offlineSyncQueue';
import { sounds } from '../utils/soundEffects';

export interface SyncEvent {
  type: 'synced' | 'queued' | 'already_synced' | 'error' | 'queue_flushed';
  message: string;
  apprenticeName?: string;
  sheetUrl?: string;
  queueCount?: number;
  timestamp: number;
}

type SyncEventListener = (event: SyncEvent) => void;
const listeners: Set<SyncEventListener> = new Set();

export function subscribeSyncEvents(listener: SyncEventListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function notifyListeners(event: SyncEvent): void {
  listeners.forEach((listener) => {
    try {
      listener(event);
    } catch (err) {
      console.warn('Error en listener de sincronización:', err);
    }
  });
}

/**
 * Triggers an automatic, hands-free synchronization of the apprentice record.
 * Never throws — handles offline states, missing tokens, and retries smoothly.
 */
export async function triggerBackgroundSync(
  apprentice: ApprenticeData,
  score: number
): Promise<{ status: 'synced' | 'queued' | 'already_synced' | 'error'; message: string; sheetUrl?: string }> {
  // 1. Guard against duplicate synchronization
  if (isRecordAlreadySynced(apprentice, score)) {
    return {
      status: 'already_synced',
      message: 'El aprendiz ya se encuentra registrado en Google Sheets.',
    };
  }

  // 2. Check if offline or no token currently available
  const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
  const token = await getAccessToken();

  if (!isOnline || !token) {
    const queued = enqueueApprentice(
      apprentice,
      score,
      !isOnline ? 'Sin conexión a internet' : 'Pendiente de inicio de sesión de Google'
    );
    const count = getPendingQueue().length;

    notifyListeners({
      type: 'queued',
      message: 'Guardado en cola local. Se sincronizará automáticamente al conectar.',
      apprenticeName: apprentice.fullName,
      queueCount: count,
      timestamp: Date.now(),
    });

    return {
      status: 'queued',
      message: 'Registro encolado para sincronización automática.',
    };
  }

  // 3. Online with active token: sync directly
  try {
    const sheet = await findOrCreateInductionSheet(token);
    await appendApprenticeRecord(token, sheet.spreadsheetId, apprentice, score);
    markRecordAsSynced(apprentice, score);
    dequeueApprentice(apprentice.documentNumber);

    try {
      sounds.playSuccess();
    } catch {
      // Audio might be blocked or disabled
    }

    notifyListeners({
      type: 'synced',
      message: `¡${apprentice.fullName} sincronizado automáticamente en Google Sheets!`,
      apprenticeName: apprentice.fullName,
      sheetUrl: sheet.spreadsheetUrl,
      timestamp: Date.now(),
    });

    // Also flush any pending items in background
    setTimeout(() => {
      flushPendingQueue(token, sheet.spreadsheetId).then((res) => {
        if (res.successCount > 0) {
          notifyListeners({
            type: 'queue_flushed',
            message: `Se sincronizaron ${res.successCount} registros que estaban pendientes en cola.`,
            queueCount: getPendingQueue().length,
            sheetUrl: sheet.spreadsheetUrl,
            timestamp: Date.now(),
          });
        }
      });
    }, 1000);

    return {
      status: 'synced',
      message: 'Sincronizado exitosamente',
      sheetUrl: sheet.spreadsheetUrl,
    };
  } catch (err: any) {
    console.error('Error durante sincronización en segundo plano:', err);
    enqueueApprentice(apprentice, score, err.message);
    const count = getPendingQueue().length;

    notifyListeners({
      type: 'queued',
      message: 'Guardado en cola de reintentos local.',
      apprenticeName: apprentice.fullName,
      queueCount: count,
      timestamp: Date.now(),
    });

    return {
      status: 'queued',
      message: 'Registro encolado para reintento automático.',
    };
  }
}

/**
 * Initializes listeners for online/offline events and periodic queue flushes.
 */
export function initBackgroundSyncListeners(): () => void {
  const handleOnline = async () => {
    const token = await getAccessToken();
    const queue = getPendingQueue();
    if (token && queue.length > 0) {
      try {
        const sheet = await findOrCreateInductionSheet(token);
        const res = await flushPendingQueue(token, sheet.spreadsheetId);
        if (res.successCount > 0) {
          notifyListeners({
            type: 'queue_flushed',
            message: `Conexión restablecida: ${res.successCount} registros sincronizados en Google Sheets.`,
            sheetUrl: sheet.spreadsheetUrl,
            timestamp: Date.now(),
          });
        }
      } catch (err) {
        console.warn('Error al auto-vaciar la cola tras volver en línea:', err);
      }
    }
  };

  if (typeof window !== 'undefined') {
    window.addEventListener('online', handleOnline);
  }

  return () => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('online', handleOnline);
    }
  };
}
