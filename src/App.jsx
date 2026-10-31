import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { credits, finale, reels, scenes, title } from './data/film.js'
import { store } from './store.js'
import Stage from './components/Stage.jsx'
import Leader from './components/Leader.jsx'
import Hud from './components/Hud.jsx'
import TitleCard from './components/TitleCard.jsx'
import Reel from './components/Reel.jsx'
import Credits from './components/Credits.jsx'
import Finale from './components/Finale.jsx'
import Script from './components/Script.jsx'

gsap.registerPlugin(ScrollTrigger)

function Film() {
  const [ready, setReady] = useState(false)
  const [rolling, setRolling] = useState(false)
  const [scriptOpen, setScriptOpen] = useState(false)
  const main = useRef(null)
  const onReady = useCallback(() => setReady(true), [])

  useEffect(() => {
    history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)
    ScrollTrigger.config({ ignoreMobileResize: true })

    const lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1.15 })
    store.lenis = lenis
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    lenis.stop()

    // The cue drives the WebGL film: scene index plus progress through that scene's scroll.
    const sections = gsap.utils.toArray('.sec', main.current)
    const triggers = sections.map((section, i) => {
      const lastOne = i === sections.length - 1
      return ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: lastOne ? 'bottom bottom' : 'bottom top',
        onUpdate: (self) => {
          store.cue = i + self.progress * (lastOne ? 0.69 : 1)
        },
      })
    })

    return () => {
      triggers.forEach((t) => t.kill())
      gsap.ticker.remove(tick)
      lenis.destroy()
      store.lenis = null
    }
  }, [])

  useEffect(() => {
    const lenis = store.lenis
    if (!lenis) return
    document.documentElement.classList.toggle('locked', !rolling || scriptOpen)
    if (rolling && !scriptOpen) lenis.start()
    else lenis.stop()
  }, [rolling, scriptOpen])

  const roll = () => {
    store.engine?.intro()
    setRolling(true)
    ScrollTrigger.refresh()
  }

  return (
    <>
      <Stage onReady={onReady} />
      <div aria-hidden="true">
        <div className="fx__vignette" />
        <div className="fx__grain" />
      </div>

      <main ref={main}>
        <TitleCard scene={title} rolling={rolling} />
        {reels.map((reel, i) => (
          <Reel key={reel.id} reel={reel} number={i + 1} total={reels.length} />
        ))}
        <Credits scene={credits} />
        <Finale scene={finale} />
      </main>

      <Hud scenes={scenes} rolling={rolling} onScript={() => setScriptOpen(true)} />
      {!rolling && <Leader ready={ready} onDone={roll} />}
      {scriptOpen && <Script onClose={() => setScriptOpen(false)} />}
    </>
  )
}

export default function App() {
  const still = useMemo(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches, [])
  return still ? <Script /> : <Film />
}
