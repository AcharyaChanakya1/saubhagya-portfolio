import { useState } from 'react'
import { setEnabled, sfx } from '../lib/sound.js'

export default function SoundToggle() {
  const [on, setOn] = useState(false)

  const toggle = () => {
    const next = !on
    setEnabled(next)
    setOn(next)
    if (next) sfx.star(3) // a welcome chime so the choice is instantly audible
  }

  return (
    <button
      className={`sound-pill${on ? ' on' : ''}`}
      onClick={toggle}
      aria-pressed={on}
      aria-label={on ? 'Turn sound off' : 'Turn sound on'}
    >
      <span className="sound-star">✦</span> sound {on ? 'on' : 'off'}
    </button>
  )
}
