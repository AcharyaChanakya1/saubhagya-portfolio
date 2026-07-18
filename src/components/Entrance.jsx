import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

/**
 * Entrance v2 — the real Rumi Darwaza (generated ink line-art, exact
 * architecture: petal crown, scalloped arch, hanging chhatri lantern).
 * The monument RISES from the ground line as it sharpens into focus,
 * a gold star ignites above the crown, then the visitor passes THROUGH
 * the gate into the site. Skippable; once per session; reduced-motion skips.
 */
export default function Entrance() {
  const [show, setShow] = useState(() => {
    if (typeof window === 'undefined') return false
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
    return !sessionStorage.getItem('sd-entered')
  })
  const rootRef = useRef(null)
  const doneRef = useRef(false)

  const finish = () => {
    if (doneRef.current) return
    doneRef.current = true
    sessionStorage.setItem('sd-entered', '1')
    document.body.style.overflow = ''
    setShow(false)
  }

  useEffect(() => {
    if (!show) return
    const root = rootRef.current
    document.body.style.overflow = 'hidden'

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ onComplete: finish })
      tl.fromTo('.rd-art',
        { clipPath: 'inset(100% 0% 0% 0%)', filter: 'blur(5px)' },
        { clipPath: 'inset(0% 0% 0% 0%)', filter: 'blur(0px)', duration: 1.7, ease: 'power2.inOut' })
        .fromTo('.rd-star-svg',
          { opacity: 0, scale: 0, y: 10, transformOrigin: 'center' },
          { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: 'back.out(2.2)' }, '-=0.3')
        .to('.rd-caption', { opacity: 1, duration: 0.45 }, '<')
        .to({}, { duration: 0.45 })
        .to('.rd-wrap', {
          scale: 3.6, opacity: 0, duration: 1.0,
          ease: 'power2.in', transformOrigin: '50% 66%',
        })
        .to(root, { opacity: 0, duration: 0.4 }, '-=0.32')
    }, root)

    return () => {
      ctx.revert()
      document.body.style.overflow = ''
    }
  }, [show])

  if (!show) return null

  return (
    <div className="entrance" ref={rootRef} aria-label="Entering through the Rumi Darwaza">
      <div className="rd-wrap">
        <img
          className="rd-art"
          src="/art/rumi-darwaza.webp"
          alt="Ink line drawing of the Rumi Darwaza, Lucknow"
          width="1200" height="896"
        />
        <svg className="rd-star-svg" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="#C9A227" d="M12 1 l2.6 7.4 7.4 2.6 -7.4 2.6 -2.6 7.4 -2.6 -7.4 -7.4 -2.6 7.4 -2.6z" />
        </svg>
      </div>
      <div className="rd-caption">Lucknow · 26.85° N — through the gate</div>
      <button className="rd-skip" onClick={finish}>skip ✦</button>
    </div>
  )
}
