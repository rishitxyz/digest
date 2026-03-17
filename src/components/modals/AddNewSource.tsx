import * as React from 'react'
import { View } from 'react-native'
import {
  Button,
  MD3Theme,
  Modal,
  Portal,
  SegmentedButtons,
  TextInput,
  useTheme,
} from 'react-native-paper'
import { FeedType } from '../../config/feed-source'
import { shapes, spacing } from '../../theme/theme'
import * as sourceService from '../../services/db/source'
import * as articleService from '../../services/db/article'
import { fetchRSSFeed, quickFeedCheck } from '../../services/feed-service'
import * as redditService from '../../parser/reddit-json'

interface AddNewSourceProps {
  visible: boolean
  setVisible: React.Dispatch<React.SetStateAction<boolean>>
  onSourceAdded: () => void
}

const AddNewSource = ({ visible, setVisible, onSourceAdded }: AddNewSourceProps) => {
  const [sourceType, setSourceType] = React.useState<FeedType>(FeedType.RSS)
  const [source, setSource] = React.useState<string>()
  const [sourceUrl, setSourceUrl] = React.useState<string>()
  const [loading, setLoading] = React.useState<boolean>(false)
  const theme = useTheme<MD3Theme>()

  const addNewSource = async () => {
    if (source === undefined || source === null || source === '' || sourceUrl === undefined)
      throw new Error('Invalid source name.')
    setLoading(true)

    try {
      let finalType = sourceType
      let finalUrl = sourceUrl

      if (sourceType === FeedType.RSS && sourceUrl) {
        const validation = await quickFeedCheck(sourceUrl)

        if (!validation.isValid) {
          throw new Error(validation.error)
        }

        finalType = validation.type
        finalUrl = validation.finalUrl
      }

      const newSource = sourceService.insertNew({
        id: source.trim().toLowerCase(),
        name: source,
        type: finalType,
        url: sourceType === FeedType.SUB_REDDIT ? `r/${finalUrl!}` : finalUrl!,
      })
      if (finalType === FeedType.RSS) articleService.save(await fetchRSSFeed(newSource))
      else articleService.save(await redditService.fetchPosts(newSource))
    } catch (error) {
      console.log(error)
      throw new Error('Failed to add new source.')
    } finally {
      setLoading(false)
      setVisible(false)
      onSourceAdded()
    }
  }

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={() => setVisible(false)}
        contentContainerStyle={{
          backgroundColor: theme.colors.background,
          padding: 20,
          borderRadius: shapes.extraLarge,
        }}
      >
        <View style={{ gap: 15 }}>
          <SegmentedButtons
            value={sourceType}
            onValueChange={(val) => setSourceType(val as FeedType)}
            buttons={[
              {
                value: FeedType.RSS,
                label: 'RSS',
                icon: 'rss',
                checkedColor: theme.colors.onPrimaryContainer,
                uncheckedColor: theme.colors.onSurfaceVariant,
              },
              {
                value: FeedType.SUB_REDDIT,
                label: 'Subreddit',
                icon: 'reddit',
                checkedColor: theme.colors.onPrimaryContainer,
                uncheckedColor: theme.colors.onSurfaceVariant,
              },
            ]}
          />
          <TextInput
            mode="outlined"
            textContentType="name"
            label="Give it a name"
            value={source}
            onChangeText={(text) => setSource(text)}
            left={<TextInput.Affix text={sourceType === FeedType.SUB_REDDIT ? 'r/' : ''} />}
          />
          <TextInput
            mode="outlined"
            textContentType="URL"
            label={sourceType === FeedType.RSS ? 'Feed URL' : 'Subreddit name'}
            value={sourceUrl}
            onChangeText={(text) => {
              text.trim()
              text = text.toLowerCase()
              setSourceUrl(text)
            }}
            left={<TextInput.Affix text={sourceType === FeedType.SUB_REDDIT ? 'r/' : ''} />}
          />
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', paddingTop: spacing.lg }}>
          <Button onTouchEnd={() => setVisible(false)}>Cancel</Button>
          <Button
            mode="contained"
            onTouchEnd={addNewSource}
            disabled={source === undefined || source === null || source === ''}
            loading={loading}
          >
            Add
          </Button>
        </View>
      </Modal>
    </Portal>
  )
}

export default AddNewSource
