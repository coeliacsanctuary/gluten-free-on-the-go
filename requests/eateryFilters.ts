import { AxiosResponse } from "axios";
import { HttpResponse } from "@/types/types";
import { client } from "@/requests/client";
import { EateryFilters } from "@/types/eateries";

export const getEateryFilters = (): Promise<
  AxiosResponse<HttpResponse<EateryFilters>>
> => {
  return client().get("/eating-out/filters");
};
