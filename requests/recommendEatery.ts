import { AxiosResponse } from "axios";
import { HttpResponse } from "@/types/types";
import { client } from "@/requests/client";
import { CheckRecommendedPlaceResult } from "@/types/eateries";

export const postCheckRecommendedPlace = (
  placeName: string,
  placeLocation: string,
): Promise<
  AxiosResponse<never | HttpResponse<CheckRecommendedPlaceResult>>
> => {
  return client().post("/eating-out/recommend-a-place/check", {
    placeName,
    placeLocation,
  });
};

export type RecommendPlacePayload = {
  name: string;
  email: string;
  place: {
    name: string;
    location: string;
    url?: string;
    venueType?: number;
    details: string;
  };
};

export const postRecommendPlace = (
  data: RecommendPlacePayload,
): Promise<AxiosResponse<never>> => {
  return client().post("/eating-out/recommend-a-place", data);
};
