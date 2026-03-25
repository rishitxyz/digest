import { Image } from 'react-native'

import { useTheme } from 'react-native-paper'
import RenderHtml, { MixedStyleDeclaration } from 'react-native-render-html'

import { fontSize, shapes, spacing } from '../theme/theme'

interface HtmlRendererProps {
  html: string
  currentWidth: number
  contentWidth?: number
  fontsToBeUsed?: string[]
  tagsStyle?: Readonly<Record<string, MixedStyleDeclaration>>
}

export const HtmlRenderer = ({
  html,
  currentWidth,
  fontsToBeUsed = [],
  contentWidth = spacing.md,
  tagsStyle = {},
}: HtmlRendererProps) => {
  const theme = useTheme()

  const renderers = {
    img: ({ tnode }: any) => {
      // Extract the raw image URL from the HTML tag
      const imageUrl = tnode.attributes.src

      // If there's no URL, render nothing so it doesn't crash
      if (!imageUrl) return null

      return (
        <Image
          source={{ uri: imageUrl }}
          style={{
            width: availableWidth,
            // 3. Using a standard aspect ratio prevents layout jumping
            // and looks incredibly clean for news feeds!
            aspectRatio: 16 / 9,
            borderRadius: shapes.large,
            marginTop: spacing.sm,
            marginBottom: spacing.sm,
            backgroundColor: theme.colors.surfaceVariant, // Nice placeholder color while loading
          }}
          // 'cover' ensures the image fills the 16:9 box beautifully without stretching
          resizeMode="cover"
        />
      )
    },
  }

  const availableWidth = currentWidth - spacing.lg * 2

  return (
    <RenderHtml
      source={{ html }}
      contentWidth={contentWidth}
      systemFonts={fontsToBeUsed.concat([theme.fonts.bodyMedium.fontFamily])}
      tagsStyles={{
        body: {
          color: theme.colors.onSurfaceVariant,
          fontSize: 14,
          lineHeight: 24,
          fontFamily: theme.fonts.bodyMedium.fontFamily,
        },
        a: {
          color: theme.colors.primary,
          textDecorationLine: 'underline',
        },
        h1: { color: theme.colors.onSurface, fontWeight: 'bold' },
        h2: { color: theme.colors.onSurface, fontWeight: 'bold' },
        p: {
          marginTop: spacing.sm,
          marginBottom: spacing.sm,
          fontFamily: theme.fonts.bodyMedium.fontFamily,
        },
        figure: {
          width: '100%',
        },
        figcaption: {
          fontStyle: 'italic',
          fontSize: fontSize.labelSmall,
          color: theme.colors.onSurfaceVariant,
          textAlign: 'center',
          marginTop: spacing.xs,
        },
        ...tagsStyle,
      }}
      renderers={renderers}
    />
  )
}
