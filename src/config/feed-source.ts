export enum FeedType {
    RSS = "rss",
    REDDIT = "reddit"
}

export interface FeedSource {
    id: string
    name: string
    url: string
    type: FeedType
}

export const generateRedditSource = (subreddit: string): FeedSource => {
    return {
        id: `r/${subreddit.toLowerCase()}`,
        name: `r/${subreddit}`,
        url: `https://www.reddit.com/r/${subreddit.toLowerCase()}/.rss`,
        type: FeedType.REDDIT
    }
}

export const FEED_SOURCES: FeedSource[] = [
    {
        id: 'theverge',
        name: 'The Verge',
        url: 'https://www.theverge.com/rss/index.xml',
        type: FeedType.RSS
    },
    // {
    //     id: 'androidauthority',
    //     name: 'Android Authority',
    //     url: '',
    //     type: FeedType.RSS
    // },
]