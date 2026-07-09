import axios from "axios";
import { toast } from "sonner";

const baseURL = import.meta.env.VITE_BACKEND_URL;

export const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === "ERR_NETWORK") {
      toast.error("Network Error", {
        description: "Unable to reach the server. Please check your internet.",
      });
    }
    return Promise.reject(error);
  },
);
