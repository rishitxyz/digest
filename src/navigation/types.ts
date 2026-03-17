import { Source } from '../database/schema/source'
import { Article } from '../database/schema/article'

export type RootStackParamList = {
  // The main screen with the bottom tabs
  MainTabs: undefined
  // The new screen to read the full article. We pass the whole item to it.
  ArticleDetail: { source: Source; article: Article }
  // The new screen to read reddit posts with comments.
  RedditPost: { source: Source; post: Article }
  // The new screen to get all articles/posts for a source.
  AllArticles: { source: Source }
}
