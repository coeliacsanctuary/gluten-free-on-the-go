import { client } from "@/requests/client";
import { HttpResponse } from "@/types/types";
import { NationwideEatery } from "@/types/eateries";
import { AxiosResponse } from "axios";

export const getNationwideChainsRequest = async (): Promise<
  AxiosResponse<HttpResponse<NationwideEatery[]>>
> => {
  return client().get("eating-out/nationwide");
};
