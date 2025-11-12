import axios from "axios";
import { apiUrl, logRequests } from "@/constants/Http";

export const client = () => {
  const client = axios.create({
    baseURL: apiUrl,
    headers: {
      "X-Coeliac-Source": "coeliac-sanctuary-gluten-free-on-the-go",
    },
  });

  if (logRequests) {
    client.interceptors.request.use((request) => {
      console.log("Starting Request", {
        url: request.url,
        params: request.params,
        data: request.data,
        method: request.method,
      });

      return request;
    });
  }

  return client;
};
