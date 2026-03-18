import { desc, eq, sql } from 'drizzle-orm'
import { db } from '../../database/schema'
import { Article, ArticleTable, CreateArticle } from '../../database/schema/article'

export const getAllBySourceId = (sourceId: string): Article[] => {
  return db
    .select()
    .from(ArticleTable)
    .where(eq(ArticleTable.sourceId, sourceId))
    .orderBy(desc(ArticleTable.publishedAt))
    .all()
}

export const readById = (id: string): Article => {
  return db.select().from(ArticleTable).where(eq(ArticleTable.id, id)).get()!
}

export const markArticleAsRead = (id: string) => {
  db.update(ArticleTable)
    .set({
      isRead: true,
    })
    .where(eq(ArticleTable.id, id))
    .run()
}

export const toggleBookmarked = (id: string, bookmarked: boolean) => {
  db.update(ArticleTable)
    .set({
      bookmarked,
    })
    .where(eq(ArticleTable.id, id))
    .run()

  return readById(id)
}

export const save = (createArticles: CreateArticle[]) => {
  if (!createArticles || createArticles.length === 0) return

  db.insert(ArticleTable)
    .values(createArticles)
    .onConflictDoUpdate({
      target: ArticleTable.id,
      set: {
        // Use 'excluded' to grab the NEW value from the fetch payload
        title: sql`excluded.title`,
        author: sql`excluded.author`,
        summary: sql`excluded.summary`,
        description: sql`excluded.description`,
        link: sql`excluded.link`,
        imageUrl: sql`excluded.imageUrl`,
      },
    })
    .run()
}
