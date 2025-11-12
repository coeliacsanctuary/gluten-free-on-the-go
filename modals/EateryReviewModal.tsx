import Modal from "@/modals/Modal";
import { View, Text, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import { Colors } from "@/constants/Colors";
import TextAreaField from "@/components/Form/TextAreaField";
import Button from "@/components/Form/Button";
import { IconSymbol } from "@/components/Ui/IconSymbol";
import LookupField from "@/components/Form/LookupField";
import { eateryGetBranchesSummaryRequest } from "@/requests/eateryBranches";
import TextInputField from "@/components/Form/TextInputField";
import StarRatingField, {
  StarRatingInputValue,
} from "@/components/Form/StarRatingField";
import SelectField from "@/components/Form/SelectField";
import { SelectBoxOption, ValidationErrorResponse } from "@/types/types";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  ImageUploadField,
  UploadableImage,
} from "@/components/Form/ImageUploadField";
import {
  CreateReviewPayload,
  createReviewRequest,
  uploadReviewImagesRequest,
} from "@/requests/eateryReviews";
import { logEvent } from "@/services/analytics";
import { AxiosError } from "axios";

export type EateryReviewEateryProps = {
  eateryName: string;
  eateryId: number;
  open: boolean;
  onClose: () => void;
  branchId?: number;
  isNationwide?: boolean;
};

export default function EateryReviewEateryModal({
  eateryName,
  eateryId,
  branchId = undefined,
  isNationwide = false,
  open,
  onClose,
}: EateryReviewEateryProps) {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [rating, setRating] = useState<StarRatingInputValue>();
  const [food, setFood] = useState<"poor" | "good" | "excellent">();
  const [service, setService] = useState<"poor" | "good" | "excellent">();
  const [expense, setExpense] = useState<StarRatingInputValue>();
  const [branch, setBranch] = useState<string>("");
  const [review, setReview] = useState<string>("");
  const [images, setImages] = useState<UploadableImage[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const [hasTriedSubmitting, setHasTriedSubmitting] = useState(false);

  const foodServiceOptions: SelectBoxOption<string>[] = [
    { label: "Poor", value: "poor" },
    { label: "Good", value: "good" },
    { label: "Excellent", value: "excellent" },
  ];

  const expenseOptions: SelectBoxOption[] = [
    { value: 1, label: "Cheap" },
    { value: 2, label: "Great Value" },
    { value: 3, label: "Average" },
    { value: 4, label: "A special treat" },
    { value: 5, label: "Expensive" },
  ];

  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    logEvent({
      type: "eatery-details-review-modal",
      metaData: { eateryName },
    });
  }, [open]);

  useEffect(() => {
    const requiredFields = [name, email, rating, review];

    if (isNationwide && !branchId) {
      requiredFields.push(branch);
    }

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
  }, [name, email, rating, branch, review]);

  const submitReview = () => {
    if (!isValid) {
      return;
    }

    setIsSubmitting(true);

    createReviewRequest(eateryId, generatePayload())
      .then(() => {
        logEvent({
          type: "submit-review-eatery",
          metaData: { eateryId },
        });

        setHasSubmitted(true);
      })
      .catch((error: AxiosError<undefined | ValidationErrorResponse>) => {
        let message = "Sorry, there was an error submitting your review.";

        if (error.response?.status === 422 && error.response?.data) {
          message =
            error.response.data.errors[
              Object.keys(error.response.data.errors)[0]
            ][0];
        }

        alert(message);

        console.log(error.response?.data);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const generatePayload = (): CreateReviewPayload => {
    return {
      name,
      email,
      review,
      rating: rating as StarRatingInputValue,
      food_rating: food,
      service_rating: service,
      how_expensive: expense,
      images: images ? (images.map((img) => img.id) as string[]) : undefined,
      method: "app",
      branch_id: branchId,
      branch_name: branch,
    };
  };

  return (
    <Modal
      open={open}
      onClose={() => onClose()}
      header={
        <Text style={{ fontSize: 12, fontWeight: 600, textAlign: "center" }}>
          Review {eateryName}
        </Text>
      }
    >
      <KeyboardAwareScrollView
        enableOnAndroid
        extraScrollHeight={150}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingBottom: 80,
        }}
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
                  Thank you for leaving a {rating} star rating review of{" "}
                  {eateryName}! Your review will be checked by an admin before
                  it goes live.
                </Text>

                <Button clickHandler={onClose}>Close</Button>
              </>
            ) : (
              <>
                <Text>
                  Have you visited {eateryName}? Let other people know your
                  experience by leaving a review!
                </Text>

                <TextInputField
                  label="Your name"
                  value={name}
                  onChangeText={setName}
                  required
                />

                <TextInputField
                  label="Your email"
                  keyboardType="email-address"
                  value={email}
                  onChangeText={setEmail}
                  required
                />

                <StarRatingField
                  value={rating}
                  onChange={setRating}
                  label="Overall Rating"
                  required
                />

                <SelectField
                  listMode="MODAL"
                  label="How would you rate your food?"
                  setValue={setFood}
                  value={food}
                  options={foodServiceOptions}
                />

                <SelectField
                  listMode="MODAL"
                  label="How would you rate the service?"
                  setValue={setService}
                  value={service}
                  options={foodServiceOptions}
                />

                <SelectField
                  listMode="MODAL"
                  label="How expensive is it to eat here?"
                  setValue={setExpense}
                  value={expense}
                  options={expenseOptions}
                />

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
                    label="What branch did you eat at?"
                    required
                  />
                )}

                <View style={{ gap: 1 }}>
                  <TextAreaField
                    numberOfLines={5}
                    label="Your Comment"
                    value={review}
                    onChangeText={setReview}
                    maxLength={1500}
                    required
                  />
                  <Text
                    style={[
                      { fontSize: 12, textAlign: "right" },
                      review.length === 1500 && { color: Colors.negative },
                    ]}
                  >
                    {review.length} / 1500
                  </Text>
                </View>

                <ImageUploadField
                  label="Do you want to attach up to six (6) images with your review?"
                  images={images}
                  maxImages={6}
                  setImages={setImages}
                  uploadImages={(images) =>
                    uploadReviewImagesRequest(eateryId, images)
                  }
                  onError={(message) => alert(message)}
                />

                <Button
                  loading={isSubmitting}
                  disabled={!isValid}
                  clickHandler={submitReview}
                  clickAttemptHandler={() => setHasTriedSubmitting(true)}
                >
                  Submit Review
                </Button>

                {hasTriedSubmitting && (
                  <Text
                    style={{
                      marginTop: -12,
                      fontWeight: 600,
                      color: Colors.negative,
                      fontSize: 12,
                    }}
                  >
                    Please complete all fields first!
                  </Text>
                )}

                <Text style={{ fontSize: 12 }}>
                  We require your email in case we need to contact you about
                  your comment, your email address is NEVER displayed publicly
                  with your comment.
                </Text>

                <Text style={{ fontSize: 12 }}>
                  All comments need to be approved before they are shown on the
                  app and website, this usually takes no longer than 48 hours.
                </Text>
              </>
            )}
          </View>
        </ScrollView>
      </KeyboardAwareScrollView>
    </Modal>
  );
}
