import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AccessibilityInfo, Text, View } from "react-native";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AlertCircle, Check } from "lucide-react-native";
import colors from "@/theme/colors.json";

type ToastKind = "success" | "error";
type ToastItem = { message: string; kind: ToastKind };
type ToastContextValue = {
  toast: ToastItem | null;
  visible: boolean;
  show: (message: string, kind?: ToastKind) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children, duration = 2200 }: { children: ReactNode; duration?: number }) {
  const [toast, setToast] = useState<ToastItem | null>(null);
  const [visible, setVisible] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = useCallback((message: string, kind: ToastKind = "success") => {
    if (timer.current) clearTimeout(timer.current);
    setToast({ message, kind });
    setVisible(true);
    AccessibilityInfo.announceForAccessibility(message);
    timer.current = setTimeout(() => setVisible(false), duration);
  }, [duration]);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const value = useMemo(() => ({ toast, visible, show }), [toast, visible, show]);
  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}

export function ToastViewport({ bottomOffset = 96 }: { bottomOffset?: number }) {
  const context = useContext(ToastContext);
  const insets = useSafeAreaInsets();
  const toast = context?.toast ?? null;
  const isVisible = context?.visible ?? false;
  const progress = useSharedValue(0);

  useEffect(() => {
    if (isVisible) {
      progress.value = withTiming(1, {
        duration: 220,
        easing: Easing.out(Easing.cubic),
      });
    } else {
      progress.value = withTiming(0, {
        duration: 180,
        easing: Easing.in(Easing.cubic),
      });
    }
  }, [isVisible, progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [
      { translateY: interpolate(progress.value, [0, 1], [12, 0]) },
      { scale: interpolate(progress.value, [0, 1], [0.96, 1]) },
    ],
  }));

  if (!context) throw new Error("ToastViewport must be used inside <ToastProvider>");
  if (!toast) return null;

  return (
    <View pointerEvents="none" collapsable={false} className="absolute left-0 right-0 items-center px-6"
      style={{ bottom: insets.bottom + bottomOffset }}>
      <Animated.View
        accessibilityLiveRegion="polite"
        accessibilityElementsHidden={!isVisible}
        importantForAccessibility={isVisible ? "auto" : "no-hide-descendants"}
        className="max-w-full flex-row items-center gap-2 rounded-full bg-ink px-[18px] py-3"
        style={[
          {
            shadowColor: colors.ink,
            shadowOpacity: 0.25,
            shadowRadius: 12,
            shadowOffset: { width: 0, height: 6 },
            elevation: 6,
          },
          animatedStyle,
        ]}>
        {toast.kind === "success" ? (
          <Check size={16} color="#FFFFFF" strokeWidth={3} />
        ) : (
          <AlertCircle size={16} color="#FDA29B" strokeWidth={2.5} />
        )}
        <Text className="shrink font-sans-semibold text-body text-white">{toast.message}</Text>
      </Animated.View>
    </View>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used inside <ToastProvider>");
  return context.show;
}
