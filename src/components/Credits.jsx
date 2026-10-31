import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { person } from '../data/film.js'

export default function Credits({ scene }) {
  const root = useRef(null)

  useGSAP(() => {
    const roll = root.current.querySelector('.roll')
    gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: root.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
        invalidateOnRefresh: true,
      },
    })
      .to({}, { duration: 1 }, 0)
      .fromTo('.frame', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.01 }, 0.01)
      .fromTo(roll, { y: () => window.innerHeight }, { y: () => -roll.offsetHeight, duration: 0.67 }, 0.01)
      .to('.frame', { autoAlpha: 0, duration: 0.01 }, 0.69)
  }, { scope: root })

  return (
    <section ref={root} id={scene.id} className="sec sec--credits">
      <div className="frame frame--credits">
        <div className="roll">
          <p className="roll__lead">Written, built and deployed by</p>
          <h2 className="roll__name">{person.name}</h2>
          {scene.groups.map(([role, names]) => (
            <div className="roll__group" key={role}>
              <h3>{role}</h3>
              <ul>
                {names.map((name) => <li key={name}>{name}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
