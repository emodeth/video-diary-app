import type { ReactNode } from "react";
import { Pressable, Text, View, type PressableProps } from "react-native";

type ButtonVariant = "normal" | "ghost" | "outline" | "delete";
type ButtonSize = "compact" | "default" | "large" | "hero" | "icon" | "row";

type ButtonProps = Omit<PressableProps, "children" | "style"> & {
  label: string;
  children?: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  iconOnly?: boolean;
  fullWidth?: boolean;
  className?: string;
};

const containerVariants: Record<ButtonVariant, string> = {
  normal: "bg-brand",
  ghost: "bg-transparent",
  outline: "border border-line bg-surface",
  delete: "bg-danger",
};

const textVariants: Record<ButtonVariant, string> = {
  normal: "text-onBrand",
  ghost: "text-brand",
  outline: "text-ink",
  delete: "text-onBrand",
};

const sizeStyles: Record<ButtonSize, string> = {
  compact: "h-[45px] rounded-[16px] px-6",
  default: "h-[52px] rounded-[16px] px-6",
  large: "h-[58px] rounded-[16px] px-6",
  hero: "h-16 rounded-[20px] px-8",
  icon: "h-16 w-16 rounded-full",
  row: "min-h-[126px] py-[16px]",
};

export function Button({
  label,
  children,
  variant = "normal",
  size = "default",
  icon,
  iconOnly = false,
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
        className={`${sizeStyles[size]} flex-row items-center justify-center ${size === "row" ? "gap-0" : "gap-3"} ${disabled && variant === "normal" ? "bg-line" : containerVariants[variant]}`}
      >
        {icon}
        {children ?? (!iconOnly && (
          <Text className={`font-sans-bold text-button ${disabled && variant === "normal" ? "text-muted" : textVariants[variant]}`}>{label}</Text>
        ))}
      </View>
    </Pressable>
  );
}
