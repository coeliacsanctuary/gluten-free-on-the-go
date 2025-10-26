import { client } from "@/requests/client";
import { HttpResponse } from "@/types/types";
import {
  DetailedEatery,
  EaterySummaryResource,
  FullEateryOpeningTimes,
} from "@/types/eateries";
import { AxiosResponse } from "axios";

export const getEaterySummaryRequest = async (
  id: number,
  branchId?: number,
): Promise<AxiosResponse<HttpResponse<EaterySummaryResource>>> => {
  return client().get(`eating-out/${id}/summary`, { params: { branchId } });
};

export const getEateryDetailsRequest = async (
  id: number,
  branchId?: number,
): Promise<AxiosResponse<HttpResponse<DetailedEatery>>> => {
  if (branchId) {
    return client().get(`eating-out/${id}/${branchId}`);
  }

  return client().get(`eating-out/${id}`);
};

export const getEateryOpeningTimesRequest = async (
  id: number,
): Promise<AxiosResponse<HttpResponse<FullEateryOpeningTimes>>> => {
  return client().get(`eating-out/${id}/opening-times`);
};

export type ReportEateryPayload = {
  details: string;
  branch_id?: number;
  branch_name?: string;
};

export const postReportEateryRequest = async (
  id: number,
  data: ReportEateryPayload,
): Promise<AxiosResponse<never>> => {
  return client().post(`eating-out/${id}/report`, data);
};
