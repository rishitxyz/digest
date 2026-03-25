import * as React from 'react'
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native'

import {
  Button,
  MD3Theme,
  Modal,
  Portal,
  SegmentedButtons,
  Text,
  TextInput,
  useTheme,
} from 'react-native-paper'

import { FeedType } from '../../config/feed-source'
import * as redditService from '../../parser/reddit-json'
import * as articleService from '../../services/db/article'
import * as sourceService from '../../services/db/source'
import { fetchRSSFeed, quickFeedCheck } from '../../services/feed-service'
import { shapes, spacing } from '../../theme/theme'

interface AddNewSourceProps {
  visible: boolean
  setVisible: React.Dispatch<React.SetStateAction<boolean>>
  onSourceAdded: () => void
}

const AddNewSource = ({ visible, setVisible, onSourceAdded }: AddNewSourceProps) => {
  const [sourceType, setSourceType] = React.useState<FeedType>(FeedType.RSS)
  const [source, setSource] = React.useState<string>('')
  const [sourceUrl, setSourceUrl] = React.useState<string>('')
  const [loading, setLoading] = React.useState<boolean>(false)
  const theme = useTheme<MD3Theme>()

  const cleanupInput = (text: string): string => text.trim().toLowerCase()

  const resetStates = () => {
    setSourceType(FeedType.RSS)
    setSource('')
    setSourceUrl('')
    setLoading(false)
  }

  const handleDismiss = () => {
    setVisible(false)
    resetStates()
  }

  const addNewSource = async () => {
    if (!source || !sourceUrl) return // Don't throw an error, just return early

    setLoading(true)

    try {
      let finalType = sourceType
      let finalUrl = sourceUrl

      if (sourceType === FeedType.RSS) {
        const validation = await quickFeedCheck(sourceUrl)
        if (!validation.isValid) {
          throw new Error(validation.error)
        }
        finalType = validation.type
        finalUrl = validation.finalUrl
      }

      const newSource = sourceService.insertNew({
        id: cleanupInput(source),
        name: sourceType === FeedType.SUB_REDDIT ? `r/${source}` : source,
        type: finalType,
        url: sourceType === FeedType.SUB_REDDIT ? `r/${finalUrl}` : finalUrl,
      })

      if (finalType === FeedType.RSS) {
        articleService.save(await fetchRSSFeed(newSource))
      } else {
        articleService.save(await redditService.fetchPosts(newSource))
      }

      onSourceAdded() // Call success callback
      handleDismiss() // Close and reset
    } catch (error) {
      console.log(error)
      // You should show a Snackbar here instead of throwing an error!
    } finally {
      setLoading(false)
    }
  }

  // Generate dynamic styles based on the theme
  const styles = React.useMemo(() => makeStyles(theme), [theme])

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={handleDismiss}
        dismissable
        dismissableBackButton
        contentContainerStyle={styles.modalContainer}
        style={styles.modalOverlay}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View>
              <Text variant="headlineSmall" style={styles.title}>
                Add new source
              </Text>

              <View style={styles.formContainer}>
                <SegmentedButtons
                  value={sourceType}
                  onValueChange={(val) => setSourceType(val as FeedType)}
                  buttons={[
                    {
                      value: FeedType.RSS,
                      label: 'RSS',
                      icon: 'rss',
                    },
                    {
                      value: FeedType.SUB_REDDIT,
                      label: 'Subreddit',
                      icon: 'reddit',
                    },
                  ]}
                  style={styles.segmentedButtons}
                />

                <TextInput
                  mode="outlined"
                  textContentType="name"
                  label="Give it a name"
                  value={source}
                  maxLength={15}
                  onChangeText={(text) =>
                    setSource(sourceType === FeedType.SUB_REDDIT ? cleanupInput(text) : text)
                  }
                  left={sourceType === FeedType.SUB_REDDIT ? <TextInput.Affix text="r/" /> : null}
                  style={styles.input}
                />

                <TextInput
                  mode="outlined"
                  textContentType="URL"
                  label={sourceType === FeedType.RSS ? 'Feed URL' : 'Subreddit name'}
                  value={sourceUrl}
                  onChangeText={(text) => setSourceUrl(cleanupInput(text))}
                  left={sourceType === FeedType.SUB_REDDIT ? <TextInput.Affix text="r/" /> : null}
                  style={styles.input}
                />
              </View>

              <View style={styles.actionContainer}>
                <Button onPress={handleDismiss} textColor={theme.colors.primary}>
                  Cancel
                </Button>
                <Button
                  mode="contained"
                  onPress={addNewSource}
                  disabled={!source || !sourceUrl || loading}
                  loading={loading}
                  style={styles.addButton}
                >
                  Add
                </Button>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </Modal>
    </Portal>
  )
}

// Extract styles to keep JSX clean
const makeStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    // display modal near top edge.
    modalOverlay: {
      paddingHorizontal: spacing.lg,
      justifyContent: 'flex-start',
      paddingTop: 80,
    },
    modalContainer: {
      backgroundColor: theme.colors.surface,
      padding: spacing.xl,
      borderRadius: shapes.extraLarge,
    },
    title: {
      fontWeight: 'bold',
      color: theme.colors.onSurface,
      marginBottom: spacing.lg,
    },
    formContainer: {
      // Replaced 'gap' with standard margin-bottom on children for better RN support
    },
    segmentedButtons: {
      marginBottom: spacing.md,
    },
    input: {
      marginBottom: spacing.md,
      backgroundColor: theme.colors.surface, // Ensures background matches modal
    },
    actionContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginTop: spacing.sm,
    },
    addButton: {
      marginLeft: spacing.sm,
    },
  })

export default AddNewSource
