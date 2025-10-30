import { AxiosResponse } from "axios";
import { client } from "@/requests/client";
import { HttpResponse } from "@/types/types";

export const getWebsiteImageRequest = (): Promise<
  AxiosResponse<HttpResponse<string>>
> => {
  return client().get("/website-img");
};
