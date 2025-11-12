import { client } from "@/requests/client";
import { HttpResponse, ImageGalleryItem } from "@/types/types";
import { AxiosResponse } from "axios";
import { EateryRating, EateryReview } from "@/types/eateries";
import { ImagePickerAsset } from "expo-image-picker/src/ImagePicker.types";
import { Platform } from "react-native";
import { UploadableImage } from "@/components/Form/ImageUploadField";
import { StarRatingInputValue } from "@/components/Form/StarRatingField";

export type EateryReviewsResponse = {
  average: EateryRating;
  total: number;
  reviews: EateryReview[];
};

export const getReviewsRequest = async (
  id: number,
  branchId?: number,
  showAllReviews: boolean = false,
): Promise<AxiosResponse<HttpResponse<EateryReviewsResponse>>> => {
  return client().get(
    `eating-out/${id}/reviews`,
    !showAllReviews
      ? {
          params: { branchId },
        }
      : undefined,
  );
};

export type CreateReviewPayload = {
  name: string;
  email: string;
  rating: StarRatingInputValue;
  review: string;
  food_rating?: "poor" | "good" | "excellent";
  service_rating?: "poor" | "good" | "excellent";
  how_expensive?: StarRatingInputValue;
  images?: string[];
  method: "app";
  branch_id?: number;
  branch_name?: string;
};

export const createReviewRequest = async (
  id: number,
  data: CreateReviewPayload,
): Promise<AxiosResponse<never>> => {
  console.log({ data });
  return client().post(`eating-out/${id}/reviews`, data);
};

export const getAdminReview = async (
  id: number,
  branchId?: number,
  showAllReviews: boolean = false,
): Promise<AxiosResponse<HttpResponse<EateryReview>>> => {
  return client().get(
    `eating-out/${id}/reviews/admin-review`,
    !showAllReviews
      ? {
          params: { branchId },
        }
      : undefined,
  );
};

export const getReviewImagesRequest = async (
  id: number,
  branchId?: number,
  showAllReviews: boolean = false,
): Promise<AxiosResponse<HttpResponse<ImageGalleryItem[]>>> => {
  return client().get(
    `eating-out/${id}/reviews/images`,
    !showAllReviews
      ? {
          params: { branchId },
        }
      : undefined,
  );
};

export const uploadReviewImagesRequest = async (
  id: number,
  images: ImagePickerAsset[],
): Promise<AxiosResponse<HttpResponse<UploadableImage[]>>> => {
  const request = new FormData();

  images.forEach((image, index) => {
    const fileName = image.uri.split("/").reverse()[0];

    request.append(`images[${index}]`, {
      // @ts-ignore
      uri: Platform.OS === "ios" ? image.uri.replace("file://", "") : image.uri,
      name: fileName,
      type: "image/jpeg",
    });
  });

  return client().post(`eating-out/${id}/reviews/images`, request, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
