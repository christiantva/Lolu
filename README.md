# ⚔️ Crónicas del Maestro

RPG web para estudiar **Fundamentos de la Educación Primaria** (sesiones 1 a 4) jugando.

| Reino | Sesión | Contenido |
|---|---|---|
| 🏔️ Valle de la Ley 28044 | 1 | Sistema Educativo Peruano: etapas, niveles y modalidades (EBR, EBA, EBE), CETPRO, EIB |
| 🌳 Bosque Encantado del CNEB | 2 | Enfoque por competencias, sus 5 fundamentos, los 7 enfoques transversales, los 11 aprendizajes del perfil de egreso y el perfil docente (MBDD) |
| 🦜 Selva de las Dos Coronas | 3 | Brasil (BNCC, 10 competencias, LDBEN) y México (NEM, humanismo, perfiles) |
| ❄️ Cumbres del Norte y Oriente | 4 | Finlandia (básica de 9 años, maestría docente) y Singapur (Foundation/Orientation, PSLE, NIE, Desired Outcomes) |
| 🗼 Torre del Examinador | Todas | Jefe final con preguntas mezcladas y comparativas |

## Qué incluye

- **140 preguntas** (casos aplicados, datos clave y verdadero/falso), cada una con su explicación.
- **24 pergaminos de estudio**: resúmenes de las diapositivas, con trucos para recordar.
- **Combate por turnos**: si aciertas, atacas; si fallas, recibes daño. Hay rachas, golpes críticos y objetos.
- **4 clases de héroe**, cada una con su habilidad, y avatar personalizable.
- **Minijuegos**: Runas Gemelas (memoria) y Clasificador.
- **Repaso inteligente**: las preguntas que fallas aparecen más seguido. Además está el *Santuario de Repaso*, donde enfrentas tus errores.
- **Prueba del Oráculo**: simulacro de examen de 20 preguntas con nota vigesimal y revisión al final.
- **Grimorio**: todos los resúmenes, una tabla comparativa de los 5 países y la lista de tus preguntas falladas.
- **Logros, tienda, niveles y ranking global** para competir con la clase.
- El progreso se guarda en el navegador de cada jugador, sin cuentas ni contraseñas.

## Desarrollo local

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # genera dist/
```

## 🚀 Publicar en Vercel

1. Entra a <https://vercel.com/new> e inicia sesión con GitHub.
2. Importa el repositorio **christiantva/Lolu**. Vercel detecta Vite automáticamente: no cambies nada.
3. Pulsa **Deploy**. En aproximadamente un minuto tendrás una URL como `https://lolu.vercel.app` para compartir con tus compañeros.

Cada `git push` a la rama principal vuelve a publicar el juego automáticamente.

### 🏆 Activar el ranking global (opcional, gratis)

Sin este paso el juego funciona igual, pero el ranking muestra un aviso en lugar de la tabla.

1. En tu proyecto de Vercel, abre **Storage → Create Database → Upstash (Redis)** y elige el plan gratuito.
2. Conéctala al proyecto. Vercel crea solas las variables `KV_REST_API_URL` y `KV_REST_API_TOKEN`.
3. Ve a **Deployments → ⋯ → Redeploy**.

Desde ese momento, cada jugador puede pulsar **📣 Publicar en el ranking** en el Salón de la Fama.

## Estructura

```
src/data/        contenido del curso (preguntas, pergaminos, minijuegos, reinos)
src/art/         ilustraciones SVG (héroe, monstruos, guías, fondos)
src/game/        estado, guardado, motor de preguntas, sonidos, logros
src/screens/     pantallas (mapa, combate, estudio, oráculo, etc.)
api/             función serverless del ranking (Vercel)
```

Para añadir preguntas, edita `src/data/questions.ts`: la primera opción de cada pregunta es la correcta y el juego las baraja al mostrarlas.
