import type { PairSet, RegionId, SortSet } from './types'

export const PAIRS: PairSet[] = [
  {
    region: 'peru', title: 'Runas del Valle',
    pairs: [
      ['Ley N° 28044', 'Estructura del sistema'],
      ['Etapas', 'Básica y Superior'],
      ['Niveles EBR', 'Inicial · Primaria · Secundaria'],
      ['EBA', 'Segunda oportunidad'],
      ['EBE', 'CEBE y PRITE'],
      ['Primaria', '6 grados'],
    ],
  },
  {
    region: 'cneb', title: 'Runas del Bosque',
    pairs: [
      ['CNEB 2016', 'Enfoque por competencias'],
      ['Competencia', 'Actuar pertinente y ético'],
      ['Aprendizaje situado', 'Situaciones reales'],
      ['Evaluación formativa', 'Retroalimentación'],
      ['Enfoques transversales', '7'],
      ['Perfil de egreso', '11 aprendizajes'],
    ],
  },
  {
    region: 'latam', title: 'Runas de la Selva',
    pairs: [
      ['Brasil', 'BNCC'],
      ['México', 'Nueva Escuela Mexicana'],
      ['Competencias BNCC', '10 generales'],
      ['Ed. Fundamental', '6 a 15 años'],
      ['NEM', 'Humanismo'],
      ['Docente brasileño', 'LDBEN'],
    ],
  },
  {
    region: 'global', title: 'Runas de las Cumbres',
    pairs: [
      ['Finlandia', 'Básica de 9 años'],
      ['Singapur', 'Primaria de 6 años'],
      ['NIE', 'Formación docente'],
      ['PSLE', 'Examen de salida'],
      ['Maestría', 'Docente finlandés'],
      ['Foundation stage', '4 años'],
    ],
  },
]

export const SORTS: SortSet[] = [
  {
    region: 'peru', title: 'Clasificador de la Ley',
    prompt: '¿Es una ETAPA, un NIVEL o una MODALIDAD?',
    categories: ['Etapa', 'Nivel', 'Modalidad'],
    items: [
      { text: 'Educación Básica', cat: 0 },
      { text: 'Educación Superior', cat: 0 },
      { text: 'Inicial', cat: 1 },
      { text: 'Primaria', cat: 1 },
      { text: 'Secundaria', cat: 1 },
      { text: 'Educación Básica Regular', cat: 2 },
      { text: 'Educación Básica Alternativa', cat: 2 },
      { text: 'Educación Básica Especial', cat: 2 },
    ],
  },
  {
    region: 'cneb', title: 'Clasificador del Currículo',
    prompt: '¿Es un FUNDAMENTO del enfoque, un ENFOQUE TRANSVERSAL o un APRENDIZAJE del perfil?',
    categories: ['Fundamento', 'Enfoque transversal', 'Aprendizaje del perfil'],
    items: [
      { text: 'Aprendizaje situado', cat: 0 },
      { text: 'Evaluación formativa', cat: 0 },
      { text: 'Autonomía y protagonismo', cat: 0 },
      { text: 'Igualdad de género', cat: 1 },
      { text: 'Orientación al bien común', cat: 1 },
      { text: 'Búsqueda de la excelencia', cat: 1 },
      { text: 'Intercultural', cat: 1 },
      { text: 'Aprovecha responsablemente las TIC', cat: 2 },
      { text: 'Practica una vida activa y saludable', cat: 2 },
      { text: 'Gestiona proyectos de emprendimiento', cat: 2 },
    ],
  },
  {
    region: 'latam', title: 'Clasificador de las Coronas',
    prompt: '¿Pertenece a BRASIL o a MÉXICO?',
    categories: ['Brasil 🇧🇷', 'México 🇲🇽'],
    items: [
      { text: 'BNCC', cat: 0 },
      { text: 'LDBEN', cat: 0 },
      { text: 'Creche y UMEI', cat: 0 },
      { text: 'Años iniciales y finales', cat: 0 },
      { text: 'Competencia: cultura digital', cat: 0 },
      { text: 'Nueva Escuela Mexicana', cat: 1 },
      { text: 'Humanismo como eje central', cat: 1 },
      { text: 'Cultura de paz', cat: 1 },
      { text: 'Educación Media Superior', cat: 1 },
      { text: 'Docente: agente de transformación', cat: 1 },
    ],
  },
  {
    region: 'global', title: 'Clasificador de las Cumbres',
    prompt: '¿Pertenece a FINLANDIA o a SINGAPUR?',
    categories: ['Finlandia 🇫🇮', 'Singapur 🇸🇬'],
    items: [
      { text: 'Maestría obligatoria', cat: 0 },
      { text: 'Máximo 24 alumnos por clase', cat: 0 },
      { text: 'Sin exámenes estandarizados', cat: 0 },
      { text: 'Economía doméstica', cat: 0 },
      { text: 'Menos tareas, más bienestar', cat: 0 },
      { text: 'Examen PSLE', cat: 1 },
      { text: 'Formación en el NIE', cat: 1 },
      { text: '100 horas de perfeccionamiento', cat: 1 },
      { text: 'Foundation y Orientation stage', cat: 1 },
      { text: 'Desired Outcomes of Education', cat: 1 },
    ],
  },
]

export const pairsFor = (r: RegionId) => PAIRS.find((p) => p.region === r)!
export const sortFor = (r: RegionId) => SORTS.find((s) => s.region === r)!

/** Tabla comparativa del Grimorio */
export const COMPARE_TABLE = {
  cols: ['🇵🇪 Perú', '🇧🇷 Brasil', '🇲🇽 México', '🇫🇮 Finlandia', '🇸🇬 Singapur'],
  rows: [
    { label: 'Nombre de la primaria', vals: ['Educación Primaria (nivel de la EBR)', 'Educación Fundamental', 'Primaria (Educación Básica)', 'Escuela básica', 'Primary education'] },
    { label: 'Duración', vals: ['6 grados (6 a 11/12 años)', '9 años (6 a 15): iniciales 1.º-5.º y finales 6.º-9.º', 'Primaria dentro de la Educación Básica (Preescolar → Primaria → Secundaria)', '9 años (7 a 16): 6 inferior + 3 superior', '6 años: Foundation (4) + Orientation (2)'] },
    { label: 'Documento clave', vals: ['Ley 28044 · CNEB 2016', 'BNCC · LDBEN', 'Nueva Escuela Mexicana', 'Currículo nacional 2016', 'Desired Outcomes of Education (MOE)'] },
    { label: 'Enfoque', vals: ['Por competencias + 7 enfoques transversales', 'Desarrollo integral, 10 competencias, protagonismo y contextualización', 'Humanista: centralidad del estudiante, cultura de paz, interculturalidad', 'Aprendizaje, bienestar, inclusión', 'Base sólida + valores; alta exigencia'] },
    { label: 'Perfil docente', vals: ['Marco del Buen Desempeño Docente (4 dominios)', 'Licenciatura en Pedagogía (iniciales); mediador, evaluación formativa', 'Compromiso ético, facilitador, agente de transformación', 'Maestría obligatoria, prestigio, autonomía, investigación', 'NIE, tercio superior, 100 h anuales, investigación-acción'] },
    { label: 'Perfil de egreso', vals: ['11 aprendizajes', '10 competencias generales', '10 rasgos', 'Competencias para la vida, autonomía, bienestar, ciudadanía global', '4 áreas: segura, autodirigido, contribuyente, ciudadano'] },
    { label: 'Dato estrella', vals: ['Etapas, niveles y modalidades', 'Obligatoria de 4 a 17 años', 'Media Superior con salidas terminales', 'Solo el 0,4 % no termina', 'Examen PSLE al final'] },
  ],
}
