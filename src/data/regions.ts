import type { MonsterDef, RegionDef, RegionId } from './types'

export const REGIONS: RegionDef[] = [
  {
    id: 'peru',
    session: 1,
    name: 'Valle de la Ley 28044',
    realm: 'Reino del Sistema Educativo Peruano',
    subtitle: 'Etapas, niveles y modalidades',
    emoji: '🏔️',
    colors: { from: '#ff7a59', to: '#7a1f5c', accent: '#ffb347', glow: 'rgba(255,140,80,.55)' },
    npc: {
      name: 'Amauta Kuntur',
      kind: 'condor',
      lines: [
        '¡Bienvenida, bienvenido al Valle! Soy Amauta Kuntur, guardián de la Ley General de Educación N° 28044.',
        'Aquí todo está ordenado en tres pilares: ETAPAS, NIVELES y MODALIDADES. Si los confundes, el Golem del Caos Burocrático te aplastará.',
        'Lee los pergaminos, vence a sus secuaces y enfréntalo. ¡El valle confía en ti!',
      ],
    },
    minions: [
      { id: 'slime-desorden', name: 'Slime del Desorden', kind: 'slime', hue: 120, hits: 4, attack: 14, taunt: '¡Etapas, niveles... todo es lo mismo! ¡Blub!' },
      { id: 'duende-ausentismo', name: 'Duende del Ausentismo', kind: 'goblin', hue: 30, hits: 5, attack: 15, taunt: '¿Educación Básica Alternativa? ¡Mejor no estudies nunca más!' },
    ],
    boss: { id: 'golem-caos', name: 'Golem del Caos Burocrático', kind: 'golem', hue: 20, hits: 8, attack: 20, taunt: '¡NADIE ENTIENDE LA ESTRUCTURA DEL SISTEMA! ¡NADIE!', boss: true },
  },
  {
    id: 'cneb',
    session: 2,
    name: 'Bosque Encantado del CNEB',
    realm: 'Reino del Currículo Nacional',
    subtitle: 'Enfoque por competencias, enfoques transversales y perfil de egreso',
    emoji: '🌳',
    colors: { from: '#2fd38a', to: '#0d3b4f', accent: '#7cffc4', glow: 'rgba(60,230,160,.5)' },
    npc: {
      name: 'Maestra Ceiba',
      kind: 'tree',
      lines: [
        'Shhh... el bosque te escucha. Soy la Maestra Ceiba, raíz del Currículo Nacional de la Educación Básica (2016).',
        'Aquí no basta con saber: hay que PODER y ACTUAR con sentido. Eso es una competencia.',
        'La Hidra de la Memorización quiere que los niños solo repitan. ¡Demuéstrale que conoces los fundamentos, los 7 enfoques transversales y los 11 aprendizajes del perfil de egreso!',
      ],
    },
    minions: [
      { id: 'murcielago-memorista', name: 'Murciélago Memorista', kind: 'bat', hue: 270, hits: 4, attack: 15, taunt: '¡Repite, repite, repite! ¡No pienses!' },
      { id: 'hongo-copia', name: 'Hongo del Copia-y-Pega', kind: 'mushroom', hue: 330, hits: 5, attack: 16, taunt: '¿Situaciones reales? ¡Copia del libro y listo!' },
    ],
    boss: { id: 'hidra-memorizacion', name: 'Hidra de la Memorización', kind: 'hydra', hue: 160, hits: 9, attack: 21, taunt: '¡Tres cabezas, cero competencias! ¡Memorizar es suficiente!', boss: true },
  },
  {
    id: 'latam',
    session: 3,
    name: 'Selva de las Dos Coronas',
    realm: 'Reinos de Brasil y México',
    subtitle: 'BNCC, Nueva Escuela Mexicana, perfiles docente y de egreso',
    emoji: '🦜',
    colors: { from: '#ffd23f', to: '#0b6e4f', accent: '#ffe066', glow: 'rgba(255,210,60,.5)' },
    npc: {
      name: 'Paulo, el Tucán',
      kind: 'toucan',
      lines: [
        '¡Olá! ¡Hola! Soy Paulo, el Tucán. Me pusieron así por Paulo Freire, referente de una educación crítica.',
        'En esta selva conviven dos coronas: BRASIL, con su Base Nacional Común Curricular (BNCC), y MÉXICO, con la Nueva Escuela Mexicana (NEM).',
        'El Jaguar de la Desigualdad acecha entre los árboles. ¡Compara bien ambos sistemas para vencerlo!',
      ],
    },
    minions: [
      { id: 'calavera-olvido', name: 'Calaverita del Olvido', kind: 'skull', hue: 45, hits: 5, attack: 16, taunt: '¿BNCC o NEM? ¡Ya ni te acuerdas, je je je!' },
      { id: 'serpiente-desinteres', name: 'Serpiente del Desinterés', kind: 'serpent', hue: 90, hits: 5, attack: 17, taunt: 'Sssss... ¿para qué comparar sistemas? Sssss...' },
    ],
    boss: { id: 'jaguar-desigualdad', name: 'Jaguar de la Desigualdad', kind: 'jaguar', hue: 35, hits: 9, attack: 22, taunt: '¡Grrr! ¡No todos merecen las mismas oportunidades!', boss: true },
  },
  {
    id: 'global',
    session: 4,
    name: 'Cumbres del Norte y Oriente',
    realm: 'Reinos de Finlandia y Singapur',
    subtitle: 'Tendencias en Europa y Asia',
    emoji: '❄️',
    colors: { from: '#7cc8ff', to: '#2b1a6b', accent: '#bfe6ff', glow: 'rgba(130,200,255,.55)' },
    npc: {
      name: 'Lumi, la Búho de las Nieves',
      kind: 'owl',
      lines: [
        'Hyvää päivää! Soy Lumi. Desde estas cumbres se ven dos modelos muy distintos.',
        'FINLANDIA: "Menos tareas, más bienestar". SINGAPUR: "Alta exigencia, alto rendimiento".',
        'El Dragón del Examen Estandarizado vigila la cima. ¡Conoce a sus docentes, sus etapas y sus perfiles de egreso para derrotarlo!',
      ],
    },
    minions: [
      { id: 'yeti-estres', name: 'Yeti del Estrés', kind: 'yeti', hue: 200, hits: 5, attack: 17, taunt: '¡Más tareas! ¡Más tareas para casa! ¡GRAAH!' },
      { id: 'dragon-papel', name: 'Dragón de Papel', kind: 'paperdragon', hue: 0, hits: 5, attack: 18, taunt: '¡Solo importan las notas del PSLE!' },
    ],
    boss: { id: 'dragon-examen', name: 'Dragón del Examen Estandarizado', kind: 'dragon', hue: 210, hits: 10, attack: 23, taunt: '¡Te mediré con UNA sola prueba! ¡Prepárate!', boss: true },
  },
]

export const FINAL_BOSS: MonsterDef = {
  id: 'gran-examinador',
  name: 'El Gran Examinador',
  kind: 'examiner',
  hue: 280,
  hits: 15,
  attack: 25,
  taunt: 'He visto los cuatro reinos. Veamos si TÚ los recuerdas todos...',
  boss: true,
}

export const regionById = (id: RegionId) => REGIONS.find((r) => r.id === id)!
