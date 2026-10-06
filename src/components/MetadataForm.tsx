import { Image, type ImageProps } from "expo-image";
import { Text, TextInput, View } from "react-native";

type Props = {
  heading: string;
  helperText: string;
  thumbnailSource?: ImageProps["source"];
  timeRange: string;
  clipDescription: string;
  name: string;
  onChangeName: (value: string) => void;
  description: string;
  onChangeDescription: (value: string) => void;
  thumbnailFeedback?: { message: string; isError?: boolean };
};

export function MetadataForm({
  heading,
  helperText,
  thumbnailSource,
  timeRange,
  clipDescription,
  name,
  onChangeName,
  description,
  onChangeDescription,
  thumbnailFeedback,
}: Props) {
  return (
    <>
      <Text className="font-sans-bold text-title tracking-[-0.7px] text-ink">{heading}</Text>
      <Text className="mt-[5px] font-sans text-lead text-muted">{helperText}</Text>
      <View className="mt-[23px] flex-row items-center gap-[15px] border-b border-[#E7EAF0] pb-[22px]">
        <View className="h-[61px] w-[81px] overflow-hidden rounded-[12px] bg-black">
          {thumbnailSource && <Image source={thumbnailSource} contentFit="contain" style={{ width: "100%", height: "100%" }} />}
        </View>
        <View className="flex-1">
          <Text className="font-sans-semibold text-row text-ink tabular-nums">{timeRange}</Text>
          <Text className="mt-[3px] font-sans text-meta text-muted">{clipDescription}</Text>
        </View>
      </View>
      {thumbnailFeedback && (
        <Text className={thumbnailFeedback.isError
          ? "mt-3 font-sans text-hint text-danger"
          : "mt-3 font-sans text-hint text-muted"}>
          {thumbnailFeedback.message}
        </Text>
      )}
      <View className="mt-[23px] flex-row justify-between">
        <Text className="font-sans-semibold text-body text-ink">Name</Text>
        <Text className="font-sans-medium text-meta text-muted tabular-nums">{name.length}/40</Text>
      </View>
      <TextInput value={name} onChangeText={onChangeName} maxLength={40}
        placeholder="e.g. Ferry ride at sunrise" placeholderTextColor="#98A2B3"
        className="mt-[8px] h-[55px] rounded-[14px] border border-[#E5E9F0] px-[16px] font-sans text-body text-ink"
        accessibilityLabel="Video name" />
      <View className="mt-[48px] flex-row justify-between">
        <Text className="font-sans-semibold text-body text-ink">Description</Text>
        <Text className="font-sans-medium text-meta text-muted tabular-nums">{description.length}/200</Text>
      </View>
      <TextInput value={description} onChangeText={onChangeDescription} maxLength={200}
        multiline textAlignVertical="top" placeholder="What makes this moment worth keeping?"
        placeholderTextColor="#98A2B3"
        className="mt-[8px] min-h-[130px] rounded-[14px] border border-[#E5E9F0] px-[16px] py-[15px] font-sans text-body text-ink"
        accessibilityLabel="Video description" />
    </>
  );
}
