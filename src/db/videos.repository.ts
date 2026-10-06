import type { SQLiteDatabase } from "expo-sqlite";
import type { Video } from "@/types/videos";

export type SaveVideoRow = {
  title: string;
  description: string;
  fileName: string;
  thumbnailFileName: string;
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

export function updateVideoDetails(db: SQLiteDatabase, id: number, title: string, description: string) {
  return db.runAsync("UPDATE videos SET title = ?, description = ? WHERE id = ?", title, description, id);
}

export function deleteVideo(db: SQLiteDatabase, id: number) {
  return db.runAsync("DELETE FROM videos WHERE id = ?", id);
}

export async function saveVideo(db: SQLiteDatabase, video: SaveVideoRow) {
  return db.runAsync(
    "INSERT INTO videos (title, description, file_name, thumbnail_file_name, duration_seconds, start_seconds, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
    video.title, video.description, video.fileName, video.thumbnailFileName, video.durationSeconds, video.startSeconds, video.createdAt,
  );
}
