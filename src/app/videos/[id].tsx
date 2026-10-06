import { useLocalSearchParams } from "expo-router";
import { VideoDetailsScreen } from "@/features/videos/VideoDetailsScreen";

export default function VideoRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <VideoDetailsScreen videoId={Number(id)} />;
}
