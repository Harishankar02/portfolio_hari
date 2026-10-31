import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { person } from '../data/film.js'
import { store } from '../store.js'

export default function Finale({ scene }) {
  const root = useRef(null)

  useGSAP(() => {
    gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom bottom', scrub: true },
    })
      .to({}, { duration: 1 }, 0)
      .fromTo('.frame', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.01 }, 0.05)
      .fromTo('.finale > *', { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.14, stagger: 0.08, ease: 'power1.out' }, 0.1)
  }, { scope: root })

  return (
    <section ref={root} id={scene.id} className="sec sec--finale">
      <div className="frame frame--finale">
        <div className="finale">
          <p className="finale__kicker">{scene.kicker}</p>
          <h2 className="finale__title">{scene.title}</h2>
          <p className="finale__line">{scene.line}</p>
          <a className="finale__mail" href={`mailto:${person.email}`}>{person.email}</a>
          <p className="finale__links">
            <a href={person.github} target="_blank" rel="noreferrer">GitHub</a>
            {person.linkedin && <a href={person.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>}
            <button type="button" onClick={() => store.lenis?.scrollTo(0, { duration: 3 })}>Replay</button>
          </p>
        </div>
      </div>
    </section>
  )
}
