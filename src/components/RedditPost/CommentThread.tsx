import { Fragment, useState } from 'react'
import { View } from 'react-native'

import { Divider, Icon, List, MD3Theme, Text } from 'react-native-paper'

import { fontSize, spacing } from '../../theme/theme'
import { Comment } from '../../types/comment'
import { MarkdownText } from '../MarkdownText'

interface CommentThreadProps {
  comment: Comment
  depth?: number
  theme: MD3Theme
}

export const CommentThread = ({ comment, depth = 0, theme }: CommentThreadProps) => {
  const [showReplies, setShowReplies] = useState(false)

  const indentStyles = {
    marginLeft: depth * 6, // Indent 6px for every layer deep
    borderLeftWidth: depth > 0 ? 1 : 0,
    borderLeftColor: theme.colors.outlineVariant,
    paddingLeft: depth > 0 ? 4 : 0,
  }

  return (
    <View style={indentStyles}>
      <List.Item
        title={() => (
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <Text variant="bodyMedium">u/{comment.author}</Text>
            <Text variant="bodyMedium">
              {comment.score}
              <Icon source="arrow-up-bold" color={theme.colors.primary} size={15} />
            </Text>
          </View>
        )}
        description={
          <MarkdownText
            markdown={comment.body}
            markdownStyle={{
              paragraph: { fontSize: fontSize.bodyMedium },
              list: { fontSize: fontSize.bodyMedium },
            }}
          />
        }
        descriptionNumberOfLines={0}
        titleStyle={{ fontSize: 13, fontWeight: '500', color: theme.colors.primary }}
        descriptionStyle={{
          fontSize: fontSize.bodySmall,
          marginTop: spacing.xs,
          color: theme.colors.secondary,
        }}
      />

      {/* THE LOAD MORE LOGIC */}
      {comment.replies && comment.replies.length > 0 && (
        <View style={{ paddingLeft: 16 }}>
          {!showReplies ? (
            <Text
              variant="labelMedium"
              style={{ color: theme.colors.primary, paddingVertical: 4 }}
              onPress={() => setShowReplies(true)}
            >
              Load {comment.replies.length} repl{comment.replies.length === 1 ? 'y' : 'ies'}...
            </Text>
          ) : (
            // Render replies recursively.
            <View style={{ marginTop: 2 }}>
              {comment.replies.map((reply, idx) => (
                <Fragment key={`comment-thread-${idx}`}>
                  <CommentThread
                    key={`${reply.author}-${idx}`}
                    comment={reply}
                    depth={depth + 1}
                    theme={theme}
                  />
                  <Divider
                    style={{ backgroundColor: theme.colors.outlineVariant, marginVertical: 2 }}
                  />
                </Fragment>
              ))}
            </View>
          )}
        </View>
      )}
    </View>
  )
}
