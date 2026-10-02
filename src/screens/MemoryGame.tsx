import { motion } from 'motion/react'
import { useEffect, useMemo, useState } from 'react'
import { Backdrop } from '../art/Backdrop'
import { Modal, ScreenHeader, Stars } from '../components/ui'
import { pairsFor } from '../data/minigames'
import { regionById } from '../data/regions'
import type { RegionId } from '../data/types'
import { shuffle } from '../game/engine'
import { useNav } from '../game/nav'
import { sfx } from '../game/sound'
import { gainXp } from '../game/state'
import { useHero } from '../game/store'

interface Card {
  key: number
  pair: number
  text: string
  side: 0 | 1
}

/** Juego de memoria: voltea dos runas y une cada concepto con su pareja. */
export function MemoryGame({ id }: { id: RegionId }) {
  const r = regionById(id)
  const set = pairsFor(id)
  const { update } = useHero()
  const go = useNav()
  const cards = useMemo<Card[]>(
    () => shuffle(set.pairs.flatMap(([a, b], i) => [{ key: i * 2, pair: i, text: a, side: 0 as const }, { key: i * 2 + 1, pair: i, text: b, side: 1 as const }])),
    [set],
  )
  const [open, setOpen] = useState<number[]>([])
  const [matched, setMatched] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [result, setResult] = useState<{ stars: number; gold: number } | null>(null)

  const flip = (k: number) => {
    if (open.length === 2 || open.includes(k) || matched.includes(cards[k].pair)) return
    sfx.flip()
    const nxt = [...open, k]
    setOpen(nxt)
    if (nxt.length === 2) {
      setMoves((m) => m + 1)
      const [a, b] = nxt.map((i) => cards[i])
      if (a.pair === b.pair) {
        setTimeout(() => {
          sfx.correct()
          setMatched((m) => [...m, a.pair])
          setOpen([])
        }, 350)
      } else {
        setTimeout(() => {
          sfx.wrong()
          setOpen([])
        }, 900)
      }
    }
  }

  useEffect(() => {
    if (matched.length !== set.pairs.length || result) return
    const n = set.pairs.length
    const stars = moves <= n + 2 ? 3 : moves <= n + 6 ? 2 : 1
    const gold = 10 + stars * 5
    sfx.victory()
    update((g) => {
      g.regions[id].memory = Math.max(g.regions[id].memory, stars)
      g.gold += gold
      gainXp(g, 15 + stars * 5)
    })
    setResult({ stars, gold })
  }, [matched, moves, result, set.pairs.length, update, id])

  return (
    <div className="px-3 pb-8">
      <Backdrop scene={id} dim={0.2} />
      <ScreenHeader
        title={set.title}
        subtitle="Une cada concepto con su pareja"
        onBack={() => go({ name: 'region', id })}
        right={<span className="shrink-0 rounded-full bg-white/10 px-3 py-1 font-title text-sm font-extrabold tabular-nums">🔄 {moves}</span>}
      />
      <div className="mx-auto mt-5 grid max-w-3xl grid-cols-3 gap-2.5 sm:grid-cols-4 sm:gap-3">
        {cards.map((c, k) => {
          const shown = open.includes(k) || matched.includes(c.pair)
          const done = matched.includes(c.pair)
          return (
            <button key={c.key} onClick={() => flip(k)} className="aspect-[3/4] [perspective:800px]" aria-label={shown ? c.text : 'Runa oculta'}>
              <motion.div className="relative h-full w-full [transform-style:preserve-3d]" animate={{ rotateY: shown ? 180 : 0 }} transition={{ duration: 0.45 }}>
                {/* reverso */}
                <div
                  className="absolute inset-0 flex items-center justify-center rounded-2xl border-2 border-gold/50 [backface-visibility:hidden]"
                  style={{ background: `radial-gradient(circle at 30% 30%, ${r.colors.from}, ${r.colors.to})` }}
                >
                  <svg viewBox="0 0 60 60" className="h-1/2 w-1/2 opacity-80">
                    <circle cx="30" cy="30" r="24" fill="none" stroke="#ffd76a" strokeWidth="2" />
                    <path d="M30 10 L36 26 L52 30 L36 34 L30 50 L24 34 L8 30 L24 26 Z" fill="#ffd76a" />
                  </svg>
                </div>
                {/* anverso */}
                <div
                  className={`absolute inset-0 flex items-center justify-center rounded-2xl border-2 p-2 text-center [backface-visibility:hidden] [transform:rotateY(180deg)] ${done ? 'border-emerald-300 bg-emerald-900/80' : 'border-gold bg-[#1d1342]'}`}
                >
                  <span className={`text-[12px] font-extrabold leading-tight sm:text-sm ${c.side ? 'text-sky-200' : 'text-gold'}`}>{c.text}</span>
                </div>
              </motion.div>
            </button>
          )
        })}
      </div>
      <p className="mx-auto mt-4 max-w-3xl text-center text-xs text-white/60">Dorado = concepto · Celeste = su pareja. Completa con pocos movimientos para ganar 3 estrellas.</p>

      <Modal open={!!result}>
        {result && (
          <div className="text-center">
            <div className="text-6xl">🧠</div>
            <h2 className="title-glow mt-2 text-3xl font-black">¡Runas unidas!</h2>
            <div className="mt-3 flex justify-center">
              <Stars n={result.stars} size={40} />
            </div>
            <p className="mt-2 text-sm text-white/70">
              {moves} movimientos · +{result.gold} oro
            </p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <button className="btn btn-ghost" onClick={() => go({ name: 'memory', id: id })}>
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
