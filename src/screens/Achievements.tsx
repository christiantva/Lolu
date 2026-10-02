import { Backdrop } from '../art/Backdrop'
import { ScreenHeader } from '../components/ui'
import { ACHIEVEMENTS } from '../game/achievements'
import { useNav } from '../game/nav'
import { useHero } from '../game/store'

export function Achievements() {
  const { state: s } = useHero()
  const go = useNav()
  const acc = s.correct + s.wrong ? Math.round((s.correct / (s.correct + s.wrong)) * 100) : 0
  return (
    <div className="px-3 pb-10">
      <Backdrop scene="title" dim={0.25} />
      <ScreenHeader title="Salón de Logros" subtitle={`${s.achievements.length} de ${ACHIEVEMENTS.length} desbloqueados`} onBack={() => go({ name: 'map' })} />
      <div className="mx-auto mt-4 grid max-w-5xl grid-cols-3 gap-2 px-1 sm:grid-cols-5">
        {[
          ['✅', s.correct, 'Aciertos'],
          ['❌', s.wrong, 'Errores'],
          ['🎯', `${acc}%`, 'Precisión'],
          ['🔥', s.bestStreak, 'Mejor racha'],
          ['🔮', `${s.bestExam}/20`, 'Mejor Oráculo'],
        ].map(([i, v, l]) => (
          <div key={l as string} className="panel p-3 text-center">
            <div className="text-xl">{i}</div>
            <div className="font-title text-lg font-extrabold text-gold">{v}</div>
            <div className="text-[11px] text-white/60">{l}</div>
          </div>
        ))}
      </div>
      <div className="mx-auto mt-4 grid max-w-5xl gap-3 px-1 sm:grid-cols-2 lg:grid-cols-3">
        {ACHIEVEMENTS.map((a) => {
          const got = s.achievements.includes(a.id)
          return (
            <div key={a.id} className={`panel flex items-center gap-3 p-3 ${got ? 'border-gold/60' : 'opacity-50 grayscale'}`}>
              <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-3xl ${got ? 'bg-gradient-to-br from-amber-300/40 to-orange-600/40 shine' : 'bg-white/5'}`}>{got ? a.icon : '🔒'}</div>
              <div>
                <div className="font-title text-sm font-extrabold">{a.name}</div>
                <div className="text-xs text-white/65">{a.desc}</div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
