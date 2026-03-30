import { useState } from 'react'

import { STORAGE_KEYS, storage } from '../database/mmkv'

export const useFeedImages = () => {
  const [showImages, setShowImages] = useState<boolean>(
    storage.getBoolean(STORAGE_KEYS.APP_SHOW_IMAGES) ?? false,
  )

  const onToggleShowImages = () => {
    setShowImages(!showImages)
    storage.set(STORAGE_KEYS.APP_SHOW_IMAGES, showImages)
  }

  return { showImages, onToggleShowImages }
}
