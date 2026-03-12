export interface FeedItem {
  id: string;
  title: string;
  source: string;
  timestamp: string;
  description: string;
  image: string;
  isRead: boolean;
  isFavorite: boolean;
  link?: string
}

export interface GroupedFeedItem {
  source: string
  feedItems: FeedItem[]
}