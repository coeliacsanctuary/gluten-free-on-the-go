import { client } from "@/requests/client";
import { LatLng, PaginatedResponse } from "@/types/types";
import { NearbyEatery } from "@/types/eateries";
import { AxiosResponse } from "axios";

export const getNearbyPlacesRequest = async (
  latlng: LatLng,
  page: number,
): Promise<AxiosResponse<PaginatedResponse<NearbyEatery>>> => {
  return client().get("eating-out/nearby", {
    params: { latlng: `${latlng.lat},${latlng.lng}`, page },
  });
};
