import { Article } from '../database/schema/article'
import { Source } from '../database/schema/source'
import * as articleService from '../services/db/article'

export const fetchAllSubReddits = async (sources: Source[]) => {
  await Promise.all(
    sources.map(async (source) => {
      const posts = await fetchPosts(source)
      articleService.save(posts)
    }),
  )
}

export const fetchPosts = async (
  source: Source,
  type: 'hot' | 'new' | 'top' = 'hot',
): Promise<Article[]> => {
  const response = await fetch(`https://www.reddit.com/${source.url}/${type}.json`)
  const json = await response.json()

  const s = json.data.children.map((child: any) => ({
    id: child.data.id,
    title: child.data.title,
    author: `u/${child.data.author}`, // Reddit provides this correctly
    description: child.data.selftext,
    link: child.data.permalink,
    sourceId: source.id,
    publishedAt: new Date(child.data.created_utc * 1000).toISOString(),
  }))
  console.log(s)
  return s
}

// Example permalink: /r/androidapps/comments/1abcde/some_post_title/
export const fetchComments = async (permalink: string) => {
  try {
    const url = `https://www.reddit.com${permalink}.json`
    const response = await fetch(url)
    const json = await response.json()

    // json[0] is the post, json[1] is the comment tree
    const commentsData = json[1].data.children

    // 1. Create a recursive parsing function
    const parseComments = (children: any[]): any[] => {
      return children
        .filter((child) => child.kind === 't1') // Ignore 'more' stubs
        .map((child) => {
          const data = child.data
          let nestedReplies = []

          // 2. Check if replies exist AND are an object (not an empty string)
          if (data.replies && typeof data.replies === 'object') {
            nestedReplies = parseComments(data.replies.data.children)
          }

          return {
            author: data.author,
            body: data.body,
            score: data.score,
            replies: nestedReplies, // 3. Attach them here!
          }
        })
    }

    return parseComments(commentsData)
  } catch (error) {
    console.error('Failed to fetch comments', error)
    return []
  }
}
