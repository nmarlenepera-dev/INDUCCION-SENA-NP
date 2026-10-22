/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { RoleSelectionLanding } from './components/RoleSelectionLanding';
import { PlanView } from './components/PlanView';
import { RegulationExplorer } from './components/RegulationExplorer';
import { EthicalSimulator } from './components/EthicalSimulator';
import { InductionQuiz } from './components/InductionQuiz';
import { CertificateView, ApprenticeData } from './components/CertificateView';
import { BadgesModal } from './components/BadgesModal';
import { GoogleSheetsSyncModal } from './components/GoogleSheetsSyncModal';
import { AutoSyncToast } from './components/AutoSyncToast';
import { InstructorDashboard } from './components/InstructorDashboard';
import { InstructorAuthModal } from './components/InstructorAuthModal';
import { User } from 'firebase/auth';
import { initAuth } from './services/googleAuth';
import {
  triggerBackgroundSync,
  initBackgroundSyncListeners,
  subscribeSyncEvents,
} from './services/backgroundSyncService';
import { getPendingQueue } from './services/offlineSyncQueue';
import {
  SENA_BADGES,
  SENA_REGULATION_ARTICLES,
  REAL_SENA_CASES,
  Badge,
} from './data/senaRegulationData';
import {
  Award,
  BookOpen,
  Scale,
  CheckCircle2,
  FileText,
  Shield,
  ChevronRight,
  GraduationCap,
} from 'lucide-react';
import { Language, translations } from './utils/translations';
import { sounds } from './utils/soundEffects';

const HERO_IMG = '/src/assets/images/hero_sena_induction_1792526595203.jpg';

export default function App() {
  // Language State: 'es' vs 'en' with persistence
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sena_language');
      if (saved === 'en' || saved === 'es') return saved as Language;
    }
    return 'es';
  });

  const toggleLanguage = () => {
    const nextLang: Language = language === 'es' ? 'en' : 'es';
    setLanguage(nextLang);
    localStorage.setItem('sena_language', nextLang);
    try {
      sounds.playSuccess();
    } catch {
      // ignore
    }
  };

  const t = translations[language];

  // User Role State: 'aprendiz' vs 'instructor' vs null (landing)
  const [userRole, setUserRole] = useState<'aprendiz' | 'instructor' | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sena_user_role');
      if (saved === 'instructor' || saved === 'aprendiz') return saved;
    }
    return null;
  });

  const [showInstructorAuthModal, setShowInstructorAuthModal] = useState<boolean>(false);

  // Navigation tab state
  const [currentTab, setCurrentTab] = useState<
    'plan' | 'reglamento' | 'tribunal' | 'evaluacion' | 'certificado' | 'instructor'
  >(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlRole = params.get('role') || params.get('portal');
      if (urlRole === 'instructor') return 'instructor';
    }
    return 'reglamento';
  });

  // Gamification states
  const [xp, setXp] = useState<number>(() => {
    const saved = localStorage.getItem('sena_induction_xp');
    return saved ? parseInt(saved, 10) : 100;
  });

  const [level, setLevel] = useState<number>(1);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [showBadgesModal, setShowBadgesModal] = useState<boolean>(false);

  // Google Workspace Integration (Google Drive & Google Sheets)
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showSheetsModal, setShowSheetsModal] = useState<boolean>(false);
  const [pendingQueueCount, setPendingQueueCount] = useState<number>(() => {
    return getPendingQueue().length;
  });

  useEffect(() => {
    const unsubscribeAuth = initAuth(
      (user) => setCurrentUser(user),
      () => setCurrentUser(null)
    );
    const cleanupSyncListeners = initBackgroundSyncListeners();
    const unsubscribeSyncEvents = subscribeSyncEvents(() => {
      setPendingQueueCount(getPendingQueue().length);
    });

    return () => {
      if (unsubscribeAuth) unsubscribeAuth();
      cleanupSyncListeners();
      unsubscribeSyncEvents();
    };
  }, []);

  // Read articles tracking
  const [readArticleIds, setReadArticleIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('sena_read_articles');
    return saved ? JSON.parse(saved) : ['art-7-academicos'];
  });

  // Solved cases tracking
  const [completedCaseIds, setCompletedCaseIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('sena_solved_cases');
    return saved ? JSON.parse(saved) : [];
  });

  // Quiz state
  const [quizScore, setQuizScore] = useState<number>(() => {
    const saved = localStorage.getItem('sena_quiz_score');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [certificateUnlocked, setCertificateUnlocked] = useState<boolean>(() => {
    const saved = localStorage.getItem('sena_cert_unlocked');
    return saved === 'true';
  });

  // Badges state
  const [badges, setBadges] = useState<Badge[]>(() => {
    const saved = localStorage.getItem('sena_badges');
    return saved ? JSON.parse(saved) : SENA_BADGES;
  });

  // Apprentice Profile data
  const [apprentice, setApprentice] = useState<ApprenticeData>(() => {
    const saved = localStorage.getItem('sena_apprentice_data');
    if (saved) return JSON.parse(saved);
    return {
      fullName: 'Natalia Andrea Morales Rojas',
      documentType: 'C.C.',
      documentNumber: '1.098.765.432',
      program: 'Tecnólogo en Análisis y Desarrollo de Software (ADSO)',
      fichaNumber: '2874910',
      regional: 'Regional Distrito Capital - Centro de Tecnologías del Software (CENIGRAF / CSF)',
      completionDate: new Date().toISOString().split('T')[0],
      verificationCode: 'SENA-IND-2026-ADSO-89FA31B',
    };
  });

  // Dark mode state with persistence
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('sena_dark_mode');
    return saved === 'true';
  });

  // State for screen blur transition effect
  const [isTransitioningTheme, setIsTransitioningTheme] = useState<boolean>(false);

  // Sync dark class with document element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('sena_dark_mode', darkMode.toString());
  }, [darkMode]);

  // Check if URL has ?ficha=... to prefill apprentice ficha for learners
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const fichaParam = params.get('ficha');
      if (fichaParam) {
        setApprentice((prev) => ({ ...prev, fichaNumber: fichaParam }));
      }
    }
  }, []);

  const handleSwitchRole = () => {
    setUserRole(null);
    localStorage.removeItem('sena_user_role');
    setCurrentTab('reglamento');
  };

  const handleSelectInstructor = () => {
    setUserRole('instructor');
    setCurrentTab('instructor');
    localStorage.setItem('sena_user_role', 'instructor');
  };

  const handleSelectAprendiz = (data: ApprenticeData) => {
    setApprentice(data);
    setUserRole('aprendiz');
    setCurrentTab('reglamento');
    localStorage.setItem('sena_user_role', 'aprendiz');
  };

  const handleInstructorAuthSuccess = () => {
    handleSelectInstructor();
  };

  const toggleDarkMode = () => {
    setIsTransitioningTheme(true);
    setDarkMode((prev) => !prev);
    setTimeout(() => {
      setIsTransitioningTheme(false);
    }, 650);
  };

  // Update level based on XP
  useEffect(() => {
    const calculatedLevel = Math.floor(xp / 250) + 1;
    setLevel(calculatedLevel);
    localStorage.setItem('sena_induction_xp', xp.toString());
  }, [xp]);

  // Save read articles
  useEffect(() => {
    localStorage.setItem('sena_read_articles', JSON.stringify(readArticleIds));
  }, [readArticleIds]);

  // Save cases
  useEffect(() => {
    localStorage.setItem('sena_solved_cases', JSON.stringify(completedCaseIds));
  }, [completedCaseIds]);

  // Save badges
  useEffect(() => {
    localStorage.setItem('sena_badges', JSON.stringify(badges));
  }, [badges]);

  // Save apprentice data
  useEffect(() => {
    localStorage.setItem('sena_apprentice_data', JSON.stringify(apprentice));
  }, [apprentice]);

  // Calculate overall completion percent
  const totalSteps =
    SENA_REGULATION_ARTICLES.length + REAL_SENA_CASES.length + 1; // articles + cases + quiz
  const currentStepProgress =
    readArticleIds.length +
    completedCaseIds.length +
    (certificateUnlocked ? 1 : 0);
  const completedPercent = Math.min(
    100,
    Math.round((currentStepProgress / totalSteps) * 100)
  );

  // Check and unlock badges
  const checkBadgeUnlocks = (
    updatedReadIds: string[],
    updatedCaseIds: string[],
    score: number
  ) => {
    setBadges((prevBadges) =>
      prevBadges.map((badge) => {
        if (badge.id === 'badge-derechos-maestro') {
          const hasAllRights = ['art-7-academicos', 'art-7-bienestar'].every(
            (id) => updatedReadIds.includes(id)
          );
          return { ...badge, unlocked: hasAllRights || badge.unlocked };
        }
        if (badge.id === 'badge-deberes-custodio') {
          const hasAllDuties = [
            'art-9-academicos',
            'art-9-convivencia',
            'art-10-prohibiciones',
          ].every((id) => updatedReadIds.includes(id));
          return { ...badge, unlocked: hasAllDuties || badge.unlocked };
        }
        if (badge.id === 'badge-casos-tribunal') {
          return {
            ...badge,
            unlocked: updatedCaseIds.length >= 3 || badge.unlocked,
          };
        }
        if (badge.id === 'badge-etapa-productiva') {
          return {
            ...badge,
            unlocked:
              updatedReadIds.includes('art-12-etapas') || badge.unlocked,
          };
        }
        if (badge.id === 'badge-graduado-induccion') {
          return { ...badge, unlocked: score >= 80 || badge.unlocked };
        }
        return badge;
      })
    );
  };

  const handleMarkArticleRead = (id: string) => {
    if (!readArticleIds.includes(id)) {
      const nextRead = [...readArticleIds, id];
      setReadArticleIds(nextRead);
      setXp((prev) => prev + 50);
      checkBadgeUnlocks(nextRead, completedCaseIds, quizScore);
    }
  };

  const handleSolveCase = (
    caseId: string,
    isCorrect: boolean,
    xpReward: number
  ) => {
    if (!completedCaseIds.includes(caseId)) {
      const nextCases = [...completedCaseIds, caseId];
      setCompletedCaseIds(nextCases);
      if (isCorrect) {
        setXp((prev) => prev + xpReward);
      }
      checkBadgeUnlocks(readArticleIds, nextCases, quizScore);
    }
  };

  const handleQuizCompleted = (scorePercentage: number) => {
    setQuizScore(scorePercentage);
    localStorage.setItem('sena_quiz_score', scorePercentage.toString());
    if (scorePercentage >= 80) {
      setCertificateUnlocked(true);
      localStorage.setItem('sena_cert_unlocked', 'true');
      setXp((prev) => prev + 250);
      checkBadgeUnlocks(readArticleIds, completedCaseIds, scorePercentage);
      // Automatically trigger background sync to Google Sheets upon passing
      triggerBackgroundSync(apprentice, scorePercentage);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b1120] text-slate-800 dark:text-slate-100 transition-colors duration-200 flex flex-col relative">
      {/* Cinematic Screen Blur Transition Overlay */}
      {isTransitioningTheme && (
        <div
          aria-hidden="true"
          className="fixed inset-0 z-50 pointer-events-none theme-transition-blur backdrop-blur-md bg-slate-900/10 dark:bg-slate-950/20"
        />
      )}

      {userRole === null ? (
        <RoleSelectionLanding
          initialApprenticeData={apprentice}
          onSelectAprendiz={handleSelectAprendiz}
          onSelectInstructor={handleSelectInstructor}
          darkMode={darkMode}
          onToggleDarkMode={toggleDarkMode}
          language={language}
          onToggleLanguage={toggleLanguage}
        />
      ) : (
        <>
          {/* 3-Zone Contract Header with Dark Mode and Google Workspace controls */}
          <Header
            currentTab={currentTab}
            setCurrentTab={setCurrentTab}
            xp={xp}
            level={level}
            completedPercent={completedPercent}
            soundEnabled={soundEnabled}
            setSoundEnabled={setSoundEnabled}
            certificateUnlocked={certificateUnlocked}
            darkMode={darkMode}
            onToggleDarkMode={toggleDarkMode}
            language={language}
            onToggleLanguage={toggleLanguage}
            onOpenSheetsModal={() => setShowSheetsModal(true)}
            googleConnected={!!currentUser}
            pendingQueueCount={pendingQueueCount}
            userRole={userRole}
            onSwitchRole={handleSwitchRole}
            onRequestInstructorAuth={() => setShowInstructorAuthModal(true)}
          />

          {/* Main Container */}
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
            {/* Dedicated Instructor View */}
            {currentTab === 'instructor' && userRole === 'instructor' && (
              <InstructorDashboard
                currentUser={currentUser}
                onOpenSheetsModal={() => setShowSheetsModal(true)}
                onSwitchToLearnerView={() => setCurrentTab('reglamento')}
              />
            )}

        {/* Institutional Hero Banner (rendered on reglamento tab) */}
        {currentTab === 'reglamento' && (
          <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 dark:border-slate-800 text-white shadow-sm transition-colors">
            <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
              {/* Text side */}
              <div className="lg:col-span-7 p-6 sm:p-8 md:p-10 flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono">
                    <span className="w-2 h-2 rounded-full bg-[#39A900]" />
                    <span>{t.bannerTag}</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight font-display text-white">
                    {t.bannerTitle}
                  </h1>
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-xl">
                    {t.bannerDesc}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={() => setCurrentTab('plan')}
                    className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-900 bg-white hover:bg-slate-100 rounded-lg transition-colors whitespace-nowrap shadow-xs"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-[#39A900]" />
                    <span>{t.viewStructuredPlan}</span>
                  </button>

                  <button
                    onClick={() => setCurrentTab('tribunal')}
                    className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#39A900] hover:bg-[#2d8500] rounded-lg transition-colors whitespace-nowrap shadow-xs"
                  >
                    <Scale className="w-3.5 h-3.5" />
                    <span>{t.tribunalOfCases}</span>
                  </button>

                  <button
                    onClick={() => setShowBadgesModal(true)}
                    className="inline-flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white bg-white/10 hover:bg-white/15 rounded-lg transition-colors whitespace-nowrap"
                  >
                    <Award className="w-3.5 h-3.5 text-amber-400" />
                    <span>{t.badgesCount} ({badges.filter((b) => b.unlocked).length}/{badges.length})</span>
                  </button>
                </div>
              </div>

              {/* Photo side */}
              <div className="lg:col-span-5 relative min-h-[220px] lg:min-h-full">
                <img
                  src={HERO_IMG}
                  alt="Aprendices SENA en formación práctica"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-slate-900 via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-3 right-3 text-[11px] text-white/80 bg-black/40 backdrop-blur-xs px-2.5 py-1 rounded">
                  {t.learningEnvironment}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content Routing */}
        {currentTab === 'plan' && (
          <PlanView
            onStartLearning={() => setCurrentTab('reglamento')}
            onGoToCases={() => setCurrentTab('tribunal')}
            onGoToQuiz={() => setCurrentTab('evaluacion')}
          />
        )}

        {currentTab === 'reglamento' && (
          <RegulationExplorer
            readArticleIds={readArticleIds}
            onMarkArticleRead={handleMarkArticleRead}
            onGoToCases={() => setCurrentTab('tribunal')}
          />
        )}

        {currentTab === 'tribunal' && (
          <EthicalSimulator
            completedCaseIds={completedCaseIds}
            onSolveCase={handleSolveCase}
            onGoToQuiz={() => setCurrentTab('evaluacion')}
          />
        )}

        {currentTab === 'evaluacion' && (
          <InductionQuiz
            onQuizCompleted={handleQuizCompleted}
            onGoToCertificate={() => setCurrentTab('certificado')}
            bestScore={quizScore}
          />
        )}

        {currentTab === 'certificado' && (
          <CertificateView
            apprentice={apprentice}
            setApprentice={setApprentice}
            score={quizScore > 0 ? quizScore : 100}
            certificateUnlocked={certificateUnlocked}
            onGoToQuiz={() => setCurrentTab('evaluacion')}
            onOpenSheetsSync={userRole === 'instructor' ? () => setShowSheetsModal(true) : undefined}
          />
        )}
      </main>

      {/* Google Sheets and Drive Integration Modal */}
      <GoogleSheetsSyncModal
        isOpen={showSheetsModal}
        onClose={() => setShowSheetsModal(false)}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        apprentice={apprentice}
        score={quizScore > 0 ? quizScore : 100}
      />

      {/* Gamification Badges Modal */}
      <BadgesModal
        isOpen={showBadgesModal}
        onClose={() => setShowBadgesModal(false)}
        badges={badges}
        xp={xp}
        level={level}
      />

      {/* Institutional Footer */}
      <footer className="no-print border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 mt-12 text-xs text-slate-500 dark:text-slate-400 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 dark:text-white">SENA</span>
            <span aria-hidden="true">·</span>
            <span>Servicio Nacional de Aprendizaje</span>
            <span aria-hidden="true">·</span>
            <span>Colombia</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400 dark:text-slate-500">
            <span>{t.regulationsFooter}</span>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setCurrentTab('plan')}
              className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            >
              {t.planPedagogic}
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setShowBadgesModal(true)}
              className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            >
              {t.viewBadges}
            </button>
            <span aria-hidden="true">·</span>
            {userRole === 'aprendiz' ? (
              <button
                onClick={() => setShowInstructorAuthModal(true)}
                className="hover:text-[#39A900] dark:hover:text-[#48c805] font-semibold text-slate-700 dark:text-slate-200 transition-colors flex items-center gap-1"
              >
                <Shield className="w-3 h-3 text-[#39A900]" />
                <span>{t.iAmInstructor}</span>
              </button>
            ) : (
              <button
                onClick={handleSwitchRole}
                className="hover:text-emerald-700 dark:hover:text-emerald-400 font-semibold text-slate-700 dark:text-slate-200 transition-colors flex items-center gap-1"
              >
                <GraduationCap className="w-3.5 h-3.5 text-[#39A900]" />
                <span>{t.exitRole}</span>
              </button>
            )}
          </div>
        </div>
      </footer>

      {/* Instructor Authentication Modal */}
      <InstructorAuthModal
        isOpen={showInstructorAuthModal}
        onClose={() => setShowInstructorAuthModal(false)}
        onSuccess={handleInstructorAuthSuccess}
      />

      {/* Non-intrusive background sync notification */}
      <AutoSyncToast />
        </>
      )}
    </div>
  );
}
