import { useEffect, useRef } from 'react'
import { credits, person, resume } from '../data/film.js'

// The whole career on one page, for anyone short on time. It also replaces the film under reduced motion.
export default function Script({ onClose }) {
  const close = useRef(null)
  const overlay = Boolean(onClose)

  useEffect(() => {
    if (!overlay) return
    close.current?.focus()
    const onKey = (event) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [overlay, onClose])

  const skills = credits.groups.filter(([role]) => !['Filmed In', 'Released In'].includes(role))

  return (
    <div
      className={overlay ? 'script script--overlay' : 'script'}
      role={overlay ? 'dialog' : undefined}
      aria-modal={overlay ? 'true' : undefined}
      aria-label={overlay ? 'Résumé' : undefined}
      data-lenis-prevent
    >
      <article className="script__page">
        {overlay && (
          <button ref={close} type="button" className="script__close" onClick={onClose}>
            Back to the film
          </button>
        )}

        <header className="script__head">
          <h1>{person.name}</h1>
          <p>{person.role}, {person.base}</p>
          <p className="script__contact">
            <a href={`mailto:${person.email}`}>{person.email}</a>
            <a href={person.github} target="_blank" rel="noreferrer">GitHub</a>
            {person.linkedin && <a href={person.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>}
          </p>
        </header>

        <p className="script__summary">{resume.summary}</p>

        <h2>Experience</h2>
        {resume.experience.map((job) => (
          <section className="script__entry" key={job.company}>
            <h3>{job.role}</h3>
            <p className="script__meta">{job.company} <span>{job.dates}</span></p>
            <ul>
              {job.points.map((point) => <li key={point}>{point}</li>)}
            </ul>
          </section>
        ))}

        <h2>Projects</h2>
        {resume.projects.map((project) => (
          <section className="script__entry" key={project.name}>
            <h3>{project.name}</h3>
            <p>{project.text}</p>
          </section>
        ))}

        <h2>Skills</h2>
        <dl className="script__skills">
          {skills.map(([role, names]) => (
            <div key={role}>
              <dt>{role}</dt>
              <dd>{names.join(', ')}</dd>
            </div>
          ))}
        </dl>

        <h2>Education</h2>
        {resume.education.map(([degree, detail]) => (
          <section className="script__entry" key={degree}>
            <h3>{degree}</h3>
            <p>{detail}</p>
          </section>
        ))}
      </article>
    </div>
  )
}
