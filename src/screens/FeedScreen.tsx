import React, { useState, useCallback } from 'react'
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

import AddNewSource from '../components/modals/AddNewSource'
import { Article } from '../database/schema/article'
import { Source } from '../database/schema/source'
import { FeedType } from '../config/feed-source'
import { useFeeds } from '../hooks/useFeeds'

interface FeedScreenProps {
  isFocused: boolean
}

export default function FeedScreen({ isFocused }: FeedScreenProps) {
  const styles = makeStyles(useTheme<MD3Theme>())
  const [filter, setFilter] = useState<FilterValue>('all')
  const { sections, isSyncing, syncWithNetwork, refreshLocal } = useFeeds(filter, isFocused)
  const [addNewSource, setAddNewSource] = useState<boolean>(false)
  const { onScroll } = useScrollAnimation()

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()

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
          <View style={styles.sectionHeader}>
            <Text variant="titleLarge" style={styles.sectionTitle}>
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
            <Text variant="headlineSmall" style={styles.emptyTitle}>
              No articles found
            </Text>
            <Text variant="bodyMedium" style={styles.bookmarksEmptyTitle}>
              {filter === 'bookmarks'
                ? 'No bookmark articles yet.'
                : 'Add new feeds by clicking on the plus button'}
            </Text>
          </View>
        }
      />
      <AddNewSource
        visible={addNewSource}
        setVisible={setAddNewSource}
        onSourceAdded={refreshLocal}
      />
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
    sectionHeader: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      backgroundColor: theme.colors.background,
    },
    sectionTitle: { color: theme.colors.primary, fontWeight: 'bold' },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: 120,
      paddingHorizontal: spacing.xl,
    },
    emptyTitle: { color: theme.colors.onSurfaceVariant, textAlign: 'center' },
    bookmarksEmptyTitle: {
      color: theme.colors.onSurfaceVariant,
      textAlign: 'center',
      marginTop: spacing.sm,
    },
  })
