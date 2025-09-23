import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { router } from "expo-router";

const api = axios.create({
  baseURL: "https://wolfit-pr-42.onrender.com/api/v1",
  headers: { "Content-Type": "application/json" },
});

let onUnauthorized: (() => void) | null = null;

export function setUnauthorizedHandler(handler: () => void) {
  onUnauthorized = handler;
}

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log("REQUEST HEADERS:", config.headers);
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem("authToken");
      if (onUnauthorized) {
        onUnauthorized();
      } else {
        router.replace("/sign-in");
      }
    }
    return Promise.reject(error);
  }
);

export default api;
