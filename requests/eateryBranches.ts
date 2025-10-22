import { client } from "@/requests/client";
import { HttpResponse } from "@/types/types";
import { AxiosResponse } from "axios";

export const eateryGetBranchesRequest = async (
  id: number,
): Promise<AxiosResponse<HttpResponse<string[]>>> => {
  return client().get(`eating-out/${id}/branches`);
};
