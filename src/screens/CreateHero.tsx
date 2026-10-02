import { motion } from 'motion/react'
import { useState } from 'react'
import { Backdrop } from '../art/Backdrop'
import { Hero } from '../art/Hero'
import { ScreenHeader } from '../components/ui'
import { useNav } from '../game/nav'
import { sfx } from '../game/sound'
import { CLASSES, HAIRS, SKINS, newGame, type HeroClass, type HeroLook } from '../game/state'
import { useGame } from '../game/store'

export function CreateHero() {
  const { setState } = useGame()
  const go = useNav()
  const [name, setName] = useState('')
  const [cls, setCls] = useState<HeroClass>('arcanista')
  const [look, setLook] = useState<HeroLook>({ skin: 1, hair: 0, style: 1 })
  const c = CLASSES[cls]
  const valid = name.trim().length >= 2

  const start = () => {
    if (!valid) return
    sfx.levelUp()
    const s = newGame(name.trim().slice(0, 18), cls, look)
    if (cls === 'arcanista') s.items.scroll += 1
    setState(s)
    go({ name: 'map' })
  }

  return (
    <div className="pb-8">
      <Backdrop scene="title" dim={0.2} />
      <ScreenHeader title="Crea tu héroe" subtitle="Elige tu clase y tu apariencia" onBack={() => go({ name: 'title' })} />

      <div className="mx-auto mt-4 grid max-w-5xl gap-4 px-4 md:grid-cols-[1fr_1.3fr]">
        {/* vista previa */}
        <div className="panel-gold flex flex-col items-center p-5">
          <div className="relative flex h-64 w-full items-end justify-center">
            <div className="absolute bottom-4 h-40 w-40 rounded-full blur-2xl" style={{ background: c.color, opacity: 0.35 }} />
            <motion.div key={cls + look.style + look.hair + look.skin} initial={{ scale: 0.8, y: 10 }} animate={{ scale: 1, y: 0 }} transition={{ type: 'spring', stiffness: 300 }} className="anim-bob">
              <Hero cls={cls} look={look} size={170} />
            </motion.div>
          </div>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={18}
            placeholder="Escribe tu nombre"
            className="mt-3 w-full rounded-xl border border-gold/40 bg-black/40 px-4 py-3 text-center font-title text-lg font-extrabold text-gold placeholder:text-white/30 focus:border-gold focus:outline-none"
            onKeyDown={(e) => e.key === 'Enter' && start()}
          />
          <div className="mt-4 w-full space-y-3 text-sm">
            <Picker label="Piel" n={SKINS.length} value={look.skin} onPick={(v) => setLook({ ...look, skin: v })} swatch={(i) => SKINS[i]} />
            <Picker label="Cabello" n={HAIRS.length} value={look.hair} onPick={(v) => setLook({ ...look, hair: v })} swatch={(i) => HAIRS[i]} />
            <div className="flex items-center gap-3">
              <span className="w-16 text-xs font-bold uppercase tracking-wider text-white/60">Peinado</span>
              {['Corto', 'Largo', 'Moño'].map((t, i) => (
                <button
                  key={t}
                  onClick={() => (sfx.click(), setLook({ ...look, style: i }))}
                  className={`rounded-lg px-3 py-1.5 text-xs font-bold ${look.style === i ? 'bg-gold text-ink' : 'bg-white/10'}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* clases */}
        <div className="flex flex-col gap-3">
          {(Object.keys(CLASSES) as HeroClass[]).map((k) => {
            const cc = CLASSES[k]
            const on = k === cls
            return (
              <button
                key={k}
                onClick={() => (sfx.select(), setCls(k))}
                className={`panel flex items-center gap-4 p-3 text-left transition ${on ? 'scale-[1.01] ring-2 ring-gold' : 'opacity-80 hover:opacity-100'}`}
                style={on ? { boxShadow: `0 0 30px -6px ${cc.color}` } : undefined}
              >
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-3xl" style={{ background: `linear-gradient(135deg, ${cc.color}, ${cc.color2})` }}>
                  {cc.icon}
                </div>
                <div>
                  <div className="font-title text-base font-extrabold">{cc.name}</div>
                  <div className="text-[11px] font-bold uppercase tracking-widest" style={{ color: cc.color }}>
                    {cc.title}
                  </div>
                  <div className="mt-1 text-xs text-white/75">{cc.perk}</div>
                </div>
              </button>
            )
          })}
          <button className="btn btn-gold shine mt-2 text-lg" disabled={!valid} onClick={start}>
            ✦ Iniciar aventura
          </button>
          {!valid && <p className="text-center text-xs text-white/50">Escribe un nombre de al menos 2 letras.</p>}
        </div>
      </div>
    </div>
  )
}

function Picker({ label, n, value, onPick, swatch }: { label: string; n: number; value: number; onPick: (v: number) => void; swatch: (i: number) => string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-16 text-xs font-bold uppercase tracking-wider text-white/60">{label}</span>
      {Array.from({ length: n }, (_, i) => (
        <button
          key={i}
          aria-label={`${label} ${i + 1}`}
          onClick={() => (sfx.click(), onPick(i))}
          className={`h-8 w-8 rounded-full border-2 transition ${value === i ? 'scale-110 border-gold' : 'border-white/20'}`}
          style={{ background: swatch(i) }}
        />
      ))}
    </div>
  )
}
