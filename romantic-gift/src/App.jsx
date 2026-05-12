import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import LandingPage from './components/LandingPage'
import PasswordScreen from './components/PasswordScreen'
import CameraPage from './components/CameraPage'
import FloatingEmojis from './components/FloatingEmojis'
import MusicPlayer from './components/MusicPlayer'

function HeartCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 })
  useEffect(() => {
    const move = (e) => setPos({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [])
  return (
    <div className="cursor-heart" style={{ left: pos.x, top: pos.y }}>
      🩷
    </div>
  )
}

function App() {
  const [stage, setStage] = useState('landing')

  return (
    <div className="w-full min-h-screen relative overflow-hidden" style={{ background: 'var(--bg-dark)' }}>
      {/* ── Global ambient light blobs ── */}
      <div className="ambient-blob ambient-blob-1" style={{ zIndex: 0 }} />
      <div className="ambient-blob ambient-blob-2" style={{ zIndex: 0 }} />
      <div className="ambient-blob ambient-blob-3" style={{ zIndex: 0 }} />

      {/* ── Global floating emojis (visible on every page) ── */}
      <FloatingEmojis count={22} />

      {/* ── Heart cursor ── */}
      <HeartCursor />

      {/* ── Pages ── */}
      <AnimatePresence mode="wait">
        {stage === 'landing' && (
          <motion.div
            key="landing"
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.8 }}
            className="relative z-10"
          >
            <LandingPage onNext={() => setStage('password')} />
          </motion.div>
        )}
        {stage === 'password' && (
          <motion.div
            key="password"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-10"
          >
            <PasswordScreen onNext={() => setStage('camera')} />
          </motion.div>
        )}
        {stage === 'camera' && (
          <motion.div
            key="camera"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10"
          >
            <CameraPage />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Global music player (always visible) ── */}
      <MusicPlayer />
    </div>
  )
}

export default App
