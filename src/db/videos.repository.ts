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

type VideoRow = {
  id: number;
  title: string;
  description: string;
  file_name: string;
  thumbnail_file_name: string | null;
  duration_seconds: number;
  start_seconds: number;
  created_at: string;
};

function toVideo(row: VideoRow): Video {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    fileName: row.file_name,
    thumbnailFileName: row.thumbnail_file_name,
    durationSeconds: row.duration_seconds,
    startSeconds: row.start_seconds,
    createdAt: row.created_at,
  };
}

export type VideoCursor = Pick<Video, "createdAt" | "id">;
export const VIDEO_PAGE_SIZE = 30;

export async function listVideos(db: SQLiteDatabase, cursor: VideoCursor | null) {
  const query = cursor
    ? "SELECT * FROM videos WHERE created_at < ? OR (created_at = ? AND id < ?) ORDER BY created_at DESC, id DESC LIMIT ?"
    : "SELECT * FROM videos ORDER BY created_at DESC, id DESC LIMIT ?";
  const parameters = cursor
    ? [cursor.createdAt, cursor.createdAt, cursor.id, VIDEO_PAGE_SIZE + 1]
    : [VIDEO_PAGE_SIZE + 1];
  const rows = await db.getAllAsync<VideoRow>(query, parameters);
  const videos = rows.slice(0, VIDEO_PAGE_SIZE).map(toVideo);
  const last = videos.at(-1);
  return {
    videos,
    nextCursor: rows.length > VIDEO_PAGE_SIZE && last
      ? { createdAt: last.createdAt, id: last.id }
      : null,
  };
}

export async function getVideoStats(db: SQLiteDatabase) {
  const stats = await db.getFirstAsync<{ totalVideos: number; totalSeconds: number }>(
    "SELECT COUNT(*) AS totalVideos, COALESCE(SUM(duration_seconds), 0) AS totalSeconds FROM videos",
  );
  return stats!;
}

export async function getVideo(db: SQLiteDatabase, id: number) {
  const row = await db.getFirstAsync<VideoRow>("SELECT * FROM videos WHERE id = ?", id);
  return row ? toVideo(row) : null;
}

export function updateVideoDetails(db: SQLiteDatabase, id: number, title: string, description: string) {
  return db.runAsync("UPDATE videos SET title = ?, description = ? WHERE id = ?", title, description, id);
}

export function deleteVideo(db: SQLiteDatabase, id: number) {
  return db.runAsync("DELETE FROM videos WHERE id = ?", id);
}

export function saveVideo(db: SQLiteDatabase, video: SaveVideoRow) {
  return db.runAsync(
    "INSERT INTO videos (title, description, file_name, thumbnail_file_name, duration_seconds, start_seconds, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
    video.title, video.description, video.fileName, video.thumbnailFileName, video.durationSeconds, video.startSeconds, video.createdAt,
  );
}
