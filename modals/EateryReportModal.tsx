import Modal from "@/modals/Modal";
import { View, Text, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import { Colors } from "@/constants/Colors";
import TextAreaField from "@/components/Form/TextAreaField";
import Button from "@/components/Form/Button";
import { IconSymbol } from "@/components/Ui/IconSymbol";
import LookupField from "@/components/Form/LookupField";
import { eateryGetBranchesSummaryRequest } from "@/requests/eateryBranches";
import { postReportEateryRequest } from "@/requests/eateryDetails";
import { logEvent } from "@/services/analytics";

export type EateryReportEateryProps = {
  eateryName: string;
  eateryId: number;
  open: boolean;
  onClose: () => void;
  branchId?: number;
  isNationwide?: boolean;
};

export default function EateryReportEateryModal({
  eateryName,
  eateryId,
  branchId = undefined,
  isNationwide = false,
  open,
  onClose,
}: EateryReportEateryProps) {
  const [branch, setBranch] = useState<string>("");
  const [report, setReport] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    logEvent({
      type: "eatery-details-report-modal",
      metaData: { eateryName },
    });
  }, [open]);

  const submitReport = () => {
    if (!report) {
      alert("Please enter your report first!");
    }

    setIsSubmitting(true);

    postReportEateryRequest(eateryId, {
      details: report,
      branch_id: branchId,
      branch_name: branch,
    }).then(() => {
      logEvent({
        type: "submit-report-eatery",
        metaData: { eateryId },
      });

      setHasSubmitted(true);
      setIsSubmitting(false);
    });
  };

  return (
    <Modal
      open={open}
      onClose={() => onClose()}
      header={
        <Text style={{ fontSize: 12, fontWeight: 600, textAlign: "center" }}>
          Report {eateryName}
        </Text>
      }
    >
      <ScrollView style={{ width: "100%", height: "100%", padding: 16 }}>
        <View style={{ gap: 16 }}>
          {hasSubmitted ? (
            <>
              <View style={{ alignItems: "center" }}>
                <IconSymbol
                  name="checkmark.circle"
                  color={Colors.positive}
                  size={120}
                />
              </View>

              <Text style={{ fontSize: 18 }}>
                Thank you for your report about {eateryName}, we&#39;ll check it
                out, and if the eatery no longer qualifies, we&#39;ll remove it
                from our website and app!
              </Text>

              <Button clickHandler={onClose}>Close</Button>
            </>
          ) : (
            <>
              <Text>
                Has {eateryName} shut down? Is it no longer offering gluten free
                options, or have there been changes in the gluten free menu?
              </Text>

              <Text>
                Whatever it is, let us know below, and we&#39;ll check it out!
              </Text>

              {isNationwide && !branchId && (
                <LookupField
                  value={branch}
                  setValue={setBranch}
                  request={eateryGetBranchesSummaryRequest}
                  requestParams={eateryId}
                  placeholder="Select a branch"
                  responseMapper={(item) => ({
                    label: item.name,
                    value: item.name,
                  })}
                />
              )}

              <TextAreaField
                value={report}
                onChangeText={setReport}
                label="Why are you reporting this eatery?"
                numberOfLines={7}
              />

              <Button loading={isSubmitting} clickHandler={submitReport}>
                Report Eatery
              </Button>
            </>
          )}
        </View>
      </ScrollView>
    </Modal>
  );
}
