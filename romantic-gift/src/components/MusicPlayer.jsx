import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import khatSong from '../assets/Navjot Ahuja - Khat (Lyrical Video) (online-video-cutter.com).mp3'

const SONG_TITLE = 'Khat 💌'
const SONG_ARTIST = 'Navjot Ahuja'

export default function MusicPlayer() {
  const audioRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [isOpen, setIsOpen] = useState(false)
  const [autoplayBlocked, setAutoplayBlocked] = useState(false)

  // ── Attempt autoplay on mount; fall back to first-interaction start ──
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.volume = volume

    const tryPlay = () => {
      audio.play()
        .then(() => {
          setIsPlaying(true)
          setAutoplayBlocked(false)
          // Remove the listener once we have played
          document.removeEventListener('click', tryPlay)
          document.removeEventListener('touchstart', tryPlay)
        })
        .catch(() => {
          // Autoplay blocked — wait for first user gesture
          setAutoplayBlocked(true)
        })
    }

    // Try immediately (works in some browsers / localhost)
    tryPlay()

    // Also hook into first user interaction as fallback
    document.addEventListener('click', tryPlay, { once: true })
    document.addEventListener('touchstart', tryPlay, { once: true })

    return () => {
      document.removeEventListener('click', tryPlay)
      document.removeEventListener('touchstart', tryPlay)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Progress + metadata events ──
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateProgress = () => {
      if (audio.duration) setProgress((audio.currentTime / audio.duration) * 100)
    }
    const onLoaded = () => setDuration(audio.duration)
    const onEnded  = () => setIsPlaying(false)

    audio.addEventListener('timeupdate',    updateProgress)
    audio.addEventListener('loadedmetadata', onLoaded)
    audio.addEventListener('ended',          onEnded)
    return () => {
      audio.removeEventListener('timeupdate',    updateProgress)
      audio.removeEventListener('loadedmetadata', onLoaded)
      audio.removeEventListener('ended',          onEnded)
    }
  }, [])

  const togglePlay = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else {
      audio.play().then(() => {
        setIsPlaying(true)
        setAutoplayBlocked(false)
      }).catch(() => {})
    }
  }, [isPlaying])

  const seek = (e) => {
    const audio = audioRef.current
    if (!audio || !audio.duration) return
    const rect  = e.currentTarget.getBoundingClientRect()
    const ratio = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1)
    audio.currentTime = ratio * audio.duration
    setProgress(ratio * 100)
  }

  const handleVolumeChange = (e) => {
    const v = parseFloat(e.target.value)
    setVolume(v)
    if (audioRef.current) audioRef.current.volume = v
  }

  const fmt = (s) => {
    if (!s || isNaN(s)) return '0:00'
    const m   = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  const currentTime = duration ? (progress / 100) * duration : 0

  return (
    <>
      <audio ref={audioRef} src={khatSong} preload="auto" loop />

      {/* ── "Tap to play" hint when autoplay was blocked ── */}
      <AnimatePresence>
        {autoplayBlocked && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.5 }}
            className="fixed bottom-24 right-4 z-[9996] px-4 py-2 rounded-full text-xs text-[#ffb3d1] pointer-events-none"
            style={{
              background: 'rgba(255,107,157,0.12)',
              border: '1px solid rgba(255,107,157,0.25)',
              backdropFilter: 'blur(12px)',
            }}
          >
            🎵 Tap anywhere to start music
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Floating music button ── */}
      <motion.button
        onClick={() => { setIsOpen(o => !o); if (autoplayBlocked) togglePlay() }}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.2, type: 'spring', stiffness: 200 }}
        whileHover={{ scale: 1.12 }}
        whileTap={{ scale: 0.93 }}
        className="fixed bottom-6 right-6 z-[9998] w-14 h-14 rounded-full flex items-center justify-center text-2xl"
        style={{
          background: 'linear-gradient(135deg, #ff4fa3, #e91e8c)',
          boxShadow: '0 0 24px rgba(255,79,163,0.7), 0 0 48px rgba(255,79,163,0.3)',
        }}
        aria-label="Music player"
      >
        <motion.span
          animate={isPlaying ? { rotate: [0, 15, -15, 0] } : {}}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          🎵
        </motion.span>
        {/* Live pulse ring when playing */}
        {isPlaying && (
          <motion.div
            className="absolute inset-0 rounded-full"
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 1.8, repeat: Infinity }}
            style={{ border: '2px solid rgba(255,107,157,0.6)', zIndex: -1 }}
          />
        )}
      </motion.button>

      {/* ── Player panel ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            className="fixed bottom-24 right-4 z-[9997] w-[320px] max-w-[calc(100vw-2rem)] rounded-[2rem] overflow-hidden"
            style={{
              background: 'linear-gradient(160deg, rgba(255,107,157,0.18) 0%, rgba(192,132,252,0.12) 50%, rgba(255,79,163,0.14) 100%)',
              backdropFilter: 'blur(28px)',
              WebkitBackdropFilter: 'blur(28px)',
              border: '1px solid rgba(255,107,157,0.3)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,107,157,0.15), inset 0 1px 1px rgba(255,255,255,0.08)',
            }}
          >
            {/* Top glow strip */}
            <div
              className="absolute top-0 left-0 right-0 h-[2px]"
              style={{ background: 'linear-gradient(90deg, transparent, #ff6b9d, #c084fc, #ff6b9d, transparent)' }}
            />

            <div className="p-6 flex flex-col gap-5">
              {/* Header */}
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs text-[#ffb3d1]/60 tracking-widest uppercase mb-0.5">Now Playing</p>
                  <h3
                    className="text-lg font-semibold text-[#ffb3d1] leading-tight truncate"
                    style={{ fontFamily: 'var(--font-serif)', textShadow: '0 0 12px rgba(255,107,157,0.6)' }}
                  >
                    {SONG_TITLE}
                  </h3>
                  <p className="text-xs text-[#ffb3d1]/50 mt-0.5 truncate" style={{ fontFamily: 'var(--font-caveat)', fontSize: '0.85rem' }}>
                    {SONG_ARTIST}
                  </p>
                </div>
                {/* Animated vinyl disc */}
                <motion.div
                  animate={isPlaying ? { rotate: 360 } : {}}
                  transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                  className="w-14 h-14 rounded-full flex items-center justify-center text-2xl flex-shrink-0"
                  style={{
                    background: 'radial-gradient(circle at 40% 40%, #ff6b9d, #c2185b)',
                    boxShadow: isPlaying ? '0 0 24px rgba(255,107,157,0.7)' : '0 0 12px rgba(255,107,157,0.3)',
                  }}
                >
                  💿
                </motion.div>
              </div>

              {/* Progress bar */}
              <div className="flex flex-col gap-2">
                <div
                  className="relative h-2 rounded-full cursor-pointer"
                  style={{ background: 'rgba(255,107,157,0.15)', border: '1px solid rgba(255,107,157,0.2)' }}
                  onClick={seek}
                >
                  <div
                    className="absolute top-0 left-0 h-full rounded-full transition-all duration-200"
                    style={{
                      width: `${progress}%`,
                      background: 'linear-gradient(90deg, #ff4fa3, #c084fc)',
                      boxShadow: '0 0 8px rgba(255,79,163,0.7)',
                    }}
                  />
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full transition-all duration-200"
                    style={{
                      left: `calc(${progress}% - 6px)`,
                      background: '#ff6b9d',
                      boxShadow: '0 0 8px rgba(255,107,157,0.9)',
                    }}
                  />
                </div>
                <div className="flex justify-between text-xs text-[#ffb3d1]/50">
                  <span>{fmt(currentTime)}</span>
                  <span>{fmt(duration)}</span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-4">
                {/* ◁◁ -10s */}
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  onClick={() => { if (audioRef.current) audioRef.current.currentTime -= 10 }}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-[#ffb3d1]/70 hover:text-[#ffb3d1] transition-colors"
                  style={{ background: 'rgba(255,107,157,0.08)', border: '1px solid rgba(255,107,157,0.15)' }}
                  title="Rewind 10s"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/>
                  </svg>
                </motion.button>

                {/* ▶ / ⏸ */}
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={togglePlay}
                  className="w-14 h-14 rounded-full flex items-center justify-center text-white relative"
                  style={{
                    background: 'linear-gradient(135deg, #ff4fa3, #e91e8c)',
                    boxShadow: '0 0 20px rgba(255,79,163,0.6), 0 0 40px rgba(255,79,163,0.2)',
                  }}
                >
                  {isPlaying ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                      <rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/>
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="white" style={{ marginLeft: 2 }}>
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  )}
                  {isPlaying && (
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0, 0.3] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      style={{ background: 'radial-gradient(circle, #ff4fa3, transparent)', zIndex: -1 }}
                    />
                  )}
                </motion.button>

                {/* ▷▷ +10s */}
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  onClick={() => { if (audioRef.current) audioRef.current.currentTime += 10 }}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-[#ffb3d1]/70 hover:text-[#ffb3d1] transition-colors"
                  style={{ background: 'rgba(255,107,157,0.08)', border: '1px solid rgba(255,107,157,0.15)' }}
                  title="Forward 10s"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 5V1l5 5-5 5V7c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6h2c0 4.42-3.58 8-8 8s-8-3.58-8-8 3.58-8 8-8z"/>
                  </svg>
                </motion.button>
              </div>

              {/* Volume */}
              <div className="flex items-center gap-3">
                <span className="text-sm">🔈</span>
                <div className="relative flex-1 h-1.5 rounded-full" style={{ background: 'rgba(255,107,157,0.15)' }}>
                  <input
                    type="range" min="0" max="1" step="0.01"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="absolute inset-0 w-full opacity-0 cursor-pointer h-full z-10"
                  />
                  <div
                    className="h-full rounded-full pointer-events-none"
                    style={{
                      width: `${volume * 100}%`,
                      background: 'linear-gradient(90deg, #ff4fa3, #c084fc)',
                      boxShadow: '0 0 6px rgba(255,79,163,0.6)',
                    }}
                  />
                </div>
                <span className="text-sm">🔊</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
