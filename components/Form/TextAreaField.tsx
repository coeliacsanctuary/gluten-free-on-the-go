import { TextInput, TextInputProps } from "react-native";
import { Colors } from "@/constants/Colors";
import { withOpacity } from "@/helpers/helpers";
import Label from "@/components/Form/Label";
import React from "react";

export type TextAreaFieldProps = Omit<
  TextInputProps,
  "multiline" | "editable"
> & {
  label?: string;
  required?: boolean;
};

export default function TextAreaField({
  style,
  numberOfLines = 3,
  label = undefined,
  required = false,
  ...props
}: TextAreaFieldProps) {
  const lineHeight = 20;
  const verticalPadding = 8;

  const inputComponent = (
    <>
      <TextInput
        style={[
          {
            borderColor: withOpacity(Colors.text, 0.2),
            borderWidth: 1,
            borderRadius: 6,
            padding: 4,
            minHeight: numberOfLines * lineHeight + verticalPadding,
            textAlignVertical: "top",
          },
          style,
        ]}
        numberOfLines={numberOfLines}
        multiline
        editable
        {...props}
      />
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
