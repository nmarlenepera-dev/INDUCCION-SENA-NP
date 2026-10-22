import React, { useState, useEffect } from 'react';
import {
  Printer,
  Edit3,
  CheckCircle2,
  Copy,
  Check,
  ShieldCheck,
  Award,
  Share2,
  FileSpreadsheet,
} from 'lucide-react';
import { POPULAR_SENA_PROGRAMS, SENA_REGIONALES, SENA_LOGO_SVG } from '../data/senaRegulationData';
import { triggerBackgroundSync } from '../services/backgroundSyncService';
import { isRecordAlreadySynced } from '../services/offlineSyncQueue';

// Generated high fidelity image assets
const SEAL_IMG = '/src/assets/images/sena_certificate_seal_1792526594205.jpg';
const BADGE_IMG = '/src/assets/images/badge_sena_insignia_1792526594489.jpg';

export interface ApprenticeData {
  fullName: string;
  documentType: string;
  documentNumber: string;
  program: string;
  fichaNumber: string;
  regional: string;
  completionDate: string;
  verificationCode: string;
}

interface CertificateViewProps {
  apprentice: ApprenticeData;
  setApprentice: React.Dispatch<React.SetStateAction<ApprenticeData>>;
  score: number;
  certificateUnlocked: boolean;
  onGoToQuiz: () => void;
  onOpenSheetsSync?: () => void;
}

export const CertificateView: React.FC<CertificateViewProps> = ({
  apprentice,
  setApprentice,
  score,
  certificateUnlocked,
  onGoToQuiz,
  onOpenSheetsSync,
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [showVerifyModal, setShowVerifyModal] = useState<boolean>(false);

  // Form edit state
  const [tempData, setTempData] = useState<ApprenticeData>(apprentice);
  const isSynced = isRecordAlreadySynced(apprentice, score);

  // Automatically sync to Google Sheets in background when certificate is unlocked
  useEffect(() => {
    if (certificateUnlocked && score >= 80) {
      triggerBackgroundSync(apprentice, score);
    }
  }, [certificateUnlocked, score, apprentice]);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(apprentice.verificationCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveData = (e: React.FormEvent) => {
    e.preventDefault();
    setApprentice(tempData);
    setIsEditing(false);
    triggerBackgroundSync(tempData, score);
  };

  if (!certificateUnlocked) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm text-center max-w-xl mx-auto space-y-4 transition-colors">
        <div className="w-16 h-16 rounded-full bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-400 flex items-center justify-center mx-auto">
          <Award className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white font-display">
          Certificado Aún Bloqueado
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          Para expedir tu certificado institucional de inducción, debes completar la Evaluación del
          Reglamento SENA con una calificación igual o superior al <strong className="text-slate-900 dark:text-white">80%</strong>.
        </p>
        <div className="pt-2">
          <button
            onClick={onGoToQuiz}
            className="px-5 py-2.5 text-xs font-bold text-white bg-[#39A900] hover:bg-[#2d8500] rounded-lg transition-colors shadow-sm"
          >
            Presentar Evaluación Ahora
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top action toolbar (Hidden when printing) */}
      <div className="no-print bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/70 text-[#1e5c00] dark:text-[#48c805] flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Certificado Institucional Aprobado
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Acreditación oficial de cumplimiento de la Inducción al Reglamento del Aprendiz SENA.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onOpenSheetsSync && (
            <button
              onClick={onOpenSheetsSync}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-300 dark:border-emerald-800 rounded-lg transition-colors shadow-xs"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-[#39A900] dark:text-[#48c805]" />
              <span>{isSynced ? 'Registro Sincronizado en Drive' : 'Google Sheets & Drive'}</span>
              {isSynced && <CheckCircle2 className="w-3 h-3 text-[#39A900] dark:text-[#48c805]" />}
            </button>
          )}

          <button
            onClick={() => {
              setTempData(apprentice);
              setIsEditing(true);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Personalizar Datos</span>
          </button>

          <button
            onClick={() => setShowVerifyModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#39A900] dark:text-[#48c805]" />
            <span>Verificar Código</span>
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#39A900] hover:bg-[#2d8500] rounded-lg transition-colors shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimir / Guardar en PDF</span>
          </button>
        </div>
      </div>

      {/* Edit Form Modal */}
      {isEditing && (
        <div className="no-print fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl max-w-lg w-full p-6 space-y-4 transition-colors">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">
                Personalizar Datos del Certificado
              </h3>
              <button
                onClick={() => setIsEditing(false)}
                className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                Cerrar
              </button>
            </div>

            <form onSubmit={handleSaveData} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nombre Completo del Aprendiz
                </label>
                <input
                  type="text"
                  required
                  value={tempData.fullName}
                  onChange={(e) =>
                    setTempData({ ...tempData, fullName: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#39A900]"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Tipo Doc.
                  </label>
                  <select
                    value={tempData.documentType}
                    onChange={(e) =>
                      setTempData({ ...tempData, documentType: e.target.value })
                    }
                    className="w-full px-2 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#39A900]"
                  >
                    <option value="C.C.">C.C.</option>
                    <option value="T.I.">T.I.</option>
                    <option value="C.E.">C.E.</option>
                    <option value="P.P.T.">P.P.T.</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Número de Documento
                  </label>
                  <input
                    type="text"
                    required
                    value={tempData.documentNumber}
                    onChange={(e) =>
                      setTempData({ ...tempData, documentNumber: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#39A900]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Programa de Formación
                </label>
                <select
                  value={tempData.program}
                  onChange={(e) =>
                    setTempData({ ...tempData, program: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#39A900]"
                >
                  {POPULAR_SENA_PROGRAMS.map((prog, idx) => (
                    <option key={idx} value={prog}>
                      {prog}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Número de Ficha
                  </label>
                  <input
                    type="text"
                    required
                    value={tempData.fichaNumber}
                    onChange={(e) =>
                      setTempData({ ...tempData, fichaNumber: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#39A900]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Fecha de Culminación
                  </label>
                  <input
                    type="date"
                    required
                    value={tempData.completionDate}
                    onChange={(e) =>
                      setTempData({ ...tempData, completionDate: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#39A900]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Regional y Centro de Formación
                </label>
                <select
                  value={tempData.regional}
                  onChange={(e) =>
                    setTempData({ ...tempData, regional: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#39A900]"
                >
                  {SENA_REGIONALES.map((reg, idx) => (
                    <option key={idx} value={reg}>
                      {reg}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-[#39A900] hover:bg-[#2d8500] rounded-lg"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Online Verification Dialog */}
      {showVerifyModal && (
        <div className="no-print fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl max-w-md w-full p-6 space-y-4 transition-colors">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-display flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#39A900] dark:text-[#48c805]" />
                Verificación de Autenticidad
              </h3>
              <button
                onClick={() => setShowVerifyModal(false)}
                className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                Cerrar
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
              <div className="bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 p-3 rounded-lg text-emerald-950 dark:text-emerald-200 space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-[#1e5c00] dark:text-[#48c805]" />
                  <span>Certificado Válido y Registrado</span>
                </div>
                <p className="text-[11px] text-emerald-800 dark:text-emerald-300">
                  Emitido por el Sistema Institucional de Inducción SENA con fundamento en el
                  Acuerdo 007 de 2012.
                </p>
              </div>

              <div>
                <span className="block text-[11px] text-slate-400 dark:text-slate-500">Código de Verificación</span>
                <div className="flex items-center gap-2 mt-1">
                  <code className="bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded font-mono text-xs text-slate-800 dark:text-slate-200 select-all flex-1">
                    {apprentice.verificationCode}
                  </code>
                  <button
                    onClick={handleCopyCode}
                    className="p-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded transition-colors"
                    title="Copiar código"
                  >
                    {copied ? <Check className="w-4 h-4 text-[#39A900] dark:text-[#48c805]" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800 pt-2 space-y-1">
                <p>
                  <strong className="text-slate-800 dark:text-slate-200">Aprendiz:</strong> {apprentice.fullName}
                </p>
                <p>
                  <strong className="text-slate-800 dark:text-slate-200">Documento:</strong> {apprentice.documentType} {apprentice.documentNumber}
                </p>
                <p>
                  <strong className="text-slate-800 dark:text-slate-200">Ficha:</strong> {apprentice.fichaNumber}
                </p>
                <p>
                  <strong className="text-slate-800 dark:text-slate-200">Calificación de Inducción:</strong> {score}% (Aprobado)
                </p>
              </div>
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setShowVerifyModal(false)}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 rounded-lg"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Official SENA Certificate Area */}
      <div
        id="sena-official-certificate"
        className="bg-white dark:bg-slate-950 border-8 border-double border-[#39A900] rounded-xl p-8 md:p-12 shadow-md relative overflow-hidden select-none max-w-5xl mx-auto transition-colors"
        style={{
          backgroundImage:
            'radial-gradient(circle at 50% 50%, rgba(57, 169, 0, 0.04) 0%, rgba(255, 255, 255, 0.95) 75%)',
        }}
      >
        {/* Intricate Inner Guilloche Border */}
        <div className="border border-[#b8860b]/40 dark:border-[#b8860b]/50 p-6 md:p-8 rounded-lg relative">
          {/* Corner ornaments */}
          <div className="absolute top-2 left-2 text-[#39A900] dark:text-[#48c805] font-serif-cert text-xs opacity-60">❖</div>
          <div className="absolute top-2 right-2 text-[#39A900] dark:text-[#48c805] font-serif-cert text-xs opacity-60">❖</div>
          <div className="absolute bottom-2 left-2 text-[#39A900] dark:text-[#48c805] font-serif-cert text-xs opacity-60">❖</div>
          <div className="absolute bottom-2 right-2 text-[#39A900] dark:text-[#48c805] font-serif-cert text-xs opacity-60">❖</div>

          {/* Certificate Header */}
          <div className="text-center space-y-2 mb-8">
            <div className="flex items-center justify-center gap-3 mb-2">
              <img
                src={SENA_LOGO_SVG}
                alt="Escudo Institucional SENA"
                className="w-14 h-14 object-contain"
              />
            </div>
            <p className="text-xs font-bold tracking-[0.25em] text-slate-600 dark:text-slate-400 uppercase font-serif-cert">
              República de Colombia
            </p>
            <h1 className="text-xl md:text-2xl font-extrabold tracking-wide text-[#1e5c00] dark:text-[#48c805] uppercase font-serif-cert">
              Servicio Nacional de Aprendizaje — SENA
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Dirección General · Dirección de Formación Profesional Integral
            </p>
            <div className="w-24 h-0.5 bg-[#b8860b] mx-auto mt-2" />
          </div>

          {/* Certificate Body Text */}
          <div className="text-center space-y-6 max-w-3xl mx-auto my-6">
            <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 italic">
              El Centro de Formación y la Coordinación Académica certifican que:
            </p>

            {/* Apprentice Name in prominent luxury script / display typography */}
            <div className="py-2 border-b-2 border-slate-200/80 dark:border-slate-800 inline-block px-8 max-w-full">
              <h2 className="text-2xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight font-serif-cert uppercase">
                {apprentice.fullName}
              </h2>
            </div>

            <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300">
              Identificado(a) con documento de identidad No.{' '}
              <strong className="text-slate-900 dark:text-white font-mono">
                {apprentice.documentType} {apprentice.documentNumber}
              </strong>
              , cursando el programa de formación profesional:
            </p>

            <div className="bg-slate-50/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-800 rounded-lg p-3 inline-block">
              <h3 className="text-sm md:text-base font-bold text-slate-800 dark:text-white">
                {apprentice.program}
              </h3>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono block mt-0.5">
                Número de Ficha: {apprentice.fichaNumber}
              </span>
            </div>

            <p className="text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
              Ha culminado y aprobado satisfactoriamente el{' '}
              <strong className="text-[#1e5c00] dark:text-[#48c805]">
                Programa Oficial de Inducción al Reglamento del Aprendiz SENA (Acuerdo 0009 de 2024 — Diario Oficial No. 52.947)
              </strong>
              , demostrando apropiación cabal de sus derechos fundamentales, deberes éticos, normatividad de
              Seguridad y Salud en el Trabajo (SST), alternativas de Etapa Productiva y debido proceso.
            </p>

            <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center gap-4 pt-1 font-mono">
              <span>Calificación Obtenida: <strong className="text-emerald-700 dark:text-emerald-400">{score}%</strong></span>
              <span>·</span>
              <span>Estado: <strong className="text-emerald-700 dark:text-emerald-400">COMPLETADO Y APROBADO</strong></span>
              <span>·</span>
              <span>Fecha: {apprentice.completionDate}</span>
            </div>
          </div>

          {/* Certificate Footer: Seals, QR & Signatures */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end pt-8 mt-6 border-t border-slate-200 dark:border-slate-800">
            {/* Signature 1: Subdirector */}
            <div className="text-center space-y-1">
              <div className="h-10 flex items-end justify-center">
                <span className="font-script-cert text-2xl text-slate-700 dark:text-slate-300">
                  Carlos M. Ospina
                </span>
              </div>
              <div className="w-36 h-px bg-slate-400 dark:bg-slate-600 mx-auto" />
              <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200 uppercase">
                Subdirector de Centro
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                {apprentice.regional}
              </p>
            </div>

            {/* Central Seal & Badge Images */}
            <div className="flex items-center justify-center gap-3">
              <div className="w-16 h-16 rounded-full overflow-hidden border border-[#b8860b]/40 shadow-xs shrink-0 bg-white">
                <img
                  src={SEAL_IMG}
                  alt="Sello Dorado Oficial SENA"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="w-16 h-16 rounded-full overflow-hidden border border-[#39A900]/40 shadow-xs shrink-0 bg-white">
                <img
                  src={BADGE_IMG}
                  alt="Insignia Maestría en Reglamento SENA"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            {/* Signature 2: Coordinador Académico */}
            <div className="text-center space-y-1">
              <div className="h-10 flex items-end justify-center">
                <span className="font-script-cert text-2xl text-slate-700 dark:text-slate-300">
                  Adriana Benítez V.
                </span>
              </div>
              <div className="w-36 h-px bg-slate-400 dark:bg-slate-600 mx-auto" />
              <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200 uppercase">
                Coordinador(a) Académico(a)
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                Gestión de la Formación Profesional Integral
              </p>
            </div>
          </div>

          {/* Validation hash & QR simulation footer strip */}
          <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-[10px] text-slate-400 gap-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-slate-900 dark:bg-slate-800 text-white rounded p-1 flex items-center justify-center font-mono font-bold text-[9px] shrink-0">
                QR
              </div>
              <div className="text-left font-mono">
                <span className="block text-slate-600 dark:text-slate-300 font-semibold">
                  Validación Digital: {apprentice.verificationCode}
                </span>
                <span>Registro Oficial de Inducción · SENA Colombia</span>
              </div>
            </div>

            <div className="text-right">
              <span>Resolución de Aprobación No. 2026-FPI-089</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
