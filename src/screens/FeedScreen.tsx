import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Text, Appbar, useTheme } from 'react-native-paper';
import type { MD3Theme } from 'react-native-paper';
import FeedCard from '../components/FeedCard';
import AnimatedFAB from '../components/AnimatedFAB';
import FeedFilter, { FilterValue } from '../components/FeedFilter';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { spacing } from '../theme/theme';

import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { FeedItem, GroupedFeedItem } from '../types/feed';
import { fetchAll } from '../services/feed-service';
import { FEED_SOURCES } from '../config/feed-source';

export default function FeedScreen() {
  const theme = useTheme<MD3Theme>();
  const [filter, setFilter] = useState<FilterValue>('all');
  const [feeds, setFeeds] = useState<GroupedFeedItem[]>([]);
  const { fabAnimValue, onScroll } = useScrollAnimation();

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const filteredItems = useMemo(() => {
    switch (filter) {
      case 'unread':
        return feeds.filter((item) => !item.isRead);
      case 'favorites':
        return feeds.filter((item) => item.isFavorite);
      default:
        return feeds;
    }
  }, [filter, feeds]);

  const toggleFavorite = useCallback((feedItemId: string) => {
    setFeeds((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item,
      ),
    );
  }, []);

  const handleCardPress = useCallback((item: FeedItem) => {
    // Mark as read on press
    setFeeds((prev) =>
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

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      const fetchedFeeds = await fetchAll(FEED_SOURCES);
      if (isMounted) setFeeds(fetchedFeeds);
    };

    void load();

    return () => {
      isMounted = false;
    };
  }, []);

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
      {
        feeds.map(({ source, feedItems }) => <>
        <Text variant='headlineMedium'>{source}</Text>
        <Animated.FlatList
        data={feedItems}
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
      /></>)
      }

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
