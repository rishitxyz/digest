import React, { useState } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'

import { ActivityIndicator, Appbar, MD3Theme, Text, useTheme } from 'react-native-paper'

import { SourceCard } from '../components/Sources/SourceCard'
import EditSource from '../components/modals/EditSource'
import { Source } from '../database/schema/source'
import * as sourceService from '../services/db/source'
import { fontSize, shapes, spacing } from '../theme/theme'

interface SourcesListProps {
  isFocused: boolean
}

export default function SourcesList({ isFocused }: SourcesListProps) {
  const [rssSources, setRssSources] = useState<Source[]>([])
  const [subRedditSources, setSubRedditSources] = useState<Source[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  // Track the ACTUAL source the user clicked on, not just a true/false boolean
  const [selectedSource, setSelectedSource] = useState<Source | null>(null)

  const theme = useTheme<MD3Theme>()

  React.useEffect(() => {
    if (isFocused) {
      setLoading(true)
      const sources = sourceService.getAllSources()
      setRssSources(sources.rss)
      setSubRedditSources(sources.subReddits)
      setLoading(false)
    }
  }, [isFocused])

  // Pass the specific source when clicked
  const handleEditSource = (source: Source) => {
    setSelectedSource(source)
  }

  // Handle closing the modal by clearing the selected source
  const handleCloseModal = () => {
    setSelectedSource(null)
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header elevated style={{ backgroundColor: theme.colors.surface }}>
        <Appbar.Content
          title="Sources"
          titleStyle={{
            fontWeight: '700',
            fontSize: fontSize.headlineSmall,
            color: theme.colors.onSurface,
          }}
        />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {loading ? (
          <ActivityIndicator animating={true} color={theme.colors.primary} />
        ) : (
          <View>
            {rssSources.length > 0 && (
              <View key="rss-view" style={{ marginVertical: spacing.lg }}>
                <>
                  <Text variant="headlineMedium">RSS feeds</Text>
                  {rssSources.map((source, index) => (
                    <SourceCard key={index} source={source} icon="rss" onPress={handleEditSource} />
                  ))}
                </>
              </View>
            )}
            <View>
              {subRedditSources.length > 0 && (
                <>
                  <Text variant="headlineMedium">Subreddit feeds</Text>
                  {subRedditSources.map((source, index) => (
                    <SourceCard
                      key={index}
                      source={source}
                      icon="reddit"
                      onPress={handleEditSource}
                    />
                  ))}
                </>
              )}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Render ONE single modal down here, outside the ScrollView entirely.
        It only shows up if selectedSource is NOT null.
      */}
      {selectedSource && (
        <EditSource
          source={selectedSource}
          visible={!!selectedSource} // true if selectedSource exists
          setVisible={handleCloseModal} // pass the close handler
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    flexGrow: 1,
    justifyContent: 'flex-start',
  },
  listView: {
    borderRadius: shapes.extraLarge,
    borderWidth: 2,
    width: '100%',
  },
})
