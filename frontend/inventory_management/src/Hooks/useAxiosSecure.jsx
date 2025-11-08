import axios from "axios";

const axiosSecure = axios.create({
  // baseURL: "http://localhost:5001",
  baseURL:'https://inventory-management-nu-sandy-20.vercel.app',
});

axiosSecure.interceptors.request.use(
  (config) => {
    // Try multiple possible token storage locations
    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("accessToken") ||
      sessionStorage.getItem("token") ||
      sessionStorage.getItem("accessToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn("No authentication token found");
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default function useAxiosSecure() {
  return axiosSecure;
}
