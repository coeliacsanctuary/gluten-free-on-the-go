import { TextInput as DefaultTextInput, TextInputProps } from "react-native";
import { Colors } from "@/constants/Colors";
import { withOpacity } from "@/helpers/helpers";
import Label from "@/components/Form/Label";
import React from "react";

export type TexInputFieldProps = Omit<
  TextInputProps,
  "numberOfLines" | "multiline" | "editable"
> & {
  label?: string;
  required?: boolean;
};

export default function TexInputField({
  style,
  label = undefined,
  required = false,
  ...props
}: TexInputFieldProps) {
  let inputComponent = (
    <>
      <DefaultTextInput
        style={[
          {
            borderColor: withOpacity(Colors.text, 0.1),
            borderRadius: 4,
            borderWidth: 1,
            padding: 4,
          },
          style,
        ]}
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
