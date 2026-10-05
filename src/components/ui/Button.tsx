import type { ReactNode } from "react";
import { Pressable, Text, View, type PressableProps } from "react-native";

type ButtonVariant = "normal" | "ghost" | "outline" | "delete";

type ButtonProps = Omit<PressableProps, "children" | "style"> & {
  label: string;
  variant?: ButtonVariant;
  size?: "compact" | "default" | "large";
  icon?: ReactNode;
  fullWidth?: boolean;
  className?: string;
};

const containerVariants: Record<ButtonVariant, string> = {
  normal: "bg-brand",
  ghost: "bg-transparent",
  outline: "border border-[#E4E8EF] bg-white",
  delete: "bg-danger",
};

const textVariants: Record<ButtonVariant, string> = {
  normal: "text-white",
  ghost: "text-brand",
  outline: "text-ink",
  delete: "text-white",
};

export function Button({
  label,
  variant = "normal",
  size = "default",
  icon,
  fullWidth = false,
  disabled = false,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <Pressable
      {...props}
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      disabled={!!disabled}
      className={`${fullWidth ? "self-stretch" : "self-start"} ${className}`}
      style={({ pressed }) => ({
        transform: [{ scale: pressed && !disabled ? 0.96 : 1 }],
        opacity: disabled && variant !== "normal" ? 0.5 : 1,
      })}
    >
      <View
        className={`${size === "large" ? "h-[58px]" : size === "compact" ? "h-[45px]" : "h-[52px]"} flex-row items-center justify-center gap-3 rounded-[16px] px-6 ${disabled && variant === "normal" ? "bg-[#E8EAEE]" : containerVariants[variant]}`}
      >
        {icon}
        <Text className={`font-bold text-[16px] ${disabled && variant === "normal" ? "text-[#9AA5BE]" : textVariants[variant]}`}>{label}</Text>
      </View>
    </Pressable>
  );
}
