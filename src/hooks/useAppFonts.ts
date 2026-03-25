import { useCallback, useState } from 'react'

import {
  FiraSans_400Regular,
  FiraSans_500Medium,
  FiraSans_600SemiBold,
  FiraSans_700Bold,
  useFonts,
} from '@expo-google-fonts/fira-sans'
import {
  Newsreader_400Regular,
  Newsreader_500Medium,
  Newsreader_600SemiBold,
  Newsreader_700Bold,
} from '@expo-google-fonts/newsreader'
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins'

import { STORAGE_KEYS, storage } from '../database/mmkv'

export type fontOptionsType = 'FiraSans' | 'Poppins'

export const fontOptions = {
  firaSans: { displayName: 'Fira Sans', value: 'FiraSans' },
  poppins: { displayName: 'Poppins', value: 'Poppins' },
  newsreader: { displayName: 'Newsreader', value: 'Newsreader' },
}

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
  // Newsreader
  Newsreader_400Regular,
  Newsreader_500Medium,
  Newsreader_600SemiBold,
  Newsreader_700Bold,
}

export const useAppFonts = () => {
  const [selectedFont, setSelectedFont] = useState<fontOptionsType>(
    (storage.getString(STORAGE_KEYS.APP_FONT) as fontOptionsType) ?? fontOptions.newsreader.value,
  )

  const [fontsLoaded, fontError] = useFonts(SUPPORTED_FONTS)

  const changeFont = useCallback((font: fontOptionsType) => {
    setSelectedFont(font)
    storage.set(STORAGE_KEYS.APP_FONT, font)
  }, [])

  return { selectedFont, setSelectedFont, fontsLoaded, fontError, changeFont }
}
