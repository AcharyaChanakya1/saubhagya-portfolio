import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Chapter 02 · The Receipts (spec §5.3) — THE set-piece.
 * Night inversion, scene pins, stats flare + count up one at a time,
 * scroll releases only after the last stat. Scrubbed = user can't skip.
 * Backdrop: CSS starfield now; Higgsfield ambient film drops in later.
 */
const STATS = [
  { value: 10000000, suffix: '+', label: <><b>people reached</b> · one campaign, ₹40,000 budget</> },
  { value: 70000, suffix: '+', label: <><b>form submissions</b> · from that same ₹40K</> },
  { value: 6000, suffix: '+', label: <><b>real-estate leads</b> · at ₹250 per lead, over 3 years</> },
  { value: 100, suffix: '+', label: <><b>calls every day</b> · a Gurugram showroom, via Google</> },
  { text: '₹50K → ₹40 LAKH+', gold: true, label: <><b>ad spend → interior projects won</b> · Dehradun</> },
]

const fmt = (n) => Math.round(n).toLocaleString('en-IN')

function Flare({ gold }) {
  return (
    <svg viewBox="0 0 30 30" aria-hidden="true">
      <path d="M15 3 l2.8 9.2 9.2 2.8 -9.2 2.8 -2.8 9.2 -2.8 -9.2 -9.2 -2.8 9.2 -2.8z"
        fill={gold ? '#C9A227' : '#EDE9DE'} />
    </svg>
  )
}

export default function Receipts() {
  const stageRef = useRef(null)

  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const ctx = gsap.context(() => {
      const stats = gsap.utils.toArray('.stat', stage)
      const closer = stage.querySelector('.receipts-closer')

      if (reduced) {
        // static fallback: everything visible, real values set
        stats.forEach((s) => {
          gsap.set(s, { opacity: 1 })
          const num = s.querySelector('[data-count]')
          if (num) num.textContent = fmt(+num.dataset.count) + (num.dataset.suffix || '')
        })
        gsap.set(closer, { opacity: 1 })
        return
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: stage,
          start: 'top top',
          end: '+=3800',
          pin: true,
          scrub: 0.5,
          anticipatePin: 1,
        },
      })

      stats.forEach((stat) => {
        const flare = stat.querySelector('.flare svg')
        const num = stat.querySelector('[data-count]')

        tl.to(stat, { opacity: 1, duration: 0.35 })
        tl.fromTo(flare, { scale: 0, rotate: -40, transformOrigin: 'center' },
          { scale: 1, rotate: 0, duration: 0.35, ease: 'back.out(2.2)' }, '<')

        if (num) {
          const target = +num.dataset.count
          const suffix = num.dataset.suffix || ''
          const counter = { v: 0 }
          tl.to(counter, {
            v: target, duration: 1.05, ease: 'power1.inOut',
            onUpdate: () => { num.textContent = fmt(counter.v) + suffix },
          }, '<+0.1')
        } else {
          // gold finale text reveal
          const val = stat.querySelector('.stat-value')
          tl.fromTo(val, { scale: 0.82, opacity: 0, transformOrigin: 'left center' },
            { scale: 1, opacity: 1, duration: 0.9, ease: 'power2.out' }, '<+0.1')
        }
        tl.to({}, { duration: 0.42 }) // hold — "stays until seen"
      })

      tl.to(closer, { opacity: 1, duration: 0.7 })
      tl.to({}, { duration: 0.5 })
    }, stage)

    return () => ctx.revert()
  }, [])

  return (
    <section className="receipts" id="receipts">
      <div className="receipts-stage" ref={stageRef}>
        <div className="receipts-bg" aria-hidden="true">
          {/* Higgsfield ambient film mounts here later; CSS starfield until then */}
          <div className="bg-fallback starfield" />
        </div>

        <div className="receipts-inner">
          <div className="chapter-label">Chapter 02 · The Receipts</div>
          <p className="receipts-opener">Claims are easy. Here's what the data says.</p>

          <div className="stat-row">
            {STATS.map((s, i) => (
              <div className={`stat${s.gold ? ' is-gold' : ''}`} key={i}>
                <div className="flare"><Flare gold={s.gold} /></div>
                <div>
                  {s.text
                    ? <div className="stat-value">{s.text}</div>
                    : <div className="stat-value" data-count={s.value} data-suffix={s.suffix}>0</div>}
                  <div className="stat-label">{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          <p className="receipts-closer">
            None of this came from posting more. <b>It came from planning better.</b>
          </p>
        </div>
      </div>
    </section>
  )
}
