import { useEffect, useRef } from 'react'

/** Gold four-point star cursor with a fading trail (spec §5.1). Canvas layer. */
export default function StarCursor() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = canvas.getContext('2d')
    let w, h, dpr
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5) // perf budget: cap DPR
      w = canvas.width = window.innerWidth * dpr
      h = canvas.height = window.innerHeight * dpr
      canvas.style.width = window.innerWidth + 'px'
      canvas.style.height = window.innerHeight + 'px'
    }
    resize()
    window.addEventListener('resize', resize)

    const pos = { x: -100, y: -100 }   // actual mouse
    const star = { x: -100, y: -100 }  // eased star position
    let scale = 1, targetScale = 1
    let angle = 0
    const trail = []
    let lastMove = 0
    let running = false

    const onMove = (e) => {
      pos.x = e.clientX; pos.y = e.clientY
      lastMove = performance.now()
      if (!running) { running = true; rafId = requestAnimationFrame(tick) } // wake
    }
    window.addEventListener('mousemove', onMove)

    // grow over interactive elements
    const onOver = (e) => {
      targetScale = e.target.closest('a, button, [data-cursor="big"]') ? 1.9 : 1
    }
    document.addEventListener('mouseover', onOver)

    const drawStar = (x, y, r, rot, alpha, color = '#C9A227') => {
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(rot)
      ctx.globalAlpha = alpha
      ctx.fillStyle = color
      ctx.beginPath()
      // 4-point star: alternate outer/inner radii
      for (let i = 0; i < 8; i++) {
        const rad = i % 2 === 0 ? r : r * 0.38
        const a = (Math.PI / 4) * i
        ctx[i === 0 ? 'moveTo' : 'lineTo'](Math.cos(a) * rad, Math.sin(a) * rad)
      }
      ctx.closePath()
      ctx.fill()
      ctx.restore()
    }

    let rafId
    const tick = () => {
      // idle pause: no movement for 2.5s and no live trail -> stop the loop
      if (performance.now() - lastMove > 2500 && trail.length === 0) {
        ctx.clearRect(0, 0, w, h)
        drawStar(star.x * dpr, star.y * dpr, 9 * scale * dpr, angle, 1)
        running = false
        return
      }
      ctx.clearRect(0, 0, w, h)
      // ease star toward mouse
      star.x += (pos.x - star.x) * 0.22
      star.y += (pos.y - star.y) * 0.22
      scale += (targetScale - scale) * 0.15
      angle += 0.014

      // spawn trail particle when moving
      const speed = Math.hypot(pos.x - star.x, pos.y - star.y)
      if (speed > 1.4) {
        trail.push({
          x: star.x, y: star.y,
          r: (2 + Math.random() * 3),
          life: 1,
          rot: Math.random() * Math.PI,
          drift: (Math.random() - 0.5) * 0.6,
        })
      }
      if (trail.length > 34) trail.splice(0, trail.length - 34)

      for (let i = trail.length - 1; i >= 0; i--) {
        const p = trail[i]
        p.life -= 0.035
        p.x += p.drift
        p.y += 0.25
        if (p.life <= 0) { trail.splice(i, 1); continue }
        drawStar(p.x * dpr, p.y * dpr, p.r * p.life * dpr, p.rot, p.life * 0.55)
      }

      drawStar(star.x * dpr, star.y * dpr, 9 * scale * dpr, angle, 1)
      rafId = requestAnimationFrame(tick)
    }
    running = true
    rafId = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onOver)
    }
  }, [])

  return <canvas ref={canvasRef} className="star-cursor-canvas" aria-hidden="true" />
}
