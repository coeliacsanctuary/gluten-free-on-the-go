import { client } from "@/requests/client";
import { HttpResponse } from "@/types/types";
import { EaterySealiacOverview } from "@/types/eateries";
import { AxiosResponse } from "axios";

export const getSealiacOverviewRequest = async (
  id: number,
  branchId?: number,
): Promise<AxiosResponse<HttpResponse<EaterySealiacOverview>>> => {
  return client().get(`eating-out/${id}/sealiac-overview`, {
    params: { branchId },
  });
};

export const postSealiacOverviewFeedbackRequest = async (
  id: number,
  rating: "up" | "down",
): Promise<AxiosResponse<never>> => {
  return client().post(`eating-out/${id}/sealiac-overview`, { rating });
};
