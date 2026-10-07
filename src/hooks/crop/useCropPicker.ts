import { useCallback, useEffect, useRef, useState } from "react";
import { router } from "expo-router";
import type { VideoPlayer } from "expo-video";
import { useToast } from "@/components/ui/Toast";
import { PICKER_SETTLE_GUARD_MS } from "@/constants";
import { pickVideo } from "@/lib/pickVideo";
import { useCropStore } from "@/stores/crop.store";

export function useCropPicker(player: VideoPlayer, isDismissing: () => boolean, isSaving: () => boolean) {
  const showToast = useToast();
  const [sessionVersion] = useState(() => useCropStore.getState().sessionVersion);
  const mounted = useRef(false);
  const pickerInFlight = useRef(false);
  const pickerSettledAt = useRef(0);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      if (isDismissing() || isSaving()) return;
      if (useCropStore.getState().sessionVersion !== sessionVersion) return;
      if (!pickerInFlight.current &&
        Date.now() - pickerSettledAt.current >= PICKER_SETTLE_GUARD_MS) {
        useCropStore.getState().reset();
      }
    };
  }, [isDismissing, isSaving, sessionVersion]);

  const blocksClose = useCallback(() =>
    pickerInFlight.current || Date.now() - pickerSettledAt.current < PICKER_SETTLE_GUARD_MS, []);

  async function browse() {
    if (pickerInFlight.current) return;
    pickerInFlight.current = true;
    let selectedFromPicker = false;
    try {
      const result = await pickVideo();
      if (useCropStore.getState().sessionVersion !== sessionVersion) return;
      if (result.kind === "picked") {
        selectedFromPicker = true;
        if (mounted.current) player.pause();
        useCropStore.getState().selectSource(result.source);
        // Android can remove a transparent modal while the system picker is open.
        if (!mounted.current) router.navigate("/crop");
      } else if (mounted.current && result.kind === "denied") {
        showToast("Allow library access to choose a video", "error");
      } else if (mounted.current && result.kind === "tooShort") {
        showToast("Choose a video at least 5 seconds long", "error");
      }
    } catch {
      if (!mounted.current) return;
      showToast("Couldn’t open library. Please try again", "error");
    } finally {
      pickerSettledAt.current = Date.now();
      pickerInFlight.current = false;
      if (!mounted.current && !selectedFromPicker &&
        useCropStore.getState().sessionVersion === sessionVersion) useCropStore.getState().reset();
    }
  }

  return { browse, blocksClose };
}
