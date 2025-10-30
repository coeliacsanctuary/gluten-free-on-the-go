import { AxiosResponse } from "axios";
import { client } from "@/requests/client";
import { HttpResponse, ShopCta } from "@/types/types";

export const getShopCtaRequest = (): Promise<
  AxiosResponse<HttpResponse<ShopCta>>
> => {
  return client().get("/shop-cta");
};
