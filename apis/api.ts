import axios from "axios";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? "https://api.flavry.com";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

// Attach auth token when available
api.interceptors.request.use((config) => {
  return config;
});

export default api;
