import { EditableEateryData, OpeningTimeDay } from "@/types/eateries";
import { ucfirst } from "@/helpers/helpers";
import { Dispatch, SetStateAction, useEffect, useMemo } from "react";
import { View, Text } from "react-native";
import { Colors } from "@/constants/Colors";
import { Checkbox } from "expo-checkbox";
import TimePickerField from "@/components/Form/TimePickerField";

export type EditableOpeningTimesProps = {
  value?: DayDetail[];
  setValue: Dispatch<SetStateAction<DayDetail[]>>;
  openingTimes: EditableEateryData["opening_times"];
};

type Time = [null, null] | [string, string];

export type DayDetail = {
  key: OpeningTimeDay;
  label: string;
  closed: boolean;
  start: Time;
  end: Time;
};

export default function EditableOpeningTimes({
  value = undefined,
  setValue,
  openingTimes,
}: EditableOpeningTimesProps) {
  const days: OpeningTimeDay[] = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  const splitTime = (time: string | null): Time => {
    if (!time) {
      return [null, null];
    }

    const split = time.split(":");

    return [split[0], split[1]];
  };

  const setOpeningTimes = useMemo(() => {
    return days.map((day) => ({
      key: day,
      label: ucfirst(day),
      closed: openingTimes[day][0] === null,
      start: splitTime(openingTimes[day][0]),
      end: splitTime(openingTimes[day][1]),
    }));
  }, [openingTimes]);

  useEffect(() => {
    setValue(setOpeningTimes);
  }, [setOpeningTimes, setValue]);

  return (
    <View style={{ gap: 2 }}>
      {value?.map((day) => (
        <View
          key={day.key}
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 12, fontWeight: 600 }}>{day.label}</Text>
          <View style={{ flexDirection: "row", gap: 4 }}>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
            >
              <Text style={{ fontSize: 12 }}>Closed?</Text>
              <Checkbox
                value={day.closed}
                onValueChange={(checked) => {
                  setValue((prev) =>
                    prev.map((d) =>
                      d.key === day.key ? { ...d, closed: checked } : d,
                    ),
                  );
                }}
                color={Colors.primary}
              />
            </View>

            <TimePickerField
              disabled={day.closed}
              value={day.start}
              onValueChange={(time) => {
                setValue((prev) =>
                  prev.map((d) =>
                    d.key === day.key ? { ...d, start: time } : d,
                  ),
                );
              }}
            />

            <TimePickerField
              disabled={day.closed}
              value={day.end}
              onValueChange={(time) => {
                setValue((prev) =>
                  prev.map((d) =>
                    d.key === day.key ? { ...d, end: time } : d,
                  ),
                );
              }}
            />
          </View>
        </View>
      ))}
    </View>
  );
}
