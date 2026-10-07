import type { ReactNode } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { HomeListHeader } from "@/components/home/HomeListHeader";

type HomeStateProps = {
  children: ReactNode;
};

export function HomeState({ children }: HomeStateProps) {
  return (
    <SafeAreaView className="flex-1 bg-surface" edges={["top", "bottom"]}>
      <View className="flex-1 px-7">
        <HomeListHeader totalVideos={0} totalSeconds={0} />
        {children}
      </View>
    </SafeAreaView>
  );
}
