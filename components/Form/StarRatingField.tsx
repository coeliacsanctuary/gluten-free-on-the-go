import { Pressable, View, ViewProps } from "react-native";
import { Colors } from "@/constants/Colors";
import { IconSymbol } from "@/components/Ui/IconSymbol";
import Label from "@/components/Form/Label";
import React from "react";

export type StarRatingInputValue = 1 | 2 | 3 | 4 | 5;

export type StarRatingFieldProps = ViewProps & {
  value: StarRatingInputValue;
  onChange: (value: StarRatingInputValue) => void;
  label?: string;
  required?: boolean;
};

export default function StarRatingField({
  value,
  onChange,
  style,
  label = undefined,
  required = false,
  ...props
}: StarRatingFieldProps) {
  const stars: StarRatingInputValue[] = [1, 2, 3, 4, 5];

  let inputComponent = (
    <>
      <View style={[{ flexDirection: "row", gap: 1 }, style]} {...props}>
        {stars.map((star) => (
          <Pressable key={star} onPress={() => onChange(star)}>
            <IconSymbol
              name={star <= (value ?? 0) ? "star.fill" : "star"}
              color={Colors.secondary}
              size={48}
            />
          </Pressable>
        ))}
      </View>
    </>
  );

  if (label) {
    return (
      <Label label={label} required={required}>
        {inputComponent}
      </Label>
    );
  }

  return inputComponent;
}
