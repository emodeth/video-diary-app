import { create } from "zustand";
import type { CropStep, VideoSource } from "@/types/crop";

type CropDraft = {
  step: CropStep;
  selected: VideoSource | null;
  start: number;
  name: string;
  description: string;
};

type CropStore = CropDraft & {
  nextStep: () => void;
  previousStep: () => void;
  selectSource: (source: VideoSource) => void;
  setStart: (start: number) => void;
  setName: (name: string) => void;
  setDescription: (description: string) => void;
  reset: () => void;
};

const initialDraft: CropDraft = {
  step: 1,
  selected: null,
  start: 0,
  name: "",
  description: "",
};

export const useCropStore = create<CropStore>((set) => ({
  ...initialDraft,
  nextStep: () => set(({ step }) => ({ step: Math.min(step + 1, 3) as CropStep })),
  previousStep: () => set(({ step }) => ({ step: Math.max(step - 1, 1) as CropStep })),
  selectSource: (selected) => set({ selected, start: 0 }),
  setStart: (start) => set({ start }),
  setName: (name) => set({ name }),
  setDescription: (description) => set({ description }),
  reset: () => set(initialDraft),
}));
