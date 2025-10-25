import { CheckboxValue } from "@/types/types";
import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { withOpacity } from "@/helpers/helpers";
import { Colors } from "@/constants/Colors";
import { Checkbox } from "expo-checkbox";

export type CheckboxGroupFieldProps<
  T = number,
  L extends React.Key = string,
> = {
  value: CheckboxValue<T, L>[];
  onChange: (value: CheckboxValue<T, L>[]) => void;
  label?: string;
};

type Checkboxes<T = number, L extends React.Key = string> = {
  group: string | undefined;
  items: CheckboxValue<T, L>[];
}[];

export default function CheckboxGroupField<
  T = number,
  L extends React.Key = string,
>({ value, onChange, label = undefined }: CheckboxGroupFieldProps<T, L>) {
  const [checkboxes, setCheckboxes] = useState<Checkboxes<T, L>>();

  const checkItem = (index: number) => {
    value[index].checked = !value[index].checked;

    onChange(value);
  };

  useEffect(() => {
    const keys: (string | undefined)[] = [];

    value.forEach((item) => {
      if (!keys.includes(item.groupBy)) {
        keys.push(item.groupBy);
      }
    });

    setCheckboxes(
      keys.map((key) => ({
        group: key,
        items: value
          .map((item, index) => {
            return {
              ...item,
              originalIndex: index,
            };
          })
          .filter((item) => item.groupBy === key),
      })),
    );
  }, [value]);

  const inputComponent = (
    <View style={label === undefined && { padding: 12 }}>
      {checkboxes?.map((group) => (
        <View
          key={
            group.group
              ? group.group
              : "checkbox-group-" + (Math.random() * (9999 - 1000) + 1000)
          }
        >
          {!!group.group && (
            <Text
              style={{
                fontSize: 14,
                paddingVertical: 8,
                fontWeight: 600,
                color: Colors.primaryDark,
                borderBottomWidth: 1,
                borderColor: withOpacity(Colors.text, 0.15),
              }}
            >
              {group.group}
            </Text>
          )}
          <View>
            {group.items.map((item, index) => (
              <View
                key={`${item.label}-${index}`}
                style={{
                  position: "relative",
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: 8,
                  gap: 4,
                  borderBottomWidth: 1,
                  borderColor: withOpacity(Colors.text, 0.15),
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text
                    style={[
                      { fontSize: 12 },
                      item.disabled && { color: withOpacity(Colors.text, 0.5) },
                      !item.disabled && {
                        color: withOpacity(Colors.text, 0.9),
                      },
                      item.checked && { fontWeight: 600 },
                    ]}
                  >
                    {item.label}
                  </Text>
                </View>

                <View>
                  <Checkbox
                    value={item.checked}
                    onValueChange={() =>
                      checkItem(item.originalIndex ? item.originalIndex : index)
                    }
                    color={Colors.primary}
                  />
                </View>
              </View>
            ))}
          </View>
        </View>
      ))}
    </View>
  );

  if (label) {
    return (
      <View style={{ gap: 1, padding: 12 }}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: 600,
            paddingVertical: 8,
          }}
        >
          {label}
        </Text>
        {inputComponent}
      </View>
    );
  }

  return inputComponent;
}
