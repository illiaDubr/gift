import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Fireworks from '../components/Fireworks.jsx'
import { cake } from '../content.js'

const CANDLES = [78, 114, 150, 186, 222] // x-координаты свечей в viewBox 300x260

const BLOW_LEVEL = 0.12 // громкость (RMS), выше которой считаем, что дуешь
const BLOW_MS = 260 // сколько «дуновения» нужно, чтобы погасить одну свечу

export default function Cake() {
  const [lit, setLit] = useState(CANDLES.map(() => true))
  const [micOn, setMicOn] = useState(false)
  const [micError, setMicError] = useState(false)
  const micRef = useRef(null)

  const done = lit.every((l) => !l)

  const snuff = (i) =>
    setLit((prev) => (prev[i] ? prev.map((l, k) => (k === i ? false : l)) : prev))

  // погасить самую левую ещё горящую свечу
  const snuffNext = () =>
    setLit((prev) => {
      const i = prev.indexOf(true)
      return i === -1 ? prev : prev.map((l, k) => (k === i ? false : l))
    })

  // свайп/касание по огонькам гасит их
  const onPointerMove = (e) => {
    const el = document.elementFromPoint(e.clientX, e.clientY)?.closest('[data-candle]')
    if (el) snuff(Number(el.dataset.candle))
  }

  const startMic = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        // без обработки — иначе браузер вырежет дыхание как шум
        audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
      })
      const ctx = new (window.AudioContext || window.webkitAudioContext)()
      const analyser = ctx.createAnalyser()
      analyser.fftSize = 512
      ctx.createMediaStreamSource(stream).connect(analyser)
      const buf = new Uint8Array(analyser.fftSize)

      let raf
      let acc = 0
      let last = performance.now()
      const tick = (now) => {
        analyser.getByteTimeDomainData(buf)
        let sum = 0
        for (let i = 0; i < buf.length; i++) {
          const v = (buf[i] - 128) / 128
          sum += v * v
        }
        const rms = Math.sqrt(sum / buf.length)
        acc = rms > BLOW_LEVEL ? acc + (now - last) : Math.max(0, acc - (now - last))
        last = now
        if (acc >= BLOW_MS) {
          acc = 0
          snuffNext()
        }
        raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)

      micRef.current = () => {
        cancelAnimationFrame(raf)
        stream.getTracks().forEach((t) => t.stop())
        ctx.close()
      }
      setMicOn(true)
    } catch {
      setMicError(true)
    }
  }

  // выключаем микрофон, когда свечи погашены или экран закрыт
  useEffect(() => {
    if (done && micRef.current) {
      micRef.current()
      micRef.current = null
      setMicOn(false)
    }
  }, [done])
  useEffect(() => () => micRef.current?.(), [])

  return (
    <div className="screen cake" onPointerMove={onPointerMove}>
      <AnimatePresence mode="wait">
        {!done ? (
          <motion.h2 key="t1" exit={{ opacity: 0 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {cake.title}
          </motion.h2>
        ) : (
          <motion.h2
            key="t2"
            className="bday"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 160, damping: 12, delay: 0.3 }}
          >
            {cake.congrats}
          </motion.h2>
        )}
      </AnimatePresence>

      <svg className="cake-svg" viewBox="0 0 300 260">
        {/* тарелка */}
        <ellipse cx="150" cy="238" rx="135" ry="14" fill="#fff" opacity="0.8" />
        {/* нижний ярус */}
        <rect x="35" y="168" width="230" height="68" rx="14" fill="#ff9ebb" />
        <path d="M35 190 q19 18 38 0 t38 0 t38 0 t38 0 t38 0 t38 0 v-22 h-230z" fill="#fff5f8" />
        {/* верхний ярус */}
        <rect x="62" y="118" width="176" height="56" rx="12" fill="#ffc2d6" />
        <path d="M62 138 q14.6 14 29.3 0 t29.3 0 t29.3 0 t29.3 0 t29.3 0 t29.3 0 v-20 h-176z" fill="#fff5f8" />
        {/* вишенки */}
        {[90, 130, 170, 210].map((x) => (
          <circle key={x} cx={x} cy="158" r="5" fill="#c2185b" />
        ))}

        {CANDLES.map((x, i) => (
          <g key={x}>
            <rect x={x - 4} y="82" width="8" height="38" rx="3" fill={i % 2 ? '#ffd166' : '#9be7ff'} />
            <rect x={x - 4} y="92" width="8" height="4" fill="#fff" opacity="0.7" />
            <AnimatePresence>
              {lit[i] && (
                <motion.g
                  key="flame"
                  exit={{ opacity: 0, y: -12, scale: 0.4 }}
                  transition={{ duration: 0.4 }}
                >
                  <motion.ellipse
                    cx={x}
                    cy="70"
                    rx="6"
                    ry="11"
                    fill="#ffb300"
                    style={{ transformOrigin: `${x}px 82px`, filter: 'drop-shadow(0 0 6px #ffcf66)' }}
                    animate={{ scaleY: [1, 1.15, 0.92, 1.1, 1], rotate: [-4, 4, -3, 3, -4] }}
                    transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.13 }}
                  />
                  <ellipse cx={x} cy="74" rx="3" ry="6" fill="#fff3b0" />
                  {/* увеличенная область касания для свайпа */}
                  <circle cx={x} cy="72" r="20" fill="transparent" data-candle={i} onClick={() => snuff(i)} />
                </motion.g>
              )}
            </AnimatePresence>
            {/* дымок */}
            {!lit[i] && (
              <motion.path
                d={`M${x} 78 q6 -10 0 -20 q-6 -10 0 -20`}
                stroke="#fff"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
                initial={{ opacity: 0.8, pathLength: 0 }}
                animate={{ opacity: 0, pathLength: 1, y: -14 }}
                transition={{ duration: 1.6 }}
              />
            )}
          </g>
        ))}
      </svg>

      {!done && (
        <div className="cake-controls">
          {!micOn && !micError && (
            <button className="again-btn small" onClick={startMic}>
              {cake.micButton}
            </button>
          )}
          <p className="cake-hint">
            {micOn ? cake.blowHint : micError ? cake.micDenied : cake.swipeHint}
          </p>
        </div>
      )}

      {done && (
        <>
          <Fireworks />
          <motion.p
            className="cake-sub"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 1 }}
          >
            {cake.wish}
          </motion.p>
        </>
      )}
    </div>
  )
}
