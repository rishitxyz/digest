import { useCallback, useRef } from 'react'
import { Animated, NativeScrollEvent, NativeSyntheticEvent } from 'react-native'

/**
 * Custom hook for scroll-based FAB animation.
 * Returns an animated value (0 = expanded, 1 = collapsed)
 * and an onScroll handler to attach to a scrollable view.
 */
export function useScrollAnimation() {
  const scrollY = useRef(new Animated.Value(0)).current
  const lastScrollY = useRef(0)
  const fabAnimValue = useRef(new Animated.Value(0)).current // 0 = expanded, 1 = collapsed
  const isCollapsed = useRef(false)

  const onScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const currentY = event.nativeEvent.contentOffset.y
      const diff = currentY - lastScrollY.current

      if (diff > 8 && currentY > 56 && !isCollapsed.current) {
        // Scrolling down — collapse FAB
        isCollapsed.current = true
        Animated.spring(fabAnimValue, {
          toValue: 1,
          useNativeDriver: true,
          tension: 68,
          friction: 12,
        }).start()
      } else if (diff < -8 && isCollapsed.current) {
        // Scrolling up — expand FAB
        isCollapsed.current = false
        Animated.spring(fabAnimValue, {
          toValue: 0,
          useNativeDriver: true,
          tension: 68,
          friction: 12,
        }).start()
      }

      lastScrollY.current = currentY
    },
    [fabAnimValue],
  )

  return { scrollY, fabAnimValue, onScroll }
}
