import { client } from "@/requests/client";
import { HttpResponse, PaginatedCollection } from "@/types/types";
import {
  AppliedEateryFilters,
  EateryFilters,
  SimpleEatery,
} from "@/types/eateries";
import { AxiosResponse } from "axios";

export type ExplorePlacesResponse = HttpResponse<{
  eateries: PaginatedCollection<SimpleEatery>;
  filters: EateryFilters;
}>;

export const getExplorePlacesRequest = async (
  search: string,
  page: number,
  filter: AppliedEateryFilters,
): Promise<AxiosResponse<ExplorePlacesResponse>> => {
  const params = new URLSearchParams();

  params.append("search", search);
  params.append("page", page.toString());
  params.append("filter[category]", filter.category.join(","));
  params.append("filter[venueType]", filter.venueType.join(","));
  params.append("filter[feature]", filter.feature.join(","));

  return client().get("eating-out/explore", { params });
};
