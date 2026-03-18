import React from 'react'
import { View, Image, StyleSheet } from 'react-native'
import { Card, Text, useTheme } from 'react-native-paper'
import type { MD3Theme } from 'react-native-paper'
import { spacing, shapes } from '../theme/theme'
import { getRelativeTime } from '../utils/date'
import { Source } from '../database/schema/source'
import { Article } from '../database/schema/article'

interface FeedCardProps {
  source: Source
  article: Article
  onPress?: (source: Source, article: Article) => void
}

export default function FeedCard({ source, article, onPress }: FeedCardProps) {
  const theme = useTheme<MD3Theme>()

  return (
    <Card
      mode="contained"
      style={[
        styles.card,
        {
          // backgroundColor: theme.colors.surface,
          borderRadius: shapes.extraLarge,
        },
      ]}
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
      </View>

      <Card.Content style={styles.content}>
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text
            variant="labelSmall"
            style={{ color: theme.colors.primary, marginBottom: spacing.sm }}
          >
            {source.name}
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
