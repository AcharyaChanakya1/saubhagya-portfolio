import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

/**
 * Entrance — a stylized ink line-art Rumi Darwaza sketches itself on paper,
 * a gold star rises over the crown, then the visitor passes THROUGH the arch
 * into the site. Skippable; plays once per session; skipped entirely for
 * reduced-motion. Pure SVG — zero image weight.
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
      const paths = root.querySelectorAll('.rd-path')
      paths.forEach((p) => {
        const len = p.getTotalLength()
        gsap.set(p, { strokeDasharray: len, strokeDashoffset: len })
      })

      const tl = gsap.timeline({ onComplete: finish })
      tl.to(paths, {
        strokeDashoffset: 0,
        duration: 1.5,
        stagger: 0.055,
        ease: 'power1.inOut',
      })
        .fromTo('.rd-star-el',
          { opacity: 0, scale: 0, y: 12, transformOrigin: 'center' },
          { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: 'back.out(2.2)' }, '-=0.35')
        .to('.rd-caption', { opacity: 1, duration: 0.4 }, '<')
        .to({}, { duration: 0.4 })
        .to('.rd-svg', {
          scale: 3.4, opacity: 0, duration: 0.95,
          ease: 'power2.in', transformOrigin: '50% 64%',
        })
        .to(root, { opacity: 0, duration: 0.4 }, '-=0.3')
    }, root)

    return () => {
      ctx.revert()
      document.body.style.overflow = ''
    }
  }, [show])

  if (!show) return null

  return (
    <div className="entrance" ref={rootRef} aria-label="Entering the site through the Rumi Darwaza">
      <svg className="rd-svg" viewBox="0 0 400 300" aria-hidden="true">
        {/* ground */}
        <path className="rd-path" d="M 24 282 H 376" />
        {/* main mass */}
        <path className="rd-path" d="M 96 282 V 152 Q 96 88 144 66 Q 200 42 256 66 Q 304 88 304 152 V 282" />
        {/* central arch opening */}
        <path className="rd-path" d="M 152 282 V 176 Q 152 126 200 110 Q 248 126 248 176 V 282" />
        {/* crown chhatri */}
        <path className="rd-path" d="M 186 64 Q 186 44 200 40 Q 214 44 214 64" />
        <path className="rd-path" d="M 182 64 H 218 M 188 64 V 74 M 212 64 V 74 M 182 74 H 218" />
        <path className="rd-path" d="M 200 40 V 28" />
        {/* the iconic petal crest over the arch */}
        <path className="rd-path rd-iris" d="M 156 122 L 146 110 M 170 106 L 163 92 M 186 96 L 182 80 M 200 92 L 200 76 M 214 96 L 218 80 M 230 106 L 237 92 M 244 122 L 254 110" />
        {/* side wings */}
        <path className="rd-path" d="M 24 282 V 212 Q 24 196 42 196 H 96" />
        <path className="rd-path" d="M 376 282 V 212 Q 376 196 358 196 H 304" />
        {/* wing arches */}
        <path className="rd-path" d="M 44 282 V 240 Q 44 226 58 226 Q 72 226 72 240 V 282" />
        <path className="rd-path" d="M 356 282 V 240 Q 356 226 342 226 Q 328 226 328 240 V 282" />
        {/* window slits */}
        <path className="rd-path rd-iris" d="M 122 200 V 176 M 278 200 V 176" />
        {/* the gold star above the finial */}
        <path className="rd-star-el" d="M 200 8 l 2.6 7.4 7.4 2.6 -7.4 2.6 -2.6 7.4 -2.6 -7.4 -7.4 -2.6 7.4 -2.6z" />
      </svg>
      <div className="rd-caption">Lucknow · 26.85° N — through the gate</div>
      <button className="rd-skip" onClick={finish}>skip ✦</button>
    </div>
  )
}
