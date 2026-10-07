import type { SQLiteDatabase } from "expo-sqlite";
import { trimVideo } from "expo-trim-video";
import { saveVideo } from "@/db/videos.repository";
import { deleteVideoFile, storeTrimmedVideo } from "@/lib/fileSystem";

export type CreateVideoInput = {
  sourceUri: string;
  thumbnailFileName: string;
  startSeconds: number;
  title: string;
  description: string;
};

export async function createVideo(db: SQLiteDatabase, input: CreateVideoInput) {
  const { uri } = await trimVideo({
    uri: input.sourceUri,
    start: input.startSeconds,
    end: input.startSeconds + 5,
  });
  const fileName = await storeTrimmedVideo(uri);

  try {
    await saveVideo(db, {
      title: input.title.trim(),
      description: input.description.trim(),
      fileName,
      thumbnailFileName: input.thumbnailFileName,
      durationSeconds: 5,
      startSeconds: input.startSeconds,
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    try {
      deleteVideoFile(fileName);
    } catch (cleanupError) {
      console.warn("Could not clean up video after failed save", cleanupError);
    }
    throw error;
  }
}
