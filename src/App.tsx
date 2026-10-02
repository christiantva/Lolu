import { AnimatePresence, motion } from 'motion/react'
import { useCallback, useState } from 'react'
import { Toasts } from './components/ui'
import { NavCtx, type Screen } from './game/nav'
import { useGame } from './game/store'
import { Achievements } from './screens/Achievements'
import { Battle } from './screens/Battle'
import { CreateHero } from './screens/CreateHero'
import { Grimoire } from './screens/Grimoire'
import { MemoryGame } from './screens/MemoryGame'
import { Oracle } from './screens/Oracle'
import { Ranking } from './screens/Ranking'
import { RegionHub } from './screens/RegionHub'
import { Shop } from './screens/Shop'
import { SortGame } from './screens/SortGame'
import { Study } from './screens/Study'
import { Title } from './screens/Title'
import { WorldMap } from './screens/WorldMap'

export default function App() {
  const { state } = useGame()
  const [screen, setScreen] = useState<Screen>({ name: 'title' })
  // cada navegación monta la pantalla de nuevo (permite "jugar otra vez")
  const [nonce, setNonce] = useState(0)
  const go = useCallback((s: Screen) => {
    setScreen(s)
    setNonce((n) => n + 1)
    window.scrollTo({ top: 0 })
  }, [])

  // Sin partida, solo se permiten título, creación y ranking
  const needsHero = !state && !['title', 'create', 'ranking'].includes(screen.name)
  const current: Screen = needsHero ? { name: 'title' } : screen

  return (
    <NavCtx.Provider value={go}>
      <AnimatePresence mode="wait">
        <motion.main
          key={nonce}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          className="relative min-h-dvh pb-10"
        >
          {render(current)}
        </motion.main>
      </AnimatePresence>
      <Toasts />
    </NavCtx.Provider>
  )
}

function render(s: Screen) {
  switch (s.name) {
    case 'title':
      return <Title />
    case 'create':
      return <CreateHero />
    case 'map':
      return <WorldMap />
    case 'region':
      return <RegionHub id={s.id} />
    case 'study':
      return <Study id={s.id} />
    case 'battle':
      return <Battle cfg={s.battle} />
    case 'memory':
      return <MemoryGame id={s.id} />
    case 'sort':
      return <SortGame id={s.id} />
    case 'grimoire':
      return <Grimoire />
    case 'shop':
      return <Shop />
    case 'ranking':
      return <Ranking />
    case 'achievements':
      return <Achievements />
    case 'oracle':
      return <Oracle />
  }
}
