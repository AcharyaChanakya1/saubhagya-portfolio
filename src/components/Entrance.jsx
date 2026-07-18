import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

/**
 * Entrance v3 — the real Rumi Darwaza artwork, revealed like a hand
 * SKETCHING it: a paper-colored canvas covers the art and is erased in
 * serpentine pen strokes, so the monument appears to be drawn live —
 * the stroke-by-stroke charm of v1 with the exact architecture of v2.
 * Then the gold star ignites and the visitor passes through the gate.
 * Skippable; once per session; reduced-motion skips entirely.
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

    const img = root.querySelector('.rd-art')
    const canvas = root.querySelector('.rd-sketch')
    const cctx = canvas.getContext('2d')
    const paper = getComputedStyle(document.documentElement)
      .getPropertyValue('--paper').trim() || '#F5F1E7'

    const ROWS = 22
    let cw = 0, ch = 0
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)

    const setup = () => {
      cw = canvas.width = Math.max(1, img.clientWidth * dpr)
      ch = canvas.height = Math.max(1, img.clientHeight * dpr)
      cctx.fillStyle = paper
      cctx.fillRect(0, 0, cw, ch)
    }

    // erase serpentine pen strokes up to progress p (0..1), from scratch
    const drawErase = (p) => {
      cctx.globalCompositeOperation = 'source-over'
      cctx.fillStyle = paper
      cctx.fillRect(0, 0, cw, ch)
      cctx.globalCompositeOperation = 'destination-out'
      cctx.lineCap = 'round'

      const bandH = ch / ROWS
      const total = ROWS * p
      for (let r = 0; r < Math.ceil(total); r++) {
        const frac = Math.min(1, total - r)      // how much of this stroke is done
        const y = bandH * (r + 0.5)
        const ltr = r % 2 === 0                   // serpentine: alternate direction
        cctx.lineWidth = bandH * 1.25
        cctx.beginPath()
        const steps = 24
        for (let s = 0; s <= steps * frac; s++) {
          const t = s / steps
          const x = (ltr ? t : 1 - t) * cw
          const wob = Math.sin(t * Math.PI * 5 + r * 1.7) * bandH * 0.18
          s === 0 ? cctx.moveTo(x, y + wob) : cctx.lineTo(x, y + wob)
        }
        cctx.stroke()
      }
    }

    const ctx = gsap.context(() => {
      const prog = { v: 0 }
      const tl = gsap.timeline({ onComplete: finish })

      tl.call(setup)
        .to(prog, {
          v: 1, duration: 1.9, ease: 'power1.inOut',
          onUpdate: () => drawErase(prog.v),
        })
        .fromTo('.rd-star-svg',
          { opacity: 0, scale: 0, y: 10, transformOrigin: 'center' },
          { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: 'back.out(2.2)' }, '-=0.25')
        .to('.rd-caption', { opacity: 1, duration: 0.45 }, '<')
        .to({}, { duration: 0.45 })
        .to('.rd-wrap', {
          scale: 3.6, opacity: 0, duration: 1.0,
          ease: 'power2.in', transformOrigin: '50% 66%',
        })
        .to(root, { opacity: 0, duration: 0.4 }, '-=0.32')

      // if the image is a slow first load, keep canvas in sync
      if (!img.complete) img.addEventListener('load', setup, { once: true })
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
        <canvas className="rd-sketch" aria-hidden="true" />
        <svg className="rd-star-svg" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="#C9A227" d="M12 1 l2.6 7.4 7.4 2.6 -7.4 2.6 -2.6 7.4 -2.6 -7.4 -7.4 -2.6 7.4 -2.6z" />
        </svg>
      </div>
      <div className="rd-caption">Lucknow · 26.85° N — through the gate</div>
      <button className="rd-skip" onClick={finish}>skip ✦</button>
    </div>
  )
}
