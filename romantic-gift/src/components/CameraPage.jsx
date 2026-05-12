import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import LetterPage from './LetterPage'

const QUOTES = [
  "You are the most beautiful girl in the universe 💖",
  "Every moment with you is pure magic ✨",
  "You make my whole world shine brighter 🌸",
  "You are my everything, always 🫶",
]

export default function CameraPage() {
  const videoRef = useRef(null)
  const [hasCamera, setHasCamera] = useState(false)
  const [cameraError, setCameraError] = useState(false)
  const [currentQuote, setCurrentQuote] = useState(0)
  const [showLetter, setShowLetter] = useState(false)

  useEffect(() => {
    let stream = null
    async function startCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          setHasCamera(true)
        }
      } catch {
        setCameraError(true)
      }
    }
    startCamera()
    return () => { if (stream) stream.getTracks().forEach(t => t.stop()) }
  }, [])

  useEffect(() => {
    const t = setInterval(() => setCurrentQuote(q => (q + 1) % QUOTES.length), 5000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4 py-8">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0015] via-[#200030] to-[#0a0015]" />
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 6, repeat: Infinity }}
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, #ff4fa330 0%, transparent 70%)', filter: 'blur(60px)' }}
      />



      {/* Header */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="relative z-10 text-2xl md:text-3xl font-bold text-center mb-6 glow-text"
        style={{ fontFamily: 'var(--font-serif)', color: '#ffb3d1' }}
      >
        Look at the most beautiful girl 🌸
      </motion.h1>

      {/* Camera Frame */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-sm md:max-w-md"
      >
        {/* Glowing border container */}
        <div
          className="relative p-[3px] rounded-[2rem]"
          style={{
            background: 'linear-gradient(135deg, #ff6b9d, #c084fc, #ff4fa3, #ffb3d1)',
            boxShadow: '0 0 40px rgba(255,107,157,0.5), 0 0 80px rgba(255,107,157,0.25)',
          }}
        >
          <div className="rounded-[1.8rem] overflow-hidden bg-black relative aspect-[3/4]">
            {!cameraError ? (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                  style={{ transform: 'scaleX(-1)' }}
                />
                {!hasCamera && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                    <motion.p animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity }} className="text-[#ffb3d1] text-sm">
                      Starting camera... 📷
                    </motion.p>
                  </div>
                )}
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-[#1a0025] to-[#0d0018] gap-4">
                <div className="text-6xl">📷</div>
                <p className="text-[#ffb3d1]/80 text-sm text-center px-4">Camera access denied.<br />But you're still beautiful! 💕</p>
              </div>
            )}

            {/* Sparkles overlay corners */}
            {['top-2 left-2', 'top-2 right-2', 'bottom-2 left-2', 'bottom-2 right-2'].map((pos, i) => (
              <motion.div
                key={i}
                animate={{ scale: [1, 1.5, 1], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
                className={`absolute ${pos} text-xl pointer-events-none`}
              >
                ✨
              </motion.div>
            ))}
          </div>
        </div>

        {/* Floating quote over camera */}
        <div className="absolute -bottom-16 left-0 right-0 flex justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuote}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.6 }}
              className="glass px-5 py-3 rounded-full text-center max-w-xs"
            >
              <p className="text-sm text-[#ffb3d1] font-light" style={{ fontFamily: 'var(--font-serif)' }}>
                {QUOTES[currentQuote]}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Big romantic text */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1 }}
        className="relative z-10 mt-24 text-center max-w-lg px-4"
      >
        <p
          className="text-xl md:text-2xl shimmer-text font-bold leading-relaxed"
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          Mera Baccha, You Are The Most Beautiful Girl In Universe 💖
        </p>
      </motion.div>

      {/* Read Letter button */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.4 }}
        whileHover={{ scale: 1.05, y: -3 }}
        whileTap={{ scale: 0.96 }}
        onClick={() => setShowLetter(true)}
        className="relative z-10 mt-8 px-10 py-4 rounded-full text-white font-semibold tracking-wide text-lg"
        style={{
          background: 'linear-gradient(135deg, #ff4fa3, #e91e8c)',
          boxShadow: '0 0 30px rgba(255,79,163,0.5)',
        }}
      >
        💌 Read My Letter
      </motion.button>

      <AnimatePresence>
        {showLetter && <LetterPage onClose={() => setShowLetter(false)} />}
      </AnimatePresence>
    </div>
  )
}
