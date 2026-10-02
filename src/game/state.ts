import type { RegionId } from '../data/types'

export type HeroClass = 'paladin' | 'arcanista' | 'trotamundos' | 'guia'

export interface HeroLook {
  skin: number
  hair: number
  style: number
}

export interface RegionProgress {
  battles: number // combates ganados (0-2)
  memory: number // estrellas en memoria (0-3)
  sort: number // estrellas en clasificador (0-3)
  boss: number // estrellas contra el jefe (0 = no derrotado)
  readScrolls: string[]
}

export interface Stats {
  c: number // aciertos
  w: number // errores
  last: number // timestamp último error (para repaso)
}

export interface GameState {
  version: 1
  name: string
  cls: HeroClass
  look: HeroLook
  level: number
  xp: number
  gold: number
  hp: number
  items: { potion: number; scroll: number; shield: number }
  regions: Record<RegionId, RegionProgress>
  finalBoss: number
  qstats: Record<string, Stats>
  correct: number
  wrong: number
  bestStreak: number
  achievements: string[]
  bestExam: number
  muted: boolean
  createdAt: number
}

export const CLASSES: Record<HeroClass, { name: string; title: string; perk: string; color: string; color2: string; icon: string }> = {
  paladin: { name: 'Paladín de la Ley', title: 'Defensa', perk: '+30 PV máximos y recibe 20 % menos daño.', color: '#f5b83d', color2: '#b8661b', icon: '🛡️' },
  arcanista: { name: 'Arcanista del Currículo', title: 'Sabiduría', perk: 'Cada combate empieza con 1 Pergamino de Sabiduría extra (elimina 2 opciones).', color: '#a77bff', color2: '#5a2fc2', icon: '🔮' },
  trotamundos: { name: 'Trotamundos Pedagógico', title: 'Astucia', perk: 'Crítico desde racha ×2 y +25 % de oro.', color: '#34d399', color2: '#0f766e', icon: '🧭' },
  guia: { name: 'Guía de la Inclusión', title: 'Sanación', perk: 'Recupera 6 PV con cada respuesta correcta.', color: '#ff7eb6', color2: '#c0266d', icon: '💗' },
}

export const SKINS = ['#ffe0c7', '#f1c27d', '#c68642', '#8d5524']
export const HAIRS = ['#2b1b12', '#6b3e1f', '#d9a441', '#c23b22', '#4b3b8f']

const emptyRegion = (): RegionProgress => ({ battles: 0, memory: 0, sort: 0, boss: 0, readScrolls: [] })

export function newGame(name: string, cls: HeroClass, look: HeroLook): GameState {
  const s: GameState = {
    version: 1,
    name,
    cls,
    look,
    level: 1,
    xp: 0,
    gold: 30,
    hp: 0,
    items: { potion: 2, scroll: 1, shield: 1 },
    regions: { peru: emptyRegion(), cneb: emptyRegion(), latam: emptyRegion(), global: emptyRegion() },
    finalBoss: 0,
    qstats: {},
    correct: 0,
    wrong: 0,
    bestStreak: 0,
    achievements: [],
    bestExam: 0,
    muted: false,
    createdAt: Date.now(),
  }
  s.hp = maxHp(s)
  return s
}

export const maxHp = (s: Pick<GameState, 'level' | 'cls'>) => 100 + (s.level - 1) * 12 + (s.cls === 'paladin' ? 30 : 0)
export const xpForNext = (level: number) => 80 + (level - 1) * 45
export const attackPower = (level: number) => 100 + (level - 1) * 8

const KEY = 'cronicas-del-maestro:v1'

export function load(): GameState | null {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    const s = JSON.parse(raw) as GameState
    if (s.version !== 1) return null
    return s
  } catch {
    return null
  }
}

export function save(s: GameState) {
  try {
    localStorage.setItem(KEY, JSON.stringify(s))
  } catch {
    /* almacenamiento no disponible: el juego sigue en memoria */
  }
}

export function wipe() {
  try {
    localStorage.removeItem(KEY)
  } catch {
    /* noop */
  }
}

/** Añade XP y resuelve subidas de nivel. Devuelve cuántos niveles se subieron. */
export function gainXp(s: GameState, amount: number): number {
  let ups = 0
  s.xp += amount
  while (s.xp >= xpForNext(s.level)) {
    s.xp -= xpForNext(s.level)
    s.level += 1
    ups += 1
  }
  if (ups) s.hp = maxHp(s)
  return ups
}

export const totalScore = (s: GameState) => {
  const stars = Object.values(s.regions).reduce((a, r) => a + r.memory + r.sort + r.boss, 0) + s.finalBoss
  return s.correct * 10 + stars * 50 + (s.level - 1) * 100 + s.bestExam * 20
}

export const regionUnlocked = (s: GameState, idx: number, order: RegionId[]) => idx === 0 || s.regions[order[idx - 1]].boss > 0
