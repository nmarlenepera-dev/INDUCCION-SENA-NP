import React, { useState, useEffect } from 'react';
import {
  FileSpreadsheet,
  ExternalLink,
  CheckCircle2,
  RefreshCw,
  LogOut,
  AlertCircle,
  X,
  Plus,
  Users,
  Copy,
  Check,
  ShieldAlert,
} from 'lucide-react';
import { User } from 'firebase/auth';
import {
  googleSignIn,
  logout,
  getAccessToken,
} from '../services/googleAuth';
import {
  findOrCreateInductionSheet,
  appendApprenticeRecord,
  getApprenticeRecords,
  SheetApprenticeRecord,
} from '../services/googleSheetsService';
import { flushPendingQueue, getPendingQueue } from '../services/offlineSyncQueue';
import { ApprenticeData } from './CertificateView';
import { sounds } from '../utils/soundEffects';

interface GoogleSheetsSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  apprentice: ApprenticeData;
  score: number;
}

export const GoogleSheetsSyncModal: React.FC<GoogleSheetsSyncModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  setCurrentUser,
  apprentice,
  score,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [popupBlocked, setPopupBlocked] = useState<boolean>(false);
  const [insufficientScopes, setInsufficientScopes] = useState<boolean>(false);

  // Spreadsheet state
  const [sheetInfo, setSheetInfo] = useState<{
    id: string;
    url: string;
  } | null>(() => {
    const saved = localStorage.getItem('sena_google_sheet_info');
    return saved ? JSON.parse(saved) : null;
  });

  const [records, setRecords] = useState<SheetApprenticeRecord[]>([]);
  const [loadingRecords, setLoadingRecords] = useState<boolean>(false);

  // Confirmation state for data mutation (MANDATORY per workspace skill)
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [copiedUrl, setCopiedUrl] = useState<boolean>(false);

  // When user is authenticated and modal opens, verify/fetch spreadsheet
  useEffect(() => {
    if (isOpen && currentUser) {
      loadSheetAndRecords();
    }
  }, [isOpen, currentUser]);

  const loadSheetAndRecords = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
      setPopupBlocked(false);
      setInsufficientScopes(false);
      const token = await getAccessToken();
      if (!token) return;

      const sheet = await findOrCreateInductionSheet(token);
      setSheetInfo({ id: sheet.spreadsheetId, url: sheet.spreadsheetUrl });
      localStorage.setItem(
        'sena_google_sheet_info',
        JSON.stringify({ id: sheet.spreadsheetId, url: sheet.spreadsheetUrl })
      );

      // Flush any pending queue
      await flushPendingQueue(token, sheet.spreadsheetId);

      // Load rows
      setLoadingRecords(true);
      const rows = await getApprenticeRecords(token, sheet.spreadsheetId);
      setRecords(rows);
    } catch (err: any) {
      console.error(err);
      if (
        err?.message?.includes('insufficient authentication scopes') ||
        err?.message?.includes('insufficient')
      ) {
        setInsufficientScopes(true);
        setErrorMsg('Tu sesión actual no tiene los permisos necesarios para Google Sheets y Drive.');
      } else {
        setErrorMsg(err.message || 'Error comunicando con Google Sheets y Google Drive');
      }
    } finally {
      setLoading(false);
      setLoadingRecords(false);
    }
  };

  const handleSignIn = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
      setPopupBlocked(false);
      setInsufficientScopes(false);
      const result = await googleSignIn(true);
      if (result) {
        setPopupBlocked(false);
        setInsufficientScopes(false);
        setCurrentUser(result.user);
        sounds.playSuccess();
        // Load or create sheet
        const sheet = await findOrCreateInductionSheet(result.accessToken);
        setSheetInfo({ id: sheet.spreadsheetId, url: sheet.spreadsheetUrl });
        localStorage.setItem(
          'sena_google_sheet_info',
          JSON.stringify({ id: sheet.spreadsheetId, url: sheet.spreadsheetUrl })
        );

        // Auto-flush queue and retrieve records
        await flushPendingQueue(result.accessToken, sheet.spreadsheetId);
        const rows = await getApprenticeRecords(result.accessToken, sheet.spreadsheetId);
        setRecords(rows);
      }
    } catch (err: any) {
      console.error(err);
      const isBlocked =
        err?.code === 'auth/popup-blocked' ||
        err?.message?.includes('popup-blocked') ||
        err?.message?.includes('popup');

      if (isBlocked) {
        setPopupBlocked(true);
        setErrorMsg(
          'Tu navegador bloqueó la ventana emergente de Google. Sigue las instrucciones a continuación para habilitarla o abrir en pestaña nueva.'
        );
      } else if (
        err?.message?.includes('insufficient authentication scopes') ||
        err?.message?.includes('insufficient')
      ) {
        setInsufficientScopes(true);
        setErrorMsg(
          'Se requieren permisos de Google Sheets y Google Drive. Haz clic en "Conceder permisos" para autorizarlos.'
        );
      } else {
        setErrorMsg(err.message || 'No se pudo iniciar sesión con Google');
      }
      sounds.playError();
    } finally {
      setLoading(false);
    }
  };

  const handleReauthWithConsent = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
      setPopupBlocked(false);
      setInsufficientScopes(false);
      await logout();
      setCurrentUser(null);
      const result = await googleSignIn(true);
      if (result) {
        setCurrentUser(result.user);
        sounds.playSuccess();
        const sheet = await findOrCreateInductionSheet(result.accessToken);
        setSheetInfo({ id: sheet.spreadsheetId, url: sheet.spreadsheetUrl });
        localStorage.setItem(
          'sena_google_sheet_info',
          JSON.stringify({ id: sheet.spreadsheetId, url: sheet.spreadsheetUrl })
        );
        await flushPendingQueue(result.accessToken, sheet.spreadsheetId);
        const rows = await getApprenticeRecords(result.accessToken, sheet.spreadsheetId);
        setRecords(rows);
      }
    } catch (err: any) {
      console.error(err);
      const isBlocked =
        err?.code === 'auth/popup-blocked' ||
        err?.message?.includes('popup-blocked') ||
        err?.message?.includes('popup');

      if (isBlocked) {
        setPopupBlocked(true);
        setErrorMsg('Tu navegador bloqueó la ventana emergente de Google.');
      } else if (
        err?.message?.includes('insufficient authentication scopes') ||
        err?.message?.includes('insufficient')
      ) {
        setInsufficientScopes(true);
        setErrorMsg(
          'Debes marcar y conceder los permisos solicitados en la pantalla de Google.'
        );
      } else {
        setErrorMsg(err.message || 'Error autorizando permisos');
      }
      sounds.playError();
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await logout();
      setCurrentUser(null);
      setRecords([]);
      setSuccessMsg(null);
      setPopupBlocked(false);
      setInsufficientScopes(false);
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleConfirmSync = async () => {
    setShowConfirmModal(false);
    if (!sheetInfo) return;

    try {
      setLoading(true);
      setErrorMsg(null);
      setSuccessMsg(null);
      const token = await getAccessToken();
      if (!token) {
        throw new Error('Sesión no disponible. Por favor vuelve a conectar tu cuenta.');
      }

      await appendApprenticeRecord(token, sheetInfo.id, apprentice, score);
      sounds.playSuccess();
      setSuccessMsg(
        `¡Aprendiz ${apprentice.fullName} guardado exitosamente en Google Sheets!`
      );

      // Refresh list
      const rows = await getApprenticeRecords(token, sheetInfo.id);
      setRecords(rows);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Error guardando datos en la hoja de cálculo');
      sounds.playError();
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-3xl w-full my-8 p-6 space-y-6 transition-colors max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 text-[#1e5c00] dark:text-[#48c805] flex items-center justify-center">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white font-display">
                Almacenamiento en Google Drive & Sheets
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Sincronización oficial del registro de aprendices en inducción
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && !popupBlocked && !insufficientScopes && (
          <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 rounded-xl flex items-center gap-2 text-xs text-red-700 dark:text-red-300">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Dedicated Popup Blocked Diagnostic and Action Guide */}
        {popupBlocked && (
          <div className="bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-300 dark:border-amber-700/60 rounded-xl p-4 text-left space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-amber-900 dark:text-amber-200">
                  Ventana emergente bloqueada por tu navegador
                </h4>
                <p className="text-xs text-amber-800 dark:text-amber-300 mt-0.5">
                  El navegador impidió abrir la ventana de Google para seleccionar tu cuenta y autorizar Google Drive y Google Sheets.
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900/90 rounded-lg p-3 border border-amber-200 dark:border-amber-800/50 space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
              <span className="font-bold text-slate-900 dark:text-white block text-xs">
                ¿Cómo desbloquearlo en 10 segundos?
              </span>
              
              <div className="space-y-2">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#39A900] text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                    1
                  </span>
                  <div>
                    <strong className="text-slate-900 dark:text-white">Opción recomendada (Permitir pop-ups):</strong>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                      En la barra de direcciones de tu navegador (arriba a la derecha), busca el icono de ventana emergente bloqueada (🚫 o icono con cruz roja). Haz clic en él, marca <strong>"Permitir siempre ventanas emergentes y redirecciones de este sitio"</strong> y haz clic en <strong>Listo</strong>.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                    2
                  </span>
                  <div>
                    <strong className="text-slate-900 dark:text-white">Opción alternativa (Abrir fuera del marco):</strong>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                      Si el entorno de previsualización restringe pop-ups, abre el prototipo en una pestaña independiente donde no aplican bloqueos de marco.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                onClick={handleSignIn}
                disabled={loading}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#39A900] hover:bg-[#2d8500] text-white text-xs font-bold rounded-lg transition-all shadow-sm cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                <span>{loading ? 'Reintentando...' : 'Reintentar inicio de sesión'}</span>
              </button>

              <button
                onClick={() => window.open(window.location.href, '_blank')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600 text-xs font-semibold rounded-lg transition-colors shadow-2xs"
              >
                <ExternalLink className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>Abrir en pestaña nueva</span>
              </button>
            </div>
          </div>
        )}

        {successMsg && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 rounded-xl flex items-center gap-2 text-xs text-emerald-800 dark:text-emerald-300">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-[#39A900]" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Body Content */}
        <div className="space-y-6 overflow-y-auto flex-1 pr-1">
          {!currentUser ? (
            /* Unauthenticated View: Sign in with Google */
            <div className="text-center py-8 px-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 rounded-xl space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-[#1e5c00] dark:text-[#48c805] flex items-center justify-center">
                <FileSpreadsheet className="w-8 h-8" />
              </div>
              <div className="max-w-md mx-auto space-y-1">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Conecta tu cuenta de Google
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Crea y actualiza automáticamente una hoja de cálculo en tu Google Drive
                  titulada <strong className="text-slate-800 dark:text-slate-200">"SENA — Registro Oficial de Aprendices en Inducción (Acuerdo 0009 de 2024)"</strong> para resguardar las constancias y datos de inducción.
                </p>
              </div>

              {/* Official Google Sign-In Button */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={handleSignIn}
                  disabled={loading}
                  className="inline-flex items-center gap-3 px-5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-200 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  <svg className="w-5 h-5" viewBox="0 0 48 48">
                    <path
                      fill="#EA4335"
                      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                    />
                    <path
                      fill="#4285F4"
                      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                    />
                    <path
                      fill="#34A853"
                      d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                    />
                  </svg>
                  <span>{loading ? 'Conectando...' : 'Acceder con Google'}</span>
                </button>

                <button
                  onClick={() => window.open(window.location.href, '_blank')}
                  title="Abrir el prototipo en una pestaña completa fuera del visor"
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-700/60 rounded-lg transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Abrir en pestaña nueva</span>
                </button>
              </div>

              <p className="text-[11px] text-slate-400 dark:text-slate-500 pt-1">
                🔒 Requiere permisos para gestionar hojas de cálculo creadas por la aplicación en tu Google Drive.
              </p>
            </div>
          ) : (
            /* Authenticated View */
            <div className="space-y-5">
              {/* Connected User & Sheet Banner */}
              <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  {currentUser.photoURL ? (
                    <img
                      src={currentUser.photoURL}
                      alt={currentUser.displayName || 'Usuario'}
                      className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-700"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[#39A900] text-white flex items-center justify-center font-bold">
                      {currentUser.displayName?.charAt(0) || 'U'}
                    </div>
                  )}
                  <div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 block">Conectado como</span>
                    <strong className="text-sm text-slate-900 dark:text-white">
                      {currentUser.displayName}
                    </strong>
                    <span className="text-xs text-slate-500 dark:text-slate-400 block font-mono">
                      {currentUser.email}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleSignOut}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Desconectar</span>
                </button>
              </div>

              {/* Insufficient Scopes Banner */}
              {insufficientScopes && (
                <div className="bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-300 dark:border-amber-700/60 rounded-xl p-4 text-left space-y-3 animate-fadeIn">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0">
                      <ShieldAlert className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-amber-900 dark:text-amber-200">
                        Permisos de Google Sheets y Drive no concedidos
                      </h4>
                      <p className="text-xs text-amber-800 dark:text-amber-300 mt-0.5">
                        Tu cuenta de Google fue vinculada, pero falta autorizar los permisos de edición para Google Sheets y Google Drive para guardar las fichas y constancias de inducción.
                      </p>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-slate-900/90 rounded-lg p-3 border border-amber-200 dark:border-amber-800/50 text-xs text-slate-700 dark:text-slate-300 space-y-1.5">
                    <strong className="text-slate-900 dark:text-white block">
                      ¿Cómo autorizar los permisos?
                    </strong>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                      Haz clic en el botón verde a continuación. Se abrirá la ventana de Google; asegúrate de seleccionar tu cuenta y marcar las casillas para <strong>"Ver, editar, crear y eliminar hojas de cálculo de Google Drive"</strong>.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <button
                      onClick={handleReauthWithConsent}
                      disabled={loading}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-[#39A900] hover:bg-[#2d8500] text-white text-xs font-bold rounded-lg transition-all shadow-sm cursor-pointer disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                      <span>{loading ? 'Conectando...' : 'Autorizar permisos en Google'}</span>
                    </button>

                    <button
                      onClick={() => window.open(window.location.href, '_blank')}
                      className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Abrir en pestaña nueva</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Linked Spreadsheet Card */}
              {sheetInfo && (
                <div className="bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 rounded-xl p-4 space-y-3">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#1e5c00] dark:text-[#48c805]">
                          Hoja de Cálculo Activa en Google Drive
                        </span>
                        <span className="w-2 h-2 rounded-full bg-[#39A900] animate-pulse" />
                      </div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">
                        SENA — Registro Oficial de Aprendices en Inducción (Acuerdo 0009 de 2024)
                      </p>
                      <span className="text-xs text-slate-600 dark:text-slate-400 block">
                        Pestaña de datos: <strong className="text-slate-800 dark:text-slate-200">"Aprendices Inducción"</strong>
                      </span>
                    </div>

                    <a
                      href={sheetInfo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-[#39A900] hover:bg-[#2d8500] rounded-lg transition-colors shrink-0 shadow-sm"
                    >
                      <FileSpreadsheet className="w-4 h-4" />
                      <span>Abrir en Google Sheets</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  {/* Direct URL display and copy tool */}
                  <div className="pt-2 border-t border-emerald-200/60 dark:border-emerald-900/40">
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Enlace directo de la hoja de cálculo:
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value={sheetInfo.url}
                        className="w-full text-xs font-mono bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-lg select-all text-slate-700 dark:text-slate-300 focus:outline-none"
                      />
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(sheetInfo.url);
                          setCopiedUrl(true);
                          setTimeout(() => setCopiedUrl(false), 2000);
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg shrink-0 text-slate-700 dark:text-slate-200 transition-colors shadow-2xs"
                        title="Copiar enlace al portapapeles"
                      >
                        {copiedUrl ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-[#39A900]" />
                            <span>Copiado</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copiar</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Save Current Apprentice Action Box */}
              <div className="bg-white dark:bg-slate-800 border-2 border-dashed border-[#39A900]/40 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Datos del Aprendiz Actual en el Prototipo:
                  </span>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    {apprentice.fullName} — {apprentice.documentType} {apprentice.documentNumber}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Ficha: {apprentice.fichaNumber} · Puntaje: {score}% · Estado:{' '}
                    {score >= 80 ? 'Aprobado' : 'En Inducción'}
                  </p>
                </div>

                <button
                  onClick={() => setShowConfirmModal(true)}
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-[#39A900] hover:bg-[#2d8500] rounded-xl transition-all shadow-sm hover:shadow-md cursor-pointer disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" />
                  <span>{loading ? 'Guardando...' : 'Registrar en Google Sheets'}</span>
                </button>
              </div>

              {/* Records Table View */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Aprendices Registrados en la Hoja ({records.length})
                    </h3>
                  </div>

                  <button
                    onClick={loadSheetAndRecords}
                    disabled={loadingRecords}
                    className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                  >
                    <RefreshCw className={`w-3 h-3 ${loadingRecords ? 'animate-spin' : ''}`} />
                    <span>Actualizar</span>
                  </button>
                </div>

                {records.length === 0 ? (
                  <div className="text-center py-6 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-500 dark:text-slate-400">
                    Aún no hay registros en la hoja de cálculo. Haz clic en "Registrar en Google Sheets" para agregar al primer aprendiz.
                  </div>
                ) : (
                  <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden max-h-56 overflow-y-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 sticky top-0">
                        <tr>
                          <th className="p-2.5">Aprendiz</th>
                          <th className="p-2.5">Documento</th>
                          <th className="p-2.5">Ficha</th>
                          <th className="p-2.5">Calificación</th>
                          <th className="p-2.5">Fecha</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {records.map((r, idx) => (
                          <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                            <td className="p-2.5 font-medium text-slate-900 dark:text-white">
                              {r.fullName}
                            </td>
                            <td className="p-2.5 font-mono text-slate-600 dark:text-slate-400">
                              {r.documentType} {r.documentNumber}
                            </td>
                            <td className="p-2.5 font-mono text-slate-600 dark:text-slate-400">
                              {r.fichaNumber}
                            </td>
                            <td className="p-2.5">
                              <span className="font-bold text-[#1e5c00] dark:text-[#48c805]">
                                {r.score}
                              </span>
                            </td>
                            <td className="p-2.5 text-slate-500 dark:text-slate-400">
                              {r.completionDate || r.timestamp}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>

      {/* Explicit User Confirmation Dialog for mutating Google Workspace data (Mandatory) */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-[#1e5c00] dark:text-[#48c805] flex items-center justify-center shrink-0">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  ¿Confirmar registro en Google Sheets?
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Se añadirá una nueva fila a la hoja de cálculo{' '}
                  <strong className="text-slate-800 dark:text-slate-200">
                    "SENA — Registro Oficial de Aprendices en Inducción"
                  </strong>{' '}
                  en tu Google Drive con la siguiente información:
                </p>
                <div className="bg-slate-50 dark:bg-slate-800/80 p-2.5 rounded-lg text-xs space-y-1 mt-2">
                  <p><strong>Aprendiz:</strong> {apprentice.fullName}</p>
                  <p><strong>Documento:</strong> {apprentice.documentType} {apprentice.documentNumber}</p>
                  <p><strong>Programa:</strong> {apprentice.program}</p>
                  <p><strong>Ficha:</strong> {apprentice.fichaNumber}</p>
                  <p><strong>Puntaje:</strong> {score}%</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmSync}
                className="px-4 py-1.5 text-xs font-bold text-white bg-[#39A900] hover:bg-[#2d8500] rounded-lg transition-colors shadow-xs"
              >
                Confirmar y Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
