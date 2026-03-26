import React, { useState } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'

import {
  ActivityIndicator,
  Appbar,
  Icon,
  IconButton,
  MD3Theme,
  Text,
  useTheme,
} from 'react-native-paper'

import { SourceCard } from '../components/Sources/SourceCard'
import AddNewSource from '../components/modals/AddNewSource'
import { FeedType } from '../config/feed-source'
import { useSources } from '../hooks/useSources'
import { fontSize, shapes, spacing } from '../theme/theme'

interface SourcesListProps {
  isFocused: boolean
}

export default function SourcesList({ isFocused }: SourcesListProps) {
  const { rssSources, redditSources, fetchAllSources, appendNewSource, deleteSource } = useSources()
  const [loading, setLoading] = useState<boolean>(false)
  const [editing, setEditing] = useState<boolean>(false)
  const [addNewSource, setAddNewSource] = useState<boolean>(false)
  const [preferredType, setPreferredType] = useState<FeedType>(FeedType.RSS)

  const theme = useTheme<MD3Theme>()

  React.useEffect(() => {
    if (isFocused) {
      setLoading(true)
      fetchAllSources()
      setLoading(false)
    }
  }, [isFocused])

  const handleOpenModal = (feedType: FeedType) => {
    setPreferredType(feedType)
    setAddNewSource(true)
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
        <Appbar.Action
          icon={({ size, color }) => (
            <Icon source={!editing ? 'pencil' : 'check'} size={size} color={color} />
          )}
          onPress={() => setEditing(!editing)}
        />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {loading ? (
          <ActivityIndicator animating={true} color={theme.colors.primary} />
        ) : (
          <View>
            <View style={{ marginVertical: spacing.lg }}>
              <View style={styles.sourceHeading}>
                <Text variant="headlineMedium">RSS feeds</Text>
                <IconButton
                  animated
                  icon="plus-circle"
                  iconColor={theme.colors.primary}
                  onPress={() => handleOpenModal(FeedType.RSS)}
                  disabled={editing}
                />
              </View>
              {rssSources.map((source, index) => (
                <SourceCard
                  key={index}
                  source={source}
                  icon="rss"
                  editing={editing}
                  onDeleteSource={() => deleteSource(source)}
                />
              ))}
              {rssSources.length === 0 && <Text variant="bodyLarge">Try adding a new one!</Text>}
            </View>
            <View>
              <View style={{ marginVertical: spacing.lg }}>
                <View style={styles.sourceHeading}>
                  <Text variant="headlineMedium">Subreddit feeds</Text>
                  <IconButton
                    animated
                    icon="plus-circle"
                    iconColor={theme.colors.primary}
                    onPress={() => handleOpenModal(FeedType.SUB_REDDIT)}
                    disabled={editing}
                  />
                </View>
                {redditSources.map((source, index) => (
                  <SourceCard
                    key={index}
                    source={source}
                    icon="reddit"
                    editing={editing}
                    onDeleteSource={() => deleteSource(source)}
                  />
                ))}
                {redditSources.length === 0 && (
                  <Text variant="bodyLarge">Try adding a new one!</Text>
                )}
              </View>
            </View>
          </View>
        )}
      </ScrollView>
      <AddNewSource
        visible={addNewSource}
        setVisible={setAddNewSource}
        preferredType={preferredType}
        appendNewSource={appendNewSource}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  sourceHeading: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
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
