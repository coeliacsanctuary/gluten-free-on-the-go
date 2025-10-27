import { AxiosResponse } from "axios";
import { HttpResponse } from "@/types/types";
import { client } from "@/requests/client";
import { EateryVenueTypeGroup } from "@/types/eateries";

export const getEateryVenueTypes = (): Promise<
  AxiosResponse<HttpResponse<EateryVenueTypeGroup[]>>
> => {
  return client().get("/eating-out/venue-types");
};
