import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSQLiteContext } from "expo-sqlite";
import { X } from "lucide-react-native";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import { Button } from "@/components/ui/Button";
import { MetadataForm } from "@/components/MetadataForm";
import { ToastViewport, useToast } from "@/components/ui/Toast";
import { formatTime } from "@/lib/formatTime";
import { thumbnailFile } from "@/lib/file-system";
import colors from "@/theme/colors.json";
import type { Video } from "@/types/videos";
import { videoKeys } from "@/hooks/keys";
import { updateVideoDetails } from "@/db/videos.repository";

type Props = {
  video: Video;
  onClose: () => void;
};

export function EditVideoModal({ video, onClose }: Props) {
  const db = useSQLiteContext();
  const queryClient = useQueryClient();
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const showToast = useToast();
  const [title, setTitle] = useState(video.title);
  const [description, setDescription] = useState(video.description);
  const [saving, setSaving] = useState(false);
  const closing = useRef(false);
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(1, { duration: 420, easing: Easing.out(Easing.cubic) });
  }, [progress]);

  const sheetAnimation = useAnimatedStyle(() => ({
    transform: [{ translateY: (1 - progress.value) * height }],
  }));
  const backdropAnimation = useAnimatedStyle(() => ({ opacity: progress.value * 0.35 }));

  function animateOut() {
    if (closing.current) return;
    closing.current = true;
    // Reanimated shared values are intentionally mutable outside React render.
    // eslint-disable-next-line react-hooks/immutability
    progress.value = withTiming(0, { duration: 220, easing: Easing.in(Easing.cubic) }, (finished) => {
      if (finished) scheduleOnRN(onClose);
    });
  }

  function dismiss() {
    if (!saving) animateOut();
  }

  async function saveDetails() {
    if (!title.trim() || saving) return;
    setSaving(true);
    try {
      await updateVideoDetails(db, video.id, title.trim(), description.trim());
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: videoKeys.detail(video.id) }),
        queryClient.invalidateQueries({ queryKey: videoKeys.all }),
      ]);
      animateOut();
      showToast("Video details saved");
    } catch {
      showToast("Couldn’t save details. Please try again", "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal visible transparent animationType="none" statusBarTranslucent navigationBarTranslucent
      onRequestClose={dismiss}>
      <View className="flex-1 justify-end">
        <Animated.View pointerEvents="none" className="absolute inset-0"
          style={[{ backgroundColor: colors.ink }, backdropAnimation]} />
        <Pressable className="absolute inset-0" accessibilityLabel="Close edit details"
          disabled={saving} onPress={dismiss} />
        <Animated.View
          style={[
            { width: "100%", maxWidth: 620, alignSelf: "center", height: Math.min(height * 0.91, height - insets.top - 12) },
            sheetAnimation,
          ]}
        >
          <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} className="flex-1">
          <View className="flex-1 overflow-hidden rounded-t-[28px] bg-surface">
            <View className="items-center pt-[9px]"><View className="h-1 w-10 rounded-full bg-[#E6E9EF]" /></View>
            <View className="h-[67px] flex-row items-center justify-between px-5">
              <View className="h-11 w-11" />
              <Text className="font-sans-bold text-nav text-ink">Edit video</Text>
              <Pressable accessibilityRole="button" accessibilityLabel="Close" disabled={saving}
                onPress={dismiss} className="h-11 w-11 items-center justify-center">
                <X size={25} color={colors.ink} strokeWidth={2} />
              </Pressable>
            </View>
            <ScrollView className="flex-1" keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 27, paddingTop: 9, paddingBottom: 28 }}>
              <MetadataForm
                heading="Edit details"
                helperText="Update the name and description for this video."
                thumbnailSource={video.thumbnail_file_name
                  ? { uri: thumbnailFile(video.thumbnail_file_name).uri }
                  : undefined}
                timeRange={`${formatTime(video.start_seconds)} – ${formatTime(video.start_seconds + video.duration_seconds)}`}
                clipDescription={`Saved ${formatTime(video.duration_seconds)} clip`}
                name={title}
                onChangeName={setTitle}
                description={description}
                onChangeDescription={setDescription}
              />
            </ScrollView>
            <View className="border-t border-[#F2F3F6] bg-surface px-[27px] pt-[12px]"
              style={{ paddingBottom: Math.max(insets.bottom, 16) }}>
              <View className="flex-row gap-[11px]">
                <View className="w-[106px]"><Button label="Cancel" variant="outline" size="dialog" fullWidth disabled={saving} onPress={dismiss} /></View>
                <View className="flex-1"><Button label={saving ? "Saving…" : "Save details"} size="dialog" fullWidth
                  disabled={saving || !title.trim()} onPress={() => { void saveDetails(); }} /></View>
              </View>
            </View>
          </View>
          </KeyboardAvoidingView>
        </Animated.View>
        <ToastViewport bottomOffset={96} />
      </View>
    </Modal>
  );
}
