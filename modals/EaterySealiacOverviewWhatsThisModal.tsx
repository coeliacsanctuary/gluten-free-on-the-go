import Modal from "@/modals/Modal";
import { View, Text, ScrollView } from "react-native";
import { useEffect } from "react";
import { logEvent } from "@/services/analytics";

export type EaterySealiacOverviewWhatsThisProps = {
  eateryName: string;
  open: boolean;
  onClose: () => void;
};

export default function EaterySealiacOverviewWhatsThisModal({
  eateryName,
  open,
  onClose,
}: EaterySealiacOverviewWhatsThisProps) {
  useEffect(() => {
    if (!open) {
      return;
    }

    logEvent({
      type: "eatery-details-sealiac-overview-whats-this",
      metaData: { eateryName },
    });
  }, [open]);

  return (
    <Modal
      open={open}
      onClose={() => onClose()}
      header={
        <Text style={{ fontSize: 12, fontWeight: 600, textAlign: "center" }}>
          What is Sealiac the Seal's overview
        </Text>
      }
    >
      <ScrollView style={{ width: "100%", height: "100%", padding: 16 }}>
        <View style={{ gap: 16 }}>
          <Text>
            Sealiac the Seal is the Coeliac Sanctuary mascot, the text overview
            of {eateryName} was generated using AI by analysing the information
            we hold for {eateryName}, and using reviews submitted through our
            website and app.
          </Text>
          <Text>
            This AI overview will be updated automatically when a new review is
            submitted and approved.
          </Text>

          <Text>
            You can rate the generated overview by using the thumbs up and down
            icons below Sealiac the Seals thoughts.
          </Text>
        </View>
      </ScrollView>
    </Modal>
  );
}
