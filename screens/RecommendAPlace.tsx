import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import { Card } from "@/components/Card";
import { Link, router } from "expo-router";
import { Colors } from "@/constants/Colors";
import TexInputField from "@/components/Form/TextInputField";
import TextAreaField from "@/components/Form/TextAreaField";
import SelectField from "@/components/Form/SelectField";
import { withOpacity } from "@/helpers/helpers";
import Button from "@/components/Form/Button";
import { useEffect, useState } from "react";
import { SelectBoxOption, ValidationErrorResponse } from "@/types/types";
import { getEateryVenueTypes } from "@/requests/eateryVenueTypes";
import { CheckRecommendedPlaceResult } from "@/types/eateries";
import {
  postCheckRecommendedPlace,
  postRecommendPlace,
  RecommendPlacePayload,
} from "@/requests/recommendEatery";
import { Warning } from "@/components/Warning";
import { Checkbox } from "expo-checkbox";
import { IconSymbol } from "@/components/Ui/IconSymbol";
import { AxiosError } from "axios";
import { logEvent } from "@/services/analytics";

export default function RecommendAPlace() {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);

  const [placeName, setPlaceName] = useState<string>("");
  const [placeAddress, setPlaceAddress] = useState<string>("");
  const [placeWebsite, setPlaceWebsite] = useState<string>("");
  const [placeCategory, setPlaceCategory] = useState<number>();
  const [placeDetails, setPlaceDetails] = useState<string>("");
  const [yourName, setYourName] = useState<string>("");
  const [yourEmail, setYourEmail] = useState<string>("");

  const [categoryOptions, setCategoryOptions] = useState<SelectBoxOption[]>([]);

  const [confirmNewEatery, setConfirmNewEatery] = useState<boolean>(false);
  const [placeAlreadyRecommended, setPlaceAlreadyRecommended] = useState<
    undefined | CheckRecommendedPlaceResult
  >(undefined);

  const [validationError, setValidationError] = useState<undefined | string>(
    undefined,
  );

  const buildPayload = (): RecommendPlacePayload => ({
    name: yourName,
    email: yourEmail,
    place: {
      name: placeName,
      location: placeAddress,
      details: placeDetails,
      venueType: placeCategory,
      url: placeWebsite !== "" ? placeWebsite : undefined,
    },
  });

  const submitForm = () => {
    if (!isValid) {
      return;
    }

    setHasTriedSubmitting(false);
    setIsSubmitting(true);

    postRecommendPlace(buildPayload())
      .then(() => {
        setHasSubmitted(true);
      })
      .catch((error: AxiosError<undefined | ValidationErrorResponse>) => {
        if (error.response?.status === 422 && error.response?.data) {
          setValidationError(
            error.response.data.errors[
              Object.keys(error.response.data.errors)[0]
            ][0],
          );

          return;
        }

        alert("Sorry, there was an error submitting your recommendation.");
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const checkRecommendation = () => {
    setPlaceAlreadyRecommended(undefined);

    postCheckRecommendedPlace(placeName, placeAddress)
      .then((response) => {
        if (response.status === 200) {
          logEvent({
            type: "recommend-place-already-exists",
            metaData: { placeName, placeAddress },
          });

          setPlaceAlreadyRecommended(response.data.data);

          return;
        }

        setPlaceAlreadyRecommended(undefined);
      })
      .catch(() => {
        //
      });
  };

  const resetForm = () => {
    setPlaceName("");
    setPlaceAddress("");
    setPlaceWebsite("");
    setPlaceCategory(undefined);
    setPlaceDetails("");
    setYourName("");
    setYourEmail("");
    setPlaceAlreadyRecommended(undefined);
    setConfirmNewEatery(false);

    setValidationError(undefined);
    setIsSubmitting(false);
    setHasSubmitted(false);
  };

  const [hasTriedSubmitting, setHasTriedSubmitting] = useState(false);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const requiredFields = [
      placeName,
      placeAddress,
      placeDetails,
      yourName,
      yourEmail,
    ];

    let valid = true;

    requiredFields.forEach((field) => {
      if (!field) {
        valid = false;
      }
    });

    if (valid) {
      setHasTriedSubmitting(false);
    }

    setIsValid(valid);
  }, [placeName, placeAddress, placeDetails, yourName, yourEmail]);

  useEffect(() => {
    if (placeName === "" && placeAddress === "") {
      return;
    }

    const handler = setTimeout(() => {
      checkRecommendation();
    }, 300);

    return () => clearTimeout(handler);
  }, [placeName, placeAddress]);

  useEffect(() => {
    if (categoryOptions.length > 0) {
      return;
    }

    getEateryVenueTypes().then((response) => {
      const options: SelectBoxOption[] = [];

      response.data.data.forEach((type, index) => {
        options.push({
          value: index + 100,
          label: type.label,
        });

        options.push(
          ...type.options
            .sort((a, b) => b.label.localeCompare(a.label))
            .map((opt) => ({
              ...opt,
              parent: index + 100,
            })),
        );
      });

      setCategoryOptions(options);
    });
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ScrollView style={{ padding: 8, width: "100%", marginTop: -6 }}>
        <Card style={{ width: "100%" }}>
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
                Thank you for submitting your recommendation! It has been added
                to my queue of places to check, I&#39;ll take a look at it,
                check check menus and reviews, and if it all checks out, add
                some data and add it to the website!
              </Text>

              <Button clickHandler={resetForm}>Add another</Button>
            </>
          ) : (
            <>
              <View style={{ gap: 12 }}>
                <Text>
                  Do you know a place that needs adding to our guide? Well give
                  us as much details as possible below and we&#39;ll check it
                  out, verify it and get it added to our list!
                </Text>

                <Text>
                  We rely on people like you providing us with information on
                  places where people can eat out safely and helping us create a
                  great eating out guide!
                </Text>

                <Text>
                  Our eating out guide is full of independent eateries around
                  the UK and Ireland, and we list{" "}
                  <Link
                    style={{ color: Colors.primaryDark, fontWeight: 600 }}
                    href="/(tabs)/nationwide"
                  >
                    nationwide chains
                  </Link>
                  , such as Nando&#39;s, Bella Italia separately.
                </Text>

                <Text>
                  Don&#39;t forget to check out our{" "}
                  <Link
                    style={{ color: Colors.primaryDark, fontWeight: 600 }}
                    href="/(tabs)/explore"
                  >
                    eating guide
                  </Link>{" "}
                  first to see if the place you&#39;re recommending already
                  listed.
                </Text>
              </View>

              <View style={{ marginTop: 16, gap: 12 }}>
                <TexInputField
                  label="Place Name"
                  required
                  value={placeName}
                  onChangeText={setPlaceName}
                />

                <TextAreaField
                  label="Place Address"
                  required
                  value={placeAddress}
                  onChangeText={setPlaceAddress}
                />

                {placeAlreadyRecommended !== undefined && (
                  <View>
                    <Warning>
                      <View style={{ gap: 12, flexShrink: 1, paddingRight: 6 }}>
                        <Text>{placeAlreadyRecommended.result}</Text>

                        <Button
                          size="small"
                          theme="secondary"
                          clickHandler={() => {
                            router.navigate({
                              pathname: "/(tabs)/explore/eatery-details",
                              params: {
                                id: placeAlreadyRecommended.id,
                                branchId: placeAlreadyRecommended.branchId,
                                leaveReview: 1,
                              },
                            });
                          }}
                        >
                          {placeAlreadyRecommended.label} and leave a review!
                        </Button>

                        <Text>
                          If you&#39;re sure this is a different place please
                          carry on with your recommendation!
                        </Text>
                      </View>
                    </Warning>
                  </View>
                )}

                <TexInputField
                  label="Place Website"
                  keyboardType="url"
                  value={placeWebsite}
                  onChangeText={setPlaceWebsite}
                />

                <SelectField
                  label="Place Category"
                  listMode="MODAL"
                  options={categoryOptions}
                  value={placeCategory as number}
                  setValue={setPlaceCategory}
                  categorySelectable={false}
                  listParentLabelStyle={{
                    fontWeight: 600,
                    color: Colors.primaryDark,
                  }}
                />

                <TextAreaField
                  numberOfLines={10}
                  label="Place Details"
                  required
                  value={placeDetails}
                  onChangeText={setPlaceDetails}
                />
                <Text style={{ fontSize: 10 }}>
                  Please include details like if they only do gluten free on
                  certain days, or examples of items on the menu, if they
                  understand cross contamination etc
                </Text>

                <View
                  style={{
                    borderTopWidth: 1,
                    borderTopColor: withOpacity(Colors.text, 0.15),
                  }}
                />

                <TexInputField
                  label="Your Name"
                  required
                  value={yourName}
                  onChangeText={setYourName}
                />

                <TexInputField
                  label="Your Email"
                  keyboardType="email-address"
                  required
                  value={yourEmail}
                  onChangeText={setYourEmail}
                />

                {placeAlreadyRecommended !== undefined && (
                  <View
                    style={{
                      borderRadius: 16,
                      backgroundColor: withOpacity(Colors.text, 0.02),
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: 600,
                        fontSize: 14,
                        color: withOpacity(Colors.text, 0.8),
                      }}
                    >
                      I&#39;m sure this is a new eatery to add to your guide!
                    </Text>

                    <Checkbox
                      value={confirmNewEatery}
                      onValueChange={setConfirmNewEatery}
                      color={Colors.primary}
                    />
                  </View>
                )}

                {validationError !== undefined && (
                  <Text
                    style={{
                      fontWeight: 600,
                      color: Colors.negative,
                      fontSize: 12,
                    }}
                  >
                    {validationError}
                  </Text>
                )}

                {hasTriedSubmitting && (
                  <Text
                    style={{
                      fontWeight: 600,
                      color: Colors.negative,
                      fontSize: 12,
                    }}
                  >
                    Please complete all fields first!
                  </Text>
                )}

                <Button
                  loading={isSubmitting}
                  disabled={
                    !isValid ||
                    (placeAlreadyRecommended !== undefined && !confirmNewEatery)
                  }
                  clickHandler={submitForm}
                  clickAttemptHandler={() => setHasTriedSubmitting(true)}
                >
                  Send Recommendation
                </Button>
              </View>
            </>
          )}
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
