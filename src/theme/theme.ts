import { MD3LightTheme, MD3DarkTheme, configureFonts, MD3Theme } from 'react-native-paper'

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
  /* ... */
}
const darkColors = {
  /* ... */
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

export const getDynamicFonts = (fontPrefix: 'FiraSans' | 'Poppins') => {
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

// ── Export Themes ────────────────────────────────────────────────────
export const LightTheme: MD3Theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    ...lightColors,
  },
  roundness: shapes.extraLarge,
}

export const DarkTheme: MD3Theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    ...darkColors,
  },
  roundness: shapes.extraLarge,
}
