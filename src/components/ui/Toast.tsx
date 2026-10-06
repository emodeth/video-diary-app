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
import Animated, { Easing, FadeInDown, FadeOut } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AlertCircle, Check } from "lucide-react-native";
import colors from "@/theme/colors.json";

type ToastKind = "success" | "error";
type ToastItem = { id: number; message: string; kind: ToastKind };
type ToastContextValue = {
  toast: ToastItem | null;
  show: (message: string, kind?: ToastKind) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);
const enterToast = FadeInDown.duration(180)
  .easing(Easing.out(Easing.cubic))
  .withInitialValues({ opacity: 0, transform: [{ translateY: 8 }] });
const exitToast = FadeOut.duration(140).easing(Easing.out(Easing.cubic));

export function ToastProvider({ children, duration = 2200 }: { children: ReactNode; duration?: number }) {
  const [toast, setToast] = useState<ToastItem | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const counter = useRef(0);

  const show = useCallback((message: string, kind: ToastKind = "success") => {
    if (timer.current) clearTimeout(timer.current);
    counter.current += 1;
    setToast({ id: counter.current, message, kind });
    AccessibilityInfo.announceForAccessibility(message);
    timer.current = setTimeout(() => setToast(null), duration);
  }, [duration]);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const value = useMemo(() => ({ toast, show }), [toast, show]);
  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}

export function ToastViewport({ bottomOffset = 96 }: { bottomOffset?: number }) {
  const context = useContext(ToastContext);
  const insets = useSafeAreaInsets();
  if (!context) throw new Error("ToastViewport must be used inside <ToastProvider>");

  return (
    <View pointerEvents="none" className="absolute left-0 right-0 items-center px-6"
      style={{ bottom: insets.bottom + bottomOffset }}>
      {context.toast && (
        <Animated.View key={context.toast.id}
          entering={enterToast}
          exiting={exitToast}
          accessibilityLiveRegion="polite"
          className="max-w-full flex-row items-center gap-2 rounded-full bg-ink px-[18px] py-3"
          style={{
            shadowColor: colors.ink,
            shadowOpacity: 0.25,
            shadowRadius: 12,
            shadowOffset: { width: 0, height: 6 },
            elevation: 6,
          }}>
          {context.toast.kind === "success" ? (
            <Check size={16} color="#FFFFFF" strokeWidth={3} />
          ) : (
            <AlertCircle size={16} color="#FDA29B" strokeWidth={2.5} />
          )}
          <Text className="shrink font-sans-semibold text-body text-white">{context.toast.message}</Text>
        </Animated.View>
      )}
    </View>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used inside <ToastProvider>");
  return context.show;
}
