import {
  TextInput as DefaultTextInput,
  TextInputProps,
  View,
  ViewProps,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { withOpacity } from "@/helpers/helpers";
import Label from "@/components/Form/Label";
import React from "react";
import { IconSymbol, IconSymbolName } from "@/components/Ui/IconSymbol";

export type TexInputFieldProps = Omit<
  TextInputProps,
  "numberOfLines" | "multiline" | "editable" | "style"
> & {
  label?: string;
  required?: boolean;
  iconSuffix?: IconSymbolName;
  style?: ViewProps["style"];
};

export default function TexInputField({
  style,
  label = undefined,
  required = false,
  iconSuffix = undefined,
  value,
  ...props
}: TexInputFieldProps) {
  let inputComponent = (
    <View
      style={[
        {
          borderColor: withOpacity(Colors.text, 0.1),
          borderRadius: 4,
          borderWidth: 1,
          alignItems: "center",
          flexDirection: "row",
        },
        style,
      ]}
    >
      <DefaultTextInput
        style={[
          {
            padding: 8,
            flex: 1,
          },
        ]}
        editable
        value={value}
        {...props}
      />

      {!!iconSuffix && (
        <IconSymbol
          name={iconSuffix}
          color={!!value ? Colors.text : withOpacity(Colors.text, 0.3)}
          style={{ marginRight: 8 }}
          size={24}
        />
      )}
    </View>
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
