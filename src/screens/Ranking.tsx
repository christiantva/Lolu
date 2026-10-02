import { useEffect, useState } from 'react'
import { Backdrop } from '../art/Backdrop'
import { ScreenHeader } from '../components/ui'
import { useNav } from '../game/nav'
import { sfx } from '../game/sound'
import { CLASSES, totalScore, type HeroClass } from '../game/state'
import { useGame } from '../game/store'

interface Entry {
  id: string
  name: string
  cls: HeroClass
  level: number
  bosses: number
  exam: number
  score: number
}

const PID_KEY = 'cronicas-del-maestro:pid'
function playerId() {
  try {
    let id = localStorage.getItem(PID_KEY)
    if (!id) {
      id = crypto.randomUUID()
      localStorage.setItem(PID_KEY, id)
    }
    return id
  } catch {
    return crypto.randomUUID()
  }
}

export function Ranking() {
  const { state: s, toast } = useGame()
  const go = useNav()
  const [entries, setEntries] = useState<Entry[]>([])
  const [status, setStatus] = useState<'loading' | 'ok' | 'off' | 'error'>('loading')
  const [sending, setSending] = useState(false)

  const load = async () => {
    try {
      const r = await fetch('/api/leaderboard')
      const ct = r.headers.get('content-type') ?? ''
      if (!ct.includes('json')) return setStatus('off')
      const d = await r.json()
      if (!d.enabled) return setStatus('off')
      setEntries(d.entries ?? [])
      setStatus(r.ok ? 'ok' : 'error')
    } catch {
      setStatus('off')
    }
  }
  useEffect(() => {
    void load()
  }, [])

  const score = s ? totalScore(s) : 0
  const bosses = s ? Object.values(s.regions).filter((r) => r.boss > 0).length + (s.finalBoss > 0 ? 1 : 0) : 0

  const publish = async () => {
    if (!s) return
    setSending(true)
    try {
      const r = await fetch('/api/leaderboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: playerId(), name: s.name, cls: s.cls, level: s.level, score, bosses, exam: s.bestExam }),
      })
      const d = await r.json()
      if (d.ok) {
        sfx.victory()
        toast({ icon: '🏆', title: `¡Publicado! Puesto #${d.rank}`, body: `${score} puntos` })
        void load()
      } else toast({ icon: '⚠️', title: 'No se pudo publicar', body: d.error })
    } catch {
      toast({ icon: '⚠️', title: 'Sin conexión con el ranking' })
    }
    setSending(false)
  }

  const share = async () => {
    if (!s) return
    const text = `⚔️ Soy ${s.name}, ${CLASSES[s.cls].name} de nivel ${s.level} en Crónicas del Maestro. Tengo ${score} puntos y saqué ${s.bestExam}/20 en el Oráculo. ¿Me superas?`
    const url = location.origin
    try {
      if (navigator.share) await navigator.share({ title: 'Crónicas del Maestro', text, url })
      else {
        await navigator.clipboard.writeText(`${text} ${url}`)
        toast({ icon: '📋', title: 'Copiado al portapapeles' })
      }
    } catch {
      /* cancelado */
    }
  }

  return (
    <div className="px-3 pb-10">
      <Backdrop scene="title" dim={0.25} />
      <ScreenHeader title="Salón de la Fama" subtitle="Ranking de la clase" onBack={() => go({ name: s ? 'map' : 'title' })} />
      <div className="mx-auto mt-4 grid max-w-4xl gap-4 md:grid-cols-[1fr_300px]">
        <div className="panel p-3 sm:p-4">
          {status === 'loading' && <p className="p-6 text-center text-white/60">Consultando a los cronistas…</p>}
          {status === 'off' && (
            <div className="p-6 text-center text-sm text-white/70">
              <div className="text-4xl">📯</div>
              <p className="mt-2">El ranking global aún no está activado en este servidor.</p>
              <p className="mt-1 text-xs text-white/50">Quien administra el sitio debe conectar Upstash Redis en Vercel (ver README). Mientras tanto, comparte tu puntaje con el botón «Compartir con compañeros».</p>
            </div>
          )}
          {status === 'error' && <p className="p-6 text-center text-rose-200">No se pudo cargar el ranking. Intenta más tarde.</p>}
          {status === 'ok' && entries.length === 0 && <p className="p-6 text-center text-white/60">¡Nadie ha publicado todavía! Sé la primera persona.</p>}
          {status === 'ok' && entries.length > 0 && (
            <ol className="space-y-1.5">
              {entries.map((e, i) => (
                <li key={e.id + i} className={`flex items-center gap-3 rounded-xl p-2.5 ${i < 3 ? 'bg-gradient-to-r from-amber-400/20 to-transparent' : 'bg-white/5'}`}>
                  <span className="w-8 text-center font-title text-lg font-black text-gold">{['🥇', '🥈', '🥉'][i] ?? i + 1}</span>
                  <span className="text-xl">{CLASSES[e.cls]?.icon ?? '⭐'}</span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-bold">{e.name}</div>
                    <div className="text-[11px] text-white/55">
                      Nv {e.level} · 👑 {e.bosses} · 🔮 {e.exam}/20
                    </div>
                  </div>
                  <span className="font-title font-extrabold tabular-nums text-gold">{e.score}</span>
                </li>
              ))}
            </ol>
          )}
        </div>

        <div className="panel-gold flex flex-col gap-3 p-4">
          {s ? (
            <>
              <div className="text-center">
                <div className="text-xs font-bold uppercase tracking-widest text-white/60">Tu puntaje</div>
                <div className="title-glow text-5xl font-black">{score}</div>
                <div className="mt-1 text-xs text-white/60">
                  {s.name} · Nv {s.level} · 👑 {bosses}
                </div>
              </div>
              <button className="btn btn-gold" disabled={status !== 'ok' || sending} onClick={publish}>
                {sending ? 'Publicando…' : '📣 Publicar en el ranking'}
              </button>
              <button className="btn btn-ghost text-sm" onClick={share}>
                🔗 Compartir con compañeros
              </button>
              <p className="text-[11px] leading-snug text-white/50">El puntaje suma aciertos, estrellas, nivel y tu mejor nota del Oráculo. Puedes publicar las veces que quieras: se actualiza tu entrada.</p>
            </>
          ) : (
            <button className="btn btn-gold" onClick={() => go({ name: 'create' })}>
              ⚔ Crear héroe y competir
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
