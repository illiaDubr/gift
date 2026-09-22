import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const COLORS = ['#ff5c8a', '#ffd166', '#ffffff', '#ff8fb1', '#9be7ff', '#c2185b']
const PARTICLES = 20

function Burst({ x, y, color }) {
  return (
    <div className="fw-burst" style={{ left: `${x}%`, top: `${y}%` }}>
      {Array.from({ length: PARTICLES }, (_, i) => {
        const a = (i / PARTICLES) * Math.PI * 2
        const d = 70 + Math.random() * 40
        return (
          <motion.span
            key={i}
            className="fw-dot"
            style={{ background: color, boxShadow: `0 0 8px ${color}` }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{
              x: Math.cos(a) * d,
              y: Math.sin(a) * d + 24, // лёгкое падение вниз
              opacity: 0,
              scale: 0.3,
            }}
            transition={{ duration: 1.4, ease: 'easeOut' }}
          />
        )
      })}
    </div>
  )
}

// Салют: новые залпы в случайных местах, старые удаляются
export default function Fireworks() {
  const [bursts, setBursts] = useState([])

  useEffect(() => {
    let id = 0
    const launch = () => {
      const b = {
        id: id++,
        x: 12 + Math.random() * 76,
        y: 8 + Math.random() * 45,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      }
      setBursts((prev) => [...prev.slice(-5), b])
    }
    launch()
    const t = setInterval(launch, 650)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="fireworks" aria-hidden="true">
      {bursts.map((b) => (
        <Burst key={b.id} {...b} />
      ))}
    </div>
  )
}
