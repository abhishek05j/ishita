import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Music, Pause, Mail } from 'lucide-react'
import LetterPage from './LetterPage'

// Example placeholders
const PHOTOS = [
  'https://picsum.photos/400/400?random=1',
  'https://picsum.photos/400/400?random=2',
  'https://picsum.photos/400/400?random=3'
]

const QUOTES = [
  "You are my today and all of my tomorrows.",
  "I love you more than I have ever found a way to say to you.",
  "If I know what love is, it is because of you."
]

export default function SurprisePage() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentQuoteIdx, setCurrentQuoteIdx] = useState(0)
  const [showLetter, setShowLetter] = useState(false)
  const [daysTogether, setDaysTogether] = useState(0)

  // Rotate quotes
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuoteIdx((prev) => (prev + 1) % QUOTES.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  // Calculate days (e.g. from 2024-01-01)
  useEffect(() => {
    const start = new Date('2024-01-01')
    const now = new Date()
    const diff = Math.floor((now - start) / (1000 * 60 * 60 * 24))
    setDaysTogether(diff)
  }, [])

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen relative p-6 md:p-12 overflow-x-hidden"
    >
      {/* Floating Hearts Animation Background */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: "110vh", x: Math.random() * window.innerWidth }}
            animate={{ 
              y: "-10vh",
              x: (Math.random() * window.innerWidth),
              rotate: 360
            }}
            transition={{ 
              duration: 10 + Math.random() * 10, 
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 5
            }}
            className="absolute text-red-500"
          >
            <Heart size={20 + Math.random() * 20} fill="currentColor" />
          </motion.div>
        ))}
      </div>

      {/* Top Bar: Music Toggle */}
      <div className="flex justify-between items-center mb-12">
        <div className="glass px-4 py-2 rounded-full flex items-center gap-2">
          <Heart className="w-4 h-4 text-[var(--color-primary)] fill-[var(--color-primary)] animate-pulse" />
          <span className="text-sm font-medium">{daysTogether} Days Together</span>
        </div>
        
        <button 
          onClick={() => setIsPlaying(!isPlaying)}
          className="glass p-3 rounded-full hover:bg-white/10 transition"
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Music className="w-5 h-5" />}
        </button>
      </div>

      {/* Main Content: Polaroid Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
        {PHOTOS.map((src, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2 }}
            whileHover={{ scale: 1.05, rotate: i % 2 === 0 ? 2 : -2 }}
            className="polaroid rotate-1 md:rotate-[-2deg] even:rotate-[3deg]"
          >
            <img src={src} alt="Us" className="aspect-square object-cover" />
            <p className="polaroid-caption">Memory {i + 1}</p>
          </motion.div>
        ))}
      </div>

      {/* Quotes Section */}
      <div className="text-center h-24 mb-12">
        <AnimatePresence mode="wait">
          <motion.p
            key={currentQuoteIdx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-2xl md:text-3xl font-light italic text-[var(--color-accent)]"
          >
            "{QUOTES[currentQuoteIdx]}"
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Love Letter Button */}
      <div className="flex justify-center pb-20">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowLetter(true)}
          className="px-8 py-4 bg-white/10 border border-[var(--color-primary)] text-white rounded-full font-semibold text-lg flex items-center gap-3 hover:bg-[var(--color-primary)] transition-all"
        >
          <Mail className="w-5 h-5" />
          Read My Letter
        </motion.button>
      </div>

      {/* Love Letter Full Page */}
      <AnimatePresence>
        {showLetter && <LetterPage onClose={() => setShowLetter(false)} />}
      </AnimatePresence>
    </motion.div>
  )
}
