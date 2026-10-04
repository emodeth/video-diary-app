import * as Crypto from "expo-crypto";
import { Directory, File, Paths } from "expo-file-system";

const videosDirectory = new Directory(Paths.document, "videos");

export function videoFile(fileName: string) {
  return new File(videosDirectory, fileName);
}

export async function storeTrimmedVideo(uri: string) {
  const trimmedFile = new File(uri);
  const fileName = `${Crypto.randomUUID()}.mp4`;
  const savedFile = videoFile(fileName);

  try {
    videosDirectory.create({ idempotent: true });
    await trimmedFile.move(savedFile);
    if (!savedFile.exists) throw new Error("Trimmed video could not be saved.");
    return fileName;
  } catch (error) {
    try {
      if (savedFile.exists) savedFile.delete();
      else if (trimmedFile.exists) trimmedFile.delete();
    } catch {
      // Preserve the original storage error.
    }
    throw error;
  }
}

export function deleteVideoFile(fileName: string) {
  const file = videoFile(fileName);
  if (file.exists) file.delete();
}
