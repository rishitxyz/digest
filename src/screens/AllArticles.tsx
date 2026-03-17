import { ScrollView, StyleSheet, View } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React, { useEffect, useState } from 'react'
import { RootStackParamList } from '../navigation/types'
import { Article } from '../database/schema/article'
import { ActivityIndicator, Appbar, List, useTheme } from 'react-native-paper'
import { spacing, shapes } from '../theme/theme'
import { FeedType } from '../config/feed-source'
import * as articleService from '../services/db/article'
import FeedCard from '../components/FeedCard'

type Props = NativeStackScreenProps<RootStackParamList, 'AllArticles'>

export default function AllArticles({ route, navigation }: Props) {
  const { source, handleCardPress, toggleBookmarkedCall } = route.params
  const [items, setItems] = useState<Article[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  const theme = useTheme()

  useEffect(() => {
    setLoading(true)
    setItems(articleService.getAllBySourceId(source.id))
    setLoading(false)
  }, [source])

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
                onPress={() => handleCardPress(source, item)}
                onToggleFavorite={() => toggleBookmarkedCall(item)}
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
  content: {},
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
