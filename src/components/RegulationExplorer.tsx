import React, { useState } from 'react';
import {
  SENA_CHAPTERS,
  SENA_REGULATION_ARTICLES,
  RegulationArticle,
} from '../data/senaRegulationData';
import {
  Search,
  CheckCircle,
  HelpCircle,
  AlertTriangle,
  Check,
  X,
  Sparkles,
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface RegulationExplorerProps {
  readArticleIds: string[];
  onMarkArticleRead: (id: string) => void;
  onGoToCases: () => void;
}

export const RegulationExplorer: React.FC<RegulationExplorerProps> = ({
  readArticleIds,
  onMarkArticleRead,
  onGoToCases,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeComparator, setActiveComparator] = useState<number | null>(null);

  // Filter articles
  const filteredArticles = SENA_REGULATION_ARTICLES.filter((article) => {
    const matchesCategory =
      selectedCategory === 'all' || article.category === selectedCategory;
    const matchesQuery =
      searchQuery.trim() === '' ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.articleNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesQuery;
  });

  const handleRead = (articleId: string) => {
    if (!readArticleIds.includes(articleId)) {
      sounds.playSuccess();
      onMarkArticleRead(articleId);
    }
  };

  // Everyday dilemmas for quick intuitive check
  const everydayDilemmas = [
    {
      question: '¿Puedo pedir que otro instructor revise mi calificación si no estoy de acuerdo?',
      verdict: 'PERMITIDO',
      isAllowed: true,
      norm: 'Art. 5, Numerales de Evaluación',
      detail: 'Tienes derecho a solicitar revisión objetiva por escrito. Si subsiste el desacuerdo, la Coordinación Académica y Subdirección designarán un segundo evaluador idóneo.',
    },
    {
      question: '¿Puedo prestarle mi carné o mi usuario de Zajuna a un compañero?',
      verdict: 'PROHIBIDO Y SANCIONABLE',
      isAllowed: false,
      norm: 'Capítulo III (Prohibición Expresa)',
      detail: 'El carné y las credenciales virtuales son estrictamente personales e intransferibles. Facilitarlos para suplantación de identidad constituye falta disciplinaria gravísima.',
    },
    {
      question: '¿Puedo trabajar con contrato laboral y homologarlo como Etapa Productiva?',
      verdict: 'PERMITIDO',
      isAllowed: true,
      norm: 'Capítulo IV (Alternativas de Etapa Productiva)',
      detail: 'Es una de las alternativas reguladas de Etapa Productiva, siempre que las funciones laborales estén directamente relacionadas con el perfil ocupacional del programa.',
    },
    {
      question: '¿Puede un instructor expulsarme del SENA de manera verbal e inmediata?',
      verdict: 'NO ES VÁLIDO (VIOLA EL DEBIDO PROCESO)',
      isAllowed: false,
      norm: 'Capítulo V (Garantías del Debido Proceso)',
      detail: 'Toda cancelación de matrícula requiere trámite previo ante el Comité de Evaluación y Seguimiento, notificación formal, descargos (5 días hábiles) y resolución motivada del Subdirector de Centro.',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header and summary */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>Marco Normativo Vigente</span>
            <span aria-hidden="true">·</span>
            <span>Acuerdo 0009 de 2024 (D.O. 52.947)</span>
            <span aria-hidden="true">·</span>
            <span>Dirección General SENA</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Explorador del Reglamento del Aprendiz
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-sm mt-1 max-w-2xl">
            Conoce tus derechos como futuro egresado SENA, tus deberes para una convivencia armónica y
            las alternativas para culminar con éxito tus etapas lectiva y productiva.
          </p>
        </div>

        {/* Reading progress banner */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 shrink-0 shadow-sm transition-colors">
          <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between gap-4 mb-1">
            <span>Progreso de Lectura</span>
            <span className="font-semibold text-slate-900 dark:text-white font-mono">
              {readArticleIds.length} / {SENA_REGULATION_ARTICLES.length} (+{readArticleIds.length * 50} XP)
            </span>
          </div>
          <div className="w-48 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#39A900] transition-all duration-300"
              style={{
                width: `${(readArticleIds.length / SENA_REGULATION_ARTICLES.length) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Interactive Filter and Search Deck */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm space-y-4 transition-colors">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por artículo, derecho, deber, 'plagio', 'contrato', 'comité'..."
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:bg-white dark:focus:bg-slate-800 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                Limpiar
              </button>
            )}
          </div>
        </div>

        {/* Segmented controls / Filter buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {SENA_CHAPTERS.map((chap) => (
            <button
              key={chap.id}
              onClick={() => setSelectedCategory(chap.id)}
              className={`px-3 py-1.5 font-medium rounded-lg whitespace-nowrap transition-colors shrink-0 ${
                selectedCategory === chap.id
                  ? 'bg-[#39A900] text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {chap.name}
            </button>
          ))}
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredArticles.map((article) => {
          const isRead = readArticleIds.includes(article.id);
          return (
            <div
              key={article.id}
              className={`bg-white dark:bg-slate-900 rounded-xl border p-5 transition-all flex flex-col justify-between ${
                isRead
                  ? 'border-[#39A900]/40 dark:border-[#39A900]/50 shadow-xs'
                  : 'border-slate-200 dark:border-slate-800 shadow-sm'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-semibold text-slate-700 dark:text-slate-200 font-mono">
                    {article.articleNumber}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="truncate">{article.chapter}</span>
                  {isRead && (
                    <span className="text-[#1e5c00] dark:text-[#48c805] font-semibold text-[11px] inline-flex items-center gap-1">
                      <Check className="w-3 h-3" /> Leído
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                  {article.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                  {article.summary}
                </p>

                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {article.fullText}
                </p>

                <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px] text-slate-400">
                  {article.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded text-[11px]"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400 dark:text-slate-500">
                  {isRead ? 'Artículo comprendido (+50 XP)' : 'Marca al terminar de leer'}
                </span>
                <button
                  onClick={() => handleRead(article.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    isRead
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 cursor-default'
                      : 'bg-[#39A900] text-white hover:bg-[#2d8500]'
                  }`}
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>{isRead ? 'Completado' : 'Marcar Leído (+50 XP)'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredArticles.length === 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-8 text-center">
          <HelpCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <h3 className="text-sm font-semibold text-slate-800 dark:text-white">No se encontraron artículos</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Intenta con otra palabra clave como "derechos", "falta", "contrato" o limpia el filtro.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="mt-3 px-3 py-1.5 text-xs font-medium text-[#1e5c00] dark:text-[#48c805] bg-[#39A900]/10 rounded-lg hover:bg-[#39A900]/20"
          >
            Restablecer búsqueda
          </button>
        </div>
      )}

      {/* Interactive Section: ¿Permitido o Sancionado? */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4 transition-colors">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
              <span>Laboratorio Rápido</span>
              <span aria-hidden="true">·</span>
              <span>Dudas Frecuentes</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white font-display">
              ¿Está Permitido o Sancionado en el SENA?
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
              Haz clic en cualquiera de las situaciones comunes para comprobar el fundamento legal del reglamento.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {everydayDilemmas.map((dilemma, idx) => {
            const isOpen = activeComparator === idx;
            return (
              <div
                key={idx}
                onClick={() => setActiveComparator(isOpen ? null : idx)}
                className="cursor-pointer bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100/80 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-xl p-4 transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block font-mono">
                      Situación 0{idx + 1}
                    </span>
                    <h3 className="text-xs md:text-sm font-semibold text-slate-900 dark:text-white">
                      {dilemma.question}
                    </h3>
                  </div>
                  <div className="shrink-0 mt-0.5">
                    {dilemma.isAllowed ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#1e5c00] dark:text-emerald-400 bg-emerald-100/70 dark:bg-emerald-950/60 px-2 py-0.5 rounded">
                        <Check className="w-3 h-3" /> Válido
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-700 dark:text-rose-400 bg-rose-100/70 dark:bg-rose-950/60 px-2 py-0.5 rounded">
                        <X className="w-3 h-3" /> No permitido
                      </span>
                    )}
                  </div>
                </div>

                {isOpen && (
                  <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 space-y-1 animate-in fade-in">
                    <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span>Fundamento:</span>
                      <span className="text-[#1e5c00] dark:text-[#48c805] font-mono">{dilemma.norm}</span>
                    </div>
                    <p className="leading-relaxed">{dilemma.detail}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Next step prompt banner */}
      <div className="bg-[#39A900]/10 dark:bg-[#39A900]/15 border border-[#39A900]/30 dark:border-[#39A900]/40 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#39A900] text-white flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              ¿Listo para aplicar lo aprendido en casos de la vida real?
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Ingresa al Tribunal Ético de Casos SENA y resuelve dilemas auténticos de aprendices para ganar XP e insignias.
            </p>
          </div>
        </div>
        <button
          onClick={onGoToCases}
          className="px-4 py-2 text-xs font-semibold text-white bg-[#39A900] hover:bg-[#2d8500] rounded-lg transition-colors whitespace-nowrap shadow-sm"
        >
          Ir al Tribunal de Casos
        </button>
      </div>
    </div>
  );
};
