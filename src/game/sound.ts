/** Efectos de sonido sintetizados con WebAudio (sin archivos externos). */
let ctx: AudioContext | null = null
let muted = false

export const setMuted = (m: boolean) => {
  muted = m
}

function ac() {
  if (!ctx) {
    const C = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (!C) return null
    ctx = new C()
  }
  if (ctx.state === 'suspended') void ctx.resume()
  return ctx
}

function tone(freq: number, dur: number, type: OscillatorType = 'sine', vol = 0.15, delay = 0, slide?: number) {
  const a = ac()
  if (!a || muted) return
  const t = a.currentTime + delay
  const o = a.createOscillator()
  const g = a.createGain()
  o.type = type
  o.frequency.setValueAtTime(freq, t)
  if (slide) o.frequency.exponentialRampToValueAtTime(slide, t + dur)
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(vol, t + 0.015)
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  o.connect(g).connect(a.destination)
  o.start(t)
  o.stop(t + dur + 0.05)
}

function noise(dur: number, vol = 0.2, delay = 0, hp = 800) {
  const a = ac()
  if (!a || muted) return
  const t = a.currentTime + delay
  const buf = a.createBuffer(1, Math.floor(a.sampleRate * dur), a.sampleRate)
  const d = buf.getChannelData(0)
  for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length)
  const src = a.createBufferSource()
  src.buffer = buf
  const f = a.createBiquadFilter()
  f.type = 'highpass'
  f.frequency.value = hp
  const g = a.createGain()
  g.gain.value = vol
  src.connect(f).connect(g).connect(a.destination)
  src.start(t)
}

export const sfx = {
  click: () => tone(660, 0.06, 'triangle', 0.08),
  select: () => tone(520, 0.08, 'triangle', 0.1, 0, 780),
  correct: () => {
    tone(660, 0.12, 'triangle', 0.14)
    tone(880, 0.12, 'triangle', 0.14, 0.08)
    tone(1320, 0.22, 'sine', 0.12, 0.16)
  },
  wrong: () => {
    tone(220, 0.25, 'sawtooth', 0.08, 0, 110)
    tone(180, 0.3, 'square', 0.05, 0.05, 90)
  },
  slash: () => {
    noise(0.18, 0.25, 0, 1800)
    tone(900, 0.15, 'sawtooth', 0.05, 0, 200)
  },
  crit: () => {
    noise(0.25, 0.3, 0, 1200)
    tone(1200, 0.2, 'square', 0.06, 0, 300)
    tone(1600, 0.3, 'sine', 0.1, 0.1)
  },
  hurt: () => {
    noise(0.22, 0.28, 0, 300)
    tone(140, 0.25, 'square', 0.08, 0, 70)
  },
  heal: () => {
    ;[523, 659, 784, 1046].forEach((f, i) => tone(f, 0.18, 'sine', 0.09, i * 0.06))
  },
  levelUp: () => {
    ;[523, 659, 784, 1046, 1318].forEach((f, i) => tone(f, 0.25, 'triangle', 0.12, i * 0.09))
  },
  victory: () => {
    ;[392, 523, 659, 784, 659, 784, 1046].forEach((f, i) => tone(f, 0.28, 'triangle', 0.12, i * 0.12))
  },
  defeat: () => {
    ;[392, 330, 262, 196].forEach((f, i) => tone(f, 0.4, 'sine', 0.12, i * 0.22))
  },
  coin: () => {
    tone(988, 0.08, 'square', 0.06)
    tone(1318, 0.2, 'square', 0.06, 0.07)
  },
  flip: () => tone(400, 0.07, 'triangle', 0.08, 0, 600),
}
