import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

/**
 * Spotlight text (spec §5.4): words illuminate as they cross the reading zone.
 * Scroll-linked via useScroll + per-word opacity ranges.
 */
function Word({ children, progress, range }) {
  const opacity = useTransform(progress, range, [0.16, 1])
  return (
    <motion.span className="wr-word" style={{ opacity }}>
      {children}&nbsp;
    </motion.span>
  )
}

export default function WordReveal({ text, as: Tag = 'p', className = '' }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.86', 'start 0.38'],
  })
  const words = text.split(' ')

  return (
    <Tag ref={ref} className={className}>
      {words.map((word, i) => {
        const start = i / words.length
        const end = start + 1 / words.length
        return (
          <Word key={i} progress={scrollYProgress} range={[start, end]}>
            {word}
          </Word>
        )
      })}
    </Tag>
  )
}
