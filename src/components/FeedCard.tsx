import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Card, Text, IconButton, useTheme } from 'react-native-paper';
import type { MD3Theme } from 'react-native-paper';
import { FeedItem } from '../services/mockData';
import { spacing, shapes } from '../theme/theme';

interface FeedCardProps {
  item: FeedItem;
  onToggleFavorite?: (id: string) => void;
  onPress?: (item: FeedItem) => void;
}

export default function FeedCard({ item, onToggleFavorite, onPress }: FeedCardProps) {
  const theme = useTheme<MD3Theme>();

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
      onPress={() => onPress?.(item)}
    >
      {/* Hero Image */}
     {
      item.image &&  <View style={[styles.imageContainer, { borderRadius: shapes.extraLarge }]}>
        <Image
          source={{ uri: item.image }}
          style={[styles.image, { borderTopLeftRadius: shapes.extraLarge, borderTopRightRadius: shapes.extraLarge }]}
          resizeMode="cover"
        />

        {/* Unread indicator dot */}
        {!item.isRead && (
          <View
            style={[
              styles.unreadDot,
              { backgroundColor: theme.colors.primary },
            ]}
          />
        )}
      </View>
     }

      <Card.Content style={styles.content}>
        {/* Source & Timestamp row */}
        <View style={styles.metaRow}>
          <Text
            variant="labelMedium"
            style={{ color: theme.colors.primary, fontWeight: '600' }}
          >
            {item.source}
          </Text>
          <Text
            variant="labelSmall"
            style={{ color: theme.colors.onSurfaceVariant }}
          >
            {item.timestamp}
          </Text>
        </View>

        {/* Title */}
        <Text
          variant="headlineSmall"
          numberOfLines={2}
          style={[styles.title, { color: theme.colors.onSurface }]}
        >
          {item.title}
        </Text>

        {/* Summary */}
        <Text
          variant="bodyMedium"
          numberOfLines={item.image != undefined ? 3 : 10}
          style={[styles.summary, { color: theme.colors.onSurfaceVariant }]}
        >
          {item.description}
        </Text>
      </Card.Content>

      {/* Actions */}
      <Card.Actions style={styles.actions}>
        <IconButton
          icon={item.isFavorite ? 'heart' : 'heart-outline'}
          iconColor={item.isFavorite ? theme.colors.error : theme.colors.onSurfaceVariant}
          size={22}
          onPress={() => onToggleFavorite?.(item.id)}
        />
        <IconButton
          icon="share-variant-outline"
          iconColor={theme.colors.onSurfaceVariant}
          size={22}
          onPress={() => {}}
        />
        <IconButton
          icon="bookmark-outline"
          iconColor={theme.colors.onSurfaceVariant}
          size={22}
          onPress={() => {}}
        />
      </Card.Actions>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: spacing.lg,
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
    paddingHorizontal: spacing.sm,
    paddingBottom: spacing.xs,
  },
});
