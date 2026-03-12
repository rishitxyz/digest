import React, { useState, useMemo, useCallback } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Text, Appbar, useTheme } from 'react-native-paper';
import type { MD3Theme } from 'react-native-paper';
import FeedCard from '../components/FeedCard';
import AnimatedFAB from '../components/AnimatedFAB';
import FeedFilter, { FilterValue } from '../components/FeedFilter';
import { mockFeedItems, FeedItem } from '../services/mockData';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { spacing } from '../theme/theme';

import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

export default function FeedScreen() {
  const theme = useTheme<MD3Theme>();
  const [filter, setFilter] = useState<FilterValue>('all');
  const [feedItems, setFeedItems] = useState<FeedItem[]>(mockFeedItems);
  const { fabAnimValue, onScroll } = useScrollAnimation();

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const filteredItems = useMemo(() => {
    switch (filter) {
      case 'unread':
        return feedItems.filter((item) => !item.isRead);
      case 'favorites':
        return feedItems.filter((item) => item.isFavorite);
      default:
        return feedItems;
    }
  }, [filter, feedItems]);

  const toggleFavorite = useCallback((id: string) => {
    setFeedItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item,
      ),
    );
  }, []);

  const handleCardPress = useCallback((item: FeedItem) => {
    // Mark as read on press
    setFeedItems((prev) =>
      prev.map((f) => (f.id === item.id ? { ...f, isRead: true } : f)),
    );

    // handle navigation to article page.
    navigation.navigate('ArticleDetail', {article: item})
  }, [navigation]);

  const renderItem = useCallback(
    ({ item }: { item: FeedItem }) => (
      <FeedCard
        item={item}
        onToggleFavorite={toggleFavorite}
        onPress={handleCardPress}
      />
    ),
    [toggleFavorite, handleCardPress],
  );

  const keyExtractor = useCallback((item: FeedItem) => item.id, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* App Bar */}
      <Appbar.Header
        elevated
        style={{ backgroundColor: theme.colors.surface }}
      >
        <Appbar.Content
          title="ReadIt"
          titleStyle={{
            fontWeight: '700',
            fontSize: 24,
            color: theme.colors.onSurface,
          }}
        />
        <Appbar.Action
          icon="magnify"
          onPress={() => {}}
          iconColor={theme.colors.onSurfaceVariant}
        />
        <Appbar.Action
          icon="dots-vertical"
          onPress={() => {}}
          iconColor={theme.colors.onSurfaceVariant}
        />
      </Appbar.Header>

      {/* Filter Chips */}
      <FeedFilter value={filter} onChange={setFilter} />

      {/* Feed List */}
      <Animated.FlatList
        data={filteredItems}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text
              variant="headlineSmall"
              style={{ color: theme.colors.onSurfaceVariant, textAlign: 'center' }}
            >
              No articles found
            </Text>
            <Text
              variant="bodyMedium"
              style={{ color: theme.colors.onSurfaceVariant, textAlign: 'center', marginTop: spacing.sm }}
            >
              {filter === 'favorites'
                ? 'Heart some articles to see them here!'
                : 'All caught up!'}
            </Text>
          </View>
        }
      />

      {/* Animated Extended FAB */}
      <AnimatedFAB
        animValue={fabAnimValue}
        onPress={() => {
          // TODO: Open modal to add new feed.
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingTop: spacing.sm,
    paddingBottom: 96, // Space for FAB
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 120,
    paddingHorizontal: spacing.xl,
  },
});
