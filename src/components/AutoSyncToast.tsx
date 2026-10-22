import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Clock,
  ExternalLink,
  X,
  FileSpreadsheet,
  CloudCheck,
} from 'lucide-react';
import { subscribeSyncEvents, SyncEvent } from '../services/backgroundSyncService';

export const AutoSyncToast: React.FC = () => {
  const [currentEvent, setCurrentEvent] = useState<SyncEvent | null>(null);
  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = subscribeSyncEvents((event) => {
      // Don't show toast for already_synced to avoid noise
      if (event.type === 'already_synced') return;

      setCurrentEvent(event);
      setVisible(true);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!visible) return;

    const timer = setTimeout(() => {
      setVisible(false);
    }, 5500);

    return () => clearTimeout(timer);
  }, [visible, currentEvent]);

  if (!visible || !currentEvent) return null;

  const isSuccess = currentEvent.type === 'synced' || currentEvent.type === 'queue_flushed';

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-5 right-5 z-50 max-w-sm w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-4 transition-all animate-slideUp duration-200"
    >
      <div className="flex items-start gap-3">
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
            isSuccess
              ? 'bg-emerald-50 dark:bg-emerald-950/70 text-[#1e5c00] dark:text-[#48c805]'
              : 'bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300'
          }`}
        >
          {isSuccess ? (
            <FileSpreadsheet className="w-5 h-5" />
          ) : (
            <Clock className="w-5 h-5" />
          )}
        </div>

        <div className="flex-1 min-w-0 pr-1">
          <div className="flex items-center gap-1.5">
            <span
              className={`text-[11px] font-bold uppercase tracking-wider ${
                isSuccess
                  ? 'text-[#1e5c00] dark:text-[#48c805]'
                  : 'text-amber-700 dark:text-amber-400'
              }`}
            >
              {isSuccess ? 'Auto-Sincronización SENA' : 'Cola Local de Respaldo'}
            </span>
          </div>

          <p className="text-xs font-semibold text-slate-900 dark:text-white mt-0.5 leading-snug">
            {currentEvent.message}
          </p>

          {currentEvent.sheetUrl && (
            <div className="mt-2 flex items-center gap-2">
              <a
                href={currentEvent.sheetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-bold text-[#1e5c00] dark:text-[#48c805] hover:underline"
              >
                <span>Ver en Google Sheets</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}
        </div>

        <button
          onClick={() => setVisible(false)}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-md transition-colors"
          aria-label="Cerrar notificación"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
