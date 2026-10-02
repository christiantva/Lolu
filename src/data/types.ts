export type RegionId = 'peru' | 'cneb' | 'latam' | 'global'

export interface Question {
  id: string
  region: RegionId
  /** Tipo de pregunta: caso aplicado, dato puntual o verdadero/falso */
  kind: 'caso' | 'dato' | 'vf'
  q: string
  options: string[]
  /** índice de la opción correcta dentro de `options` */
  answer: number
  explain: string
}

export interface Scroll {
  id: string
  region: RegionId
  icon: string
  title: string
  points: string[]
  /** Truco para recordar */
  tip?: string
}

export interface PairSet {
  region: RegionId
  title: string
  pairs: [string, string][]
}

export interface SortSet {
  region: RegionId
  title: string
  prompt: string
  categories: string[]
  items: { text: string; cat: number }[]
}

export type MonsterKind =
  | 'slime'
  | 'goblin'
  | 'golem'
  | 'bat'
  | 'mushroom'
  | 'hydra'
  | 'skull'
  | 'serpent'
  | 'jaguar'
  | 'yeti'
  | 'paperdragon'
  | 'dragon'
  | 'examiner'

export interface MonsterDef {
  id: string
  name: string
  kind: MonsterKind
  hue: number
  hits: number
  attack: number
  taunt: string
  boss?: boolean
}

export interface RegionDef {
  id: RegionId
  session: number
  name: string
  realm: string
  subtitle: string
  emoji: string
  colors: { from: string; to: string; accent: string; glow: string }
  npc: { name: string; kind: 'condor' | 'tree' | 'toucan' | 'owl'; lines: string[] }
  minions: MonsterDef[]
  boss: MonsterDef
}
