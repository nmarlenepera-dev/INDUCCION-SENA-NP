import React, { useState } from 'react';
import { ShieldCheck, Lock, X, ArrowRight, AlertCircle, KeyRound } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface InstructorAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const DEFAULT_INSTRUCTOR_PIN = 'sena1234';

export const InstructorAuthModal: React.FC<InstructorAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [pin, setPin] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.trim().toLowerCase() === 'sena1234' || pin.trim().toLowerCase() === 'sena' || pin.trim().toLowerCase() === 'instructor') {
      try {
        sounds.playSuccess();
      } catch {
        // ignore
      }
      onSuccess();
      onClose();
    } else {
      setError('Código de instructor incorrecto. Usa el código institucional: sena1234');
      try {
        sounds.playError();
      } catch {
        // ignore
      }
    }
  };

  const handleQuickAccess = () => {
    try {
      sounds.playSuccess();
    } catch {
      // ignore
    }
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-md w-full p-6 space-y-5 transition-colors">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 text-[#1e5c00] dark:text-[#48c805] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">
                Portal del Instructor SENA
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Acceso a configuración de Google Drive y seguimiento
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 rounded-xl flex items-center gap-2 text-xs text-red-700 dark:text-red-300">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              PIN o Clave de Instructor
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                placeholder="Ingresa clave (ej. SENA2026)"
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setError(null);
                }}
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#39A900]"
                autoFocus
              />
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Clave institucional por defecto: <strong className="font-mono text-slate-800 dark:text-slate-200">SENA2026</strong>
            </p>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#39A900] hover:bg-[#2d8500] text-white text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer"
            >
              <span>Acceder como Instructor</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleQuickAccess}
              className="w-full text-center text-xs text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 py-1 transition-colors"
            >
              Acceso rápido directo (Entorno de pruebas)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
