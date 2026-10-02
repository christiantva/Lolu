import { AnimatePresence, motion } from 'motion/react'
import { Fragment, type ReactNode } from 'react'
import { useGame } from '../game/store'
import { sfx } from '../game/sound'

/** Convierte **negrita** y *cursiva* en elementos. */
export function Rich({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g)
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith('**') ? (
          <strong key={i} className="font-extrabold">
            {p.slice(2, -2)}
          </strong>
        ) : p.startsWith('*') ? (
          <em key={i} className="opacity-90">
            {p.slice(1, -1)}
          </em>
        ) : (
          <Fragment key={i}>{p}</Fragment>
        ),
      )}
    </>
  )
}

export function Bar({ value, max, color, label, className = '' }: { value: number; max: number; color: string; label?: string; className?: string }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100))
  return (
    <div className={className}>
      {label && (
        <div className="mb-1 flex justify-between text-[11px] font-bold uppercase tracking-wider text-white/80">
          <span>{label}</span>
          <span className="tabular-nums">
            {Math.max(0, Math.round(value))}/{max}
          </span>
        </div>
      )}
      <div className="bar">
        <i style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  )
}

export function Stars({ n, size = 22, max = 3 }: { n: number; size?: number; max?: number }) {
  return (
    <span className="inline-flex gap-0.5" aria-label={`${n} de ${max} estrellas`}>
      {Array.from({ length: max }, (_, i) => (
        <svg key={i} viewBox="0 0 24 24" width={size} height={size}>
          <path
            d="M12 2l3 6.6 7.2.8-5.4 4.9 1.5 7.1L12 17.8 5.7 21.4l1.5-7.1L1.8 9.4 9 8.6z"
            fill={i < n ? '#ffd76a' : 'rgba(255,255,255,.15)'}
            stroke={i < n ? '#a86b12' : 'rgba(255,255,255,.25)'}
            strokeWidth="1.2"
          />
        </svg>
      ))}
    </span>
  )
}

export function Modal({ open, onClose, children, wide }: { open: boolean; onClose?: () => void; children: ReactNode; wide?: boolean }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className={`panel-gold max-h-[90vh] w-full overflow-y-auto scroll-thin p-5 sm:p-7 ${wide ? 'max-w-3xl' : 'max-w-md'}`}
            initial={{ scale: 0.85, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function Toasts() {
  const { toasts } = useGame()
  return (
    <div className="pointer-events-none fixed inset-x-0 top-3 z-[60] flex flex-col items-center gap-2 px-3">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            layout
            initial={{ y: -40, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="panel-gold flex max-w-sm items-center gap-3 px-4 py-3"
          >
            <span className="text-3xl">{t.icon}</span>
            <div>
              <div className="font-title text-sm font-extrabold text-gold">{t.title}</div>
              {t.body && <div className="text-xs text-white/80">{t.body}</div>}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

export function BackButton({ onClick, label = 'Volver' }: { onClick: () => void; label?: string }) {
  return (
    <button
      className="btn btn-ghost px-3 py-2 text-sm"
      onClick={() => {
        sfx.click()
        onClick()
      }}
    >
      ← {label}
    </button>
  )
}

export function ScreenHeader({ title, subtitle, onBack, right }: { title: string; subtitle?: string; onBack?: () => void; right?: ReactNode }) {
  return (
    <div className="mx-auto flex w-full max-w-5xl items-center gap-3 px-4 pt-4">
      {onBack && <BackButton onClick={onBack} />}
      <div className="min-w-0 flex-1">
        <h1 className="title-glow line-clamp-2 text-lg leading-tight font-black sm:text-3xl">{title}</h1>
        {subtitle && <p className="truncate text-xs text-white/70 sm:text-sm">{subtitle}</p>}
      </div>
      {right}
    </div>
  )
}
