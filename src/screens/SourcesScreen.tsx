import React, { useState } from 'react'
import { View, StyleSheet, ScrollView } from 'react-native'
import {
  Appbar,
  Divider,
  List,
  Text,
  MD3Theme,
  useTheme,
  ActivityIndicator,
} from 'react-native-paper'
import { spacing, shapes, fontSize } from '../theme/theme'
import { Source } from '../database/schema/source'
import * as sourceService from '../services/db/source'
import EditSource from '../components/modals/EditSource'

interface SourcesListScreenProps {
  isFocused: boolean
}

export default function SourcesListScreen({ isFocused }: SourcesListScreenProps) {
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
              <View key="rss-view">
                <List.Section key="rss-list-section">
                  <List.Subheader
                    key="rss-list-header"
                    style={{ fontSize: fontSize.bodyLarge, fontWeight: 700 }}
                  >
                    <Text>RSS feeds</Text>
                  </List.Subheader>
                  {rssSources.map((source, index) => (
                    <React.Fragment key={source.id}>
                      <List.Item
                        title={source.name}
                        titleStyle={{ fontSize: fontSize.bodyMedium, fontWeight: '500' }}
                        left={() => <List.Icon icon="pencil-box" />}
                        // Swapped onTouchEnd for onPress, and passed the current source!
                        onPress={() => handleEditSource(source)}
                      />

                      {index !== rssSources.length - 1 && (
                        <Divider style={{ backgroundColor: theme.colors.outlineVariant }} />
                      )}
                    </React.Fragment>
                  ))}
                </List.Section>
              </View>
            )}
            <View>
              {subRedditSources.length > 0 && (
                <List.Section key="subreddit-list-section">
                  <List.Subheader
                    key="subreddit-list-header"
                    style={{ fontSize: fontSize.bodyLarge, fontWeight: 700 }}
                  >
                    <Text>SubReddit feeds</Text>
                  </List.Subheader>
                  {subRedditSources.map((source, index) => (
                    <React.Fragment key={source.id}>
                      <List.Item
                        title={source.name}
                        titleStyle={{ fontSize: fontSize.bodyMedium, fontWeight: '500' }}
                        left={() => <List.Icon icon="reddit" />}
                        // Swapped onTouchEnd for onPress, and passed the current source!
                        onPress={() => handleEditSource(source)}
                      />

                      {index !== rssSources.length - 1 && (
                        <Divider style={{ backgroundColor: theme.colors.outlineVariant }} />
                      )}
                    </React.Fragment>
                  ))}
                </List.Section>
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
