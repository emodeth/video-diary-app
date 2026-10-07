export type Video = {
  id: number;
  title: string;
  description: string;
  fileName: string;
  thumbnailFileName: string | null;
  durationSeconds: number;
  startSeconds: number;
  createdAt: string;
};
