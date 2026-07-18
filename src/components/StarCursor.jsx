import { useEffect, useRef } from 'react'

/**
 * Cursor v2 — "the comet that draws constellations."
 * - The gold star stretches into a comet with velocity.
 * - Every CLICK bursts into a tiny constellation (dots + connecting lines)
 *   that glows and fades — you literally connect dots wherever you click.
 * - Hovering a link puts a slow-spinning dashed ring around the star.
 * - Occasional shooting stars streak across the page.
 * Idle-pauses its rAF loop; DPR capped (perf budget §7).
 */
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
      dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      w = canvas.width = window.innerWidth * dpr
      h = canvas.height = window.innerHeight * dpr
      canvas.style.width = window.innerWidth + 'px'
      canvas.style.height = window.innerHeight + 'px'
    }
    resize()
    window.addEventListener('resize', resize)

    const pos = { x: -100, y: -100 }
    const star = { x: -100, y: -100 }
    let vx = 0, vy = 0
    let scale = 1, targetScale = 1
    let ringOn = false
    let angle = 0, ringAngle = 0
    const trail = []
    const bursts = []   // click constellations
    const shoots = []   // shooting stars
    let lastMove = 0
    let lastShoot = performance.now() + 6000
    let running = false
    let rafId

    const wake = () => { if (!running) { running = true; rafId = requestAnimationFrame(tick) } }

    const onMove = (e) => {
      pos.x = e.clientX; pos.y = e.clientY
      lastMove = performance.now()
      wake()
    }
    window.addEventListener('mousemove', onMove)

    const onOver = (e) => {
      const hot = e.target.closest('a, button, [data-cursor="big"]')
      targetScale = hot ? 1.7 : 1
      ringOn = !!hot
    }
    document.addEventListener('mouseover', onOver)

    // click → burst into a micro-constellation
    const onDown = (e) => {
      const n = 6 + Math.floor(Math.random() * 2)
      const pts = []
      for (let i = 0; i < n; i++) {
        const a = (Math.PI * 2 * i) / n + Math.random() * 0.7
        const d = 26 + Math.random() * 34
        pts.push({
          x: e.clientX, y: e.clientY,
          tx: e.clientX + Math.cos(a) * d,
          ty: e.clientY + Math.sin(a) * d,
          r: 1.6 + Math.random() * 2.2,
        })
      }
      bursts.push({ pts, life: 1 })
      lastMove = performance.now()
      wake()
    }
    window.addEventListener('mousedown', onDown)

    const drawStar = (x, y, r, rot, alpha, color = '#C9A227') => {
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(rot)
      ctx.globalAlpha = alpha
      ctx.fillStyle = color
      ctx.beginPath()
      for (let i = 0; i < 8; i++) {
        const rad = i % 2 === 0 ? r : r * 0.38
        const a = (Math.PI / 4) * i
        ctx[i === 0 ? 'moveTo' : 'lineTo'](Math.cos(a) * rad, Math.sin(a) * rad)
      }
      ctx.closePath()
      ctx.fill()
      ctx.restore()
    }

    const tick = () => {
      const now = performance.now()
      const idle = now - lastMove > 2500 && trail.length === 0 && bursts.length === 0 && shoots.length === 0
      if (idle) {
        ctx.clearRect(0, 0, w, h)
        drawStar(star.x * dpr, star.y * dpr, 9 * scale * dpr, angle, 1)
        running = false
        return
      }

      ctx.clearRect(0, 0, w, h)

      const px = star.x, py = star.y
      star.x += (pos.x - star.x) * 0.22
      star.y += (pos.y - star.y) * 0.22
      vx = star.x - px
      vy = star.y - py
      scale += (targetScale - scale) * 0.15
      angle += 0.014
      ringAngle += 0.03

      const speed = Math.hypot(vx, vy)

      // comet tail: elongated glow stretched along velocity
      if (speed > 0.6) {
        const tailLen = Math.min(speed * 5.5, 70)
        const ta = Math.atan2(vy, vx)
        const grad = ctx.createLinearGradient(
          star.x * dpr, star.y * dpr,
          (star.x - Math.cos(ta) * tailLen) * dpr, (star.y - Math.sin(ta) * tailLen) * dpr,
        )
        grad.addColorStop(0, 'rgba(201,162,39,0.5)')
        grad.addColorStop(1, 'rgba(201,162,39,0)')
        ctx.save()
        ctx.strokeStyle = grad
        ctx.lineWidth = 3.2 * dpr
        ctx.lineCap = 'round'
        ctx.beginPath()
        ctx.moveTo(star.x * dpr, star.y * dpr)
        ctx.lineTo((star.x - Math.cos(ta) * tailLen) * dpr, (star.y - Math.sin(ta) * tailLen) * dpr)
        ctx.stroke()
        ctx.restore()
      }

      // sparkle trail
      if (speed > 1.4) {
        trail.push({
          x: star.x, y: star.y,
          r: 1.6 + Math.random() * 2.6,
          life: 1,
          rot: Math.random() * Math.PI,
          drift: (Math.random() - 0.5) * 0.6,
        })
      }
      if (trail.length > 28) trail.splice(0, trail.length - 28)
      for (let i = trail.length - 1; i >= 0; i--) {
        const p = trail[i]
        p.life -= 0.04
        p.x += p.drift
        p.y += 0.25
        if (p.life <= 0) { trail.splice(i, 1); continue }
        drawStar(p.x * dpr, p.y * dpr, p.r * p.life * dpr, p.rot, p.life * 0.5)
      }

      // click constellations
      for (let i = bursts.length - 1; i >= 0; i--) {
        const b = bursts[i]
        b.life -= 0.022
        if (b.life <= 0) { bursts.splice(i, 1); continue }
        const t = 1 - b.life
        const ease = 1 - Math.pow(1 - Math.min(t * 2.4, 1), 3)
        ctx.save()
        ctx.globalAlpha = b.life * 0.85
        // connecting lines
        ctx.strokeStyle = '#4C4380'
        ctx.lineWidth = 1 * dpr
        ctx.setLineDash([3 * dpr, 4 * dpr])
        ctx.beginPath()
        b.pts.forEach((p, j) => {
          const x = (p.x + (p.tx - p.x) * ease) * dpr
          const y = (p.y + (p.ty - p.y) * ease) * dpr
          j === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
        })
        ctx.closePath()
        ctx.stroke()
        ctx.restore()
        // dots
        b.pts.forEach((p) => {
          const x = p.x + (p.tx - p.x) * ease
          const y = p.y + (p.ty - p.y) * ease
          drawStar(x * dpr, y * dpr, p.r * dpr, 0, b.life)
        })
      }

      // shooting stars — rare, only while active
      if (now > lastShoot) {
        lastShoot = now + 9000 + Math.random() * 9000
        const fromLeft = Math.random() > 0.5
        shoots.push({
          x: fromLeft ? -40 : window.innerWidth + 40,
          y: 40 + Math.random() * (window.innerHeight * 0.3),
          vx: (fromLeft ? 1 : -1) * (11 + Math.random() * 5),
          vy: 2.4 + Math.random() * 1.6,
          life: 1,
        })
      }
      for (let i = shoots.length - 1; i >= 0; i--) {
        const s = shoots[i]
        s.x += s.vx; s.y += s.vy; s.life -= 0.012
        if (s.life <= 0 || s.x < -80 || s.x > window.innerWidth + 80) { shoots.splice(i, 1); continue }
        const ta = Math.atan2(s.vy, s.vx)
        const len = 46
        const grad = ctx.createLinearGradient(
          s.x * dpr, s.y * dpr,
          (s.x - Math.cos(ta) * len) * dpr, (s.y - Math.sin(ta) * len) * dpr,
        )
        grad.addColorStop(0, `rgba(201,162,39,${0.55 * s.life})`)
        grad.addColorStop(1, 'rgba(201,162,39,0)')
        ctx.save()
        ctx.strokeStyle = grad
        ctx.lineWidth = 1.6 * dpr
        ctx.lineCap = 'round'
        ctx.beginPath()
        ctx.moveTo(s.x * dpr, s.y * dpr)
        ctx.lineTo((s.x - Math.cos(ta) * len) * dpr, (s.y - Math.sin(ta) * len) * dpr)
        ctx.stroke()
        ctx.restore()
      }

      // ring when hovering interactive elements
      if (ringOn || scale > 1.06) {
        ctx.save()
        ctx.globalAlpha = Math.min(1, (scale - 1) / 0.7) * 0.8
        ctx.strokeStyle = '#4C4380'
        ctx.lineWidth = 1 * dpr
        ctx.setLineDash([4 * dpr, 5 * dpr])
        ctx.beginPath()
        ctx.arc(star.x * dpr, star.y * dpr, 20 * scale * dpr, ringAngle, ringAngle + Math.PI * 2)
        ctx.stroke()
        ctx.restore()
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
      window.removeEventListener('mousedown', onDown)
      document.removeEventListener('mouseover', onOver)
    }
  }, [])

  return <canvas ref={canvasRef} className="star-cursor-canvas" aria-hidden="true" />
}
