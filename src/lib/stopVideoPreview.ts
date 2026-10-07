import type { VideoPlayer } from "expo-video";

export function stopVideoPreview(player: VideoPlayer) {
  player.pause();
  player.timeUpdateEventInterval = 0;
}
