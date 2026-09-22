import { motion } from 'framer-motion'
import HeartText from '../components/HeartText.jsx'
import { heart } from '../content.js'

export default function Intro() {
  return (
    <div className="screen intro">
      <HeartText words={heart.words} inside={heart.inside} />
      <motion.div
        className="hint"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.6, duration: 1 }}
      >
        <motion.span
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          ⌃
        </motion.span>
        <span>{heart.hint}</span>
      </motion.div>
    </div>
  )
}
