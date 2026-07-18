import { useEffect, useState } from 'react'

const SECTIONS = [
  { id: 'hero', label: 'Start' },
  { id: 'dots', label: 'Dots' },
  { id: 'receipts', label: 'Receipts' },
  { id: 'proof', label: 'Proof' },
  { id: 'method', label: 'Method' },
  { id: 'contact', label: 'Talk' },
]

export default function PillNav() {
  const [active, setActive] = useState('hero')

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id) })
      },
      { rootMargin: '-42% 0px -52% 0px' },
    )
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) obs.observe(el)
    })
    return () => obs.disconnect()
  }, [])

  const go = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav className="pill-nav" aria-label="Sections">
      {SECTIONS.map(({ id, label }) => (
        <button key={id} className={active === id ? 'active' : ''} onClick={() => go(id)}>
          {label}
        </button>
      ))}
    </nav>
  )
}
