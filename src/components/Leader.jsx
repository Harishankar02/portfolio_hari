import { useEffect, useRef, useState } from 'react'
import { certificate, person } from '../data/film.js'

const HOLD_MS = 3400

// The certificate card every Indian film opens with, doubling as the loading screen.
export default function Leader({ ready, onDone }) {
  const [elapsed, setElapsed] = useState(false)
  const [closing, setClosing] = useState(false)
  const done = useRef(false)

  const finish = () => {
    if (done.current) return
    done.current = true
    setClosing(true)
    setTimeout(onDone, 620)
  }

  useEffect(() => {
    const timer = setTimeout(() => setElapsed(true), HOLD_MS)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (ready && elapsed) finish()
  })

  return (
    <div className={closing ? 'leader leader--out' : 'leader'}>
      <button type="button" className="leader__card" onClick={() => ready && finish()}>
        <span className="leader__head">
          <span className="leader__mark">{person.hindi}</span>
          <span className="leader__heading">Certificate of Exhibition</span>
          <span className="leader__rating" aria-label="Rated U/A">U/A</span>
        </span>
        <span className="leader__rows">
          {certificate.map(([key, value]) => (
            <span className="leader__row" key={key}>
              <span>{key}</span>
              <span>{value}</span>
            </span>
          ))}
        </span>
        <span className="leader__foot">
          <span>Certified fit for production.</span>
          <span className="leader__skip">{ready ? 'Click to skip' : 'Threading the projector'}</span>
        </span>
        <span className="leader__fuse" />
      </button>
    </div>
  )
}
