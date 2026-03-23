import React, { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'

import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { ActivityIndicator, Appbar, List, useTheme } from 'react-native-paper'

import FeedCard from '../components/FeedCard'
import { FeedType } from '../config/feed-source'
import { Article } from '../database/schema/article'
import { RootStackParamList } from '../navigation/types'
import * as articleService from '../services/db/article'
import { shapes, spacing } from '../theme/theme'

type Props = NativeStackScreenProps<RootStackParamList, 'AllArticles'>

export default function AllArticles({ route, navigation }: Props) {
  const { source } = route.params
  const [items, setItems] = useState<Article[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  const theme = useTheme()

  useEffect(() => {
    setLoading(true)
    setItems(articleService.getAllBySourceId(source.id))
    setLoading(false)
  }, [source])

  const handleCardPress = (article: Article) => {
    if (!article.isRead) articleService.markArticleAsRead(article.id)

    if (source.type === FeedType.SUB_REDDIT)
      navigation.navigate('RedditPost', { source, post: article })
    else navigation.navigate('ArticleDetail', { source, article })
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header elevated style={{ backgroundColor: theme.colors.surface }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={source.type === FeedType.SUB_REDDIT ? source.url : source.name} />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.content}>
        {loading ? (
          <ActivityIndicator animating />
        ) : (
          <List.Section>
            {items.map((item) => (
              <FeedCard
                key={item.id}
                source={source}
                article={item}
                onPress={() => handleCardPress(item)}
              />
            ))}
          </List.Section>
        )}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    paddingHorizontal: spacing.md,
  },
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
