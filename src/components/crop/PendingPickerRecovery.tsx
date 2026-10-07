import { useEffect } from "react";
import { router } from "expo-router";
import { AppState } from "react-native";
import { acknowledgeRecoveredVideo, recoverPendingVideo } from "@/lib/pickVideo";
import { useCropStore } from "@/stores/crop.store";

export function PendingPickerRecovery() {
  useEffect(() => {
    let mounted = true;
    const recover = () => {
      void recoverPendingVideo().then((result) => {
        if (!mounted || !result) return;
        if (result.kind !== "picked") {
          acknowledgeRecoveredVideo();
          return;
        }
        const selected = useCropStore.getState().selected;
        if (selected && selected.id !== result.source.id) {
          acknowledgeRecoveredVideo();
          return;
        }
        if (!selected) useCropStore.getState().selectSource(result.source);
        router.navigate("/crop");
        acknowledgeRecoveredVideo();
      }).catch((error) => console.warn("Could not recover selected video", error));
    };
    recover();
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") recover();
    });
    return () => {
      mounted = false;
      subscription.remove();
    };
  }, []);

  return null;
}
