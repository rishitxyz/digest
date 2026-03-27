import { parseFeed } from '@rowanmanning/feed-parser'

import { Article } from '../database/schema/article'

const aggressivelyCleanEntities = (xml: string): string => {
  // 1. Globally wipe out standard typographic entities.
  // This drastically lowers the entity count without breaking the XML structure.
  let cleaned = xml
    .replace(/&nbsp;/g, ' ')
    .replace(/&#8217;/g, "'") // Right single quote
    .replace(/&#8216;/g, "'") // Left single quote
    .replace(/&#8220;/g, '"') // Left double quote
    .replace(/&#8221;/g, '"') // Right double quote
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#39;/g, "'")

  // 2. Wrap the big tags in CDATA (Now includes 'content' and 'summary' for Atom feeds)
  cleaned = cleaned.replace(
    /(<(?:content:encoded|description|content|summary)[^>]*>)([\s\S]*?)(<\/(?:content:encoded|description|content|summary)>)/gi,
    (match, openTag, content, closeTag) => {
      // Skip if already wrapped safely
      if (content.trim().startsWith('<![CDATA[')) return match

      // Decode the structural entities manually
      const decodedContent = content
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .replace(/]]>/g, ']]]]><![CDATA[>') // Escape nested CDATA closings

      return `${openTag}<![CDATA[${decodedContent}]]>${closeTag}`
    },
  )

  return cleaned
}

export const parseXMLFeed = (
  xmlString: string,
  sourceId: string,
  sourceName: string,
): Article[] => {
  // 1. Aggressively strip entities and wrap HTML blocks
  const safeXmlString = aggressivelyCleanEntities(xmlString)

  // 2. Parse the clean feed
  const feed = parseFeed(safeXmlString)

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
