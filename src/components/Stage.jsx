import { useEffect, useRef } from 'react'
import { person, places } from '../data/film.js'
import { store } from '../store.js'

export default function Stage({ onReady }) {
  const canvas = useRef(null)
  const leak = useRef(null)
  const bars = useRef(null)
  const labels = useRef([])

  useEffect(() => {
    let dead = false
    let engine = null

    const start = async () => {
      try {
        const [{ createEngine }] = await Promise.all([
          import('../gl/engine.js'),
          document.fonts.load('430px "Rozha One"', person.hindi),
        ])
        if (dead) return
        engine = createEngine(canvas.current, {
          labels: labels.current,
          onFrame: ({ morph, color }) => {
            // The cut between scenes: a burst of the scene's colour and a breath of the letterbox.
            const pulse = Math.sin(morph * Math.PI)
            leak.current.style.opacity = pulse * pulse * 0.42
            leak.current.style.setProperty('--leak', `#${color.getHexString()}`)
            bars.current.style.setProperty('--pulse', pulse.toFixed(3))
          },
        })
        store.engine = engine
      } catch (error) {
        console.warn('WebGL unavailable, playing without the particle film.', error)
        document.documentElement.classList.add('no-gl')
      }
      if (!dead) onReady()
    }
    start()

    return () => {
      dead = true
      engine?.destroy()
      store.engine = null
    }
  }, [onReady])

  return (
    <>
      <canvas ref={canvas} className="stage" aria-hidden="true" />
      <div ref={leak} className="leak" aria-hidden="true" />
      <div className="geo" aria-hidden="true">
        {places.map((place, i) => (
          <span
            key={place.name}
            ref={(el) => { labels.current[i] = el }}
            className={place.flip ? 'geo__pin geo__pin--flip' : 'geo__pin'}
          >
            <b>{place.name}</b>
          </span>
        ))}
      </div>
      <div ref={bars} className="bars" aria-hidden="true">
        <i />
        <i />
      </div>
    </>
  )
}
