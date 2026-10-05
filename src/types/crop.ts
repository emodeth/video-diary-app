export type VideoSource = {
  id: string;
  duration: number;
  color: string;
  title: string;
  fileSize?: number;
  width: number;
  height: number;
};

export type CropStep = 1 | 2 | 3;
