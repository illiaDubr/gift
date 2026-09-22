import { useMemo } from 'react'
import { motion } from 'framer-motion'

const SYMBOLS = ['♡', '♥', '✦', '❀']

// Мягкий фон: медленно всплывающие сердечки и искорки
export default function FloatingHearts({ count = 16 }) {
  const items = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 12 + Math.random() * 22,
        duration: 9 + Math.random() * 9,
        delay: -Math.random() * 14,
        drift: (Math.random() - 0.5) * 60,
        symbol: SYMBOLS[i % SYMBOLS.length],
        opacity: 0.25 + Math.random() * 0.35,
      })),
    [count],
  )

  return (
    <div className="floaters" aria-hidden="true">
      {items.map((h) => (
        <motion.span
          key={h.id}
          className="floater"
          style={{ left: `${h.left}%`, fontSize: h.size }}
          initial={{ y: '110vh', x: 0, opacity: 0 }}
          animate={{
            y: '-15vh',
            x: [0, h.drift, -h.drift, 0],
            opacity: [0, h.opacity, h.opacity, 0],
            rotate: [-10, 10, -10],
          }}
          transition={{
            duration: h.duration,
            delay: h.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          {h.symbol}
        </motion.span>
      ))}
    </div>
  )
}
