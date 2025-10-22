import { useEffect, useState } from "react";
import DateTimePickerModal, {
  ReactNativeModalDateTimePickerProps,
} from "react-native-modal-datetime-picker";
import { Pressable, Text, TextStyle } from "react-native";
import { withOpacity } from "@/helpers/helpers";
import { Colors } from "@/constants/Colors";

export type TimePickerFieldProps = Omit<
  ReactNativeModalDateTimePickerProps,
  | "date"
  | "mode"
  | "display"
  | "design"
  | "is24Hour"
  | "minuteInterval"
  | "onConfirm"
  | "onCancel"
  | "show"
  | "style"
> & {
  value: [string, string] | [null, null];
  onValueChange: (next: [string, string] | [null, null]) => void;
  style?: TextStyle;
  disabled?: boolean;
};

export default function TimePickerField({
  value,
  onValueChange,
  style,
  disabled = false,
  ...props
}: TimePickerFieldProps) {
  const [show, setShow] = useState(false);

  const [date, setDate] = useState(
    new Date(
      0,
      0,
      0,
      value[0] ? parseInt(value[0]) : 0,
      value[1] ? parseInt(value[1]) : 0,
    ),
  );

  useEffect(() => {
    const next = new Date(
      0,
      0,
      0,
      value[0] ? parseInt(value[0]) : 0,
      value[1] ? parseInt(value[1]) : 0,
    );
    if (next.getTime() !== date.getTime()) {
      setDate(next);
    }
  }, [value]);

  const handleChange = (newDate?: Date) => {
    if (!newDate) {
      return;
    }

    setDate(newDate);

    onValueChange([
      newDate.getHours().toString(),
      newDate.getMinutes().toString(),
    ]);

    setShow(false);
  };

  return (
    <>
      <Pressable onPress={() => (disabled ? undefined : setShow(true))}>
        <Text
          style={[
            {
              borderColor: withOpacity(Colors.text, 0.1),
              borderRadius: 4,
              borderWidth: 1,
              padding: 4,
              width: 60,
              textAlign: "center",
            },
            disabled && { opacity: 0.4 },
            style,
          ]}
        >
          {value[0] !== null ? (
            <Text>
              {value[0]}:{value[1]?.padEnd(2, "0")}
            </Text>
          ) : (
            <Text>-</Text>
          )}
        </Text>
      </Pressable>

      <DateTimePickerModal
        isVisible={show}
        themeVariant="light"
        mode="time"
        is24Hour
        minuteInterval={15}
        date={date}
        onConfirm={handleChange}
        onCancel={() => setShow(false)}
        {...props}
      />
    </>
  );
}
