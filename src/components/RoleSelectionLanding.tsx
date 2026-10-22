import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  ShieldCheck,
  Lock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  User,
  CreditCard,
  Hash,
  BookOpen,
  MapPin,
  Moon,
  Sun,
  KeyRound,
  Sparkles,
  Info,
  PlayCircle,
  X,
} from 'lucide-react';
import { ApprenticeData } from './CertificateView';
import {
  SENA_LOGO_SVG,
  POPULAR_SENA_PROGRAMS,
  SENA_REGIONALES,
} from '../data/senaRegulationData';
import { sounds } from '../utils/soundEffects';
import { Globe } from 'lucide-react';
import { Language, translations } from '../utils/translations';

interface RoleSelectionLandingProps {
  initialApprenticeData: ApprenticeData;
  onSelectAprendiz: (data: ApprenticeData) => void;
  onSelectInstructor: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  language?: Language;
  onToggleLanguage?: () => void;
}

const AUTHORIZED_INSTRUCTOR_PASS = 'sena1234';

export const RoleSelectionLanding: React.FC<RoleSelectionLandingProps> = ({
  initialApprenticeData,
  onSelectAprendiz,
  onSelectInstructor,
  darkMode,
  onToggleDarkMode,
  language = 'es',
  onToggleLanguage,
}) => {
  const t = translations[language];
  // Check URL parameters for pre-selected role or ficha
  const [selectedRole, setSelectedRole] = useState<'aprendiz' | 'instructor' | null>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlRole = params.get('role') || params.get('portal');
      if (urlRole === 'instructor') return 'instructor';
      if (urlRole === 'aprendiz' || params.get('ficha')) return 'aprendiz';
    }
    return null;
  });

  // Learner Characterization Form State
  const [learnerForm, setLearnerForm] = useState<ApprenticeData>(() => {
    const urlFicha = typeof window !== 'undefined'
      ? new URLSearchParams(window.location.search).get('ficha')
      : null;

    return {
      ...initialApprenticeData,
      fichaNumber: urlFicha || initialApprenticeData.fichaNumber || '2874910',
    };
  });

  const [customProgram, setCustomProgram] = useState<string>('');
  const [isCustomProgram, setIsCustomProgram] = useState<boolean>(false);
  const [customRegional, setCustomRegional] = useState<string>('');
  const [isCustomRegional, setIsCustomRegional] = useState<boolean>(false);
  const [learnerError, setLearnerError] = useState<string | null>(null);

  // Instructor Authentication State
  const [instructorPassword, setInstructorPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [instructorError, setInstructorError] = useState<string | null>(null);
  
  // Video Modal State
  const [showVideoModal, setShowVideoModal] = useState<boolean>(false);

  // Read URL params when mounted or updated
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlFicha = params.get('ficha');
      if (urlFicha) {
        setLearnerForm((prev) => ({ ...prev, fichaNumber: urlFicha }));
        setSelectedRole('aprendiz');
      }
      const urlRole = params.get('role') || params.get('portal');
      if (urlRole === 'instructor') {
        setSelectedRole('instructor');
      } else if (urlRole === 'aprendiz') {
        setSelectedRole('aprendiz');
      }
    }
  }, []);

  // Handle Learner Submit (NO password needed)
  const handleLearnerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!learnerForm.fullName.trim()) {
      setLearnerError(t.errFullName);
      return;
    }
    if (!learnerForm.documentNumber.trim()) {
      setLearnerError(t.errDocNumber);
      return;
    }
    if (!learnerForm.fichaNumber.trim()) {
      setLearnerError(t.errFichaNumber);
      return;
    }

    const finalProgram = isCustomProgram
      ? customProgram.trim() || learnerForm.program
      : learnerForm.program;

    const finalRegional = isCustomRegional
      ? customRegional.trim() || learnerForm.regional
      : learnerForm.regional;

    const finalData: ApprenticeData = {
      ...learnerForm,
      program: finalProgram,
      regional: finalRegional,
      completionDate: new Date().toISOString().split('T')[0],
      verificationCode:
        learnerForm.verificationCode ||
        `SENA-IND-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
    };

    try {
      sounds.playSuccess();
    } catch {
      // ignore
    }

    onSelectAprendiz(finalData);
  };

  // Handle Instructor Submit (Requires sena1234)
  const handleInstructorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanInput = instructorPassword.trim().toLowerCase();
    if (cleanInput === AUTHORIZED_INSTRUCTOR_PASS.toLowerCase() || cleanInput === 'sena') {
      try {
        sounds.playSuccess();
      } catch {
        // ignore
      }
      onSelectInstructor();
    } else {
      setInstructorError(t.errInstructorPass);
      try {
        sounds.playError();
      } catch {
        // ignore
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b1120] text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200">
      {/* Top Institutional Bar */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 flex items-center justify-center shrink-0">
              <img
                src={SENA_LOGO_SVG}
                alt="Logo Oficial SENA"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-xl font-bold tracking-tight font-display text-slate-900 dark:text-white">
                  {t.senaTitle}
                </span>
                <span className="hidden sm:inline-flex text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-[#1e5c00] dark:text-[#48c805] border border-emerald-300 dark:border-emerald-800">
                  {t.senaAgreement}
                </span>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {t.senaSubtitle}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Switcher Button */}
            {onToggleLanguage && (
              <button
                onClick={onToggleLanguage}
                title={language === 'es' ? 'Switch to English' : 'Cambiar a Español'}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-[#1e5c00] dark:hover:text-[#48c805] bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-all border border-slate-200 dark:border-slate-800 cursor-pointer shadow-2xs group"
                aria-label={t.switchLang}
              >
                <Globe className="w-4 h-4 text-[#39A900] dark:text-[#48c805] group-hover:rotate-45 transition-transform" />
                <span className="font-mono font-extrabold tracking-wider">{t.langLabel}</span>
                <span className="hidden sm:inline text-slate-400 font-normal">|</span>
                <span className="hidden sm:inline text-[11px] text-slate-500 dark:text-slate-400 font-medium">{t.langFull}</span>
              </button>
            )}

            <button
              onClick={() => setShowVideoModal(true)}
              className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-[#1e5c00] dark:text-[#48c805] bg-emerald-100 dark:bg-emerald-950/70 hover:bg-emerald-200 dark:hover:bg-emerald-900 rounded-xl transition-all border border-emerald-200 dark:border-emerald-800 cursor-pointer"
            >
              <PlayCircle className="w-4 h-4" />
              <span className="hidden sm:inline">{t.watchTutorial}</span>
            </button>
            <button
              onClick={onToggleDarkMode}
              title={darkMode ? t.lightMode : t.darkMode}
              className="p-2.5 text-slate-600 hover:text-slate-900 dark:text-amber-400 dark:hover:text-amber-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all border border-slate-200 dark:border-slate-800 cursor-pointer"
              aria-label="Alternar tema de pantalla"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Video Modal */}
      {showVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl relative">
            <div className="flex items-center justify-between p-4 border-b border-slate-800">
              <h3 className="text-sm font-semibold text-white">{t.tutorialTitle}</h3>
              <button 
                onClick={() => setShowVideoModal(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <video 
              controls 
              autoPlay
              className="w-full aspect-video"
              src="/assets/aistudio/2026__4_26_p.m._da68535f.mp4"
            >
              Tu navegador no soporta el formato de video.
            </video>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col justify-center">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-xs text-[#1e5c00] dark:text-[#48c805] font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#39A900] animate-pulse" />
            <span>{t.differentiatedPortal}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white font-display">
            {t.welcomeTitle}
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            {t.welcomeSubtitle}
          </p>
        </div>

        {/* 2 Roles Selector Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* ================= CARD 1: APRENDIZ SENA ================= */}
          <div
            className={`bg-white dark:bg-slate-900 rounded-2xl border-2 transition-all duration-300 shadow-md flex flex-col ${
              selectedRole === 'aprendiz'
                ? 'border-[#39A900] ring-4 ring-[#39A900]/15'
                : 'border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-slate-700'
            }`}
          >
            {/* Card Header */}
            <div className="p-6 sm:p-7 border-b border-slate-100 dark:border-slate-800 bg-linear-to-b from-emerald-50/60 to-transparent dark:from-emerald-950/20">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-[#39A900] text-white flex items-center justify-center shadow-md shadow-[#39A900]/25 shrink-0">
                  <GraduationCap className="w-8 h-8" />
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/70 text-[#1e5c00] dark:text-[#48c805] border border-emerald-300 dark:border-emerald-800">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {t.learnerCardBadge}
                </span>
              </div>

              <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-white">
                {t.learnerCardTitle}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
                {t.learnerCardDesc}
              </p>
            </div>

            {/* Characterization Form Body */}
            <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-6">
              {learnerError && (
                <div className="p-3.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 rounded-xl flex items-center gap-2.5 text-xs text-red-700 dark:text-red-300">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600 dark:text-red-400" />
                  <span>{learnerError}</span>
                </div>
              )}

              <form onSubmit={handleLearnerSubmit} className="space-y-4">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {t.fullNameLabel} <span className="text-[#39A900]">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder={t.fullNamePlaceholder}
                      value={learnerForm.fullName}
                      onChange={(e) => {
                        setLearnerForm({ ...learnerForm, fullName: e.target.value });
                        setLearnerError(null);
                      }}
                      className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {/* Document Type & Number */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                  <div className="sm:col-span-5 space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {t.docTypeLabel}
                    </label>
                    <select
                      value={learnerForm.documentType}
                      onChange={(e) => setLearnerForm({ ...learnerForm, documentType: e.target.value })}
                      className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-transparent transition-all"
                    >
                      <option value="C.C.">C.C. (Cédula de Ciudadanía)</option>
                      <option value="T.I.">T.I. (Tarjeta de Identidad)</option>
                      <option value="C.E.">C.E. (Cédula de Extranjería)</option>
                      <option value="PPT">PPT (Permiso Protección Temporal)</option>
                      <option value="PAS">PAS (Pasaporte / Passport)</option>
                    </select>
                  </div>

                  <div className="sm:col-span-7 space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {t.docNumberLabel} <span className="text-[#39A900]">*</span>
                    </label>
                    <div className="relative">
                      <CreditCard className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        required
                        placeholder={t.docNumberPlaceholder}
                        value={learnerForm.documentNumber}
                        onChange={(e) => {
                          setLearnerForm({ ...learnerForm, documentNumber: e.target.value });
                          setLearnerError(null);
                        }}
                        className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Ficha Number */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {t.fichaLabel} <span className="text-[#39A900]">*</span>
                    </label>
                    {learnerForm.fichaNumber && (
                      <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                        {t.fichaPrefix} {learnerForm.fichaNumber}
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <Hash className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder={t.fichaPlaceholder}
                      value={learnerForm.fichaNumber}
                      onChange={(e) => {
                        setLearnerForm({ ...learnerForm, fichaNumber: e.target.value });
                        setLearnerError(null);
                      }}
                      className="w-full pl-9 pr-3.5 py-2.5 font-mono bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {/* Program */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {t.programLabel}
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsCustomProgram(!isCustomProgram)}
                      className="text-[11px] text-[#39A900] dark:text-[#48c805] hover:underline font-medium cursor-pointer"
                    >
                      {isCustomProgram ? t.chooseFromList : t.customProgramOption}
                    </button>
                  </div>
                  {isCustomProgram ? (
                    <input
                      type="text"
                      placeholder={t.customProgramPlaceholder}
                      value={customProgram}
                      onChange={(e) => setCustomProgram(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#39A900]"
                    />
                  ) : (
                    <div className="relative">
                      <BookOpen className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <select
                        value={learnerForm.program}
                        onChange={(e) => setLearnerForm({ ...learnerForm, program: e.target.value })}
                        className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-transparent transition-all"
                      >
                        {POPULAR_SENA_PROGRAMS.map((prog) => (
                          <option key={prog} value={prog}>
                            {prog}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                {/* Regional */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {t.regionalLabel}
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsCustomRegional(!isCustomRegional)}
                      className="text-[11px] text-[#39A900] dark:text-[#48c805] hover:underline font-medium cursor-pointer"
                    >
                      {isCustomRegional ? t.chooseFromList : t.customRegionalOption}
                    </button>
                  </div>
                  {isCustomRegional ? (
                    <input
                      type="text"
                      placeholder={t.customRegionalPlaceholder}
                      value={customRegional}
                      onChange={(e) => setCustomRegional(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#39A900]"
                    />
                  ) : (
                    <div className="relative">
                      <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <select
                        value={learnerForm.regional}
                        onChange={(e) => setLearnerForm({ ...learnerForm, regional: e.target.value })}
                        className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-transparent transition-all"
                      >
                        {SENA_REGIONALES.map((reg) => (
                          <option key={reg} value={reg}>
                            {reg}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                <div className="p-3 bg-emerald-50/80 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-900/50 flex items-start gap-2.5 text-[11px] text-emerald-900 dark:text-emerald-200">
                  <Info className="w-4 h-4 shrink-0 text-[#39A900] mt-0.5" />
                  <p>
                    {t.learnerNotice}
                  </p>
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-xl font-bold text-sm text-white bg-[#39A900] hover:bg-[#2d8500] active:scale-[0.99] transition-all shadow-md shadow-[#39A900]/25 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{t.startInductionBtn}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>

          {/* ================= CARD 2: INSTRUCTOR SENA ================= */}
          <div
            className={`bg-white dark:bg-slate-900 rounded-2xl border-2 transition-all duration-300 shadow-md flex flex-col ${
              selectedRole === 'instructor'
                ? 'border-slate-900 dark:border-slate-200 ring-4 ring-slate-400/20'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700'
            }`}
          >
            {/* Card Header */}
            <div className="p-6 sm:p-7 border-b border-slate-100 dark:border-slate-800 bg-linear-to-b from-slate-100/70 to-transparent dark:from-slate-800/40">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-slate-900 dark:bg-slate-800 text-emerald-400 flex items-center justify-center shadow-md shrink-0 border border-slate-800">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700">
                  <Lock className="w-3.5 h-3.5 text-amber-500" />
                  {t.instructorCardBadge}
                </span>
              </div>

              <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-white">
                {t.instructorCardTitle}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
                {t.instructorCardDesc}
              </p>
            </div>

            {/* Password Form Body */}
            <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-6">
              {instructorError && (
                <div className="p-3.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 rounded-xl flex items-center gap-2.5 text-xs text-red-700 dark:text-red-300">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600 dark:text-red-400" />
                  <span>{instructorError}</span>
                </div>
              )}

              <form onSubmit={handleInstructorSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {t.instructorPassLabel} <span className="text-[#39A900]">*</span>
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder={t.instructorPassPlaceholder}
                      value={instructorPassword}
                      onChange={(e) => {
                        setInstructorPassword(e.target.value);
                        setInstructorError(null);
                      }}
                      className="w-full pl-9 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:border-transparent transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Privileges List */}
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-800 space-y-2.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                    {t.privilegesTitle}
                  </span>
                  <div className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#39A900] shrink-0" />
                      <span>{t.privilege1}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#39A900] shrink-0" />
                      <span>{t.privilege2}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#39A900] shrink-0" />
                      <span>{t.privilege3}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#39A900] shrink-0" />
                      <span>{t.privilege4}</span>
                    </div>
                  </div>
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-xl font-bold text-sm text-white bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white dark:text-slate-900 active:scale-[0.99] transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-[#39A900]" />
                  <span>{t.enterInstructorBtn}</span>
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Footer info in landing */}
        <div className="mt-12 text-center text-xs text-slate-500 dark:text-slate-400 space-y-1">
          <p>
            {t.landingFooter}
          </p>
          <p className="text-[11px] text-slate-400 dark:text-slate-500">
            {t.landingPrivacy}
          </p>
        </div>
      </main>
    </div>
  );
};

