import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { checkAchievements, type Achievement } from './achievements'
import { load, save, type GameState } from './state'
import { setMuted } from './sound'

interface Toast {
  id: number
  icon: string
  title: string
  body?: string
}

interface Store {
  state: GameState | null
  setState: (s: GameState | null) => void
  /** Modifica una copia del estado, guarda y revisa logros. */
  update: (fn: (s: GameState) => void) => void
  toasts: Toast[]
  toast: (t: Omit<Toast, 'id'>) => void
}

const Ctx = createContext<Store | null>(null)

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, setStateRaw] = useState<GameState | null>(() => load())
  const [toasts, setToasts] = useState<Toast[]>([])
  const nextId = useRef(1)

  const toast = useCallback((t: Omit<Toast, 'id'>) => {
    const id = nextId.current++
    setToasts((ts) => [...ts, { ...t, id }])
    setTimeout(() => setToasts((ts) => ts.filter((x) => x.id !== id)), 3600)
  }, [])

  const announce = useCallback((fresh: Achievement[]) => {
    fresh.forEach((a) => toast({ icon: a.icon, title: `¡Logro: ${a.name}!`, body: a.desc }))
  }, [toast])

  const ref = useRef(state)
  ref.current = state

  const setState = useCallback((s: GameState | null) => {
    ref.current = s
    setStateRaw(s)
    if (s) save(s)
  }, [])

  // `update` trabaja sobre la copia síncrona en `ref`: permite encadenar varios
  // `update` en el mismo tick y leer resultados (p. ej. subidas de nivel) al instante.
  const update = useCallback((fn: (s: GameState) => void) => {
    const prev = ref.current
    if (!prev) return
    const next: GameState = structuredClone(prev)
    fn(next)
    const fresh = checkAchievements(next)
    if (fresh.length) announce(fresh)
    save(next)
    ref.current = next
    setStateRaw(next)
  }, [announce])

  useEffect(() => {
    setMuted(!!state?.muted)
  }, [state?.muted])

  return <Ctx.Provider value={{ state, setState, update, toasts, toast }}>{children}</Ctx.Provider>
}

export function useGame() {
  const c = useContext(Ctx)
  if (!c) throw new Error('useGame fuera de GameProvider')
  return c
}

/** Para pantallas que solo existen con partida creada. */
export function useHero() {
  const g = useGame()
  return { ...g, state: g.state as GameState }
}
