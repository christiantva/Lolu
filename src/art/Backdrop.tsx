import { useMemo } from 'react'
import type { RegionId } from '../data/types'

type Scene = RegionId | 'title' | 'tower' | 'oracle'

/**
 * Fondo ilustrado a pantalla completa para cada reino: cielo en degradado,
 * capas de montañas/árboles con parallax suave y partículas ambientales.
 */
export function Backdrop({ scene, dim = 0 }: { scene: Scene; dim?: number }) {
  const particles = useMemo(
    () =>
      Array.from({ length: 28 }, (_, i) => ({
        left: (i * 37.3) % 100,
        top: (i * 53.7) % 100,
        delay: (i * 0.37) % 6,
        dur: 6 + ((i * 1.7) % 7),
        size: 2 + ((i * 13) % 5),
      })),
    [],
  )

  const sky: Record<Scene, [string, string, string]> = {
    title: ['#0b0820', '#2a1660', '#7a2f8f'],
    peru: ['#1d0f3a', '#7a2a5c', '#ff8a5c'],
    cneb: ['#04161c', '#0d3b4f', '#1f8a6a'],
    latam: ['#0b2a1c', '#0b6e4f', '#f2c14e'],
    global: ['#0a0f2e', '#2b3a8f', '#8fd3ff'],
    tower: ['#05020f', '#2a0b3f', '#6a1b6b'],
    oracle: ['#070418', '#1a1050', '#3b2a8f'],
  }
  const [a, b, c] = sky[scene]
  const particle = scene === 'global' ? 'snow' : scene === 'cneb' ? 'firefly' : scene === 'latam' ? 'leaf' : scene === 'peru' ? 'ember' : 'star'

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${a} 0%, ${b} 55%, ${c} 100%)` }} />
      {/* estrellas */}
      <div className="stars absolute inset-0 opacity-70" />
      {/* sol / luna */}
      <div
        className="absolute rounded-full anim-pulse"
        style={{
          width: 180, height: 180, right: '10%', top: '12%',
          background: scene === 'peru' || scene === 'latam' ? 'radial-gradient(circle, #fff3c4 0%, #ffcf5a 40%, rgba(255,160,60,0) 70%)' : 'radial-gradient(circle, #ffffff 0%, #d9e6ff 35%, rgba(160,190,255,0) 70%)',
          filter: 'blur(1px)',
        }}
      />
      <svg className="absolute bottom-0 left-0 w-[120%] h-[60%] -translate-x-[8%] parallax-slow" viewBox="0 0 1200 600" preserveAspectRatio="xMidYMax slice">
        <Layers scene={scene} />
      </svg>
      {particles.map((p, i) => (
        <span
          key={i}
          className={`particle particle-${particle}`}
          style={{ left: `${p.left}%`, top: `${p.top}%`, width: p.size, height: p.size, animationDelay: `${p.delay}s`, animationDuration: `${p.dur}s` }}
        />
      ))}
      <div className="absolute inset-0" style={{ background: `rgba(5,3,15,${0.25 + dim})` }} />
      <div className="vignette absolute inset-0" />
    </div>
  )
}

function Layers({ scene }: { scene: Scene }) {
  switch (scene) {
    case 'peru':
      return (
        <g>
          <path d="M0 330 L160 170 L260 260 L420 90 L560 250 L700 140 L860 280 L1000 120 L1200 300 L1200 600 L0 600 Z" fill="#5a2456" />
          <path d="M0 420 L200 300 L380 400 L560 310 L760 420 L960 330 L1200 430 L1200 600 L0 600 Z" fill="#33133a" />
          {/* terrazas andinas */}
          <path d="M80 520 L120 470 L180 470 L210 440 L290 440 L320 410 L400 410 L440 450 L470 450 L520 520 Z" fill="#40173f" />
          <path d="M0 500 Q300 450 600 500 T1200 490 L1200 600 L0 600 Z" fill="#1f0a24" />
        </g>
      )
    case 'cneb':
      return (
        <g>
          <path d="M0 360 Q150 300 300 350 T600 340 T900 330 T1200 350 L1200 600 L0 600 Z" fill="#0c3a3a" />
          {Array.from({ length: 14 }, (_, i) => (
            <g key={i} transform={`translate(${i * 90 - 20} ${380 - (i % 3) * 30})`}>
              <rect x="34" y="60" width="14" height="160" fill="#08262a" />
              <ellipse cx="41" cy="50" rx="52" ry="70" fill={i % 2 ? '#0e4d45' : '#0b4038'} />
            </g>
          ))}
          <path d="M0 520 Q300 470 600 520 T1200 510 L1200 600 L0 600 Z" fill="#051c1e" />
          {[180, 520, 880].map((x) => (
            <circle key={x} cx={x} cy="480" r="7" fill="#ff8fc1" opacity=".8" />
          ))}
        </g>
      )
    case 'latam':
      return (
        <g>
          {/* pirámide */}
          <path d="M760 360 L840 360 L840 330 L870 330 L870 300 L900 300 L900 270 L960 270 L960 300 L990 300 L990 330 L1020 330 L1020 360 L1100 360 L1100 420 L760 420 Z" fill="#7a5a2a" opacity=".85" />
          <rect x="910" y="245" width="40" height="25" fill="#8a6a32" />
          <path d="M0 400 Q200 330 400 390 T800 380 T1200 400 L1200 600 L0 600 Z" fill="#0a4a32" />
          {Array.from({ length: 9 }, (_, i) => (
            <g key={i} transform={`translate(${i * 140 + 20} ${430 - (i % 2) * 20})`}>
              <path d="M40 160 Q46 80 40 0" stroke="#3a2a1a" strokeWidth="9" fill="none" />
              {[-60, -25, 15, 50, 85].map((ang) => (
                <path key={ang} d="M40 0 Q80 -10 110 20" stroke="#14804f" strokeWidth="14" fill="none" strokeLinecap="round" transform={`rotate(${ang} 40 0)`} />
              ))}
            </g>
          ))}
          <path d="M0 530 Q300 490 600 530 T1200 520 L1200 600 L0 600 Z" fill="#06301f" />
        </g>
      )
    case 'global':
      return (
        <g>
          <path d="M0 340 L140 180 L240 260 L380 110 L520 270 L640 160 L780 300 L900 150 L1040 280 L1200 200 L1200 600 L0 600 Z" fill="#3a4a9f" />
          <path d="M380 110 L430 170 L400 160 L380 190 L362 160 L330 168 Z M900 150 L950 210 L918 200 L900 225 L882 200 L850 208 Z M140 180 L180 228 L150 222 L130 240 L110 222 Z" fill="#fff" />
          {/* skyline de Singapur */}
          <g fill="#1b2266" opacity=".9">
            <rect x="760" y="330" width="40" height="120" />
            <rect x="810" y="300" width="34" height="150" />
            <rect x="854" y="330" width="40" height="120" />
            <path d="M752 300 Q822 280 902 300 L902 310 L752 310 Z" />
            <rect x="920" y="360" width="30" height="90" />
            <rect x="960" y="340" width="26" height="110" />
          </g>
          <path d="M0 440 Q300 380 600 440 T1200 430 L1200 600 L0 600 Z" fill="#dfe9ff" />
          {Array.from({ length: 8 }, (_, i) => (
            <path key={i} d={`M${60 + i * 150} 470 l26 -70 l26 70 Z`} fill="#1f5f6a" />
          ))}
          <path d="M0 520 Q300 490 600 520 T1200 515 L1200 600 L0 600 Z" fill="#f4f8ff" />
        </g>
      )
    case 'tower':
      return (
        <g>
          <path d="M0 420 Q300 360 600 420 T1200 410 L1200 600 L0 600 Z" fill="#1a0828" />
          <rect x="540" y="120" width="120" height="320" fill="#2a0f3f" />
          <path d="M520 130 L600 20 L680 130 Z" fill="#3b145a" />
          {[180, 240, 300, 360].map((y) => (
            <rect key={y} x="588" y={y} width="24" height="32" rx="12" fill="#ffd76a" className="anim-glow" />
          ))}
          <path d="M0 520 Q300 480 600 520 T1200 515 L1200 600 L0 600 Z" fill="#0b0414" />
        </g>
      )
    default:
      return (
        <g>
          <path d="M0 380 L180 240 L320 330 L480 180 L640 320 L800 210 L960 330 L1200 220 L1200 600 L0 600 Z" fill="#2a1450" />
          {/* castillo */}
          <g fill="#1a0b33">
            <rect x="520" y="260" width="160" height="200" />
            <rect x="500" y="220" width="40" height="240" />
            <rect x="660" y="220" width="40" height="240" />
            <path d="M496 222 L520 180 L544 222 Z M656 222 L680 180 L704 222 Z" />
            <rect x="580" y="200" width="40" height="80" />
            <path d="M576 202 L600 150 L624 202 Z" />
          </g>
          <path d="M0 470 Q300 420 600 470 T1200 460 L1200 600 L0 600 Z" fill="#140828" />
        </g>
      )
  }
}
