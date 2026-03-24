import { Article } from '../database/schema/article'
import { Source } from '../database/schema/source'
import * as articleService from '../services/db/article'
import { convertToStandardYouTubeLink } from '../utils/youtube-link'

export const REDDIT_BASE_URL: string = 'https://www.reddit.com'

export const fetchAllSubReddits = async (sources: Source[]) => {
  await Promise.all(
    sources.map(async (source) => {
      const posts = await fetchPosts(source)
      articleService.save(posts)
    }),
  )
}

const extractEmbedUrl = (htmlText: string | undefined): string | null => {
  if (!htmlText) return null

  // Unescape the quotes just in case Reddit sent them as &quot;
  const decodedHtml = htmlText.replace(/&quot;/g, '"')

  // This Regex looks for src="<anything>" and captures the <anything> part
  const match = decodedHtml.match(/src="([^"]+)"/)

  return match ? match[1] : null
}

export const fetchPosts = async (
  source: Source,
  type: 'hot' | 'new' | 'top' = 'hot',
): Promise<Article[]> => {
  const response = await fetch(`${REDDIT_BASE_URL}/${source.url}/${type}.json`)
  const json = await response.json()

  return json.data.children.map((child: any) => {
    let content: string = child.data.selftext
    let hasEmbeddedHtml: boolean = false
    if ((!content || content === '') && child.data.secure_media_embed.content) {
      content = extractEmbedUrl(child.data.secure_media_embed.content) ?? ''
      if (content && content.includes('youtube.com/embed/'))
        content = convertToStandardYouTubeLink(content)
      hasEmbeddedHtml = true
    }
    return {
      id: child.data.id,
      title: child.data.title,
      author: `u/${child.data.author}`, // Reddit provides this correctly
      description: content,
      link: child.data.permalink,
      sourceId: source.id,
      hasEmbeddedHtml,
      publishedAt: new Date(child.data.created_utc * 1000).toISOString(),
    }
  })
}

// Example permalink: /r/androidapps/comments/1abcde/some_post_title/
export const fetchComments = async (permalink: string) => {
  try {
    const url = `${REDDIT_BASE_URL}${permalink}.json`
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
