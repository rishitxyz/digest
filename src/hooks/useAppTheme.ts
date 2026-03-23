import { useCallback, useState } from 'react'

import { useMaterial3Theme } from 'react-native-material3-theme'

import { STORAGE_KEYS, storage } from '../database/mmkv'

export const useAppTheme = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(
    storage.getBoolean(STORAGE_KEYS.APP_DISPLAY_MODE) ?? false,
  )

  const { theme: systemM3Theme } = useMaterial3Theme()

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode((prev) => {
      storage.set(STORAGE_KEYS.APP_DISPLAY_MODE, !prev)
      return !prev
    })
  }, [])

  return { isDarkMode, setIsDarkMode, toggleDarkMode, systemM3Theme }
}
