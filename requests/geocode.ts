import { AxiosResponse } from "axios";
import { HttpResponse, LatLng } from "@/types/types";
import { client } from "@/requests/client";

export const postGeocodeRequest = (
  term: string,
): Promise<AxiosResponse<HttpResponse<LatLng>>> => {
  return client().post("/eating-out/geocode", { term });
};
