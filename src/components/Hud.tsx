import { Hero } from '../art/Hero'
import { useHero } from '../game/store'
import { CLASSES, maxHp, xpForNext } from '../game/state'
import { sfx } from '../game/sound'
import { Bar } from './ui'

/** Barra superior con retrato, nivel, PV, XP, oro y sonido. */
export function Hud() {
  const { state: s, update } = useHero()
  const mh = maxHp(s)
  return (
    <div className="panel mx-auto flex w-full max-w-5xl items-center gap-3 px-3 py-2 sm:gap-4 sm:px-4">
      <div className="relative shrink-0">
        <div className="h-14 w-14 overflow-hidden rounded-full border-2 border-gold/70 bg-gradient-to-b from-indigo-400/30 to-purple-900/60 sm:h-16 sm:w-16">
          <div className="-mt-1 flex justify-center">
            <Hero cls={s.cls} look={s.look} size={64} />
          </div>
        </div>
        <span className="absolute -bottom-1 -right-1 rounded-full border border-gold bg-ink px-1.5 text-[11px] font-black text-gold">Nv {s.level}</span>
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <span className="truncate font-title text-sm font-extrabold sm:text-base">{s.name}</span>
          <span className="hidden truncate text-xs text-white/60 sm:inline">
            {CLASSES[s.cls].icon} {CLASSES[s.cls].name}
          </span>
        </div>
        <div className="mt-1 grid grid-cols-2 gap-2">
          <Bar value={s.hp} max={mh} color="linear-gradient(90deg,#ff4d6d,#ff8fa3)" label="PV" />
          <Bar value={s.xp} max={xpForNext(s.level)} color="linear-gradient(90deg,#7c5cff,#5ad1ff)" label="XP" />
        </div>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1">
        <span className="rounded-full bg-black/40 px-2.5 py-1 text-sm font-black text-gold tabular-nums">🪙 {s.gold}</span>
        <button
          className="rounded-full bg-black/30 px-2 py-0.5 text-sm"
          aria-label={s.muted ? 'Activar sonido' : 'Silenciar'}
          onClick={() => {
            update((g) => {
              g.muted = !g.muted
            })
            sfx.click()
          }}
        >
          {s.muted ? '🔇' : '🔊'}
        </button>
      </div>
    </div>
  )
}
