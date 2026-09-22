import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import HeartBurst from '../components/HeartBurst.jsx'
import { reasons } from '../content.js'

export default function Reasons() {
  const [idx, setIdx] = useState(-1) // -1 = ещё ничего не показано
  const [burst, setBurst] = useState(0)

  const total = reasons.list.length
  const finished = idx >= total

  const next = (e) => {
    e.stopPropagation()
    setIdx((i) => (i >= total ? 0 : i + 1)) // после последней и «конца» — по кругу
    setBurst((b) => b + 1)
  }

  const text = idx < 0 ? reasons.start : finished ? reasons.end : reasons.list[idx]

  return (
    <div className="screen reasons">
      <h2>{reasons.title}</h2>

      <div className="reason-stage">
        <AnimatePresence mode="wait">
          <motion.div
            key={idx}
            className="reason-card"
            initial={{ opacity: 0, y: 50, scale: 0.85, rotate: -3 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, y: -50, scale: 0.9, rotate: 3 }}
            transition={{ type: 'spring', stiffness: 220, damping: 20 }}
          >
            {idx >= 0 && !finished && <span className="reason-num">{idx + 1}</span>}
            <p>{text}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="reason-action">
        <HeartBurst burstKey={burst} />
        <motion.button
          className="big-heart"
          onClick={next}
          whileTap={{ scale: 0.85 }}
          animate={{ scale: [1, 1.08, 1, 1.12, 1] }}
          transition={{ duration: 2, repeat: Infinity, times: [0, 0.15, 0.3, 0.45, 1] }}
          aria-label="Показать причину"
        >
          ♥
        </motion.button>
      </div>

      <p className="reason-count">
        {idx >= 0 && !finished ? `${idx + 1} из ${total}` : reasons.tap}
      </p>
    </div>
  )
}
