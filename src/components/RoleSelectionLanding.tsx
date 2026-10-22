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

interface RoleSelectionLandingProps {
  initialApprenticeData: ApprenticeData;
  onSelectAprendiz: (data: ApprenticeData) => void;
  onSelectInstructor: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

const AUTHORIZED_INSTRUCTOR_PASS = 'sena1234';

export const RoleSelectionLanding: React.FC<RoleSelectionLandingProps> = ({
  initialApprenticeData,
  onSelectAprendiz,
  onSelectInstructor,
  darkMode,
  onToggleDarkMode,
}) => {
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
      setLearnerError('Por favor ingresa tus nombres y apellidos completos.');
      return;
    }
    if (!learnerForm.documentNumber.trim()) {
      setLearnerError('Por favor ingresa tu número de documento.');
      return;
    }
    if (!learnerForm.fichaNumber.trim()) {
      setLearnerError('Por favor ingresa el número de ficha asignado.');
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
      setInstructorError('Clave de instructor incorrecta. Por favor ingresa la clave autorizada: sena1234');
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
                  SENA Inducción
                </span>
                <span className="hidden sm:inline-flex text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-[#1e5c00] dark:text-[#48c805] border border-emerald-300 dark:border-emerald-800">
                  Acuerdo 0009 de 2024
                </span>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Servicio Nacional de Aprendizaje · Dirección de Formación Profesional
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowVideoModal(true)}
              className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-[#1e5c00] dark:text-[#48c805] bg-emerald-100 dark:bg-emerald-950/70 hover:bg-emerald-200 dark:hover:bg-emerald-900 rounded-xl transition-all border border-emerald-200 dark:border-emerald-800 cursor-pointer"
            >
              <PlayCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Ver Tutorial</span>
            </button>
            <button
              onClick={onToggleDarkMode}
              title={darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
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
              <h3 className="text-sm font-semibold text-white">Guía de Inducción SENA</h3>
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
            <span>Portal Oficial de Acceso Diferenciado</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white font-display">
            Bienvenido al Sistema de Inducción SENA
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            Para garantizar una experiencia organizada y preservar la privacidad de los datos,
            selecciona el rol con el que vas a ingresar hoy a la plataforma:
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
                  Sin Contraseña · Acceso Directo
                </span>
              </div>

              <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-white">
                Soy Aprendiz SENA
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
                Ingresa tus datos de caracterización para iniciar tu inducción al reglamento, resolver casos prácticos y certificar tu etapa inicial.
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
                    Nombres y Apellidos Completos <span className="text-[#39A900]">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="Ej. Natalia Andrea Morales Rojas"
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
                      Tipo Documento
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
                      <option value="PAS">PAS (Pasaporte)</option>
                    </select>
                  </div>

                  <div className="sm:col-span-7 space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Número de Documento <span className="text-[#39A900]">*</span>
                    </label>
                    <div className="relative">
                      <CreditCard className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        required
                        placeholder="Ej. 1.098.765.432"
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
                      Número de Ficha de Formación <span className="text-[#39A900]">*</span>
                    </label>
                    {learnerForm.fichaNumber && (
                      <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                        Ficha: {learnerForm.fichaNumber}
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <Hash className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="Ej. 2874910"
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
                      Programa de Formación
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsCustomProgram(!isCustomProgram)}
                      className="text-[11px] text-[#39A900] dark:text-[#48c805] hover:underline font-medium cursor-pointer"
                    >
                      {isCustomProgram ? 'Elegir de la lista' : 'Otro programa'}
                    </button>
                  </div>
                  {isCustomProgram ? (
                    <input
                      type="text"
                      placeholder="Escribe el nombre de tu programa formativo"
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
                      Regional / Centro de Formación
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsCustomRegional(!isCustomRegional)}
                      className="text-[11px] text-[#39A900] dark:text-[#48c805] hover:underline font-medium cursor-pointer"
                    >
                      {isCustomRegional ? 'Elegir de la lista' : 'Otra regional'}
                    </button>
                  </div>
                  {isCustomRegional ? (
                    <input
                      type="text"
                      placeholder="Escribe el nombre de tu Regional y Centro"
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
                    Tus datos se sincronizarán automáticamente con tu <strong>Certificado Digital Oficial</strong> y la lista de control del instructor al finalizar.
                  </p>
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-xl font-bold text-sm text-white bg-[#39A900] hover:bg-[#2d8500] active:scale-[0.99] transition-all shadow-md shadow-[#39A900]/25 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Comenzar Mi Inducción SENA</span>
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
                  Privilegiado · Requiere Clave
                </span>
              </div>

              <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-white">
                Soy Instructor SENA
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
                Acceso exclusivo para instructores y líderes formativos: monitoreo de aprendices, resguardo automático en Google Drive y generación de enlaces de ficha.
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
                    Clave de Acceso Institucional del Instructor <span className="text-[#39A900]">*</span>
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Ingresa la clave (ej. sena1234)"
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
                    Privilegios del Rol Instructor:
                  </span>
                  <div className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#39A900] shrink-0" />
                      <span>Conectar y autorizar Google Sheets y Drive en segundo plano</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#39A900] shrink-0" />
                      <span>Monitorear tabla de calificaciones y aprendices aprobados</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#39A900] shrink-0" />
                      <span>Generar enlaces directos para aprendices por número de ficha</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#39A900] shrink-0" />
                      <span>Exportar planillas de cumplimiento a formato CSV oficial</span>
                    </div>
                  </div>
                </div>

                {/* Password input already exists, removing reveal and autofill box */}

                {/* Submit Action */}
                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-xl font-bold text-sm text-white bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white dark:text-slate-900 active:scale-[0.99] transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-[#39A900]" />
                  <span>Ingresar al Portal del Instructor</span>
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Footer info in landing */}
        <div className="mt-12 text-center text-xs text-slate-500 dark:text-slate-400 space-y-1">
          <p>
            Sistema Institucional de Inducción · Servicio Nacional de Aprendizaje SENA · República de Colombia
          </p>
          <p className="text-[11px] text-slate-400 dark:text-slate-500">
            Los datos ingresados son confidenciales y se procesan exclusivamente con fines académicos institucionales bajo el Acuerdo 0009 de 2024.
          </p>
        </div>
      </main>
    </div>
  );
};
