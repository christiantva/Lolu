import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { Backdrop } from '../art/Backdrop'
import { Rich, ScreenHeader } from '../components/ui'
import { regionById } from '../data/regions'
import { SCROLLS } from '../data/scrolls'
import type { RegionId } from '../data/types'
import { gainXp } from '../game/state'
import { useNav } from '../game/nav'
import { sfx } from '../game/sound'
import { useHero } from '../game/store'

export function Study({ id }: { id: RegionId }) {
  const r = regionById(id)
  const list = SCROLLS.filter((s) => s.region === id)
  const { state: s, update, toast } = useHero()
  const go = useNav()
  const [i, setI] = useState(0)
  const [dir, setDir] = useState(1)
  const sc = list[i]

  // Marcar como leído (+10 XP la primera vez)
  useEffect(() => {
    if (s.regions[id].readScrolls.includes(sc.id)) return
    const t = setTimeout(() => {
      update((g) => {
        if (g.regions[id].readScrolls.includes(sc.id)) return
        g.regions[id].readScrolls.push(sc.id)
        const ups = gainXp(g, 10)
        if (ups) queueMicrotask(() => (sfx.levelUp(), toast({ icon: '⬆️', title: `¡Subiste al nivel ${g.level}!` })))
      })
    }, 1200)
    return () => clearTimeout(t)
  }, [sc.id, id, s.regions, update, toast])

  const move = (d: number) => {
    const n = i + d
    if (n < 0 || n >= list.length) return
    sfx.flip()
    setDir(d)
    setI(n)
  }

  return (
    <div className="px-3 pb-6">
      <Backdrop scene={id} dim={0.25} />
      <ScreenHeader title="Biblioteca de Pergaminos" subtitle={`${r.name} · Sesión ${r.session}`} onBack={() => go({ name: 'region', id })} />

      {/* índice */}
      <div className="scroll-thin mx-auto mt-3 flex max-w-3xl gap-2 overflow-x-auto px-1 pb-2">
        {list.map((x, k) => (
          <button
            key={x.id}
            onClick={() => (sfx.click(), setDir(k > i ? 1 : -1), setI(k))}
            className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition ${k === i ? 'bg-gold text-ink' : 'bg-white/10 text-white/80'}`}
          >
            <span>{x.icon}</span>
            <span className="max-w-[9rem] truncate">{x.title}</span>
            {s.regions[id].readScrolls.includes(x.id) && <span>✓</span>}
          </button>
        ))}
      </div>

      <div className="relative mx-auto mt-2 max-w-3xl">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.article
            key={sc.id}
            custom={dir}
            initial={{ x: dir * 80, opacity: 0, rotate: dir * 2 }}
            animate={{ x: 0, opacity: 1, rotate: 0 }}
            exit={{ x: -dir * 80, opacity: 0, rotate: -dir * 2 }}
            transition={{ type: 'spring', stiffness: 260, damping: 26 }}
            className="parchment relative p-5 sm:p-8"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              if (info.offset.x < -80) move(1)
              else if (info.offset.x > 80) move(-1)
            }}
          >
            <div className="pointer-events-none absolute -left-2 -top-2 h-6 w-[calc(100%+16px)] rounded-full bg-gradient-to-b from-[#c9a36a] to-[#8a5a2a] shadow-lg" />
            <div className="pointer-events-none absolute -bottom-2 -left-2 h-6 w-[calc(100%+16px)] rounded-full bg-gradient-to-b from-[#c9a36a] to-[#8a5a2a] shadow-lg" />
            <div className="flex items-center gap-3">
              <span className="text-4xl">{sc.icon}</span>
              <div>
                <div className="text-[11px] font-black uppercase tracking-[0.25em] text-[#8a5a2a]">
                  Pergamino {i + 1} de {list.length}
                </div>
                <h2 className="font-title text-xl font-extrabold sm:text-2xl">{sc.title}</h2>
              </div>
            </div>
            <ul className="mt-4 space-y-3">
              {sc.points.map((pt, k) => (
                <motion.li
                  key={k}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + k * 0.06 }}
                  className="flex gap-2 text-[15px] leading-relaxed sm:text-base"
                >
                  <span className="mt-1 text-[#a86b12]">◆</span>
                  <span>
                    <Rich text={pt} />
                  </span>
                </motion.li>
              ))}
            </ul>
            {sc.tip && (
              <div className="mt-5 rounded-xl border-2 border-dashed border-[#b88a4a] bg-[#fff6dc] p-3 text-sm">
                <span className="font-black">💡 Truco: </span>
                <Rich text={sc.tip} />
              </div>
            )}
          </motion.article>
        </AnimatePresence>

        <div className="mt-5 flex items-center justify-between gap-3">
          <button className="btn btn-ghost" disabled={i === 0} onClick={() => move(-1)}>
            ← Anterior
          </button>
          <span className="text-xs text-white/60">Desliza o usa las flechas</span>
          {i < list.length - 1 ? (
            <button className="btn btn-gold" onClick={() => move(1)}>
              Siguiente →
            </button>
          ) : (
            <button className="btn btn-gold" onClick={() => (sfx.select(), go({ name: 'region', id }))}>
              ¡A combatir! ⚔
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
