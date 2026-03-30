import React from 'react'
import { Image, StyleSheet, View } from 'react-native'

import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { Card, Text, useTheme } from 'react-native-paper'
import type { MD3Theme } from 'react-native-paper'

import { FeedType } from '../config/feed-source'
import { Article } from '../database/schema/article'
import { Source } from '../database/schema/source'
import { RootStackParamList } from '../navigation/types'
import { markArticleAsRead } from '../services/db/article'
import { shapes, spacing } from '../theme/theme'
import { getRelativeTime } from '../utils/date'

interface FeedCardProps {
  source: Source
  article: Article
  showImage: boolean
}

export default function FeedCard({ source, article, showImage }: FeedCardProps) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
  const theme = useTheme<MD3Theme>()

  const handleCardPress = (source: Source, article: Article) => {
    if (!article.isRead) {
      markArticleAsRead(article.id)
    }

    if (source.type === FeedType.SUB_REDDIT)
      navigation.navigate('RedditPost', { source, id: article.id })
    else navigation.navigate('ArticleDetail', { source, id: article.id })
  }

  return (
    <Card
      mode="contained"
      style={[
        styles.card,
        {
          borderRadius: shapes.large,
          borderWidth: 1,
          borderColor: theme.colors.outlineVariant,
        },
      ]}
      onPress={() => handleCardPress(source, article)}
    >
      {/* Hero Image */}
      <View
        style={[
          styles.imageContainer,
          { borderTopLeftRadius: shapes.large, borderTopRightRadius: shapes.large },
        ]}
      >
        {article.imageUrl && showImage && (
          <Image source={{ uri: article.imageUrl }} style={[styles.image]} resizeMode="cover" />
        )}
      </View>

      <Card.Content style={styles.content}>
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text
            variant="labelSmall"
            style={{ color: theme.colors.primary, marginBottom: spacing.sm, letterSpacing: 2 }}
          >
            {source.name.toUpperCase()}
          </Text>
          <Text
            variant="labelSmall"
            style={{ color: theme.colors.onSurfaceVariant, marginBottom: spacing.sm }}
          >
            {getRelativeTime(article.publishedAt)}
          </Text>
        </View>
        <Text
          variant="headlineSmall"
          numberOfLines={0}
          style={[styles.title, { color: theme.colors.onSurface }]}
        >
          {article.title}
        </Text>

        <Text
          variant="bodyMedium"
          numberOfLines={2}
          style={[styles.summary, { color: theme.colors.onSurfaceVariant, fontStyle: 'italic' }]}
        >
          {article.summary && article.summary !== '' ? article.summary : article.description}
        </Text>
      </Card.Content>
    </Card>
  )
}

const styles = StyleSheet.create({
  card: {
    marginVertical: spacing.sm,
    overflow: 'hidden',
  },
  imageContainer: {
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 200,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  title: {
    marginBottom: spacing.sm,
    fontWeight: '700',
  },
  summary: {
    lineHeight: 22,
  },
})
