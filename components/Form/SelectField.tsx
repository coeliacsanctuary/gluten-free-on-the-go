import { SelectBoxOption } from "@/types/types";
import DropDownPicker, {
  DropDownPickerProps,
  ItemType,
  ValueType,
} from "react-native-dropdown-picker";
import React from "react";
import { Colors } from "@/constants/Colors";
import { withOpacity } from "@/helpers/helpers";
import Label from "@/components/Form/Label";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Platform, StyleProp, ViewStyle } from "react-native";

export type SelectFieldProps<T extends ValueType = number, L = string> = Omit<
  DropDownPickerProps<T>,
  "items" | "open" | "setOpen" | "value"
> & {
  label?: string;
  value: T | T[];
  options: SelectBoxOption<T, L>[];
  required?: boolean;
  size?: "small" | "default";
  labelContainerStyle?: StyleProp<ViewStyle>;
};

export default function SelectField<T extends ValueType = number, L = string>({
  value,
  setValue,
  options,
  label = undefined,
  required = false,
  size = "default",
  labelContainerStyle = undefined,
  ...rest
}: SelectFieldProps<T, L>) {
  const insets = useSafeAreaInsets();
  const [open, setOpen] = React.useState(false);

  let inputComponent = (
    <>
      <DropDownPicker
        zIndex={99999999}
        style={[
          {
            borderColor: withOpacity(Colors.text, 0.1),
            borderRadius: 4,
            borderWidth: 1,
          },
          size === "default" && {
            padding: 4,
          },
          size === "small" && {
            minHeight: 0,
          },
        ]}
        containerStyle={[
          {
            zIndex: 9999,
          },
        ]}
        dropDownContainerStyle={{
          borderColor: withOpacity(Colors.text, 0.1),
        }}
        listItemLabelStyle={[
          size === "small" && {
            fontSize: 12,
          },
        ]}
        open={open}
        setOpen={setOpen}
        value={value}
        setValue={setValue}
        items={options as ItemType<T>[]}
        modalContentContainerStyle={{
          marginTop: Platform.OS === "android" ? insets.top : 0,
        }}
        {...rest}
      />
    </>
  );

  if (label) {
    return (
      <Label
        label={label}
        required={required}
        style={labelContainerStyle}
        textStyle={[size === "small" && { fontSize: 12 }]}
      >
        {inputComponent}
      </Label>
    );
  }

  return inputComponent;
}
