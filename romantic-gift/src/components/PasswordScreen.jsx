import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Delete } from 'lucide-react'


export default function PasswordScreen({ onNext }) {
  const [passcode, setPasscode] = useState('')
  const [isError, setIsError] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const CORRECT_PASS = '1204'

  const handlePress = (num) => {
    if (passcode.length < 4 && !isSuccess) {
      const newPass = passcode + num
      setPasscode(newPass)
      if (newPass.length === 4) {
        if (newPass === CORRECT_PASS) {
          setIsSuccess(true)
          setTimeout(onNext, 2000)
        } else {
          setIsError(true)
          setTimeout(() => { setPasscode(''); setIsError(false) }, 700)
        }
      }
    }
  }

  const handleDelete = () => {
    if (!isSuccess) setPasscode(prev => prev.slice(0, -1))
  }

  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0, 'del']

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0015] via-[#1e0030] to-[#0a0015]" />
      <motion.div
        animate={{ scale: [1, 1.3, 1], opacity: [0.25, 0.4, 0.25] }}
        transition={{ duration: 5, repeat: Infinity }}
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, #ff4fa350 0%, transparent 65%)', filter: 'blur(40px)' }}
      />


      {/* Heart burst on success */}
      <AnimatePresence>
        {isSuccess && (
          <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center">
            {[...Array(40)].map((_, i) => {
              const angle = (i / 40) * 360
              const dist = 150 + Math.random() * 200
              const rad = (angle * Math.PI) / 180
              return (
                <motion.div
                  key={i}
                  initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
                  animate={{
                    x: Math.cos(rad) * dist,
                    y: Math.sin(rad) * dist,
                    scale: [0, 1.5, 0],
                    opacity: [1, 1, 0],
                  }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                  className="absolute text-2xl"
                >
                  {['💖', '💕', '🩷', '✨'][i % 4]}
                </motion.div>
              )
            })}
          </div>
        )}
      </AnimatePresence>

      {/* Main Card */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 flex flex-col items-center"
      >
        {/* Top emoji */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-6xl mb-6"
        >
          💌
        </motion.div>

        {/* Title */}
        <h2
          className="text-2xl md:text-3xl text-center mb-8 glow-text font-semibold"
          style={{ fontFamily: 'var(--font-serif)', color: '#ffb3d1' }}
        >
          Enter Our Secret Password 💖
        </h2>

        {/* Glass card keypad */}
        <div
          className="glass rounded-[2.5rem] p-8 md:p-12 flex flex-col items-center gap-8"
          style={{ boxShadow: '0 0 60px rgba(255,79,163,0.2), inset 0 1px 1px rgba(255,255,255,0.1)' }}
        >
          {/* Dot indicators */}
          <motion.div
            animate={isError ? { x: [-12, 12, -12, 12, 0] } : {}}
            transition={{ duration: 0.4 }}
            className="flex gap-5"
          >
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                animate={
                  i < passcode.length
                    ? isSuccess
                      ? { scale: [1, 1.5, 1], backgroundColor: '#ff6b9d' }
                      : { scale: 1.1 }
                    : { scale: 1 }
                }
                transition={{ duration: 0.3 }}
                className="w-4 h-4 rounded-full border-2 border-[#ff6b9d]/60 transition-colors duration-200"
                style={{
                  backgroundColor: i < passcode.length ? '#ff6b9d' : 'transparent',
                  boxShadow: i < passcode.length ? '0 0 12px #ff6b9d' : 'none',
                }}
              />
            ))}
          </motion.div>

          {/* Keypad grid */}
          <div className="grid grid-cols-3 gap-4">
            {numbers.map((num, i) => {
              if (num === '') return <div key={i} className="w-[70px] h-[70px]" />
              if (num === 'del') return (
                <motion.button
                  key="del"
                  whileTap={{ scale: 0.88 }}
                  onClick={handleDelete}
                  className="w-[70px] h-[70px] rounded-full flex items-center justify-center text-[#ffb3d1]/70 hover:text-white transition-colors"
                >
                  <Delete size={24} />
                </motion.button>
              )
              return (
                <motion.button
                  key={num}
                  whileTap={{ scale: 0.88, backgroundColor: 'rgba(255,107,157,0.3)' }}
                  whileHover={{ scale: 1.05, borderColor: 'rgba(255,107,157,0.6)' }}
                  onClick={() => handlePress(String(num))}
                  className="w-[70px] h-[70px] rounded-full text-white text-2xl font-light flex items-center justify-center transition-all"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,107,157,0.2)',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  {num}
                </motion.button>
              )
            })}
          </div>
        </div>

        {/* Status text */}
        <AnimatePresence mode="wait">
          {isError && (
            <motion.p
              initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="mt-4 text-[#ff4fa3] text-sm tracking-wider"
            >
              Hmm, that's not right 🥺
            </motion.p>
          )}
          {isSuccess && (
            <motion.p
              initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
              className="mt-4 text-[#ffb3d1] text-sm tracking-wider"
              style={{ fontFamily: 'var(--font-hand)' }}
            >
              Come In, Ishita 💖
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
