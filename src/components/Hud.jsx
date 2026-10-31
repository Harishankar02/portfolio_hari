import { useEffect, useRef, useState } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { person } from '../data/film.js'
import { store } from '../store.js'

const RUNTIME_SECONDS = 186
const FPS = 24
const pad = (n) => String(n).padStart(2, '0')

export default function Hud({ scenes, rolling, onScript }) {
  const timecode = useRef(null)
  const [active, setActive] = useState(0)

  useEffect(() => {
    const trigger = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: ({ progress }) => {
        const frames = Math.floor(progress * RUNTIME_SECONDS * FPS)
        const seconds = Math.floor(frames / FPS)
        timecode.current.textContent = `00:${pad(Math.floor(seconds / 60))}:${pad(seconds % 60)}:${pad(frames % FPS)}`
        // Cue carries the scene index; rounding past the hold highlights the scene being entered.
        setActive(Math.min(scenes.length - 1, Math.floor(store.cue + 0.15)))
      },
    })
    return () => trigger.kill()
  }, [scenes.length])

  const jump = (id) => {
    store.lenis?.scrollTo(document.getElementById(id), { duration: 2.4 })
  }

  return (
    <div className={rolling ? 'hud hud--on' : 'hud'}>
      <div className="hud__top">
        <button type="button" className="hud__mark" onClick={() => jump('title')} aria-label={`${person.name}, back to the start`}>
          {person.hindi}
        </button>
        <span className="hud__tc" aria-hidden="true">
          <i className="hud__dot" />
          <span ref={timecode}>00:00:00:00</span>
        </span>
        <button type="button" className="hud__script" onClick={onScript}>
          Read the script
        </button>
      </div>

      <nav className="hud__strip" aria-label="Scenes">
        {scenes.map((scene, i) => (
          <button
            key={scene.id}
            type="button"
            className={i === active ? 'hud__frame is-on' : 'hud__frame'}
            onClick={() => jump(scene.id)}
            aria-label={scene.label}
            aria-current={i === active ? 'true' : undefined}
          >
            <span>{scene.label}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}
