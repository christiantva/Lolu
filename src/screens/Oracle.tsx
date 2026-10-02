import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useMemo, useState } from 'react'
import { Backdrop } from '../art/Backdrop'
import { Monster } from '../art/Monster'
import { Rich, ScreenHeader } from '../components/ui'
import { ALL_QUESTIONS, COMPARE_QUESTIONS, questionsFor } from '../data/questions'
import { REGIONS } from '../data/regions'
import type { Question, RegionId } from '../data/types'
import { pickQuestions, prepare, recordAnswer, type LiveQuestion } from '../game/engine'
import { useNav } from '../game/nav'
import { sfx } from '../game/sound'
import { gainXp } from '../game/state'
import { useHero } from '../game/store'

const N = 20
const SECONDS = 45

type Scope = 'all' | RegionId

/** Prueba del Oráculo: simulacro de examen de 20 preguntas con nota vigesimal. */
export function Oracle() {
  const { state: s, update } = useHero()
  const go = useNav()
  const [scope, setScope] = useState<Scope | null>(null)
  const [timed, setTimed] = useState(true)

  if (!scope)
    return (
      <div className="px-3 pb-10">
        <Backdrop scene="oracle" />
        <ScreenHeader title="Prueba del Oráculo" subtitle="Simulacro de examen · nota sobre 20" onBack={() => go({ name: 'map' })} />
        <div className="mx-auto mt-6 max-w-2xl">
          <div className="panel-gold flex flex-col items-center p-6 text-center">
            <Monster kind="examiner" hue={250} size={150} />
            <p className="mt-2 text-sm text-white/85">
              El Oráculo te hará <b>{N} preguntas</b>. No hay objetos ni pistas: solo tú y lo que sabes. Al final recibirás tu nota y la revisión completa.
            </p>
            <label className="mt-4 flex items-center gap-2 text-sm">
              <input type="checkbox" checked={timed} onChange={(e) => setTimed(e.target.checked)} className="h-4 w-4 accent-amber-400" />
              Con tiempo ({SECONDS} s por pregunta)
            </label>
            <div className="mt-5 grid w-full gap-2 sm:grid-cols-2">
              <button className="btn btn-gold shine sm:col-span-2" onClick={() => (sfx.select(), setScope('all'))}>
                🔮 Examen completo (4 sesiones)
              </button>
              {REGIONS.map((r) => (
                <button key={r.id} className="btn btn-ghost text-sm" onClick={() => (sfx.select(), setScope(r.id))}>
                  {r.emoji} Solo sesión {r.session}
                </button>
              ))}
            </div>
            {s.bestExam > 0 && <p className="mt-4 text-xs text-white/60">Tu mejor nota: {s.bestExam}/20</p>}
          </div>
        </div>
      </div>
    )

  return <Exam scope={scope} timed={timed} onExit={() => go({ name: 'map' })} onRetry={() => go({ name: 'oracle' })} record={(q, ok) => update((g) => recordAnswer(g, q, ok))} onDone={(score) => update((g) => {
    g.bestExam = Math.max(g.bestExam, score)
    gainXp(g, score * 4)
    g.gold += score * 2
  })} stateRef={s} />
}

function Exam({ scope, timed, onExit, onRetry, record, onDone, stateRef }: { scope: Scope; timed: boolean; onExit: () => void; onRetry: () => void; record: (id: string, ok: boolean) => void; onDone: (score: number) => void; stateRef: Parameters<typeof pickQuestions>[2] }) {
  const qs = useMemo<LiveQuestion[]>(() => {
    let list: Question[]
    if (scope === 'all') {
      // 4 por sesión + 2 comparativas + 2 al azar, priorizando lo que menos dominas
      list = REGIONS.flatMap((r) => pickQuestions(questionsFor(r.id), 4, stateRef))
      list.push(...pickQuestions(COMPARE_QUESTIONS, 2, stateRef))
      list.push(...pickQuestions(ALL_QUESTIONS, N - list.length, stateRef, new Set(list.map((q) => q.id))))
    } else list = pickQuestions(questionsFor(scope), N, stateRef)
    return list.slice(0, N).map(prepare)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const [i, setI] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [left, setLeft] = useState(SECONDS)
  const done = answers.length === qs.length
  const q = qs[i]

  const pick = (k: number | null) => {
    if (answers.length > i) return
    const ok = k === q.answer
    ok ? sfx.correct() : sfx.wrong()
    record(q.id, ok)
    const next = [...answers, k]
    setAnswers(next)
    setTimeout(() => {
      if (i + 1 < qs.length) {
        setI(i + 1)
        setLeft(SECONDS)
      } else {
        const score = next.filter((a, j) => a === qs[j].answer).length
        score >= 14 ? sfx.victory() : sfx.defeat()
        onDone(score)
      }
    }, 700)
  }

  useEffect(() => {
    if (!timed || done || answers.length > i) return
    if (left <= 0) {
      pick(null)
      return
    }
    const t = setTimeout(() => setLeft((l) => l - 1), 1000)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [left, timed, done, i, answers.length])

  if (done) {
    const score = answers.filter((a, j) => a === qs[j].answer).length
    const verdict = score >= 18 ? '¡Excelente! Tienes el examen dominado.' : score >= 14 ? '¡Muy bien! Repasa los detalles que fallaste.' : score >= 11 ? 'Aprobado, pero conviene repasar más.' : 'Necesitas repasar los pergaminos y volver a intentarlo.'
    return (
      <div className="px-3 pb-10">
        <Backdrop scene="oracle" />
        <ScreenHeader title="Veredicto del Oráculo" onBack={onExit} />
        <div className="mx-auto mt-4 max-w-3xl">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="panel-gold p-6 text-center">
            <div className="font-title text-xs font-extrabold uppercase tracking-[0.3em] text-white/60">Tu nota</div>
            <div className={`title-glow mt-1 text-7xl font-black ${score < 11 ? 'grayscale' : ''}`}>
              {score}
              <span className="text-3xl">/20</span>
            </div>
            <p className="mt-2 text-sm text-white/85">{verdict}</p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <button className="btn btn-ghost" onClick={onExit}>
                Mapa
              </button>
              <button className="btn btn-gold" onClick={onRetry}>
                ↻ Otro intento
              </button>
            </div>
          </motion.div>
          <h3 className="mt-6 font-title text-lg font-extrabold text-gold">Revisión</h3>
          <div className="mt-2 space-y-2">
            {qs.map((qq, j) => {
              const ok = answers[j] === qq.answer
              return (
                <div key={qq.id} className={`panel border-l-4 p-3 ${ok ? 'border-l-emerald-400' : 'border-l-rose-400'}`}>
                  <p className="text-sm font-semibold">
                    {j + 1}. {qq.q}
                  </p>
                  {!ok && <p className="mt-1 text-xs text-rose-200">Tu respuesta: {answers[j] == null ? '⏱ sin responder' : qq.options[answers[j]!]}</p>}
                  <p className="mt-1 text-xs text-emerald-200">✓ {qq.options[qq.answer]}</p>
                  {!ok && (
                    <p className="mt-1 text-xs text-white/70">
                      <Rich text={qq.explain} />
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  const answered = answers.length > i
  return (
    <div className="px-3 pb-10">
      <Backdrop scene="oracle" />
      <ScreenHeader title={`Pregunta ${i + 1} de ${qs.length}`} subtitle="Prueba del Oráculo" onBack={onExit} right={timed ? <span className={`rounded-full px-3 py-1 font-title font-extrabold tabular-nums ${left <= 10 ? 'bg-rose-500/40 text-rose-100' : 'bg-white/10'}`}>⏱ {left}s</span> : undefined} />
      <div className="mx-auto mt-3 max-w-3xl">
        <div className="bar !h-2">
          <i style={{ width: `${(i / qs.length) * 100}%`, background: 'linear-gradient(90deg,#a77bff,#5ad1ff)' }} />
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={q.id} initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -40, opacity: 0 }}>
            <div className="panel-gold mt-4 p-5">
              <p className="text-base font-semibold leading-relaxed sm:text-lg">{q.q}</p>
            </div>
            <div className={`mt-3 grid gap-2.5 ${q.options.length === 2 ? 'grid-cols-2' : ''}`}>
              {q.options.map((o, k) => {
                const isAns = k === q.answer
                const isPick = answers[i] === k
                const cls = !answered ? 'border-white/15 bg-white/[.07] hover:border-gold/70' : isAns ? 'border-emerald-300 bg-emerald-500/30' : isPick ? 'border-rose-400 bg-rose-500/30' : 'border-white/10 opacity-50'
                return (
                  <button key={k} disabled={answered} onClick={() => pick(k)} className={`flex items-start gap-3 rounded-2xl border-2 p-3 text-left text-sm font-semibold transition sm:text-[15px] ${cls}`}>
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-black/40 font-title text-xs font-black text-gold">{String.fromCharCode(65 + k)}</span>
                    <span className="pt-0.5">{o}</span>
                  </button>
                )
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
