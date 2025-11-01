import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  Pressable,
} from "react-native";
import { useEffect, useState } from "react";
import {
  EditableEateryData,
  EditableEateryField,
  EditableEateryNewValue,
} from "@/types/eateries";
import { Colors } from "@/constants/Colors";
import {
  getEaterySuggestEditsRequest,
  postSuggestEditsRequest,
} from "@/requests/eaterySuggestEdits";
import { withOpacity } from "@/helpers/helpers";
import Button from "@/components/Form/Button";
import TextAreaField from "@/components/Form/TextAreaField";
import TextInputField from "@/components/Form/TextInputField";
import SelectField from "@/components/Form/SelectField";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import EditableOpeningTimes, {
  DayDetail,
} from "@/modals/SuggestEdits/EditableOpeningTimes";
import { AxiosError } from "axios";
import Modal from "@/modals/Modal";
import { logEvent } from "@/services/analytics";

export type EaterySuggestEditProps = {
  eateryName: string;
  eateryId: number;
  open: boolean;
  onClose: () => void;
  onOpenReport: () => void;
};

export default function EaterySuggestEditModal({
  eateryName,
  eateryId,
  open,
  onClose,
  onOpenReport,
}: EaterySuggestEditProps) {
  const [loading, setLoading] = useState<boolean>(true);
  const [suggestEditsResponse, setSuggestEditsResponse] =
    useState<EditableEateryData>();

  const [editableFields, setEditableFields] = useState<EditableEateryField[]>(
    [],
  );

  const [currentField, setCurrentField] = useState<EditableEateryField | null>(
    null,
  );

  const [newValue, setNewValue] = useState<EditableEateryNewValue>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    logEvent({
      type: "eatery-details-suggest-edit-modal",
      metaData: { eateryName },
    });
  }, [open]);

  const isFieldBeingEdited = (field: EditableEateryField): boolean => {
    return currentField?.label === field.label;
  };

  const isFieldNotBeingEdited = (field: EditableEateryField): boolean =>
    !isFieldBeingEdited(field);

  const cancelEditingField = (): void => {
    if (!currentField) {
      return;
    }

    setCurrentField(null);
    setNewValue(null);
  };

  const openField = (field: EditableEateryField): void => {
    if (field) {
      cancelEditingField();
    }

    logEvent({
      type: "eatery-details-suggest-edit-toggle-field",
      metaData: { eateryId, field: field.label },
    });

    setNewValue(field.currentValue ? field.currentValue() : null);

    setCurrentField(field);
  };

  const currentFieldIndex = (): number | null => {
    if (!currentField) {
      return null;
    }

    return editableFields.indexOf(currentField);
  };

  const updateField = () => {
    if (!currentField || !newValue) {
      return;
    }

    setIsSubmitting(true);

    postSuggestEditsRequest(eateryId, {
      field: currentField.id,
      value: currentField.beforeSend
        ? currentField.beforeSend(newValue)
        : newValue,
    })
      .then(() => {
        logEvent({
          type: "submit-eatery-suggested-edit",
          metaData: { eateryId, field: currentField.label },
        });

        toggleFieldUpdated(currentFieldIndex() as number, true);

        cancelEditingField();
      })
      .catch((response: AxiosError) => console.log(response.response?.data))
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const toggleFieldUpdated = (index: number, updated: boolean) => {
    setEditableFields((prev) =>
      prev.map((f, i) => (i === index ? { ...f, updated } : f)),
    );
  };

  useEffect(() => {
    if (!open) {
      return;
    }

    getEaterySuggestEditsRequest(eateryId).then((response) => {
      setSuggestEditsResponse(response.data.data);
      setLoading(false);
    });
  }, [open]);

  useEffect(() => {
    if (!suggestEditsResponse) {
      return;
    }

    setEditableFields([
      {
        id: "address",
        label: "Address",
        shouldDisplay: !suggestEditsResponse.is_nationwide,
        getter: () => suggestEditsResponse.address.replaceAll("\n", ", "),
        editableComponent: (value, setValue) => (
          <TextAreaField
            autoFocus
            value={value as string}
            onChangeText={setValue}
            style={{ fontSize: 12 }}
          />
        ),
        currentValue: () => suggestEditsResponse.address,
        updated: false,
      },
      {
        id: "website",
        label: "Website",
        shouldDisplay: true,
        getter: () => suggestEditsResponse.website || "",
        editableComponent: (value, setValue) => (
          <TextInputField
            autoFocus
            keyboardType="url"
            value={value as string}
            onChangeText={setValue}
          />
        ),
        currentValue: () => suggestEditsResponse.website || "",
        updated: false,
      },
      {
        id: "gf_menu_link",
        label: "Gluten Free Menu Link",
        shouldDisplay: true,
        getter: () => suggestEditsResponse.gf_menu_link || "",
        editableComponent: (value, setValue) => (
          <TextInputField
            autoFocus
            keyboardType="url"
            value={value as string}
            onChangeText={setValue}
          />
        ),
        currentValue: () => suggestEditsResponse.gf_menu_link || "",
        updated: false,
      },
      {
        id: "phone",
        label: "Phone Number",
        shouldDisplay: !suggestEditsResponse.is_nationwide,
        getter: () => suggestEditsResponse.phone || "",
        editableComponent: (value, setValue) => (
          <TextInputField
            autoFocus
            keyboardType="phone-pad"
            value={value as string}
            onChangeText={setValue}
          />
        ),
        currentValue: () => suggestEditsResponse.phone || "",
        updated: false,
      },
      {
        id: "venue_type",
        label: "Venue Type",
        shouldDisplay: true,
        getter: () => suggestEditsResponse.venue_type.label,
        editableComponent: (value, setValue) => (
          <SelectField
            listMode="MODAL"
            value={value as number}
            setValue={setValue}
            options={suggestEditsResponse.venue_type.values}
          />
        ),
        currentValue: () => suggestEditsResponse.venue_type.id,
        updated: false,
      },
      {
        id: "cuisine",
        label: "Cuisine",
        shouldDisplay: suggestEditsResponse.type_id === 1,
        getter: () => suggestEditsResponse.cuisine.label,
        editableComponent: (value, setValue) => (
          <SelectField
            listMode="MODAL"
            value={value as number}
            setValue={setValue}
            options={suggestEditsResponse.cuisine.values}
          />
        ),
        currentValue: () => suggestEditsResponse.cuisine.id,
        updated: false,
      },
      {
        id: "opening_times",
        label: "Opening Times",
        shouldDisplay:
          suggestEditsResponse.type_id !== 3 &&
          !suggestEditsResponse.is_nationwide,
        getter: () => {
          if (!suggestEditsResponse.opening_times) {
            return null;
          }

          if (!suggestEditsResponse.opening_times.today) {
            return "Currently closed";
          }

          return `${suggestEditsResponse.opening_times.today[0]} - ${suggestEditsResponse.opening_times.today[1]}`;
        },
        capitalise: true,
        editableComponent: (value, setValue) => (
          <EditableOpeningTimes
            value={value as DayDetail[]}
            setValue={setValue}
            openingTimes={suggestEditsResponse.opening_times}
          />
        ),
        beforeSend: (value) => {
          return (value as DayDetail[]).map((day) => ({
            ...day,
            start:
              day.start[0] !== null
                ? [parseInt(day.start[0]), parseInt(day.start[1])]
                : day.start,
            end:
              day.end[0] !== null
                ? [parseInt(day.end[0]), parseInt(day.end[1])]
                : day.end,
          }));
        },
        updated: false,
      },
      {
        id: "features",
        label: "Features",
        shouldDisplay: true,
        getter: () =>
          suggestEditsResponse.features.selected
            .map((feature) => feature.label)
            .join(", "),
        editableComponent: (value, setValue) => (
          <SelectField
            listMode="MODAL"
            value={value as number[]}
            setValue={setValue}
            options={suggestEditsResponse.features.values}
            multiple
          />
        ),
        currentValue: () =>
          suggestEditsResponse.features.selected.map((feature) => feature.id),
        beforeSend: (value) => {
          return suggestEditsResponse.features.values.map((feature) => ({
            key: feature.value,
            label: feature.label,
            selected: (value as number[]).includes(feature.value),
          }));
        },
        updated: false,
      },
      {
        id: "info",
        label: "Additional Information",
        shouldDisplay: true,
        getter: () =>
          "Is there anything else we should know about this location?",
        truncate: false,
        editableComponent: (value, setValue) => (
          <TextAreaField
            autoFocus
            value={value as string}
            onChangeText={setValue}
            style={{ fontSize: 12 }}
          />
        ),
        currentValue: () => "",
        updated: false,
      },
    ]);
  }, [suggestEditsResponse]);

  return (
    <Modal
      open={open}
      onClose={() => onClose()}
      header={
        <Text style={{ fontSize: 12, fontWeight: 600, textAlign: "center" }}>
          Suggest Edits for {eateryName}
        </Text>
      }
    >
      {loading || !suggestEditsResponse ? (
        <ActivityIndicator
          style={{ width: "100%", height: "100%" }}
          size="large"
          color={Colors.primary}
        />
      ) : (
        <KeyboardAwareScrollView
          enableOnAndroid
          extraScrollHeight={150}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            paddingBottom: 80,
          }}
        >
          <View style={{ width: "100%", height: "100%", padding: 16 }}>
            <View style={{ gap: 16 }}>
              <Text>
                Can you improve the details we&apos;ve got for
                <Text style={{ fontWeight: 600 }}>{eateryName}?</Text> Let us
                know using the options below, submit the details and we&apos;ll
                check it out!
              </Text>

              <Pressable onPress={() => onOpenReport()}>
                <View
                  style={{
                    padding: 8,
                    borderWidth: 1,
                    borderColor: Colors.primaryLight,
                    backgroundColor: withOpacity(Colors.primaryLight, 0.3),
                  }}
                >
                  {!suggestEditsResponse.is_nationwide ? (
                    <Text>
                      Has <Text style={{ fontWeight: 600 }}>{eateryName}?</Text>{" "}
                      closed down, or no longer does gluten free? Click here to
                      report it instead!
                    </Text>
                  ) : (
                    <Text>
                      Does{" "}
                      <Text style={{ fontWeight: 600 }}>{eateryName}?</Text> no
                      longer do gluten free? Or has it changed procedures? Tap
                      here to report it instead!
                    </Text>
                  )}
                </View>
              </Pressable>

              <View style={{ height: 1, backgroundColor: Colors.primary }} />
            </View>
            <ScrollView>
              <View>
                {editableFields.map(
                  (field, index) =>
                    field.shouldDisplay && (
                      <View
                        key={field.label}
                        style={{
                          borderBottomWidth: 1,
                          borderBottomColor: withOpacity(Colors.text, 0.08),
                          paddingVertical: 8,
                          gap: 8,
                        }}
                      >
                        {field.updated ? (
                          <View
                            style={{
                              backgroundColor: withOpacity(
                                Colors.primaryLight,
                                0.5,
                              ),
                              gap: 2,
                              justifyContent: "center",
                              alignItems: "center",
                              padding: 4,
                              borderRadius: 4,
                            }}
                          >
                            <Text>Thanks for your suggestion!</Text>

                            <Pressable
                              onPress={() => {
                                toggleFieldUpdated(index, false);
                                openField(field);
                              }}
                            >
                              <Text
                                style={{
                                  color: Colors.primaryDark,
                                  fontWeight: 600,
                                }}
                              >
                                Update again
                              </Text>
                            </Pressable>
                          </View>
                        ) : (
                          <View style={{ gap: 2 }}>
                            <View
                              style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                              }}
                            >
                              <Text
                                style={
                                  isFieldBeingEdited(field) && {
                                    fontWeight: "600",
                                    color: Colors.primaryDark,
                                    fontSize: 12,
                                  }
                                }
                              >
                                {field.label}
                              </Text>

                              {isFieldNotBeingEdited(field) && (
                                <Pressable onPress={() => openField(field)}>
                                  <Text
                                    style={{
                                      fontWeight: 600,
                                      color: Colors.primaryDark,
                                      fontSize: 12,
                                    }}
                                  >
                                    Update
                                  </Text>
                                </Pressable>
                              )}
                            </View>

                            {isFieldNotBeingEdited(field) && (
                              <Text
                                style={[
                                  {
                                    fontSize: 12,
                                    color: withOpacity(Colors.text, 0.6),
                                  },
                                  field.capitalise && {
                                    textTransform: "capitalize",
                                  },
                                ]}
                                numberOfLines={field.truncate ? 1 : undefined}
                              >
                                {field.getter() || "Not Set"}
                              </Text>
                            )}

                            {isFieldBeingEdited(field) && (
                              <View style={{ gap: 8 }}>
                                {field.editableComponent(newValue, setNewValue)}

                                <View
                                  style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    gap: 4,
                                  }}
                                >
                                  <Button
                                    theme="secondary"
                                    size="xs"
                                    clickHandler={() => cancelEditingField()}
                                  >
                                    Cancel
                                  </Button>

                                  <Button
                                    size="xs"
                                    disabled={newValue === ""}
                                    loading={isSubmitting}
                                    clickHandler={() => updateField()}
                                  >
                                    Submit
                                  </Button>
                                </View>
                              </View>
                            )}
                          </View>
                        )}
                      </View>
                    ),
                )}
              </View>
            </ScrollView>
          </View>
        </KeyboardAwareScrollView>
      )}
    </Modal>
  );
}
