import { useEffect, useRef, useState } from 'react'

/** 7-star constellation that fills with reading progress (spec §5.5). */
const STARS = [
  { x: 6,  y: 34 }, { x: 18, y: 16 }, { x: 31, y: 26 }, { x: 44, y: 10 },
  { x: 55, y: 28 }, { x: 66, y: 18 }, { x: 72, y: 38 },
]

export default function SkyProgress() {
  const [lit, setLit] = useState(0)
  const [done, setDone] = useState(false)
  const ticking = useRef(false)

  useEffect(() => {
    const onScroll = () => {
      if (ticking.current) return
      ticking.current = true
      requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight
        const p = max > 0 ? window.scrollY / max : 0
        setLit(Math.min(STARS.length, Math.floor(p * STARS.length + 0.15)))
        setDone(p > 0.985)
        ticking.current = false
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className={`sky-progress${done ? ' done' : ''}`} aria-hidden="true" title="Your journey through the page">
      <svg viewBox="0 0 78 48">
        {STARS.slice(0, -1).map((s, i) => (
          <line key={i} className="sp-line" x1={s.x} y1={s.y} x2={STARS[i + 1].x} y2={STARS[i + 1].y} />
        ))}
        {STARS.map((s, i) => (
          <path
            key={i}
            className={`sp-star${i < lit ? ' lit' : ''}`}
            d={`M ${s.x} ${s.y - 4} l 1.1 2.9 2.9 1.1 -2.9 1.1 -1.1 2.9 -1.1 -2.9 -2.9 -1.1 2.9 -1.1 z`}
          />
        ))}
      </svg>
    </div>
  )
}
