import React, { useState } from 'react';
import { INDUCTION_QUIZ_QUESTIONS, QuizQuestion } from '../data/senaRegulationData';
import {
  CheckCircle2,
  AlertCircle,
  Award,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Flame,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/soundEffects';

interface InductionQuizProps {
  onQuizCompleted: (scorePercentage: number) => void;
  onGoToCertificate: () => void;
  bestScore: number;
}

export const InductionQuiz: React.FC<InductionQuizProps> = ({
  onQuizCompleted,
  onGoToCertificate,
  bestScore,
}) => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);

  const currentQ: QuizQuestion = INDUCTION_QUIZ_QUESTIONS[currentIdx];

  const handleSelect = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    const isCorrect = idx === currentQ.correctIndex;
    if (isCorrect) {
      sounds.playSuccess();
      setCorrectAnswersCount((prev) => prev + 1);
      setStreak((prev) => prev + 1);
    } else {
      sounds.playError();
      setStreak(0);
    }
  };

  const handleNext = () => {
    if (currentIdx < INDUCTION_QUIZ_QUESTIONS.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      // Quiz completed!
      const totalScore = Math.round(
        (correctAnswersCount / INDUCTION_QUIZ_QUESTIONS.length) * 100
      );
      setQuizFinished(true);
      onQuizCompleted(totalScore);

      if (totalScore >= 80) {
        sounds.playLevelUp();
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#39A900', '#ffd700', '#00324D', '#ffffff'],
        });
      }
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setCorrectAnswersCount(0);
    setStreak(0);
    setQuizFinished(false);
  };

  const currentScorePercentage = Math.round(
    (correctAnswersCount / INDUCTION_QUIZ_QUESTIONS.length) * 100
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>Evaluación Oficial de Inducción</span>
            <span aria-hidden="true">·</span>
            <span>Mínimo 80% para Aprobar</span>
            <span aria-hidden="true">·</span>
            <span>Acuerdo 0009 de 2024 (Vigente)</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Desafío Gamificado del Reglamento SENA
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-sm mt-1 max-w-2xl">
            Demuestra tu dominio sobre los derechos, deberes, etapas formativas y debido proceso.
            Al alcanzar 80% o más, se desbloqueará automáticamente la emisión de tu certificado institucional.
          </p>
        </div>

        {/* Streak & Best Score tracker */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 shrink-0 shadow-sm flex items-center gap-4 transition-colors">
          <div>
            <span className="block text-[11px] text-slate-500 dark:text-slate-400">Racha Actual</span>
            <span className="font-semibold text-amber-600 dark:text-amber-400 font-mono text-sm flex items-center gap-1">
              <Flame className="w-4 h-4 fill-amber-500 text-amber-500" /> {streak}
            </span>
          </div>
          <div className="border-l border-slate-200 dark:border-slate-800 pl-4">
            <span className="block text-[11px] text-slate-500 dark:text-slate-400">Mejor Puntaje</span>
            <span className="font-semibold text-slate-900 dark:text-white font-mono text-sm">
              {bestScore}%
            </span>
          </div>
        </div>
      </div>

      {quizFinished ? (
        /* Results Card */
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm text-center max-w-2xl mx-auto space-y-6 transition-colors">
          <div
            className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center shadow-inner ${
              currentScorePercentage >= 80
                ? 'bg-emerald-100 dark:bg-emerald-950/70 text-[#1e5c00] dark:text-[#48c805]'
                : 'bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300'
            }`}
          >
            {currentScorePercentage >= 80 ? (
              <Award className="w-10 h-10" />
            ) : (
              <AlertCircle className="w-10 h-10" />
            )}
          </div>

          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono">
              Resultado de la Evaluación
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white font-display">
              {currentScorePercentage}% de Acierto
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Respondiste correctamente {correctAnswersCount} de {INDUCTION_QUIZ_QUESTIONS.length}{' '}
              preguntas.
            </p>
          </div>

          {currentScorePercentage >= 80 ? (
            <div className="bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 rounded-xl p-5 text-sm space-y-2">
              <p className="font-bold flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4 text-[#1e5c00] dark:text-[#48c805]" />
                ¡Felicitaciones! Has superado con honores la Inducción SENA
              </p>
              <p className="text-xs text-emerald-800 dark:text-emerald-300">
                Tu certificado oficial digital ha sido generado y se encuentra disponible para su
                descarga e impresión inmediata con código único de verificación.
              </p>
            </div>
          ) : (
            <div className="bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 rounded-xl p-5 text-sm space-y-2">
              <p className="font-bold">
                Puntaje insuficiente para certificar (Requerido: 80%)
              </p>
              <p className="text-xs text-amber-800 dark:text-amber-300">
                Repasa los artículos de Derechos y Deberes en el Explorador o vuelve a intentar la
                evaluación para alcanzar el umbral requerido.
              </p>
            </div>
          )}

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={handleRestart}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Intentar de Nuevo</span>
            </button>

            {currentScorePercentage >= 80 && (
              <button
                onClick={onGoToCertificate}
                className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-[#39A900] hover:bg-[#2d8500] rounded-lg transition-colors shadow-sm"
              >
                <span>Generar Certificado Oficial</span>
                <Award className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Quiz Active Card */
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-sm space-y-6 transition-colors">
          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span className="font-semibold text-slate-700 dark:text-slate-200">
                Pregunta {currentIdx + 1} de {INDUCTION_QUIZ_QUESTIONS.length}
              </span>
              <span className="font-mono text-slate-600 dark:text-slate-400">
                Categoría: {currentQ.category}
              </span>
            </div>
            <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#39A900] transition-all duration-300"
                style={{
                  width: `${((currentIdx + 1) / INDUCTION_QUIZ_QUESTIONS.length) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Question text */}
          <div>
            <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white leading-snug">
              {currentQ.question}
            </h2>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {currentQ.options.map((option, optIdx) => {
              const isSelected = selectedOption === optIdx;
              const isCorrect = optIdx === currentQ.correctIndex;

              let btnStyle =
                'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-800/50 text-slate-800 dark:text-slate-200';

              if (isAnswered) {
                if (isCorrect) {
                  btnStyle =
                    'border-[#39A900] bg-emerald-50 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200 font-medium';
                } else if (isSelected && !isCorrect) {
                  btnStyle =
                    'border-rose-300 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/40 text-rose-950 dark:text-rose-200';
                } else {
                  btnStyle =
                    'border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/40 text-slate-400 dark:text-slate-600 opacity-60';
                }
              }

              return (
                <button
                  key={optIdx}
                  disabled={isAnswered}
                  onClick={() => handleSelect(optIdx)}
                  className={`w-full text-left p-4 rounded-xl border transition-all text-xs md:text-sm flex items-start gap-3 ${btnStyle}`}
                >
                  <div
                    className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 mt-0.5 text-xs font-semibold ${
                      isSelected
                        ? 'border-[#39A900] bg-[#39A900] text-white'
                        : 'border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {isAnswered && isCorrect ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                    ) : (
                      String.fromCharCode(65 + optIdx)
                    )}
                  </div>
                  <span className="leading-relaxed flex-1">{option}</span>
                </button>
              );
            })}
          </div>

          {/* Explanation Callout */}
          {isAnswered && (
            <div
              className={`p-4 rounded-xl border text-xs md:text-sm space-y-2 animate-in fade-in ${
                selectedOption === currentQ.correctIndex
                  ? 'bg-emerald-50/70 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200'
                  : 'bg-rose-50/70 dark:bg-rose-950/50 border-rose-200 dark:border-rose-800 text-rose-950 dark:text-rose-200'
              }`}
            >
              <div className="flex items-center gap-2 font-bold">
                {selectedOption === currentQ.correctIndex ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-[#1e5c00] dark:text-[#48c805]" />
                    <span>¡Respuesta Correcta! (+50 XP)</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                    <span>Respuesta Incorrecta</span>
                  </>
                )}
              </div>
              <p className="leading-relaxed">{currentQ.explanation}</p>
              <div className="pt-1 text-xs font-mono font-semibold text-slate-600 dark:text-slate-400">
                <span>Norma: </span>
                <span className="underline">{currentQ.articleReference}</span>
              </div>
            </div>
          )}

          {/* Next Button */}
          <div className="flex items-center justify-end pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              disabled={!isAnswered}
              onClick={handleNext}
              className={`inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold rounded-lg transition-all shadow-sm ${
                isAnswered
                  ? 'bg-[#39A900] text-white hover:bg-[#2d8500]'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
              }`}
            >
              <span>
                {currentIdx < INDUCTION_QUIZ_QUESTIONS.length - 1
                  ? 'Siguiente Pregunta'
                  : 'Finalizar y Calificar'}
              </span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
