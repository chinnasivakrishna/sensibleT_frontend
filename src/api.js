import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: "http://localhost:3001/api",
});

// Add a request interceptor to include the token
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("authToken"); // Get token from cookies
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
