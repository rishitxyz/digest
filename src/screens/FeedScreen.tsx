import React, { useState, useMemo, useCallback, useEffect } from 'react'
import { View, StyleSheet, Animated } from 'react-native'
import { Text, Appbar, useTheme, Icon, IconButton } from 'react-native-paper'
import type { MD3Theme } from 'react-native-paper'
import FeedCard from '../components/FeedCard'
import FeedFilter, { FilterValue } from '../components/FeedFilter'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { fontSize, spacing } from '../theme/theme'

import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../navigation/types'

// Add these imports to access your Drizzle database functions
import { getSourcesWithLatestArticles, refreshArticles } from '../services/db/source'

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
  const { onScroll } = useScrollAnimation()
  const [syncing, setSyncing] = useState<boolean>(false)

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()

  const loadFeeds = useCallback(async () => {
    let fetchBookmarksOnly = false
    switch (filter) {
      case 'bookmarks':
        fetchBookmarksOnly = true
        break
      default:
        fetchBookmarksOnly = false
        break
    }

    const nextFeeds = await getSourcesWithLatestArticles(fetchBookmarksOnly)
    setFeeds(nextFeeds.filter((feed) => feed.articles.length > 0))
  }, [filter])

  useEffect(() => {
    void loadFeeds()
  }, [loadFeeds, isFocused])

  const filteredItems = useMemo(() => feeds.filter((s) => s.showOnFeed), [feeds])

  const handleHeadingPress = useCallback(
    (source: Source) => {
      navigation.navigate('AllArticles', { source })
    },
    [navigation],
  )

  const renderItem = useCallback(
    ({ item, section }: { item: Article; section: { title: string; source: Source } }) => (
      <FeedCard source={section.source} article={item} />
    ),
    [],
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

  const handleFetchLatestData = async () => {
    setSyncing(true)
    try {
      await refreshArticles()
      await loadFeeds()
    } finally {
      setSyncing(false)
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* App Bar */}
      <Appbar.Header
        elevated
        style={{
          backgroundColor: theme.colors.surface,
        }}
      >
        <Appbar.Content
          title="ReadIt"
          style={{ alignItems: 'flex-start', marginLeft: 0 }}
          titleStyle={{
            fontWeight: '700',
            fontSize: fontSize.headlineSmall,
            color: theme.colors.onSurface,
          }}
        />
        <Appbar.Action
          icon={({ size, color }) => <Icon source="progress-download" size={size} color={color} />}
          onPress={handleFetchLatestData}
          disabled={syncing}
          loading={syncing}
        />
        <Appbar.Action
          icon="plus"
          onPress={() => {
            setAddNewSource(!addNewSource)
          }}
        />
      </Appbar.Header>

      <Animated.SectionList
        sections={sections}
        keyExtractor={(item, index) => item.id + index}
        renderItem={renderItem}
        ListHeaderComponent={
          <View style={{ marginBottom: spacing.sm, paddingTop: spacing.sm }}>
            <FeedFilter value={filter} onChange={setFilter} />
          </View>
        }
        renderSectionHeader={({ section: { title, source } }) => (
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingHorizontal: spacing.md,
              paddingVertical: spacing.sm,
              backgroundColor: theme.colors.background,
            }}
          >
            <Text variant="titleLarge" style={{ color: theme.colors.primary, fontWeight: 'bold' }}>
              {source.type === FeedType.SUB_REDDIT ? source.url : title}
            </Text>
            <IconButton
              icon="arrow-right-thick"
              size={12}
              animated
              onPress={() => handleHeadingPress(source)}
            />
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
              {filter === 'bookmarks'
                ? 'No bookmark articles yet.'
                : 'Add new feeds by clicking on the plus button'}
            </Text>
          </View>
        }
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
    paddingHorizontal: spacing.md,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 120,
    paddingHorizontal: spacing.xl,
  },
})
