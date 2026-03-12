import { FeedItem } from '../services/mockData';

export type RootStackParamList = {
  // The main screen with the bottom tabs
  MainTabs: undefined; 
  // The new screen to read the full article. We pass the whole item to it.
  ArticleDetail: { article: FeedItem }; 
};