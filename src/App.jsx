import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import FloatingHearts from './components/FloatingHearts.jsx'
import MusicButton from './components/MusicButton.jsx'
import Intro from './screens/Intro.jsx'
import TextScreen from './screens/TextScreen.jsx'
import Reasons from './screens/Reasons.jsx'
import Cake from './screens/Cake.jsx'
import Finale from './screens/Finale.jsx'
import { poem, wishes } from './content.js'

// Добавляй новые экраны сюда — навигация и точки подстроятся сами
// (перед Finale, он должен оставаться последним)
// long: true — у экрана есть свой скролл (длинный текст), тогда весь экран
// не перетаскиваем свайпом, чтобы не конфликтовать со скроллом текста —
// переход на такие экраны и с них идёт через точки-индикатор или стрелку «дальше»
const SCREENS = [
  { long: false, render: () => <Intro /> },
  { long: !!poem.long, render: ({ go }) => <TextScreen {...poem} go={go} /> },
  { long: false, render: () => <Reasons /> },
  { long: !!wishes.long, render: ({ go }) => <TextScreen {...wishes} go={go} /> },
  { long: false, render: () => <Cake /> },
  { long: false, render: ({ restart }) => <Finale restart={restart} /> },
]

const variants = {
  enter: (dir) => ({ y: dir > 0 ? '40%' : '-40%', opacity: 0, scale: 0.96 }),
  center: { y: 0, opacity: 1, scale: 1 },
  exit: (dir) => ({ y: dir > 0 ? '-40%' : '40%', opacity: 0, scale: 0.96 }),
}

export default function App() {
  const [[index, dir], setPage] = useState([0, 0])
  const lock = useRef(false)

  const go = useCallback((step) => {
    if (lock.current) return
    setPage(([i]) => {
      const next = i + step
      if (next < 0 || next >= SCREENS.length) return [i, 0]
      lock.current = true
      setTimeout(() => (lock.current = false), 900)
      return [next, step]
    })
  }, [])

  // переход сразу на конкретный экран — для точек-индикатора
  const goTo = useCallback((target) => {
    if (lock.current) return
    setPage(([i]) => {
      if (target === i) return [i, 0]
      lock.current = true
      setTimeout(() => (lock.current = false), 900)
      return [target, target > i ? 1 : -1]
    })
  }, [])

  // «Ещё раз»: плавно возвращаемся к первому экрану (анимация — вниз)
  const restart = useCallback(() => goTo(0), [goTo])

  // Колесо мыши и клавиатура — для десктопа
  useEffect(() => {
    const onWheel = (e) => {
      if (e.target.closest?.('.scrollable')) return // колесо крутит текст, а не экраны
      if (Math.abs(e.deltaY) > 20) go(e.deltaY > 0 ? 1 : -1)
    }
    const onKey = (e) => {
      if (['ArrowDown', 'ArrowRight', 'PageDown'].includes(e.key)) go(1)
      if (['ArrowUp', 'ArrowLeft', 'PageUp'].includes(e.key)) go(-1)
    }
    window.addEventListener('wheel', onWheel, { passive: true })
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('keydown', onKey)
    }
  }, [go])

  const { render: Render, long } = SCREENS[index]

  return (
    <div className="app">
      <div className="bg" />
      <FloatingHearts count={10} />

      <AnimatePresence initial={false} custom={dir} mode="popLayout">
        <motion.div
          key={index}
          className="page"
          custom={dir}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          // на «длинных» экранах драг выключен — иначе он конфликтует
          // со скроллом текста внутри карточки на телефоне
          drag={long ? false : 'y'}
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={0.25}
          onDragEnd={(_, { offset, velocity }) => {
            if (offset.y < -60 || velocity.y < -400) go(1)
            else if (offset.y > 60 || velocity.y > 400) go(-1)
          }}
        >
          <Render restart={restart} go={go} />
        </motion.div>
      </AnimatePresence>

      <div className="dots">
        {SCREENS.map((_, i) => (
          <button
            key={i}
            className={i === index ? 'dot active' : 'dot'}
            aria-label={`Экран ${i + 1}`}
            onClick={() => goTo(i)}
          />
        ))}
      </div>

      <MusicButton />
    </div>
  )
}
