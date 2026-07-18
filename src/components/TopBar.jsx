import { motion, useScroll, useSpring } from 'framer-motion'

/** Thin iris→gold progress bar pinned to the very top of the viewport. */
export default function TopBar() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.3 })
  return <motion.div className="top-progress" style={{ scaleX }} aria-hidden="true" />
}
