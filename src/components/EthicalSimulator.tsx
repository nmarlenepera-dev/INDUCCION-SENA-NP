import React, { useState } from 'react';
import { REAL_SENA_CASES, CaseStudy } from '../data/senaRegulationData';
import {
  Scale,
  CheckCircle2,
  AlertCircle,
  Award,
  ArrowRight,
  RotateCcw,
  BookOpen,
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface EthicalSimulatorProps {
  completedCaseIds: string[];
  onSolveCase: (caseId: string, isCorrect: boolean, xpReward: number) => void;
  onGoToQuiz: () => void;
}

export const EthicalSimulator: React.FC<EthicalSimulatorProps> = ({
  completedCaseIds,
  onSolveCase,
  onGoToQuiz,
}) => {
  const [activeCaseIndex, setActiveCaseIndex] = useState<number>(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [hasEvaluated, setHasEvaluated] = useState<boolean>(false);

  const currentCase: CaseStudy = REAL_SENA_CASES[activeCaseIndex];
  const isAlreadySolved = completedCaseIds.includes(currentCase.id);

  const handleSelectOption = (optionId: string) => {
    if (hasEvaluated) return;
    setSelectedOptionId(optionId);
  };

  const handleEvaluate = () => {
    if (!selectedOptionId) return;
    setHasEvaluated(true);
    const chosenOption = currentCase.options.find((o) => o.id === selectedOptionId);
    const isCorrect = chosenOption ? chosenOption.isCorrect : false;

    if (isCorrect) {
      sounds.playSuccess();
      onSolveCase(currentCase.id, true, currentCase.xpReward);
    } else {
      sounds.playError();
      onSolveCase(currentCase.id, false, 0);
    }
  };

  const handleNextCase = () => {
    setSelectedOptionId(null);
    setHasEvaluated(false);
    if (activeCaseIndex < REAL_SENA_CASES.length - 1) {
      setActiveCaseIndex((prev) => prev + 1);
    }
  };

  const handleRestartCase = () => {
    setSelectedOptionId(null);
    setHasEvaluated(false);
  };

  const chosenOption = currentCase.options.find((o) => o.id === selectedOptionId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>Simulador de Juicio Ético</span>
            <span aria-hidden="true">·</span>
            <span>Casos Reales de Aprendices</span>
            <span aria-hidden="true">·</span>
            <span>SENA Convivencia</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Tribunal Ético de Casos SENA
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-sm mt-1 max-w-2xl">
            Afronta situaciones de la cotidianidad en los Centros de Formación. Evalúa cada dilema
            conforme al debido proceso y las normas vigentes para sumar XP y ganar la insignia de Juez Ético.
          </p>
        </div>

        {/* Case selector stepper */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 shrink-0 shadow-sm transition-colors">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300 mb-2">
            <span>Expediente {activeCaseIndex + 1} de {REAL_SENA_CASES.length}</span>
            <span aria-hidden="true">·</span>
            <span className="text-[#1e5c00] dark:text-[#48c805] font-mono">{completedCaseIds.length} resueltos</span>
          </div>
          <div className="flex items-center gap-1.5">
            {REAL_SENA_CASES.map((c, i) => {
              const solved = completedCaseIds.includes(c.id);
              const isCurrent = i === activeCaseIndex;
              return (
                <button
                  key={c.id}
                  onClick={() => {
                    setActiveCaseIndex(i);
                    setSelectedOptionId(null);
                    setHasEvaluated(false);
                  }}
                  className={`w-7 h-7 rounded-lg text-xs font-semibold transition-all ${
                    isCurrent
                      ? 'bg-[#39A900] text-white shadow-xs'
                      : solved
                      ? 'bg-emerald-100 dark:bg-emerald-950/70 text-[#1e5c00] dark:text-[#48c805]'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Case Card */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6 transition-colors">
        {/* Case Metadata */}
        <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-2">
            <span className="font-semibold text-slate-800 dark:text-slate-200">{currentCase.program}</span>
            <span aria-hidden="true">·</span>
            <span>{currentCase.apprenticeRole}</span>
            <span aria-hidden="true">·</span>
            <span className="text-[#1e5c00] dark:text-[#48c805] font-mono font-semibold">+{currentCase.xpReward} XP</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white font-display">
            {currentCase.title}
          </h2>
        </div>

        {/* Situation narrative */}
        <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-5 border border-slate-200/80 dark:border-slate-700/60 space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            <BookOpen className="w-4 h-4 text-[#39A900] dark:text-[#48c805]" />
            <span>Relato de los Hechos (Expediente SENA):</span>
          </div>
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            {currentCase.situation}
          </p>
        </div>

        {/* Question */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
            {currentCase.question}
          </h3>

          {/* Options */}
          <div className="space-y-3">
            {currentCase.options.map((opt) => {
              const isSelected = selectedOptionId === opt.id;
              let optionStyle =
                'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-800/50 text-slate-800 dark:text-slate-200';

              if (hasEvaluated) {
                if (opt.isCorrect) {
                  optionStyle =
                    'border-[#39A900] dark:border-[#39A900] bg-emerald-50/70 dark:bg-emerald-950/40 text-slate-900 dark:text-white';
                } else if (isSelected && !opt.isCorrect) {
                  optionStyle =
                    'border-rose-300 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/40 text-slate-900 dark:text-white';
                } else {
                  optionStyle =
                    'border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/40 text-slate-400 dark:text-slate-600 opacity-60';
                }
              } else if (isSelected) {
                optionStyle =
                  'border-[#39A900] ring-2 ring-[#39A900]/20 bg-[#39A900]/5 dark:bg-[#39A900]/15 text-slate-900 dark:text-white';
              }

              return (
                <div
                  key={opt.id}
                  onClick={() => handleSelectOption(opt.id)}
                  className={`cursor-pointer rounded-xl border p-4 transition-all text-xs md:text-sm flex items-start gap-3 ${optionStyle}`}
                >
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 text-xs font-semibold ${
                      isSelected
                        ? 'border-[#39A900] bg-[#39A900] text-white'
                        : 'border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {hasEvaluated && opt.isCorrect ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                    ) : (
                      opt.id.replace('opt-', '')
                    )}
                  </div>
                  <div className="space-y-1">
                    <span className="leading-relaxed block">{opt.text}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Feedback block when evaluated */}
        {hasEvaluated && chosenOption && (
          <div
            className={`rounded-xl p-5 border text-xs md:text-sm space-y-2 animate-in fade-in ${
              chosenOption.isCorrect
                ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800/80 text-emerald-950 dark:text-emerald-200'
                : 'bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-800/80 text-rose-950 dark:text-rose-200'
            }`}
          >
            <div className="flex items-center gap-2 font-bold">
              {chosenOption.isCorrect ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-[#1e5c00] dark:text-[#48c805]" />
                  <span>¡Decisión Correcta! (+{currentCase.xpReward} XP)</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                  <span>Decisión Errónea frente al Reglamento</span>
                </>
              )}
            </div>

            <p className="leading-relaxed">{chosenOption.explanation}</p>

            <div className="pt-2 text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <span>Fundamento Reglamentario:</span>
              <span className="underline">{chosenOption.legalArticle}</span>
            </div>
          </div>
        )}

        {/* Action Controls */}
        <div className="border-t border-slate-100 dark:border-slate-800 pt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {isAlreadySolved && (
              <span className="text-[#1e5c00] dark:text-[#48c805] font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Caso completado previamente
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {hasEvaluated ? (
              <>
                <button
                  onClick={handleRestartCase}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reintentar</span>
                </button>

                {activeCaseIndex < REAL_SENA_CASES.length - 1 ? (
                  <button
                    onClick={handleNextCase}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#39A900] hover:bg-[#2d8500] rounded-lg transition-colors shadow-sm"
                  >
                    <span>Siguiente Caso</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={onGoToQuiz}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#39A900] hover:bg-[#2d8500] rounded-lg transition-colors shadow-sm"
                  >
                    <span>Pasar a Evaluación Final</span>
                    <Award className="w-3.5 h-3.5" />
                  </button>
                )}
              </>
            ) : (
              <button
                disabled={!selectedOptionId}
                onClick={handleEvaluate}
                className={`px-5 py-2 text-xs font-semibold rounded-lg transition-all shadow-sm ${
                  selectedOptionId
                    ? 'bg-[#39A900] text-white hover:bg-[#2d8500]'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
                }`}
              >
                Emitir Dictamen Ético
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
