import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import StarCursor from './components/StarCursor.jsx'
import SkyProgress from './components/SkyProgress.jsx'
import PillNav from './components/PillNav.jsx'
import SoundToggle from './components/SoundToggle.jsx'
import TopBar from './components/TopBar.jsx'
import Entrance from './components/Entrance.jsx'
import Hero from './sections/Hero.jsx'
import Dots from './sections/Dots.jsx'
import Receipts from './sections/Receipts.jsx'
import Proof from './sections/Proof.jsx'
import Method from './sections/Method.jsx'
import NextDot from './sections/NextDot.jsx'

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    const lenis = new Lenis({ lerp: 0.11, smoothWheel: true })
    lenis.on('scroll', ScrollTrigger.update)
    const raf = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    document.documentElement.classList.add('has-star-cursor')

    return () => {
      gsap.ticker.remove(raf)
      lenis.destroy()
    }
  }, [])

  return (
    <>
      <Entrance />
      <TopBar />
      <StarCursor />
      <SkyProgress />
      <PillNav />
      <SoundToggle />
      <main>
        <Hero />
        <Dots />
        <Receipts />
        <Proof />
        <Method />
        <NextDot />
      </main>
    </>
  )
}
