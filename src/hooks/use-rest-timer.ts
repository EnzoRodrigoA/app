import * as Haptics from "expo-haptics"
import { useCallback, useEffect, useRef, useState } from "react"

interface UseRestTimerReturn {
  isResting: boolean
  restTimeLeft: number
  startRestTimer: (seconds: number) => void
  skipRest: () => void
}

/**
 * Hook para gerenciar o timer de descanso entre séries
 */
export function useRestTimer(): UseRestTimerReturn {
  const [isResting, setIsResting] = useState(false)
  const [restTimeLeft, setRestTimeLeft] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const startRestTimer = useCallback(
    (seconds: number) => {
      setIsResting(true)
      setRestTimeLeft(seconds)
      clearTimer()

      timerRef.current = setInterval(() => {
        setRestTimeLeft((prev) => {
          if (prev <= 1) {
            clearTimer()
            setIsResting(false)
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    },
    [clearTimer]
  )

  const skipRest = useCallback(() => {
    clearTimer()
    setIsResting(false)
    setRestTimeLeft(0)
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
  }, [clearTimer])

  // Cleanup on unmount
  useEffect(() => {
    return clearTimer
  }, [clearTimer])

  return {
    isResting,
    restTimeLeft,
    startRestTimer,
    skipRest
  }
}
