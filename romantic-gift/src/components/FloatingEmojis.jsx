import { useMemo } from 'react'
import { motion } from 'framer-motion'

const EMOJIS = ['💖', '💕', '🌸', '🫶', '✨', '💗', '🌹', '🐻', '😭']

function SingleEmoji({ emoji, config }) {
  const { x, delay, duration, size, driftX, startY } = config
  return (
    <motion.div
      initial={{ y: startY, x: `${x}vw`, opacity: 0, scale: 0.5 }}
      animate={{
        y: '-12vh',
        x: [`${x}vw`, `${x + driftX}vw`, `${x + driftX * 0.5}vw`, `${x + driftX * 1.2}vw`],
        opacity: [0, 0.9, 0.9, 0.85, 0],
        scale: [0.5, 1.05, 1, 1.05, 0.6],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
        times: [0, 0.15, 0.5, 0.85, 1],
      }}
      className="fixed pointer-events-none select-none"
      style={{
        fontSize: size,
        zIndex: 1,
        filter: `drop-shadow(0 0 ${size * 0.4}px rgba(255,107,157,0.7)) drop-shadow(0 0 ${size * 0.8}px rgba(255,79,163,0.35))`,
      }}
    >
      {emoji}
    </motion.div>
  )
}

export default function FloatingEmojis({ count = 20 }) {
  const configs = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      emoji: EMOJIS[i % EMOJIS.length],
      config: {
        x: 2 + ((i * 9.3) % 88),
        delay: (i * 0.7) % 10,
        duration: 9 + ((i * 1.3) % 9),   // 9-18s — noticeably faster
        size: 18 + ((i * 7) % 22),
        driftX: (i % 2 === 0 ? 1 : -1) * (3 + ((i * 2.1) % 8)),
        startY: '108vh',
      },
    })),
  [count])

  return (
    <>
      {configs.map(({ emoji, config }, i) => (
        <SingleEmoji key={i} emoji={emoji} config={config} />
      ))}
    </>
  )
}
