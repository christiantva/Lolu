import type { Scroll } from './types'

export const SCROLLS: Scroll[] = [
  // ───────────── SESIÓN 1 · SISTEMA EDUCATIVO PERUANO ─────────────
  {
    id: 'p1', region: 'peru', icon: '📜', title: 'La base legal',
    points: [
      'La estructura del Sistema Educativo Peruano está establecida en la **Ley General de Educación N° 28044** (Congreso de la República, 2003).',
      'El sistema se organiza en **ETAPAS**, **NIVELES** y **MODALIDADES**.',
    ],
    tip: 'Piensa en "E-N-M": Etapas → Niveles → Modalidades.',
  },
  {
    id: 'p2', region: 'peru', icon: '🪜', title: 'Etapas (Art. 29)',
    points: [
      'Son **periodos progresivos** en que se divide el sistema educativo. Se estructuran y desarrollan según las necesidades de aprendizaje de los estudiantes.',
      'Hay **2 etapas**: **Educación Básica** y **Educación Superior**.',
      '**Educación Básica:** favorece el desarrollo integral del estudiante, el despliegue de sus potencialidades y el desarrollo de capacidades, conocimientos, actitudes y valores.',
      '**Educación Superior:** se dedica a la investigación, la creación y la difusión de conocimientos, a la proyección a la comunidad y al logro de competencias profesionales de alto nivel.',
      'La Educación Superior puede ser **universitaria** o **no universitaria** (institutos pedagógicos y tecnológicos).',
    ],
    tip: 'Hermana en primaria + primo en la universidad = viven ETAPAS distintas.',
  },
  {
    id: 'p3', region: 'peru', icon: '📶', title: 'Niveles (Art. 36)',
    points: [
      'Son **periodos graduales** del proceso educativo, articulados dentro de las etapas.',
      '**Inicial:** programa escolarizado (jardín) de **3 a 5 años**. Su objetivo es el desarrollo integral temprano en lo físico, emocional, cognitivo y social.',
      '**Primaria:** de **6 a 11/12 años** aprox. Dura **6 grados** (1.º a 6.º). Su objetivo es desarrollar competencias básicas: **lectura, escritura, cálculo matemático y habilidades sociales**.',
      '**Secundaria:** de **12 a 16/17 años**. Dura **5 años**. Su objetivo es profundizar aprendizajes y desarrollar pensamiento crítico, autonomía y preparación para la educación superior o la inserción laboral.',
    ],
    tip: 'Inicial 3 · Primaria 6 · Secundaria 5 → "3-6-5", como los días del año.',
  },
  {
    id: 'p4', region: 'peru', icon: '🧭', title: 'Modalidades',
    points: [
      'Son **alternativas de atención educativa** que se organizan según las características específicas de las personas a quienes se destina el servicio.',
      '**EBR (Básica Regular):** niños, niñas y adolescentes en edad escolar. Niveles: Inicial, Primaria y Secundaria. Brinda formación integral, progresiva y continua. Ámbitos urbano y rural.',
      '**EBA (Básica Alternativa):** jóvenes y adultos que no accedieron a la educación básica o no la concluyeron en la edad regular. Niveles: **Inicial, Intermedio** (equivale a primaria) y **Avanzado** (equivale a secundaria). Formas de atención: presencial, semipresencial y a distancia. Es una **segunda oportunidad educativa flexible**.',
      '**EBE (Básica Especial):** personas con discapacidad severa, multidiscapacidad o **talentos excepcionales**. Niveles Inicial y Primaria (puede continuar en secundaria con adaptaciones). Se atiende en **CEBE**, aulas inclusivas, **PRITE** y servicios de apoyo y asesoramiento. Busca una educación inclusiva, equitativa y de calidad.',
    ],
    tip: 'R = Regular (edad escolar) · A = Alternativa (segunda oportunidad) · E = Especial (necesita apoyos).',
  },
  {
    id: 'p5', region: 'peru', icon: '🛠️', title: 'Otras piezas del esquema',
    points: [
      '**Educación Técnico-Productiva:** ciclos **Básico** y **Medio**. Se imparte en los **CETPRO** (Centros de Educación Técnico-Productiva) y forma para el trabajo.',
      '**EIB (Educación Intercultural Bilingüe):** el estudiante aprende en su lengua originaria (por ejemplo, quechua) y en castellano, con saberes de su cultura.',
      'La **progresión de los aprendizajes** ocurre dentro de un mismo nivel. En primaria, por ejemplo, se pasa de imágenes y frases simples a analizar textos y argumentar.',
    ],
  },
  {
    id: 'p6', region: 'peru', icon: '🔎', title: 'Casos clave de la sesión',
    points: [
      '**María:** juega en inicial, aprende a leer en primaria, cursa secundaria y luego va a la universidad. Recorre los **niveles** de la EBR y pasa a la **etapa** de Educación Superior.',
      '**Andrea, Diego, Lucía y Juan:** viven experiencias distintas (regular, flexible, con adaptaciones, bilingüe). Esas diferencias corresponden a las **modalidades** y formas de atención.',
      '**Persona que solo llegó a 4.º grado:** debe optar por la **EBA** para culminar su formación. No le corresponde quedarse en alfabetización ni ir a un CETPRO.',
      '**Estudiante con apoyos permanentes y especialista:** le corresponde la **Educación Básica Especial**.',
    ],
  },

  // ───────────── SESIÓN 2 · CNEB ─────────────
  {
    id: 'c1', region: 'cneb', icon: '🎯', title: 'Enfoque por competencias',
    points: [
      'Según el **Currículo Nacional de la Educación Básica (CNEB, MINEDU 2016)**, la educación en el Perú se desarrolla bajo el **enfoque por competencias**.',
      'Una **competencia** es la combinación de capacidades que movilizamos de manera integral para **actuar de manera pertinente y ética** en diferentes situaciones de la vida.',
      'En pocas palabras: **"No solo sé, también puedo y actúo con sentido."**',
    ],
    tip: 'Saber qué es el equilibrio NO basta para construir la torre: hay que movilizar saberes. Eso es actuar competente.',
  },
  {
    id: 'c2', region: 'cneb', icon: '🧩', title: '5 fundamentos del enfoque',
    points: [
      '**1. Aprendizaje situado:** el aprendizaje cobra sentido en situaciones reales y contextos significativos. *Ej.: investigan un problema ambiental de su comunidad.*',
      '**2. Movilización integrada de saberes:** articular conocimientos, habilidades y actitudes. *Ej.: usan matemática, comunicación y convivencia para organizar un evento.*',
      '**3. Interacción social y colaboración:** se aprende con otros, mediante diálogo y trabajo en equipo. *Ej.: debaten y elaboran una propuesta en equipo.*',
      '**4. Evaluación formativa:** acompaña y mejora el aprendizaje con retroalimentación oportuna. *Ej.: el docente retroalimenta antes de la versión final.*',
      '**5. Autonomía y protagonismo del estudiante:** rol activo, toma decisiones y reflexiona. *Ej.: planifica cómo investigará y evalúa sus avances.*',
      '**Idea clave:** las competencias se desarrollan cuando el estudiante actúa, reflexiona, interactúa y toma decisiones en situaciones reales.',
    ],
    tip: 'S-M-I-E-A: "Situado, Movilizo, Interactúo, Evalúo, Autónomo".',
  },
  {
    id: 'c3', region: 'cneb', icon: '🌈', title: 'Los 7 enfoques transversales',
    points: [
      '**De derechos:** reconoce a los estudiantes como sujetos de derechos y promueve la democracia.',
      '**Inclusivo o de atención a la diversidad:** todos tienen derecho a oportunidades educativas de igual calidad, sin exclusión.',
      '**Intercultural:** fomenta el intercambio entre culturas en igualdad y respeto, valorando la identidad de cada una.',
      '**Igualdad de género:** mujeres y hombres tienen el mismo valor, derechos y oportunidades.',
      '**Ambiental:** promueve conciencia crítica sobre la problemática ambiental y el desarrollo sostenible.',
      '**Orientación al bien común:** solidaridad, empatía y responsabilidad con lo que es de todos.',
      '**Búsqueda de la excelencia:** dar lo mejor de sí, superación personal y adaptación al cambio.',
    ],
    tip: 'D-I-I-G-A-B-E → "Dino Iba Inventando Grandes Aventuras Bajo Estrellas".',
  },
  {
    id: 'c4', region: 'cneb', icon: '🧑‍🎓', title: 'Perfil de egreso: 11 aprendizajes (1-6)',
    points: [
      'El **perfil de egreso** describe lo que debe lograr el estudiante **al finalizar la Educación Básica** en conocimientos, habilidades, actitudes y valores.',
      '"No basta con formar estudiantes competentes… es necesario formar **personas íntegras**."',
      '**1.** Se reconoce como persona valiosa y se identifica con su cultura.',
      '**2.** Propicia la vida en democracia a partir del reconocimiento de sus derechos y deberes.',
      '**3.** Practica una vida activa y saludable para su bienestar.',
      '**4.** Aprecia manifestaciones artístico-culturales y crea proyectos artísticos.',
      '**5.** Se comunica en su lengua materna, en castellano como segunda lengua y en inglés.',
      '**6.** Indaga y comprende el mundo natural y artificial (con conocimientos científicos).',
    ],
  },
  {
    id: 'c5', region: 'cneb', icon: '🧑‍🎓', title: 'Perfil de egreso: 11 aprendizajes (7-11)',
    points: [
      '**7.** Interpreta la realidad y toma decisiones a partir de conocimientos matemáticos.',
      '**8.** Gestiona proyectos de emprendimiento económico o social de manera ética.',
      '**9.** Aprovecha responsablemente las tecnologías de la información y la comunicación (TIC).',
      '**10.** Desarrolla procesos autónomos de aprendizaje en forma permanente.',
      '**11.** Comprende y aprecia la dimensión espiritual y religiosa.',
    ],
    tip: 'Son 11 aprendizajes y 7 enfoques transversales: "11 metas, 7 caminos".',
  },
  {
    id: 'c6', region: 'cneb', icon: '👩‍🏫', title: 'Perfil docente (complemento)',
    points: [
      'El perfil docente en el Perú se orienta con el **Marco del Buen Desempeño Docente (MINEDU, 2014)**.',
      'Tiene **4 dominios**, **9 competencias** y **40 desempeños**.',
      'Dominios: **(1)** Preparación para el aprendizaje de los estudiantes · **(2)** Enseñanza para el aprendizaje de los estudiantes · **(3)** Participación en la gestión de la escuela articulada a la comunidad · **(4)** Desarrollo de la profesionalidad y la identidad docente.',
    ],
    tip: 'Este pergamino es material de apoyo: el MBDD aparece en las referencias de la sesión 2.',
  },

  // ───────────── SESIÓN 3 · BRASIL Y MÉXICO ─────────────
  {
    id: 'l1', region: 'latam', icon: '🇧🇷', title: 'Brasil: estructura',
    points: [
      'La escolarización es **obligatoria y gratuita de los 4 a los 17 años**.',
      '**Educación Infantil:** guardería ("creche") hasta los 3 años y preescolar de 4 a 6 años ("UMEI").',
      '**Educación Fundamental:** de los **6 a los 15 años** (9 años), en dos ciclos: **años iniciales (1.º a 5.º, 6-11 años)** y **años finales (6.º a 9.º, 11-15 años)**.',
      'En Brasil la primaria se denomina **Educación Fundamental**. En México se denomina **Educación Básica**.',
      'Componentes curriculares: Lengua portuguesa, Arte, Educación física, Matemáticas, Ciencias, Geografía, Historia y Educación religiosa. El **inglés** se incluye en los **años finales (6.º a 9.º)**.',
    ],
  },
  {
    id: 'l2', region: 'latam', icon: '📘', title: 'Brasil: la BNCC',
    points: [
      'El principal documento es la **Base Nacional Común Curricular (BNCC)**. Establece los aprendizajes esenciales de toda la educación básica: Infantil, Fundamental y Media.',
      'Sus fundamentos son **desarrollo integral** (intelectual, físico, emocional, social y cultural), **10 competencias generales**, **protagonismo del alumno** y **contextualización** (base común + parte diversificada local).',
      'El legado de **Paulo Freire** sigue siendo referente de una educación crítica y socialmente comprometida.',
    ],
  },
  {
    id: 'l3', region: 'latam', icon: '🔟', title: 'Brasil: 10 competencias generales',
    points: [
      '**1. Conocimiento** · **2. Pensamiento científico, crítico y creativo** · **3. Repertorio cultural** · **4. Comunicación** (verbal, corporal, visual, sonora, digital y lengua de señas) · **5. Cultura digital**',
      '**6. Trabajo y proyecto de vida** · **7. Argumentación** · **8. Autoconocimiento y autocuidado** · **9. Empatía y cooperación** · **10. Responsabilidad y ciudadanía**',
      'Estas 10 competencias forman el **perfil de egreso** del estudiante brasileño.',
    ],
  },
  {
    id: 'l4', region: 'latam', icon: '👨‍🏫', title: 'Brasil: perfil docente',
    points: [
      'Lo definen la **LDBEN** (Ley de Directrices y Bases de la Educación Nacional) y la **BNCC**.',
      '**Años iniciales (1.º-5.º):** se exige como mínimo **licenciatura en Pedagogía**. De forma provisional, todavía se admite el magisterio de nivel medio (modalidad normal).',
      '**Años finales (6.º-9.º):** se exige licenciatura en el área específica (Matemáticas, Lengua Portuguesa, Historia, etc.).',
      'Competencias: dominio del contenido, planificación y **mediación**, metodologías activas, tecnología y cultura digital, **evaluación formativa** y actitud reflexiva e investigadora.',
    ],
  },
  {
    id: 'l5', region: 'latam', icon: '🇲🇽', title: 'México: la Nueva Escuela Mexicana',
    points: [
      'Se basa en un **enfoque humanista** y en los principios de la **Nueva Escuela Mexicana (NEM)**: formar ciudadanos críticos, participativos y con valores.',
      'Estructura: **Educación Básica** (Preescolar → Primaria → Secundaria), **Media Superior** (bachilleratos, profesional técnico) y **Superior** (licenciatura, especialización, maestría, doctorado).',
      '**7 fundamentos:** 1) humanismo como eje central · 2) centralidad del estudiante · 3) aprendizaje constructivo y social · 4) pensamiento crítico y resolución de problemas · 5) interculturalidad e inclusión · 6) cultura de paz · 7) evaluación como proceso para el aprendizaje.',
    ],
    tip: 'NEM = "Nadie Excluido, Mucho humanismo".',
  },
  {
    id: 'l6', region: 'latam', icon: '🎓', title: 'México: perfiles',
    points: [
      '**Perfil docente: 3 ejes.** **(1) Compromiso ético y social:** educación como derecho humano, equidad e inclusión, cultura de paz. **(2) Facilitador del aprendizaje activo y significativo:** dominio de contenidos y pedagogía, promotor del pensamiento crítico, enfoque humanista, evaluación formativa. **(3) Agente de transformación:** capacitación permanente, visión comunitaria y reflexión sobre su práctica.',
      '**Perfil de egreso: 10 rasgos.** Se comunica con confianza · pensamiento crítico y creatividad · iniciativa y colaboración · responsabilidad por su cuerpo y el ambiente · autoconocimiento y regulación de emociones · sabe de fenómenos naturales y sociales · aprecia la belleza, el arte y la cultura · formación ética y legalidad · asume su identidad e interculturalidad · habilidades digitales.',
    ],
  },

  // ───────────── SESIÓN 4 · FINLANDIA Y SINGAPUR ─────────────
  {
    id: 'g1', region: 'global', icon: '🇫🇮', title: 'Finlandia: la educación básica',
    points: [
      '"La educación es el corazón de la sociedad." Es **gratuita desde el preescolar hasta la educación superior**. El currículo nacional de **2016** se centra en el aprendizaje.',
      'Preescolar a los 6-7 años, organizado por los municipios en escuelas y jardines.',
      'La **escuela básica dura 9 años (de los 7 a los 16)**: **6 años** de etapa inferior (primaria) y **3 años** de etapa superior (secundaria inferior). Al terminar se puede hacer un curso extra opcional.',
      'Los **6 primeros años** tienen el mismo maestro. Los **3 últimos**, un maestro por materia. Hay un **máximo de 24 alumnos** por clase.',
      'Son gratuitos la enseñanza, los útiles, los libros, la atención sanitaria y la **comida**. El municipio paga el transporte si el alumno vive a más de **5 km**.',
      'Solo el **0,4 %** no termina. El calendario es de **190 días**, con semanas de **25 a 30 horas**.',
    ],
    tip: '"Menos tareas, más bienestar."',
  },
  {
    id: 'g2', region: 'global', icon: '🦉', title: 'Finlandia: perfil docente',
    points: [
      '**Elevado prestigio y estatus social:** carrera muy competitiva, a la que solo entran los mejores candidatos.',
      '**Maestría en Educación obligatoria:** mínimo **5 años** de estudios universitarios.',
      '**Autonomía y confianza:** no hay inspecciones constantes ni exámenes nacionales estandarizados. El docente adapta el currículo y elige sus materiales.',
      '**Enfoque en la investigación** y aprendizaje a lo largo de la vida. **Rol de apoyo y guía** (facilitador). **Colaboración** con educación especial, psicólogos y trabajadores sociales. **Inclusión** en aulas regulares.',
    ],
  },
  {
    id: 'g3', region: 'global', icon: '🌱', title: 'Finlandia: perfil de egreso',
    points: [
      '**Competencias para la vida:** pensamiento crítico, resolución de problemas, creatividad y colaboración.',
      '**Responsabilidad y autonomía:** pocas tareas para la casa y proyectos en horario escolar.',
      '**Habilidades socioemocionales:** cooperación, tolerancia, autoestima y bienestar.',
      '**Ciudadanía activa y global**, manejo responsable de las **TIC**, **base sólida de conocimientos** (comprender, no memorizar) y **aprendizaje permanente**.',
    ],
  },
  {
    id: 'g4', region: 'global', icon: '🇸🇬', title: 'Singapur: la primaria',
    points: [
      'Es obligatoria y gratuita a partir de los 6 años. **Dura 6 años** en dos fases: **Fase 1 · Foundation stage (4 años)** y **Fase 2 · Orientation stage (2 años)**.',
      'Su **objetivo es dual**: dar una base sólida de conocimientos y fomentar valores, actitudes y competencias para la vida.',
      'Asignaturas: inglés, lengua materna, matemáticas, ciencias, educación cívica y moral, educación física, arte y música.',
      'Al final rinden el **PSLE** (Primary School Leaving Examination), que determina sus opciones de secundaria. Si una escuela obtiene bajos resultados, se reexamina y recibe docentes "expertos" del Ministerio.',
    ],
    tip: '"Alta exigencia, alto rendimiento." Foundation 4 + Orientation 2 = 6.',
  },
  {
    id: 'g5', region: 'global', icon: '🏫', title: 'Singapur: perfil docente',
    points: [
      'Se forma en el **NIE (Instituto Nacional de Educación)**, la **única** institución autorizada, que forma parte de la Universidad Tecnológica de Nanyang. La formación inicial dura de 1 a 4 años.',
      '**Selección rigurosa:** se recluta al **tercio superior** de cada cohorte, con entrevistas, pruebas escritas y demostraciones de enseñanza.',
      'Requisitos: grado en la materia, certificado del NIE, dominio del **inglés** y de una lengua materna (**chino, malayo o tamil**) y conducta moral.',
      '**100 horas anuales** de perfeccionamiento, investigación-acción, especialización por materia, rol de facilitador y carrera flexible (liderazgo, enseñanza o investigación).',
    ],
  },
  {
    id: 'g6', region: 'global', icon: '🏅', title: 'Singapur: Desired Outcomes of Education',
    points: [
      'El MOE define el perfil de egreso en **4 grandes áreas**:',
      '**1. Persona segura de sí misma (Confident Person):** brújula moral, adaptable y resiliente, piensa de forma crítica, se comunica bien.',
      '**2. Aprendiz autodirigido (Self-directed Learner):** responsable de su aprendizaje, reflexivo, perseverante, usa la tecnología con responsabilidad.',
      '**3. Contribuyente activo (Active Contributor):** empático, colaborador, innovador, toma riesgos calculados, busca la excelencia.',
      '**4. Ciudadano preocupado (Concerned Citizen):** raíces en Singapur, conciencia cívica, responsable con su comunidad, respeta la diversidad.',
    ],
    tip: 'S-A-C-C: Segura, Autodirigido, Contribuyente, Ciudadano.',
  },
]
