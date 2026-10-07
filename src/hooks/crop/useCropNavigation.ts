import type { VideoPlayer } from "expo-video";
import { stopVideoPreview } from "@/lib/stopVideoPreview";
import { useCropStore } from "@/stores/crop.store";

type CropNavigationOptions = {
  player: VideoPlayer;
  sheet: { dismiss: () => void; isDismissing: () => boolean };
  blocksClose: () => boolean;
  isBusy: () => boolean;
};

export function useCropNavigation({ player, sheet, blocksClose, isBusy }: CropNavigationOptions) {
  const step = useCropStore((state) => state.step);

  function close() {
    if (sheet.isDismissing() || blocksClose()) return;
    if (!isBusy()) {
      player.pause();
      sheet.dismiss();
    }
  }

  function leaveRangeStep() {
    if (step === 2) stopVideoPreview(player);
    else player.pause();
  }

  function back() {
    if (sheet.isDismissing() || isBusy()) return;
    if (step === 1) close();
    else {
      leaveRangeStep();
      useCropStore.getState().previousStep();
    }
  }

  function next() {
    if (sheet.isDismissing() || isBusy()) return;
    leaveRangeStep();
    useCropStore.getState().nextStep();
  }

  return { close, back, next };
}
