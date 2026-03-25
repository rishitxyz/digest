import { EnrichedMarkdownText, MarkdownStyle } from 'react-native-enriched-markdown'
import { useTheme } from 'react-native-paper'
import type { MD3Theme } from 'react-native-paper'

interface MarkdownTextProps {
  markdown: string
  markdownStyle?: MarkdownStyle
}

export const MarkdownText = ({ markdown, markdownStyle = {} }: MarkdownTextProps) => {
  const theme = useTheme<MD3Theme>()

  const defaultMarkdownStyle: MarkdownStyle = {
    paragraph: {
      color: theme.colors.primary,
      fontFamily: theme.fonts.bodyMedium.fontFamily, // e.g., Poppins_400Regular
      fontSize: 14,
      lineHeight: 24,
    },
    list: {
      fontSize: 14,
      fontFamily: theme.fonts.bodyMedium.fontFamily,
      color: theme.colors.secondary,
    },
    link: {
      color: theme.colors.primary,
      fontFamily: theme.fonts.bodyMedium.fontFamily,
    },
    strong: {
      color: theme.colors.onSurface,
      // 1. Use your bold/semibold font family directly from your theme
      fontFamily: theme.fonts.titleMedium.fontFamily,
      // 2. We completely REMOVE fontWeight: 'bold' to prevent the OS system-font fallback bug
    },
  }

  // 3. Deep merge the styles so incoming props don't accidentally delete your font families
  const mergedStyle: MarkdownStyle = Object.keys(defaultMarkdownStyle).reduce((acc, key) => {
    // @ts-ignore - Dynamic key mapping
    acc[key] = { ...defaultMarkdownStyle[key], ...(markdownStyle[key] || {}) }
    return acc
  }, {} as MarkdownStyle)

  // Append any extra keys from markdownStyle that weren't in defaultMarkdownStyle
  const finalStyle = { ...mergedStyle, ...markdownStyle }

  return <EnrichedMarkdownText markdown={markdown} allowFontScaling markdownStyle={finalStyle} />
}
