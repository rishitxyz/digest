import { FeedSource } from '../config/feed-source'
import { parseXMLFeed } from '../parser/rss-parser'
import { FeedItem, GroupedFeedItem } from '../types/feed'

export const fetchRSSFeed = async (source: FeedSource): Promise<FeedItem[]> => {
    const response = await fetch(source.url)
    const xmlString = await response.text()
    return parseXMLFeed(xmlString, source.name)
}

export const fetchAll = async (sources: FeedSource[]): Promise<GroupedFeedItem[]> => {
    console.log("sources: ", sources)
    const results = await Promise.allSettled(sources.map((source) => fetchRSSFeed(source)))

    const groupedFeedItems: GroupedFeedItem[] = results.flatMap((result, index) => {
        const source = sources[index]

        if (result.status === 'fulfilled') {
            const feedItems = [...result.value].sort(
                (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
            )
            return [{ source: source.name, feedItems: feedItems.slice(0, 3) }]
        }

        console.log(`Failed to load RSS feeds from ${source.name}, reason: ${String(result.reason)}`)
        return []
    })

    // Sort groups by most recent item timestamp (then by source name for stability)
    return [...groupedFeedItems].sort((a, b) => {
        const aTs = a.feedItems[0]?.timestamp
        const bTs = b.feedItems[0]?.timestamp
        const diff = new Date(bTs ?? 0).getTime() - new Date(aTs ?? 0).getTime()
        return diff !== 0 ? diff : a.source.localeCompare(b.source)
    })
}