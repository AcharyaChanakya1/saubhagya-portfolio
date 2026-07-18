import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/** Chapter 03 · The Proof — case cards, one line each, cursor tilt + entrance. */
const CASES = [
  {
    coord: '30.31° N · 78.03° E — Dehradun',
    client: 'Perfect Interiors & Decorators',
    type: 'Interior design studio',
    line: 'Meta ads built on audience psychology, aimed at projects — not likes.',
    result: '₹50K in ads → ₹40–50 lakh in projects',
    gold: true,
  },
  {
    coord: '28.45° N · 77.02° E — Gurugram',
    client: 'Hari Om Electricals',
    type: 'Symphony showroom & wholesaler, 2 decades old',
    line: 'Google Ads + social + GMB, run as one system for the season.',
    result: '6,000–8,000 purchases · 100+ calls a day',
  },
  {
    coord: '26.85° N · 80.95° E — Lucknow',
    client: 'Tathastu Events',
    type: 'Event management, 20 years strong',
    line: 'A two-decade reputation, getting its digital chapter now.',
    result: 'In progress. Watch this space.',
  },
]

function TiltCard({ children, gold }) {
  const ref = useRef(null)

  const onMove = (e) => {
    const el = ref.current
    if (!el || window.matchMedia('(hover: none)').matches) return
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    el.style.transform = `perspective(900px) rotateY(${px * 5}deg) rotateX(${py * -5}deg) translateY(-2px)`
  }
  const onLeave = () => {
    const el = ref.current
    if (el) el.style.transform = 'perspective(900px) rotateY(0deg) rotateX(0deg)'
  }

  return (
    <article
      ref={ref}
      className={`proof-card${gold ? ' is-gold' : ''}`}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ transition: 'transform 0.35s ease' }}
    >
      {children}
    </article>
  )
}

export default function Proof() {
  const gridRef = useRef(null)

  useEffect(() => {
    const grid = gridRef.current
    if (!grid) return
    const ctx = gsap.context(() => {
      gsap.fromTo(gsap.utils.toArray('.proof-card', grid),
        { y: 34, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, stagger: 0.14, ease: 'power2.out',
          scrollTrigger: { trigger: grid, start: 'top 76%' },
        })
    }, grid)
    return () => ctx.revert()
  }, [])

  return (
    <section className="section proof-section" id="proof">
      <div className="chapter-label">Chapter 03 · The Proof</div>
      <p className="proof-intro">
        A few clients at a time, by choice. Director-level attention
        doesn't divide well.
      </p>

      <div className="proof-grid" ref={gridRef}>
        {CASES.map((c) => (
          <TiltCard key={c.client} gold={c.gold}>
            <div className="coord">{c.coord}</div>
            <h3 className="proof-client">{c.client}</h3>
            <div className="proof-type">{c.type}</div>
            <div className="proof-body"><p>{c.line}</p></div>
            <div className="proof-result">{c.result}</div>
          </TiltCard>
        ))}
      </div>

      <p className="proof-strip">
        Before independence: <b>Azea Gaia</b> (sold out) · <b>Invest 101 Homes</b> (6,000+
        leads) · <b>Medha</b> (1 Cr reach). The pattern travels.
      </p>
    </section>
  )
}
