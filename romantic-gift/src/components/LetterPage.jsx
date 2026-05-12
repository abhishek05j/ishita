import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

const LETTER_TEXT = `Every single day, I find myself thinking about how lucky I am to have you in my life. You are not just beautiful on the outside — you are radiant, warm, and so deeply kind that it takes my breath away every single time.

I created this little surprise because words alone can never be enough. But I hope this makes you smile, makes your heart flutter, because you make my life happier and more beautiful every single day 💕

You are my favorite person. My safe place. My home.

Thank you for being you.`


function Petal({ index }) {
  const x = Math.random() * 100
  const rotate = Math.random() * 360
  const size = 16 + Math.random() * 14
  return (
    <motion.div
      initial={{ y: -80, x: `${x}vw`, opacity: 0, rotate }}
      animate={{ y: '110vh', opacity: [0, 0.9, 0.9, 0], rotate: rotate + 180 }}
      transition={{ duration: 10 + Math.random() * 8, delay: Math.random() * 6, repeat: Infinity, ease: 'linear' }}
      className="fixed pointer-events-none"
      style={{ fontSize: size, zIndex: 51 }}
    >
      🌸
    </motion.div>
  )
}

export default function LetterPage({ onClose }) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    let i = 0
    const interval = setInterval(() => {
      setDisplayed(LETTER_TEXT.slice(0, i + 1))
      i++
      if (i >= LETTER_TEXT.length) {
        clearInterval(interval)
        setDone(true)
      }
    }, 28)
    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
    >
      {/* Full-screen background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#07000e] via-[#1a000d] to-[#07000e]" />
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 6, repeat: Infinity }}
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, #ff4fa340 0%, transparent 65%)', filter: 'blur(60px)' }}
      />

      {/* Falling petals */}
      {[...Array(18)].map((_, i) => <Petal key={i} index={i} />)}

      {/* Letter card */}
      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -40, scale: 1.02 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        className="relative z-10 w-full max-w-xl my-8"
      >
        {/* Glow halo behind letter */}
        <div
          className="absolute -inset-2 rounded-3xl pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, #ff6b9d40, #c084fc30, #ff4fa340)',
            filter: 'blur(20px)',
          }}
        />

        {/* Paper card */}
        <div
          className="relative rounded-3xl p-8 md:p-12 overflow-hidden"
          style={{
            background: 'linear-gradient(160deg, #fff9fb 0%, #fce4ec 50%, #fdf2f8 100%)',
            boxShadow: '0 25px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,107,157,0.2)',
          }}
        >
          {/* Decorative corner hearts */}
          {['top-4 left-5', 'top-4 right-5'].map((pos, i) => (
            <motion.div
              key={i}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
              className={`absolute ${pos} text-2xl pointer-events-none`}
            >
              🌹
            </motion.div>
          ))}

          {/* Candle glow strip */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 rounded-full"
            style={{ background: 'linear-gradient(90deg, transparent, #ff6b9d80, transparent)' }}
          />

          <h3
            className="text-5xl mb-8 pt-4"
            style={{ fontFamily: 'var(--font-hand)', color: '#880e4f' }}
          >
            Hey Baccha 💖
          </h3>

          {/* Typewriter text */}
          <div
            className="text-lg leading-[1.9] whitespace-pre-wrap"
            style={{ fontFamily: 'var(--font-caveat)', color: '#4a1942', fontSize: '1.2rem' }}
          >
            {displayed}
            {!done && (
              <motion.span
                animate={{ opacity: [0, 1] }}
                transition={{ repeat: Infinity, duration: 0.6 }}
                className="inline-block w-[2px] h-5 rounded-full align-middle ml-1"
                style={{ background: '#880e4f' }}
              />
            )}
          </div>

          <AnimatePresence>
            {done && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="mt-8 text-right text-4xl"
                style={{ fontFamily: 'var(--font-hand)', color: '#c2185b' }}
              >
                Yours forever 🩷
              </motion.p>
            )}
          </AnimatePresence>

          {/* Close button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            whileHover={{ scale: 1.05, boxShadow: '0 0 25px rgba(255,107,157,0.6)' }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="mt-10 w-full py-4 rounded-full text-white font-semibold tracking-wide flex items-center justify-center gap-2"
            style={{
              background: 'linear-gradient(135deg, #e91e8c, #ff4fa3)',
              boxShadow: '0 0 20px rgba(233,30,140,0.4)',
            }}
          >
            <X size={18} />
            Close Letter
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
}
