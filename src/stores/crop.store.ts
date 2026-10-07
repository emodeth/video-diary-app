import { create } from "zustand";
import type { CropStep, VideoSource } from "@/types/crop";
import { safeDeleteThumbnail } from "@/lib/fileSystem";

type ThumbnailStatus = "idle" | "loading" | "ready" | "error";

type CropDraft = {
  sessionVersion: number;
  sheetPresented: boolean;
  step: CropStep;
  selected: VideoSource | null;
  thumbnailFileName: string | null;
  thumbnailStatus: ThumbnailStatus;
  selectionVersion: number;
  start: number;
  name: string;
  description: string;
};

type CropStore = CropDraft & {
  markSheetPresented: () => void;
  nextStep: () => void;
  previousStep: () => void;
  selectSource: (source: VideoSource) => void;
  setThumbnail: (version: number, fileName: string) => boolean;
  setThumbnailError: (version: number) => void;
  retryThumbnail: () => void;
  markThumbnailSaved: () => void;
  setStart: (start: number) => void;
  setName: (name: string) => void;
  setDescription: (description: string) => void;
  reset: () => void;
};

const initialDraft: CropDraft = {
  sessionVersion: 0,
  sheetPresented: false,
  step: 1,
  selected: null,
  thumbnailFileName: null,
  thumbnailStatus: "idle",
  selectionVersion: 0,
  start: 0,
  name: "",
  description: "",
};

export const useCropStore = create<CropStore>((set, get) => ({
  ...initialDraft,
  markSheetPresented: () => set({ sheetPresented: true }),
  nextStep: () => set(({ step, selected }) => ({ step: selected ? Math.min(step + 1, 3) as CropStep : step })),
  previousStep: () => set(({ step }) => ({ step: Math.max(step - 1, 1) as CropStep })),
  selectSource: (selected) => {
    const state = get();
    safeDeleteThumbnail(state.thumbnailFileName);
    set({ selected, start: 0, thumbnailFileName: null, thumbnailStatus: "loading", selectionVersion: state.selectionVersion + 1 });
  },
  setThumbnail: (version, fileName) => {
    if (get().selectionVersion !== version || !get().selected) return false;
    set({ thumbnailFileName: fileName, thumbnailStatus: "ready" });
    return true;
  },
  setThumbnailError: (version) => {
    if (get().selectionVersion === version) set({ thumbnailStatus: "error" });
  },
  retryThumbnail: () => {
    const state = get();
    if (state.selected && state.thumbnailStatus === "error") {
      set({ thumbnailStatus: "loading", selectionVersion: state.selectionVersion + 1 });
    }
  },
  markThumbnailSaved: () => set({ thumbnailFileName: null, thumbnailStatus: "idle" }),
  setStart: (start) => set({ start }),
  setName: (name) => set({ name }),
  setDescription: (description) => set({ description }),
  reset: () => {
    const state = get();
    safeDeleteThumbnail(state.thumbnailFileName);
    set({ ...initialDraft, sessionVersion: state.sessionVersion + 1, selectionVersion: state.selectionVersion + 1 });
  },
}));
