import { EnrichedMarkdownText, MarkdownStyle } from 'react-native-enriched-markdown'
import { useTheme } from 'react-native-paper'
import type { MD3Theme } from 'react-native-paper'

import { fontSize } from '../theme/theme'

interface MarkdownTextProps {
  markdown: string
  markdownStyle?: MarkdownStyle
}

export const MarkdownText = ({ markdown, markdownStyle = {} }: MarkdownTextProps) => {
  const theme = useTheme<MD3Theme>()

  const defaultMarkdownStyle: MarkdownStyle = {
    // 1. Added 'text' as a fallback, as many parsers use this for base strings
    // text: {
    //   color: theme.colors.primary,
    //   fontFamily: theme.fonts.bodyMedium.fontFamily,
    //   fontSize: fontSize.bodyLarge,
    // },
    paragraph: {
      color: theme.colors.primary,
      fontFamily: theme.fonts.bodyMedium.fontFamily,
      fontSize: fontSize.bodyLarge,
      lineHeight: 24,
    },
    list: {
      fontSize: fontSize.bodyLarge,
      fontFamily: theme.fonts.bodyMedium.fontFamily,
      color: theme.colors.secondary,
    },
    link: {
      color: theme.colors.primary,
      fontFamily: theme.fonts.bodyMedium.fontFamily,
    },
    strong: {
      color: theme.colors.onSurface,
      fontFamily: theme.fonts.titleMedium.fontFamily,
    },
  }

  // 2. The corrected Deep Merge logic
  const finalStyle: MarkdownStyle = { ...defaultMarkdownStyle }

  Object.keys(markdownStyle).forEach((key) => {
    // @ts-ignore - dynamic key assignment
    finalStyle[key] = {
      // @ts-ignore
      ...(defaultMarkdownStyle[key] || {}), // Keep the defaults (colors, fonts)
      // @ts-ignore
      ...(markdownStyle[key] || {}), // Overwrite only specific traits (like fontSize)
    }
  })

  return <EnrichedMarkdownText markdown={markdown} allowFontScaling markdownStyle={finalStyle} />
}
