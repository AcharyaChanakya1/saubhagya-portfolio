import { useEffect, useRef } from 'react'
import gsap from 'gsap'

/** Hero: giant name, chosen hook, 3-star arc that draws itself on load. */
export default function Hero() {
  const arcRef = useRef(null)

  useEffect(() => {
    const svg = arcRef.current
    if (!svg) return
    const lines = svg.querySelectorAll('.arc-line')
    const stars = svg.querySelectorAll('.arc-star')
    const labels = svg.querySelectorAll('text')

    const ctx = gsap.context(() => {
      lines.forEach((l) => {
        const len = l.getTotalLength()
        gsap.set(l, { strokeDasharray: len, strokeDashoffset: len })
      })
      const tl = gsap.timeline({ delay: 0.5, defaults: { ease: 'power2.out' } })
      tl.fromTo(stars[0], { scale: 0, transformOrigin: 'center' }, { scale: 1, duration: 0.5 })
        .to(lines[0], { strokeDashoffset: 0, duration: 0.8 })
        .fromTo(stars[1], { scale: 0, transformOrigin: 'center' }, { scale: 1, duration: 0.5 }, '-=0.15')
        .to(lines[1], { strokeDashoffset: 0, duration: 0.8 })
        .fromTo(stars[2], { scale: 0, transformOrigin: 'center' }, { scale: 1.25, duration: 0.6 }, '-=0.15')
        .fromTo(labels, { opacity: 0 }, { opacity: 1, duration: 0.7, stagger: 0.12 }, '-=0.4')
    })
    return () => ctx.revert()
  }, [])

  return (
    <header className="hero" id="hero">
      <div className="hero-top">
        <span className="hero-eyebrow">Growth Marketer · 8+ years</span>
        <span className="coord">26.85° N · 80.95° E — Lucknow · works everywhere</span>
      </div>

      <div className="hero-main">
        <h1 className="hero-name">
          saubhagya<br />dubey<span className="dot">.</span>
        </h1>
        <p className="hero-hook">
          Your ads run. Your posts go up.<br />
          So why does growth feel like luck?
        </p>
        <p className="hero-sub">
          I'm <strong>Saubhagya Dubey</strong> — a growth marketer who works like
          your marketing director. Research, strategy, ads, SEO, reporting:
          <strong> one brain, fully accountable.</strong>
        </p>

        <div className="hero-arc" aria-hidden="true">
          <svg ref={arcRef} viewBox="0 0 620 110">
            <line className="arc-line" x1="40" y1="72" x2="300" y2="38" stroke="#4C4380" strokeWidth="1.5" strokeDasharray="4 5" />
            <line className="arc-line" x1="300" y1="38" x2="560" y2="62" stroke="#4C4380" strokeWidth="1.5" strokeDasharray="4 5" />
            <g fill="#C9A227">
              <path className="arc-star" d="M40 62 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3z" />
              <path className="arc-star" d="M300 28 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3z" />
              <path className="arc-star" d="M560 50 l3.6 8.4 8.4 3.6 -8.4 3.6 -3.6 8.4 -3.6 -8.4 -8.4 -3.6 8.4 -3.6z" />
            </g>
            <text x="14" y="100">2017 · SOCIAL MEDIA KID</text>
            <text x="232" y="20">PERFORMANCE MARKETER</text>
            <text x="488" y="96">NOW · THE STRATEGIST</text>
          </svg>
        </div>
      </div>

      <div className="hero-bottom">
        <span className="scroll-cue">scroll — the pattern reveals itself ↓</span>
        <span className="star-glyph" aria-hidden="true">✦</span>
      </div>
    </header>
  )
}
