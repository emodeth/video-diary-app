import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Image, type ImageProps } from "expo-image";
import { useController, useForm } from "react-hook-form";
import { Text, TextInput, View } from "react-native";
import { DESCRIPTION_MAX, NAME_MAX } from "@/constants";
import { videoMetadataSchema, type VideoMetadata } from "@/schemas/video-metadata.schema";

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
  const { control, getValues, setValue } = useForm<VideoMetadata>({
    resolver: zodResolver(videoMetadataSchema),
    defaultValues: { name, description },
    mode: "onChange",
  });
  const { field: nameField, fieldState: nameState } = useController({ control, name: "name" });
  const { field: descriptionField, fieldState: descriptionState } = useController({ control, name: "description" });
  const nameError = nameState.error?.message;
  const descriptionError = descriptionState.error?.message;

  useEffect(() => {
    if (getValues("name") !== name) setValue("name", name, { shouldValidate: true });
    if (getValues("description") !== description) setValue("description", description, { shouldValidate: true });
  }, [description, getValues, name, setValue]);

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
        <Text className="font-sans-medium text-meta text-muted tabular-nums">{nameField.value.length}/{NAME_MAX}</Text>
      </View>
      <TextInput value={nameField.value} onChangeText={(value) => {
        nameField.onChange(value);
        onChangeName(value);
      }} onBlur={nameField.onBlur} maxLength={NAME_MAX}
        placeholder="e.g. Ferry ride at sunrise" placeholderTextColor="#98A2B3"
        className={`mt-[8px] h-[55px] rounded-[14px] border px-[16px] font-sans text-body text-ink ${nameError ? "border-danger" : "border-[#E5E9F0]"}`}
        accessibilityLabel="Video name" />
      {nameError && <Text accessibilityLiveRegion="polite" className="mt-2 font-sans text-hint text-danger">{nameError}</Text>}
      <View className="mt-[48px] flex-row justify-between">
        <Text className="font-sans-semibold text-body text-ink">Description</Text>
        <Text className="font-sans-medium text-meta text-muted tabular-nums">{descriptionField.value.length}/{DESCRIPTION_MAX}</Text>
      </View>
      <TextInput value={descriptionField.value} onChangeText={(value) => {
        descriptionField.onChange(value);
        onChangeDescription(value);
      }} onBlur={descriptionField.onBlur} maxLength={DESCRIPTION_MAX}
        multiline textAlignVertical="top" placeholder="What makes this moment worth keeping?"
        placeholderTextColor="#98A2B3"
        className={`mt-[8px] min-h-[130px] rounded-[14px] border px-[16px] py-[15px] font-sans text-body text-ink ${descriptionError ? "border-danger" : "border-[#E5E9F0]"}`}
        accessibilityLabel="Video description" />
      {descriptionError && <Text accessibilityLiveRegion="polite" className="mt-2 font-sans text-hint text-danger">{descriptionError}</Text>}
    </>
  );
}
