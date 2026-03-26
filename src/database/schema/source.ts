// src/database/schema/source.ts
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

import { FeedType } from '../../config/feed-source'

// Adjust if needed

export const SourceTable = sqliteTable('source', {
  id: text('id').primaryKey(),
  name: text('name').notNull().unique(),
  url: text('url').notNull().unique(),
  type: text('type', { enum: [FeedType.RSS, FeedType.SUB_REDDIT] }).notNull(),
  showOnFeed: integer('showOnFeed', { mode: 'boolean' }).default(true).notNull(),
  qty: integer('qty').default(3).notNull(),
  createdAt: text('createdAt').default('CURRENT_TIMESTAMP').notNull(),
})

export type Source = typeof SourceTable.$inferSelect
export type CreateSource = typeof SourceTable.$inferInsert

export interface SourceValidationError {
  isValid: false
  error: string
}

export interface ValidSource {
  isValid: true
  type: FeedType
  finalUrl: string
}
