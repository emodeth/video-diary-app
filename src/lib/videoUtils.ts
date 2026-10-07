import type { Video } from "@/types/videos";

export function formatTime(seconds: number) {
  const whole = Math.floor(seconds);
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, "0")}`;
}

export function getTotalSeconds(videos: readonly Video[]) {
  return videos.reduce((total, video) => total + video.durationSeconds, 0);
}

export function getStartFromPosition(locationX: number, width: number, maxStart: number) {
  if (width <= 0) return 0;
  const progress = Math.max(0, Math.min(1, locationX / width));
  return Math.min(maxStart, Math.round(progress * maxStart * 10) / 10);
}

export function getPreviewSize(
  width: number,
  height: number,
  topInset: number,
  bottomInset: number,
) {
  const previewWidth = Math.min(width, 620) - 54;
  const sheetHeight = Math.min(height * 0.91, height - topInset - 12);
  const cardHeight = Math.max(
    292,
    sheetHeight - 96 - (70 + Math.max(bottomInset, 16)) - 292,
  );

  return { previewWidth, cardHeight, mediaHeight: cardHeight - 52 };
}
