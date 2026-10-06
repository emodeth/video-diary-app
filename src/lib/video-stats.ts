import type { Video } from "@/types/videos";

export function getTotalSeconds(videos: readonly Video[]) {
  return videos.reduce((total, video) => total + video.duration_seconds, 0);
}
