import { Source } from '../database/schema/source'

export type RootStackParamList = {
  // The main screen with the bottom tabs
  MainTabs: undefined
  // The new screen to read the full article. We pass the whole item to it.
  ArticleDetail: { source: Source; id: string }
  // The new screen to read reddit posts with comments.
  RedditPost: { source: Source; id: string }
  // The new screen to get all articles/posts for a source.
  AllArticles: { source: Source }
}
