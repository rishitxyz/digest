import { useState, useCallback, useEffect, useMemo } from 'react'
import { getSourcesWithLatestArticles, refreshArticles } from '../services/db/source'
import { FilterValue } from '../components/FeedFilter'
import { SourceWithArticles } from '../database/schema'

export function useFeeds(filter: FilterValue, isFocused: boolean) {
  const [feeds, setFeeds] = useState<SourceWithArticles[]>([])
  const [isSyncing, setIsSyncing] = useState(false)

  // 1. Handle Fetching
  const fetchLocalFeeds = useCallback(async () => {
    const fetchBookmarksOnly = filter === 'bookmarks'
    const nextFeeds = await getSourcesWithLatestArticles(fetchBookmarksOnly)
    setFeeds(nextFeeds.filter((feed) => feed.articles.length > 0))
  }, [filter])

  // 2. Handle Syncing
  const syncWithNetwork = useCallback(async () => {
    setIsSyncing(true)
    try {
      await refreshArticles()
      await fetchLocalFeeds()
    } finally {
      setIsSyncing(false)
    }
  }, [fetchLocalFeeds])

  // 3. Format for SectionList
  const sections = useMemo(() => {
    const visibleFeeds = feeds.filter((s) => s.showOnFeed)
    return visibleFeeds.map((source) => ({
      title: source.name,
      source: source, // Strip out heavy article data from the header prop if possible
      data: source.articles,
    }))
  }, [feeds])

  // Trigger fetch on mount/focus
  useEffect(() => {
    if (isFocused) void fetchLocalFeeds()
  }, [fetchLocalFeeds, isFocused])

  // Return exactly what the UI needs, nothing more.
  return {
    sections,
    isSyncing,
    syncWithNetwork,
    refreshLocal: fetchLocalFeeds,
  }
}
