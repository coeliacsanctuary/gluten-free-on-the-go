import Modal from "@/modals/Modal";
import { View, Text, ActivityIndicator, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import { FullEateryOpeningTimes, OpeningTimeDay } from "@/types/eateries";
import { Colors } from "@/constants/Colors";
import { ucfirst } from "@/helpers/helpers";
import { getEateryOpeningTimesRequest } from "@/requests/eateryDetails";
import { logEvent } from "@/services/analytics";

export type EateryOpeningTimesProps = {
  eateryName: string;
  eateryId: number;
  open: boolean;
  onClose: () => void;
};

export default function EateryOpeningTimesModal({
  eateryName,
  eateryId,
  open,
  onClose,
}: EateryOpeningTimesProps) {
  const [loading, setLoading] = useState<boolean>(true);
  const [openingTimes, setOpeningTimes] = useState<FullEateryOpeningTimes>();

  useEffect(() => {
    if (!open) {
      return;
    }

    logEvent({
      type: "eatery-details-opening-times",
      metaData: { eateryName },
    });

    getEateryOpeningTimesRequest(eateryId).then((response) => {
      setOpeningTimes(response.data.data);
      setLoading(false);
    });
  }, [open]);

  return (
    <Modal
      width="75%"
      open={open}
      onClose={() => onClose()}
      header={
        <Text style={{ fontSize: 12, fontWeight: 600, textAlign: "center" }}>
          Opening times for {eateryName}
        </Text>
      }
    >
      {loading || !openingTimes ? (
        <ActivityIndicator
          style={{ width: "100%", height: "100%", paddingBottom: 64 }}
          size="large"
          color={Colors.primary}
        />
      ) : (
        <ScrollView style={{ width: "100%", height: "100%", padding: 16 }}>
          <View style={{ gap: 8 }}>
            {(Object.keys(openingTimes.days) as OpeningTimeDay[]).map((day) => (
              <View
                key={day}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text>{ucfirst(day)}</Text>
                <Text>
                  <Text>{openingTimes.days[day].opens}</Text>
                  <Text> - </Text>
                  <Text>{openingTimes.days[day].closes}</Text>
                </Text>
              </View>
            ))}
          </View>
        </ScrollView>
      )}
    </Modal>
  );
}
