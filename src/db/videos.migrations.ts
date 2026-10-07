import type { SQLiteDatabase } from "expo-sqlite";

const DB_VERSION = 1;

export async function initializeDatabase(db: SQLiteDatabase) {
  await db.execAsync("PRAGMA journal_mode = WAL");
  const version = (await db.getFirstAsync<{ user_version: number }>("PRAGMA user_version"))?.user_version ?? 0;
  if (version >= DB_VERSION) return;

  await db.withTransactionAsync(async () => {
    if (version < 1) {
      await db.execAsync(`
        CREATE TABLE videos (
          id INTEGER PRIMARY KEY NOT NULL,
          title TEXT NOT NULL,
          description TEXT NOT NULL,
          file_name TEXT NOT NULL UNIQUE,
          thumbnail_file_name TEXT NOT NULL,
          duration_seconds INTEGER NOT NULL,
          start_seconds REAL NOT NULL,
          created_at TEXT NOT NULL
        );
        CREATE INDEX videos_created_at_id_idx ON videos (created_at DESC, id DESC);
      `);
    }

    // Future migrations go here: if (version < 2) { ... }
    await db.execAsync(`PRAGMA user_version = ${DB_VERSION}`);
  });
}
