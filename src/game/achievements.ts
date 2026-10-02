import type { GameState } from './state'

export interface Achievement {
  id: string
  icon: string
  name: string
  desc: string
  test: (s: GameState) => boolean
}

const bosses = (s: GameState) => Object.values(s.regions).filter((r) => r.boss > 0).length

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first-blood', icon: '⚔️', name: 'Primera lección', desc: 'Gana tu primer combate.', test: (s) => Object.values(s.regions).some((r) => r.battles > 0) },
  { id: 'scholar', icon: '📚', name: 'Ratón de biblioteca', desc: 'Lee 12 pergaminos.', test: (s) => Object.values(s.regions).reduce((a, r) => a + r.readScrolls.length, 0) >= 12 },
  { id: 'all-scrolls', icon: '🗞️', name: 'Archivista real', desc: 'Lee todos los pergaminos.', test: (s) => Object.values(s.regions).reduce((a, r) => a + r.readScrolls.length, 0) >= 24 },
  { id: 'streak5', icon: '🔥', name: 'En llamas', desc: 'Logra una racha de 5 aciertos.', test: (s) => s.bestStreak >= 5 },
  { id: 'streak10', icon: '☄️', name: 'Imparable', desc: 'Logra una racha de 10 aciertos.', test: (s) => s.bestStreak >= 10 },
  { id: 'boss1', icon: '🏔️', name: 'Guardián de la 28044', desc: 'Derrota al Golem del Caos Burocrático.', test: (s) => s.regions.peru.boss > 0 },
  { id: 'boss2', icon: '🌳', name: 'Doma de hidras', desc: 'Derrota a la Hidra de la Memorización.', test: (s) => s.regions.cneb.boss > 0 },
  { id: 'boss3', icon: '🐆', name: 'Corazón de jaguar', desc: 'Derrota al Jaguar de la Desigualdad.', test: (s) => s.regions.latam.boss > 0 },
  { id: 'boss4', icon: '🐉', name: 'Matadragones', desc: 'Derrota al Dragón del Examen Estandarizado.', test: (s) => s.regions.global.boss > 0 },
  { id: 'all-bosses', icon: '👑', name: 'Soberanía de los 4 reinos', desc: 'Derrota a los 4 jefes.', test: (s) => bosses(s) >= 4 },
  { id: 'final', icon: '🏆', name: 'Leyenda docente', desc: 'Vence al Gran Examinador.', test: (s) => s.finalBoss > 0 },
  { id: 'perfect-boss', icon: '⭐', name: 'Victoria impecable', desc: 'Derrota a un jefe con 3 estrellas.', test: (s) => Object.values(s.regions).some((r) => r.boss >= 3) },
  { id: 'memory', icon: '🧠', name: 'Memoria de elefante', desc: 'Consigue 3 estrellas en un juego de runas.', test: (s) => Object.values(s.regions).some((r) => r.memory >= 3) },
  { id: 'sorter', icon: '🗂️', name: 'Orden y progreso', desc: 'Consigue 3 estrellas en un clasificador.', test: (s) => Object.values(s.regions).some((r) => r.sort >= 3) },
  { id: 'lvl5', icon: '✨', name: 'Rango avanzado', desc: 'Alcanza el nivel 5.', test: (s) => s.level >= 5 },
  { id: 'lvl10', icon: '🌟', name: 'Rango archimaestro', desc: 'Alcanza el nivel 10.', test: (s) => s.level >= 10 },
  { id: 'oracle', icon: '🔮', name: 'Favor del Oráculo', desc: 'Saca 16/20 o más en la Prueba del Oráculo.', test: (s) => s.bestExam >= 16 },
  { id: 'oracle20', icon: '💯', name: 'Veinte de veinte', desc: 'Saca 20/20 en la Prueba del Oráculo.', test: (s) => s.bestExam >= 20 },
  { id: 'hundred', icon: '💎', name: 'Cien verdades', desc: 'Responde bien 100 preguntas.', test: (s) => s.correct >= 100 },
]

/** Devuelve los logros recién desbloqueados y los marca en el estado. */
export function checkAchievements(s: GameState): Achievement[] {
  const fresh = ACHIEVEMENTS.filter((a) => !s.achievements.includes(a.id) && a.test(s))
  s.achievements.push(...fresh.map((a) => a.id))
  return fresh
}
