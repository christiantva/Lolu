import { useState } from 'react'
import { Backdrop } from '../art/Backdrop'
import { Rich, ScreenHeader } from '../components/ui'
import { COMPARE_TABLE } from '../data/minigames'
import { ALL_QUESTIONS } from '../data/questions'
import { REGIONS } from '../data/regions'
import { SCROLLS } from '../data/scrolls'
import type { RegionId } from '../data/types'
import { weakQuestions } from '../game/engine'
import { useNav } from '../game/nav'
import { sfx } from '../game/sound'
import { useHero } from '../game/store'

type Tab = RegionId | 'compare' | 'weak'

/** Grimorio: todos los resúmenes, la tabla comparativa y tus preguntas falladas. */
export function Grimoire() {
  const { state: s } = useHero()
  const go = useNav()
  const [tab, setTab] = useState<Tab>('peru')
  const weak = weakQuestions(ALL_QUESTIONS, s)

  const tabs: { id: Tab; label: string }[] = [
    ...REGIONS.map((r) => ({ id: r.id as Tab, label: `${r.emoji} S${r.session}` })),
    { id: 'compare', label: '⚖️ Comparativo' },
    { id: 'weak', label: `🔁 Falladas (${weak.length})` },
  ]

  return (
    <div className="px-3 pb-10">
      <Backdrop scene="oracle" dim={0.2} />
      <ScreenHeader title="Grimorio del Saber" subtitle="Todo el curso en un solo libro" onBack={() => go({ name: 'map' })} />
      <div className="scroll-thin mx-auto mt-4 flex max-w-5xl gap-2 overflow-x-auto px-1 pb-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => (sfx.click(), setTab(t.id))}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold transition ${tab === t.id ? 'bg-gold text-ink' : 'bg-white/10 text-white/80 hover:bg-white/15'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mx-auto mt-3 max-w-5xl">
        {tab === 'compare' ? (
          <div className="panel scroll-thin overflow-x-auto p-2 sm:p-4">
            <table className="w-full min-w-[760px] border-separate border-spacing-1 text-left text-xs sm:text-sm">
              <thead>
                <tr>
                  <th className="p-2" />
                  {COMPARE_TABLE.cols.map((c) => (
                    <th key={c} className="rounded-lg bg-gold/20 p-2 font-title font-extrabold text-gold">
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARE_TABLE.rows.map((row) => (
                  <tr key={row.label}>
                    <th className="w-28 rounded-lg bg-white/10 p-2 align-top font-bold">{row.label}</th>
                    {row.vals.map((v, i) => (
                      <td key={i} className="rounded-lg bg-white/[.05] p-2 align-top leading-snug text-white/90">
                        {v}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : tab === 'weak' ? (
          <div className="space-y-3">
            {weak.length === 0 && <div className="panel p-6 text-center text-white/70">No tienes preguntas pendientes. ¡Sigue así! 🎉</div>}
            {weak.map((q) => (
              <div key={q.id} className="panel p-4">
                <p className="font-semibold">{q.q}</p>
                <p className="mt-2 text-sm text-emerald-200">✓ {q.options[q.answer]}</p>
                <p className="mt-1 text-sm text-white/75">{q.explain}</p>
                <p className="mt-2 text-[11px] text-white/40">
                  Aciertos {s.qstats[q.id]?.c ?? 0} · Errores {s.qstats[q.id]?.w ?? 0}
                </p>
              </div>
            ))}
            {weak.length >= 3 && (
              <button className="btn btn-gold w-full" onClick={() => go({ name: 'battle', battle: { mode: 'review' } })}>
                ⚔ Enfrentar a la Sombra del Error
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {SCROLLS.filter((x) => x.region === tab).map((sc) => (
              <article key={sc.id} className="parchment p-5">
                <h3 className="flex items-center gap-2 font-title text-lg font-extrabold">
                  <span className="text-2xl">{sc.icon}</span>
                  {sc.title}
                </h3>
                <ul className="mt-3 space-y-2 text-sm leading-relaxed">
                  {sc.points.map((p, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-[#a86b12]">◆</span>
                      <span>
                        <Rich text={p} />
                      </span>
                    </li>
                  ))}
                </ul>
                {sc.tip && (
                  <p className="mt-3 rounded-lg border border-dashed border-[#b88a4a] bg-[#fff6dc] p-2 text-xs">
                    💡 <Rich text={sc.tip} />
                  </p>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
