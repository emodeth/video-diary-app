import { useEvent } from "expo";
import { useVideoPlayer } from "expo-video";
import { router } from "expo-router";
import { useEffect } from "react";
import {
  KeyboardAvoidingView,
  BackHandler,
  Platform,
  Pressable,
  ScrollView,
  View,
  useWindowDimensions,
} from "react-native";
import Animated from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ToastViewport } from "@/components/ui/Toast";
import { VideoDetailsStep } from "@/components/crop/VideoDetailsStep";
import { VideoRangeStep } from "@/components/crop/VideoRangeStep";
import { CropFooter } from "@/components/crop/CropFooter";
import { CropHeader } from "@/components/crop/CropHeader";
import { VideoSelectionStep } from "@/components/crop/VideoSelectionStep";
import { useCropStore } from "@/stores/crop.store";
import { useTimelineFrames, useCropThumbnail, useSheetAnimation, useCropPicker, useSaveVideo, useCropNavigation } from "@/hooks/crop";
import {
  CONTENT_HORIZONTAL_PADDING,
  SHEET_HEIGHT_RATIO,
  SHEET_MAX_WIDTH,
} from "@/constants";
import colors from "@/theme/colors.json";

function dismissCrop() {
  useCropStore.getState().reset();
  router.back();
}

export default function CropScreen() {
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const step = useCropStore((state) => state.step);
  const selected = useCropStore((state) => state.selected);
  const thumbnailStatus = useCropStore((state) => state.thumbnailStatus);
  const player = useVideoPlayer(selected?.id ?? null);
  const { status } = useEvent(player, "statusChange", {
    status: player.status,
  });
  const { frames, failed: framesFailed } = useTimelineFrames(
    player,
    selected,
    (status === "readyToPlay" || player.status === "readyToPlay") &&
      (thumbnailStatus === "ready" || thumbnailStatus === "error"),
  );
  useCropThumbnail(player, selected, status);
  const { sheetAnimation, backdropAnimation, dismiss, isDismissing } =
    useSheetAnimation(height, dismissCrop);
  const { finish, saving, isBusy } = useSaveVideo({ onSaved: dismiss, isDismissing });
  const { browse, blocksClose } = useCropPicker(player, isDismissing, isBusy);
  const { close, back, next } = useCropNavigation({
    player,
    sheet: { dismiss, isDismissing },
    blocksClose,
    isBusy,
  });

  useEffect(() => {
    const subscription = BackHandler.addEventListener("hardwareBackPress", () => {
      close();
      return true;
    });
    return () => subscription.remove();
  }, [close]);

  const isEmptyPicker = step === 1 && !selected;
  const currentFrames =
    selected && frames?.uri === selected.id ? frames.items : [];

  return (
    <View className="flex-1 justify-end">
      <Animated.View
        pointerEvents="none"
        className="absolute inset-0"
        style={[{ backgroundColor: colors.ink }, backdropAnimation]}
      />
      <Pressable
        className="absolute inset-0"
        onPress={close}
        accessibilityRole="button"
        accessibilityLabel="Close crop sheet"
      />
      <Animated.View
        style={[
          {
            width: "100%",
            maxWidth: SHEET_MAX_WIDTH,
            alignSelf: "center",
            height: Math.min(
              height * SHEET_HEIGHT_RATIO,
              height - insets.top - 12,
            ),
          },
          sheetAnimation,
        ]}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          className="flex-1"
        >
          <View className="flex-1 overflow-hidden rounded-t-[28px] bg-white">
            <CropHeader onBack={back} onClose={close} />
            {step === 3 && selected ? (
              <VideoDetailsStep frames={currentFrames} />
            ) : (
              <ScrollView
                key={step}
                className="flex-1"
                contentContainerStyle={{
                  flexGrow: isEmptyPicker ? 1 : undefined,
                  paddingHorizontal: CONTENT_HORIZONTAL_PADDING,
                  paddingTop: 9,
                  paddingBottom: step === 2 ? 12 : 28,
                }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
              >
                <View style={isEmptyPicker ? { flexGrow: 1 } : undefined}>
                  {step === 1 && (
                    <VideoSelectionStep player={player} onBrowse={browse} />
                  )}
                  {step === 2 && selected && (
                    <VideoRangeStep
                      player={player}
                      frames={currentFrames}
                      framesFailed={framesFailed || Platform.OS === "web"}
                    />
                  )}
                </View>
              </ScrollView>
            )}
            <CropFooter
              bottomInset={insets.bottom}
              saving={saving}
              onBack={back}
              onNext={next}
              onFinish={finish}
              onRetryThumbnail={() => useCropStore.getState().retryThumbnail()}
            />
          </View>
        </KeyboardAvoidingView>
      </Animated.View>
      <ToastViewport bottomOffset={96} />
    </View>
  );
}
