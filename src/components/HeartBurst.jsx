import { useMemo } from 'react'
import { motion } from 'framer-motion'

const SYMBOLS = ['♥', '♡', '❤', '✦']
const COLORS = ['#ff5c8a', '#ff8fb1', '#c2185b', '#ffb3cb', '#ff3d77']

// Конфетти из сердечек. Меняй burstKey, чтобы запустить новый взрыв; рисуется из центра родителя.
export default function HeartBurst({ burstKey, count = 18, spread = 150 }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const angle = (i / count) * Math.PI * 2 + Math.random() * 0.4
        const dist = spread * (0.5 + Math.random() * 0.7)
        return {
          x: Math.cos(angle) * dist,
          y: Math.sin(angle) * dist - 30,
          rotate: (Math.random() - 0.5) * 300,
          size: 14 + Math.random() * 16,
          symbol: SYMBOLS[i % SYMBOLS.length],
          color: COLORS[i % COLORS.length],
        }
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [burstKey, count, spread],
  )

  if (!burstKey) return null

  return (
    <div className="burst-root" key={burstKey} aria-hidden="true">
      {pieces.map((p, i) => (
        <motion.span
          key={i}
          className="burst-piece"
          style={{ fontSize: p.size, color: p.color }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 0.3 }}
          animate={{ x: p.x, y: p.y + 70, opacity: 0, scale: 1.1, rotate: p.rotate }}
          transition={{ duration: 1.4, ease: 'easeOut' }}
        >
          {p.symbol}
        </motion.span>
      ))}
    </div>
  )
}
