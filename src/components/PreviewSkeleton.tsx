import { useEffect, useState } from "react";
import { Animated, Easing, View } from "react-native";
import Svg, { Defs, LinearGradient, Rect, Stop } from "react-native-svg";
import colors from "@/theme/colors.json";

const SHIMMER_WIDTH = 160;

type PreviewSkeletonProps = {
  width: number;
  shimmer?: boolean;
  label?: string;
};

export function PreviewSkeleton({ width, shimmer = true, label = "Video preview loading" }: PreviewSkeletonProps) {
  const [progress] = useState(() => new Animated.Value(0));

  useEffect(() => {
    if (!shimmer) return;
    const animation = Animated.loop(Animated.sequence([
      Animated.timing(progress, {
        toValue: 1,
        duration: 1400,
        easing: Easing.linear,
        useNativeDriver: true,
        isInteraction: false,
      }),
      Animated.delay(300),
    ]));
    animation.start();
    return () => {
      animation.stop();
      progress.setValue(0);
    };
  }, [progress, shimmer]);

  const translateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [-SHIMMER_WIDTH, width],
  });

  return (
    <View pointerEvents="none" accessibilityLabel={label} className="absolute inset-0 overflow-hidden bg-previewSkeleton">
      <Animated.View
        pointerEvents="none"
        style={{ position: "absolute", top: 0, bottom: 0, width: SHIMMER_WIDTH, transform: [{ translateX }] }}
      >
        <Svg width={SHIMMER_WIDTH} height="100%">
          <Defs>
            <LinearGradient id="preview-shimmer" x1="0%" y1="0%" x2="100%" y2="0%">
              <Stop offset="0%" stopColor={colors.onBrand} stopOpacity={0} />
              <Stop offset="50%" stopColor={colors.onBrand} stopOpacity={0.8} />
              <Stop offset="100%" stopColor={colors.onBrand} stopOpacity={0} />
            </LinearGradient>
          </Defs>
          <Rect x={0} y={0} width={SHIMMER_WIDTH} height="100%" fill="url(#preview-shimmer)" />
        </Svg>
      </Animated.View>
    </View>
  );
}
