import * as Crypto from "expo-crypto";
import { Directory, File, Paths } from "expo-file-system";
import { copyAsync } from "expo-file-system/legacy";

const videosDirectory = new Directory(Paths.document, "videos");
const thumbnailsDirectory = new Directory(Paths.document, "thumbnails");

export function videoFile(fileName: string) {
  return new File(videosDirectory, fileName);
}

export function thumbnailFile(fileName: string) {
  return new File(thumbnailsDirectory, fileName);
}

export async function storeThumbnail(uri: string) {
  const generatedFile = new File(uri);
  const fileName = `${Crypto.randomUUID()}.jpg`;
  const savedFile = thumbnailFile(fileName);

  try {
    thumbnailsDirectory.create({ idempotent: true });
    await generatedFile.move(savedFile);
    if (!savedFile.exists) throw new Error("Thumbnail could not be saved.");
    return fileName;
  } catch (error) {
    try {
      if (savedFile.exists) savedFile.delete();
      else if (generatedFile.exists) generatedFile.delete();
    } catch {
      // Preserve the thumbnail storage error.
    }
    throw error;
  }
}

export async function storeVideo(uri: string) {
  const sourceFile = new File(uri);
  const fileName = `${Crypto.randomUUID()}${sourceFile.extension || ".mp4"}`;
  const savedFile = videoFile(fileName);

  try {
    videosDirectory.create({ idempotent: true });
    await copyAsync({ from: sourceFile.uri, to: savedFile.uri });
    if (!savedFile.exists) throw new Error("Video could not be saved.");
    return fileName;
  } catch (error) {
    try {
      if (savedFile.exists) savedFile.delete();
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

export function deleteThumbnailFile(fileName: string) {
  const file = thumbnailFile(fileName);
  if (file.exists) file.delete();
}

export function safeDeleteThumbnail(fileName: string | null) {
  if (!fileName) return;
  try {
    deleteThumbnailFile(fileName);
  } catch {
    // Cleanup must not interrupt the crop flow.
  }
}
