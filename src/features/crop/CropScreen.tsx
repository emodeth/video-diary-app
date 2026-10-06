import { useEffect, useRef, useState } from "react";
import { useEvent } from "expo";
import { useVideoPlayer, type VideoThumbnail } from "expo-video";
import { router } from "expo-router";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, View, useWindowDimensions } from "react-native";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ToastViewport, useToast } from "@/components/ui/Toast";
import { useCreateVideo } from "@/features/videos/hooks";
import { deleteThumbnailFile, thumbnailFile } from "@/features/videos/storage";
import { createVideoThumbnail } from "@/features/videos/thumbnail";
import type { VideoSource } from "@/types/crop";
import { VideoDetailsStep } from "./components/VideoDetailsStep";
import { VideoRangeStep } from "./components/VideoRangeStep";
import { CropFooter } from "./components/CropFooter";
import { CropHeader } from "./components/CropHeader";
import { VideoSelectionStep } from "./components/VideoSelectionStep";
import { useCropStore } from "./store";
import { pickVideo } from "./utils/pickVideo";

function dismissCrop() {
  router.back();
}

export default function CropScreen() {
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const showToast = useToast();
  const { mutateAsync: createVideo, isPending: saving } = useCreateVideo();
  const step = useCropStore((state) => state.step);
  const selected = useCropStore((state) => state.selected);
  const thumbnailStatus = useCropStore((state) => state.thumbnailStatus);
  const thumbnailFileName = useCropStore((state) => state.thumbnailFileName);
  const selectionVersion = useCropStore((state) => state.selectionVersion);
  const previousStep = useCropStore((state) => state.previousStep);
  const selectSource = useCropStore((state) => state.selectSource);
  const reset = useCropStore((state) => state.reset);
  const finishInFlight = useRef(false);
  const mounted = useRef(false);
  const player = useVideoPlayer(selected?.id ?? null);
  const { status } = useEvent(player, "statusChange", { status: player.status });
  const [frames, setFrames] = useState<{ uri: string; items: VideoThumbnail[] } | null>(null);
  const [framesFailed, setFramesFailed] = useState(false);
  const needsTimelineFrames = step >= 2;
  const progress = useSharedValue(0);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      reset();
    };
  }, [reset]);

  useEffect(() => {
    if (!selected || thumbnailStatus !== "loading") return;
    if (status === "error") {
      useCropStore.getState().setThumbnailError(selectionVersion);
      return;
    }
    if (status !== "readyToPlay") return;
    let cancelled = false;

    void createVideoThumbnail(player)
      .then((fileName) => {
        if (cancelled || !useCropStore.getState().setThumbnail(selectionVersion, fileName)) {
          deleteThumbnailFile(fileName);
        }
      })
      .catch(() => useCropStore.getState().setThumbnailError(selectionVersion));

    return () => { cancelled = true; };
  }, [player, selected, selectionVersion, status, thumbnailStatus]);

  useEffect(() => {
    if (!needsTimelineFrames || !selected || status !== "readyToPlay" || thumbnailStatus === "loading" || Platform.OS === "web") return;
    let cancelled = false;
    const uri = selected.id;
    const count = 8;
    const times = Array.from({ length: count }, (_, index) =>
      Math.min(selected.duration - 0.01, (selected.duration * (index + 0.5)) / count));

    async function loadFrames() {
      const options = { maxWidth: 90, maxHeight: 160 };
      try {
        const items = await player.generateThumbnailsAsync(times, options);
        if (items.length !== count) throw new Error("Incomplete video thumbnails");
        if (!cancelled) setFrames({ uri, items });
      } catch {
        // A single bad frame can reject the batch. Keep the frames that do render.
        const partial: (VideoThumbnail | null)[] = [];
        for (const time of times) {
          if (cancelled) return;
          try {
            partial.push((await player.generateThumbnailsAsync([time], options))[0] ?? null);
          } catch {
            partial.push(null);
          }
          const first = partial.find((item): item is VideoThumbnail => item !== null);
          if (first && !cancelled) {
            setFrames({ uri, items: times.map((_, index) => partial[index] ?? first) });
          }
        }
        const available = partial.flatMap((item, index) => item ? [{ item, index }] : []);
        if (cancelled) return;
        if (available.length === 0) {
          setFramesFailed(true);
          return;
        }
        setFrames({
          uri,
          items: partial.map((item, index) => item ?? available.reduce((closest, candidate) =>
            Math.abs(candidate.index - index) < Math.abs(closest.index - index) ? candidate : closest).item),
        });
      }
    }

    void loadFrames();
    return () => { cancelled = true; };
  }, [player, selected, status, needsTimelineFrames, thumbnailStatus]);

  useEffect(() => {
    progress.value = withTiming(1, { duration: 420, easing: Easing.out(Easing.cubic) });
  }, [progress]);

  const sheetAnimation = useAnimatedStyle(() => ({
    transform: [{ translateY: (1 - progress.value) * height }],
  }));
  const backdropAnimation = useAnimatedStyle(() => ({ opacity: progress.value * 0.35 }));

  function dismiss() {
    // Reanimated shared values are intentionally mutable outside React render.
    // eslint-disable-next-line react-hooks/immutability
    progress.value = withTiming(0, { duration: 220, easing: Easing.in(Easing.cubic) }, (finished) => {
      if (finished) scheduleOnRN(dismissCrop);
    });
  }

  function close() {
    if (!saving && !finishInFlight.current) dismiss();
  }

  function back() {
    if (saving || finishInFlight.current) return;
    if (step === 1) close();
    else previousStep();
  }

  function chooseSource(source: VideoSource) {
    player.pause();
    selectSource(source);
    setFrames(null);
    setFramesFailed(false);
  }

  async function browse() {
    try {
      const source = await pickVideo();
      if (source && mounted.current) chooseSource(source);
    } catch (error) {
      if (!mounted.current) return;
      const reason = error instanceof Error ? error.message : "";
      if (reason === "permission") {
        showToast("Allow library access to choose a video", "error");
      } else if (reason === "tooShort") {
        showToast("Choose a video at least 5 seconds long", "error");
      } else {
        showToast("Couldn’t open library. Please try again", "error");
      }
    }
  }

  async function finish() {
    const { selected, start, name, description, thumbnailFileName, thumbnailStatus } = useCropStore.getState();
    if (saving || finishInFlight.current || !selected || !name.trim() || !thumbnailFileName || thumbnailStatus !== "ready") return;
    finishInFlight.current = true;
    try {
      await createVideo({
        sourceUri: selected.id,
        thumbnailFileName,
        startSeconds: start,
        title: name,
        description,
      });
      useCropStore.getState().markThumbnailSaved();
      dismiss();
      showToast("Video saved to your diary");
    } catch {
      showToast("Couldn’t save video. Please try again", "error");
    } finally {
      finishInFlight.current = false;
    }
  }

  return (
    <View className="flex-1 justify-end">
      <Animated.View pointerEvents="none" className="absolute inset-0"
        style={[{ backgroundColor: "#101828" }, backdropAnimation]} />
      <Pressable className="absolute inset-0" onPress={close} accessibilityLabel="Close crop sheet" />
      <Animated.View
        style={[
          { width: "100%", maxWidth: 620, alignSelf: "center", height: Math.min(height * 0.91, height - insets.top - 12) },
          sheetAnimation,
        ]}
      >
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} className="flex-1">
          <View className="flex-1 overflow-hidden rounded-t-[28px] bg-white">
            <CropHeader onBack={back} onClose={close} />
            <ScrollView key={step} className="flex-1"
              contentContainerStyle={{
                flexGrow: step === 1 && !selected ? 1 : undefined,
                paddingHorizontal: 27,
                paddingTop: 9,
                paddingBottom: step === 2 ? 12 : 28,
              }}
              keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
              <View style={step === 1 && !selected ? { flexGrow: 1 } : undefined}>
                {step === 1 && <VideoSelectionStep poster={thumbnailFileName ? thumbnailFile(thumbnailFileName).uri : null}
                  onBrowse={browse} />}
                {step === 2 && selected && <VideoRangeStep player={player} playerStatus={status} frames={frames?.uri === selected.id ? frames.items : []}
                  framesFailed={framesFailed || Platform.OS === "web"} />}
                {step === 3 && selected && <VideoDetailsStep frames={frames?.uri === selected.id ? frames.items : []} />}
              </View>
            </ScrollView>
            <CropFooter bottomInset={insets.bottom} saving={saving} onBack={back} onFinish={finish} />
          </View>
        </KeyboardAvoidingView>
      </Animated.View>
      <ToastViewport bottomOffset={96} />
    </View>
  );
}
