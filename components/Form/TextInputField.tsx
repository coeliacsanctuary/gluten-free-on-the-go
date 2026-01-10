import React, { forwardRef } from "react";
import {
  Pressable,
  TextInput as DefaultTextInput,
  TextInputProps,
  View,
  ViewProps,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { withOpacity } from "@/helpers/helpers";
import Label from "@/components/Form/Label";
import { IconSymbol, IconSymbolName } from "@/components/Ui/IconSymbol";

export type TexInputFieldProps = Omit<
  TextInputProps,
  "numberOfLines" | "multiline" | "editable" | "style"
> & {
  label?: string;
  required?: boolean;
  iconSuffix?: IconSymbolName;
  style?: ViewProps["style"];
  onIconPress?: () => void;
};

const TexInputField = forwardRef<DefaultTextInput, TexInputFieldProps>(
  (
    {
      style,
      label,
      required = false,
      iconSuffix,
      value,
      onIconPress = () => undefined,
      ...props
    },
    ref,
  ) => {
    const input = (
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
          ref={ref}
          style={{ padding: 8, flex: 1 }}
          editable
          value={value}
          {...props}
        />

        {!!iconSuffix && (
          <Pressable onPress={onIconPress}>
            <IconSymbol
              name={iconSuffix}
              color={value ? Colors.text : withOpacity(Colors.text, 0.3)}
              style={{ marginRight: 8 }}
              size={24}
            />
          </Pressable>
        )}
      </View>
    );

    if (label) {
      return (
        <Label label={label} required={required}>
          {input}
        </Label>
      );
    }

    return input;
  },
);

TexInputField.displayName = "TexInputField";

export default TexInputField;
