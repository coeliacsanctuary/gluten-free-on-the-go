import { client } from "@/requests/client";
import { HttpResponse, LatLng } from "@/types/types";
import { AppliedEateryFilters, BrowseEateryResource } from "@/types/eateries";
import { AxiosResponse } from "axios";

export const getBrowseRequest = async (
  latlng: LatLng,
  radius: number,
  filter: AppliedEateryFilters,
): Promise<AxiosResponse<HttpResponse<BrowseEateryResource[]>>> => {
  const params = new URLSearchParams();

  params.append("lat", latlng.lat.toString());
  params.append("lng", latlng.lng.toString());
  params.append("radius", radius.toString());
  params.append("filter[category]", filter.category.join(","));
  params.append("filter[venueType]", filter.venueType.join(","));
  params.append("filter[feature]", filter.feature.join(","));

  return client().get("eating-out/browse?" + params.toString(), {
    validateStatus: (status) => status === 200,
  });
};
