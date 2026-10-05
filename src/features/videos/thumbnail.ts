import { ImageManipulator, SaveFormat } from "expo-image-manipulator";
import type { VideoPlayer } from "expo-video";
import { storeThumbnail } from "./storage";

export async function createVideoThumbnail(player: VideoPlayer) {
  if (player.status !== "readyToPlay") throw new Error("Video is not ready for thumbnail generation.");
  const [thumbnail] = await player.generateThumbnailsAsync(1, { maxWidth: 216, maxHeight: 188 });
  if (!thumbnail) throw new Error("Video thumbnail could not be generated.");

  try {
    const context = ImageManipulator.manipulate(thumbnail);
    try {
      const image = await context.renderAsync();
      try {
        const { uri } = await image.saveAsync({ format: SaveFormat.JPEG, compress: 0.8 });
        return await storeThumbnail(uri);
      } finally {
        image.release();
      }
    } finally {
      context.release();
    }
  } finally {
    thumbnail.release();
  }
}
