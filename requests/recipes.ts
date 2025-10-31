import { client } from "@/requests/client";
import { HttpResponse } from "@/types/types";
import { AxiosResponse } from "axios";
import { RecipeResource } from "@/types/recipes";

export const getRecipesRequest = async (): Promise<
  AxiosResponse<HttpResponse<RecipeResource[]>>
> => {
  return client().get(`recipes`);
};
