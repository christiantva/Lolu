import { motion } from 'motion/react'
import { useState } from 'react'
import { Backdrop } from '../art/Backdrop'
import { Hero } from '../art/Hero'
import { Monster } from '../art/Monster'
import { Modal } from '../components/ui'
import { ALL_QUESTIONS } from '../data/questions'
import { useNav } from '../game/nav'
import { sfx } from '../game/sound'
import { wipe } from '../game/state'
import { useGame } from '../game/store'

export function Title() {
  const { state, setState } = useGame()
  const go = useNav()
  const [confirm, setConfirm] = useState(false)
  const [help, setHelp] = useState(false)

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-4 py-10 text-center">
      <Backdrop scene="title" />
      <motion.div initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }}>
        <p className="font-title text-xs font-extrabold uppercase tracking-[0.35em] text-gold/80 sm:text-sm">Fundamentos de la Educación Primaria</p>
        <h1 className="title-glow mt-3 text-5xl leading-none font-black sm:text-7xl">
          Crónicas
          <br />
          del Maestro
        </h1>
        <p className="mx-auto mt-4 max-w-md text-sm text-white/80 sm:text-base">
          Un RPG para dominar las 4 sesiones del curso. Vence a los jefes de cada reino respondiendo como en el examen.
        </p>
      </motion.div>

      <div className="relative my-6 flex items-end justify-center gap-2 sm:gap-10">
        <motion.div initial={{ x: -60, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3, type: 'spring' }}>
          <Hero cls="arcanista" look={{ skin: 1, hair: 0, style: 1 }} size={110} />
        </motion.div>
        <motion.div initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.5, type: 'spring' }}>
          <Monster kind="dragon" hue={210} size={170} boss />
        </motion.div>
        <motion.div initial={{ x: 60, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4, type: 'spring' }}>
          <Hero cls="paladin" look={{ skin: 2, hair: 1, style: 0 }} size={110} />
        </motion.div>
      </div>

      <motion.div className="flex w-full max-w-xs flex-col gap-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
        {state ? (
          <>
            <button className="btn btn-gold shine text-lg" onClick={() => (sfx.select(), go({ name: 'map' }))}>
              ▶ Continuar aventura
            </button>
            <p className="-mt-1 text-xs text-white/60">
              {state.name} · Nivel {state.level}
            </p>
            <button className="btn btn-ghost" onClick={() => setConfirm(true)}>
              ✦ Nueva partida
            </button>
          </>
        ) : (
          <button className="btn btn-gold shine text-lg" onClick={() => (sfx.select(), go({ name: 'create' }))}>
            ⚔ Comenzar aventura
          </button>
        )}
        <div className="grid grid-cols-2 gap-3">
          <button className="btn btn-ghost px-3 text-sm" onClick={() => (sfx.click(), go({ name: 'ranking' }))}>
            🏆 Ranking
          </button>
          <button className="btn btn-ghost px-3 text-sm" onClick={() => (sfx.click(), setHelp(true))}>
            ❔ Cómo jugar
          </button>
        </div>
      </motion.div>

      <p className="mt-8 text-[11px] text-white/40">{ALL_QUESTIONS.length} preguntas · 4 reinos · tu progreso se guarda en este dispositivo</p>

      <Modal open={confirm} onClose={() => setConfirm(false)}>
        <h2 className="title-glow text-2xl font-black">¿Empezar de nuevo?</h2>
        <p className="mt-3 text-sm text-white/80">Perderás tu héroe, tu nivel y tu progreso en este dispositivo.</p>
        <div className="mt-5 flex gap-3">
          <button className="btn btn-ghost flex-1" onClick={() => setConfirm(false)}>
            Cancelar
          </button>
          <button
            className="btn btn-gold flex-1"
            onClick={() => {
              wipe()
              setState(null)
              setConfirm(false)
              go({ name: 'create' })
            }}
          >
            Sí, nueva partida
          </button>
        </div>
      </Modal>

      <Modal open={help} onClose={() => setHelp(false)} wide>
        <h2 className="title-glow text-2xl font-black">Cómo jugar</h2>
        <ul className="mt-4 space-y-3 text-left text-sm text-white/85">
          <li>🗺️ <b>Mapa:</b> hay 4 reinos, uno por cada sesión del curso. Al derrotar al jefe de un reino se desbloquea el siguiente.</li>
          <li>📜 <b>Pergaminos:</b> son los resúmenes de cada sesión. Léelos antes de combatir.</li>
          <li>⚔️ <b>Combate:</b> cada pregunta es un ataque. Si aciertas, golpeas al monstruo; si fallas, te golpea a ti. Después de cada respuesta verás la explicación.</li>
          <li>🔥 <b>Racha:</b> varios aciertos seguidos provocan golpes críticos.</li>
          <li>🧪 <b>Objetos:</b> la Poción cura, el Pergamino de Sabiduría elimina 2 opciones y el Escudo bloquea un golpe. Se compran en la tienda.</li>
          <li>🧠 <b>Minijuegos:</b> en Runas Gemelas y el Clasificador ganas oro y estrellas extra.</li>
          <li>🔁 <b>Repaso inteligente:</b> las preguntas que fallas vuelven a salir más seguido hasta que las domines.</li>
          <li>🔮 <b>Prueba del Oráculo:</b> es un simulacro de examen con nota sobre 20.</li>
          <li>🏆 <b>Ranking:</b> compite con tus compañeros. Publica tu puntaje desde el ranking.</li>
        </ul>
        <button className="btn btn-gold mt-6 w-full" onClick={() => setHelp(false)}>
          ¡Entendido!
        </button>
      </Modal>
    </div>
  )
}
