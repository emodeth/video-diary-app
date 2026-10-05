import { View } from "react-native";

const SKELETON_ROWS = [0, 1, 2];

export function VideoListSkeleton() {
  return (
    <View accessibilityLabel="Loading videos">
      {SKELETON_ROWS.map((row) => (
        <View key={row}>
          {row > 0 && <View className="h-px bg-line" />}
          <View className="min-h-[126px] flex-row items-center py-[16px]">
            <View className="h-[94px] w-[108px] rounded-[13px] bg-line" />
            <View className="min-w-0 flex-1 pl-[16px]">
              <View className="h-[20px] w-4/5 rounded-md bg-line" />
              <View className="mt-[8px] h-[16px] w-full rounded-md bg-line" />
              <View className="mt-[6px] h-[16px] w-3/5 rounded-md bg-line" />
              <View className="mt-[9px] h-[14px] w-1/3 rounded-md bg-line" />
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}
