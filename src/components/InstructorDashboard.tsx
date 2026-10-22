import React, { useState, useEffect } from 'react';
import {
  Users,
  FileSpreadsheet,
  ExternalLink,
  Share2,
  Copy,
  Check,
  Search,
  Filter,
  Download,
  RefreshCw,
  ShieldCheck,
  Award,
  AlertCircle,
  CheckCircle2,
  Lock,
  ArrowRight,
  GraduationCap,
  Sparkles,
} from 'lucide-react';
import { User } from 'firebase/auth';
import {
  findOrCreateInductionSheet,
  getApprenticeRecords,
  SheetApprenticeRecord,
} from '../services/googleSheetsService';
import { getAccessToken } from '../services/googleAuth';
import { getPendingQueue, flushPendingQueue } from '../services/offlineSyncQueue';
import { sounds } from '../utils/soundEffects';

interface InstructorDashboardProps {
  currentUser: User | null;
  onOpenSheetsModal: () => void;
  onSwitchToLearnerView: () => void;
}

export const InstructorDashboard: React.FC<InstructorDashboardProps> = ({
  currentUser,
  onOpenSheetsModal,
  onSwitchToLearnerView,
}) => {
  const [records, setRecords] = useState<SheetApprenticeRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'approved' | 'review'>('all');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [customFicha, setCustomFicha] = useState<string>('2874910');

  // Stored sheet info
  const sheetInfo = (() => {
    try {
      const saved = localStorage.getItem('sena_google_sheet_info');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  })();

  const pendingQueue = getPendingQueue();

  // Load records on mount if user authenticated
  useEffect(() => {
    loadRecords();
  }, [currentUser]);

  const loadRecords = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
      const token = await getAccessToken();
      if (!token) {
        // Fallback to offline queue preview if not signed in
        return;
      }

      const sheet = await findOrCreateInductionSheet(token);
      await flushPendingQueue(token, sheet.spreadsheetId);
      const rows = await getApprenticeRecords(token, sheet.spreadsheetId);
      setRecords(rows);
    } catch (err: any) {
      console.warn('Error cargando registros del instructor:', err);
      setErrorMsg(err.message || 'Error consultando registros en Google Sheets');
    } finally {
      setLoading(false);
    }
  };

  // Generate learner link
  const getLearnerShareUrl = () => {
    if (typeof window === 'undefined') return '';
    const base = window.location.origin + window.location.pathname;
    return `${base}?role=aprendiz&ficha=${encodeURIComponent(customFicha.trim() || '2874910')}`;
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(getLearnerShareUrl());
    setCopiedLink(true);
    try {
      sounds.playSuccess();
    } catch {
      // ignore
    }
    setTimeout(() => setCopiedLink(false), 2200);
  };

  // Export CSV of records
  const handleExportCSV = () => {
    if (records.length === 0) return;
    const headers = [
      'Marca Temporal',
      'Nombre',
      'Tipo Doc',
      'Documento',
      'Programa',
      'Ficha',
      'Regional',
      'Puntaje',
      'Estado',
      'Código Verificación',
      'Fecha',
      'Norma',
    ];

    const csvRows = [
      headers.join(','),
      ...records.map((r) =>
        [
          `"${r.timestamp}"`,
          `"${r.fullName}"`,
          `"${r.documentType}"`,
          `"${r.documentNumber}"`,
          `"${r.program}"`,
          `"${r.fichaNumber}"`,
          `"${r.regional}"`,
          `"${r.score}"`,
          `"${r.status}"`,
          `"${r.verificationCode}"`,
          `"${r.completionDate}"`,
          `"${r.legalNorm}"`,
        ].join(',')
      ),
    ];

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `SENA_Induccion_Aprendices_Ficha_${customFicha}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter records
  const filteredRecords = records.filter((r) => {
    const matchesSearch =
      r.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.documentNumber.includes(searchTerm) ||
      r.fichaNumber.includes(searchTerm) ||
      r.program.toLowerCase().includes(searchTerm.toLowerCase());

    const isApproved = r.status.toLowerCase().includes('aprobado') || parseInt(r.score, 10) >= 80;
    const matchesStatus =
      filterStatus === 'all'
        ? true
        : filterStatus === 'approved'
        ? isApproved
        : !isApproved;

    return matchesSearch && matchesStatus;
  });

  const totalLearners = records.length;
  const approvedCount = records.filter(
    (r) => r.status.toLowerCase().includes('aprobado') || parseInt(r.score, 10) >= 80
  ).length;
  const approvalRate = totalLearners > 0 ? Math.round((approvedCount / totalLearners) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Institutional Instructor Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden shadow-sm">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-[#39A900] animate-pulse" />
              <span>Portal Privilegiado del Instructor · SENA Dirección de Formación</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-display">
              Centro de Gestión y Monitoreo de Inducción
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Supervisa el avance de los aprendices, administra el resguardo oficial en Google Drive y genera los enlaces directos para tus fichas formativas bajo el <strong>Acuerdo 0009 de 2024</strong>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenSheetsModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#39A900] hover:bg-[#2d8500] text-white text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Configurar Google Sheets</span>
            </button>

            <button
              onClick={onSwitchToLearnerView}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              <GraduationCap className="w-4 h-4 text-[#39A900]" />
              <span>Vista del Aprendiz</span>
            </button>
          </div>
        </div>
      </div>

      {/* Share with Apprentices Section */}
      <div className="bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 rounded-2xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 text-[#1e5c00] dark:text-[#48c805] flex items-center justify-center shrink-0">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Compartir Plataforma a los Aprendices
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Los aprendices ingresarán a su interfaz limpia sin opciones de configuración del instructor.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-600 dark:text-slate-400 whitespace-nowrap">
              Ficha a asignar:
            </label>
            <input
              type="text"
              value={customFicha}
              onChange={(e) => setCustomFicha(e.target.value)}
              placeholder="Ej. 2874910"
              className="w-28 text-xs font-mono bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1 text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#39A900]"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
          <div className="flex-1 min-w-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 font-mono text-xs text-slate-700 dark:text-slate-300 truncate select-all">
            {getLearnerShareUrl()}
          </div>

          <button
            onClick={handleCopyLink}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#39A900] hover:bg-[#2d8500] text-white text-xs font-bold rounded-xl transition-all shadow-xs shrink-0 cursor-pointer"
          >
            {copiedLink ? (
              <>
                <Check className="w-4 h-4" />
                <span>¡Enlace Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copiar Enlace para Aprendices</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-medium">Total Aprendices Registrados</span>
            <Users className="w-4 h-4 text-[#39A900]" />
          </div>
          <div className="text-2xl font-bold font-display text-slate-900 dark:text-white tabular-nums">
            {totalLearners}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            En hoja de cálculo oficial
          </p>
        </div>

        {/* Metric 2 */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-medium">Inducción Aprobada</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-display text-emerald-600 dark:text-emerald-400 tabular-nums">
            {approvedCount}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Puntaje formativo ≥ 80%
          </p>
        </div>

        {/* Metric 3 */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-medium">Tasa de Aprobación</span>
            <Award className="w-4 h-4 text-[#39A900]" />
          </div>
          <div className="text-2xl font-bold font-display text-slate-900 dark:text-white tabular-nums">
            {approvalRate}%
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Cumplimiento normativo
          </p>
        </div>

        {/* Metric 4 */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-medium">Cola Offline de Respaldo</span>
            <RefreshCw className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold font-display text-amber-600 dark:text-amber-400 tabular-nums">
            {pendingQueue.length}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            {pendingQueue.length === 0 ? 'Sin pendientes' : 'Pendientes de sincronizar'}
          </p>
        </div>
      </div>

      {/* Linked Google Drive Spreadsheet Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 text-[#1e5c00] dark:text-[#48c805] flex items-center justify-center shrink-0">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                SENA — Registro Oficial de Aprendices en Inducción (Acuerdo 0009 de 2024)
              </span>
              <span className="w-2 h-2 rounded-full bg-[#39A900] animate-pulse" />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {sheetInfo
                ? 'Conectada y sincronizada directamente en tu Google Drive personal.'
                : 'Aún no vinculada. Haz clic en el botón para vincular tu Google Drive.'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {sheetInfo && (
            <a
              href={sheetInfo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#39A900] hover:bg-[#2d8500] text-white text-xs font-bold rounded-lg transition-colors shadow-2xs"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Abrir Hoja en Drive</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}

          <button
            onClick={loadRecords}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Actualizar Datos</span>
          </button>
        </div>
      </div>

      {/* Apprentice Table Header Controls */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-slate-500 dark:text-slate-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Listado de Aprendices Sincronizados ({filteredRecords.length})
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search Input */}
            <div className="relative flex-1 sm:flex-initial">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por nombre, documento o ficha..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#39A900] w-full sm:w-64"
              />
            </div>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e: any) => setFilterStatus(e.target.value)}
              className="px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-[#39A900]"
            >
              <option value="all">Todos los estados</option>
              <option value="approved">Solo Aprobados</option>
              <option value="review">En Revisión</option>
            </select>

            {/* Export CSV Button */}
            <button
              onClick={handleExportCSV}
              disabled={records.length === 0}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-lg transition-colors disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exportar CSV</span>
            </button>
          </div>
        </div>

        {/* Apprentice Table */}
        {filteredRecords.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
            <Users className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600" />
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
              No se encontraron registros de aprendices
            </p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 max-w-sm mx-auto">
              Comparte el enlace de aprendices a tu grupo de formación. Cuando completen la evaluación o descarguen su certificado, sus registros aparecerán automáticamente aquí.
            </p>
          </div>
        ) : (
          <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-3 font-semibold">Aprendiz</th>
                  <th className="p-3 font-semibold">Documento</th>
                  <th className="p-3 font-semibold">Ficha</th>
                  <th className="p-3 font-semibold">Programa</th>
                  <th className="p-3 font-semibold">Puntaje</th>
                  <th className="p-3 font-semibold">Estado Formativo</th>
                  <th className="p-3 font-semibold">Código Verificación</th>
                  <th className="p-3 font-semibold">Fecha Culminación</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredRecords.map((item, idx) => {
                  const isApproved =
                    item.status.toLowerCase().includes('aprobado') ||
                    parseInt(item.score, 10) >= 80;

                  return (
                    <tr
                      key={idx}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="p-3 font-semibold text-slate-900 dark:text-white">
                        {item.fullName}
                      </td>
                      <td className="p-3 font-mono text-slate-600 dark:text-slate-400">
                        {item.documentType} {item.documentNumber}
                      </td>
                      <td className="p-3 font-mono text-slate-800 dark:text-slate-200 font-semibold">
                        {item.fichaNumber}
                      </td>
                      <td className="p-3 text-slate-600 dark:text-slate-400 max-w-xs truncate" title={item.program}>
                        {item.program}
                      </td>
                      <td className="p-3 font-bold text-[#1e5c00] dark:text-[#48c805]">
                        {item.score}
                      </td>
                      <td className="p-3">
                        <span
                          className={`text-xs font-semibold ${
                            isApproved
                              ? 'text-emerald-700 dark:text-emerald-400'
                              : 'text-amber-700 dark:text-amber-400'
                          }`}
                        >
                          {isApproved ? 'Aprobado' : 'En revisión'}
                        </span>
                      </td>
                      <td className="p-3 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                        {item.verificationCode}
                      </td>
                      <td className="p-3 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                        {item.completionDate || item.timestamp}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
