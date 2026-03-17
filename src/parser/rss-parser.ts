import { XMLParser } from 'fast-xml-parser'
import { Article } from '../database/schema/article'

export const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  textNodeName: '#text',
})

const safeExtractString = (field: any): string => {
  if (!field) return ''

  // 1. If it's already a string, perfect.
  if (typeof field === 'string') return field

  // 2. If the parser nested it inside a #text or CDATA property
  if (field['#text']) return field['#text']
  if (field.CDATA) return field.CDATA

  // 3. If it's an array (sometimes happens with multiple description tags)
  if (Array.isArray(field)) {
    return safeExtractString(field[0])
  }

  // 4. Fallback: stringify it so `.replace` won't crash, though it might look messy
  if (typeof field === 'object') {
    // If it's a complex object we didn't anticipate, grab its values
    const values = Object.values(field).join(' ')
    if (values) return values

    return JSON.stringify(field)
  }

  return String(field)
}

export const parseXMLFeed = async (xmlString: string, sourceId: string): Promise<Article[]> => {
  const jsonObj = parser.parse(xmlString)
  const rawItems = jsonObj?.rss?.channel?.item || jsonObj?.feed?.entry || []
  const itemsArray = Array.isArray(rawItems) ? rawItems : [rawItems]

  return itemsArray.map((item: any) => {
    // 1. Defensively extract the raw string first
    const rawDescription = safeExtractString(
      item.description || item.content || item['content:encoded'] || '',
    )

    // 2. Now it is guaranteed to be a string, so we can safely run regex on it
    const cleanDescription =
      rawDescription
        .replace(/(<([^>]+)>)/gi, '') // Strip HTML tags
        .replace(/&nbsp;/g, ' ') // Clean up common HTML entities
        .replace(/\n+/g, ' ') // Remove excessive line breaks
        .trim()
        .substring(0, 150) + '...' // Truncate for the FeedCard

    return {
      id: item.guid?.['#text'] || item.guid || item.id || Math.random().toString(36).substring(7),
      title: safeExtractString(item.title) || 'No Title',
      author: '',
      summary: '',
      sourceId: sourceId,
      description: cleanDescription,
      link: typeof item.link === 'string' ? item.link : item.link?.['@_href'] || '',
      publishedAt: item.pubDate || item.published || new Date().toISOString(),
      imageUrl: item.enclosure?.['@_url'] || item['media:content']?.['@_url'],
      isRead: false,
      bookmarked: false,
    }
  })
}
