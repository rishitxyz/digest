import { eq, or, desc, asc } from 'drizzle-orm'
import { db, SourceWithArticles } from '../../database/schema'
import { CreateSource, Source, SourceTable } from '../../database/schema/source'
import { ArticleTable } from '../../database/schema/article'
import { FeedType } from '../../config/feed-source'

export const updateById = (id: string, source: Source): Source => {
  return db.update(SourceTable).set(source).returning().get()
}

export const getAllSources = (): { subReddits: Source[]; rss: Source[] } => {
  return {
    subReddits: db
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
  limit: number = 3,
): Promise<SourceWithArticles[]> => {
  return await db.query.SourceTable.findMany({
    with: {
      articles: {
        orderBy: [desc(ArticleTable.publishedAt)],
        limit,
      },
    },
  })
}
