export type Video = {
  id: number;
  title: string;
  description: string;
  file_name: string;
  thumbnail_file_name: string | null;
  duration_seconds: number;
  start_seconds: number;
  created_at: string;
};
