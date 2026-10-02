import { useId } from 'react'
import { CLASSES, HAIRS, SKINS, type HeroClass, type HeroLook } from '../game/state'

interface Props {
  cls: HeroClass
  look: HeroLook
  size?: number
  className?: string
  pose?: 'idle' | 'attack' | 'hurt'
}

/** Héroe chibi dibujado en SVG. Cambia de atuendo y accesorio según la clase. */
export function Hero({ cls, look, size = 160, className = '', pose = 'idle' }: Props) {
  const uid = useId().replace(/:/g, '')
  const c = CLASSES[cls]
  const skin = SKINS[look.skin] ?? SKINS[0]
  const hair = HAIRS[look.hair] ?? HAIRS[0]
  const tilt = pose === 'attack' ? 'rotate(-6 60 120)' : pose === 'hurt' ? 'rotate(5 60 120)' : ''

  return (
    <svg viewBox="0 0 120 160" width={size} height={(size * 160) / 120} className={className} aria-hidden>
      <defs>
        <linearGradient id={`robe${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={c.color} />
          <stop offset="1" stopColor={c.color2} />
        </linearGradient>
        <radialGradient id={`skin${uid}`} cx=".4" cy=".35" r=".8">
          <stop offset="0" stopColor={skin} />
          <stop offset="1" stopColor={shade(skin, -18)} />
        </radialGradient>
        <linearGradient id={`hair${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={shade(hair, 25)} />
          <stop offset="1" stopColor={hair} />
        </linearGradient>
        <radialGradient id={`orb${uid}`} cx=".35" cy=".35" r=".7">
          <stop offset="0" stopColor="#fff" />
          <stop offset=".4" stopColor={c.color} />
          <stop offset="1" stopColor={c.color2} />
        </radialGradient>
      </defs>

      <ellipse cx="60" cy="152" rx="30" ry="6" fill="rgba(0,0,0,.35)" />
      <g transform={tilt}>
        {/* capa / cabello trasero */}
        {cls === 'paladin' && <path d="M34 78 Q60 70 86 78 L94 140 Q60 148 26 140 Z" fill="#8b1e3f" opacity=".95" />}
        {look.style === 1 && <path d="M30 44 Q28 96 40 104 L80 104 Q92 96 90 44 Z" fill={`url(#hair${uid})`} />}

        {/* piernas */}
        <rect x="46" y="124" width="11" height="22" rx="5" fill="#3a2a4a" />
        <rect x="63" y="124" width="11" height="22" rx="5" fill="#3a2a4a" />
        <ellipse cx="51" cy="146" rx="9" ry="5" fill="#2a1a2a" />
        <ellipse cx="69" cy="146" rx="9" ry="5" fill="#2a1a2a" />

        {/* túnica */}
        <path d="M38 80 Q60 72 82 80 L90 130 Q60 138 30 130 Z" fill={`url(#robe${uid})`} stroke="rgba(0,0,0,.25)" strokeWidth="1.5" />
        <path d="M60 78 L60 132" stroke="rgba(255,255,255,.25)" strokeWidth="2" />
        <rect x="38" y="104" width="44" height="6" rx="3" fill="rgba(0,0,0,.25)" />
        <circle cx="60" cy="107" r="4.5" fill="#ffd76a" stroke="#a86b12" strokeWidth="1" />

        {/* brazos */}
        <path d="M38 84 Q26 98 30 114" stroke={`url(#robe${uid})`} strokeWidth="11" strokeLinecap="round" fill="none" />
        <path d="M82 84 Q96 96 92 112" stroke={`url(#robe${uid})`} strokeWidth="11" strokeLinecap="round" fill="none" />
        <circle cx="30" cy="116" r="6" fill={skin} />
        <circle cx="92" cy="114" r="6" fill={skin} />

        {/* accesorios de clase (mano derecha) */}
        {cls === 'paladin' && (
          <g>
            <path d="M96 116 L112 40" stroke="#d9dde8" strokeWidth="5" strokeLinecap="round" />
            <path d="M96 116 L112 40" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" opacity=".7" />
            <rect x="86" y="110" width="18" height="5" rx="2" fill="#a86b12" transform="rotate(-15 95 112)" />
            <path d="M14 96 L34 92 L36 118 Q26 132 16 120 Z" fill="#f5b83d" stroke="#8a4d0e" strokeWidth="2" />
            <path d="M25 100 L25 120 M18 108 L32 106" stroke="#8a4d0e" strokeWidth="2.5" />
          </g>
        )}
        {cls === 'arcanista' && (
          <g>
            <path d="M94 120 L104 34" stroke="#6b4423" strokeWidth="4.5" strokeLinecap="round" />
            <circle cx="105" cy="30" r="9" fill={`url(#orb${uid})`} className="anim-pulse" />
            <circle cx="105" cy="30" r="14" fill={c.color} opacity=".25" className="anim-pulse" />
          </g>
        )}
        {cls === 'trotamundos' && (
          <g>
            <rect x="88" y="100" width="22" height="16" rx="2" fill="#f3e1b5" stroke="#8a6a32" strokeWidth="1.5" transform="rotate(-12 99 108)" />
            <path d="M92 106 Q99 102 106 108" stroke="#c0392b" strokeWidth="1.5" fill="none" strokeDasharray="2 2" transform="rotate(-12 99 108)" />
            <circle cx="22" cy="118" r="8" fill="#ffd76a" stroke="#8a6a32" strokeWidth="2" />
            <path d="M22 112 L24 118 L22 124 L20 118 Z" fill="#c0392b" />
          </g>
        )}
        {cls === 'guia' && (
          <g>
            <path d="M94 118 L100 50" stroke="#ffd1e6" strokeWidth="4" strokeLinecap="round" />
            <path d="M100 38 C94 30 84 38 100 52 C116 38 106 30 100 38 Z" fill="#ff5fa2" stroke="#fff" strokeWidth="1.5" className="anim-pulse" />
          </g>
        )}

        {/* cabeza */}
        <circle cx="60" cy="50" r="30" fill={`url(#skin${uid})`} />
        {/* cabello delantero */}
        {look.style === 0 && <path d="M30 50 Q28 18 60 18 Q92 18 90 50 Q84 34 72 32 Q60 40 44 34 Q34 38 30 50 Z" fill={`url(#hair${uid})`} />}
        {look.style === 1 && <path d="M30 52 Q26 16 60 16 Q94 16 90 52 Q86 30 66 30 Q52 36 40 32 Q32 40 30 52 Z" fill={`url(#hair${uid})`} />}
        {look.style === 2 && (
          <g>
            <circle cx="60" cy="14" r="11" fill={`url(#hair${uid})`} />
            <path d="M30 50 Q28 20 60 20 Q92 20 90 50 Q80 32 60 32 Q40 32 30 50 Z" fill={`url(#hair${uid})`} />
          </g>
        )}

        {/* sombreros por clase */}
        {cls === 'arcanista' && (
          <g>
            <path d="M24 34 Q60 22 96 34 Q60 44 24 34 Z" fill={c.color2} />
            <path d="M38 32 Q52 -6 84 2 Q70 10 78 30 Z" fill={`url(#robe${uid})`} />
            <circle cx="66" cy="16" r="2.2" fill="#ffe680" />
            <circle cx="56" cy="26" r="1.6" fill="#ffe680" />
          </g>
        )}
        {cls === 'paladin' && <path d="M32 36 Q60 10 88 36 L84 40 Q60 26 36 40 Z" fill="#cfd6e4" stroke="#7b8599" strokeWidth="1.5" />}
        {cls === 'trotamundos' && (
          <g>
            <path d="M28 36 Q60 26 92 36 L88 42 Q60 34 32 42 Z" fill="#c0392b" />
            <path d="M90 38 L102 46 L92 48 Z" fill="#c0392b" />
          </g>
        )}
        {cls === 'guia' && (
          <g>
            {[34, 46, 60, 74, 86].map((x, i) => (
              <circle key={x} cx={x} cy={i % 2 ? 26 : 30} r="4" fill={['#ff8fc1', '#ffe066', '#8fe3ff', '#ffe066', '#ff8fc1'][i]} stroke="#fff" strokeWidth="1" />
            ))}
          </g>
        )}

        {/* cara */}
        {pose === 'hurt' ? (
          <g stroke="#2b1b2b" strokeWidth="2.5" strokeLinecap="round">
            <path d="M44 50 L52 56 M52 50 L44 56" />
            <path d="M68 50 L76 56 M76 50 L68 56" />
          </g>
        ) : (
          <g>
            <ellipse cx="48" cy="53" rx="5" ry="6.5" fill="#2b1b2b" />
            <ellipse cx="72" cy="53" rx="5" ry="6.5" fill="#2b1b2b" />
            <circle cx="50" cy="50.5" r="2" fill="#fff" />
            <circle cx="74" cy="50.5" r="2" fill="#fff" />
          </g>
        )}
        <ellipse cx="40" cy="63" rx="5" ry="3" fill="#ff8a9a" opacity=".5" />
        <ellipse cx="80" cy="63" rx="5" ry="3" fill="#ff8a9a" opacity=".5" />
        {pose === 'hurt' ? <ellipse cx="60" cy="68" rx="4" ry="3" fill="#7a2b3b" /> : <path d="M53 65 Q60 72 67 65" stroke="#7a2b3b" strokeWidth="2.5" fill="none" strokeLinecap="round" />}
      </g>
    </svg>
  )
}

/** Aclara/oscurece un color hex. */
export function shade(hex: string, pct: number) {
  const n = parseInt(hex.slice(1), 16)
  const f = (v: number) => Math.max(0, Math.min(255, Math.round(v + (pct / 100) * 255)))
  const r = f(n >> 16)
  const g = f((n >> 8) & 255)
  const b = f(n & 255)
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`
}
