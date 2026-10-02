import { AnimatePresence, motion } from 'motion/react'
import { useMemo, useState } from 'react'
import { Backdrop } from '../art/Backdrop'
import { Modal, ScreenHeader, Stars } from '../components/ui'
import { sortFor } from '../data/minigames'
import { regionById } from '../data/regions'
import type { RegionId } from '../data/types'
import { shuffle } from '../game/engine'
import { useNav } from '../game/nav'
import { sfx } from '../game/sound'
import { gainXp } from '../game/state'
import { useHero } from '../game/store'

/** Clasificador: cada concepto aparece en una carta y se envía al cofre correcto. */
export function SortGame({ id }: { id: RegionId }) {
  const r = regionById(id)
  const set = sortFor(id)
  const { update } = useHero()
  const go = useNav()
  const items = useMemo(() => shuffle(set.items), [set])
  const [i, setI] = useState(0)
  const [errors, setErrors] = useState(0)
  const [flash, setFlash] = useState<{ ok: boolean; cat: number } | null>(null)
  const [result, setResult] = useState<{ stars: number; gold: number } | null>(null)
  const [mistakes, setMistakes] = useState<{ text: string; cat: number }[]>([])
  const item = items[i]

  const choose = (cat: number) => {
    if (flash || !item) return
    const ok = cat === item.cat
    setFlash({ ok, cat })
    if (ok) sfx.correct()
    else {
      sfx.wrong()
      setErrors((e) => e + 1)
      setMistakes((m) => [...m, item])
    }
    setTimeout(
      () => {
        setFlash(null)
        if (i + 1 >= items.length) {
          const errs = errors + (ok ? 0 : 1)
          const stars = errs === 0 ? 3 : errs <= 2 ? 2 : 1
          const gold = 10 + stars * 5
          sfx.victory()
          update((g) => {
            g.regions[id].sort = Math.max(g.regions[id].sort, stars)
            g.gold += gold
            gainXp(g, 15 + stars * 5)
          })
          setResult({ stars, gold })
        } else setI(i + 1)
      },
      ok ? 450 : 1100,
    )
  }

  return (
    <div className="px-3 pb-8">
      <Backdrop scene={id} dim={0.2} />
      <ScreenHeader title={set.title} onBack={() => go({ name: 'region', id })} />
      <div className="mx-auto mt-4 max-w-3xl">
        <p className="mb-3 text-center font-title text-sm font-extrabold text-gold sm:text-base">{set.prompt}</p>
        <div className="mb-3 flex items-center justify-between text-xs text-white/70">
          <span>
            Carta {Math.min(i + 1, items.length)} de {items.length}
          </span>
          <span>Errores: {errors}</span>
        </div>
        <div className="bar !h-2">
          <i style={{ width: `${(i / items.length) * 100}%`, background: `linear-gradient(90deg, ${r.colors.from}, ${r.colors.accent})` }} />
        </div>

        <div className="relative mt-6 flex h-44 items-center justify-center">
          <AnimatePresence mode="wait">
            {item && (
              <motion.div
                key={i}
                initial={{ y: -40, opacity: 0, rotate: -4, scale: 0.9 }}
                animate={flash ? (flash.ok ? { y: 120, opacity: 0, scale: 0.6 } : { x: [0, -14, 14, -10, 10, 0] }) : { y: 0, opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: flash ? 0.45 : 0.3 }}
                className={`panel-gold flex min-h-32 w-full max-w-sm items-center justify-center px-6 py-8 text-center ${flash && !flash.ok ? '!border-rose-400' : ''}`}
              >
                <span className="font-title text-xl font-extrabold sm:text-2xl">{item.text}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {flash && !flash.ok && item && <p className="mt-2 text-center text-sm font-bold text-rose-200">Era: {set.categories[item.cat]}</p>}

        <div className={`mt-6 grid gap-3 ${set.categories.length === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
          {set.categories.map((c, k) => (
            <motion.button
              key={c}
              whileTap={{ scale: 0.95 }}
              onClick={() => choose(k)}
              className={`flex min-h-24 flex-col items-center justify-center gap-1 rounded-2xl border-2 p-3 text-center font-title text-sm font-extrabold transition sm:text-base ${
                flash?.cat === k ? (flash.ok ? 'border-emerald-300 bg-emerald-600/40' : 'border-rose-400 bg-rose-600/30') : 'border-gold/40 bg-white/[.07] hover:border-gold'
              }`}
            >
              <span className="text-3xl">🧰</span>
              {c}
            </motion.button>
          ))}
        </div>
      </div>

      <Modal open={!!result}>
        {result && (
          <div className="text-center">
            <div className="text-6xl">🗂️</div>
            <h2 className="title-glow mt-2 text-3xl font-black">¡Clasificación completa!</h2>
            <div className="mt-3 flex justify-center">
              <Stars n={result.stars} size={40} />
            </div>
            <p className="mt-2 text-sm text-white/70">
              {errors} errores · +{result.gold} oro
            </p>
            {mistakes.length > 0 && (
              <div className="mt-3 rounded-xl bg-white/5 p-3 text-left text-xs">
                <div className="mb-1 font-bold text-gold">Para recordar:</div>
                {mistakes.map((m) => (
                  <div key={m.text}>
                    • <b>{m.text}</b> → {set.categories[m.cat]}
                  </div>
                ))}
              </div>
            )}
            <div className="mt-5 grid grid-cols-2 gap-3">
              <button className="btn btn-ghost" onClick={() => go({ name: 'sort', id })}>
                ↻ Otra vez
              </button>
              <button className="btn btn-gold" onClick={() => go({ name: 'region', id })}>
                Continuar
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
