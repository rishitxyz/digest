import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { SourceTable } from './source'

export const ArticleTable = sqliteTable('article', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  author: text('author').notNull().default('Unknown'),
  summary: text('summary'),
  description: text('description').notNull(),
  sourceId: text('sourceId')
    .notNull()
    .references(() => SourceTable.id, { onDelete: 'cascade' }),
  link: text('link'),
  imageUrl: text('imageUrl'),
  publishedAt: text('publishedAt').notNull(),
  hasEmbeddedHtml: integer('hasEmbeddedHtml', { mode: 'boolean' }).notNull(),
  isRead: integer('isRead', { mode: 'boolean' }).default(false).notNull(),
  bookmarked: integer('bookmarked', { mode: 'boolean' }).default(false).notNull(),
})

export type Article = typeof ArticleTable.$inferSelect
export type CreateArticle = typeof ArticleTable.$inferInsert
