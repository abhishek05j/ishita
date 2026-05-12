import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'


function Particle({ index }) {
  const x = Math.random() * 100
  const y = Math.random() * 100
  const size = 3 + Math.random() * 4
  return (
    <motion.div
      className="fixed rounded-full pointer-events-none"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
        background: `radial-gradient(circle, #ff6b9d, #ffb3d1)`,
        boxShadow: `0 0 ${size * 3}px #ff6b9d`,
      }}
      animate={{
        scale: [1, 1.8, 1],
        opacity: [0.4, 1, 0.4],
        y: [0, -20, 0],
      }}
      transition={{
        duration: 2 + Math.random() * 3,
        repeat: Infinity,
        delay: Math.random() * 3,
        ease: 'easeInOut',
      }}
    />
  )
}

export default function LandingPage({ onNext }) {
  const [showButton, setShowButton] = useState(false)
  const [typed, setTyped] = useState('')
  const fullText = 'Hello Mera Cute Baccha 💖✨'

  useEffect(() => {
    const timeout = setTimeout(() => {
      let i = 0
      const interval = setInterval(() => {
        setTyped(fullText.slice(0, i + 1))
        i++
        if (i >= fullText.length) {
          clearInterval(interval)
          setTimeout(() => setShowButton(true), 600)
        }
      }, 80)
      return () => clearInterval(interval)
    }, 800)
    return () => clearTimeout(timeout)
  }, [])

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center text-center overflow-hidden px-4">
      {/* Background layers */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0d0010] via-[#1a0025] to-[#0d0010]" />
      <div className="absolute inset-0 bg-gradient-to-br from-[#3d0030]/40 via-transparent to-[#1a0040]/40" />
      
      {/* Large ambient glow blobs */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.35, 0.2] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, #ff4fa3 0%, transparent 70%)', filter: 'blur(80px)' }}
      />
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.28, 0.15] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, #c084fc 0%, transparent 70%)', filter: 'blur(80px)' }}
      />

      {/* Particles */}
      {[...Array(30)].map((_, i) => <Particle key={i} index={i} />)}



      {/* Center Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.3 }}
        className="relative z-10 flex flex-col items-center gap-8"
      >
        {/* Glowing decorative line */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="h-[1px] w-32 bg-gradient-to-r from-transparent via-[#ff6b9d] to-transparent"
        />

        <div className="glass-white px-8 py-6 rounded-3xl max-w-2xl">
          <h1
            className="text-4xl md:text-6xl lg:text-7xl font-bold glow-text leading-tight"
            style={{ fontFamily: 'var(--font-serif)', color: '#ffb3d1' }}
          >
            {typed}
            <motion.span
              animate={{ opacity: [0, 1] }}
              transition={{ repeat: Infinity, duration: 0.7 }}
              className="inline-block w-1 h-12 bg-[#ff6b9d] ml-1 align-middle rounded-full"
            />
          </h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: showButton ? 1 : 0 }}
            transition={{ duration: 1 }}
            className="mt-4 text-lg text-[#ffb3d1]/80 font-light tracking-wider"
          >
            A little surprise made just for you ✨
          </motion.p>
        </div>

        {/* CTA Button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: showButton ? 1 : 0, scale: showButton ? 1 : 0.8 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ scale: 1.07, y: -3 }}
          whileTap={{ scale: 0.96 }}
          onClick={onNext}
          className="pulse-glow px-10 py-5 rounded-full text-white text-xl font-semibold tracking-wide flex items-center gap-3 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #ff4fa3, #e91e8c, #c9184a)',
            boxShadow: '0 0 30px rgba(255,79,163,0.5)',
            fontFamily: 'var(--font-sans)',
          }}
        >
          <motion.span
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-2xl"
          >
            💌
          </motion.span>
          Open Your Surprise
        </motion.button>

        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="h-[1px] w-32 bg-gradient-to-r from-transparent via-[#ff6b9d] to-transparent"
        />
      </motion.div>
    </div>
  )
}
