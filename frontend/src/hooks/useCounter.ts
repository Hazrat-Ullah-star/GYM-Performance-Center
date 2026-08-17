import { useState, useEffect } from 'react'

export const useCounter = (end: number, duration: number = 2000, trigger: boolean = true) => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!trigger) return

    let startTimestamp: number | null = null
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp
      const progress = Math.min((timestamp - startTimestamp) / duration, 1)
      setCount(Math.floor(progress * end))

      if (progress < 1) {
        window.requestAnimationFrame(step)
      }
    }

    window.requestAnimationFrame(step)
  }, [end, duration, trigger])

  return count
}
