import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { finale } from '../content.js'

const BURST = 22

// Пасхалка: спрятанное сердечко — при касании взрывается конфетти и показывает тайное послание
function SecretHeart() {
  const [burst, setBurst] = useState(0)

  return (
    <>
      <motion.button
        className="secret-heart"
        aria-label="секрет"
        whileTap={{ scale: 1.6 }}
        onClick={(e) => {
          e.stopPropagation()
          setBurst((n) => n + 1)
        }}
      >
        ♡
      </motion.button>

      <AnimatePresence>
        {burst > 0 && (
          <motion.div
            key={burst}
            className="secret-layer"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {Array.from({ length: BURST }, (_, i) => {
              const angle = (i / BURST) * Math.PI * 2
              const dist = 90 + Math.random() * 140
              return (
                <motion.span
                  key={i}
                  className="burst-piece"
                  initial={{ x: 0, y: 0, opacity: 1, scale: 0.4 }}
                  animate={{
                    x: Math.cos(angle) * dist,
                    y: Math.sin(angle) * dist + 60,
                    opacity: 0,
                    scale: 1.2,
                    rotate: (Math.random() - 0.5) * 240,
                  }}
                  transition={{ duration: 1.6, ease: 'easeOut' }}
                >
                  {['♥', '♡', '✦'][i % 3]}
                </motion.span>
              )
            })}
            <motion.p
              className="secret-msg"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: [0, 1, 1, 0], scale: 1 }}
              transition={{ duration: 3.6, times: [0, 0.15, 0.8, 1] }}
              onAnimationComplete={() => setBurst(0)}
            >
              {finale.secret}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default function Finale({ restart }) {
  return (
    <div className="screen finale">
      <motion.div
        className="finale-heart"
        animate={{ scale: [1, 1.12, 1, 1.16, 1] }}
        transition={{ duration: 2.2, repeat: Infinity, times: [0, 0.15, 0.3, 0.45, 1] }}
      >
        ♥
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 1 }}
      >
        {finale.title}
      </motion.h2>

      <motion.p
        className="finale-sub"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
      >
        {finale.subtitle}
      </motion.p>

      <motion.button
        className="again-btn"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.9 }}
        whileTap={{ scale: 0.95 }}
        onClick={(e) => {
          e.stopPropagation()
          restart()
        }}
      >
        {finale.again}
      </motion.button>

      <SecretHeart />
    </div>
  )
}
