import React from 'react';
import {
  Award,
  Volume2,
  VolumeX,
  FileText,
  Moon,
  Sun,
  FileSpreadsheet,
  ShieldCheck,
  GraduationCap,
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';
import { SENA_LOGO_SVG } from '../data/senaRegulationData';

interface HeaderProps {
  currentTab: 'plan' | 'reglamento' | 'tribunal' | 'evaluacion' | 'certificado' | 'instructor';
  setCurrentTab: (tab: 'plan' | 'reglamento' | 'tribunal' | 'evaluacion' | 'certificado' | 'instructor') => void;
  xp: number;
  level: number;
  completedPercent: number;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  certificateUnlocked: boolean;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenSheetsModal: () => void;
  googleConnected: boolean;
  pendingQueueCount?: number;
  userRole: 'aprendiz' | 'instructor';
  onSwitchRole: () => void;
  onRequestInstructorAuth: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  xp,
  level,
  completedPercent,
  soundEnabled,
  setSoundEnabled,
  certificateUnlocked,
  darkMode,
  onToggleDarkMode,
  onOpenSheetsModal,
  googleConnected,
  pendingQueueCount = 0,
  userRole,
  onSwitchRole,
  onRequestInstructorAuth,
}) => {
  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sounds.enabled = next;
  };

  return (
    <header className="no-print sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 min-h-[4.5rem] py-2">
          {/* Zone 1: Single Brand Wordmark */}
          <button
            onClick={() => setCurrentTab('reglamento')}
            className="flex items-center gap-3.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#39A900] rounded-md shrink-0 group"
          >
            <div className="w-[61px] h-[61px] flex items-center justify-center shrink-0">
              <img
                src={SENA_LOGO_SVG}
                alt="Logo Oficial SENA"
                className="w-full h-full object-contain transition-transform group-hover:scale-105"
              />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white font-display block leading-tight">
                SENA Inducción
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block font-medium">
                Reglamento del Aprendiz
              </span>
            </div>
          </button>

          {/* Zone 2: 4-5 Nav Links, single line, no pills */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
            <button
              onClick={() => setCurrentTab('plan')}
              className={`hover:text-[#39A900] dark:hover:text-[#48c805] transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 ${
                currentTab === 'plan'
                  ? 'border-[#39A900] text-[#1e5c00] dark:text-[#48c805] font-semibold'
                  : 'border-transparent'
              }`}
            >
              Plan de Inducción
            </button>
            <button
              onClick={() => setCurrentTab('reglamento')}
              className={`hover:text-[#39A900] dark:hover:text-[#48c805] transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 ${
                currentTab === 'reglamento'
                  ? 'border-[#39A900] text-[#1e5c00] dark:text-[#48c805] font-semibold'
                  : 'border-transparent'
              }`}
            >
              Reglamento y Derechos
            </button>
            <button
              onClick={() => setCurrentTab('tribunal')}
              className={`hover:text-[#39A900] dark:hover:text-[#48c805] transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 ${
                currentTab === 'tribunal'
                  ? 'border-[#39A900] text-[#1e5c00] dark:text-[#48c805] font-semibold'
                  : 'border-transparent'
              }`}
            >
              Tribunal de Casos
            </button>
            <button
              onClick={() => setCurrentTab('evaluacion')}
              className={`hover:text-[#39A900] dark:hover:text-[#48c805] transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 ${
                currentTab === 'evaluacion'
                  ? 'border-[#39A900] text-[#1e5c00] dark:text-[#48c805] font-semibold'
                  : 'border-transparent'
              }`}
            >
              Evaluación Final
            </button>
            <button
              onClick={() => setCurrentTab('certificado')}
              className={`hover:text-[#39A900] dark:hover:text-[#48c805] transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 ${
                currentTab === 'certificado'
                  ? 'border-[#39A900] text-[#1e5c00] dark:text-[#48c805] font-semibold'
                  : 'border-transparent'
              }`}
            >
              Certificado Digital
            </button>

            {/* Exclusive Tab for Instructor */}
            {userRole === 'instructor' && (
              <button
                onClick={() => setCurrentTab('instructor')}
                className={`hover:text-[#39A900] dark:hover:text-[#48c805] transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 font-bold ${
                  currentTab === 'instructor'
                    ? 'border-[#39A900] text-[#1e5c00] dark:text-[#48c805]'
                    : 'border-transparent text-slate-800 dark:text-slate-200'
                }`}
              >
                Panel Instructor
              </button>
            )}
          </nav>

          {/* Zone 3: Actions + Quick status + Dark mode toggle */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="hidden lg:flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 tabular-nums">
              <span className="font-semibold text-slate-800 dark:text-slate-200">Nivel {level}</span>
              <span aria-hidden="true">·</span>
              <span>{xp} XP</span>
              <span aria-hidden="true">·</span>
              <span>{completedPercent}%</span>
            </div>

            {/* Sound toggle button */}
            <button
              onClick={toggleSound}
              title={soundEnabled ? 'Silenciar efectos' : 'Activar efectos'}
              className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              aria-label="Alternar audio"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Google Drive / Sheets Button (ONLY visible to Instructor) */}
            {userRole === 'instructor' && (
              <button
                onClick={onOpenSheetsModal}
                title={
                  googleConnected
                    ? 'Sincronización automática activa en Google Sheets'
                    : pendingQueueCount > 0
                    ? `${pendingQueueCount} registro(s) pendientes de sincronización en cola`
                    : 'Sincronización desatendida con Google Sheets'
                }
                className={`p-2 rounded-lg transition-all border shadow-xs flex items-center gap-1.5 text-xs font-semibold ${
                  googleConnected
                    ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                    : pendingQueueCount > 0
                    ? 'bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300 dark:border-amber-800'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700/60'
                }`}
                aria-label="Google Sheets y Drive"
              >
                <FileSpreadsheet className="w-4 h-4 text-[#39A900] dark:text-[#48c805]" />
                <span className="hidden xl:inline">
                  {googleConnected
                    ? 'Auto-Sync Activo'
                    : pendingQueueCount > 0
                    ? `${pendingQueueCount} en cola`
                    : 'Google Sheets'}
                </span>
                {googleConnected ? (
                  <span className="w-2 h-2 rounded-full bg-[#39A900] animate-pulse hidden sm:inline" />
                ) : pendingQueueCount > 0 ? (
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce hidden sm:inline" />
                ) : null}
              </button>
            )}

            {/* Role Switcher / Access Badge */}
            {userRole === 'instructor' ? (
              <button
                onClick={onSwitchRole}
                title="Modo Instructor activo. Haz clic para cambiar a Vista del Aprendiz."
                className="px-2.5 py-1.5 text-xs font-bold text-slate-800 dark:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <span className="w-2 h-2 rounded-full bg-[#39A900] animate-pulse" />
                <span className="hidden sm:inline">Instructor</span>
                <span className="text-[10px] text-slate-400">⇄</span>
              </button>
            ) : (
              <button
                onClick={onRequestInstructorAuth}
                title="Acceso al portal y configuración del Instructor SENA"
                className="px-2.5 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#39A900]" />
                <span className="hidden sm:inline">Soy Instructor</span>
              </button>
            )}

            {/* Dark Mode Toggle Button */}
            <button
              onClick={onToggleDarkMode}
              title={darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
              className="p-2 text-slate-600 hover:text-slate-900 dark:text-amber-400 dark:hover:text-amber-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all border border-slate-200 dark:border-slate-700/60 shadow-xs"
              aria-label={darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            >
              {darkMode ? (
                <Sun className="w-4 h-4 transition-transform hover:rotate-45" />
              ) : (
                <Moon className="w-4 h-4 transition-transform hover:-rotate-12" />
              )}
            </button>

            {certificateUnlocked ? (
              <button
                onClick={() => setCurrentTab('certificado')}
                className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 text-xs font-semibold text-white bg-[#39A900] hover:bg-[#2d8500] rounded-lg transition-colors shadow-sm whitespace-nowrap"
              >
                <Award className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Ver Mi Certificado</span>
                <span className="sm:hidden">Certificado</span>
              </button>
            ) : (
              <button
                onClick={() => setCurrentTab('evaluacion')}
                className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors whitespace-nowrap"
              >
                <FileText className="w-3.5 h-3.5 text-[#39A900] dark:text-[#48c805]" />
                <span className="hidden sm:inline">Rendir Evaluación</span>
                <span className="sm:hidden">Evaluación</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-slate-100 dark:border-slate-800 text-xs overflow-x-auto">
          <button
            onClick={() => setCurrentTab('plan')}
            className={`px-2 py-1 font-medium whitespace-nowrap ${currentTab === 'plan' ? 'text-[#39A900] dark:text-[#48c805] font-bold' : 'text-slate-600 dark:text-slate-400'}`}
          >
            Plan
          </button>
          <button
            onClick={() => setCurrentTab('reglamento')}
            className={`px-2 py-1 font-medium whitespace-nowrap ${currentTab === 'reglamento' ? 'text-[#39A900] dark:text-[#48c805] font-bold' : 'text-slate-600 dark:text-slate-400'}`}
          >
            Reglamento
          </button>
          <button
            onClick={() => setCurrentTab('tribunal')}
            className={`px-2 py-1 font-medium whitespace-nowrap ${currentTab === 'tribunal' ? 'text-[#39A900] dark:text-[#48c805] font-bold' : 'text-slate-600 dark:text-slate-400'}`}
          >
            Casos
          </button>
          <button
            onClick={() => setCurrentTab('evaluacion')}
            className={`px-2 py-1 font-medium whitespace-nowrap ${currentTab === 'evaluacion' ? 'text-[#39A900] dark:text-[#48c805] font-bold' : 'text-slate-600 dark:text-slate-400'}`}
          >
            Test
          </button>
          <button
            onClick={() => setCurrentTab('certificado')}
            className={`px-2 py-1 font-medium whitespace-nowrap ${currentTab === 'certificado' ? 'text-[#39A900] dark:text-[#48c805] font-bold' : 'text-slate-600 dark:text-slate-400'}`}
          >
            Certificado
          </button>
        </div>
      </div>
    </header>
  );
};
