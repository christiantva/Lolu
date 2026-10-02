import type { RegionDef } from '../data/types'

/** Retratos de los personajes guía de cada reino. */
export function Npc({ kind, size = 120 }: { kind: RegionDef['npc']['kind']; size?: number }) {
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} aria-hidden className="anim-bob">
      {kind === 'condor' && (
        <g>
          <path d="M14 80 Q4 50 30 40 Q22 64 40 76 Z M106 80 Q116 50 90 40 Q98 64 80 76 Z" fill="#2b2b3a" />
          <ellipse cx="60" cy="86" rx="30" ry="28" fill="#2b2b3a" />
          <path d="M36 66 Q60 80 84 66 Q80 82 60 84 Q40 82 36 66 Z" fill="#fff" />
          <circle cx="60" cy="44" r="22" fill="#e8a3a3" />
          <path d="M42 32 Q60 16 78 32 Q72 26 60 26 Q48 26 42 32 Z" fill="#c76a6a" />
          <circle cx="52" cy="42" r="4.5" fill="#1a0b1f" />
          <circle cx="68" cy="42" r="4.5" fill="#1a0b1f" />
          <circle cx="53" cy="40.5" r="1.5" fill="#fff" />
          <circle cx="69" cy="40.5" r="1.5" fill="#fff" />
          <path d="M54 50 Q60 48 66 50 L60 66 Z" fill="#f1d36b" stroke="#a8862a" strokeWidth="1.5" />
          {/* chullo */}
          <path d="M38 30 Q60 0 82 30 Z" fill="#c0392b" />
          <path d="M40 28 h40" stroke="#ffd23f" strokeWidth="4" strokeDasharray="4 3" />
          <circle cx="60" cy="6" r="5" fill="#ffd23f" />
          <path d="M40 30 l-4 16 M80 30 l4 16" stroke="#c0392b" strokeWidth="4" strokeLinecap="round" />
        </g>
      )}
      {kind === 'tree' && (
        <g>
          <path d="M44 120 Q48 90 40 74 L80 74 Q72 90 76 120 Z" fill="#7a5230" />
          <path d="M60 120 Q58 100 62 80" stroke="#5a3a20" strokeWidth="3" fill="none" />
          <circle cx="36" cy="50" r="24" fill="#2fbf71" />
          <circle cx="84" cy="50" r="24" fill="#2fbf71" />
          <circle cx="60" cy="34" r="28" fill="#3fd98a" />
          <circle cx="60" cy="62" r="24" fill="#26a862" />
          <circle cx="46" cy="28" r="5" fill="#ffe066" />
          <circle cx="82" cy="40" r="4" fill="#ff8fc1" />
          <circle cx="32" cy="56" r="4" fill="#ff8fc1" />
          <ellipse cx="50" cy="92" rx="4" ry="5" fill="#2a1a0a" />
          <ellipse cx="70" cy="92" rx="4" ry="5" fill="#2a1a0a" />
          <path d="M52 104 Q60 110 68 104" stroke="#2a1a0a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M40 86 q10 -6 18 0 M62 86 q10 -6 18 0" stroke="#2a1a0a" strokeWidth="2" fill="none" />
        </g>
      )}
      {kind === 'toucan' && (
        <g>
          <path d="M44 116 Q30 80 44 54 Q60 40 76 54 Q88 80 76 116 Z" fill="#1e1e2a" />
          <ellipse cx="60" cy="80" rx="16" ry="20" fill="#fff6d0" />
          <circle cx="60" cy="48" r="22" fill="#1e1e2a" />
          <circle cx="56" cy="46" r="10" fill="#7ad8ff" />
          <circle cx="56" cy="46" r="5" fill="#1a0b1f" />
          <circle cx="54" cy="44" r="1.8" fill="#fff" />
          <path d="M66 40 Q112 34 116 54 Q100 66 66 58 Z" fill="#ff8a1f" stroke="#b5530c" strokeWidth="2" />
          <path d="M66 40 Q112 34 116 54 L66 50 Z" fill="#ffd23f" />
          <path d="M108 44 Q114 48 116 54" stroke="#e0245e" strokeWidth="4" fill="none" />
          {/* lentes de Freire */}
          <circle cx="56" cy="46" r="12" fill="none" stroke="#3a2a1a" strokeWidth="2" />
          <path d="M44 44 l-6 -2" stroke="#3a2a1a" strokeWidth="2" />
        </g>
      )}
      {kind === 'owl' && (
        <g>
          <path d="M28 40 L36 14 L50 32 Z M92 40 L84 14 L70 32 Z" fill="#e6eefc" />
          <ellipse cx="60" cy="72" rx="38" ry="42" fill="#f4f8ff" stroke="#b8c9e6" strokeWidth="2" />
          {[[44, 92], [60, 100], [76, 92], [52, 82], [68, 82]].map(([x, y], i) => (
            <path key={i} d={`M${x - 5} ${y} q5 6 10 0`} stroke="#b8c9e6" strokeWidth="2" fill="none" />
          ))}
          <circle cx="44" cy="54" r="15" fill="#fff" stroke="#cfdcf0" strokeWidth="2" />
          <circle cx="76" cy="54" r="15" fill="#fff" stroke="#cfdcf0" strokeWidth="2" />
          <circle cx="44" cy="54" r="9" fill="#ffc83d" />
          <circle cx="76" cy="54" r="9" fill="#ffc83d" />
          <circle cx="44" cy="54" r="5" fill="#1a0b1f" />
          <circle cx="76" cy="54" r="5" fill="#1a0b1f" />
          <circle cx="42" cy="52" r="1.8" fill="#fff" />
          <circle cx="74" cy="52" r="1.8" fill="#fff" />
          <path d="M56 64 L64 64 L60 74 Z" fill="#ff9f3d" />
          {/* bufanda */}
          <path d="M28 100 Q60 112 92 100 L92 108 Q60 120 28 108 Z" fill="#2f6bff" />
          <path d="M80 104 l6 16 l8 -4 l-6 -14" fill="#2f6bff" />
          <path d="M36 102 v8 M48 105 v8 M60 106 v8 M72 105 v8" stroke="#fff" strokeWidth="2" opacity=".6" />
        </g>
      )}
    </svg>
  )
}
