// src/screens/ArticleDetailScreen.tsx
import React, { useState } from 'react'
import { ScrollView, StyleSheet, View, Image } from 'react-native'
import { Text, Appbar, useTheme } from 'react-native-paper'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../navigation/types'
import { spacing, shapes } from '../theme/theme'
import { getRelativeTime } from '../utils/date'
import { toggleBookmarked } from '../services/db/article'
import { Article } from '../database/schema/article'

const DEFAULT_IMAGE = require('../../assets/defaults/article-default.png')

type Props = NativeStackScreenProps<RootStackParamList, 'ArticleDetail'>

export default function ArticleDetailScreen({ route, navigation }: Props) {
  const { article: articleParam, source } = route.params
  const [article, setArticle] = useState<Article>(articleParam)
  const [loading, setLoading] = useState<boolean>(false)
  const theme = useTheme()

  const handleBookmarkArticle = () => {
    setLoading(true)
    const updatedArticle = toggleBookmarked(article.id, !article.bookmarked)
    console.log(updatedArticle)
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

        <Image
          source={article.imageUrl ? { uri: article.imageUrl } : DEFAULT_IMAGE}
          style={styles.image}
          resizeMode="cover"
        />

        <Text
          variant="bodyLarge"
          style={{ color: theme.colors.onSurfaceVariant, marginTop: spacing.md }}
        >
          {article.description}
        </Text>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: spacing.lg },
  image: {
    width: '100%',
    height: 200,
    borderRadius: shapes.large,
  },
})
