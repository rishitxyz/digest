import { useCallback, useState } from 'react'
import {
  FiraSans_400Regular,
  FiraSans_500Medium,
  FiraSans_600SemiBold,
  FiraSans_700Bold,
  useFonts,
} from '@expo-google-fonts/fira-sans'

import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins'
import { storage, STORAGE_KEYS } from '../database/mmkv'
import { fontOptions, fontOptionsType } from '../theme/font'

export const SUPPORTED_FONTS = {
  // Fira Sans
  FiraSans_400Regular,
  FiraSans_500Medium,
  FiraSans_600SemiBold,
  FiraSans_700Bold,
  // Poppins
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
}

export const useAppFonts = () => {
  const [selectedFont, setSelectedFont] = useState<fontOptionsType>(
    (storage.getString(STORAGE_KEYS.APP_FONT) as fontOptionsType) ?? fontOptions.firaSans.value,
  )

  const [fontsLoaded, fontError] = useFonts(SUPPORTED_FONTS)

  const changeFont = useCallback((font: fontOptionsType) => {
    setSelectedFont(font)
    storage.set(STORAGE_KEYS.APP_FONT, font)
  }, [])

  return { selectedFont, setSelectedFont, fontsLoaded, fontError, changeFont }
}
