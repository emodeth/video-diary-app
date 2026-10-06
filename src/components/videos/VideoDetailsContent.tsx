import { ScrollView } from "react-native";
import { VideoDetailsBody } from "@/components/videos/VideoDetailsBody";
import { VideoDetailsSkeleton } from "@/components/videos/VideoDetailsSkeleton";
import type { Video } from "@/types/videos";

type VideoDetailsContentProps = {
  video?: Video | null;
  previewWidth: number;
  cardHeight: number;
};

export function VideoDetailsContent({ video, previewWidth, cardHeight }: VideoDetailsContentProps) {
  return (
    <ScrollView className="flex-1" contentContainerClassName="flex-grow px-6 pt-2" showsVerticalScrollIndicator={false}>
      {video ? (
        <VideoDetailsBody video={video} previewWidth={previewWidth} cardHeight={cardHeight} />
      ) : (
        <VideoDetailsSkeleton previewWidth={previewWidth} cardHeight={cardHeight} />
      )}
    </ScrollView>
  );
}
