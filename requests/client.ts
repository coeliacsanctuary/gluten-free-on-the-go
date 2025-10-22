import axios from "axios";
import { apiUrl } from "@/constants/Http";

export const client = () => {
  return axios.create({
    baseURL: apiUrl,
    headers: {
      "X-Coeliac-Source": "coeliac-sanctuary-gluten-free-on-the-go",
    },
  });
};
