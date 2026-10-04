import type { SQLiteDatabase } from "expo-sqlite";
import type { Video } from "@/types/videos";

export type SaveVideoRow = {
  title: string;
  description: string;
  fileName: string;
  durationSeconds: number;
  startSeconds: number;
  createdAt: string;
};

export function listVideos(db: SQLiteDatabase) {
  return db.getAllAsync<Video>("SELECT * FROM videos ORDER BY created_at DESC, id DESC");
}

export function getVideo(db: SQLiteDatabase, id: number) {
  return db.getFirstAsync<Video>("SELECT * FROM videos WHERE id = ?", id);
}

export async function saveVideo(db: SQLiteDatabase, video: SaveVideoRow) {
  return db.runAsync(
    "INSERT INTO videos (title, description, file_name, duration_seconds, start_seconds, created_at) VALUES (?, ?, ?, ?, ?, ?)",
    video.title, video.description, video.fileName, video.durationSeconds, video.startSeconds, video.createdAt,
  );
}
