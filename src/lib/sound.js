/**
 * Synthesized sound kit — Web Audio, zero asset files.
 * Everything is OFF until the user opts in via the SoundToggle pill.
 */
let ctx = null
let enabled = false

export const isEnabled = () => enabled

export function setEnabled(v) {
  enabled = v
  if (v) {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)()
    if (ctx.state === 'suspended') ctx.resume()
  }
}

function tone({ freq, dur = 0.5, type = 'sine', gain = 0.07, attack = 0.012 }) {
  if (!enabled || !ctx) return
  const t = ctx.currentTime
  const o = ctx.createOscillator()
  const g = ctx.createGain()
  o.type = type
  o.frequency.value = freq
  g.gain.setValueAtTime(0, t)
  g.gain.linearRampToValueAtTime(gain, t + attack)
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  o.connect(g).connect(ctx.destination)
  o.start(t)
  o.stop(t + dur + 0.05)
}

const PENTA = [523.25, 587.33, 659.25, 783.99, 880, 1046.5] // C5 D5 E5 G5 A5 C6

export const sfx = {
  /** Receipts star flare — ascending bell per stat index */
  star(i = 0) {
    const f = PENTA[i % PENTA.length]
    tone({ freq: f, dur: 0.9, gain: 0.06 })
    tone({ freq: f * 2, dur: 0.32, gain: 0.018 })
  },
  /** sky-progress star lights */
  tick() { tone({ freq: 1318.5, dur: 0.1, type: 'triangle', gain: 0.022 }) },
  /** horizontal station arrival */
  thump() { tone({ freq: 98, dur: 0.28, gain: 0.09 }); tone({ freq: 196, dur: 0.16, gain: 0.03 }) },
  /** small ui pop */
  pop() { tone({ freq: 440, dur: 0.09, type: 'triangle', gain: 0.045 }) },
}
