/**
 * Ranking global (Vercel Function).
 *
 * Usa Upstash Redis por su API REST. En Vercel: Storage → Marketplace → Upstash (Redis),
 * conéctalo al proyecto y se crearán solas las variables KV_REST_API_URL y KV_REST_API_TOKEN
 * (también acepta UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN).
 * Sin esas variables, el endpoint responde { enabled: false } y el juego muestra solo el ranking local.
 */

const URL_ = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL
const TOKEN = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN
const ZKEY = 'cdm:lb'
const HKEY = 'cdm:lb:data'
const CLASSES = ['paladin', 'arcanista', 'trotamundos', 'guia']

async function redis(cmds: (string | number)[][]) {
  const res = await fetch(`${URL_}/pipeline`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(cmds),
  })
  if (!res.ok) throw new Error(`redis ${res.status}`)
  return (await res.json()) as { result: unknown }[]
}

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } })

export async function GET() {
  if (!URL_ || !TOKEN) return json({ enabled: false, entries: [] })
  try {
    const [top] = await redis([['ZREVRANGE', ZKEY, 0, 49, 'WITHSCORES']])
    const flat = (top.result as string[]) ?? []
    const ids: string[] = []
    for (let i = 0; i < flat.length; i += 2) ids.push(flat[i])
    if (!ids.length) return json({ enabled: true, entries: [] })
    const [data] = await redis([['HMGET', HKEY, ...ids]])
    const entries = ((data.result as (string | null)[]) ?? [])
      .map((raw, i) => {
        if (!raw) return null
        try {
          const e = JSON.parse(raw)
          return { ...e, score: Number(flat[i * 2 + 1]), id: ids[i].slice(0, 6) }
        } catch {
          return null
        }
      })
      .filter(Boolean)
    return json({ enabled: true, entries })
  } catch {
    return json({ enabled: true, entries: [], error: 'No se pudo leer el ranking' }, 502)
  }
}

export async function POST(req: Request) {
  if (!URL_ || !TOKEN) return json({ enabled: false }, 503)
  let body: Record<string, unknown>
  try {
    body = (await req.json()) as Record<string, unknown>
  } catch {
    return json({ error: 'JSON inválido' }, 400)
  }
  const id = String(body.id ?? '')
  const name = String(body.name ?? '')
    .replace(/[<>]/g, '')
    .trim()
    .slice(0, 18)
  const cls = String(body.cls ?? '')
  const score = Math.floor(Number(body.score))
  const level = Math.floor(Number(body.level))
  const bosses = Math.floor(Number(body.bosses))
  const exam = Math.floor(Number(body.exam))

  if (!/^[a-z0-9-]{16,40}$/i.test(id)) return json({ error: 'id inválido' }, 400)
  if (name.length < 2) return json({ error: 'nombre inválido' }, 400)
  if (!CLASSES.includes(cls)) return json({ error: 'clase inválida' }, 400)
  if (!Number.isFinite(score) || score < 0 || score > 200000) return json({ error: 'puntaje inválido' }, 400)
  if (!(level >= 1 && level <= 99 && bosses >= 0 && bosses <= 5 && exam >= 0 && exam <= 20)) return json({ error: 'datos inválidos' }, 400)

  try {
    await redis([
      ['ZADD', ZKEY, score, id],
      ['HSET', HKEY, id, JSON.stringify({ name, cls, level, bosses, exam, at: Date.now() })],
    ])
    const [rank] = await redis([['ZREVRANK', ZKEY, id]])
    return json({ ok: true, rank: Number(rank.result) + 1 })
  } catch {
    return json({ error: 'No se pudo guardar' }, 502)
  }
}
