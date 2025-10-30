import { client } from "@/requests/client";
import { HttpResponse, LatLng } from "@/types/types";
import { AxiosResponse } from "axios";
import {
  EateryBranchResource,
  EateryBranchResponse,
  EateryBranchSummaryResource,
} from "@/types/eateries";

type Response = {
  nearby: EateryBranchResource[];
  branches: EateryBranchResponse;
};

export const eateryGetBranchesRequest = async (
  id: number,
  latlng: undefined | false | LatLng,
): Promise<AxiosResponse<HttpResponse<Response>>> => {
  const params = latlng ? { latlng: `${latlng.lat},${latlng.lng}` } : undefined;

  return client().get(`eating-out/${id}/branches`, { params });
};

export const eateryGetBranchesSummaryRequest = async (
  id: number,
): Promise<AxiosResponse<HttpResponse<EateryBranchSummaryResource[]>>> => {
  return client().get(`eating-out/${id}/branches/summary`);
};
