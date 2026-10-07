import type { VideoPlayer } from "expo-video";

export function stopVideoPreview(player: VideoPlayer) {
  player.pause();
  player.scrubbingModeOptions = { scrubbingModeEnabled: false };
  player.seekTolerance = { toleranceBefore: 0, toleranceAfter: 0 };
  player.timeUpdateEventInterval = 0;
}
