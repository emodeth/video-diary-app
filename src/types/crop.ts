export type VideoSource = {
  id: string;
  duration: number;
  color: string;
  title: string;
  fileSize?: number;
};

export type CropStep = 1 | 2 | 3;
