import { useLayoutEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

// Контур сердца в системе 200x200, масштабируется относительно центра (100, 105)
const P = (x, y, s) => `${(100 + (x - 100) * s).toFixed(2)} ${(105 + (y - 105) * s).toFixed(2)}`

const heartPath = (s) =>
  `M${P(100, 175, s)} ` +
  `C${P(20, 115, s)} ${P(10, 55, s)} ${P(55, 35, s)} ` +
  `C${P(80, 24, s)} ${P(100, 40, s)} ${P(100, 55, s)} ` +
  `C${P(100, 40, s)} ${P(120, 24, s)} ${P(145, 35, s)} ` +
  `C${P(190, 55, s)} ${P(180, 115, s)} ${P(100, 175, s)} Z`

// Кольца из слов: масштаб, размер шрифта, задержка появления
const RINGS = [
  { s: 1, size: 9.5, delay: 0.1 },
  { s: 0.76, size: 8, delay: 0.5 },
  { s: 0.52, size: 6.5, delay: 0.9 },
]

function Ring({ id, s, size, delay, words }) {
  const pathRef = useRef(null)
  const [len, setLen] = useState(0)
  const d = heartPath(s)

  useLayoutEffect(() => {
    if (pathRef.current) setLen(pathRef.current.getTotalLength())
  }, [d])

  const unit = `${words}  `
  const repeat = len ? Math.max(1, Math.round(len / (size * 0.5 * unit.length))) : 1
  const text = unit.repeat(repeat)

  return (
    <motion.g
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      style={{ transformOrigin: '100px 105px' }}
    >
      <path id={id} ref={pathRef} d={d} fill="none" />
      <text className="heart-word" fontSize={size}>
        <textPath
          href={`#${id}`}
          textLength={len || undefined}
          lengthAdjust="spacing"
        >
          {text}
        </textPath>
      </text>
    </motion.g>
  )
}

export default function HeartText({ words, inside }) {
  return (
    <motion.svg
      className="heart-svg"
      viewBox="0 0 200 200"
      animate={{ scale: [1, 1.035, 1, 1.05, 1] }}
      transition={{
        duration: 2.4,
        times: [0, 0.15, 0.3, 0.45, 1],
        repeat: Infinity,
        delay: 2,
        ease: 'easeInOut',
      }}
    >
      <defs>
        <linearGradient id="heartGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ff5c8a" />
          <stop offset="1" stopColor="#c2185b" />
        </linearGradient>
      </defs>

      {RINGS.map((r, i) => (
        <Ring key={i} id={`ring-${i}`} words={words} {...r} />
      ))}

      <motion.text
        className="heart-inside"
        textAnchor="middle"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        <tspan x="100" y="98" fontSize="17">{inside[0]}</tspan>
        <tspan x="100" y="117" fontSize="19">{inside[1]}</tspan>
      </motion.text>
    </motion.svg>
  )
}
