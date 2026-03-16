import { Article } from '../database/schema/article'
import { Source } from '../database/schema/source'

export const fetchPosts = async (
  source: Source,
  type: 'hot' | 'new' | 'top' = 'hot',
): Promise<Article[]> => {
  const response = await fetch(`https://www.reddit.com/r/${source.url}/${type}.json`)
  const json = await response.json()

  return json.data.children.map((child: any) => ({
    id: child.data.id,
    title: child.data.title,
    author: child.data.author,
    description: child.data.selftext,
    link: child.data.permalink,
    sourceId: source.id,
    publishedAt: new Date(child.data.created_utc).toString(),
  }))
}

// Example permalink: /r/androidapps/comments/1abcde/some_post_title/
export const fetchComments = async (permalink: string) => {
  const response = await fetch(`https://www.reddit.com${permalink}.json`)
  const json = await response.json()

  // Reddit returns an array of TWO listings for a post:
  // json[0] is the original post data
  // json[1] is the comments tree

  const commentsData = json[1].data.children

  const comments = commentsData.map((child: any) => ({
    id: child.data.id,
    author: child.data.author,
    body: child.data.body, // The actual comment text
    score: child.data.score, // Upvotes
  }))

  return comments
}
