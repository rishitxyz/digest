import React, { useState } from 'react'
import { ScrollView, StyleSheet, View, Image, useWindowDimensions } from 'react-native'
import { Text, Appbar, useTheme } from 'react-native-paper'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../navigation/types'
import { spacing, shapes, fontSize } from '../theme/theme'
import { getRelativeTime } from '../utils/date'
import { toggleBookmarked } from '../services/db/article'
import { Article } from '../database/schema/article'
import * as articleService from '../services/db/article'
import RenderHtml from 'react-native-render-html'

type Props = NativeStackScreenProps<RootStackParamList, 'ArticleDetail'>

export default function ArticleScreen({ route, navigation }: Props) {
  const { id, source } = route.params
  const [article, setArticle] = useState<Article>(articleService.readById(id))
  const [loading, setLoading] = useState<boolean>(false)
  const theme = useTheme()
  const { width } = useWindowDimensions()

  const availableWidth = width - spacing.lg * 2

  const handleBookmarkArticle = () => {
    if (!article) return
    setLoading(true)
    const updatedArticle = toggleBookmarked(article.id, !article.bookmarked)
    setArticle(updatedArticle)
    setLoading(false)
  }

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
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* M3 App Bar with a back button */}
      <Appbar.Header elevated style={{ backgroundColor: theme.colors.surface }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={source.name || 'Feed'} />

        <Appbar.Action
          icon={article.bookmarked ? 'bookmark-check' : 'bookmark-plus-outline'}
          onPress={handleBookmarkArticle}
          loading={loading}
        />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text variant="labelSmall" style={{ color: theme.colors.primary }}>
            {article.author}
          </Text>
          <Text variant="labelSmall">{getRelativeTime(article.publishedAt)}</Text>
        </View>

        <Text
          variant="headlineMedium"
          style={{ color: theme.colors.onSurface, marginBottom: spacing.md }}
        >
          {article.title}
        </Text>

        <View>
          <RenderHtml
            source={{ html: article.description }}
            contentWidth={spacing.md}
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
            }}
            renderers={renderers} // Pass the new v6 renderer here!
          />
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: spacing.lg },
  htmlContent: {
    marginVertical: spacing.lg,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: shapes.large,
  },
})
