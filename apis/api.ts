import axios from "axios";
import * as SecureStore from 'expo-secure-store';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? "https://api.flavry.com";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

api.interceptors.request.use(async (config) => {
  try {
    let  token = await SecureStore.getItemAsync("accessToken");

    if (token && config.headers) {
      (config.headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
    }
  } catch (e) {
    console.log(e)
  }
  return config;
});

export default api;
