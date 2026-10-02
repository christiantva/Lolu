import { motion } from 'motion/react'
import { Backdrop } from '../art/Backdrop'
import { Hero } from '../art/Hero'
import { Hud } from '../components/Hud'
import { Stars } from '../components/ui'
import { ALL_QUESTIONS, questionsFor } from '../data/questions'
import { REGIONS } from '../data/regions'
import type { RegionId } from '../data/types'
import { mastery, weakQuestions } from '../game/engine'
import { useNav } from '../game/nav'
import { sfx } from '../game/sound'
import { regionUnlocked } from '../game/state'
import { useHero } from '../game/store'

const ORDER = REGIONS.map((r) => r.id)
const POS: Record<RegionId | 'tower', [number, number]> = {
  peru: [95, 480],
  cneb: [300, 395],
  latam: [100, 280],
  global: [300, 170],
  tower: [200, 62],
}

export function WorldMap() {
  const { state: s } = useHero()
  const go = useNav()
  const allBosses = ORDER.every((r) => s.regions[r].boss > 0)
  const weak = weakQuestions(ALL_QUESTIONS, s).length
  const current = ORDER.findIndex((r, i) => regionUnlocked(s, i, ORDER) && s.regions[r].boss === 0)
  const heroAt = current === -1 ? 'tower' : ORDER[current]

  const path = `M${POS.peru} C 220 500, 260 440, ${POS.cneb} S 120 330, ${POS.latam} S 260 220, ${POS.global} S 220 90, ${POS.tower}`

  return (
    <div className="px-3 pt-3">
      <Backdrop scene="title" dim={0.1} />
      <Hud />
      <div className="mx-auto mt-3 grid max-w-5xl gap-4 lg:grid-cols-[1fr_320px]">
        {/* MAPA */}
        <div className="panel-gold relative overflow-hidden p-2">
          <svg viewBox="0 0 400 560" className="mx-auto h-auto max-h-[calc(100dvh-130px)] w-full" role="img" aria-label="Mapa del mundo">
            <defs>
              <radialGradient id="sea" cx=".5" cy=".5" r=".75">
                <stop offset="0" stopColor="#1d3b7a" />
                <stop offset="1" stopColor="#0b1640" />
              </radialGradient>
              <linearGradient id="land" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#3b2a6b" />
                <stop offset="1" stopColor="#2a1d52" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="4" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <rect width="400" height="560" fill="url(#sea)" />
            {/* olas */}
            {Array.from({ length: 18 }, (_, i) => (
              <path key={i} d={`M${(i * 71) % 380} ${(i * 113) % 540} q6 -4 12 0 q6 4 12 0`} stroke="#5a8ad8" strokeWidth="1.5" fill="none" opacity=".35" />
            ))}
            {/* continente */}
            <path
              d="M40 520 Q10 420 60 360 Q20 300 50 230 Q30 150 110 120 Q140 40 220 30 Q320 30 350 110 Q390 170 360 240 Q395 320 350 380 Q380 460 330 520 Q200 560 40 520 Z"
              fill="url(#land)"
              stroke="#ffd76a"
              strokeOpacity=".25"
              strokeWidth="2"
            />
            {/* zonas de color */}
            <ellipse cx={POS.peru[0]} cy={POS.peru[1]} rx="80" ry="55" fill="#ff7a59" opacity=".18" />
            <ellipse cx={POS.cneb[0]} cy={POS.cneb[1]} rx="80" ry="55" fill="#2fd38a" opacity=".18" />
            <ellipse cx={POS.latam[0]} cy={POS.latam[1]} rx="80" ry="55" fill="#ffd23f" opacity=".16" />
            <ellipse cx={POS.global[0]} cy={POS.global[1]} rx="80" ry="55" fill="#7cc8ff" opacity=".2" />
            {/* camino */}
            <path d={path} stroke="#000" strokeOpacity=".4" strokeWidth="9" fill="none" strokeLinecap="round" />
            <path d={path} stroke="#f3e1b5" strokeWidth="4" fill="none" strokeDasharray="2 10" strokeLinecap="round" />
            {/* rosa de los vientos */}
            <g transform="translate(355 515)" opacity=".7">
              <circle r="20" fill="none" stroke="#ffd76a" strokeWidth="1.5" />
              <path d="M0 -18 L4 0 L0 18 L-4 0 Z" fill="#ffd76a" />
              <path d="M-18 0 L0 4 L18 0 L0 -4 Z" fill="#ffd76a" opacity=".6" />
              <text y="-23" textAnchor="middle" fontSize="9" fill="#ffd76a" fontWeight="800">N</text>
            </g>

            {REGIONS.map((r, i) => {
              const [x, y] = POS[r.id]
              const unlocked = regionUnlocked(s, i, ORDER)
              const done = s.regions[r.id].boss > 0
              return (
                <g
                  key={r.id}
                  transform={`translate(${x} ${y})`}
                  className={unlocked ? 'cursor-pointer' : 'cursor-not-allowed'}
                  onClick={() => {
                    if (!unlocked) return sfx.wrong()
                    sfx.select()
                    go({ name: 'region', id: r.id })
                  }}
                >
                  <circle r="44" fill={r.colors.glow} opacity={unlocked ? 0.5 : 0.1} filter="url(#glow)" className={unlocked && !done ? 'anim-pulse' : ''} />
                  <circle r="34" fill={unlocked ? r.colors.to : '#2a2340'} stroke={unlocked ? r.colors.accent : '#555'} strokeWidth="3" />
                  <Landmark id={r.id} dim={!unlocked} />
                  {!unlocked && (
                    <g>
                      <circle r="34" fill="rgba(0,0,0,.55)" />
                      <text y="8" textAnchor="middle" fontSize="24">🔒</text>
                    </g>
                  )}
                  <g transform="translate(0 50)">
                    <rect x="-72" y="-12" width="144" height="22" rx="11" fill="rgba(10,6,30,.85)" stroke={r.colors.accent} strokeOpacity=".6" />
                    <text textAnchor="middle" y="4" fontSize="10.5" fontWeight="800" fill="#fff" fontFamily="Cinzel, serif">
                      {r.session}. {r.name.length > 22 ? r.name.slice(0, 21) + '…' : r.name}
                    </text>
                  </g>
                  {done && <text x="26" y="-24" fontSize="20">👑</text>}
                </g>
              )
            })}

            {/* torre final */}
            <g
              transform={`translate(${POS.tower[0]} ${POS.tower[1]})`}
              className={allBosses ? 'cursor-pointer' : 'cursor-not-allowed'}
              onClick={() => {
                if (!allBosses) return sfx.wrong()
                sfx.select()
                go({ name: 'battle', battle: { mode: 'final' } })
              }}
            >
              <circle r="40" fill={allBosses ? 'rgba(200,80,255,.5)' : 'rgba(80,60,120,.3)'} filter="url(#glow)" className={allBosses ? 'anim-pulse' : ''} />
              <rect x="-14" y="-30" width="28" height="50" fill="#3b145a" stroke="#c77dff" strokeWidth="2" />
              <path d="M-20 -28 L0 -52 L20 -28 Z" fill="#5a1d80" stroke="#c77dff" strokeWidth="2" />
              <rect x="-5" y="-16" width="10" height="14" rx="5" fill="#ffd76a" className="anim-glow" />
              <rect x="-6" y="6" width="12" height="14" rx="6" fill="#1a0828" />
              {!allBosses && <text y="5" textAnchor="middle" fontSize="18">🔒</text>}
              <g transform="translate(0 36)">
                <rect x="-62" y="-11" width="124" height="20" rx="10" fill="rgba(10,6,30,.85)" stroke="#c77dff" strokeOpacity=".7" />
                <text textAnchor="middle" y="4" fontSize="10" fontWeight="800" fill="#fff" fontFamily="Cinzel, serif">
                  Torre del Examinador
                </text>
              </g>
              {s.finalBoss > 0 && <text x="18" y="-40" fontSize="20">🏆</text>}
            </g>

            {/* héroe sobre el mapa */}
            <motion.g initial={false} animate={{ x: POS[heroAt][0] - 18, y: POS[heroAt][1] - 92 }} transition={{ type: 'spring', stiffness: 60 }}>
              <foreignObject width="36" height="48">
                <div className="anim-bob">
                  <Hero cls={s.cls} look={s.look} size={36} />
                </div>
              </foreignObject>
            </motion.g>
          </svg>
        </div>

        {/* PANEL LATERAL */}
        <div className="flex flex-col gap-3">
          <div className="panel p-4">
            <h2 className="font-title text-sm font-extrabold uppercase tracking-widest text-gold">Progreso por reino</h2>
            <div className="mt-3 space-y-2.5">
              {REGIONS.map((r, i) => {
                const m = mastery(questionsFor(r.id), s)
                const unlocked = regionUnlocked(s, i, ORDER)
                return (
                  <button
                    key={r.id}
                    disabled={!unlocked}
                    onClick={() => (sfx.select(), go({ name: 'region', id: r.id }))}
                    className="flex w-full items-center gap-3 rounded-xl bg-white/5 p-2 text-left hover:bg-white/10 disabled:opacity-40"
                  >
                    <span className="text-2xl">{unlocked ? r.emoji : '🔒'}</span>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-xs font-bold">
                        Sesión {r.session} · {r.name}
                      </div>
                      <div className="bar mt-1 !h-2">
                        <i style={{ width: `${m * 100}%`, background: `linear-gradient(90deg, ${r.colors.from}, ${r.colors.accent})` }} />
                      </div>
                    </div>
                    <Stars n={s.regions[r.id].boss} size={14} />
                  </button>
                )
              })}
            </div>
            <p className="mt-2 text-[11px] text-white/50">La barra indica el dominio: cuántas preguntas respondes mejor de lo que fallas.</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <MenuTile icon="📖" label="Grimorio" sub="Resúmenes y comparativo" onClick={() => go({ name: 'grimoire' })} />
            <MenuTile icon="🔮" label="Oráculo" sub={s.bestExam ? `Mejor: ${s.bestExam}/20` : 'Simulacro de examen'} onClick={() => go({ name: 'oracle' })} />
            <MenuTile icon="🔁" label="Santuario" sub={weak ? `${weak} por repasar` : 'Sin pendientes'} onClick={() => go({ name: 'battle', battle: { mode: 'review' } })} disabled={weak < 3} />
            <MenuTile icon="🛒" label="Tienda" sub="Pociones y más" onClick={() => go({ name: 'shop' })} />
            <MenuTile icon="🏅" label="Logros" sub={`${s.achievements.length} obtenidos`} onClick={() => go({ name: 'achievements' })} />
            <MenuTile icon="🏆" label="Ranking" sub="Compite con tu clase" onClick={() => go({ name: 'ranking' })} />
          </div>
          <button className="btn btn-ghost text-sm" onClick={() => (sfx.click(), go({ name: 'title' }))}>
            ⌂ Menú principal
          </button>
        </div>
      </div>
    </div>
  )
}

function MenuTile({ icon, label, sub, onClick, disabled }: { icon: string; label: string; sub: string; onClick: () => void; disabled?: boolean }) {
  return (
    <button
      disabled={disabled}
      onClick={() => (sfx.click(), onClick())}
      className="panel flex flex-col items-center gap-1 p-3 text-center transition hover:-translate-y-0.5 hover:border-gold/60 disabled:opacity-40 disabled:hover:translate-y-0"
    >
      <span className="text-3xl">{icon}</span>
      <span className="font-title text-sm font-extrabold">{label}</span>
      <span className="text-[11px] leading-tight text-white/60">{sub}</span>
    </button>
  )
}

function Landmark({ id, dim }: { id: RegionId; dim: boolean }) {
  const o = dim ? 0.4 : 1
  switch (id) {
    case 'peru':
      return (
        <g opacity={o}>
          <path d="M-26 14 L-10 -14 L0 -2 L10 -20 L26 14 Z" fill="#7a3a6a" />
          <path d="M10 -20 L16 -10 L10 -12 L5 -8 Z" fill="#fff" />
          {[0, 1, 2].map((i) => (
            <rect key={i} x={-18 + i * 4} y={4 - i * 6} width={36 - i * 8} height="5" fill="#c9a36a" />
          ))}
        </g>
      )
    case 'cneb':
      return (
        <g opacity={o}>
          <rect x="-4" y="0" width="8" height="18" fill="#6b4423" />
          <circle cx="-10" cy="-6" r="12" fill="#2fbf71" />
          <circle cx="10" cy="-6" r="12" fill="#2fbf71" />
          <circle cx="0" cy="-16" r="13" fill="#3fd98a" />
          <rect x="-9" y="-10" width="18" height="12" rx="1" fill="#fff6d8" stroke="#a8862a" />
          <path d="M0 -10 v12" stroke="#a8862a" />
        </g>
      )
    case 'latam':
      return (
        <g opacity={o}>
          <path d="M-22 16 L-22 8 L-14 8 L-14 0 L-6 0 L-6 -8 L6 -8 L6 0 L14 0 L14 8 L22 8 L22 16 Z" fill="#c9a36a" stroke="#7a5a2a" />
          <rect x="-4" y="-16" width="8" height="8" fill="#a8862a" />
          <path d="M18 -4 Q20 -24 26 -26 M18 -14 Q30 -18 32 -10" stroke="#2fbf71" strokeWidth="4" fill="none" strokeLinecap="round" />
        </g>
      )
    case 'global':
      return (
        <g opacity={o}>
          <path d="M-26 14 L-12 -16 L-2 0 L8 -20 L24 14 Z" fill="#dfe9ff" />
          <path d="M-12 -16 L-6 -6 L-12 -8 L-16 -4 Z M8 -20 L14 -10 L8 -12 L3 -8 Z" fill="#fff" />
          <rect x="6" y="-2" width="5" height="16" fill="#2b3a8f" />
          <rect x="13" y="-6" width="5" height="20" fill="#2b3a8f" />
          <rect x="20" y="-2" width="5" height="16" fill="#2b3a8f" />
          <rect x="4" y="-8" width="23" height="3" rx="1.5" fill="#2b3a8f" />
        </g>
      )
  }
}
