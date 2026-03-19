import React, { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { Text, Appbar, List, Divider, Icon, useTheme, ActivityIndicator } from 'react-native-paper'
import { spacing, shapes, fontSize } from '../theme/theme'
import { getRelativeTime } from '../utils/date'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../navigation/types'
import { fetchComments } from '../parser/reddit-json'
import * as articleService from '../services/db/article'
import { Article } from '../database/schema/article'
interface Comment {
  author: string
  body: string
  score: number
  replies?: Comment[]
}

type Props = NativeStackScreenProps<RootStackParamList, 'RedditPost'>

const CommentThread = ({ comment, depth = 0 }: { comment: Comment; depth?: number }) => {
  const theme = useTheme()
  // State to track if this specific comment's replies are visible
  const [showReplies, setShowReplies] = useState(false)

  // A simple visual indicator of depth (optional, but looks great)
  const indentStyles = {
    marginLeft: depth * 12, // Indent 12px for every layer deep
    borderLeftWidth: depth > 0 ? 1 : 0,
    borderLeftColor: theme.colors.outlineVariant,
    paddingLeft: depth > 0 ? 8 : 0,
  }

  return (
    <View style={indentStyles}>
      <List.Item
        title={() => (
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text>u/{comment.author}</Text>
            <Text style={{ fontWeight: '500' }}>
              {comment.score}
              <Icon source="arrow-up-bold" color={theme.colors.primary} size={15} />
            </Text>
          </View>
        )}
        description={comment.body}
        titleNumberOfLines={1}
        descriptionNumberOfLines={0}
        titleStyle={{ fontSize: 13, fontWeight: '500', color: theme.colors.primary }}
        descriptionStyle={{
          fontSize: fontSize.bodySmall,
          marginTop: spacing.xs,
          color: theme.colors.secondary,
        }}
      />

      {/* ── THE "LOAD MORE" LOGIC ── */}
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
            // If they clicked it, recursively render the children!
            <View style={{ marginTop: 4 }}>
              {comment.replies.map((reply, idx) => (
                <CommentThread key={`${reply.author}-${idx}`} comment={reply} depth={depth + 1} />
              ))}
            </View>
          )}
        </View>
      )}
    </View>
  )
}

export default function RedditPost({ route, navigation }: Props) {
  const { id, source } = route.params
  const [post, setPost] = useState<Article>(articleService.readById(id))
  const [comments, setComments] = useState<Comment[]>([])
  const [commentsLoading, setCommentsLoading] = useState<boolean>(Boolean(post.link))
  const theme = useTheme()

  useEffect(() => {
    let ignore = false

    async function load() {
      if (!post.link) {
        if (!ignore) setCommentsLoading(false)
        return
      }

      if (!ignore) setCommentsLoading(true)
      try {
        const postComments = await fetchComments(post.link)
        if (!ignore) setComments(postComments)
      } finally {
        if (!ignore) setCommentsLoading(false)
      }
    }

    void load()

    return () => {
      ignore = true
    }
  }, [post.link])

  const handleBookmark = () => {
    articleService.toggleBookmarked(post.id, !post.bookmarked)
    setPost({
      ...post,
      bookmarked: !post.bookmarked,
    })
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header elevated style={{ backgroundColor: theme.colors.surface }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={source.url || 'Post'} />
        <Appbar.Action
          icon={post.bookmarked ? 'bookmark-check' : 'bookmark-plus-outline'}
          onPress={handleBookmark}
        />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.author}>
          <Text variant="labelSmall" style={{ color: theme.colors.primary }}>
            {post.author}
          </Text>
          <Text variant="labelSmall">{getRelativeTime(post.publishedAt)}</Text>
        </View>
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
            {commentsLoading ? (
              <ActivityIndicator
                animating
                style={{ marginTop: spacing.sm }}
                color={theme.colors.primary}
              />
            ) : comments.length === 0 ? (
              <Text
                variant="bodyMedium"
                style={{ textAlign: 'center', color: theme.colors.onSurfaceVariant }}
              >
                No comments yet.
              </Text>
            ) : (
              comments.map((comment, idx) => (
                <React.Fragment key={idx}>
                  {/* 1. Pass the top-level comments to our new component */}
                  <CommentThread comment={comment} />

                  {/* 2. Keep the divider for top-level comments only */}
                  {idx !== comments.length - 1 && (
                    <Divider
                      style={{ backgroundColor: theme.colors.outlineVariant, marginVertical: 4 }}
                    />
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
