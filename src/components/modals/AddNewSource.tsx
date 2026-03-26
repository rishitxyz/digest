import * as React from 'react'
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native'

import Slider from '@react-native-community/slider'
import { Button, MD3Theme, Modal, Portal, Text, TextInput, useTheme } from 'react-native-paper'

import { FeedType } from '../../config/feed-source'
import { Source } from '../../database/schema/source'
import * as redditService from '../../parser/reddit-json'
import * as articleService from '../../services/db/article'
import * as sourceService from '../../services/db/source'
import { fetchRSSFeed, quickFeedCheck } from '../../services/feed-service'
import { shapes, spacing } from '../../theme/theme'

interface AddNewSourceProps {
  visible: boolean
  setVisible: React.Dispatch<React.SetStateAction<boolean>>
  preferredType: FeedType
  appendNewSource: (source: Source) => void
}

const AddNewSource = ({
  visible,
  setVisible,
  preferredType,
  appendNewSource,
}: AddNewSourceProps) => {
  const [sourceType, setSourceType] = React.useState<FeedType>(preferredType)
  const [source, setSource] = React.useState<string>('')
  const [sourceUrl, setSourceUrl] = React.useState<string>('')
  const [sliding, setSliding] = React.useState<boolean>(false)
  const [qty, setQty] = React.useState<number>(3)
  const [loading, setLoading] = React.useState<boolean>(false)
  const theme = useTheme<MD3Theme>()

  React.useEffect(() => {
    setSourceType(preferredType)
  }, [preferredType])

  const cleanupInput = (text: string): string => text.trim().toLowerCase()

  const resetStates = () => {
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
        name: source,
        type: finalType,
        url: sourceType === FeedType.SUB_REDDIT ? `r/${finalUrl}` : finalUrl,
        qty,
      })

      if (finalType === FeedType.RSS) {
        articleService.save(await fetchRSSFeed(newSource))
      } else {
        articleService.save(await redditService.fetchPosts(newSource))
      }
      appendNewSource(newSource)
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
                <View style={{ gap: 6 }}>
                  <Text variant="labelMedium">NAME</Text>
                  <TextInput
                    mode="outlined"
                    textContentType="name"
                    // label="Give it a name"
                    value={source}
                    maxLength={15}
                    onChangeText={(text) => setSource(text)}
                    style={styles.input}
                    placeholder={sourceType === FeedType.RSS ? 'The Verge' : 'Android'}
                  />
                </View>

                <View style={{ gap: 6 }}>
                  <Text variant="labelMedium">
                    {sourceType === FeedType.RSS ? 'URL' : 'Subreddit name'}
                  </Text>
                  <TextInput
                    mode="outlined"
                    textContentType="URL"
                    value={sourceUrl}
                    onChangeText={(text) => setSourceUrl(cleanupInput(text))}
                    style={styles.input}
                    placeholder={
                      sourceType === FeedType.RSS
                        ? 'https://www.theverge.com/rss/index.xml'
                        : 'r/android'
                    }
                    multiline={sourceType === FeedType.RSS}
                  />
                </View>
                <View style={{ gap: 6 }}>
                  <Text variant="labelMedium">
                    POSTS ON HOMESCREEN:{' '}
                    <Text variant="labelLarge">{sliding ? 'STOP SLIDING!' : qty}</Text>
                  </Text>
                  <View style={{ paddingBottom: spacing.lg }}>
                    <Slider
                      value={qty}
                      minimumValue={0}
                      lowerLimit={1}
                      maximumValue={5}
                      step={1}
                      minimumTrackTintColor={theme.colors.primary}
                      maximumTrackTintColor={theme.colors.surfaceVariant}
                      thumbTintColor={theme.colors.primary}
                      onSlidingStart={() => setSliding(true)}
                      onSlidingComplete={(value) => {
                        setSliding(false)
                        setQty(value)
                      }}
                    />
                  </View>
                </View>
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
                  icon="arrow-right"
                  contentStyle={{ flexDirection: 'row-reverse', justifyContent: 'center' }}
                >
                  Add Source
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
      paddingTop: 70,
    },
    modalContainer: {
      backgroundColor: theme.colors.background,
      padding: spacing.xl,
      borderRadius: shapes.large,
    },
    title: {
      fontWeight: 'bold',
      color: theme.colors.onSurface,
      marginBottom: spacing.lg,
    },
    formContainer: {
      gap: 10,
    },
    segmentedButtons: {
      marginBottom: spacing.md,
    },
    input: {
      marginBottom: spacing.md,
      backgroundColor: theme.colors.surfaceVariant, // Ensures background matches modal
    },
    actionContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: spacing.sm,
    },
    addButton: {
      marginLeft: spacing.sm,
    },
  })

export default AddNewSource
