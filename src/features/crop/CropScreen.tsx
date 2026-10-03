import { useEffect, useState } from "react";
import { router } from "expo-router";
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, View, useWindowDimensions } from "react-native";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { ClipSource, CropStep } from "@/types/crop";
import { ClipDetailsStep } from "./components/ClipDetailsStep";
import { ClipRangeStep } from "./components/ClipRangeStep";
import { CropFooter } from "./components/CropFooter";
import { CropHeader } from "./components/CropHeader";
import { VideoSelectionStep } from "./components/VideoSelectionStep";
import { formatTime } from "./utils/formatTime";
import { pickVideo } from "./utils/pickVideo";

function dismissCrop() {
  router.back();
}

export default function CropScreen() {
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState<CropStep>(1);
  const [selected, setSelected] = useState<ClipSource | null>(null);
  const [start, setStart] = useState(0);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(1, { duration: 420, easing: Easing.out(Easing.cubic) });
  }, [progress]);

  const sheetAnimation = useAnimatedStyle(() => ({
    transform: [{ translateY: (1 - progress.value) * height }],
  }));
  const backdropAnimation = useAnimatedStyle(() => ({ opacity: progress.value * 0.35 }));

  function close() {
    // Reanimated shared values are intentionally mutable outside React render.
    // eslint-disable-next-line react-hooks/immutability
    progress.value = withTiming(0, { duration: 220, easing: Easing.in(Easing.cubic) }, (finished) => {
      if (finished) scheduleOnRN(dismissCrop);
    });
  }

  function back() {
    if (step === 1) close();
    else setStep((step - 1) as CropStep);
  }

  function next() {
    if (step < 3) setStep((step + 1) as CropStep);
  }

  function chooseSource(source: ClipSource) {
    setSelected(source);
    setStart(0);
  }

  async function browse() {
    try {
      const source = await pickVideo();
      if (source) chooseSource(source);
    } catch (error) {
      const reason = error instanceof Error ? error.message : "";
      if (reason === "permission") {
        Alert.alert("Library access needed", "Allow access to choose a video from your library.");
      } else if (reason === "tooShort") {
        Alert.alert("Choose a longer video", "Your video needs to be at least 5 seconds long.");
      } else {
        Alert.alert("Couldn’t open library", "Please try choosing a video again.");
      }
    }
  }

  function finish() {
    Alert.alert("Mock clip ready", `“${name.trim()}” · ${formatTime(start)} – ${formatTime(start + 5)}`, [
      { text: "Done", onPress: close },
    ]);
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
            <CropHeader step={step} onBack={back} onClose={close} />
            <ScrollView key={step} className="flex-1"
              contentContainerStyle={{ paddingHorizontal: 27, paddingTop: 9, paddingBottom: 28 }}
              keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
              <View>
                {step === 1 && <VideoSelectionStep selected={selected} onSelect={chooseSource} onBrowse={browse} />}
                {step === 2 && selected && <ClipRangeStep selected={selected} start={start} onStartChange={setStart} />}
                {step === 3 && selected && <ClipDetailsStep selected={selected} start={start}
                  name={name} description={description} onNameChange={setName}
                  onDescriptionChange={setDescription} />}
              </View>
            </ScrollView>
            <CropFooter step={step} bottomInset={insets.bottom} hasSelection={!!selected}
              hasName={!!name.trim()} onNext={next} onBack={back} onFinish={finish} />
          </View>
        </KeyboardAvoidingView>
      </Animated.View>
    </View>
  );
}
