export type Language = 'es' | 'en';

export const translations = {
  es: {
    // Common / Branding
    senaTitle: 'SENA Inducción',
    senaAgreement: 'Acuerdo 0009 de 2024',
    senaSubtitle: 'Servicio Nacional de Aprendizaje · Dirección de Formación Profesional',
    colombiaSena: 'SENA · Servicio Nacional de Aprendizaje · Colombia',
    regulationsFooter: 'Reglamento del Aprendiz (Acuerdo 0009 de 2024)',
    level: 'Nivel',
    xp: 'XP',
    muteSound: 'Silenciar efectos',
    enableSound: 'Activar efectos',
    lightMode: 'Cambiar a modo claro',
    darkMode: 'Cambiar a modo oscuro',
    switchLang: 'Cambiar a Inglés',
    langLabel: 'ES',
    langFull: 'Español',

    // Landing Header & Hero
    watchTutorial: 'Ver Tutorial',
    tutorialTitle: 'Guía de Inducción SENA',
    differentiatedPortal: 'Portal Oficial de Acceso Diferenciado',
    welcomeTitle: 'Bienvenido al Sistema de Inducción SENA',
    welcomeSubtitle:
      'Para garantizar una experiencia organizada y preservar la privacidad de los datos, selecciona el rol con el que vas a ingresar hoy a la plataforma:',
    landingFooter:
      'Sistema Institucional de Inducción · Servicio Nacional de Aprendizaje SENA · República de Colombia',
    landingPrivacy:
      'Los datos ingresados son confidenciales y se procesan exclusivamente con fines académicos institucionales bajo el Acuerdo 0009 de 2024.',

    // Card 1: Learner
    learnerCardTitle: 'Soy Aprendiz SENA',
    learnerCardBadge: 'Sin Contraseña · Acceso Directo',
    learnerCardDesc:
      'Ingresa tus datos de caracterización para iniciar tu inducción al reglamento, resolver casos prácticos y certificar tu etapa inicial.',
    fullNameLabel: 'Nombres y Apellidos Completos',
    fullNamePlaceholder: 'Ej. Natalia Andrea Morales Rojas',
    docTypeLabel: 'Tipo Documento',
    docNumberLabel: 'Número de Documento',
    docNumberPlaceholder: 'Ej. 1.098.765.432',
    fichaLabel: 'Número de Ficha de Formación',
    fichaPlaceholder: 'Ej. 2874910',
    fichaPrefix: 'Ficha:',
    programLabel: 'Programa de Formación',
    chooseFromList: 'Elegir de la lista',
    customProgramOption: 'Otro programa',
    customProgramPlaceholder: 'Escribe el nombre de tu programa formativo',
    regionalLabel: 'Regional / Centro de Formación',
    customRegionalOption: 'Otra regional',
    customRegionalPlaceholder: 'Escribe el nombre de tu Regional y Centro',
    learnerNotice:
      'Tus datos se sincronizarán automáticamente con tu Certificado Digital Oficial y la lista de control del instructor al finalizar.',
    startInductionBtn: 'Comenzar Mi Inducción SENA',
    errFullName: 'Por favor ingresa tus nombres y apellidos completos.',
    errDocNumber: 'Por favor ingresa tu número de documento.',
    errFichaNumber: 'Por favor ingresa el número de ficha asignado.',

    // Card 2: Instructor
    instructorCardTitle: 'Soy Instructor SENA',
    instructorCardBadge: 'Privilegiado · Requiere Clave',
    instructorCardDesc:
      'Acceso exclusivo para instructores y líderes formativos: monitoreo de aprendices, resguardo automático en Google Drive y generación de enlaces de ficha.',
    instructorPassLabel: 'Clave de Acceso Institucional del Instructor',
    instructorPassPlaceholder: 'Ingresa la clave (ej. sena1234)',
    privilegesTitle: 'Privilegios del Rol Instructor:',
    privilege1: 'Conectar y autorizar Google Sheets y Drive en segundo plano',
    privilege2: 'Monitorear tabla de calificaciones y aprendices aprobados',
    privilege3: 'Generar enlaces directos para aprendices por número de ficha',
    privilege4: 'Exportar planillas de cumplimiento a formato CSV oficial',
    enterInstructorBtn: 'Ingresar al Portal del Instructor',
    errInstructorPass:
      'Clave de instructor incorrecta. Por favor ingresa la clave autorizada.',

    // Main App Header Navigation Tabs
    tabPlan: 'Plan de Inducción',
    tabRegulations: 'Reglamento y Derechos',
    tabTribunal: 'Tribunal de Casos',
    tabEvaluation: 'Evaluación Final',
    tabCertificate: 'Certificado Digital',
    tabInstructorPanel: 'Panel Instructor',

    // Header Actions
    autoSyncActive: 'Auto-Sync Activo',
    inQueue: 'en cola',
    googleSheets: 'Google Sheets',
    instructorRoleTag: 'Instructor',
    iAmInstructor: 'Soy Instructor',
    switchRoleTooltip: 'Cambiar de Rol / Salir a Selección',
    viewCertificateBtn: 'Ver Mi Certificado',
    certificateShort: 'Certificado',
    takeQuizBtn: 'Rendir Evaluación',
    planPedagogic: 'Plan Pedagógico',
    viewBadges: 'Ver Insignias',
    exitRole: 'Salir / Cambiar Rol',

    // Hero Banner on Induction
    bannerTag: 'SENA Colombia · Dirección de Formación Profesional',
    bannerTitle: 'Inducción y Reglamento del Aprendiz',
    bannerDesc:
      'Bienvenido a la comunidad SENA. Conoce tus derechos académicos y de bienestar, comprende tus deberes éticos, resuelve dilemas reales y obtén tu acreditación oficial de inducción para iniciar con éxito tu etapa lectiva.',
    viewStructuredPlan: 'Ver Plan Estructurado',
    tribunalOfCases: 'Tribunal de Casos',
    badgesCount: 'Insignias',
    learningEnvironment: 'Ambiente de Aprendizaje SENA',
  },

  en: {
    // Common / Branding
    senaTitle: 'SENA Induction',
    senaAgreement: 'Agreement 0009 of 2024',
    senaSubtitle: 'National Learning Service · Directorate of Vocational Training',
    colombiaSena: 'SENA · National Learning Service · Colombia',
    regulationsFooter: 'Apprentice Regulations (Agreement 0009 of 2024)',
    level: 'Level',
    xp: 'XP',
    muteSound: 'Mute sounds',
    enableSound: 'Enable sounds',
    lightMode: 'Switch to light mode',
    darkMode: 'Switch to dark mode',
    switchLang: 'Cambiar a Español',
    langLabel: 'EN',
    langFull: 'English',

    // Landing Header & Hero
    watchTutorial: 'Watch Tutorial',
    tutorialTitle: 'SENA Induction Guide',
    differentiatedPortal: 'Official Role-Differentiated Portal',
    welcomeTitle: 'Welcome to the SENA Induction System',
    welcomeSubtitle:
      'To ensure an organized experience and protect data privacy, select your role to enter the platform today:',
    landingFooter:
      'Institutional Induction System · National Learning Service SENA · Republic of Colombia',
    landingPrivacy:
      'Entered data is confidential and processed exclusively for institutional academic purposes under Agreement 0009 of 2024.',

    // Card 1: Learner
    learnerCardTitle: 'I am a SENA Apprentice',
    learnerCardBadge: 'No Password · Direct Access',
    learnerCardDesc:
      'Enter your identification details to begin your regulations induction, resolve ethical case studies, and earn your official initial certificate.',
    fullNameLabel: 'Full First and Last Names',
    fullNamePlaceholder: 'E.g. Natalia Andrea Morales Rojas',
    docTypeLabel: 'Document Type',
    docNumberLabel: 'Document Number',
    docNumberPlaceholder: 'E.g. 1.098.765.432',
    fichaLabel: 'Training Group Code (Ficha)',
    fichaPlaceholder: 'E.g. 2874910',
    fichaPrefix: 'Group:',
    programLabel: 'Training Program',
    chooseFromList: 'Choose from list',
    customProgramOption: 'Other program',
    customProgramPlaceholder: 'Type your training program name',
    regionalLabel: 'Regional / Training Center',
    customRegionalOption: 'Other regional center',
    customRegionalPlaceholder: 'Type your Regional and Training Center',
    learnerNotice:
      'Your data will automatically synchronize with your Official Digital Certificate and your instructor’s tracking spreadsheet upon completion.',
    startInductionBtn: 'Start My SENA Induction',
    errFullName: 'Please enter your full first and last names.',
    errDocNumber: 'Please enter your document identification number.',
    errFichaNumber: 'Please enter the assigned training group code (ficha).',

    // Card 2: Instructor
    instructorCardTitle: 'I am a SENA Instructor',
    instructorCardBadge: 'Privileged · Password Required',
    instructorCardDesc:
      'Exclusive access for instructors and training leaders: monitor apprentice progress, configure Google Drive/Sheets auto-backup, and generate group links.',
    instructorPassLabel: 'Instructor Institutional Access Password',
    instructorPassPlaceholder: 'Enter password (e.g. sena1234)',
    privilegesTitle: 'Instructor Role Privileges:',
    privilege1: 'Connect and authorize Google Sheets & Drive in the background',
    privilege2: 'Monitor grade roster and approved apprentice records',
    privilege3: 'Generate direct links for apprentices by group code',
    privilege4: 'Export compliance reports to official CSV spreadsheets',
    enterInstructorBtn: 'Enter Instructor Portal',
    errInstructorPass:
      'Incorrect instructor password. Please enter the authorized password.',

    // Main App Header Navigation Tabs
    tabPlan: 'Induction Plan',
    tabRegulations: 'Regulations & Rights',
    tabTribunal: 'Case Tribunal',
    tabEvaluation: 'Final Assessment',
    tabCertificate: 'Digital Certificate',
    tabInstructorPanel: 'Instructor Portal',

    // Header Actions
    autoSyncActive: 'Auto-Sync Active',
    inQueue: 'in queue',
    googleSheets: 'Google Sheets',
    instructorRoleTag: 'Instructor',
    iAmInstructor: 'I am Instructor',
    switchRoleTooltip: 'Switch Role / Back to Selection',
    viewCertificateBtn: 'View My Certificate',
    certificateShort: 'Certificate',
    takeQuizBtn: 'Take Assessment',
    planPedagogic: 'Pedagogical Plan',
    viewBadges: 'View Badges',
    exitRole: 'Exit / Switch Role',

    // Hero Banner on Induction
    bannerTag: 'SENA Colombia · Directorate of Vocational Training',
    bannerTitle: 'Apprentice Induction & Regulations',
    bannerDesc:
      'Welcome to the SENA community. Discover your academic and welfare rights, understand your ethical duties, solve real dilemmas, and obtain your official induction accreditation to begin your training stage with success.',
    viewStructuredPlan: 'View Structured Plan',
    tribunalOfCases: 'Case Tribunal',
    badgesCount: 'Badges',
    learningEnvironment: 'SENA Learning Environment',
  },
} as const;

export function useTranslation(lang: Language) {
  return translations[lang];
}
