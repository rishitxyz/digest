import React, { useState, useMemo, useCallback, useEffect } from 'react'
import { View, StyleSheet, Animated } from 'react-native'
import { Text, Appbar, useTheme } from 'react-native-paper'
import type { MD3Theme } from 'react-native-paper'
import FeedCard from '../components/FeedCard'
import AnimatedFAB from '../components/AnimatedFAB'
import FeedFilter, { FilterValue } from '../components/FeedFilter'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { spacing } from '../theme/theme'

import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../navigation/types'

// Add these imports to access your Drizzle database functions
import { getSourcesWithLatestArticles } from '../services/db/source'
import { markArticleAsRead, toggleFavourite } from '../services/db/article' // Adjust this path to where you saved your CRUD helpers

import AddNewSource from '../components/modals/AddNewSource'
import { Article } from '../database/schema/article'
import { Source } from '../database/schema/source'
import { SourceWithArticles } from '../database/schema'
import { FeedType } from '../config/feed-source'

interface FeedScreenProps {
  isFocused: boolean
}

export default function FeedScreen({ isFocused }: FeedScreenProps) {
  const theme = useTheme<MD3Theme>()
  const [filter, setFilter] = useState<FilterValue>('all')
  const [feeds, setFeeds] = useState<SourceWithArticles[]>([])
  const [addNewSource, setAddNewSource] = useState<boolean>(false)
  const { fabAnimValue, onScroll } = useScrollAnimation()

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()

  // ── Database Fetching ──
  const loadFeeds = useCallback(async () => {
    if (isFocused) setFeeds(await getSourcesWithLatestArticles())
  }, [isFocused])

  useEffect(() => {
    loadFeeds()
  }, [loadFeeds])

  // ── Data Filtering ──
  const filteredItems = useMemo(() => {
    switch (filter) {
      case 'unread':
        return feeds
          .map((feed) => ({
            ...feed,
            articles: feed.articles.filter((article) => !article.isRead),
          }))
          .filter((feed) => feed.articles.length > 0)
      case 'favorites':
        return feeds
          .map((feed) => ({
            ...feed,
            articles: feed.articles.filter((article) => article.isFavourite),
          }))
          .filter((feed) => feed.articles.length > 0)
      default:
        return feeds
    }
  }, [filter, feeds])

  // ── Actions ──
  // Updated to receive the whole article so we know its exact current state
  const toggleFavoriteCall = useCallback((article: Article) => {
    const newFavoriteStatus = !article.isFavourite

    // 1. Save to database in the background
    toggleFavourite(article.id, newFavoriteStatus)

    // 2. Optimistically update UI
    setFeeds((prev) =>
      prev.map((group) => ({
        ...group,
        articles: group.articles.map((a) =>
          a.id === article.id ? { ...a, isFavourite: newFavoriteStatus } : a,
        ),
      })),
    )
  }, [])

  const handleCardPress = useCallback(
    (source: Source, article: Article) => {
      // 1. Save to database in the background if it's currently unread
      if (!article.isRead) {
        markArticleAsRead(article.id)
      }

      // 2. Optimistically update UI
      setFeeds((prev) =>
        prev.map((group) => ({
          ...group,
          articles: group.articles.map((article) =>
            article.id === article.id ? { ...article, isRead: true } : article,
          ),
        })),
      )

      if (source.type === FeedType.SUB_REDDIT)
        navigation.navigate('RedditPost', { source, post: article })
      else navigation.navigate('ArticleDetail', { source, article })
    },
    [navigation],
  )

  const renderItem = useCallback(
    ({ item, section }: { item: Article; section: { title: string; source: Source } }) => (
      <FeedCard
        source={section.source}
        article={item}
        // Pass the whole item instead of just the ID to match the new signature
        onToggleFavorite={() => toggleFavoriteCall(item)}
        onPress={() => handleCardPress(section.source, item)}
      />
    ),
    [toggleFavoriteCall, handleCardPress],
  )

  type FeedSection = {
    title: string
    source: Source
    data: Article[]
  }

  const sections = useMemo<FeedSection[]>(() => {
    return filteredItems.map((sourceWithArticles) => ({
      title: sourceWithArticles.name,
      source: {
        id: sourceWithArticles.id,
        createdAt: sourceWithArticles.createdAt,
        name: sourceWithArticles.name,
        url: sourceWithArticles.url,
        type: sourceWithArticles.type,
        showOnFeed: sourceWithArticles.showOnFeed,
      },
      data: sourceWithArticles.articles,
    }))
  }, [filteredItems])

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* App Bar */}
      <Appbar.Header elevated style={{ backgroundColor: theme.colors.surface }}>
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

      <FeedFilter value={filter} onChange={setFilter} />

      <Animated.SectionList
        sections={sections}
        keyExtractor={(item, index) => item.id + index}
        renderItem={renderItem}
        renderSectionHeader={({ section: { title } }) => (
          <View
            style={{
              paddingHorizontal: spacing.md,
              paddingVertical: spacing.sm,
              backgroundColor: theme.colors.background,
            }}
          >
            <Text variant="titleLarge" style={{ color: theme.colors.primary, fontWeight: 'bold' }}>
              {title}
            </Text>
          </View>
        )}
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        // ── Empty State ──
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
              style={{
                color: theme.colors.onSurfaceVariant,
                textAlign: 'center',
                marginTop: spacing.sm,
              }}
            >
              {filter === 'favorites'
                ? 'Heart some articles to see them here!'
                : filter === 'unread'
                  ? 'All caught up!'
                  : 'Add new feeds by clicking on the plus button'}
            </Text>
          </View>
        }
      />
      <AnimatedFAB
        animValue={fabAnimValue}
        icon={addNewSource ? 'close' : 'plus'}
        onPress={() => {
          setAddNewSource(!addNewSource)
        }}
      />

      {/* Pass the loadFeeds function as a prop so the modal can trigger a refresh! */}
      <AddNewSource visible={addNewSource} setVisible={setAddNewSource} onSourceAdded={loadFeeds} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 96, // Space for FAB
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 120,
    paddingHorizontal: spacing.xl,
  },
})
