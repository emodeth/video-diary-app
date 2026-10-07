import { useCallback, useEffect, useRef } from "react";
import { Easing, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import { useCropStore } from "@/stores/crop.store";

export function useSheetAnimation(height: number, onDismiss: () => void) {
  // The native media picker can unmount a transparent modal. Restore the same
  // crop session at its visible position instead of replaying the entrance.
  const progress = useSharedValue(useCropStore.getState().sheetPresented ? 1 : 0);
  const dismissing = useRef(false);
  const isDismissing = useCallback(() => dismissing.current, []);

  useEffect(() => {
    if (useCropStore.getState().sheetPresented) return;
    useCropStore.getState().markSheetPresented();
    progress.value = withTiming(1, { duration: 420, easing: Easing.out(Easing.cubic) });
  }, [progress]);

  const sheetAnimation = useAnimatedStyle(() => ({
    transform: [{ translateY: (1 - progress.value) * height }],
  }));
  const backdropAnimation = useAnimatedStyle(() => ({ opacity: progress.value * 0.35 }));

  function dismiss() {
    if (dismissing.current) return;
    dismissing.current = true;
    // Reanimated shared values are intentionally mutable outside React render.
    // eslint-disable-next-line react-hooks/immutability
    progress.value = withTiming(0, { duration: 220, easing: Easing.in(Easing.cubic) }, (finished) => {
      if (finished) scheduleOnRN(onDismiss);
    });
  }

  return { sheetAnimation, backdropAnimation, dismiss, isDismissing };
}
