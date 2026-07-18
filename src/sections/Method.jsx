import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { sfx } from '../lib/sound.js'

gsap.registerPlugin(ScrollTrigger)

/**
 * Chapter 04 · The Playbook — v2 "book reading".
 * The social media kid's notebook: the section pins, and each principle is a
 * ruled notebook page that turns away as you scroll, revealing the next.
 * The last spread lists all four methods + the tagline.
 * Mobile / reduced-motion: pages stack vertically, no pin.
 */
const PAGES = [
  {
    num: '01',
    title: 'Research before rupees.',
    copy: 'I study your market, your competitors, and your customer’s psychology before a single rupee of your budget moves.',
  },
  {
    num: '02',
    title: 'Strategy gives the orders.',
    copy: 'Content calendars, campaigns, SEO — everything executes one written plan, on a timeline.',
  },
  {
    num: '03',
    title: 'Psychology does the selling.',
    copy: 'Frameworks like 5A, audience research, buying behaviour — ads don’t convince people. Understanding them does.',
  },
  {
    num: '04',
    title: 'Data closes the loop.',
    copy: 'Monthly and quarterly reports I read and present myself. You always know what worked, and what happens next.',
  },
]

export default function Method() {
  const stageRef = useRef(null)

  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return

    const mm = gsap.matchMedia()

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const pages = gsap.utils.toArray('.book-page', stage)
      const final = stage.querySelector('.book-final')

      gsap.set(pages.slice(1), { opacity: 0, y: 48, rotateX: 9 })
      gsap.set(final, { opacity: 0, y: 48 })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: stage,
          start: 'top top',
          end: '+=' + (PAGES.length * 780 + 700),
          pin: true,
          scrub: 0.5,
          anticipatePin: 1,
        },
      })

      pages.forEach((pg, i) => {
        tl.to({}, { duration: 0.5 }) // read hold
        tl.call(() => sfx.pop())
        tl.to(pg, {
          rotateX: -78, yPercent: -9, opacity: 0,
          duration: 0.55, ease: 'power2.in',
          transformOrigin: 'top center',
        })
        const next = pages[i + 1] || final
        tl.to(next, { opacity: 1, y: 0, rotateX: 0, duration: 0.55, ease: 'power2.out' }, '<+0.18')
      })
      tl.to({}, { duration: 0.6 }) // final hold
    })

    return () => mm.revert()
  }, [])

  return (
    <section className="method-section" id="method">
      <div className="section" style={{ paddingBottom: 0 }}>
        <div className="chapter-label">Chapter 04 · The Playbook</div>
        <p className="method-intro">The social media kid kept a notebook. It became a system.</p>
      </div>

      <div className="book-stage" ref={stageRef}>
        <div className="book">
          {PAGES.map((p) => (
            <div className="book-page" key={p.num}>
              <div className="page-kicker">Principle {p.num}</div>
              <h3 className="page-title">{p.title}</h3>
              <p className="page-copy">{p.copy}</p>
              <div className="page-num">Page {p.num} / 04</div>
            </div>
          ))}

          <div className="book-final">
            <div className="page-kicker">The full playbook</div>
            {PAGES.map((p) => (
              <div className="final-row" key={p.num}>
                <span className="final-num">{p.num}</span>
                <span className="final-title">{p.title}</span>
              </div>
            ))}
            <p className="book-tagline">The next page is <b>your business.</b></p>
          </div>
        </div>
      </div>

      <div className="section" style={{ paddingTop: 24 }}>
        <div className="toolkit">
          <div className="toolkit-label">The toolkit</div>
          <p className="toolkit-items">
            <b>Meta Ads</b> · <b>Google Ads</b> · <b>SEO & Google My Business</b> ·
            Market & competitor research · Content strategy & calendars ·
            Static creatives · Analytics & reporting
          </p>
          <p className="toolkit-note">Video production isn't my craft — I direct it, I don't edit it.</p>
        </div>
      </div>
    </section>
  )
}
