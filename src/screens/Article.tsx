import React, { useState } from 'react'
import { ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import { Appbar, Text, useTheme } from 'react-native-paper'

import { HtmlRenderer } from '../components/HtmlRenderer'
import { Article } from '../database/schema/article'
import { RootStackParamList } from '../navigation/types'
import { toggleBookmarked } from '../services/db/article'
import * as articleService from '../services/db/article'
import { shapes, spacing } from '../theme/theme'
import { getRelativeTime } from '../utils/date'

type Props = NativeStackScreenProps<RootStackParamList, 'ArticleDetail'>

export default function ArticleScreen({ route, navigation }: Props) {
  const { id, source } = route.params
  const [article, setArticle] = useState<Article>(articleService.readById(id))
  const [loading, setLoading] = useState<boolean>(false)
  const theme = useTheme()
  const { width } = useWindowDimensions()

  const handleBookmarkArticle = () => {
    if (!article) return
    setLoading(true)
    const updatedArticle = toggleBookmarked(article.id, !article.bookmarked)
    setArticle(updatedArticle)
    setLoading(false)
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
          <Text variant="labelSmall" style={{ color: theme.colors.primary, letterSpacing: 1.2 }}>
            {article.author.toUpperCase()}
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
          <HtmlRenderer html={article.description} currentWidth={width} />
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
