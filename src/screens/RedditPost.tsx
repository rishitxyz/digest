import React, { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'

import * as WebBrowser from 'expo-web-browser'

import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { ActivityIndicator, Appbar, Divider, List, Text, useTheme } from 'react-native-paper'

import { MarkdownText } from '../components/MarkdownText'
import { MenuAction } from '../components/Menu'
import { CommentThread } from '../components/RedditPost/CommentThread'
import { WebViewPage } from '../components/WebViewPage'
import { Article } from '../database/schema/article'
import { RootStackParamList } from '../navigation/types'
import { REDDIT_BASE_URL, fetchComments } from '../parser/reddit-json'
import * as articleService from '../services/db/article'
import { shapes, spacing } from '../theme/theme'
import { Comment } from '../types/comment'
import { getRelativeTime } from '../utils/date'

type Props = NativeStackScreenProps<RootStackParamList, 'RedditPost'>

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
      onPress: () => handleOpenArticle(`${REDDIT_BASE_URL}${post.link!}`),
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
                    <CommentThread comment={comment} theme={theme} />

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
