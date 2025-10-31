import { client } from "@/requests/client";
import { HttpResponse } from "@/types/types";
import { AxiosResponse } from "axios";
import { BlogResource } from "@/types/blogs";

export const getBlogsRequest = async (): Promise<
  AxiosResponse<HttpResponse<BlogResource[]>>
> => {
  return client().get(`blogs`);
};
