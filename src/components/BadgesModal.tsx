import React from 'react';
import { Badge } from '../data/senaRegulationData';
import {
  Sparkles,
  ShieldCheck,
  Award,
  Scale,
  Briefcase,
  GraduationCap,
  Lock,
  CheckCircle2,
  X,
} from 'lucide-react';

interface BadgesModalProps {
  isOpen: boolean;
  onClose: () => void;
  badges: Badge[];
  xp: number;
  level: number;
}

export const BadgesModal: React.FC<BadgesModalProps> = ({
  isOpen,
  onClose,
  badges,
  xp,
  level,
}) => {
  if (!isOpen) return null;

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-amber-500" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5 text-[#39A900]" />;
      case 'Award':
        return <Award className="w-5 h-5 text-indigo-500" />;
      case 'Scale':
        return <Scale className="w-5 h-5 text-emerald-600" />;
      case 'Briefcase':
        return <Briefcase className="w-5 h-5 text-blue-500" />;
      case 'GraduationCap':
        return <GraduationCap className="w-5 h-5 text-purple-600" />;
      default:
        return <Award className="w-5 h-5 text-slate-500" />;
    }
  };

  const unlockedCount = badges.filter((b) => b.unlocked).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl max-w-xl w-full p-6 space-y-5 animate-in fade-in transition-colors">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-mono">
              Gamificación SENA
            </span>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white font-display">
              Insignias y Nivel de Aprendiz
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Level and XP banner */}
        <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-4 border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between gap-4">
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 block">Rango Actual</span>
            <span className="text-sm font-bold text-slate-900 dark:text-white font-display">
              Nivel {level} · Aprendiz Destacado
            </span>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-500 dark:text-slate-400 block">Puntos Acumulados</span>
            <span className="text-sm font-bold text-[#1e5c00] dark:text-[#48c805] font-mono">
              {xp} XP
            </span>
          </div>
          <div className="text-right border-l border-slate-200 dark:border-slate-700 pl-4">
            <span className="text-xs text-slate-500 dark:text-slate-400 block">Insignias</span>
            <span className="text-sm font-bold text-slate-800 dark:text-slate-200 font-mono">
              {unlockedCount} / {badges.length}
            </span>
          </div>
        </div>

        {/* Badges Grid */}
        <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={`p-3.5 rounded-xl border transition-all flex items-start gap-3.5 ${
                badge.unlocked
                  ? 'bg-white dark:bg-slate-800/70 border-slate-200 dark:border-slate-700 shadow-xs'
                  : 'bg-slate-50/60 dark:bg-slate-900/60 border-slate-200/50 dark:border-slate-800 opacity-60'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                  badge.unlocked
                    ? 'bg-slate-100 dark:bg-slate-700/60'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600'
                }`}
              >
                {badge.unlocked ? renderIcon(badge.iconName) : <Lock className="w-4 h-4 text-slate-400 dark:text-slate-600" />}
              </div>

              <div className="flex-1 space-y-0.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white">{badge.name}</h3>
                  {badge.unlocked ? (
                    <span className="text-[11px] font-semibold text-[#1e5c00] dark:text-[#48c805] flex items-center gap-1 font-mono">
                      <CheckCircle2 className="w-3 h-3" /> Desbloqueada
                    </span>
                  ) : (
                    <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">Bloqueada</span>
                  )}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-snug">{badge.description}</p>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 block pt-0.5 font-mono">
                  Requisito: {badge.requirement}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-2 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#39A900] hover:bg-[#2d8500] rounded-lg shadow-sm"
          >
            Continuar Inducción
          </button>
        </div>
      </div>
    </div>
  );
};
