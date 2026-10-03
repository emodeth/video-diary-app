export function calculateTotalDuration(
  videos: { duration: string }[],
): number {
  return videos.reduce((total, video) => {
    const [minutes, seconds] = video.duration.split(":").map(Number);
    return total + minutes * 60 + seconds;
  }, 0);
}
