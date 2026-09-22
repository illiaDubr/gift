import { motion } from 'framer-motion'

// Универсальный текстовый экран: заголовок + карточка со строками.
// На «длинных» экранах свайп по всему экрану выключен (см. App.jsx),
// поэтому добавляем стрелку — понятный способ пойти дальше с телефона.
export default function TextScreen({ title, lines, long = false, go }) {
  return (
    <div className="screen poem">
      <motion.h2
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.9 }}
      >
        {title}
      </motion.h2>

      <div
        className={long ? 'poem-card long scrollable' : 'poem-card'}
        // внутри длинной карточки жест — это прокрутка, а не перелистывание экрана
        onPointerDown={long ? (e) => e.stopPropagation() : undefined}
      >
        {lines.map((line, i) =>
          line === '' ? (
            <div key={i} className="gap" />
          ) : (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 14, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ delay: 0.8 + i * 0.35, duration: 0.9 }}
            >
              {line}
            </motion.p>
          ),
        )}
      </div>

      {long && (
        <motion.button
          className="again-btn next-btn"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.9 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => {
            e.stopPropagation()
            go?.(1)
          }}
        >
          дальше
          <motion.span
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          >
            ⌄
          </motion.span>
        </motion.button>
      )}
    </div>
  )
}
