import { AnimatePresence, motion, useAnimationControls } from 'motion/react'
import { useMemo, useRef, useState } from 'react'
import { Backdrop } from '../art/Backdrop'
import { Hero } from '../art/Hero'
import { Monster } from '../art/Monster'
import { Bar, Modal, Rich, Stars } from '../components/ui'
import { ALL_QUESTIONS, COMPARE_QUESTIONS, questionsFor } from '../data/questions'
import { FINAL_BOSS, regionById } from '../data/regions'
import type { MonsterDef, Question } from '../data/types'
import { pickQuestions, prepare, recordAnswer, starsFor, weakQuestions, type LiveQuestion } from '../game/engine'
import { useNav, type BattleMode } from '../game/nav'
import { sfx } from '../game/sound'
import { CLASSES, attackPower, gainXp, maxHp } from '../game/state'
import { useHero } from '../game/store'

type Phase = 'intro' | 'question' | 'feedback' | 'win' | 'lose'
interface Float {
  id: number
  text: string
  color: string
  side: 'hero' | 'monster'
}

const REVIEW_MONSTER: MonsterDef = { id: 'sombra', name: 'Sombra del Error', kind: 'bat', hue: 265, hits: 6, attack: 12, taunt: 'Soy cada pregunta que fallaste... ¿ya aprendiste de mí?' }

export function Battle({ cfg }: { cfg: BattleMode }) {
  const { state: s, update, toast } = useHero()
  const go = useNav()

  // ── Configuración del combate ──
  const setup = useMemo(() => {
    let monster: MonsterDef
    let pool: Question[]
    let scene: Parameters<typeof Backdrop>[0]['scene']
    if (cfg.mode === 'minion' || cfg.mode === 'boss') {
      const r = regionById(cfg.region)
      monster = cfg.mode === 'boss' ? r.boss : r.minions[cfg.index]
      pool = questionsFor(cfg.region)
      scene = cfg.region
    } else if (cfg.mode === 'final') {
      monster = FINAL_BOSS
      pool = ALL_QUESTIONS
      scene = 'tower'
    } else {
      pool = weakQuestions(ALL_QUESTIONS, s)
      monster = { ...REVIEW_MONSTER, hits: Math.max(3, Math.min(8, pool.length)) }
      scene = 'oracle'
    }
    return { monster, pool, scene }
    // el combate se configura una sola vez al entrar
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const { monster, pool, scene } = setup
  const backTo = () => (cfg.mode === 'minion' || cfg.mode === 'boss' ? go({ name: 'region', id: cfg.region }) : go({ name: 'map' }))

  const mh = maxHp(s)
  const monsterMax = monster.hits * 100
  const dmgPerHit = Math.round(attackPower(s.level))
  const critAt = s.cls === 'trotamundos' ? 2 : 3

  const used = useRef(new Set<string>())
  const draw = (): LiveQuestion => {
    let src = pool
    // el jefe final mezcla preguntas comparativas con frecuencia
    if (cfg.mode === 'final' && Math.random() < 0.3) src = COMPARE_QUESTIONS
    let [q] = pickQuestions(src, 1, s, used.current)
    if (!q) {
      used.current.clear()
      ;[q] = pickQuestions(src, 1, s, used.current)
    }
    used.current.add(q.id)
    return prepare(q)
  }

  const [phase, setPhase] = useState<Phase>('intro')
  const [q, setQ] = useState<LiveQuestion>(() => draw())
  const [picked, setPicked] = useState<number | null>(null)
  const [hp, setHp] = useState(() => Math.max(1, Math.min(s.hp, mh)))
  const [mhp, setMhp] = useState(monsterMax)
  const [streak, setStreak] = useState(0)
  const [hidden, setHidden] = useState<number[]>([])
  const [shield, setShield] = useState(false)
  const [bonusScroll, setBonusScroll] = useState(s.cls === 'arcanista' ? 1 : 0)
  const [floats, setFloats] = useState<Float[]>([])
  const [heroPose, setHeroPose] = useState<'idle' | 'attack' | 'hurt'>('idle')
  const [tally, setTally] = useState({ ok: 0, total: 0 })
  const [reward, setReward] = useState<{ xp: number; gold: number; stars: number; ups: number } | null>(null)
  const fid = useRef(1)
  const monsterCtl = useAnimationControls()
  const heroCtl = useAnimationControls()
  const arenaCtl = useAnimationControls()

  const float = (text: string, color: string, side: Float['side']) => {
    const id = fid.current++
    setFloats((f) => [...f, { id, text, color, side }])
    setTimeout(() => setFloats((f) => f.filter((x) => x.id !== id)), 1200)
  }

  // ── Responder ──
  const answer = (i: number) => {
    if (phase !== 'question') return
    setPicked(i)
    const ok = i === q.answer
    setTally((t) => ({ ok: t.ok + (ok ? 1 : 0), total: t.total + 1 }))
    const newStreak = ok ? streak + 1 : 0
    setStreak(newStreak)
    update((g) => {
      recordAnswer(g, q.id, ok)
      g.bestStreak = Math.max(g.bestStreak, newStreak)
    })

    if (ok) {
      const crit = newStreak >= critAt
      const dmg = Math.round(dmgPerHit * (crit ? 1.5 : 1))
      setHeroPose('attack')
      void heroCtl.start({ x: [0, 60, 0], transition: { duration: 0.4 } })
      setTimeout(() => {
        crit ? sfx.crit() : sfx.slash()
        void monsterCtl.start({ x: [0, 16, -12, 8, 0], filter: ['brightness(1)', 'brightness(3)', 'brightness(1)'], transition: { duration: 0.45 } })
        setMhp((m) => Math.max(0, m - dmg))
        float(crit ? `¡CRÍTICO! -${dmg}` : `-${dmg}`, crit ? '#ffd76a' : '#fff', 'monster')
        setHeroPose('idle')
      }, 220)
      sfx.correct()
      if (s.cls === 'guia') {
        setHp((h) => Math.min(mh, h + 6))
        setTimeout(() => float('+6 PV', '#7dffb0', 'hero'), 300)
      }
    } else {
      sfx.wrong()
      void monsterCtl.start({ x: [0, -50, 0], scale: [1, 1.1, 1], transition: { duration: 0.4 } })
      setTimeout(() => {
        if (shield) {
          setShield(false)
          float('¡BLOQUEADO!', '#8fd3ff', 'hero')
          sfx.select()
        } else {
          const dmg = Math.round(monster.attack * (s.cls === 'paladin' ? 0.8 : 1))
          setHp((h) => Math.max(0, h - dmg))
          float(`-${dmg}`, '#ff6b81', 'hero')
          sfx.hurt()
          setHeroPose('hurt')
          void arenaCtl.start({ x: [0, -10, 10, -8, 8, -4, 0], transition: { duration: 0.45 } })
          setTimeout(() => setHeroPose('idle'), 600)
        }
      }, 250)
    }
    setTimeout(() => setPhase('feedback'), 650)
  }

  // ── Continuar tras la explicación ──
  const next = () => {
    sfx.click()
    if (mhp <= 0) return finish(true)
    if (hp <= 0) return finish(false)
    setQ(draw())
    setPicked(null)
    setHidden([])
    setPhase('question')
  }

  const finish = (won: boolean) => {
    const acc = tally.total ? tally.ok / tally.total : 0
    if (!won) {
      sfx.defeat()
      update((g) => {
        g.hp = Math.ceil(maxHp(g) / 2)
      })
      setPhase('lose')
      return
    }
    sfx.victory()
    const stars = starsFor(acc)
    const base = { minion: [40, 20], boss: [90, 50], final: [220, 150], review: [35, 20] }[cfg.mode]
    const xp = base[0] + tally.ok * 4
    const gold = Math.round(base[1] * (s.cls === 'trotamundos' ? 1.25 : 1))
    let ups = 0
    update((g) => {
      g.hp = Math.min(maxHp(g), hp + Math.round(maxHp(g) * 0.25))
      g.gold += gold
      if (cfg.mode === 'minion') g.regions[cfg.region].battles = Math.max(g.regions[cfg.region].battles, cfg.index + 1)
      if (cfg.mode === 'boss') g.regions[cfg.region].boss = Math.max(g.regions[cfg.region].boss, stars)
      if (cfg.mode === 'final') g.finalBoss = Math.max(g.finalBoss, stars)
      ups = gainXp(g, xp)
    })
    setReward({ xp, gold, stars, ups })
    setTimeout(() => {
      if (ups) {
        sfx.levelUp()
        toast({ icon: '⬆️', title: '¡Subiste de nivel!', body: 'PV restaurados y más poder de ataque.' })
      }
    }, 900)
    setPhase('win')
  }

  // ── Objetos ──
  const scrolls = s.items.scroll + bonusScroll
  const usePotion = () => {
    if (s.items.potion <= 0 || hp >= mh || phase !== 'question') return
    sfx.heal()
    update((g) => {
      g.items.potion -= 1
    })
    setHp((h) => Math.min(mh, h + 40))
    float('+40 PV', '#7dffb0', 'hero')
  }
  const useScroll = () => {
    if (scrolls <= 0 || phase !== 'question' || hidden.length || q.options.length < 3) return
    sfx.select()
    if (bonusScroll > 0) setBonusScroll((b) => b - 1)
    else
      update((g) => {
        g.items.scroll -= 1
      })
    const wrong = q.options.map((_, i) => i).filter((i) => i !== q.answer)
    const remove = wrong.sort(() => Math.random() - 0.5).slice(0, q.options.length >= 4 ? 2 : 1)
    setHidden(remove)
  }
  const useShield = () => {
    if (s.items.shield <= 0 || shield || phase !== 'question') return
    sfx.select()
    update((g) => {
      g.items.shield -= 1
    })
    setShield(true)
  }

  const ok = picked === q.answer
  const isBoss = !!monster.boss

  return (
    <div className="flex min-h-dvh flex-col">
      <Backdrop scene={scene} />

      {/* barra superior */}
      <div className="mx-auto flex w-full max-w-4xl items-center gap-2 px-3 pt-3">
        <button className="btn btn-ghost shrink-0 whitespace-nowrap px-3 py-2 text-sm" onClick={() => (sfx.click(), backTo())}>
          ✕ Huir
        </button>
        <div className="panel min-w-0 flex-1 px-3 py-2">
          <div className="flex items-center justify-between gap-2">
            <span className={`truncate font-title text-sm font-extrabold sm:text-base ${isBoss ? 'text-red-300' : ''}`}>
              {isBoss && '👑 '}
              {monster.name}
            </span>
            <span className="shrink-0 text-xs text-white/60 tabular-nums">
              {tally.ok}/{tally.total} ✓
            </span>
          </div>
          <Bar value={mhp} max={monsterMax} color={isBoss ? 'linear-gradient(90deg,#ff2d55,#ff9f0a)' : 'linear-gradient(90deg,#ff6b6b,#ffb86b)'} className="mt-1" />
        </div>
      </div>

      {/* ARENA */}
      <motion.div animate={arenaCtl} className="relative mx-auto h-[36vh] min-h-[230px] w-full max-w-4xl sm:h-[40vh]">
        {/* plataforma monstruo */}
        <div className="absolute right-[6%] top-[4%] flex flex-col items-center">
          <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 120 }}>
            <motion.div animate={monsterCtl}>
            <motion.div animate={mhp <= 0 ? { opacity: 0, scale: 0.3, rotate: 25, y: 40 } : { opacity: 1 }} transition={{ duration: 0.7 }}>
              <Monster kind={monster.kind} hue={monster.hue} boss={isBoss} size={isBoss ? 200 : 165} className="drop-shadow-[0_10px_20px_rgba(0,0,0,.5)] sm:scale-110" />
            </motion.div>
            </motion.div>
          </motion.div>
          <div className="-mt-6 h-6 w-44 rounded-[50%] bg-black/30 blur-sm" />
          <FloatLayer floats={floats.filter((f) => f.side === 'monster')} />
        </div>
        {/* plataforma héroe */}
        <div className="absolute bottom-[2%] left-[6%] flex flex-col items-center">
          <motion.div animate={heroCtl} className="relative">
            {shield && <div className="absolute -inset-4 rounded-full border-4 border-sky-300/80 bg-sky-300/10 anim-pulse" />}
            <Hero cls={s.cls} look={s.look} size={120} pose={heroPose} className="drop-shadow-[0_10px_20px_rgba(0,0,0,.5)] sm:scale-110" />
          </motion.div>
          <FloatLayer floats={floats.filter((f) => f.side === 'hero')} />
        </div>
        {/* PV héroe */}
        <div className="panel absolute bottom-[4%] right-3 w-[48%] max-w-[260px] px-3 py-2">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="truncate">
              {CLASSES[s.cls].icon} {s.name} · Nv {s.level}
            </span>
            {streak >= 2 && <span className="text-orange-300">🔥×{streak}</span>}
          </div>
          <Bar value={hp} max={mh} color={hp / mh < 0.3 ? 'linear-gradient(90deg,#ff2d55,#ff6b6b)' : 'linear-gradient(90deg,#34d399,#a3ffcf)'} label="PV" className="mt-1" />
        </div>
      </motion.div>

      {/* PREGUNTA */}
      <div className="mx-auto w-full max-w-4xl flex-1 px-3">
        <AnimatePresence mode="wait">
          {phase === 'intro' ? (
            <motion.div key="intro" initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} className="panel-gold p-5 text-center">
              <p className="font-title text-xs font-extrabold uppercase tracking-[0.3em] text-red-300">{isBoss ? '¡Aparece un jefe!' : '¡Un enemigo salvaje aparece!'}</p>
              <p className="mt-2 text-lg font-bold italic text-white/90">“{monster.taunt}”</p>
              <p className="mt-2 text-xs text-white/60">
                Responde bien para atacar. Necesitas unos {Math.ceil(monsterMax / dmgPerHit)} aciertos. Con {critAt} seguidos haces golpes críticos.
              </p>
              <button className="btn btn-gold shine mt-4 w-full max-w-xs text-lg" onClick={() => (sfx.select(), setPhase('question'))}>
                ⚔ ¡Al combate!
              </button>
            </motion.div>
          ) : phase === 'question' || phase === 'feedback' ? (
            <motion.div key={q.id} initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} transition={{ type: 'spring', damping: 22 }}>
              <div className="panel-gold p-4 sm:p-5">
                <div className="mb-2 flex items-center gap-2 text-[11px] font-black uppercase tracking-widest">
                  <span className={`rounded-full px-2 py-0.5 ${q.kind === 'caso' ? 'bg-fuchsia-500/30 text-fuchsia-200' : q.kind === 'vf' ? 'bg-sky-500/30 text-sky-200' : 'bg-amber-500/30 text-amber-200'}`}>
                    {q.kind === 'caso' ? '📋 Caso' : q.kind === 'vf' ? '⚖️ Verdadero o falso' : '📌 Dato clave'}
                  </span>
                  {cfg.mode === 'final' && <span className="text-white/50">{regionLabel(q.region)}</span>}
                </div>
                <p className="text-[15px] font-semibold leading-relaxed sm:text-lg">{q.q}</p>
              </div>
              <div className={`mt-3 grid gap-2.5 ${q.options.length === 2 ? 'grid-cols-2' : 'sm:grid-cols-2'}`}>
                {q.options.map((o, i) => {
                  const gone = hidden.includes(i)
                  const show = phase === 'feedback'
                  const isAns = i === q.answer
                  const isPick = i === picked
                  let cls = 'border-white/15 bg-white/[.07] hover:border-gold/70 hover:bg-white/[.12]'
                  if (show && isAns) cls = 'border-emerald-300 bg-emerald-500/30 shadow-[0_0_24px_-4px_#34d399]'
                  else if (show && isPick) cls = 'border-rose-400 bg-rose-500/30'
                  else if (show) cls = 'border-white/10 bg-white/5 opacity-50'
                  return (
                    <motion.button
                      key={i}
                      whileTap={{ scale: 0.97 }}
                      disabled={phase !== 'question' || gone}
                      onClick={() => answer(i)}
                      className={`flex items-start gap-3 rounded-2xl border-2 p-3 text-left text-sm font-semibold backdrop-blur transition sm:text-[15px] ${cls} ${gone ? 'invisible' : ''}`}
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-black/40 font-title text-xs font-black text-gold">
                        {show && isAns ? '✓' : show && isPick ? '✗' : String.fromCharCode(65 + i)}
                      </span>
                      <span className="pt-0.5">{o}</span>
                    </motion.button>
                  )
                })}
              </div>

              {/* objetos */}
              {phase === 'question' && (
                <div className="mt-3 flex justify-center gap-2">
                  <ItemBtn icon="🧪" label="Poción" n={s.items.potion} onClick={usePotion} disabled={hp >= mh} />
                  <ItemBtn icon="📜" label="Sabiduría" n={scrolls} onClick={useScroll} disabled={!!hidden.length || q.options.length < 3} />
                  <ItemBtn icon="🛡️" label="Escudo" n={s.items.shield} onClick={useShield} disabled={shield} />
                </div>
              )}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      {/* EXPLICACIÓN */}
      <AnimatePresence>
        {phase === 'feedback' && (
          <motion.div className="fixed inset-x-0 bottom-0 z-30 p-3" initial={{ y: 260 }} animate={{ y: 0 }} exit={{ y: 260 }} transition={{ type: 'spring', damping: 24 }}>
            <div className={`mx-auto max-w-4xl rounded-2xl border-2 p-4 shadow-2xl backdrop-blur-xl ${ok ? 'border-emerald-300/70 bg-emerald-950/90' : 'border-rose-300/70 bg-rose-950/90'}`}>
              <div className="flex items-start gap-3">
                <span className="text-3xl">{ok ? '✨' : '💡'}</span>
                <div className="min-w-0 flex-1">
                  <div className={`font-title text-lg font-extrabold ${ok ? 'text-emerald-200' : 'text-rose-200'}`}>{ok ? (streak >= critAt ? `¡Racha de ${streak}! Golpe crítico` : '¡Correcto!') : 'Respuesta incorrecta'}</div>
                  {!ok && (
                    <p className="mt-0.5 text-sm">
                      La correcta era: <b className="text-emerald-200">{q.options[q.answer]}</b>
                    </p>
                  )}
                  <p className="mt-1 text-sm leading-relaxed text-white/90">
                    <Rich text={q.explain} />
                  </p>
                </div>
              </div>
              <button className="btn btn-gold mt-3 w-full" onClick={next} autoFocus>
                {mhp <= 0 ? '🏆 ¡Victoria!' : hp <= 0 ? '💀 Continuar' : 'Continuar ▸'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* VICTORIA */}
      <Modal open={phase === 'win'}>
        <div className="text-center">
          <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', delay: 0.1 }} className="text-6xl">
            🏆
          </motion.div>
          <h2 className="title-glow mt-2 text-3xl font-black">¡Victoria!</h2>
          <p className="mt-1 text-sm text-white/75">Derrotaste a {monster.name}</p>
          {reward && (
            <>
              <div className="mt-4 flex justify-center">
                <Stars n={reward.stars} size={40} />
              </div>
              <p className="mt-1 text-xs text-white/60">
                Precisión: {Math.round((tally.ok / Math.max(1, tally.total)) * 100)}% ({tally.ok}/{tally.total})
              </p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-white/10 p-3">
                  <div className="text-2xl font-black text-sky-300">+{reward.xp}</div>
                  <div className="text-xs text-white/60">XP</div>
                </div>
                <div className="rounded-xl bg-white/10 p-3">
                  <div className="text-2xl font-black text-gold">+{reward.gold}</div>
                  <div className="text-xs text-white/60">Oro</div>
                </div>
              </div>
              {reward.ups > 0 && <p className="mt-3 font-title font-extrabold text-emerald-300">⬆ ¡Subiste al nivel {s.level}!</p>}
              {cfg.mode === 'boss' && reward.stars < 3 && <p className="mt-3 text-xs text-white/60">Vuelve a enfrentarlo con más del 90 % de aciertos para lograr 3 estrellas.</p>}
              {cfg.mode === 'final' && <p className="mt-3 text-sm text-gold">¡Eres Leyenda Docente! Prueba ahora el Oráculo para medir tu nota.</p>}
            </>
          )}
          <button className="btn btn-gold mt-5 w-full" onClick={() => (sfx.click(), backTo())}>
            Continuar
          </button>
        </div>
      </Modal>

      {/* DERROTA */}
      <Modal open={phase === 'lose'}>
        <div className="text-center">
          <div className="text-6xl">💫</div>
          <h2 className="title-glow mt-2 text-3xl font-black">Has caído…</h2>
          <p className="mt-2 text-sm text-white/80">¡No pasa nada! Cada error que cometiste ahora está en tu Santuario de Repaso. Lee los pergaminos y vuelve con más fuerza.</p>
          <p className="mt-2 text-xs text-white/60">Recuperas la mitad de tus PV. En la tienda puedes descansar en la posada.</p>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <button className="btn btn-ghost" onClick={() => (sfx.click(), backTo())}>
              Volver
            </button>
            <button
              className="btn btn-gold"
              onClick={() => {
                sfx.click()
                if (cfg.mode === 'minion' || cfg.mode === 'boss') go({ name: 'study', id: cfg.region })
                else go({ name: 'grimoire' })
              }}
            >
              📜 Repasar
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

function FloatLayer({ floats }: { floats: Float[] }) {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-1/3 flex justify-center">
      <AnimatePresence>
        {floats.map((f) => (
          <motion.span
            key={f.id}
            initial={{ y: 0, opacity: 0, scale: 0.6 }}
            animate={{ y: -70, opacity: 1, scale: 1.15 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9 }}
            className="absolute whitespace-nowrap font-title text-lg font-black sm:text-2xl"
            style={{ color: f.color, textShadow: '0 3px 0 #000, 0 0 14px rgba(0,0,0,.8)' }}
          >
            {f.text}
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  )
}

function ItemBtn({ icon, label, n, onClick, disabled }: { icon: string; label: string; n: number; onClick: () => void; disabled?: boolean }) {
  return (
    <button
      disabled={n <= 0 || disabled}
      onClick={onClick}
      className="relative flex items-center gap-1.5 rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-xs font-bold backdrop-blur transition hover:border-gold/60 disabled:opacity-35"
      title={label}
    >
      <span className="text-lg">{icon}</span>
      <span className="hidden sm:inline">{label}</span>
      <span className="rounded-full bg-gold px-1.5 text-[10px] font-black text-ink">{n}</span>
    </button>
  )
}

function regionLabel(r: string) {
  return { peru: '🏔️ Sesión 1', cneb: '🌳 Sesión 2', latam: '🦜 Sesión 3', global: '❄️ Sesión 4' }[r] ?? ''
}
