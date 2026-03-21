import React, { useState, useCallback } from 'react'
import { View, StyleSheet, Animated } from 'react-native'
import { Appbar, useTheme, Icon } from 'react-native-paper'
import type { MD3Theme } from 'react-native-paper'
import FeedCard from '../components/FeedCard'
import FeedFilter, { FilterValue } from '../components/FeedFilter'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { fontSize, spacing } from '../theme/theme'
import AddNewSource from '../components/modals/AddNewSource'
import { Article } from '../database/schema/article'
import { Source } from '../database/schema/source'
import { useFeeds } from '../hooks/useFeeds'
import { SectionHeader } from '../components/FeedScreen/SectionHeader'
import { EmptyState } from '../components/FeedScreen/EmptyState'
import { Snackbar } from '../components/Snackbar'

interface FeedScreenProps {
  isFocused: boolean
}

export default function FeedScreen({ isFocused }: FeedScreenProps) {
  const styles = makeStyles(useTheme<MD3Theme>())
  const [filter, setFilter] = useState<FilterValue>('all')
  const { sections, isSyncing, syncWithNetwork, refreshLocal } = useFeeds(filter, isFocused)
  const [addNewSource, setAddNewSource] = useState<boolean>(false)
  const { onScroll } = useScrollAnimation()

  const renderItem = useCallback(
    ({ item, section }: { item: Article; section: { title: string; source: Source } }) => (
      <FeedCard source={section.source} article={item} />
    ),
    [],
  )

  return (
    <View style={styles.container}>
      <Appbar.Header elevated style={styles.header}>
        <Appbar.Content title="ReadIt" style={styles.content} titleStyle={styles.contentTitle} />
        <Appbar.Action
          icon={({ size, color }) => <Icon source="progress-download" size={size} color={color} />}
          onPress={syncWithNetwork}
          disabled={isSyncing}
          loading={isSyncing}
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
          <View style={styles.listHeader}>
            <FeedFilter value={filter} onChange={setFilter} />
          </View>
        }
        renderSectionHeader={({ section: { title, source } }) => (
          <SectionHeader title={title} source={source} />
        )}
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        // ── Empty State ──
        ListEmptyComponent={<EmptyState filter={filter} />}
      />
      <AddNewSource
        visible={addNewSource}
        setVisible={setAddNewSource}
        onSourceAdded={refreshLocal}
      />
      <Snackbar text="Added new source." />
    </View>
  )
}

const makeStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      backgroundColor: theme.colors.surface,
    },
    content: { alignItems: 'flex-start', marginLeft: 0 },
    contentTitle: {
      fontWeight: '700',
      fontSize: fontSize.headlineSmall,
      color: theme.colors.onSurface,
    },
    listHeader: { marginBottom: spacing.sm, paddingTop: spacing.sm },
    listContent: {
      paddingHorizontal: spacing.md,
    },
  })
