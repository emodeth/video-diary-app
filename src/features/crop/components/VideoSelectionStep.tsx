import { Text, View } from "react-native";
import type { VideoThumbnail } from "expo-video";
import { useCropStore } from "../store";
import { EmptyVideoSelection } from "./EmptyVideoSelection";
import { SelectedVideoSelection } from "./SelectedVideoSelection";

type Props = {
  poster: VideoThumbnail | null;
  onBrowse: () => void;
};

export function VideoSelectionStep({ poster, onBrowse }: Props) {
  const selected = useCropStore((state) => state.selected);

  return (
    <View className={selected ? undefined : "flex-1"}>
      <Text className="font-sans-bold text-title tracking-[-0.7px] text-ink">
        Select a video
      </Text>
      <Text className="mt-[5px] font-sans text-lead text-muted">
        Choose a clip from your device. You’ll pick a 5-second moment next.
      </Text>
      {selected ? (
        <SelectedVideoSelection selected={selected} poster={poster} onBrowse={onBrowse} />
      ) : (
        <EmptyVideoSelection onBrowse={onBrowse} />
      )}
    </View>
  );
}
