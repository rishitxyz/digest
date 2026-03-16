import React, { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { Text, Appbar, List, Divider, Icon, useTheme } from 'react-native-paper'
import { spacing, shapes, fontSize } from '../theme/theme'
import { getRelativeTime } from '../utils/date'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../navigation/types'
import { fetchComments } from '../parser/reddit-json'

type Props = NativeStackScreenProps<RootStackParamList, 'RedditPost'>

interface Comment {
  author: string
  body: string
  score: number
}

export default function RedditPost({ route, navigation }: Props) {
  const { post, source } = route.params
  const [comments, setComments] = useState<Comment[]>([])
  const theme = useTheme()

  useEffect(() => {
    let ignore = false

    async function load() {
      if (!post.link) return
      const postComments = await fetchComments(post.link)
      if (!ignore) setComments(postComments)
    }

    void load()

    return () => {
      ignore = true
    }
  }, [post.link])

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header elevated style={{ backgroundColor: theme.colors.surface }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={source.url || 'Post'} />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.content}>
        <Text
          variant="headlineSmall"
          style={{ color: theme.colors.onSurface, marginBottom: spacing.md }}
        >
          {post.title}
        </Text>
        <Text
          variant="bodyLarge"
          style={{ color: theme.colors.onSurfaceVariant, marginTop: spacing.md }}
        >
          {post.description}
        </Text>
        <View style={styles.author}>
          <Text variant="labelSmall" style={{ color: theme.colors.primary }}>
            {post.author}
          </Text>
          <Text variant="labelSmall">{getRelativeTime(post.publishedAt)}</Text>
        </View>

        <Divider
          style={{
            backgroundColor: theme.colors.outlineVariant,
            marginTop: spacing.md,
            height: 2,
          }}
        />

        <View>
          <List.Section>
            <List.Subheader style={{ color: theme.colors.primary, fontWeight: '600' }}>
              Comments
            </List.Subheader>
            {comments.length === 0 ? (
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                No comments yet.
              </Text>
            ) : (
              comments.map((comment, idx) => (
                <React.Fragment key={idx}>
                  <List.Item
                    key={`${comment.author}-${idx}`}
                    title={() => (
                      <View
                        style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}
                      >
                        <Text>u/{comment.author}</Text>
                        <Text style={{ fontWeight: 500 }}>
                          {comment.score}
                          <Icon source="arrow-up-bold" color={theme.colors.primary} size={15} />
                        </Text>
                      </View>
                    )}
                    description={comment.body}
                    titleNumberOfLines={1}
                    descriptionNumberOfLines={0}
                    titleStyle={{ fontSize: 13, fontWeight: 500, color: theme.colors.primary }}
                    descriptionStyle={{
                      fontSize: fontSize.bodySmall,
                      marginTop: spacing.xs,
                      color: theme.colors.secondary,
                    }}
                  />
                  {idx !== comments.length - 1 && (
                    <Divider style={{ backgroundColor: theme.colors.outlineVariant }} />
                  )}
                </React.Fragment>
              ))
            )}
          </List.Section>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: spacing.lg },
  author: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: shapes.large,
  },
})
