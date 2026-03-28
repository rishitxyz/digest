import { asc, desc, eq, or } from 'drizzle-orm'

import { FeedType } from '../../config/feed-source'
import { SourceWithArticles, db } from '../../database/schema'
import { ArticleTable } from '../../database/schema/article'
import { CreateSource, Source, SourceTable } from '../../database/schema/source'
import { fetchAllSubReddits } from '../../parser/reddit-json'
import { fetchAll } from '../feed-service'

export const updateById = (id: string, source: Source): Source => {
  return db.update(SourceTable).set(source).returning().get()
}

export const toggleShowOnFeed = (id: string, showOnFeed: boolean) => {
  db.update(SourceTable)
    .set({
      showOnFeed,
    })
    .where(eq(SourceTable.id, id))
    .run()

  return readById(id)
}

export const getAllSources = (): { rss: Source[]; subreddits: Source[] } => {
  return {
    subreddits: db
      .select()
      .from(SourceTable)
      .where(eq(SourceTable.type, FeedType.SUB_REDDIT))
      .orderBy(asc(SourceTable.createdAt))
      .all(),
    rss: db
      .select()
      .from(SourceTable)
      .where(eq(SourceTable.type, FeedType.RSS))
      .orderBy(asc(SourceTable.createdAt))
      .all(),
  }
}

export const readById = (id: string): Source | undefined => {
  return db.select().from(SourceTable).where(eq(SourceTable.id, id)).get()
}

export const checkIfExists = (name: string, url: string): boolean => {
  return !!db
    .select()
    .from(SourceTable)
    .where(or(eq(SourceTable.name, name.toLowerCase()), eq(SourceTable.url, url)))
    .limit(1)
    .get()
}

export const insertNew = (createSource: CreateSource): Source => {
  return db.insert(SourceTable).values(createSource).returning().get()
}

export const deleteById = (id: string): undefined => {
  db.delete(SourceTable).where(eq(SourceTable.id, id)).run()
}

export const getSourcesWithLatestArticles = async (
  fetchBookmarksOnly: boolean = false,
  limit: number = 3,
): Promise<SourceWithArticles[]> => {
  return await db.query.SourceTable.findMany({
    with: {
      articles: {
        where: (article, { eq }) => (fetchBookmarksOnly ? eq(article.bookmarked, true) : undefined),
        orderBy: [desc(ArticleTable.publishedAt)],
        limit,
      },
    },
  })
}

export const refreshArticles = async () => {
  const { rss, subreddits } = getAllSources()
  await fetchAll(rss)
  await fetchAllSubReddits(subreddits)
}
