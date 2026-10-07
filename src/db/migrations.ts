import type { SQLiteDatabase } from "expo-sqlite";

export async function initializeDatabase(db: SQLiteDatabase) {
  await db.execAsync("PRAGMA journal_mode = WAL");
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS videos (
      id INTEGER PRIMARY KEY NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      file_name TEXT NOT NULL UNIQUE,
      thumbnail_file_name TEXT,
      duration_seconds INTEGER NOT NULL,
      start_seconds REAL NOT NULL,
      created_at TEXT NOT NULL
    );
  `);

  const columns = await db.getAllAsync<{ name: string }>("PRAGMA table_info(videos)");
  if (!columns.some((column) => column.name === "thumbnail_file_name")) {
    await db.execAsync("ALTER TABLE videos ADD COLUMN thumbnail_file_name TEXT");
  }

  await db.execAsync("CREATE INDEX IF NOT EXISTS videos_created_at_id_idx ON videos (created_at DESC, id DESC)");
}
