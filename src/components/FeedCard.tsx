import React from 'react'
import { View, Image, StyleSheet } from 'react-native'
import { Card, Text, IconButton, useTheme } from 'react-native-paper'
import type { MD3Theme } from 'react-native-paper'
import { spacing, shapes } from '../theme/theme'
import { getRelativeTime } from '../utils/date'
import { Source } from '../database/schema/source'
import { Article } from '../database/schema/article'

interface FeedCardProps {
  source: Source
  article: Article
  onToggleFavorite?: (id: string) => void
  onPress?: (source: Source, article: Article) => void
}

export default function FeedCard({ source, article, onToggleFavorite, onPress }: FeedCardProps) {
  const theme = useTheme<MD3Theme>()

  return (
    <Card
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surface,
          borderRadius: shapes.extraLarge,
        },
      ]}
      elevation={1}
      onPress={() => onPress?.(source, article)}
    >
      {/* Hero Image */}
      <View
        style={[
          styles.imageContainer,
          { borderTopLeftRadius: shapes.extraLarge, borderTopRightRadius: shapes.extraLarge },
        ]}
      >
        {article.imageUrl && (
          <Image source={{ uri: article.imageUrl }} style={[styles.image]} resizeMode="cover" />
        )}

        {!article.isRead && (
          <View style={[styles.unreadDot, { backgroundColor: theme.colors.primary }]} />
        )}
      </View>

      <Card.Content style={styles.content}>
        <Text
          variant="headlineSmall"
          numberOfLines={2}
          style={[styles.title, { color: theme.colors.onSurface }]}
        >
          {article.title}
        </Text>

        {article.description !== '' && (
          <Text
            variant="bodyMedium"
            numberOfLines={3}
            style={[styles.summary, { color: theme.colors.onSurfaceVariant }]}
          >
            {article.description}
          </Text>
        )}
      </Card.Content>

      {/* Actions */}
      <View style={styles.actions}>
        <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>
          {getRelativeTime(article.publishedAt)}
        </Text>
        <IconButton
          icon={article.bookmarked ? 'bookmark-check' : 'bookmark-plus-outline'}
          iconColor={article.bookmarked ? theme.colors.error : theme.colors.onSurfaceVariant}
          size={22}
          onPress={() => onToggleFavorite?.(article.id)}
        />
      </View>
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
  unreadDot: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
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
  actions: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xs,
  },
})
