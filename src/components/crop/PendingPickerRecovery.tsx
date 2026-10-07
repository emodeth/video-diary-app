import { useEffect } from "react";
import { router } from "expo-router";
import { recoverPendingVideo } from "@/lib/pickVideo";
import { useCropStore } from "@/stores/crop.store";

export function PendingPickerRecovery() {
  useEffect(() => {
    let mounted = true;
    void recoverPendingVideo().then((result) => {
      if (!mounted || result?.kind !== "picked") return;
      useCropStore.getState().selectSource(result.source);
      router.navigate("/crop");
    }).catch((error) => console.warn("Could not recover selected video", error));
    return () => { mounted = false; };
  }, []);

  return null;
}
