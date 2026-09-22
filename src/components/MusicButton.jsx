import { useEffect, useRef, useState } from 'react'
import { musicSrc } from '../content.js'

// Браузеры запрещают автоплей, поэтому музыка стартует с первого касания/клика
export default function MusicButton() {
  const audioRef = useRef(null)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    const audio = audioRef.current
    const start = () => {
      audio.play().then(() => setPlaying(true)).catch(() => {})
      remove()
    }
    const events = ['click', 'touchend', 'keydown']
    const remove = () => events.forEach((e) => window.removeEventListener(e, start))
    events.forEach((e) => window.addEventListener(e, start, { once: true }))
    return remove
  }, [])

  const toggle = (e) => {
    e.stopPropagation()
    const audio = audioRef.current
    if (audio.paused) {
      audio.play().then(() => setPlaying(true)).catch(() => {})
    } else {
      audio.pause()
      setPlaying(false)
    }
  }

  return (
    <>
      <audio ref={audioRef} src={musicSrc} loop preload="auto" />
      <button
        className={`music-btn ${playing ? 'on' : ''}`}
        onClick={toggle}
        aria-label={playing ? 'Выключить музыку' : 'Включить музыку'}
      >
        <span className="note">♪</span>
        {!playing && <span className="slash" />}
      </button>
    </>
  )
}
