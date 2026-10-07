import type { SQLiteDatabase } from "expo-sqlite";
import { saveVideo } from "@/db/videos.repository";
import { deleteVideoFile, storeVideo } from "@/lib/fileSystem";

export type CreateVideoInput = {
  sourceUri: string;
  thumbnailFileName: string;
  durationSeconds: number;
  title: string;
  description: string;
};

export async function createVideo(db: SQLiteDatabase, input: CreateVideoInput) {
  const fileName = await storeVideo(input.sourceUri);

  try {
    await saveVideo(db, {
      title: input.title.trim(),
      description: input.description.trim(),
      fileName,
      thumbnailFileName: input.thumbnailFileName,
      durationSeconds: input.durationSeconds,
      startSeconds: 0,
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
