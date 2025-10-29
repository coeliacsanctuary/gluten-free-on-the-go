import { client } from "@/requests/client";
import { HttpResponse, LatLng } from "@/types/types";
import { NationwideEatery } from "@/types/eateries";
import { AxiosResponse } from "axios";

export const getNationwideChainsRequest = async (
  latlng: undefined | false | LatLng,
): Promise<AxiosResponse<HttpResponse<NationwideEatery[]>>> => {
  const params = latlng ? { latlng: `${latlng.lat},${latlng.lng}` } : undefined;

  return client().get("eating-out/nationwide", { params });
};
