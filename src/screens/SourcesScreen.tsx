import React, { useState } from 'react'
import { View, StyleSheet, ScrollView } from 'react-native'
import { Appbar, Divider, List, MD3Theme, useTheme, ActivityIndicator } from 'react-native-paper'
import { spacing, shapes } from '../theme/theme'
import { Source } from '../database/schema/source'
import * as sourceService from '../services/db/source'
import EditSource from '../components/modals/EditSource'

interface SourcesListScreenProps {
  isFocused: boolean
}

export default function SourcesListScreen({ isFocused }: SourcesListScreenProps) {
  const [sources, setSources] = useState<Source[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  // Track the ACTUAL source the user clicked on, not just a true/false boolean
  const [selectedSource, setSelectedSource] = useState<Source | null>(null)

  const theme = useTheme<MD3Theme>()

  React.useEffect(() => {
    if (isFocused) {
      setLoading(true)
      setSources(sourceService.getAllSources())
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
            fontSize: 24,
            color: theme.colors.onSurface,
          }}
        />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {loading ? (
          <ActivityIndicator animating={true} color={theme.colors.primary} />
        ) : (
          <View
            style={[
              styles.listView,
              { borderColor: theme.colors.outlineVariant, padding: spacing.lg },
            ]}
          >
            <List.Section>
              {sources.map((source, index) => (
                <React.Fragment key={source.id}>
                  <List.Item
                    title={source.name}
                    titleStyle={{ fontWeight: '600' }}
                    left={() => <List.Icon icon="pencil-box" />}
                    // Swapped onTouchEnd for onPress, and passed the current source!
                    onPress={() => handleEditSource(source)}
                  />

                  {index !== sources.length - 1 && (
                    <Divider style={{ backgroundColor: theme.colors.outlineVariant }} />
                  )}
                </React.Fragment>
              ))}
            </List.Section>
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
