import { File } from 'expo-file-system'
import * as Sharing from 'expo-sharing'
import * as SQLite from 'expo-sqlite'

import { db } from '../database/schema'
import { ArticleTable } from '../database/schema/article'
import { SourceTable } from '../database/schema/source'

export const exportDb = async () => {
  try {
    // 1. Locate the database using the new File object
    const dbFile = new File(`${SQLite.defaultDatabaseDirectory}/rss_reader.db`)

    // 2. Check existence as a synchronous property instead of a Promise!
    if (!dbFile.exists) {
      console.log('Database file not found!')
      return
    }

    // 3. Trigger the share sheet
    const isAvailable = await Sharing.isAvailableAsync()
    if (isAvailable) {
      await Sharing.shareAsync(dbFile.uri, {
        dialogTitle: 'Export rss_reader.db',
        mimeType: 'application/x-sqlite3', // Helps the OS know it's a database
      })
    } else {
      console.log('Sharing is not available on this device.')
    }
  } catch (error) {
    console.error('Failed to export database:', error)
  }
}

export const clearAllDeviceData = () => {
  // Delete all rows in both tables
  db.delete(ArticleTable).run()
  db.delete(SourceTable).run()
}
