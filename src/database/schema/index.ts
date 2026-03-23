import { openDatabaseSync } from 'expo-sqlite'

import { relations } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/expo-sqlite'

import * as articleSchema from './article'
import * as sourceSchema from './source'

// 2. Define the relations here, referencing the imported tables directly
export const sourceRelations = relations(sourceSchema.SourceTable, ({ many }) => ({
  articles: many(articleSchema.ArticleTable),
}))

export const articleRelations = relations(articleSchema.ArticleTable, ({ one }) => ({
  source: one(sourceSchema.SourceTable, {
    fields: [articleSchema.ArticleTable.sourceId],
    references: [sourceSchema.SourceTable.id],
  }),
}))

// 3. Inject the relations into your combined schema object!
export const schema = {
  ...articleSchema,
  ...sourceSchema,
  sourceRelations,
  articleRelations,
}

const expoDb = openDatabaseSync('rss_reader.db')
export const db = drizzle(expoDb, { schema })

export function initializeDatabase() {
  expoDb.execSync(`
    CREATE TABLE IF NOT EXISTS source (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL UNIQUE, -- Added UNIQUE
      url TEXT NOT NULL UNIQUE,  -- Added UNIQUE
      type TEXT CHECK(type IN ('rss', 'subreddit')) NOT NULL,
      showOnFeed INTEGER DEFAULT 1 NOT NULL,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL
    );

    CREATE TABLE IF NOT EXISTS article (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      author TEXT DEFAULT 'Unknown' NOT NULL,
      summary TEXT,
      description TEXT NOT NULL,
      sourceId TEXT NOT NULL REFERENCES source(id) ON DELETE CASCADE,
      link TEXT, -- Removed NOT NULL
      imageUrl TEXT,
      publishedAt TEXT NOT NULL,
      isRead INTEGER DEFAULT 0 NOT NULL,
      hasEmbeddedHtml INTEGER DEFAULT 0 NOT NULL,
      bookmarked INTEGER DEFAULT 0 NOT NULL
    );
  `)
}

export type SourceWithArticles = sourceSchema.Source & { articles: articleSchema.Article[] }

export type ArticleWithSource = articleSchema.Article & { source: sourceSchema.Source }
