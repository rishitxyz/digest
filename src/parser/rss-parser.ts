import { parseFeed } from '@rowanmanning/feed-parser'

import { Article } from '../database/schema/article'

export const parseXMLFeed = (
  xmlString: string,
  sourceId: string,
  sourceName: string,
): Article[] => {
  const feed = parseFeed(xmlString)

  return feed.items.map((item) => ({
    id: item.id ?? '',
    title: item.title ?? sourceName,
    author: item.authors.map((author) => author.name).join(', '),
    summary: item.description,
    sourceId: sourceId,
    description: item.content ?? '',
    link: item.url,
    imageUrl: item.image?.url ?? null,
    publishedAt: item.published?.toString() ?? new Date().toString(),
    isRead: false,
    bookmarked: false,
    hasEmbeddedHtml: true,
  }))
}
