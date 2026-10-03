import { Pressable, Text } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

type Props = {
  label: string;
  onPress: () => void;
  secondary?: boolean;
  disabled?: boolean;
};

export function ActionButton({ label, onPress, secondary = false, disabled = false }: Props) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      onPressIn={() => {
        // eslint-disable-next-line react-hooks/immutability
        scale.value = withTiming(0.96, { duration: 120 });
      }}
      onPressOut={() => {
        // eslint-disable-next-line react-hooks/immutability
        scale.value = withTiming(1, { duration: 150 });
      }}
    >
      <Animated.View
        style={animatedStyle}
        className={`h-[58px] items-center justify-center rounded-[16px] px-6 ${secondary ? "border border-[#E4E8EF] bg-white" : disabled ? "bg-[#E9EBEF]" : "bg-brand"}`}
      >
        <Text className={`font-bold text-[17px] ${secondary ? "text-ink" : disabled ? "text-[#66748D]" : "text-white"}`}>
          {label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}
