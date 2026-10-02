import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { Backdrop } from '../art/Backdrop'
import { Monster } from '../art/Monster'
import { Npc } from '../art/Npc'
import { Hud } from '../components/Hud'
import { ScreenHeader, Stars } from '../components/ui'
import { regionById } from '../data/regions'
import { SCROLLS } from '../data/scrolls'
import type { RegionId } from '../data/types'
import { useNav } from '../game/nav'
import { sfx } from '../game/sound'
import { useHero } from '../game/store'

export function RegionHub({ id }: { id: RegionId }) {
  const r = regionById(id)
  const { state: s } = useHero()
  const go = useNav()
  const p = s.regions[id]
  const scrolls = SCROLLS.filter((x) => x.region === id)
  const firstVisit = p.readScrolls.length === 0 && p.battles === 0
  const [line, setLine] = useState(firstVisit ? 0 : -1)

  const nodes = [
    { key: 'study', icon: '📜', title: 'Biblioteca de Pergaminos', sub: `${p.readScrolls.length}/${scrolls.length} leídos · ¡empieza aquí!`, ok: true, stars: -1, onClick: () => go({ name: 'study', id }) },
    ...r.minions.map((m, i) => ({
      key: m.id,
      icon: '⚔️',
      title: `Combate: ${m.name}`,
      sub: p.battles > i ? 'Derrotado · puedes repetir para ganar XP' : i > p.battles ? 'Derrota primero al anterior' : `${m.hits} golpes para vencer`,
      ok: i <= p.battles,
      stars: -1,
      done: p.battles > i,
      monster: m,
      onClick: () => go({ name: 'battle', battle: { mode: 'minion', region: id, index: i } }),
    })),
    { key: 'memory', icon: '🧠', title: 'Runas Gemelas', sub: 'Une cada concepto con su pareja', ok: true, stars: p.memory, onClick: () => go({ name: 'memory', id }) },
    { key: 'sort', icon: '🗂️', title: 'Clasificador', sub: 'Ordena los conceptos en su categoría', ok: true, stars: p.sort, onClick: () => go({ name: 'sort', id }) },
    {
      key: 'boss',
      icon: '👹',
      title: `JEFE: ${r.boss.name}`,
      sub: p.battles >= r.minions.length ? (p.boss ? '¡Derrotado! Repite para mejorar tus estrellas' : '¡Te espera! Prepárate bien') : `Vence a los ${r.minions.length} secuaces para enfrentarlo`,
      ok: p.battles >= r.minions.length,
      stars: p.boss,
      monster: r.boss,
      boss: true,
      onClick: () => go({ name: 'battle', battle: { mode: 'boss', region: id } }),
    },
  ]

  return (
    <div className="px-3 pt-3">
      <Backdrop scene={id} dim={0.05} />
      <Hud />
      <ScreenHeader title={r.name} subtitle={`Sesión ${r.session} · ${r.realm}`} onBack={() => go({ name: 'map' })} />

      <div className="mx-auto mt-4 grid max-w-5xl gap-4 px-1 md:grid-cols-[300px_1fr]">
        {/* NPC */}
        <div className="panel flex flex-col items-center p-4 text-center">
          <div className="relative">
            <div className="absolute inset-0 rounded-full blur-2xl" style={{ background: r.colors.glow }} />
            <Npc kind={r.npc.kind} size={130} />
          </div>
          <div className="mt-1 font-title text-base font-extrabold text-gold">{r.npc.name}</div>
          <p className="mt-1 text-xs text-white/70">{r.subtitle}</p>
          <button className="btn btn-ghost mt-3 px-3 py-1.5 text-xs" onClick={() => (sfx.click(), setLine(0))}>
            💬 Hablar
          </button>
        </div>

        {/* NODOS */}
        <div className="flex flex-col gap-2.5">
          {nodes.map((n, i) => (
            <motion.button
              key={n.key}
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: i * 0.05 }}
              disabled={!n.ok}
              onClick={() => (sfx.select(), n.onClick())}
              className={`panel group flex items-center gap-3 p-3 text-left transition enabled:hover:-translate-y-0.5 disabled:opacity-45 ${'boss' in n && n.boss ? 'border-red-400/40' : ''}`}
              style={'boss' in n && n.boss && n.ok ? { boxShadow: `0 0 30px -8px ${r.colors.glow}` } : undefined}
            >
              <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl" style={{ background: `linear-gradient(135deg, ${r.colors.from}55, ${r.colors.to})` }}>
                {'monster' in n && n.monster ? <Monster kind={n.monster.kind} hue={n.monster.hue} size={58} /> : <span className="text-3xl">{n.icon}</span>}
                {!n.ok && <span className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/60 text-xl">🔒</span>}
                {'done' in n && n.done && <span className="absolute -right-1 -top-1 text-lg">✅</span>}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-title text-sm font-extrabold sm:text-base">{n.title}</div>
                <div className="text-xs text-white/65">{n.sub}</div>
              </div>
              {n.stars >= 0 && <Stars n={n.stars} size={16} />}
              <span className="text-xl text-gold/70 transition group-enabled:group-hover:translate-x-1">›</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Diálogo del NPC */}
      <AnimatePresence>
        {line >= 0 && (
          <motion.div
            className="fixed inset-x-0 bottom-0 z-40 p-3"
            initial={{ y: 200 }}
            animate={{ y: 0 }}
            exit={{ y: 220 }}
            transition={{ type: 'spring', damping: 24 }}
          >
            <button
              className="panel-gold mx-auto flex w-full max-w-3xl items-start gap-3 p-4 text-left"
              onClick={() => {
                sfx.click()
                setLine((l) => (l + 1 < r.npc.lines.length ? l + 1 : -1))
              }}
            >
              <div className="shrink-0">
                <Npc kind={r.npc.kind} size={64} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-title text-sm font-extrabold text-gold">{r.npc.name}</div>
                <Typewriter key={line} text={r.npc.lines[line] ?? ''} />
                <div className="mt-2 text-right text-[11px] text-white/50">
                  {line + 1}/{r.npc.lines.length} · toca para continuar ▸
                </div>
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function Typewriter({ text }: { text: string }) {
  const [n, setN] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setN((x) => (x >= text.length ? x : x + 2)), 18)
    return () => clearInterval(t)
  }, [text])
  return <p className="mt-1 min-h-[3.5em] text-sm leading-relaxed text-white/90 sm:text-base">{text.slice(0, n)}</p>
}
