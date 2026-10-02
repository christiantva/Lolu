import type { Question } from '../data/types'
import type { GameState } from './state'

export function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/** Pregunta lista para mostrar: opciones barajadas y el índice correcto recalculado. */
export interface LiveQuestion extends Question {
  order: number[]
}

export function prepare(q: Question): LiveQuestion {
  const idx = q.options.map((_, i) => i)
  const order = q.kind === 'vf' ? idx : shuffle(idx)
  return { ...q, order, options: order.map((i) => q.options[i]), answer: order.indexOf(q.answer) }
}

/**
 * Elige preguntas priorizando las que nunca viste y las que fallaste
 * (repetición espaciada simple). Las que dominas aparecen menos.
 */
export function pickQuestions(pool: Question[], n: number, s: GameState, avoid: Set<string> = new Set()): Question[] {
  const weighted = pool
    .filter((q) => !avoid.has(q.id))
    .map((q) => {
      const st = s.qstats[q.id]
      let w = 3 // nunca vista
      if (st) w = Math.max(0.4, 1 + st.w * 2.5 - st.c * 0.6)
      return { q, key: Math.random() ** (1 / w) }
    })
    .sort((a, b) => b.key - a.key)
    .map((x) => x.q)
  const out = weighted.slice(0, n)
  if (out.length < n) out.push(...shuffle(pool).slice(0, n - out.length))
  return out
}

export function recordAnswer(s: GameState, id: string, ok: boolean) {
  const st = s.qstats[id] ?? { c: 0, w: 0, last: 0 }
  if (ok) st.c += 1
  else {
    st.w += 1
    st.last = Date.now()
  }
  s.qstats[id] = st
  if (ok) s.correct += 1
  else s.wrong += 1
}

/** Preguntas falladas que aún no se han “redimido” (más errores que aciertos ×2) */
export function weakQuestions(all: Question[], s: GameState): Question[] {
  return all.filter((q) => {
    const st = s.qstats[q.id]
    return st && st.w > 0 && st.c < st.w * 2
  })
}

export function mastery(pool: Question[], s: GameState) {
  if (!pool.length) return 0
  const m = pool.filter((q) => {
    const st = s.qstats[q.id]
    return st && st.c > st.w
  }).length
  return m / pool.length
}

export const starsFor = (acc: number) => (acc >= 0.9 ? 3 : acc >= 0.7 ? 2 : 1)
