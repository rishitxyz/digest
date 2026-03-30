import { Platform } from 'react-native'

import type { useMaterial3Theme } from 'react-native-material3-theme'
import { MD3DarkTheme, MD3LightTheme, MD3Theme, configureFonts } from 'react-native-paper'

import { fontOptionsType } from '../hooks/useAppFonts'

// 1. Import the type

// ── M3 Expressive Spacing Tokens (8dp grid) ──────────────────────────
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
  xxxl: 48,
} as const

// ── M3 Expressive Shape Tokens ───────────────────────────────────────
export const shapes = {
  none: 0,
  extraSmall: 4,
  small: 8,
  medium: 12,
  large: 16,
  extraLarge: 28,
  full: 9999,
} as const

// ... (Keep your lightColors and darkColors exactly as they are) ...
const lightColors = {
  primary: '#4A654E', // Deep forest green (FAB, active buttons)
  onPrimary: '#FFFFFF',
  primaryContainer: '#CCEBCE', // Soft mint/sage (Active bottom nav pill)
  onPrimaryContainer: '#06210F', // Dark green text on the active nav pill

  secondary: '#536353', // Muted olive (Metadata, secondary text)
  onSecondary: '#FFFFFF',
  secondaryContainer: '#D6E8D4', // Light grey-green (Inactive tab backgrounds)
  onSecondaryContainer: '#111F13',

  background: '#F8FAF5', // Crisp off-white background
  onBackground: '#191C19', // Charcoal/green-tinted text

  surface: '#F8FAF5', // Base surface color
  onSurface: '#191C19', // Dark text for headlines
  surfaceVariant: '#E9EBE4', // Slightly darker off-white for article cards
  onSurfaceVariant: '#424940', // Muted text inside cards

  outline: '#72796F', // Dividers and borders
  outlineVariant: '#C2C5BE', // Faint borders

  // ADD THIS:
  elevation: {
    level0: 'transparent',
    level1: '#F3F5F0', // Slightly darker than background
    level2: '#EEF0EB', // Used by BottomNav by default
    level3: '#EAECE6',
    level4: '#E8EBE4',
    level5: '#E5E9DF',
  },
}

const darkColors = {
  primary: '#B0CFB3', // Lighter sage for dark mode legibility
  onPrimary: '#1C3622',
  primaryContainer: '#334D37', // Deep forest green container
  onPrimaryContainer: '#CCEBCE',

  secondary: '#BACCB8',
  onSecondary: '#263427',
  secondaryContainer: '#3C4B3D',
  onSecondaryContainer: '#D6E8D4',

  background: '#111411', // Very dark charcoal background
  onBackground: '#E1E3DF', // Light grey-green text

  surface: '#111411',
  onSurface: '#E1E3DF',
  surfaceVariant: '#2D312D', // Elevated dark grey cards
  onSurfaceVariant: '#C2C9BD',

  outline: '#8C9388',
  outlineVariant: '#424940',
  elevation: {
    level0: 'transparent',
    level1: '#161916',
    level2: '#1A1E1A', // Used by BottomNav by default
    level3: '#1E231E',
    level4: '#202520',
    level5: '#232923',
  },
}

export const fontSize = {
  displayLarge: 57,
  displayMedium: 45,
  displaySmall: 36,
  headlineLarge: 32,
  headlineMedium: 28,
  headlineSmall: 24,
  titleLarge: 22,
  titleMedium: 16,
  titleSmall: 14,
  bodyLarge: 16,
  bodyMedium: 14,
  bodySmall: 12,
  labelLarge: 14,
  labelMedium: 12,
  labelSmall: 11,
}

export const getDynamicFonts = (fontPrefix: fontOptionsType) => {
  const fontConfig = {
    displayLarge: {
      fontFamily: `${fontPrefix}_400Regular`,
      fontSize: 57,
      fontWeight: '400' as const,
      letterSpacing: -0.25,
      lineHeight: 64,
    },
    displayMedium: {
      fontFamily: `${fontPrefix}_400Regular`,
      fontSize: 45,
      fontWeight: '400' as const,
      letterSpacing: 0,
      lineHeight: 52,
    },
    displaySmall: {
      fontFamily: `${fontPrefix}_400Regular`,
      fontSize: 36,
      fontWeight: '400' as const,
      letterSpacing: 0,
      lineHeight: 44,
    },
    headlineLarge: {
      fontFamily: `${fontPrefix}_700Bold`,
      fontSize: 32,
      fontWeight: '700' as const,
      letterSpacing: 0,
      lineHeight: 40,
    },
    headlineMedium: {
      fontFamily: `${fontPrefix}_700Bold`,
      fontSize: 28,
      fontWeight: '700' as const,
      letterSpacing: 0,
      lineHeight: 36,
    },
    headlineSmall: {
      fontFamily: `${fontPrefix}_700Bold`,
      fontSize: 24,
      fontWeight: '700' as const,
      letterSpacing: 0,
      lineHeight: 32,
    },
    titleLarge: {
      fontFamily: `${fontPrefix}_600SemiBold`,
      fontSize: 22,
      fontWeight: '600' as const,
      letterSpacing: 0,
      lineHeight: 28,
    },
    titleMedium: {
      fontFamily: `${fontPrefix}_600SemiBold`,
      fontSize: 16,
      fontWeight: '600' as const,
      letterSpacing: 0.15,
      lineHeight: 24,
    },
    titleSmall: {
      fontFamily: `${fontPrefix}_600SemiBold`,
      fontSize: 14,
      fontWeight: '600' as const,
      letterSpacing: 0.1,
      lineHeight: 20,
    },
    bodyLarge: {
      fontFamily: `${fontPrefix}_400Regular`,
      fontSize: 16,
      fontWeight: '400' as const,
      letterSpacing: 0.5,
      lineHeight: 24,
    },
    bodyMedium: {
      fontFamily: `${fontPrefix}_400Regular`,
      fontSize: 14,
      fontWeight: '400' as const,
      letterSpacing: 0.25,
      lineHeight: 20,
    },
    bodySmall: {
      fontFamily: `${fontPrefix}_400Regular`,
      fontSize: 12,
      fontWeight: '400' as const,
      letterSpacing: 0.4,
      lineHeight: 16,
    },
    labelLarge: {
      fontFamily: `${fontPrefix}_500Medium`,
      fontSize: 14,
      fontWeight: '500' as const,
      letterSpacing: 0.1,
      lineHeight: 20,
    },
    labelMedium: {
      fontFamily: `${fontPrefix}_500Medium`,
      fontSize: 12,
      fontWeight: '500' as const,
      letterSpacing: 0.5,
      lineHeight: 16,
    },
    labelSmall: {
      fontFamily: `${fontPrefix}_500Medium`,
      fontSize: 11,
      fontWeight: '500' as const,
      letterSpacing: 0.5,
      lineHeight: 16,
    },
  }

  return configureFonts({ config: fontConfig })
}

// ── Export Default Themes ────────────────────────────────────────────
export const LightTheme: MD3Theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    ...lightColors,
  },
  roundness: shapes.large,
}

export const DarkTheme: MD3Theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    ...darkColors,
  },
  roundness: shapes.large,
}

export type SystemM3Theme = ReturnType<typeof useMaterial3Theme>['theme']
// ── Dynamic Theme Combiner ───────────────────────────────────────────
// 2. Add the dynamic theme assembler
export const getAppTheme = (
  isDarkMode: boolean,
  selectedFont: fontOptionsType,
  systemTheme: SystemM3Theme | null,
): MD3Theme => {
  const baseTheme = isDarkMode ? DarkTheme : LightTheme
  const dynamicFonts = getDynamicFonts(selectedFont)

  // 2. THE FIX: Only extract system colors if we are explicitly on an Android device.
  // On iOS, this forces systemColors to be null, allowing your custom green theme to shine through.
  const systemColors =
    Platform.OS === 'android' && systemTheme
      ? isDarkMode
        ? systemTheme.dark
        : systemTheme.light
      : null

  return {
    ...baseTheme,
    // Merge base colors with system colors (if they exist and we are on Android)
    colors: {
      ...baseTheme.colors,
      ...(systemColors || {}),
    },
    fonts: dynamicFonts,
  }
}
