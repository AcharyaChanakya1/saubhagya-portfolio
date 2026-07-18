import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import WordReveal from '../components/WordReveal.jsx'

gsap.registerPlugin(ScrollTrigger)

const ENTRIES = [
  {
    year: '2017 · Weddingwood, Lucknow',
    title: 'The first dot',
    copy: (
      <>A wedding photography studio taught me the first rule: <strong>attention is
      bought, but trust is earned.</strong> Facebook ads brought the couples in —
      the content made them stay.</>
    ),
  },
  {
    year: '2017–2021 · Azea Gaia',
    title: 'Positioning beats shouting',
    copy: (
      <>A Singapore-backed luxury project needed buyers, not clicks. Four years of
      precision targeting and premium positioning later — <strong>the property
      sold out.</strong> Management called the digital campaigns a key sales
      driver. I call it proof that positioning beats shouting.</>
    ),
  },
  {
    year: '2021–2024 · Invest 101 Homes',
    title: 'Strategy becomes a system',
    copy: (
      <>Five real-estate projects, one marketer. <strong>6,000+ qualified leads in
      three years at ₹250 a lead</strong> — while the market paid double. This is
      where strategy became a system: test, measure, refine, repeat.</>
    ),
    mini: '✦ 2021–2023 · MBA, Marketing — Lucknow University. Theory caught up with practice.',
  },
  {
    year: '2024 · Medha Learning Foundation',
    title: 'Budget decides reach. Strategy decides results.',
    copy: (
      <>An NGO with a ₹40,000 budget. The campaign reached <strong>over 1 crore
      people</strong> and pulled <strong>70,000 form submissions.</strong> The
      lesson that defines me.</>
    ),
  },
  {
    year: 'Now · Independent',
    title: 'The pattern, complete',
    gold: true,
    copy: (
      <>Today I run growth for businesses that built their names over decades — an
      event company, a showroom, an interiors studio. They don't need an agency.
      <strong> They need one person who thinks like a director and works like
      it's his own money.</strong></>
    ),
  },
]

function EntryStar({ gold }) {
  return (
    <svg viewBox="0 0 36 36" aria-hidden="true">
      <path
        className="entry-star"
        d="M18 5 l3.2 9.8 9.8 3.2 -9.8 3.2 -3.2 9.8 -3.2 -9.8 -9.8 -3.2 9.8 -3.2z"
        fill={gold ? '#C9A227' : '#4C4380'}
      />
    </svg>
  )
}

export default function Dots() {
  const railRef = useRef(null)
  const lineRef = useRef(null)

  useEffect(() => {
    const rail = railRef.current
    const path = lineRef.current
    if (!rail || !path) return

    const ctx = gsap.context(() => {
      // the connecting line draws with scroll
      const len = path.getTotalLength ? path.getTotalLength() : 1000
      gsap.set(path, { strokeDasharray: `${len}`, strokeDashoffset: len })
      gsap.to(path, {
        strokeDashoffset: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: rail,
          start: 'top 72%',
          end: 'bottom 62%',
          scrub: 0.6,
        },
      })
      // each star flares when reached
      rail.querySelectorAll('.dot-star .entry-star').forEach((star) => {
        gsap.fromTo(
          star,
          { scale: 0, transformOrigin: 'center' },
          {
            scale: 1, duration: 0.6, ease: 'back.out(2.4)',
            scrollTrigger: { trigger: star, start: 'top 74%' },
          },
        )
      })
    }, rail)
    return () => ctx.revert()
  }, [])

  return (
    <section className="section dots-section" id="dots">
      <div className="chapter-label">Chapter 01 · The Dots</div>
      <WordReveal
        className="dots-intro"
        text="Eight years, five industries, one pattern. Looking back, every campaign was a dot. Connect them and you see what I actually learned."
      />

      <div className="dots-rail" ref={railRef}>
        <div className="dots-line" aria-hidden="true">
          <svg preserveAspectRatio="none" viewBox="0 0 2 100">
            <line ref={lineRef} x1="1" y1="0" x2="1" y2="100"
              stroke="#4C4380" strokeWidth="2" strokeDasharray="0.5 1"
              vectorEffect="non-scaling-stroke" />
          </svg>
        </div>

        {ENTRIES.map((e) => (
          <article className={`dot-entry${e.gold ? ' is-gold' : ''}`} key={e.year}>
            <div className="dot-star"><EntryStar gold={e.gold} /></div>
            <div className="dot-year">{e.year}</div>
            <h3 className="dot-title">{e.title}</h3>
            <p className="dot-copy">{e.copy}</p>
            {e.mini && <div className="dot-mini">{e.mini}</div>}
          </article>
        ))}
      </div>
    </section>
  )
}
