import React from 'react';
import { BookOpen, Shield, Scale, Award, CheckCircle2, ArrowRight, ExternalLink } from 'lucide-react';

interface PlanViewProps {
  onStartLearning: () => void;
  onGoToCases: () => void;
  onGoToQuiz: () => void;
}

export const PlanView: React.FC<PlanViewProps> = ({
  onStartLearning,
  onGoToCases,
  onGoToQuiz,
}) => {
  const phases = [
    {
      phaseNumber: 'Fase 01',
      title: 'Contextualización e Identidad Institucional',
      summary: 'Apropiación de la cultura organizacional SENA, misión formadora, valores éticos y el concepto de Formación Profesional Integral (FPI).',
      objective: 'Comprender el rol del SENA como motor de desarrollo productivo y social en Colombia y los compromisos de ingreso del aprendiz.',
      deliverables: [
        'Exploración de la estructura organizativa del SENA y Centros de Formación.',
        'Reconocimiento de los canales virtuales institucionales: SofiaPlus y Zajuna.',
        'Diagnóstico inicial de expectativas y perfil del egresado.',
      ],
      legalBase: 'Ley 119 de 1994 y Proyecto Educativo Institucional (PEI).',
      actionLabel: 'Explorar Reglamento',
      actionFn: onStartLearning,
      icon: BookOpen,
      status: 'Fundacional',
    },
    {
      phaseNumber: 'Fase 02',
      title: 'Apropiación Normativa: Derechos, Deberes y Prohibiciones',
      summary: 'Estudio sistemático del Reglamento del Aprendiz vigente (Acuerdo 0009 de 2024, Diario Oficial No. 52.947) con enfoque preventivo y formativo.',
      objective: 'Identificar claramente las garantías académicas y disciplinarias, las responsabilidades de SST, y las conductas catalogadas como falta.',
      deliverables: [
        'Análisis del Artículo 5: Catálogo de 24 derechos del aprendiz (inducción, infraestructura, dotación EPP, bienestar y debido proceso).',
        'Análisis del Capítulo III: Deberes éticos de integridad académica, asistencia, netiqueta y cuidado de recursos.',
        'Análisis del Capítulo III: Prohibiciones expresas (suplantación en Zajuna, plagio con IA, sustancias psicoactivas y ciberacoso).',
        'Alternativas válidas de Etapa Productiva y causales de deserción (Capítulo IV).',
      ],
      legalBase: 'Acuerdo 0009 de 2024 (Capítulos I, II, III, IV y V).',
      actionLabel: 'Ver Artículos Esenciales',
      actionFn: onStartLearning,
      icon: Shield,
      status: 'Normativa',
    },
    {
      phaseNumber: 'Fase 03',
      title: 'Simulación Práctica: Tribunal Ético de Casos Reales',
      summary: 'Metodología gamificada basada en dilemas auténticos de convivencia, propiedad intelectual, seguridad en talleres y evaluación.',
      objective: 'Desarrollar criterio reflexivo para la toma de decisiones éticas frente a situaciones complejas que afronta el aprendiz en su vida cotidiana.',
      deliverables: [
        'Resolución guiada de casos hipotéticos inspirados en expedientes de comités SENA.',
        'Retroalimentación inmediata con cita al artículo legal del Acuerdo 0009 de 2024.',
        'Obtención de insignias temáticas por resolución acertada.',
      ],
      legalBase: 'Comité de Evaluación y Seguimiento (Capítulo V del Acuerdo 0009 de 2024).',
      actionLabel: 'Ir al Tribunal de Casos',
      actionFn: onGoToCases,
      icon: Scale,
      status: 'Práctica Gamificada',
    },
    {
      phaseNumber: 'Fase 04',
      title: 'Evaluación Formativa Gamificada de Competencias',
      summary: 'Cuestionario interactivo contrarreloj que evalúa la retención de conceptos clave con retroalimentación correctiva instantánea.',
      objective: 'Comprobar el dominio de los derechos, deberes, etapas formativas y debido proceso alcanzando un puntaje mínimo aprobatorio del 80%.',
      deliverables: [
        'Batería de 10 preguntas estratégicas multitemáticas.',
        'Cálculo automático de efectividad, puntos de experiencia (XP) y nivel alcanzado.',
        'Habilitación del candado de certificación para aprendices que superen el umbral.',
      ],
      legalBase: 'Criterios de Evaluación y Calificación del SENA.',
      actionLabel: 'Presentar Evaluación',
      actionFn: onGoToQuiz,
      icon: CheckCircle2,
      status: 'Evaluación',
    },
    {
      phaseNumber: 'Fase 05',
      title: 'Emisión, Verificación y Certificación Digital',
      summary: 'Generación automatizada de la constancia oficial de inducción con datos personalizados, hash criptográfico y QR de validación.',
      objective: 'Acreditar formalmente la culminación satisfactoria de la inducción para el expediente de la ficha y la coordinación académica.',
      deliverables: [
        'Certificado institucional tamaño carta imprimible en alta resolución.',
        'Código alfanumérico único para auditoría y validación en tiempo real.',
        'Sello dorado institucional y registro digital de aprobación.',
      ],
      legalBase: 'Constancia de Inducción para Etapa Lectiva en SofiaPlus.',
      actionLabel: 'Ver Modelo de Certificado',
      actionFn: onGoToQuiz,
      icon: Award,
      status: 'Certificación Oficial',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Intro hero banner */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-sm transition-colors">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-2">
            <span>SENA Dirección General</span>
            <span aria-hidden="true">·</span>
            <span>Plan Estratégico de Inducción</span>
            <span aria-hidden="true">·</span>
            <span>Versión 2026</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight mb-3">
            Plan Estructurado de Inducción y Apropiación del Reglamento
          </h1>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm md:text-base">
            Este plan metodológico transforma la inducción tradicional en una experiencia formativa
            dinámica, pedagógica y gamificada. Conoce tus derechos, cumple tus deberes y certifícate
            oficialmente para dar inicio exitoso a tu formación profesional integral.
          </p>
        </div>

        {/* Quick metrics strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 text-sm">
          <div>
            <span className="block text-xs text-slate-500 dark:text-slate-400">Duración Estimada</span>
            <span className="font-semibold text-slate-900 dark:text-white font-mono">4 Horas Pedagógicas</span>
          </div>
          <div>
            <span className="block text-xs text-slate-500 dark:text-slate-400">Marco Legal</span>
            <span className="font-semibold text-slate-900 dark:text-white font-mono">Acuerdo 0009 de 2024</span>
          </div>
          <div>
            <span className="block text-xs text-slate-500 dark:text-slate-400">Umbral de Aprobación</span>
            <span className="font-semibold text-[#1e5c00] dark:text-[#48c805] font-mono">80% en Evaluación</span>
          </div>
          <div>
            <span className="block text-xs text-slate-500 dark:text-slate-400">Acreditación</span>
            <span className="font-semibold text-slate-900 dark:text-white font-mono">Certificado con Hash QR</span>
          </div>
        </div>
      </div>

      {/* 5-Phase Roadmap */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white font-display">
            Fases Metodológicas de la Inducción
          </h2>
          <span className="text-xs text-slate-500 dark:text-slate-400">5 etapas secuenciales de aprendizaje</span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {phases.map((phase, idx) => {
            const Icon = phase.icon;
            return (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 md:p-6 hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-sm"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[#39A900]/10 dark:bg-[#39A900]/20 flex items-center justify-center shrink-0 mt-0.5">
                      <Icon className="w-5 h-5 text-[#1e5c00] dark:text-[#48c805]" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <span className="font-semibold text-[#1e5c00] dark:text-[#48c805] font-mono">{phase.phaseNumber}</span>
                        <span aria-hidden="true">·</span>
                        <span>{phase.status}</span>
                        <span aria-hidden="true">·</span>
                        <span className="italic">{phase.legalBase}</span>
                      </div>
                      <h3 className="text-base md:text-lg font-semibold text-slate-900 dark:text-white">
                        {phase.title}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed max-w-3xl">
                        {phase.summary}
                      </p>

                      <div className="pt-2">
                        <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-1.5">
                          Actividades y Entregables Clave:
                        </h4>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-1.5 text-xs text-slate-600 dark:text-slate-300">
                          {phase.deliverables.map((item, dIdx) => (
                            <li key={dIdx} className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#39A900] mt-1.5 shrink-0" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center md:flex-col justify-end gap-2 pt-2 md:pt-0">
                    <button
                      onClick={phase.actionFn}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-[#39A900] hover:bg-[#2d8500] rounded-lg transition-colors whitespace-nowrap"
                    >
                      <span>{phase.actionLabel}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Official SENA information banner */}
      <div className="bg-slate-100 dark:bg-slate-900/60 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
          Glosario Esencial del Aprendiz SENA
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs text-slate-600 dark:text-slate-300">
          <div className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-200/60 dark:border-slate-700/60">
            <span className="font-semibold text-slate-900 dark:text-white block mb-1">SofiaPlus / Zajuna</span>
            <span>Plataformas oficiales para registro académico, LMS de evidencias y trámites.</span>
          </div>
          <div className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-200/60 dark:border-slate-700/60">
            <span className="font-semibold text-slate-900 dark:text-white block mb-1">FPI</span>
            <span>Formación Profesional Integral: desarrollo armónico de dimensiones técnicas, humanas y sociales.</span>
          </div>
          <div className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-200/60 dark:border-slate-700/60">
            <span className="font-semibold text-slate-900 dark:text-white block mb-1">Contrato de Aprendizaje</span>
            <span>Modalidad legal especial patrocinada por empresas con apoyo económico y ARL/EPS.</span>
          </div>
          <div className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-200/60 dark:border-slate-700/60">
            <span className="font-semibold text-slate-900 dark:text-white block mb-1">Comité de Seguimiento</span>
            <span>Órgano colegiado del Centro que asesora al Subdirector en procesos disciplinarios.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
