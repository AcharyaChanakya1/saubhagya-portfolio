import { useRef } from 'react'

/** Chapter 03 · The Proof — case cards with subtle cursor-aware tilt (spec §4). */
const CASES = [
  {
    coord: '30.31° N · 78.03° E — Dehradun',
    client: 'Perfect Interiors & Decorators',
    type: 'Interior design studio',
    brief: 'high-value projects, not likes.',
    work: 'Meta campaigns engineered for premium clients — audience psychology, not audience size.',
    result: '₹50K in ads → ₹40–50 lakh in projects',
    gold: true,
  },
  {
    coord: '28.45° N · 77.02° E — Gurugram',
    client: 'Hari Om Electricals',
    type: 'Symphony cooler showroom & wholesaler, 2 decades old',
    brief: 'make season sales predictable.',
    work: 'Google Ads + social ads + Google My Business, run as one system.',
    result: '6,000–8,000 purchases · 100+ calls a day',
  },
  {
    coord: '26.85° N · 80.95° E — Lucknow',
    client: 'Tathastu Events',
    type: 'Event management company, 20 years strong',
    brief: 'a two-decade reputation, ready for its digital chapter.',
    work: 'Strategy, content system, and presence — underway now.',
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
  return (
    <section className="section proof-section" id="proof">
      <div className="chapter-label">Chapter 03 · The Proof</div>
      <p className="proof-intro">
        I take on a few clients at a time, by choice. Director-level attention
        doesn't divide well. A glimpse of the current board:
      </p>

      <div className="proof-grid">
        {CASES.map((c) => (
          <TiltCard key={c.client} gold={c.gold}>
            <div className="coord">{c.coord}</div>
            <h3 className="proof-client">{c.client}</h3>
            <div className="proof-type">{c.type}</div>
            <div className="proof-body">
              <p><b>The brief:</b> {c.brief}</p>
              <p><b>The work:</b> {c.work}</p>
            </div>
            <div className="proof-result">{c.result}</div>
          </TiltCard>
        ))}
      </div>

      <p className="proof-strip">
        Before independence: <b>Azea Gaia</b> (sold out) · <b>Invest 101 Homes</b> (6,000+
        leads) · <b>Medha Learning Foundation</b> (1 Cr reach). The pattern travels.
      </p>
    </section>
  )
}
