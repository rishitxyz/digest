import React, { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { Text, Appbar, List, Divider, Icon, useTheme, ActivityIndicator } from 'react-native-paper'
import * as WebBrowser from 'expo-web-browser'
import { spacing, shapes, fontSize } from '../theme/theme'
import { getRelativeTime } from '../utils/date'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../navigation/types'
import { fetchComments } from '../parser/reddit-json'
import * as articleService from '../services/db/article'
import { Article } from '../database/schema/article'
import { MarkdownText } from '../components/MarkdownText'
import { WebViewPage } from '../components/WebViewPage'
import { MenuAction } from '../components/Menu'
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
    marginLeft: depth * 6, // Indent 12px for every layer deep
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
            <Text>u/{comment.author}</Text>
            <Text style={{ fontWeight: '500' }}>
              {comment.score}
              <Icon source="arrow-up-bold" color={theme.colors.primary} size={15} />
            </Text>
          </View>
        )}
        description={
          <MarkdownText
            markdown={comment.body}
            markdownStyle={{ paragraph: { fontSize: 13 }, list: { fontSize: 13 } }}
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
            <View style={{ marginTop: 2 }}>
              {comment.replies.map((reply, idx) => (
                <React.Fragment key={`comment-thread-${idx}`}>
                  <CommentThread key={`${reply.author}-${idx}`} comment={reply} depth={depth + 1} />
                  <Divider
                    style={{ backgroundColor: theme.colors.outlineVariant, marginVertical: 2 }}
                  />
                </React.Fragment>
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
  const [openMenu, setOpenMenu] = useState<boolean>(false)
  const theme = useTheme()

  type ViewMode = 'reader' | 'link' | 'original'
  const [viewMode, setViewMode] = useState<ViewMode>(post.hasEmbeddedHtml ? 'link' : 'reader')

  const viewModeOptions: {
    key: ViewMode
    title: string
    onPress: () => void
    disabled: boolean
  }[] = [
    {
      key: 'reader',
      title: 'Reader',
      onPress: () => setViewMode('reader'),
      disabled: viewMode === 'reader',
    },
    {
      key: 'original',
      title: 'Open in browser',
      onPress: () => handleOpenArticle(`https://www.reddit.com${post.link!}`),
      disabled: viewMode === 'original',
    },
    {
      key: 'link',
      title: 'WebView',
      onPress: () => setViewMode('link'),
      disabled: viewMode === 'link',
    },
  ]

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

  const handleOpenArticle = async (link: string) => {
    if (!post.link) return

    try {
      await WebBrowser.openBrowserAsync(link, {
        toolbarColor: theme.colors.surface,
        controlsColor: theme.colors.primary,

        // Optional iOS presentation style (MODAL makes it slide up nicely)
        presentationStyle: WebBrowser.WebBrowserPresentationStyle.PAGE_SHEET,
      })
    } catch (error) {
      console.error("Couldn't open browser:", error)
    }
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
        <MenuAction
          visible={openMenu}
          setVisible={setOpenMenu}
          anchor={<Appbar.Action icon="dots-vertical" onTouchEnd={() => setOpenMenu(!openMenu)} />}
          menuOptions={viewModeOptions}
        />
      </Appbar.Header>

      {['link', 'original'].includes(viewMode) ? (
        <WebViewPage
          link={viewMode === 'link' ? post.description : post.link!}
          style={{ flex: 1 }}
        />
      ) : (
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
          <View>
            <MarkdownText markdown={post.description} />
          </View>

          <Divider
            style={{
              backgroundColor: theme.colors.outlineVariant,
              marginTop: spacing.md,
              height: 2,
            }}
          />

          <View>
            <Text
              style={{ marginVertical: spacing.md, color: theme.colors.primary, fontWeight: '600' }}
            >
              Comments
            </Text>
            <List.Section style={{ marginLeft: -8 }}>
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
                        style={{ backgroundColor: theme.colors.outlineVariant, marginVertical: 2 }}
                      />
                    )}
                  </React.Fragment>
                ))
              )}
            </List.Section>
          </View>
        </ScrollView>
      )}
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
