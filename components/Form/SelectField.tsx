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

export type SelectFieldProps<T extends ValueType = number, L = string> = Omit<
  DropDownPickerProps<T>,
  "items" | "open" | "setOpen" | "value"
> & {
  label?: string;
  value: T | T[];
  options: SelectBoxOption<T, L>[];
  required?: boolean;
};

export default function SelectField<T extends ValueType = number, L = string>({
  value,
  setValue,
  options,
  label = undefined,
  required = false,
  ...rest
}: SelectFieldProps<T, L>) {
  const [open, setOpen] = React.useState(false);

  let inputComponent = (
    <>
      <DropDownPicker
        style={[
          {
            borderColor: withOpacity(Colors.text, 0.1),
            borderRadius: 4,
            borderWidth: 1,
            padding: 4,
          },
        ]}
        open={open}
        setOpen={setOpen}
        value={value}
        setValue={setValue}
        items={options as ItemType<T>[]}
        {...rest}
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
