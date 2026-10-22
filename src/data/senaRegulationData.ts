export const SENA_LOGO_SVG = "data:image/svg+xml,%3c?xml%20version=%271.0%27%20encoding=%27utf-8%27?%3e%3c!--%20Generator:%20Adobe%20Illustrator%2026.0.1,%20SVG%20Export%20Plug-In%20.%20SVG%20Version:%206.00%20Build%200)%20--%3e%3csvg%20version=%271.1%27%20id=%27Capa_1%27%20xmlns=%27http://www.w3.org/2000/svg%27%20xmlns:xlink=%27http://www.w3.org/1999/xlink%27%20x=%270px%27%20y=%270px%27%20viewBox=%270%200%201000%201000%27%20style=%27enable-background:new%200%200%201000%201000;%27%20xml:space=%27preserve%27%3e%3cstyle%20type=%27text/css%27%3e%20.st0{fill:%2339a900;}%20%3c/style%3e%3cpath%20id=%27path47-5%27%20class=%27st0%27%20d=%27M504.2,20.5c-58.3,0.1-105.6,47.4-105.5,105.8c0.1,58.3,47.4,105.6,105.7,105.6%20c58.3,0,105.6-47.3,105.6-105.7V126C609.9,67.6,562.6,20.4,504.2,20.5z%20M155.6,264.6c-18.6,0.1-37.5,1.1-55.2,5.6%20c-11.7,3-23,7.8-30.3,15.4c-9.2,9.5-10.4,22.3-5.9,33.3c4,9.7,14.8,16.9,26.8,21.1c25.9,8.9,54.6,10.7,81.8,16.3%20c5,1.2,10.6,2.6,13.7,6c3.2,4.1,1.3,9.7-4,12.2c-8.8,4.5-20.1,4.5-30.4,4.4c-9.4-0.4-19.7-1.2-27.2-5.9c-5.5-3.4-6.5-9.1-5.2-14.1%20l-60.6,0c-0.2,9.2,1.6,18.9,8.4,26.8c5.6,6.8,14.8,11.5,24.6,14.4c15.7,4.6,32.7,6,49.4,6.4c22.7,0.4,45.8-0.3,67.6-5.4%20c13-3.2,25.8-8.3,34.1-16.6c14.8-14.8,11.3-38.3-8.3-49.8c-9.8-5.7-21.5-9.2-33.4-11.5c-17.5-3.6-35.3-6.3-52.9-9.2%20c-6.2-1.2-12.8-2.3-18-5.2c-5.5-2.9-5.9-9.8-0.3-12.9c7.2-4.1,16.8-4,25.4-4c9.1,0.2,19,0.7,26.5,5c4.2,2.3,5.9,6.3,5.9,10.1%20l57.6-0.1c-0.2-7.3-1.6-14.9-6.9-21.2c-6.2-7.8-17.1-12.7-28.3-15.5C192.8,265.6,174.1,264.7,155.6,264.6L155.6,264.6z%20M280.6,268.9%20l0,137.7l168.1,0l0-30H342.3v-26.7h94.9v-29.3h-94.9l0-21.9l102.6,0l-0.1-29.7L280.6,268.9z%20M557.5,269c0,0-51.9,0-77.9,0l0,137.7%20l59,0l0-92.7l80.8,92.6l81,0.1l0-137.7l-59.1,0l0.1,92L557.5,269z%20M805.6,269.2c0,0-63.6,91.9-95.6,137.7l61.9,0l14.9-24.8h95.7%20l13.9,24.9l68.8,0L874,269.2L805.6,269.2z%20M836.6,302.1l29.4,49.9l-60.7,0.1L836.6,302.1z%20M10.6,445.6l0.5,75l280.1-1%20c14.3,3.1,22.6,12.4,19.7,33.5L138.6,854.7l56.1,52.5l266.9-461.6L10.6,445.6z%20M545.2,446.2l262.4,459.6l58-52.1L691.3,552.9%20c-2.9-21.2,5.4-30.6,19.7-33.7l280.2,1l-0.1-73.7L545.2,446.2z%20M500.9,522.3L254.8,944.7l65.4,31.9L484.4,699%20c5.7-4.6,11.4-7.1,17.1-7.3c6-0.2,12.2,2,18.3,6.8l163.8,278.4l67.4-35.2L500.9,522.3z%27/%3e%3cg%20id=%27_x23_000000ff-2%27%20transform=%27matrix(0.31570611,0,0,0.23560774,-391.49698,-10.601126)%27%3e%3c/g%3e%3c/svg%3e";

export interface RegulationArticle {
  id: string;
  chapter: string;
  chapterNumber: number;
  articleNumber: string;
  title: string;
  summary: string;
  fullText: string;
  category: 'derechos' | 'deberes' | 'prohibiciones' | 'etapa_productiva' | 'sanciones' | 'debido_proceso';
  importance: 'esencial' | 'clave' | 'general';
  tags: string[];
}

export interface CaseStudy {
  id: string;
  title: string;
  situation: string;
  apprenticeRole: string;
  program: string;
  question: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
    explanation: string;
    legalArticle: string;
  }[];
  xpReward: number;
  badgeName: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  category: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  articleReference: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  iconName: string;
  requirement: string;
  unlocked: boolean;
}

export const SENA_CHAPTERS = [
  { id: 'all', name: 'Todos los Temas' },
  { id: 'principios', name: 'Capítulo I — Principios y Disposiciones Generales' },
  { id: 'derechos', name: 'Capítulo II — 24 Derechos del Aprendiz' },
  { id: 'deberes', name: 'Capítulo III — Deberes del Aprendiz' },
  { id: 'prohibiciones', name: 'Capítulo III — Prohibiciones Expresas' },
  { id: 'etapa_productiva', name: 'Capítulo IV — Permanencia, Trámites y Etapa Productiva' },
  { id: 'sanciones', name: 'Capítulo V — Faltas, Calificación y Medidas Formativas' },
  { id: 'debido_proceso', name: 'Capítulo V — Garantías del Debido Proceso y Comité' },
];

export const SENA_REGULATION_ARTICLES: RegulationArticle[] = [
  // Capítulo I: Disposiciones Generales y Principios Orientadores
  {
    id: 'ac09-art-1',
    chapter: 'Capítulo I — Disposiciones Generales',
    chapterNumber: 1,
    articleNumber: 'Artículo 1',
    title: 'Definiciones Clave de la Formación Profesional Integral',
    summary: 'Define los conceptos fundamentales: Aprendiz SENA, Formación Profesional Integral (FPI), Ambientes de Aprendizaje, Ruta Formativa, Entornos Digitales y Netiqueta.',
    fullText: 'Establece los términos rectores del proceso formativo en el SENA. Aprendiz es toda persona matriculada en programas de formación titulada o complementaria en cualquier modalidad (presencial, virtual, a distancia o combinada). Los ambientes de aprendizaje abarcan espacios físicos, virtuales, talleres y centros de producción donde confluyen aprendices, instructores y tecnologías.',
    category: 'deberes',
    importance: 'esencial',
    tags: ['Definiciones', 'FPI', 'Ambientes Virtuales', 'Netiqueta', 'Acuerdo 0009 de 2024'],
  },
  {
    id: 'ac09-art-2',
    chapter: 'Capítulo I — Disposiciones Generales',
    chapterNumber: 1,
    articleNumber: 'Artículo 2',
    title: 'Ámbito de Aplicación y Alcance Universal',
    summary: 'El reglamento aplica a aspirantes en etapa de selección e ingreso y a todos los aprendices durante su permanencia, etapas lectiva y productiva, y hasta su certificación.',
    fullText: 'Rige para todos los aprendices del SENA en todas las sedes, centros de formación a nivel nacional, jornadas (diurna, nocturna, mixta, fines de semana), niveles de formación (operario, auxiliar, técnico, tecnólogo, especialización tecnológica) y modalidades, extendiéndose a actividades pedagógicas dentro o fuera de las instalaciones del SENA y a convenios formativos.',
    category: 'deberes',
    importance: 'clave',
    tags: ['Ámbito', 'Niveles', 'Modalidades', 'Lectiva y Productiva'],
  },
  {
    id: 'ac09-art-3',
    chapter: 'Capítulo I — Disposiciones Generales',
    chapterNumber: 1,
    articleNumber: 'Artículo 3',
    title: 'Principios Orientadores de la Convivencia y Formación',
    summary: 'Consagra los pilares de Autonomía, Dignidad Humana, Inclusión, Enfoque Diferencial, Enfoque Territorial, Sostenibilidad, Participación y Solidaridad.',
    fullText: 'La formación en el SENA se fundamenta en el respeto irrestricto a los Derechos Humanos y la Constitución Política. Se garantiza el enfoque diferencial para reconocer diversidades étnicas, de género, culturales y capacidades diversas, promoviendo ambientes libres de toda forma de discriminación o violencia de género, así como la justicia climática y social.',
    category: 'derechos',
    importance: 'esencial',
    tags: ['Dignidad', 'Enfoque Diferencial', 'Inclusión', 'Derechos Humanos'],
  },
  {
    id: 'ac09-art-4',
    chapter: 'Capítulo I — Disposiciones Generales',
    chapterNumber: 1,
    articleNumber: 'Artículo 4',
    title: 'Centro de Convivencia y Resolución Dialógica de Conflictos',
    summary: 'Promueve la concertación pacífica, la mediación pedagógica y el diálogo formativo antes de instancias sancionatorias.',
    fullText: 'El SENA privilegia la convivencia armónica, el diálogo constructivo y la justicia restaurativa. Se establecen mecanismos pedagógicos de mediación para resolver desacuerdos o conflictos interpersonales entre aprendices o con la comunidad educativa, fortaleciendo competencias ciudadanas y cultura de paz.',
    category: 'derechos',
    importance: 'clave',
    tags: ['Convivencia', 'Mediación', 'Resolución Pacífica', 'Cultura de Paz'],
  },

  // Capítulo II: Derechos del Aprendiz SENA (Artículo 5)
  {
    id: 'ac09-art-5-fpi',
    chapter: 'Capítulo II — Derechos del Aprendiz SENA',
    chapterNumber: 2,
    articleNumber: 'Artículo 5 (Numerales 1 - 5)',
    title: 'Derechos a la Inducción, Formación Integral y Calidad',
    summary: 'Recibir inducción completa sobre el SENA, su reglamento y plan de bienestar; acceder a formación profesional integral pertinente, oportuna y actualizada.',
    fullText: 'El aprendiz tiene derecho a: 1. Recibir inducción integral al iniciar su programa; 2. Recibir una formación profesional integral con instructores calificados y metodología por competencias; 3. Disponer de la información clara y oportuna sobre el diseño curricular, resultados de aprendizaje y criterios de evaluación; 4. Ser evaluado objetivamente según evidencias formativas.',
    category: 'derechos',
    importance: 'esencial',
    tags: ['Inducción', 'Formación de Calidad', 'Evaluación Justa', 'Diseño Curricular'],
  },
  {
    id: 'ac09-art-5-infraestructura',
    chapter: 'Capítulo II — Derechos del Aprendiz SENA',
    chapterNumber: 2,
    articleNumber: 'Artículo 5 (Numerales 6 - 10)',
    title: 'Derecho a Infraestructura, Tecnologías y Dotación de EPP',
    summary: 'Hacer uso de talleres, laboratorios, ambientes virtuales y recibir dotación de Elementos de Protección Personal (EPP) según los riesgos de su especialidad técnica.',
    fullText: 'El aprendiz tiene derecho a utilizar la infraestructura física, técnica, tecnológica, bibliotecas y herramientas didácticas del SENA para el desarrollo de su formación; y en ambientes con riesgos laborales (talleres automotrices, laboratorios químicos, maquinaria pesada, soldadura, etc.), a recibir la dotación y elementos de protección personal conforme a las normas de Seguridad y Salud en el Trabajo (SST).',
    category: 'derechos',
    importance: 'esencial',
    tags: ['Infraestructura', 'EPP', 'Talleres', 'Laboratorios', 'SST'],
  },
  {
    id: 'ac09-art-5-bienestar',
    chapter: 'Capítulo II — Derechos del Aprendiz SENA',
    chapterNumber: 2,
    articleNumber: 'Artículo 5 (Numerales 11 - 16)',
    title: 'Derecho a Bienestar al Aprendiz, Salud y Apoyos de Sostenimiento',
    summary: 'Beneficiarse de los programas de salud integral, cultura, deporte, liderazgo, alimentación de apoyo y convocatorias de sostenimiento socioeconómico del SENA.',
    fullText: 'Participar activamente en el Plan Nacional Integral de Bienestar al Aprendiz en sus diferentes áreas: salud física y mental, consejería, actividades deportivas, recreativas, artísticas, prevención de violencias y postularse a los apoyos de sostenimiento (regular, FIC) cumpliendo con los requisitos de la convocatoria.',
    category: 'derechos',
    importance: 'clave',
    tags: ['Bienestar', 'Salud Integral', 'Deportes', 'Apoyo de Sostenimiento'],
  },
  {
    id: 'ac09-art-5-debido-proceso',
    chapter: 'Capítulo II — Derechos del Aprendiz SENA',
    chapterNumber: 2,
    articleNumber: 'Artículo 5 (Numerales 17 - 24)',
    title: 'Derechos al Debido Proceso, Libre Expresión y Certificación',
    summary: 'Garantía del derecho a la defensa, presunción de inocencia, libertad de culto y pensamiento, y expedición oportuna y gratuita de su certificado y título.',
    fullText: 'Gozar de las garantías del debido proceso en cualquier actuación disciplinaria o académica; ser escuchado en descargos; aportar pruebas; interponer recursos legales; recibir trato digno sin discriminación; elegir y ser elegido vocero o representante; y recibir su certificación una vez aprobado a cabalidad el programa formativo.',
    category: 'derechos',
    importance: 'esencial',
    tags: ['Debido Proceso', 'Certificación Gratuita', 'Libertad de Expresión', 'Descargos'],
  },
  {
    id: 'ac09-art-6',
    chapter: 'Capítulo II — Derechos del Aprendiz SENA',
    chapterNumber: 2,
    articleNumber: 'Artículo 6',
    title: 'Estímulos e Incentivos a la Excelencia Formativa',
    summary: 'Reconocimientos para aprendices destacados: monitorías remuneradas, condecoraciones, pasantías y representación en competencias técnicas como WorldSkills.',
    fullText: 'Los aprendices que se destaquen por su rendimiento académico, liderazgo, innovación, espíritu investigativo (Sennova) o valores humanos podrán recibir: menciones de honor, asignación como monitores de centro, participación en intercambios y eventos científicos o tecnológicos nacionales e internacionales.',
    category: 'derechos',
    importance: 'general',
    tags: ['Estímulos', 'Monitorías', 'WorldSkills', 'Sennova', 'Excelencia'],
  },
  {
    id: 'ac09-art-7',
    chapter: 'Capítulo II — Derechos del Aprendiz SENA',
    chapterNumber: 2,
    articleNumber: 'Artículo 7',
    title: 'Representatividad y Vocería de los Aprendices',
    summary: 'Estructura democrática: Voceros de Ficha y Representantes de Centro elegidos por voto popular para canalizar inquietudes ante la administración.',
    fullText: 'Los aprendices tienen derecho a elegir y ser elegidos voceros de su ficha y representantes generales de los aprendices ante el Comité de Centro. Su labor es representar democráticamente a sus compañeros, promover el cumplimiento del reglamento y participar con voz y voto en las instancias institucionales correspondientes.',
    category: 'derechos',
    importance: 'clave',
    tags: ['Democracia', 'Vocero de Ficha', 'Representante de Aprendices', 'Comité'],
  },

  // Capítulo III: Deberes y Prohibiciones
  {
    id: 'ac09-cap-3-deberes-academicos',
    chapter: 'Capítulo III — Deberes del Aprendiz SENA',
    chapterNumber: 3,
    articleNumber: 'Capítulo III (Deberes Académicos)',
    title: 'Compromiso de Aprendizaje, Asistencia e Integridad Académica',
    summary: 'Cumplir con las actividades curriculares, asistir puntualmente a sesiones presenciales o virtuales, y garantizar la autoría auténtica de sus evidencias.',
    fullText: 'El aprendiz debe asumir el protagonismo de su formación: 1. Suscribir y cumplir el acta de compromiso de matrícula; 2. Asistir con puntualidad a todas las sesiones de formación presencial o virtual sincrónica; 3. Presentar oportunamente las evidencias de aprendizaje; 4. Desarrollar trabajos con rigurosa honestidad intelectual, citando fuentes conforme a normas de citación y declarando el uso de herramientas de IA generativa.',
    category: 'deberes',
    importance: 'esencial',
    tags: ['Asistencia', 'Honestidad Intelectual', 'Evidencias', 'Integridad', 'Uso de IA'],
  },
  {
    id: 'ac09-cap-3-deberes-convivencia',
    chapter: 'Capítulo III — Deberes del Aprendiz SENA',
    chapterNumber: 3,
    articleNumber: 'Capítulo III (Deberes de Convivencia y Cuidado)',
    title: 'Cuidado de Bienes Institucionales, Netiqueta y Convivencia',
    summary: 'Proteger la infraestructura física y tecnológica del SENA, usar adecuadamente el carné institucional y mantener un trato respetuoso en redes y foros.',
    fullText: 'Preservar los recursos, maquinarias, software, equipos de cómputo y ambientes de formación; portar visiblemente el carné institucional; practicar la netiqueta en canales digitales (respeto, cortesía, sin spam); reportar daños o condiciones inseguras; y respetar la diversidad y dignidad de toda la comunidad del SENA.',
    category: 'deberes',
    importance: 'esencial',
    tags: ['Netiqueta', 'Carné', 'Cuidado de Equipos', 'Respeto Institucional'],
  },
  {
    id: 'ac09-cap-3-prohibiciones-gravisimas',
    chapter: 'Capítulo III — Prohibiciones del Aprendiz',
    chapterNumber: 3,
    articleNumber: 'Capítulo III (Prohibiciones de Mayor Gravedad)',
    title: 'Prohibiciones: Suplantación, Falsedad y Comercio Ilegal',
    summary: 'Suplantar identidad en plataformas o evaluaciones, falsificar documentos, ingresar armas, o comerciar sustancias psicoactivas dentro de la institución.',
    fullText: 'Queda terminantemente prohibido: 1. Suplantar la identidad de otra persona en trámites presenciales o plataformas virtuales (Zajuna, SofiaPlus, LMS); 2. Aportar información o certificados falsificados para el ingreso o certificación; 3. Ingresar, portar, suministrar o consumir estupefacientes, bebidas embriagantes o armas en sedes del SENA o empresas de formación; 4. Ofrecer dádivas o sobornos a instructores o funcionarios.',
    category: 'prohibiciones',
    importance: 'esencial',
    tags: ['Suplantación', 'Plataforma Virtual', 'Falsificación', 'Sustancias', 'Armas'],
  },
  {
    id: 'ac09-cap-3-prohibiciones-academicas',
    chapter: 'Capítulo III — Prohibiciones del Aprendiz',
    chapterNumber: 3,
    articleNumber: 'Capítulo III (Prohibiciones Académicas y Conducta)',
    title: 'Prohibiciones: Plagio, Sabotaje Digital, Acoso y Violencias',
    summary: 'Plagiar evidencias, alterar sistemas informáticos del SENA, sabotear clases y ejercer conductas de ciberacoso, intimidación o discriminación.',
    fullText: 'Constituyen conductas prohibidas: 1. Plagiar parcial o totalmente obras, códigos fuente o proyectos ajenos presentándolos como propios; 2. Acceder sin autorización, alterar o dañar sistemas de información, redes o servidores del SENA; 3. Desarrollar cualquier conducta de acoso sexual, matoneo presencial o virtual, hostigamiento o discriminación por etnia, orientación o género.',
    category: 'prohibiciones',
    importance: 'esencial',
    tags: ['Plagio', 'Sabotaje Digital', 'Acoso', 'No Violencia', 'Ciberacoso'],
  },

  // Capítulo IV: Trámites, Permanencia y Etapa Productiva
  {
    id: 'ac09-cap-4-novedades',
    chapter: 'Capítulo IV — Permanencia, Trámites y Certificación',
    chapterNumber: 4,
    articleNumber: 'Capítulo IV (Novedades de la Formación)',
    title: 'Gestión Oportuna de Novedades del Aprendiz',
    summary: 'Regulación de traslados, aplazamientos de formación, reingresos justificados, cambios de jornada y trámite formal de retiro voluntario.',
    fullText: 'El aprendiz puede solicitar formalmente: 1. Traslado de centro o programa (previa disponibilidad de cupo y justificación); 2. Aplazamiento de formación (por fuerza mayor o caso fortuito hasta por 6 meses prorrogables); 3. Reingreso (dentro de los plazos reglamentarios); 4. Retiro voluntario debidamente radicado, evitando sanciones por deserción injustificada.',
    category: 'etapa_productiva',
    importance: 'clave',
    tags: ['Aplazamiento', 'Traslado', 'Reingreso', 'Retiro Voluntario'],
  },
  {
    id: 'ac09-cap-4-etapa-productiva',
    chapter: 'Capítulo IV — Permanencia, Trámites y Certificación',
    chapterNumber: 4,
    articleNumber: 'Capítulo IV (Modalidades de Etapa Productiva)',
    title: 'Alternativas Válidas para la Etapa Productiva',
    summary: 'Formas oficiales de realizar la etapa práctica: Contrato de Aprendizaje, Vínculo Laboral, Proyecto Productivo SENA, Pasantía y Monitoría.',
    fullText: 'La etapa productiva permite aplicar conocimientos en situaciones reales de trabajo: a) Contrato de Aprendizaje según Ley 789; b) Vínculo laboral o contractual afín al perfil del programa; c) Participación en Proyecto Productivo SENA (I+D+i / SENNOVA); d) Pasantía en entidades estatales, ONG o microempresas; e) Monitoría en ambientes del SENA. El aprendiz debe entregar puntualmente bitácoras y contar con aval del instructor de seguimiento.',
    category: 'etapa_productiva',
    importance: 'esencial',
    tags: ['Etapa Productiva', 'Contrato Aprendizaje', 'Pasantía', 'Bitácoras', 'Seguimiento'],
  },
  {
    id: 'ac09-cap-4-desercion-certificacion',
    chapter: 'Capítulo IV — Permanencia, Trámites y Certificación',
    chapterNumber: 4,
    articleNumber: 'Capítulo IV (Deserción y Certificación)',
    title: 'Causales de Deserción y Proceso de Certificación',
    summary: 'Inasistencia injustificada de más de tres (3) días consecutivos o incumplimiento en entrega de bitácoras de etapa productiva activa el proceso de deserción.',
    fullText: 'Se configura deserción cuando: el aprendiz no asiste por tres (3) días hábiles consecutivos sin justificación legal; o al terminar la etapa lectiva transcurren 2 años sin presentar la etapa productiva. La certificación se otorga de manera gratuita cuando el aprendiz ha alcanzado el 100% de los resultados de aprendizaje y cuenta con juicio evaluativo aprobado en el sistema institucional.',
    category: 'etapa_productiva',
    importance: 'esencial',
    tags: ['Deserción', '3 Días Injustificados', 'Certificación', 'Resultados Aprobados'],
  },

  // Capítulo V: Faltas, Calificación, Medidas y Debido Proceso
  {
    id: 'ac09-cap-5-clasificacion-faltas',
    chapter: 'Capítulo V — Faltas, Medidas y Régimen Sancionatorio',
    chapterNumber: 5,
    articleNumber: 'Capítulo V (Clasificación de Faltas)',
    title: 'Faltas Académicas y Disciplinarias: Leves, Graves y Gravísimas',
    summary: 'Tipos de faltas según atenten contra el desempeño formativo o la convivencia. Se gradúan con base en la intencionalidad, reiteración y daño.',
    fullText: 'Las faltas son: Académicas (incumplimiento en evidencias, inasistencias injustificadas, plagio) y Disciplinarias (conductas que afectan la convivencia, respeto o bienes institucionales). Se califican como Leves, Graves o Gravísimas evaluando el daño ocasionado, antecedentes disciplinarios, grado de participación y si actuó en complicidad.',
    category: 'sanciones',
    importance: 'esencial',
    tags: ['Faltas Académicas', 'Faltas Disciplinarias', 'Leves Graves Gravísimas'],
  },
  {
    id: 'ac09-cap-5-medidas-formativas',
    chapter: 'Capítulo V — Faltas, Medidas y Régimen Sancionatorio',
    chapterNumber: 5,
    articleNumber: 'Capítulo V (Medidas Formativas)',
    title: 'Medidas Formativas Pedagógicas y Planes de Mejoramiento',
    summary: 'Llamado de atención verbal, llamado de atención escrito y Plan de Mejoramiento pedagógico con metas claras y plazos fijados por el instructor o comité.',
    fullText: 'Tienen carácter pedagógico preventivo y buscan corregir conductas sin sancionar de forma inmediata: 1. Llamado de atención verbal (reflexión individual); 2. Llamado de atención escrito con registro en hoja de vida académica; 3. Plan de mejoramiento académico o disciplinario (acuerdo con actividades concretas que el aprendiz debe subsanar en un término definido).',
    category: 'sanciones',
    importance: 'clave',
    tags: ['Plan de Mejoramiento', 'Llamado de Atención', 'Medidas Pedagógicas'],
  },
  {
    id: 'ac09-cap-5-sanciones-expresas',
    chapter: 'Capítulo V — Faltas, Medidas y Régimen Sancionatorio',
    chapterNumber: 5,
    articleNumber: 'Capítulo V (Medidas Sancionatorias)',
    title: 'Sanciones Institucionales: Condicionamiento y Cancelación de Matrícula',
    summary: 'Sanciones impuestas únicamente por el Subdirector de Centro: Condicionamiento de matrícula y Cancelación definitiva con inhabilidad de 6 a 24 meses.',
    fullText: 'Las sanciones son actos administrativos motivados expedidos por el Subdirector de Centro previo concepto del Comité de Evaluación: 1. Condicionamiento de la matrícula (última oportunidad formativa sujeta a cumplimiento estricto); 2. Cancelación de matrícula (desvinculación definitiva del SENA con inhabilidad para matricularse en nuevos programas entre 6 meses y hasta 24 meses).',
    category: 'sanciones',
    importance: 'esencial',
    tags: ['Cancelación de Matrícula', 'Condicionamiento', 'Inhabilidad', 'Subdirector'],
  },
  {
    id: 'ac09-cap-5-debido-proceso',
    chapter: 'Capítulo V — Garantías del Debido Proceso',
    chapterNumber: 5,
    articleNumber: 'Capítulo V (Debido Proceso y Recursos)',
    title: 'Etapas del Debido Proceso y Comité de Evaluación',
    summary: 'Radicación de queja, citación formal, término de 5 días hábiles para descargos, sesión del comité, derecho de defensa y recurso de reposición.',
    fullText: 'Garantías esenciales: 1. Notificación formal y oportuna de los hechos investigados; 2. Término improrrogable de cinco (5) días hábiles para que el aprendiz presente sus descargos y aporte pruebas; 3. Sesión del Comité de Evaluación y Seguimiento donde el aprendiz tiene derecho a ser escuchado; 4. Recomendación motivada del Comité; 5. Acto administrativo de la Subdirección y derecho a interponer Recurso de Reposición dentro de los 10 días hábiles siguientes.',
    category: 'debido_proceso',
    importance: 'esencial',
    tags: ['Debido Proceso', '5 Días Descargos', 'Recurso Reposición', 'Comité de Centro'],
  },
];

export const REAL_SENA_CASES: CaseStudy[] = [
  {
    id: 'caso-adso-plagio-ia',
    title: 'Caso 1: Código Generado por IA y Plagio en ADSO',
    program: 'Análisis y Desarrollo de Software (ADSO)',
    apprenticeRole: 'Aprendiz Tecnólogo en Desarrollo de Software',
    situation:
      'Santiago, aprendiz de ADSO, entregó como proyecto final una aplicación web que copió íntegramente de un repositorio público en GitHub y de un modelo de IA generativa, sin citar la fuente, sin documentar el código y asegurando ante su instructor que era de su autoría absoluta.',
    question:
      'De acuerdo con el Capítulo III del Acuerdo 0009 de 2024, ¿cuál es la tipificación jurídica de la conducta de Santiago y el procedimiento correspondiente?',
    options: [
      {
        id: 'opt-1-correct',
        text: 'Constituye una falta académica y disciplinaria grave/gravísima por vulneración a la integridad académica (plagio y falsedad de evidencias). Se debe remitir al Comité de Evaluación y Seguimiento garantizando su debido proceso.',
        isCorrect: true,
        explanation:
          '¡Correcto! El Acuerdo 0009 de 2024 prohíbe taxativamente presentar como propias evidencias desarrolladas por terceros o generadas por IA sin la respectiva citación y transparencia metodológica. La conducta amerita llamado al Comité respetando el derecho a descargos.',
        legalArticle: 'Capítulo III (Prohibiciones y Deberes Académicos) y Capítulo V (Debido Proceso)',
      },
      {
        id: 'opt-1-err-1',
        text: 'No es una falta porque todo el código en internet es libre y el aprendiz puede usarlo sin citar.',
        isCorrect: false,
        explanation:
          'Incorrecto. El uso de recursos digitales en el SENA exige integridad académica y citación obligatoria de fuentes. Apropiarse de código ajeno constituye plagio sancionable.',
        legalArticle: 'Capítulo III (Deber de Integridad Académica)',
      },
      {
        id: 'opt-1-err-2',
        text: 'El instructor debe expulsar inmediatamente a Santiago de las instalaciones sin escucharlo ni hacer acta.',
        isCorrect: false,
        explanation:
          'Incorrecto. En el SENA ningún instructor puede expulsar unilateralmente a un aprendiz. Todo proceso debe respetar el Debido Proceso (Capítulo V - Art. 5), incluyendo derecho a descargos y decisión del Subdirector de Centro.',
        legalArticle: 'Capítulo V (Garantías del Debido Proceso)',
      },
    ],
    xpReward: 150,
    badgeName: 'Defensor de Derechos y Ética',
  },
  {
    id: 'caso-mecanica-epp',
    title: 'Caso 2: Seguridad en Taller Mecatrónico y Dotación EPP',
    program: 'Mantenimiento Mecatrónico Industrial',
    apprenticeRole: 'Aprendiz Técnico de Taller',
    situation:
      'Marcela ingresó al taller de fresado y torno sin sus botas con puntera dieléctrica ni gafas de seguridad requeridas por la matriz de riesgos del ambiente. Cuando el instructor le solicitó retirarse del área por su seguridad personal, ella alegó que el SENA le violaba su derecho a la educación.',
    question:
      'Analizando el Artículo 5 y el Capítulo III del Acuerdo 0009 de 2024, ¿cuál es la solución normativa correcta?',
    options: [
      {
        id: 'opt-2-correct',
        text: 'El derecho a la formación está supeditado al cumplimiento estricto de las normas de Seguridad y Salud en el Trabajo (SST). El instructor actuó en protección de la vida de Marcela; su deber era portar los EPP obligatorios.',
        isCorrect: true,
        explanation:
          '¡Exacto! El Acuerdo 0009 de 2024 consagra el derecho a recibir dotación de EPP cuando aplique, pero establece como deber ineludible del aprendiz portar y usar adecuadamente los elementos de protección en ambientes con riesgo ocupacional para salvaguardar su integridad física.',
        legalArticle: 'Artículo 5 (Numerales 6-10) y Capítulo III (Deber de Prevención y SST)',
      },
      {
        id: 'opt-2-err-1',
        text: 'Marcela tiene la razón: el derecho a la educación prima absolutamente sobre cualquier protocolo de seguridad industrial en talleres pesados.',
        isCorrect: false,
        explanation:
          'Falso. La seguridad y protección de la vida en ambientes industriales es de orden público formativo. No se permite la permanencia en zonas de riesgo sin el EPP reglamentario.',
        legalArticle: 'Capítulo III (Deberes de Seguridad en Ambientes de Aprendizaje)',
      },
      {
        id: 'opt-2-err-2',
        text: 'Marcela debe ser sancionada de por vida sin posibilidad de volver a estudiar ninguna carrera técnica.',
        isCorrect: false,
        explanation:
          'Desproporcionado. Las medidas iniciales en estos casos son de carácter formativo y pedagógico (llamado de atención y plan de mejoramiento), no sanciones extremas inmediatas.',
        legalArticle: 'Capítulo V (Medidas Formativas Preventivas)',
      },
    ],
    xpReward: 150,
    badgeName: 'Custodio de Convivencia y SST',
  },
  {
    id: 'caso-virtual-suplantacion',
    title: 'Caso 3: Suplantación en Plataforma Virtual Zajuna',
    program: 'Gestión Contable y de Información Financiera',
    apprenticeRole: 'Aprendiz Virtual',
    situation:
      'Carlos le pagó dinero a un tercero para que ingresara con su usuario y contraseña a la plataforma institucional de formación virtual (LMS / Zajuna) a presentar evaluaciones y subir talleres de contabilidad durante dos meses.',
    question:
      '¿Qué consecuencia jurídica establece el Acuerdo 0009 de 2024 para la suplantación de identidad en plataformas digitales?',
    options: [
      {
        id: 'opt-3-correct',
        text: 'Es una falta gravísima tipificada en las prohibiciones expresas del Capítulo III. Inicia proceso sancionatorio formal ante el Comité con probable cancelación de matrícula e inhabilidad de 6 a 24 meses.',
        isCorrect: true,
        explanation:
          '¡Correcto! El Acuerdo 0009 de 2024 califica expresamente la suplantación de identidad en plataformas virtuales y la falsedad en evidencias como faltas gravísimas que acarrean cancelación de matrícula y posible traslado a autoridades penales competentes.',
        legalArticle: 'Capítulo III (Prohibiciones de Mayor Gravedad) y Capítulo V (Cancelación de Matrícula)',
      },
      {
        id: 'opt-3-err-1',
        text: 'Es una falta leve porque no causó daño físico a ningún compañero en el centro presencial.',
        isCorrect: false,
        explanation:
          'Incorrecto. La suplantación digital vulnera la autenticidad del acto formativo y la fe pública institucional, siendo de la más alta gravedad.',
        legalArticle: 'Capítulo III y V (Gravedad de Faltas Digitales)',
      },
      {
        id: 'opt-3-err-2',
        text: 'Solo se le exige pagar una multa económica al Centro de Formación para saldar la falta.',
        isCorrect: false,
        explanation:
          'Incorrecto. En el SENA no existen multas monetarias. Las medidas son formativas o disciplinarias sobre la condición de aprendiz.',
        legalArticle: 'Capítulo V (Régimen Sancionatorio Institucional)',
      },
    ],
    xpReward: 180,
    badgeName: 'Juez de Dilemas Éticos',
  },
  {
    id: 'caso-etapa-productiva-bitacoras',
    title: 'Caso 4: Elección de Modalidad y Bitácoras de Etapa Productiva',
    program: 'Gestión de Mercados y Comercio Exterior',
    apprenticeRole: 'Aprendiz en Etapa Productiva',
    situation:
      'Valentina finalizó su etapa lectiva y consiguió una pasantía formativa en una PyME exportadora. Sin embargo, pasaron tres meses sin radicar la concertación inicial ni las bitácoras quincenales ante su instructor asignado de seguimiento.',
    question:
      'Con base en el Capítulo IV del Acuerdo 0009 de 2024, ¿cuál es el procedimiento que debe seguir Valentina para evitar la deserción?',
    options: [
      {
        id: 'opt-4-correct',
        text: 'Debe legalizar de inmediato la alternativa elegida, concertar el plan de trabajo con su coformador e instructor, y radicar quincenalmente las bitácoras firmadas para certificar el desarrollo de competencias.',
        isCorrect: true,
        explanation:
          '¡Así es! El Acuerdo 0009 de 2024 exige el seguimiento riguroso de la etapa productiva mediante formatos y bitácoras periódicas avaladas por la empresa coformadora y el instructor de seguimiento para poder obtener el juicio evaluativo aprobado.',
        legalArticle: 'Capítulo IV (Alternativas y Seguimiento de la Etapa Productiva)',
      },
      {
        id: 'opt-4-err-1',
        text: 'No necesita entregar nada; con una carta de la empresa al final del año el sistema la certifica automáticamente.',
        isCorrect: false,
        explanation:
          'Falso. La omisión continuada de bitácoras y contacto con el instructor puede derivar en declaratoria de deserción de la etapa práctica.',
        legalArticle: 'Capítulo IV (Causales de Deserción en Etapa Productiva)',
      },
    ],
    xpReward: 160,
    badgeName: 'Estratega Productivo',
  },
];

export const INDUCTION_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question:
      '¿Cuál es el acuerdo vigente expedido por el Consejo Directivo Nacional que contiene el actual Reglamento del Aprendiz SENA?',
    category: 'Marco Jurídico Vigente',
    options: [
      'Acuerdo 0009 de 2024 (Diario Oficial No. 52.947)',
      'Acuerdo 007 de 2012 (Derogado)',
      'Resolución 2198 de 2019',
      'Decreto 1072 de 2015',
    ],
    correctIndex: 0,
    explanation:
      'El Acuerdo 0009 de 2024 es el reglamento vigente expedido por el Consejo Directivo Nacional y publicado en el Diario Oficial No. 52.947, el cual derogó expresamente el Acuerdo 007 de 2012 y sus reformas previas.',
    articleReference: 'Encabezado y Vigencia del Acuerdo 0009 de 2024',
  },
  {
    id: 2,
    question:
      '¿Cuántos derechos fundamentales del aprendiz reconoce expresamente el Artículo 5 del Acuerdo 0009 de 2024?',
    category: 'Derechos del Aprendiz',
    options: [
      '12 derechos generales',
      '24 derechos expresos',
      '5 derechos básicos',
      '50 derechos universales',
    ],
    correctIndex: 1,
    explanation:
      'El Artículo 5 del Capítulo II del Acuerdo 0009 de 2024 consagra un catálogo detallado de 24 derechos del aprendiz, que abarcan desde la inducción oportuna, acceso a TIC y dotación de EPP, hasta bienestar integral y debido proceso.',
    articleReference: 'Capítulo II — Artículo 5 del Acuerdo 0009 de 2024',
  },
  {
    id: 3,
    question:
      '¿Cuál de los siguientes principios orientadores fue incorporado en el Artículo 3 del Acuerdo 0009 de 2024 para atender las diversidades de la población colombiana?',
    category: 'Principios Orientadores',
    options: [
      'Enfoque Diferencial y Enfoque Territorial',
      'Principio de selección cerrada',
      'Principio de aislamiento formativo',
      'Exclusión programática',
    ],
    correctIndex: 0,
    explanation:
      'El Artículo 3 establece los principios de Dignidad, Inclusión, Enfoque Diferencial y Enfoque Territorial para garantizar igualdad real, no discriminación y respeto por las comunidades en todas las regiones del país.',
    articleReference: 'Capítulo I — Artículo 3 del Acuerdo 0009 de 2024',
  },
  {
    id: 4,
    question:
      'Cuando un aprendiz se matricula en un ambiente con riesgos industriales (talleres, laboratorios, maquinaria), ¿qué estipula el reglamento sobre los Elementos de Protección Personal (EPP)?',
    category: 'Seguridad y Salud en el Trabajo',
    options: [
      'El aprendiz tiene derecho a recibir la dotación requerida y el deber ineludible de usarlos permanentemente en el ambiente',
      'Los EPP son de uso voluntario y opcional a criterio del aprendiz',
      'Solo se usan si el instructor está presente físicamente',
      'No están contemplados en el reglamento del SENA',
    ],
    correctIndex: 0,
    explanation:
      'El Artículo 5 (numerales de infraestructura) consagra el derecho a contar con elementos de seguridad, en armonía con el Capítulo III que establece el deber obligatorio de portar el EPP para prevenir accidentes.',
    articleReference: 'Artículo 5 y Capítulo III (Deberes de SST) del Acuerdo 0009 de 2024',
  },
  {
    id: 5,
    question:
      '¿Cuál es la consecuencia reglamentaria de suplantar la identidad de otro aprendiz en la plataforma virtual Zajuna o aportar certificados falsificados?',
    category: 'Prohibiciones y Faltas',
    options: [
      'Constituye una falta de la mayor gravedad (gravísima) que da inicio a proceso disciplinario para posible cancelación de matrícula',
      'Es un llamado de atención verbal sin registro alguno',
      'Se castiga únicamente con perder el resultado de aprendizaje de la semana',
      'No tiene consecuencia si el aprendiz se disculpa en el foro',
    ],
    correctIndex: 0,
    explanation:
      'La suplantación de identidad física o digital y la falsedad documental están catalogadas como prohibiciones taxativas y faltas gravísimas que atentan contra la fe pública institucional.',
    articleReference: 'Capítulo III (Prohibiciones) y Capítulo V (Faltas Gravísimas)',
  },
  {
    id: 6,
    question:
      '¿Cuántos días hábiles consecutivos de inasistencia injustificada dan lugar al inicio del trámite de deserción en el SENA?',
    category: 'Permanencia y Deserción',
    options: [
      'Tres (3) días hábiles consecutivos',
      'Diez (10) días calendario',
      'Quince (15) días laborales',
      'Un (1) solo día de clase',
    ],
    correctIndex: 0,
    explanation:
      'El Capítulo IV establece que la inasistencia injustificada durante tres (3) días hábiles continuos en etapa lectiva activa la notificación y procedimiento administrativo de deserción.',
    articleReference: 'Capítulo IV (Causales y Trámite de Deserción)',
  },
  {
    id: 7,
    question:
      'Dentro del debido proceso sancionatorio, ¿de cuántos días hábiles dispone el aprendiz para presentar sus descargos por escrito ante la notificación de una queja?',
    category: 'Garantías del Debido Proceso',
    options: [
      'Cinco (5) días hábiles',
      'Veinticuatro (24) horas',
      'Veinte (20) días calendario',
      'No hay término de descargos',
    ],
    correctIndex: 0,
    explanation:
      'El Capítulo V consagra que una vez notificado formalmente con el auto de apertura, el aprendiz dispone de un término legal de cinco (5) días hábiles para presentar sus descargos y allegar pruebas.',
    articleReference: 'Capítulo V (Etapas y Términos del Debido Proceso)',
  },
  {
    id: 8,
    question:
      '¿Quién es la única autoridad competente en el Centro de Formación facultada para imponer las sanciones de Condicionamiento o Cancelación de Matrícula?',
    category: 'Régimen Sancionatorio',
    options: [
      'El Subdirector del Centro de Formación Profesional Integral',
      'Cualquier instructor técnico del área',
      'El vocero de la ficha formativa',
      'El celador o guarda de seguridad de la sede',
    ],
    correctIndex: 0,
    explanation:
      'El Subdirector de Centro es la máxima autoridad administrativa competente para sancionar mediante acto administrativo motivado, previo concepto y recomendación del Comité de Evaluación y Seguimiento.',
    articleReference: 'Capítulo V (Competencia y Acto Administrativo Sancionatorio)',
  },
  {
    id: 9,
    question:
      '¿Cuál de las siguientes NO es una alternativa válida contemplada para el desarrollo de la Etapa Productiva?',
    category: 'Etapa Productiva',
    options: [
      'Trabajo informal sin ningún tipo de convenio, registro ni aval formativo',
      'Contrato de Aprendizaje (Ley 789 de 2002)',
      'Proyecto Productivo en el marco de SENNOVA o I+D+i',
      'Pasantía en entidad pública, ONG o empresa del sector afín',
    ],
    correctIndex: 0,
    explanation:
      'La etapa productiva debe corresponder estrictamente a una de las modalidades reguladas (Contrato de aprendizaje, vínculo laboral, proyecto productivo, pasantía, monitoría) con concertación y seguimiento institucional.',
    articleReference: 'Capítulo IV (Alternativas Válidas de Etapa Productiva)',
  },
  {
    id: 10,
    question:
      'Contra la resolución expedida por el Subdirector de Centro que ordene la Cancelación de la Matrícula, ¿qué recurso legal procede?',
    category: 'Derecho a la Defensa y Recursos',
    options: [
      'Recurso de Reposición ante el mismo Subdirector de Centro dentro del término legal',
      'No procede ningún recurso administrativo',
      'Demanda civil inmediata ante juzgados de familia',
      'Queja verbal en redes sociales',
    ],
    correctIndex: 0,
    explanation:
      'En garantía del debido proceso y derecho de contradicción, contra el acto sancionatorio de cancelación de matrícula procede el Recurso de Reposición ante el Subdirector de Centro.',
    articleReference: 'Capítulo V (Recursos de Ley y Firmeza de Actos Administrativos)',
  },
];

export const SENA_BADGES: Badge[] = [
  {
    id: 'badge-1',
    name: 'Iniciado SENA (Acuerdo 0009/2024)',
    description: 'Exploraste los principios y capítulos rectores del nuevo Reglamento del Aprendiz vigente.',
    iconName: 'Sparkles',
    requirement: 'Explorar al menos 3 artículos en el explorador normativo.',
    unlocked: true,
  },
  {
    id: 'badge-2',
    name: 'Defensor de los 24 Derechos',
    description: 'Comprendiste en profundidad los derechos formativos, de bienestar y debido proceso del Art. 5.',
    iconName: 'ShieldCheck',
    requirement: 'Revisar la sección de derechos y completar un caso de garantías.',
    unlocked: false,
  },
  {
    id: 'badge-3',
    name: 'Custodio de Convivencia y SST',
    description: 'Demostraste dominio de los deberes de seguridad, cuidado de bienes y netiqueta.',
    iconName: 'Award',
    requirement: 'Aprobar el caso práctico de seguridad y uso de EPP.',
    unlocked: false,
  },
  {
    id: 'badge-4',
    name: 'Juez de Dilemas Éticos',
    description: 'Resolviste con éxito los casos reales del Tribunal Disciplinario y Formativo.',
    iconName: 'Scale',
    requirement: 'Completar los casos prácticos con puntuación superior a 80%.',
    unlocked: false,
  },
  {
    id: 'badge-5',
    name: 'Estratega Productivo',
    description: 'Conoces las alternativas de etapa productiva y el régimen de prevención de deserción.',
    iconName: 'Briefcase',
    requirement: 'Explorar la etapa productiva y contestar correctamente sus preguntas.',
    unlocked: false,
  },
  {
    id: 'badge-6',
    name: 'Líder Integral de Inducción',
    description: 'Superaste la evaluación contrarreloj con 80%+ y desbloqueaste tu Certificado Digital Oficial.',
    iconName: 'GraduationCap',
    requirement: 'Aprobar la evaluación final del Acuerdo 0009 de 2024 con mínimo 80%.',
    unlocked: false,
  },
];

export const POPULAR_SENA_PROGRAMS = [
  'Análisis y Desarrollo de Software (ADSO)',
  'Gestión Contable y de Información Financiera',
  'Mantenimiento Mecatrónico Industrial',
  'Gestión del Talento Humano',
  'Gestión Integral del Transporte y Logística',
  'Producción Multimedia y Animación Digital',
  'Desarrollo de Medios Gráficos Visuales',
  'Operaciones Comerciales en Retail',
  'Sistemas Teleinformáticos',
  'Enfermería y Servicios de Salud',
  'Gestión de Redes de Datos',
  'Mantenimiento de Motores Diésel y Gasolina',
];

export const SENA_REGIONALES = [
  'Regional Distrito Capital — Complejo Paloquemao / Cazucá',
  'Regional Antioquia — Complejo Central Medellín',
  'Regional Valle del Cauca — Centro de Diseño Tecnológico Industrial',
  'Regional Santander — Centro de Formación Bucaramanga',
  'Regional Atlántico — Centro Colombo Alemán',
  'Regional Cundinamarca — Centro de Desarrollo Agroempresarial',
  'Regional Bolívar — Centro para el Desarrollo de la Pesca y la Industria',
  'Regional Risaralda — Centro de Diseño e Innovación Tecnológica',
  'Regional Caldas — Centro de Automatización Industrial',
  'Regional Huila — Centro de la Industria, la Empresa y los Servicios',
  'Regional Boyacá — Centro Minero Sogamoso',
  'Regional Nariño — Centro Internacional de Producción Limpia Lope',
];
