import { createMMKV } from 'react-native-mmkv'

export const storage = createMMKV()

export const STORAGE_KEYS = {
  APP_FONT: 'app_font',
  APP_DISPLAY_MODE: 'app_display_mode',
  APP_SHOW_IMAGES: 'app_show_images',
}
