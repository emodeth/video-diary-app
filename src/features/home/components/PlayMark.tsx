import { Text, View } from "react-native";

export function PlayMark() {
  return (
    <View className="h-9 w-9 items-center justify-center rounded-full bg-white/90">
      <Text className="pl-[2px] font-bold text-[14px] text-brand">▶</Text>
    </View>
  );
}
