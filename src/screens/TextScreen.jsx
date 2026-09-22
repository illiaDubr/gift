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
          className="next-hint"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 1 }}
          onClick={(e) => {
            e.stopPropagation()
            go?.(1)
          }}
          aria-label="Дальше"
        >
          <motion.span
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          >
            ⌄
          </motion.span>
          дальше
        </motion.button>
      )}
    </div>
  )
}
