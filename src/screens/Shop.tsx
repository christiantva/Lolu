import { motion } from 'motion/react'
import { Backdrop } from '../art/Backdrop'
import { Hud } from '../components/Hud'
import { ScreenHeader } from '../components/ui'
import { useNav } from '../game/nav'
import { sfx } from '../game/sound'
import { maxHp } from '../game/state'
import { useHero } from '../game/store'

const WARES = [
  { key: 'potion', icon: '🧪', name: 'Poción de Vitalidad', desc: 'Recupera 40 PV durante un combate.', price: 25 },
  { key: 'scroll', icon: '📜', name: 'Pergamino de Sabiduría', desc: 'Elimina opciones incorrectas de una pregunta.', price: 40 },
  { key: 'shield', icon: '🛡️', name: 'Escudo del Amauta', desc: 'Bloquea por completo el siguiente golpe enemigo.', price: 30 },
] as const

export function Shop() {
  const { state: s, update } = useHero()
  const go = useNav()
  const mh = maxHp(s)
  const innPrice = 15

  const buy = (key: (typeof WARES)[number]['key'], price: number) => {
    if (s.gold < price) return sfx.wrong()
    sfx.coin()
    update((g) => {
      g.gold -= price
      g.items[key] += 1
    })
  }

  return (
    <div className="px-3 pt-3">
      <Backdrop scene="title" dim={0.25} />
      <Hud />
      <ScreenHeader title="Tienda del Mercader" subtitle="Gasta tu oro con sabiduría" onBack={() => go({ name: 'map' })} />
      <div className="mx-auto mt-4 grid max-w-5xl gap-3 px-1 sm:grid-cols-2 lg:grid-cols-4">
        {WARES.map((w, i) => (
          <motion.div key={w.key} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.06 }} className="panel flex flex-col items-center p-4 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-b from-white/15 to-transparent text-5xl anim-bob">{w.icon}</div>
            <div className="mt-2 font-title font-extrabold">{w.name}</div>
            <p className="mt-1 flex-1 text-xs text-white/70">{w.desc}</p>
            <div className="mt-2 text-xs text-white/60">Tienes: {s.items[w.key]}</div>
            <button className="btn btn-gold mt-3 w-full" disabled={s.gold < w.price} onClick={() => buy(w.key, w.price)}>
              🪙 {w.price}
            </button>
          </motion.div>
        ))}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="panel flex flex-col items-center p-4 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-b from-white/15 to-transparent text-5xl anim-bob">🛏️</div>
          <div className="mt-2 font-title font-extrabold">Posada del Viajero</div>
          <p className="mt-1 flex-1 text-xs text-white/70">Descansa y recupera todos tus PV.</p>
          <div className="mt-2 text-xs text-white/60">
            PV: {s.hp}/{mh}
          </div>
          <button
            className="btn btn-gold mt-3 w-full"
            disabled={s.gold < innPrice || s.hp >= mh}
            onClick={() => {
              sfx.heal()
              update((g) => {
                g.gold -= innPrice
                g.hp = maxHp(g)
              })
            }}
          >
            🪙 {innPrice}
          </button>
        </motion.div>
      </div>
      <p className="mx-auto mt-4 max-w-5xl text-center text-xs text-white/50">Ganas oro venciendo monstruos y completando minijuegos. ¡Los minijuegos se pueden repetir!</p>
    </div>
  )
}
