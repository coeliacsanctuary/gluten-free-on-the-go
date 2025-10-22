import { client } from "@/requests/client";
import { HttpResponse } from "@/types/types";
import { EditableEateryData, EditableEateryNewValue } from "@/types/eateries";
import { AxiosResponse } from "axios";

export const getEaterySuggestEditsRequest = async (
  id: number,
): Promise<AxiosResponse<HttpResponse<EditableEateryData>>> => {
  return client().get(`eating-out/${id}/suggest-edits`);
};

export type SuggestEditPayload = {
  field: string;
  value: EditableEateryNewValue;
};

export const postSuggestEditsRequest = async (
  id: number,
  data: SuggestEditPayload,
): Promise<AxiosResponse<never>> => {
  return client().post(`eating-out/${id}/suggest-edits`, data);
};
