import * as React from 'react'
import { View } from 'react-native'
import { Source } from '../../database/schema/source'
import { MD3Theme, Portal, Modal, useTheme, TextInput, Button } from 'react-native-paper'
import { shapes, spacing } from '../../theme/theme'
import * as sourceService from '../../services/db/source'

interface EditSourceProps {
  source: Source
  visible: boolean
  setVisible: React.Dispatch<React.SetStateAction<boolean>>
}

const EditSource = ({ source, visible, setVisible }: EditSourceProps) => {
  const [url, setUrl] = React.useState<string>(source.url)
  const [name, setName] = React.useState<string>(source.name)
  const [loading, setLoading] = React.useState<boolean>(false)
  const theme = useTheme<MD3Theme>()

  React.useEffect(() => {
    setUrl(source.url)
  }, [source])

  const handleUpdateSource = () => {
    setLoading(true)
    sourceService.updateById(source.id, { ...source, name, url })
    setLoading(false)
  }

  const handleDeleteSource = () => {
    setLoading(true)
    sourceService.deleteById(source.id)
    setLoading(false)
    setVisible(false)
  }

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={() => setVisible(false)}
        contentContainerStyle={{
          backgroundColor: theme.colors.background,
          padding: spacing.lg,
          borderRadius: shapes.extraLarge,
          marginHorizontal: spacing.xl, // Added margin so it doesn't touch screen edges
        }}
      >
        <View style={{ gap: 60 }}>
          <View style={{ gap: 10 }}>
            <TextInput
              mode="outlined"
              textContentType="name"
              label="Name"
              value={name}
              onChangeText={(text) => setName(text.trim())}
            />
            <TextInput
              mode="outlined"
              multiline
              textContentType="URL"
              label="URL"
              value={url}
              onChangeText={(text) => setUrl(text.trim())}
            />
          </View>

          {/* 1. Removed flex: 1. Let it size naturally based on the buttons inside.
            2. Added marginTop so it doesn't overlap the TextInput.
          */}
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.md }}
          >
            <View>
              <Button
                textColor={theme.colors.error}
                onTouchEnd={handleDeleteSource}
                loading={loading}
              >
                Delete
              </Button>
            </View>

            {/* 1. Removed flex: 1 here too.
              2. Changed gap to 8 for better spacing (gap 3 is extremely tight). 
            */}
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {/* Changed onTouchEnd to onPress */}
              <Button textColor={theme.colors.secondary} onTouchEnd={() => setVisible(false)}>
                Cancel
              </Button>
              <Button
                textColor={theme.colors.primary}
                onTouchEnd={handleUpdateSource}
                disabled={name === source.name && url === source.url}
                loading={loading}
              >
                Update
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </Portal>
  )
}

export default EditSource
