import { EnrichedMarkdownText, MarkdownStyle } from 'react-native-enriched-markdown'
import { useTheme } from 'react-native-paper'

interface MarkdownTextProps {
  markdown: string
  markdownStyle: MarkdownStyle
}

export const MarkdownText = ({ markdown, markdownStyle = {} }: MarkdownTextProps) => {
  const theme = useTheme()
  const defaultMarkdownStyle: MarkdownStyle = {
    paragraph: {
      color: theme.colors.secondary,
      fontFamily: theme.fonts.bodyMedium.fontFamily,
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
      underline: true,
    },
    strong: {
      fontFamily: theme.fonts.titleMedium.fontFamily, // Assuming this is your semi-bold/bold variant
      fontWeight: 'bold', // Sometimes the package still needs this as a hint
      color: theme.colors.onSurface,
    },
  }
  return (
    <EnrichedMarkdownText
      markdown={markdown}
      markdownStyle={{ ...defaultMarkdownStyle, ...markdownStyle }}
    />
  )
}
