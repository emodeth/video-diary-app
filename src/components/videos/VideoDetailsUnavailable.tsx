import { Text, View } from "react-native";
import { Button } from "@/components/ui/Button";

type VideoDetailsUnavailableProps = {
  isError: boolean;
  isFetching: boolean;
  onRetry: () => void;
};

export function VideoDetailsUnavailable({ isError, isFetching, onRetry }: VideoDetailsUnavailableProps) {
  return (
    <View className="flex-1 items-center justify-center px-6 pb-16">
      <Text className="text-center font-sans-semibold text-section-title text-ink">
        {isError ? "Couldn’t load video" : "Video not found"}
      </Text>
      <Text className="mt-2 text-center font-sans text-lead text-muted">
        {isError ? "Please try again." : "This video may have been deleted."}
      </Text>
      {isError && (
        <Button
          label={isFetching ? "Retrying…" : "Try again"}
          disabled={isFetching}
          onPress={onRetry}
          className="mt-6"
        />
      )}
    </View>
  );
}
