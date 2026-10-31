import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

const IN = 0.03 // Scene text arrives here...
const OUT = 0.6 // ...and is gone before the engine starts morphing at 0.7.

export default function Reel({ reel, number, total }) {
  const root = useRef(null)
  const { lines, slate, stack, chain, swap, grade } = reel

  useGSAP(() => {
    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
    })
    tl.to({}, { duration: 1 }, 0)

    tl.fromTo('.frame', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.01 }, IN - 0.005)
    tl.fromTo('.reel__count', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.03 }, IN)
    tl.fromTo('.reel__slug span', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.002, stagger: 0.0013 }, IN + 0.01)
    tl.fromTo('.reel__title > span', { yPercent: 112 }, { yPercent: 0, duration: 0.075, ease: 'power2.out' }, IN + 0.035)

    const start = IN + 0.1
    const slot = (OUT - 0.04 - start) / lines.length
    gsap.utils.toArray('.reel__line', root.current).forEach((line, i) => {
      const at = start + i * slot
      tl.fromTo(line, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: slot * 0.22, ease: 'power1.out' }, at)
      if (i < lines.length - 1) tl.to(line, { autoAlpha: 0, y: -10, duration: slot * 0.16, ease: 'power1.in' }, at + slot * 0.84)
    })

    const details = start + slot * 0.55
    if (chain) {
      tl.fromTo('.chain__link', { autoAlpha: 0.2 }, { autoAlpha: 1, duration: 0.012, stagger: 0.022 }, details)
    }
    if (swap) {
      tl.fromTo('.swap__old', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.02 }, start)
      tl.to('.swap__old', { '--strike': 1, autoAlpha: 0.5, duration: 0.06 }, start + 0.08)
      tl.fromTo('.swap__new', { autoAlpha: 0, x: -12 }, { autoAlpha: 1, x: 0, duration: 0.05, ease: 'power1.out' }, start + 0.14)
    }
    if (slate.length) {
      tl.fromTo('.slate', { autoAlpha: 0, y: 26 }, { autoAlpha: 1, y: 0, duration: 0.05, ease: 'power2.out' }, details)
      tl.fromTo('.slate__stick', { rotate: -17 }, { rotate: 0, duration: 0.03, ease: 'power3.in' }, details + 0.05)
      tl.fromTo('.slate__row', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.012, stagger: 0.01 }, details + 0.05)
    }
    if (stack.length) {
      tl.fromTo('.chip', { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.012, stagger: 0.008 }, start + slot * 1.3)
    }

    tl.to('.frame', { autoAlpha: 0, y: -22, duration: 0.05, ease: 'power1.in' }, OUT)
  }, { scope: root })

  return (
    <section ref={root} id={reel.id} className="sec sec--reel">
      <div className="frame" data-side={reel.side} style={{ '--accent': grade.a, '--accent-2': grade.b }}>
        <div className="reel">
          <p className="reel__count">Reel {String(number).padStart(2, '0')} / {String(total).padStart(2, '0')}</p>
          <p className="reel__slug" aria-label={reel.slug}>
            {[...reel.slug].map((char, i) => (
              <span key={i} aria-hidden="true">{char}</span>
            ))}
          </p>
          <h2 className="reel__title"><span>{reel.title}</span></h2>

          <div className="reel__lines">
            {lines.map((line) => <p className="reel__line" key={line}>{line}</p>)}
          </div>

          {chain && (
            <ol className="chain">
              {chain.map((link) => <li className="chain__link" key={link}>{link}</li>)}
            </ol>
          )}

          {swap && (
            <p className="swap">
              <s className="swap__old">{swap.from}</s>
              <span className="swap__new">{swap.to}</span>
            </p>
          )}

          {slate.length > 0 && (
            <div className="slate">
              <div className="slate__stick" aria-hidden="true" />
              <div className="slate__bar" aria-hidden="true" />
              <dl className="slate__body">
                {slate.map(([key, value]) => (
                  <div className="slate__row" key={key}>
                    <dt>{key}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {stack.length > 0 && (
            <ul className="chips">
              {stack.map((item) => <li className="chip" key={item}>{item}</li>)}
            </ul>
          )}
        </div>
      </div>
    </section>
  )
}
