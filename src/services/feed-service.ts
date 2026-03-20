import { FeedType } from '../config/feed-source'
import { SourceWithArticles } from '../database/schema'
import { Article } from '../database/schema/article'
import { Source, SourceValidationError, ValidSource } from '../database/schema/source'
import { parseXMLFeed } from '../parser/rss-parser'
import * as articleService from './db/article'

export const quickFeedCheck = async (url: string): Promise<SourceValidationError | ValidSource> => {
  // 1. Strip accidental whitespace from pasting
  const trimmedUrl = url.trim()

  let parsedUrl: URL
  try {
    parsedUrl = new URL(trimmedUrl)
    if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
      return { isValid: false, error: 'URL must start with http:// or https://' }
    }
  } catch (error) {
    console.log('Error: ', error)
    return { isValid: false, error: 'Invalid URL format' }
  }

  // 2. Catch Reddit URLs BEFORE fetching heavy HTML pages
  // Using .hostname handles 'www.reddit.com', 'old.reddit.com', etc.
  if (parsedUrl.hostname.endsWith('reddit.com') && parsedUrl.pathname.startsWith('/r/')) {
    // .split('/').filter(Boolean) safely removes empty strings caused by trailing slashes
    const pathSegments = parsedUrl.pathname.split('/').filter(Boolean)

    if (pathSegments.length >= 2 && pathSegments[0] === 'r') {
      const subreddit = pathSegments[1] // Guarantees we get the name
      return { isValid: true, type: FeedType.SUB_REDDIT, finalUrl: subreddit }
    }
    return { isValid: false, error: 'Invalid subreddit URL format' }
  }

  const cleanUrl = parsedUrl.toString()

  // 3. Safe Network Request
  let response: Response
  try {
    response = await fetch(cleanUrl)
  } catch (error) {
    console.log('Error: ', error)
    // Catches offline status, DNS failures, or unreachable servers
    return { isValid: false, error: 'Network error. Could not reach the server.' }
  }

  if (!response.ok) {
    return { isValid: false, error: `Server returned an error: ${response.status}` }
  }

  // 4. Safe XML Parsing
  try {
    const text = await response.text()
    const xmlObj = parseXMLFeed(text, 'source_id', 'source_name')

    // Added rdf:RDF to catch RSS 1.0 feeds
    if (xmlObj.length > 0) return { isValid: true, type: FeedType.RSS, finalUrl: cleanUrl }
    return { isValid: false, error: 'Valid XML, but no RSS or Atom feed found.' }
  } catch (error) {
    console.log('Error: ', error)
    // fast-xml-parser usually won't throw unless configured to, but it's safe to keep
    return { isValid: false, error: 'Failed to parse feed content.' }
  }
}

export const fetchRSSFeed = async (source: Source): Promise<Article[]> => {
  const response = await fetch(source.url)
  const xmlString = await response.text()
  return parseXMLFeed(xmlString, source.id, source.name)
}

export const fetchAll = async (sources: Source[]) => {
  const results = await Promise.allSettled(sources.map((source) => fetchRSSFeed(source)))

  const sourcesWithArticles: SourceWithArticles[] = results.flatMap((result, index) => {
    const source = sources[index]

    if (result.status === 'fulfilled') {
      const articles = [...result.value].sort(
        (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
      )
      return [{ ...source, articles }]
    }

    console.log(`Failed to load RSS feeds from ${source.name}, reason: ${String(result.reason)}`)
    return []
  })

  sourcesWithArticles.map(({ articles }) => {
    articleService.save(articles)
  })
}
