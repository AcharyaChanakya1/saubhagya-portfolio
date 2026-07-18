import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { sfx } from '../lib/sound.js'

gsap.registerPlugin(ScrollTrigger)

/**
 * Chapter 01 · The Dots — v2.
 * Desktop: the section PINS and the career travels HORIZONTALLY —
 * a journey you ride through, station by station. Text cut to punch lines.
 * Mobile / reduced-motion: compact vertical rail.
 */
const STATIONS = [
  {
    year: '2017',
    label: 'Weddingwood · Lucknow',
    title: 'The first dot.',
    copy: <>Wedding photography taught the first rule: <strong>attention is bought.
      Trust is earned.</strong></>,
  },
  {
    year: '17–21',
    label: 'Azea Gaia · Luxury FDI project',
    title: 'Positioning beats shouting.',
    copy: <>Four years of precision targeting. <strong>The property sold out.</strong></>,
  },
  {
    year: '21–24',
    label: 'Invest 101 Homes · Real estate',
    title: 'Strategy becomes a system.',
    copy: <><strong>6,000+ leads at ₹250 each</strong> — while the market paid double.</>,
  },
  {
    year: '2024',
    label: 'Medha Learning Foundation',
    title: 'Budget decides reach. Strategy decides results.',
    copy: <>₹40K → <strong>1 crore people → 70,000 forms.</strong></>,
  },
  {
    year: 'Now',
    label: 'Independent',
    title: 'The pattern, complete.',
    gold: true,
    copy: <>One person. A director's brain. <strong>Your business.</strong></>,
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
  const stageRef = useRef(null)
  const trackRef = useRef(null)
  const lineRef = useRef(null)

  useEffect(() => {
    const stage = stageRef.current
    const track = trackRef.current
    const path = lineRef.current
    if (!stage || !track) return

    const mm = gsap.matchMedia()

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const getDist = () => Math.max(0, track.scrollWidth - window.innerWidth)

      const tween = gsap.to(track, {
        x: () => -getDist(),
        ease: 'none',
        scrollTrigger: {
          trigger: stage,
          start: 'top top',
          end: () => '+=' + (getDist() + 300),
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      })

      if (path) {
        const len = path.getTotalLength()
        gsap.fromTo(path,
          { strokeDasharray: len, strokeDashoffset: len },
          {
            strokeDashoffset: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: stage,
              start: 'top top',
              end: () => '+=' + (getDist() + 300),
              scrub: 0.6,
            },
          })
      }

      gsap.utils.toArray('.station', track).forEach((station) => {
        const star = station.querySelector('.entry-star')
        gsap.fromTo(star,
          { scale: 0, transformOrigin: 'center' },
          {
            scale: 1, duration: 0.55, ease: 'back.out(2.4)',
            scrollTrigger: {
              trigger: station,
              containerAnimation: tween,
              start: 'left 72%',
              onEnter: () => sfx.thump(),
            },
          })
        gsap.fromTo(station.querySelector('.station-year'),
          { xPercent: 14 },
          {
            xPercent: -8, ease: 'none',
            scrollTrigger: {
              trigger: station,
              containerAnimation: tween,
              start: 'left right',
              end: 'right left',
              scrub: true,
            },
          })
      })
    })

    // reduced-motion users get the static vertical stack (CSS handles layout)

    return () => mm.revert()
  }, [])

  return (
    <section className="dots-section" id="dots">
      <div className="section" style={{ paddingBottom: 0 }}>
        <div className="chapter-label">Chapter 01 · The Dots</div>
        <p className="dots-intro">Eight years. Five industries. One pattern.</p>
      </div>

      <div className="dots-stage" ref={stageRef}>
        <div className="dots-track" ref={trackRef}>
          <svg className="dots-hline" viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true">
            <path ref={lineRef} d="M 0 24 L 16 14 L 36 27 L 58 10 L 80 22 L 100 16"
              fill="none" stroke="#4C4380" strokeWidth="1.5"
              strokeDasharray="4 5" vectorEffect="non-scaling-stroke" opacity="0.55" />
          </svg>

          {STATIONS.map((s) => (
            <article className={`station${s.gold ? ' is-gold' : ''}`} key={s.label}>
              <div className="station-year" aria-hidden="true">{s.year}</div>
              <div className="station-head">
                <div className="dot-star"><EntryStar gold={s.gold} /></div>
                <div className="station-label">{s.label}</div>
              </div>
              <h3 className="station-title">{s.title}</h3>
              <p className="station-copy">{s.copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
