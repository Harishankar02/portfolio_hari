import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { person } from '../data/film.js'

export default function TitleCard({ scene, rolling }) {
  const root = useRef(null)

  useGSAP(() => {
    gsap.set('.title__line > span', { yPercent: 112 })
    gsap.timeline({
      scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
    })
      .to('.frame', { autoAlpha: 0, y: -24, ease: 'none', duration: 0.3 }, 0.3)
      .to({}, { duration: 0.4 }, 0.6)
  }, { scope: root })

  useEffect(() => {
    if (!rolling) return
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
    tl.fromTo('.title__line > span', { yPercent: 112 }, { yPercent: 0, duration: 1.5, stagger: 0.14 }, 0.5)
      .fromTo('.title__meta > *', { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 1.1, stagger: 0.12 }, 1.2)
    return () => tl.kill()
  }, [rolling])

  return (
    <section ref={root} id={scene.id} className="sec sec--title">
      <div className="frame frame--title">
        <div className="title__foot">
          <h1 className="title__name" aria-label={person.name}>
            {person.nameLines.map((line) => (
              <span className="title__line" key={line} aria-hidden="true">
                <span>{line}</span>
              </span>
            ))}
          </h1>
          <div className="title__meta">
            <p className="title__studio">{scene.studio}</p>
            <p className="title__role">{person.role}, {person.base}</p>
            <p className="title__tag">{scene.tagline}</p>
            <p className="title__cue">Scroll to roll film <span aria-hidden="true">↓</span></p>
          </div>
        </div>
      </div>
    </section>
  )
}
